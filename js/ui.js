function esc(text) { // escapa HTML e aspas (seguro também dentro de atributos)
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const nameOf = (user) => user.split("@")[0]; // mostramos só a parte antes do @
const byDate = (a, b) => new Date(b.date) - new Date(a.date);
const openComments = new Set(); // reviews com a área de comentários aberta

// Avatar: emoji pré-definido ou imagem por URL
function avatarInner(user) {
  const a = Profiles.get(user).avatar || "🕹️";
  return /^https?:\/\//.test(a)
    ? `<img src="${esc(a)}" alt="" onerror="this.replaceWith(document.createTextNode('🕹️'))">`
    : `<span>${esc(a)}</span>`;
}

// Pôster 2:3; se a imagem falhar, mostra um bloco com o título
function poster(game) {
  return `<img class="poster" src="${game.cover}" alt="Pôster de ${esc(game.title)}" data-title="${esc(game.title)}" loading="lazy" onerror="posterFallback(this)">`;
}
function posterFallback(img) {
  const d = document.createElement("div");
  d.className = "poster fallback";
  d.textContent = img.dataset.title;
  img.replaceWith(d);
}

// Mosaico de até 4 capas levemente sobrepostas (a primeira fica na frente)
function mosaic(gameIds) {
  const games = gameIds.map(gameById).filter(Boolean).slice(0, 4);
  if (!games.length) return '<div class="mosaic"><div class="slot-empty mini">vazia</div></div>';
  return `<div class="mosaic">${games.map((g, i) => `<span style="z-index:${4 - i}">${poster(g)}</span>`).join("")}</div>`;
}

function renderNav() {
  const user = Auth.current();
  const page = location.pathname.split("/").pop() || "index.html";
  const link = (href, label) => `<a href="${href}" class="${page === href ? "active" : ""}">${label}</a>`;

  document.getElementById("nav").innerHTML = `
    <div class="topbar">
      <a class="logo" href="index.html">🕹️ FliperBox</a>
      <form class="search" id="search-form" role="search">
        <input id="search" type="search" placeholder="Buscar jogo..." aria-label="Buscar jogo" autocomplete="off">
      </form>
      <div class="right">
        <nav>
          ${link("index.html", "Jogos")}${link("activity.html", "Atividade")}${link("lists.html", "Listas")}${link("profile.html", "Perfil")}
        </nav>
        ${user
          ? `<span class="me"><span class="avatar">${avatarInner(user)}</span><span class="email" title="${esc(user)}">${esc(user)}</span></span>
             <button class="ghost" id="logout">Sair</button>`
          : `<a class="btn" href="login.html">Entrar</a>`}
      </div>
    </div>`;

  // Busca: preenchida pela URL (?q=) e, fora do catálogo, leva até ele ao apertar Enter
  const input = document.getElementById("search");
  input.value = new URLSearchParams(location.search).get("q") || "";
  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (page !== "index.html") location.href = "index.html?q=" + encodeURIComponent(input.value.trim());
  });

  const out = document.getElementById("logout");
  if (out) out.addEventListener("click", () => { Auth.logout(); location.href = "index.html"; });
}

// Card de review (feed, perfil e página de outros usuários) com curtir e comentar
function feedItem(r, canDelete) {
  const me = Auth.current();
  const likes = r.likes || [];
  const comments = r.comments || [];
  const liked = !!me && likes.includes(me);
  const author = MOCK_PROFILES[r.user]
    ? `<a href="user.html?u=${encodeURIComponent(r.user)}">${esc(nameOf(r.user))}</a>`
    : esc(nameOf(r.user));

  return `<article class="feed-item">
    ${poster({ title: r.title, cover: r.cover })}
    <div class="grow">
      <h3>${esc(r.title)}</h3>
      <p class="who"><span class="avatar sm">${avatarInner(r.user)}</span> ${author}
        ${canDelete ? '<span class="badge">você</span>' : ""} · ${new Date(r.date).toLocaleDateString("pt-BR")}</p>
      <p class="stars" aria-label="${r.stars} de 5 estrelas">${stars(r.stars)}</p>
      ${r.text ? `<p class="text">${esc(r.text)}</p>` : ""}
      <div class="actions">
        <button class="act ${liked ? "on" : ""}" data-like="${r.id}" aria-pressed="${liked}" aria-label="Curtir">${liked ? "❤️" : "🤍"} ${likes.length}</button>
        <button class="act" data-ctoggle="${r.id}" aria-label="Comentários">💬 ${comments.length}</button>
        ${canDelete ? `<button class="link-danger" data-del="${r.id}">Excluir</button>` : ""}
      </div>
      ${openComments.has(r.id) ? `
        <div class="comments">
          ${comments.map((c) => `<p><strong>${esc(nameOf(c.user))}</strong> ${esc(c.text)}</p>`).join("") || '<p class="muted">Seja a primeira pessoa a comentar.</p>'}
          <form class="comment-form" data-cform="${r.id}">
            <input name="t" maxlength="200" required placeholder="Escreva um comentário..." aria-label="Comentário">
            <button>Enviar</button>
          </form>
        </div>` : ""}
    </div>
  </article>`;
}

function renderNews(el) {
  el.innerHTML = NEWS.map((n) => `
    <article class="news-card">
      <span class="badge">${esc(n.tag)}</span>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.text)}</p>
    </article>`).join("");
}

// Cabeçalho de perfil (profile.html e user.html): avatar, nome, bio e contadores
function statsHead(user, viewer, reviewCount) {
  const c = Follows.counts(user, viewer);
  return `<div class="avatar big">${avatarInner(user)}</div>
    <div>
      <h1>${esc(nameOf(user))}</h1>
      <p class="muted">${esc(Profiles.get(user).bio || "")}</p>
      <ul class="counters">
        <li><strong>${reviewCount}</strong> reviews</li>
        <li><strong>${c.followers}</strong> seguidores</li>
        <li><strong>${c.following}</strong> seguindo</li>
      </ul>
    </div>`;
}

// Curtir, comentar e excluir: funciona em qualquer lista de reviews
function bindSocial(container, refresh) {
  container.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const d = b.dataset;
    const me = Auth.current();
    if (d.like) {
      if (!me) { location.href = "login.html"; return; }
      Reviews.like(Number(d.like), me);
    } else if (d.ctoggle) {
      const id = Number(d.ctoggle);
      openComments.has(id) ? openComments.delete(id) : openComments.add(id);
    } else if (d.del) {
      Reviews.remove(Number(d.del), me);
    } else return;
    refresh();
  });
  container.addEventListener("submit", (e) => {
    const id = Number(e.target.dataset.cform);
    if (!id) return;
    e.preventDefault();
    const me = Auth.current();
    if (!me) { location.href = "login.html"; return; }
    const text = e.target.elements.t.value.trim();
    if (text) Reviews.comment(id, me, text);
    refresh();
  });
}

renderNav();