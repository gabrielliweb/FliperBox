const user = Auth.current();
if (!user) location.href = "login.html"; // página protegida

document.getElementById("who").textContent = user;

function renderTop4() {
  const favs = Favorites.get(user);
  let html = "";
  for (let i = 0; i < 4; i++) {
    const g = gameById(favs[i]);
    html += g ? `<div title="${esc(g.title)}">${poster(g)}</div>` : `<div class="slot-empty">${i + 1}</div>`;
  }
  document.getElementById("top4").innerHTML = html;

  document.getElementById("picker").innerHTML = GAMES.map((g) => `
    <button class="poster-btn ${favs.includes(g.id) ? "selected" : ""}" data-fav="${g.id}" title="${esc(g.title)}">
      ${poster(g)}
    </button>`).join("");
}

function renderMyReviews() {
  const mine = Reviews.all().filter((r) => r.user === user);
  document.getElementById("my-reviews").innerHTML = mine.length
    ? mine.map((r) => feedItem(r, true)).join("")
    : '<p class="empty">Você ainda não publicou reviews.</p>';
}

document.getElementById("picker").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-fav]");
  if (!btn) return;
  if (!Favorites.toggle(user, Number(btn.dataset.fav))) alert("Seu Top 4 já está cheio. Remova um jogo antes.");
  renderTop4();
});

document.getElementById("my-reviews").addEventListener("click", (e) => {
  const id = e.target.dataset.del;
  if (id) { Reviews.remove(Number(id), user); renderMyReviews(); }
});

renderTop4();
renderMyReviews();