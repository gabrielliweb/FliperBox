const user = Auth.current();
if (!user) location.href = "login.html";

const PRESETS = ["🕹️", "👾", "👑", "🎮", "🐉", "🚀", "👻", "🍄"];
const TABS = [
  ["profile", "Profile"], ["activity", "Activity"], ["games", "Games"], ["diary", "Diary"],
  ["reviews", "Reviews"], ["watchlist", "Watchlist"], ["lists", "Lists"], ["likes", "Likes"]
];
const panel = document.getElementById("panel");
const editDlg = document.getElementById("edit-dlg");
const eMsg = document.getElementById("e-msg");
let tab = "profile";
let pickerOpen = false;
let pendingAvatar = null; 

const mine = () => Reviews.all().filter((r) => r.user === user).sort(byDate);
const uniqueGames = (list) => new Set(list.map((r) => r.gameId)).size;
const cover = (r) => poster({ title: r.title, cover: r.cover });
const empty = (text) => `<p class="empty">${text}</p>`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function renderHead() {
  const list = mine();
  const p = Profiles.get(user);
  const year = new Date().getFullYear();
  const thisYear = uniqueGames(list.filter((r) => new Date(r.date).getFullYear() === year));
  const c = Follows.counts(user, user);

  document.getElementById("head").innerHTML = `
    <div class="avatar-wrap">
      <div class="avatar huge">${avatarInner(user)}</div>
      <button class="avatar-edit" data-edit aria-label="Editar foto de perfil">✎</button>
    </div>
    <div class="p-info">
      <h1>${esc(nameOf(user))} <button class="ghost small" data-edit>EDIT PROFILE</button></h1>
      <p class="bio">${esc(p.bio || "Clique em EDIT PROFILE para adicionar uma bio.")}</p>
      ${p.location ? `<p class="muted">📍 ${esc(p.location)}</p>` : ""}
    </div>
    <ul class="p-counters">
      <li><strong>${uniqueGames(list)}</strong><span>GAMES</span></li>
      <li><strong>${thisYear}</strong><span>THIS YEAR</span></li>
      <li><strong>${c.following}</strong><span>FOLLOWING</span></li>
      <li><strong>${c.followers}</strong><span>FOLLOWERS</span></li>
    </ul>`;
}

function renderTabs() {
  document.getElementById("subtabs").innerHTML = TABS
    .map(([key, label]) => `<button class="${key === tab ? "active" : ""}" data-tab="${key}">${label}</button>`).join("");
}

function panelProfile() {
  const list = mine();
  const favs = Favorites.get(user);

  let top = "";
  for (let i = 0; i < 4; i++) {
    const g = gameById(favs[i]);
    top += g ? `<div title="${esc(g.title)}">${poster(g)}</div>` : `<div class="slot-empty">${i + 1}</div>`;
  }

  const counts = [1, 2, 3, 4, 5].map((n) => list.filter((r) => r.stars === n).length);
  const max = Math.max(...counts, 1);
  const avg = list.length ? (list.reduce((s, r) => s + r.stars, 0) / list.length).toFixed(1) : "–";

  return `
    <h2 class="section-title">FAVORITE GAMES</h2>
    <div class="posters four">${top}</div>
    <details id="fav-details" ${pickerOpen ? "open" : ""}>
      <summary>Editar favoritos</summary>
      <div class="posters small">
        ${GAMES.map((g) => `<button class="poster-btn ${favs.includes(g.id) ? "selected" : ""}" data-fav="${g.id}" title="${esc(g.title)}">${poster(g)}</button>`).join("")}
      </div>
    </details>

    <h2 class="section-title">RATINGS</h2>
    <div class="ratings">
      <div class="ratings-head">
        <span>${plural(list.length, "avaliação", "avaliações")}</span>
        <span class="avg"><strong>${avg}</strong>média ★</span>
      </div>
      <div class="hist" role="img" aria-label="Quantidade de avaliações por nota, de 1 a 5 estrelas">
        ${counts.map((c, i) => `
          <div class="bar" title="${plural(c, "avaliação", "avaliações")} com ${i + 1}★">
            <span>${c}</span>
            <div class="col"><i style="height:${(c / max) * 100}%"></i></div>
            <small>${i + 1}★</small>
          </div>`).join("")}
      </div>
    </div>

    <h2 class="section-title">RECENT ACTIVITY</h2>
    ${list.length
      ? `<div class="recent">${list.slice(0, 8).map((r) => `
          <div class="mini" title="${esc(r.title)} · ${r.stars}★">${cover(r)}<span class="st">${stars(r.stars)}</span></div>`).join("")}</div>`
      : empty("Você ainda não avaliou jogos. Clique na capa de um jogo no catálogo.")}`;
}

function panelActivity() {
  const list = mine();
  return `<h2 class="section-title">ACTIVITY</h2>` +
    (list.length ? list.map((r) => feedItem(r, true)).join("") : empty("Nenhuma atividade ainda."));
}

function panelGames() {
  const seen = new Set();
  const list = mine().filter((r) => !seen.has(r.gameId) && seen.add(r.gameId));
  return `<h2 class="section-title">GAMES</h2>` + (list.length
    ? `<div class="posters">${list.map((r) => `<div title="${esc(r.title)}">${cover(r)}<span class="st">${stars(r.stars)}</span></div>`).join("")}</div>`
    : empty("Os jogos que você avaliar aparecem aqui."));
}

