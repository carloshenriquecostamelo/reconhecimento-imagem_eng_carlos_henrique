# Licenças das dependências

Atividade prática: análise das licenças de três dependências usadas neste repositório.

| Dependência | Onde é usada | Licença | Permite uso comercial? | Obriga abrir o derivado? |
|---|---|---|---|---|
| **TensorFlow.js** (`@tensorflow/tfjs`) | `index.html` (reconhecimento de imagem) | Apache License 2.0 | Sim | Não — permissiva; exige manter o aviso de copyright, a cópia da licença e indicar arquivos modificados |
| **pygame** 2.5.2 | `jogo-atari/` | GNU LGPL 2.1 | Sim | Só em parte — o código do jogo pode ser fechado se apenas *usar* a biblioteca; se a própria pygame for modificada e distribuída, essas modificações precisam ser abertas sob LGPL |
| **Tailwind CSS** (`tailwindcss`) | `todo-app/index.html` | MIT | Sim | Não — permissiva; exige apenas manter o aviso de copyright e a licença |

## Licença deste projeto

O repositório está licenciado sob a **MIT License** (veja o arquivo [`LICENSE`](LICENSE)).
A MIT é compatível com as três dependências acima: Apache 2.0 e MIT são permissivas, e a
LGPL 2.1 permite que um projeto sob outra licença use a pygame como biblioteca sem
precisar adotar a LGPL.

## Fontes

- TensorFlow.js — https://github.com/tensorflow/tfjs/blob/master/LICENSE
- pygame — https://github.com/pygame/pygame/blob/main/docs/LGPL.txt
- Tailwind CSS — https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE
