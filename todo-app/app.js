// ─── DB simulado via localStorage ───────────────────────────────────────────
const DB_KEY = 'taskflow_db';

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  return { users: [], todos: [] };
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ─── Estado global ────────────────────────────────────────────────────────────
let db = loadDB();
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let activeFilter = 'all';

// ─── Utilitários ──────────────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function showError(elementId, msg) {
  const el = document.getElementById(elementId);
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideError(elementId) {
  document.getElementById(elementId).classList.add('hidden');
}

function showSuccess(elementId, msg) {
  const el = document.getElementById(elementId);
  el.textContent = msg;
  el.classList.remove('hidden');
}

// ─── Navegação entre telas ────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');
  // Re-trigger animation
  target.classList.remove('fade');
  void target.offsetWidth;
  target.classList.add('fade');
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function login(email, password) {
  if (!email.trim() || !password.trim()) {
    showError('login-error', 'Preencha e-mail e senha.');
    return;
  }
  const user = db.users.find(u => u.email === email.trim().toLowerCase());
  if (!user) {
    showError('login-error', 'E-mail não cadastrado.');
    return;
  }
  if (user.password !== password) {
    showError('login-error', 'Senha incorreta.');
    return;
  }
  currentUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  hideError('login-error');
  openApp();
}

function register(name, email, password) {
  hideError('register-error');
  hideError('register-success');

  if (!name.trim() || !email.trim() || !password.trim()) {
    showError('register-error', 'Preencha todos os campos.');
    return;
  }
  if (password.length < 6) {
    showError('register-error', 'A senha deve ter ao menos 6 caracteres.');
    return;
  }
  const emailNorm = email.trim().toLowerCase();
  if (db.users.find(u => u.email === emailNorm)) {
    showError('register-error', 'Este e-mail já está cadastrado.');
    return;
  }

  const newUser = { id: uid(), name: name.trim(), email: emailNorm, password };
  db.users.push(newUser);
  saveDB(db);

  showSuccess('register-success', 'Conta criada! Redirecionando para o login…');
  document.getElementById('form-register').reset();

  setTimeout(() => {
    hideError('register-success');
    showScreen('screen-login');
  }, 1800);
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  activeFilter = 'all';
  showScreen('screen-login');
}

// ─── App principal ────────────────────────────────────────────────────────────
function openApp() {
  document.getElementById('user-name').textContent = currentUser.name;
  activeFilter = 'all';
  setFilter('all');
  renderTodos();
  showScreen('screen-app');
}

// ─── CRUD Todos ───────────────────────────────────────────────────────────────
function getUserTodos() {
  return db.todos.filter(t => t.userId === currentUser.id);
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  db.todos.push({ id: uid(), userId: currentUser.id, text: trimmed, completed: false, createdAt: Date.now() });
  saveDB(db);
  renderTodos();
}

function toggleTodo(id) {
  const todo = db.todos.find(t => t.id === id);
  if (todo) { todo.completed = !todo.completed; saveDB(db); renderTodos(); }
}

function deleteTodo(id) {
  db.todos = db.todos.filter(t => t.id !== id);
  saveDB(db);
  renderTodos();
}

function clearCompleted() {
  db.todos = db.todos.filter(t => !(t.userId === currentUser.id && t.completed));
  saveDB(db);
  renderTodos();
}

// ─── Renderização ─────────────────────────────────────────────────────────────
function renderTodos() {
  const list = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const badge = document.getElementById('stats-badge');

  const all = getUserTodos();
  const pending = all.filter(t => !t.completed).length;
  badge.textContent = `${pending} pendente${pending !== 1 ? 's' : ''}`;

  let filtered = all;
  if (activeFilter === 'active') filtered = all.filter(t => !t.completed);
  if (activeFilter === 'completed') filtered = all.filter(t => t.completed);

  list.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-row rounded-xl px-4 py-3 flex items-center gap-3 group${todo.completed ? ' done' : ''}`;

    // Checkbox
    const checkBtn = document.createElement('button');
    checkBtn.className = `flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
      ${todo.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600 hover:border-indigo-500'}`;
    checkBtn.setAttribute('aria-label', todo.completed ? 'Marcar como pendente' : 'Marcar como concluída');
    if (todo.completed) {
      checkBtn.innerHTML = `<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
      </svg>`;
    }
    checkBtn.addEventListener('click', () => toggleTodo(todo.id));

    // Text
    const span = document.createElement('span');
    span.className = 'todo-text flex-1 text-sm text-slate-200';
    span.textContent = todo.text;

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400 p-1 rounded';
    delBtn.setAttribute('aria-label', 'Remover tarefa');
    delBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>`;
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkBtn);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// ─── Filtros ──────────────────────────────────────────────────────────────────
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTodos();
}

// ─── Event Listeners ─────────────────────────────────────────────────────────
document.getElementById('form-login').addEventListener('submit', e => {
  e.preventDefault();
  login(
    document.getElementById('login-email').value,
    document.getElementById('login-password').value
  );
});

document.getElementById('form-register').addEventListener('submit', e => {
  e.preventDefault();
  register(
    document.getElementById('reg-name').value,
    document.getElementById('reg-email').value,
    document.getElementById('reg-password').value
  );
});

document.getElementById('go-register').addEventListener('click', () => {
  hideError('login-error');
  document.getElementById('form-login').reset();
  showScreen('screen-register');
});

document.getElementById('go-login').addEventListener('click', () => {
  hideError('register-error');
  hideError('register-success');
  document.getElementById('form-register').reset();
  showScreen('screen-login');
});

document.getElementById('btn-logout').addEventListener('click', logout);

document.getElementById('btn-add-todo').addEventListener('click', () => {
  const input = document.getElementById('todo-input');
  addTodo(input.value);
  input.value = '';
  input.focus();
});

document.getElementById('todo-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addTodo(e.target.value);
    e.target.value = '';
  }
});

document.getElementById('btn-clear-completed').addEventListener('click', clearCompleted);

document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
if (currentUser) {
  openApp();
} else {
  showScreen('screen-login');
}