function panelDiary() {
  const list = mine();
  return `<h2 class="section-title">DIARY</h2>` + (list.length
    ? `<div class="table-wrap"><table class="diary">
        <thead><tr><th>MONTH</th><th>DAY</th><th>GAME</th><th>RATING</th></tr></thead>
        <tbody>${list.map((r) => {
          const d = new Date(r.date);
          return `<tr>
            <td>${d.toLocaleDateString("pt-BR", { month: "short" })}</td>
            <td>${d.getDate()}</td>
            <td><div class="d-game">${cover(r)}<span>${esc(r.title)}</span></div></td>
            <td><span class="st">${stars(r.stars)}</span></td>
          </tr>`;
        }).join("")}</tbody></table></div>`
    : empty("Seu diário está vazio."));
}

function panelReviews() {
  const list = mine().filter((r) => r.text);
  return `<h2 class="section-title">REVIEWS</h2>` +
    (list.length ? list.map((r) => feedItem(r, true)).join("") : empty("Você ainda não escreveu nenhum comentário."));
}

function panelWatchlist() {
  const ids = Watchlist.get(user);
  return `<h2 class="section-title">WATCHLIST</h2>` + (ids.length
    ? `<p class="muted">Clique em uma capa para remover da watchlist.</p>
    <div class="posters">${ids.map(gameById).filter(Boolean).map((g) =>
    `<button class="poster-btn" data-unwatch="${g.id}" title="Remover ${esc(g.title)}">${poster(g)}</button>`).join("")}</div>`
    : empty('Sua watchlist está vazia. Abra um jogo no catálogo e clique em "+ Watchlist".'));
}

function panelLists() {
  const lists = Lists.mine(user);
  return `<h2 class="section-title">LISTS</h2>` + (lists.length
    ? `<div class="lists-grid">${lists.map((l) => `
        <article class="list-card">${mosaic(l.games)}<h3>${esc(l.name)}</h3><p class="muted">${plural(l.games.length, "jogo", "jogos")}</p></article>`).join("")}</div>`
    : empty("Você ainda não criou listas.")) +
    '<p><a href="lists.html">Gerenciar listas</a></p>';
}

function panelLikes() {
  const list = Reviews.all().filter((r) => (r.likes || []).includes(user)).sort(byDate);
  return `<h2 class="section-title">LIKES</h2>` +
    (list.length ? list.map((r) => feedItem(r, r.user === user)).join("") : empty("Curta reviews no feed e elas aparecem aqui."));
}

const PANELS = {
  profile: panelProfile, activity: panelActivity, games: panelGames, diary: panelDiary,
  reviews: panelReviews, watchlist: panelWatchlist, lists: panelLists, likes: panelLikes
};

function renderSide() {
  const ids = Watchlist.get(user).map(gameById).filter(Boolean);
  document.getElementById("side").innerHTML = `
    <h2 class="section-title">WATCHLIST <span class="count">${ids.length}</span></h2>
    ${ids.length
      ? `<div class="side-grid">${ids.slice(0, 6).map((g) => `<span title="${esc(g.title)}">${poster(g)}</span>`).join("")}</div>
        ${ids.length > 6 ? '<button class="link-danger" data-tab="watchlist">ver todas</button>' : ""}`
      : empty('Vazia. Use "+ Watchlist" no modal de um jogo.')}`;
}

function renderAll() {
  renderHead();
  renderTabs();
  panel.innerHTML = PANELS[tab]();
  renderSide();
}

document.querySelector("main").addEventListener("click", (e) => {
  const t = e.target.closest("[data-tab]");
  if (!t) return;
  tab = t.dataset.tab;
  renderAll();
});

panel.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    pickerOpen = true;
    if (!Favorites.toggle(user, Number(fav.dataset.fav))) alert("Seu Top 4 já está cheio. Remova um jogo antes.");
    renderAll();
    return;
  }
  const un = e.target.closest("[data-unwatch]");
  if (un) { Watchlist.toggle(user, Number(un.dataset.unwatch)); renderAll(); }
});
panel.addEventListener("toggle", (e) => {
  if (e.target.id === "fav-details") pickerOpen = e.target.open;
}, true);

bindSocial(panel, renderAll); 

function paintPresets() {
  document.getElementById("presets").innerHTML = PRESETS
    .map((a) => `<button type="button" class="ghost ${a === (pendingAvatar || Profiles.get(user).avatar) ? "selected" : ""}" data-av="${a}" aria-label="Usar avatar ${a}">${a}</button>`).join("");
}

function openEdit() {
  const p = Profiles.get(user);
  pendingAvatar = null;
  document.getElementById("e-bio").value = p.bio || "";
  document.getElementById("e-loc").value = p.location || "";
  document.getElementById("e-url").value = /^https?:\/\//.test(p.avatar || "") ? p.avatar : "";
  eMsg.textContent = "";
  paintPresets();
  editDlg.showModal();
}

document.getElementById("head").addEventListener("click", (e) => {
  if (e.target.closest("[data-edit]")) openEdit();
});
document.getElementById("presets").addEventListener("click", (e) => {
  if (!e.target.dataset.av) return;
  pendingAvatar = e.target.dataset.av;
  document.getElementById("e-url").value = "";
  paintPresets();
});
document.getElementById("edit-close").addEventListener("click", () => editDlg.close());
editDlg.addEventListener("click", (e) => { if (e.target === editDlg) editDlg.close(); });

document.getElementById("edit-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const url = document.getElementById("e-url").value.trim();
  if (url && !/^https?:\/\/.+/.test(url)) { eMsg.textContent = "A URL deve começar com http:// ou https://"; return; }
  const data = {
    bio: document.getElementById("e-bio").value.trim(),
    location: document.getElementById("e-loc").value.trim()
  };
  if (url) data.avatar = url;
  else if (pendingAvatar) data.avatar = pendingAvatar;
  Profiles.set(user, data);
  editDlg.close();
  renderNav();
  renderAll();
});

renderAll();