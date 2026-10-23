function esc(text) {
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const nameOf = (user) => user.split("@")[0];

function poster(game) {
  return `<img class="poster" src="${game.cover}" alt="Pôster de ${esc(game.title)}" data-title="${esc(game.title)}" loading="lazy" onerror="posterFallback(this)">`;
}
function posterFallback(img) {
  const d = document.createElement("div");
  d.className = "poster fallback";
  d.textContent = img.dataset.title;
  img.replaceWith(d);
}

function mosaic(gameIds) {
  const games = gameIds.map(gameById).filter(Boolean).slice(0, 4);
  if (!games.length) return '<div class="mosaic"><div class="slot-empty mini">vazia</div></div>';
  return `<div class="mosaic">${games.map((g, i) => `<span style="z-index:${4 - i}">${poster(g)}</span>`).join("")}</div>`;
}

const AVATAR = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6z"/></svg>';

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
          ? `<span class="me"><span class="avatar">${AVATAR}</span><span class="email" title="${esc(user)}">${esc(user)}</span></span>
            <button class="ghost" id="logout">Sair</button>`
          : `<a class="btn" href="login.html">Entrar</a>`}
      </div>
    </div>`;

  const input = document.getElementById("search");
  input.value = new URLSearchParams(location.search).get("q") || "";
  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (page !== "index.html") location.href = "index.html?q=" + encodeURIComponent(input.value.trim());
  });

  const out = document.getElementById("logout");
  if (out) out.addEventListener("click", () => { Auth.logout(); location.href = "index.html"; });
}

function feedItem(r, canDelete) {
  return `<article class="feed-item">
    ${poster({ title: r.title, cover: r.cover })}
    <div>
      <h3>${esc(r.title)}</h3>
      <p class="who">${esc(nameOf(r.user))} ${canDelete ? '<span class="badge">você</span>' : ""} · ${new Date(r.date).toLocaleDateString("pt-BR")}</p>
      <p class="stars" aria-label="${r.stars} de 5 estrelas">${stars(r.stars)}</p>
      ${r.text ? `<p class="text">${esc(r.text)}</p>` : ""}
      ${canDelete ? `<button class="link-danger" data-del="${r.id}">Excluir</button>` : ""}
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

renderNav();