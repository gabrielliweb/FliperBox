const gamesEl = document.getElementById("games");
const searchEl = document.getElementById("search");
const dlg = document.getElementById("dlg");
const msg = document.getElementById("dlg-msg");
const comment = document.getElementById("comment");
let current = null;
let rating = 0;

// Busca sem acento e sem diferenciar maiúsculas
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function renderGames() {
  const q = norm(searchEl.value.trim());
  const list = GAMES.filter((g) => norm(g.title).includes(q));
  gamesEl.innerHTML = list.length
    ? list.map((g) => `
        <button class="poster-btn" data-id="${g.id}" title="${esc(g.title)} (${g.year})" aria-label="Abrir ${esc(g.title)}">
          ${poster(g)}
        </button>`).join("")
    : '<p class="empty">Nenhum jogo encontrado para essa busca.</p>';
}
searchEl.addEventListener("input", renderGames); // filtra enquanto digita

function paintStars() {
  dlg.querySelectorAll("[data-star]").forEach((b) => b.classList.toggle("on", Number(b.dataset.star) <= rating));
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
  dlg.showModal();
});

dlg.querySelector(".star-pick").addEventListener("click", (e) => {
  if (e.target.dataset.star) { rating = Number(e.target.dataset.star); paintStars(); }
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