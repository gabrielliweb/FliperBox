const gamesEl = document.getElementById("games");
const searchEl = document.getElementById("search");
const genreEl = document.getElementById("genre");
const pillsEl = document.getElementById("pills");
const dlg = document.getElementById("dlg");
const msg = document.getElementById("dlg-msg");
const comment = document.getElementById("comment");
const watchBtn = document.getElementById("dlg-watch");
let current = null;
let rating = 0; 
let category = CATEGORIES[0]; 

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

genreEl.innerHTML = CATEGORIES
  .map((c, i) => `<option value="${i}">${i === 0 ? "Gênero: todos" : c.label}</option>`).join("");
genreEl.addEventListener("change", () => {
  category = CATEGORIES[genreEl.value];
  renderGames();
});

function renderPills() {
  const q = searchEl.value.trim();
  const pills = [];
  if (category !== CATEGORIES[0]) pills.push(`<button class="pill" data-clear="genre" aria-label="Remover filtro ${esc(category.label)}">${esc(category.label)} ×</button>`);
  if (q) pills.push(`<button class="pill" data-clear="q" aria-label="Limpar busca">“${esc(q)}” ×</button>`);
  pillsEl.innerHTML = pills.join("");
}
pillsEl.addEventListener("click", (e) => {
  const b = e.target.closest("[data-clear]");
  if (!b) return;
  if (b.dataset.clear === "genre") { category = CATEGORIES[0]; genreEl.value = "0"; }
  else searchEl.value = "";
  renderGames();
});

function renderGames() {
  const q = norm(searchEl.value.trim());
  const list = GAMES.filter((g) =>
    norm(g.title).includes(q) && (!category.genres || category.genres.includes(g.genre)));

  gamesEl.innerHTML = list.length
    ? list.map((g) => `
        <button class="poster-btn" data-id="${g.id}" title="${esc(g.title)} (${g.year})" aria-label="Abrir ${esc(g.title)}">
          ${poster(g)}
        </button>`).join("")
    : '<p class="empty">Nenhum jogo encontrado com esses filtros.</p>';
  renderPills();
}
searchEl.addEventListener("input", renderGames);
function paintStars() {
  dlg.querySelectorAll("[data-star]").forEach((b) => b.classList.toggle("on", Number(b.dataset.star) <= rating));
}
function paintWatch() {
  const me = Auth.current();
  watchBtn.textContent = me && Watchlist.has(me, current.id) ? "✓ Na watchlist" : "+ Watchlist";
}

gamesEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-id]");
  if (!btn) return;
  current = gameById(btn.dataset.id);
  rating = 0;
  document.getElementById("dlg-poster").innerHTML = poster(current);
  document.getElementById("dlg-title").textContent = `${current.title} (${current.year})`;
  document.getElementById("dlg-meta").textContent = current.genre;
  document.getElementById("dlg-synopsis").textContent = current.synopsis;
  comment.value = "";
  msg.textContent = "";
  paintStars();
  paintWatch();
  dlg.showModal();
});

dlg.querySelector(".star-pick").addEventListener("click", (e) => {
  if (e.target.dataset.star) { rating = Number(e.target.dataset.star); paintStars(); }
});

watchBtn.addEventListener("click", () => {
  const me = Auth.current();
  if (!me) { msg.innerHTML = 'Você precisa <a href="login.html">entrar</a> para usar a watchlist.'; return; }
  Watchlist.toggle(me, current.id);
  paintWatch();
});

document.getElementById("dlg-close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

document.getElementById("review-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = Auth.current();
  if (!user) { msg.innerHTML = 'Você precisa <a href="login.html">entrar</a> para salvar.'; return; }
  if (!rating) { msg.textContent = "Escolha uma nota de 1 a 5 estrelas."; return; }
  Reviews.add(current, user, rating, comment.value.trim());
  dlg.close();
  location.href = "activity.html";
});

renderGames();
renderNews(document.getElementById("news"));