# 🕹️ FliperBox

Rede social de reviews de jogos, inspirada no Letterboxd e no clima dos fliperamas. Feita com **HTML5, CSS3 e JavaScript puro**, sem frameworks e sem backend. Projeto acadêmico de Sistemas para Internet.

🔗 **Site no ar:** https://fliperbox.onrender.com

## Funcionalidades

- **Conta simulada:** cadastro, login e logout com e-mail. Os dados ficam no LocalStorage e a senha é guardada com hash SHA-256.
- **Catálogo:** 26 jogos, entre clássicos de fliperama e títulos modernos, com pôsteres na proporção 2:3 e zoom suave ao passar o mouse.
- **Busca em tempo real:** a barra do cabeçalho filtra os jogos pelo nome enquanto você digita, sem diferenciar acentos nem maiúsculas.
- **Modal de avaliação:** ao clicar no pôster abre uma janela com as informações do jogo, nota de 1 a 5 estrelas e comentário.
- **Atividade (feed):** reviews recentes do usuário e de usuários simulados (Alex_Arcade, RetroQueen e PixelMaster), com abas **Todos** e **Minhas**.
- **Perfil:** Top 4 jogos favoritos e lista das próprias reviews.
- **Listas:** criação de listas personalizadas, exibidas em mosaico com até 4 capas levemente sobrepostas, título e quantidade de jogos. É possível adicionar e remover jogos e excluir a lista.
- **Notícias:** coluna lateral com novidades do mundo dos games (hoje são textos de exemplo).

## Tecnologias

HTML5 · CSS3 · JavaScript (Vanilla) · LocalStorage · GitHub · Render (Static Site) · Jira

## Estrutura do projeto

```
fliperbox/
├── index.html       # catálogo + notícias
├── activity.html    # feed de atividade
├── lists.html       # listas em mosaico
├── profile.html     # perfil, Top 4 e minhas reviews
├── login.html       # cadastro e login
├── css/
│   └── style.css
├── img/             # capas locais (clássicos de fliperama)
└── js/
    ├── data.js      # catálogo, reviews simuladas e notícias
    ├── store.js     # LocalStorage (auth, reviews, favoritos, listas)
    ├── ui.js        # cabeçalho, pôsteres, feed e mosaico
    └── index.js · activity.js · lists.js · profile.js · login.js
```

## Identidade visual (Vintage Arcade)

| Uso | Cor |
|---|---|
| Fundo principal | `#1E1B2E` |
| Containers e cards | `#2A2640` |
| Destaque e botões | `#FFD166` |
| Estrelas e badges | `#EF476F` |
| Hover e detalhes | `#06D6A0` |
| Texto principal | `#F8F9FA` |

Títulos e logo usam a fonte *Press Start 2P* (Google Fonts). Sem internet, o navegador usa uma fonte monoespaçada no lugar.

## Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/fliperbox.git
   ```
2. Abra a pasta no VS Code e use a extensão **Live Server** em `index.html`, ou rode:
   ```bash
   python -m http.server 8000
   ```
   e acesse http://localhost:8000.

> Use sempre um servidor local. O login usa `crypto.subtle`, que não funciona abrindo o arquivo direto (`file://`).

## Dados e LocalStorage

| Chave | Conteúdo |
|---|---|
| `gb_users` | usuários cadastrados (e-mail + hash da senha) |
| `gb_session` | usuário logado |
| `gb_reviews` | reviews de todos os usuários (reais e simulados) |
| `gb_fav_<email>` | Top 4 do usuário |
| `gb_lists` | listas de jogos |
| `gb_seeded_v2` | indica que as reviews simuladas já foram criadas |

Para recomeçar do zero: F12 → Application → Local Storage → Clear.

## Capas dos jogos

A maioria das capas vem da CDN pública da Steam. Jogos que não estão na Steam usam imagens locais em `img/` (proporção 2:3):
`street-fighter-2.jpg`, `pac-man.jpg`, `space-invaders.jpg`, `donkey-kong.jpg` e `mario-odyssey.jpg`.
Se uma imagem não carregar, o card mostra o título do jogo no lugar.

## Fluxo de trabalho (Git)

- `main`: sempre estável. Cada push ou merge nela dispara o deploy automático no Render.
- Novas funcionalidades: `feature/FLB-<número>-<nome>` → Pull Request → merge na `main`.
- Cada tarefa tem um card no Jira, citado nos commits e no Pull Request.

## Deploy (Render – Static Site)

1. No Render: **New +** → **Static Site** e conecte o repositório do GitHub.
2. Configure: Branch `main` · Build Command vazio · Publish Directory `.`
3. Deixe o **Auto-Deploy** ativado (*On Commit*).
4. Para validar: faça uma alteração, dê push na `main` e acompanhe o deploy na aba **Events**.

## Histórico de versões

| Versão | Novidades |
|---|---|
| **v3 – FliperBox** | Novo nome e paleta Vintage Arcade; cabeçalho com busca, links e perfil do usuário; feed com usuários simulados e abas Todos/Minhas; catálogo com clássicos e modernos; login por e-mail |
| **v2** | Pôsteres 2:3 com modal de avaliação; página Atividade; notícias; listas em mosaico |
| **v1 – MVP** | Cadastro/login simulados, reviews, Top 4, catálogo e listas |

## Limitações conhecidas

- Os dados ficam só no navegador de cada pessoa (LocalStorage), então não são compartilhados entre dispositivos.
- A autenticação é simulada e não é segura. Não use senhas reais.
- Os usuários do feed (Alex_Arcade, RetroQueen e PixelMaster) e as notícias são fictícios.

## Créditos

Capas: CDN pública da Steam e imagens locais em `img/`, usadas apenas para fins acadêmicos. Cite aqui a origem de cada capa que você adicionar.

## Autoria

Ana Gabrielli – Sistemas para Internet, Unicap
