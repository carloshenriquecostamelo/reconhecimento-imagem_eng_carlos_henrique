// ════════════════════════════════════════════════════════════════
//  TaskFlow — app.js
//  Stack: HTML + Tailwind CDN + Vanilla JS + localStorage
// ════════════════════════════════════════════════════════════════

// ─── Chaves do localStorage ──────────────────────────────────────────────────
const DB_KEY      = 'taskflow_db';
const SESSION_KEY = 'currentUser';

// ─── Estado global ────────────────────────────────────────────────────────────
let db          = loadDB();
let currentUser = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
let activeFilter = 'all';

// ════════════════════════════════════════════════════════════════
//  CAMADA DE DADOS  (simula db.json)
// ════════════════════════════════════════════════════════════════

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { users: [], todos: [] };
}

function saveDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ════════════════════════════════════════════════════════════════
//  NAVEGAÇÃO
// ════════════════════════════════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.animation = 'none';
  });
  const el = document.getElementById(id);
  el.classList.add('active');
  // Re-trigger animação CSS
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

// ════════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════════

function login(email, password) {
  clearError('login-error');

  if (!email.trim() || !password.trim()) {
    showError('login-error', 'Preencha e-mail e senha.');
    return;
  }

  const user = db.users.find(u => u.email === email.trim().toLowerCase());

  if (!user) {
    showError('login-error', 'E-mail não encontrado. Crie uma conta primeiro.');
    return;
  }

  if (user.password !== password) {
    showError('login-error', 'Senha incorreta. Tente novamente.');
    return;
  }

  currentUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  openDashboard();
}

function register(name, email, password) {
  clearError('register-error');
  clearError('register-success');

  if (!name.trim() || !email.trim() || !password.trim()) {
    showError('register-error', 'Preencha todos os campos.');
    return;
  }

  if (password.length < 6) {
    showError('register-error', 'A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  const emailNorm = email.trim().toLowerCase();

  if (db.users.find(u => u.email === emailNorm)) {
    showError('register-error', 'Este e-mail já está cadastrado.');
    return;
  }

  const newUser = {
    id: generateId(),
    name: name.trim(),
    email: emailNorm,
    password,
  };

  db.users.push(newUser);
  saveDB();

  showSuccess('register-success', 'Conta criada com sucesso! Redirecionando…');
  document.getElementById('form-register').reset();

  setTimeout(() => {
    clearError('register-success');
    showScreen('screen-login');
  }, 1800);
}

function logout() {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  activeFilter = 'all';
  document.getElementById('form-login').reset();
  showScreen('screen-login');
}

// ════════════════════════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════════════════════════

function openDashboard() {
  document.getElementById('user-greeting').textContent = `Olá, ${currentUser.name}`;
  activeFilter = 'all';
  syncFilterButtons();
  renderTodos();
  showScreen('screen-app');
}

// ════════════════════════════════════════════════════════════════
//  CRUD — TODOS
// ════════════════════════════════════════════════════════════════

function getUserTodos() {
  return db.todos.filter(t => t.userId === currentUser.email);
}

function addTodo(title, type, description) {
  clearError('todo-error');

  if (!title.trim()) {
    showError('todo-error', 'O título da tarefa é obrigatório.');
    return false;
  }

  const todo = {
    id: generateId(),
    userId: currentUser.email,
    title: title.trim(),
    type,
    description: description.trim(),
    done: false,
    createdAt: Date.now(),
  };

  db.todos.push(todo);
  saveDB();
  renderTodos();
  return true;
}

function completeTodo(id) {
  const todo = db.todos.find(t => t.id === id);
  if (todo && !todo.done) {
    todo.done = true;
    saveDB();
    renderTodos();
  }
}

// ════════════════════════════════════════════════════════════════
//  RENDERIZAÇÃO
// ════════════════════════════════════════════════════════════════

const TYPE_BADGE = {
  Trabalho: 'badge-type badge-trabalho',
  Pessoal:  'badge-type badge-pessoal',
  Estudos:  'badge-type badge-estudos',
};

const TYPE_EMOJI = {
  Trabalho: '💼',
  Pessoal:  '🏠',
  Estudos:  '📚',
};

function renderTodos() {
  const list       = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const badge      = document.getElementById('tasks-badge');

  const all     = getUserTodos();
  const pending = all.filter(t => !t.done).length;

  // Badge contador
  if (all.length > 0) {
    badge.textContent = `${pending} pendente${pending !== 1 ? 's' : ''}`;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  // Filtrar por tipo ou status
  let filtered = all;
  if (activeFilter !== 'all') {
    filtered = all.filter(t => t.type === activeFilter);
  }

  // Ordenar: pendentes primeiro, concluídas no final
  filtered.sort((a, b) => {
    if (a.done === b.done) return b.createdAt - a.createdAt;
    return a.done ? 1 : -1;
  });

  list.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-card${todo.done ? ' done' : ''}`;
    li.dataset.id = todo.id;

    const descHtml = todo.description
      ? `<p class="todo-desc">${escapeHtml(todo.description)}</p>`
      : '';

    const doneBtn = todo.done
      ? `<button class="btn-done completed" disabled aria-label="Tarefa concluída">
           <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
           </svg>
           Concluída
         </button>`
      : `<button class="btn-done" data-id="${todo.id}" aria-label="Marcar como concluída">
           <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <circle cx="12" cy="12" r="10" stroke-width="2"/>
           </svg>
           Concluir
         </button>`;

    li.innerHTML = `
      <div class="todo-body">
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <span class="${TYPE_BADGE[todo.type] || 'badge-type badge-trabalho'}">
            ${TYPE_EMOJI[todo.type] || ''} ${escapeHtml(todo.type)}
          </span>
        </div>
        <p class="todo-title">${escapeHtml(todo.title)}</p>
        ${descHtml}
      </div>
      <div class="flex-shrink-0 mt-0.5">
        ${doneBtn}
      </div>
    `;

    list.appendChild(li);
  });

  // Delegação de eventos nos botões de concluir
  list.querySelectorAll('.btn-done[data-id]').forEach(btn => {
    btn.addEventListener('click', () => completeTodo(btn.dataset.id));
  });
}

// ════════════════════════════════════════════════════════════════
//  FILTROS
// ════════════════════════════════════════════════════════════════

function setFilter(filter) {
  activeFilter = filter;
  syncFilterButtons();
  renderTodos();
}

function syncFilterButtons() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === activeFilter);
  });
}

// ════════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════════

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function showSuccess(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ════════════════════════════════════════════════════════════════
//  EVENT LISTENERS
// ════════════════════════════════════════════════════════════════

// — Login
document.getElementById('form-login').addEventListener('submit', e => {
  e.preventDefault();
  login(
    document.getElementById('login-email').value,
    document.getElementById('login-password').value,
  );
});

// — Ir para cadastro
document.getElementById('go-register').addEventListener('click', () => {
  clearError('login-error');
  document.getElementById('form-login').reset();
  showScreen('screen-register');
});

// — Cadastro
document.getElementById('form-register').addEventListener('submit', e => {
  e.preventDefault();
  register(
    document.getElementById('reg-name').value,
    document.getElementById('reg-email').value,
    document.getElementById('reg-password').value,
  );
});

// — Ir para login
document.getElementById('go-login').addEventListener('click', () => {
  clearError('register-error');
  clearError('register-success');
  document.getElementById('form-register').reset();
  showScreen('screen-login');
});

// — Logout
document.getElementById('btn-logout').addEventListener('click', logout);

// — Adicionar tarefa
document.getElementById('form-todo').addEventListener('submit', e => {
  e.preventDefault();
  const ok = addTodo(
    document.getElementById('todo-title').value,
    document.getElementById('todo-type').value,
    document.getElementById('todo-desc').value,
  );
  if (ok) {
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-desc').value  = '';
    document.getElementById('todo-title').focus();
  }
});

// — Filtros
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// ════════════════════════════════════════════════════════════════
//  BOOT
// ════════════════════════════════════════════════════════════════

if (currentUser) {
  openDashboard();
} else {
  showScreen('screen-login');
}
