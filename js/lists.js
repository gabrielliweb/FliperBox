const user = Auth.current();
if (!user) location.href = "login.html";

const box = document.getElementById("lists");
const openIds = new Set();

function renderLists() {
    const options = GAMES.map((g) => `<option value="${g.id}">${esc(g.title)}</option>`).join("");
    const lists = Lists.mine(user);

box.innerHTML = lists.length
    ? lists.map((l) => {
        const n = l.games.length;
        return `<article class="list-card">
        ${mosaic(l.games)}
        <h3>${esc(l.name)}</h3>
        <p class="muted">${n} ${n === 1 ? "jogo" : "jogos"}</p>
        <details data-id="${l.id}" ${openIds.has(l.id) ? "open" : ""}>
            <summary>Gerenciar</summary>
            <div class="row">
            <select id="sel-${l.id}" aria-label="Jogo para adicionar">${options}</select>
            <button data-add="${l.id}">Adicionar</button>
            </div>
            <ul class="list-games">
            ${l.games.map(gameById).filter(Boolean).map((g) => `
                <li>${esc(g.title)}
                <button class="link-danger" data-rm="${l.id}:${g.id}" aria-label="Remover ${esc(g.title)}">remover</button>
                </li>`).join("")}
            </ul>
            <button class="link-danger" data-rmlist="${l.id}">Excluir lista</button>
        </details>
        </article>`;
    }).join("")
    : '<p class="empty">Você ainda não criou listas. Dê um nome à primeira acima.</p>';
}

document.addEventListener("toggle", (e) => {
    const id = Number(e.target.dataset && e.target.dataset.id);
    if (id) e.target.open ? openIds.add(id) : openIds.delete(id);
}, true);

document.getElementById("list-form").addEventListener("submit", (e) => {
    e.preventDefault();
    Lists.create(user, document.getElementById("list-name").value.trim());
    e.target.reset();
    renderLists();
});

box.addEventListener("click", (e) => {
    const d = e.target.dataset;
    if (d.add) {
    const id = Number(d.add);
    Lists.addGame(id, Number(document.getElementById("sel-" + id).value));
} else if (d.rm) {
    const [listId, gameId] = d.rm.split(":").map(Number);
    Lists.removeGame(listId, gameId);
} else if (d.rmlist) {
    Lists.remove(Number(d.rmlist));
} else return;
renderLists();
});

renderLists();