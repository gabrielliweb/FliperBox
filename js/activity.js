const user = Auth.current();
const feed = document.getElementById("feed");
let filter = "all";

function renderFeed() {
const list = Reviews.all()
    .filter((r) => filter === "all" || r.user === user)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // mais recentes primeiro

    feed.innerHTML = list.length
    ? list.map((r) => feedItem(r, r.user === user)).join("")
    : '<p class="empty">Nada por aqui ainda. Clique na capa de um jogo para avaliar.</p>';
}

document.getElementById("tabs").addEventListener("click", (e) => {
    if (!e.target.dataset.filter) return;
    filter = e.target.dataset.filter;
    document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("active", b === e.target));
    renderFeed();
});

feed.addEventListener("click", (e) => {
    const id = e.target.dataset.del;
    if (id) { Reviews.remove(Number(id), user); renderFeed(); }
});

renderFeed();
renderNews(document.getElementById("news"));