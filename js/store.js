// Camada de dados: tudo que fala com o LocalStorage fica aqui.
const DB = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const Auth = {
  current: () => DB.get("gb_session", null),
  async register(user, pass) {
    const users = DB.get("gb_users", []);
    if (users.some((u) => u.user.toLowerCase() === user.toLowerCase())) throw new Error("Esse usuário já existe.");
    users.push({ user, hash: await sha256(pass), createdAt: new Date().toISOString() });
    DB.set("gb_users", users);
    DB.set("gb_session", user);
  },
  async login(user, pass) {
    const found = DB.get("gb_users", []).find((u) => u.user.toLowerCase() === user.toLowerCase());
    if (!found || found.hash !== (await sha256(pass))) throw new Error("Usuário ou senha incorretos.");
    DB.set("gb_session", found.user);
  },
  logout() { localStorage.removeItem("gb_session"); }
};

const Reviews = {
  all: () => DB.get("gb_reviews", []),
  add(game, user, stars, text) {
    const list = Reviews.all();
    list.unshift({
      id: Date.now(), gameId: game.id, title: game.title, cover: game.cover,
      user, stars: Number(stars), text, date: new Date().toISOString(),
      likes: [], comments: []
    });
    DB.set("gb_reviews", list);
  },
  remove(id, user) {
    DB.set("gb_reviews", Reviews.all().filter((r) => !(r.id === id && r.user === user)));
  },
  _edit(id, fn) {
    const all = Reviews.all();
    const r = all.find((x) => x.id === id);
    if (r) { fn(r); DB.set("gb_reviews", all); }
  },
  like(id, user) {
    Reviews._edit(id, (r) => {
      const l = r.likes || [];
      r.likes = l.includes(user) ? l.filter((u) => u !== user) : [...l, user];
    });
  },
  comment(id, user, text) {
    Reviews._edit(id, (r) => {
      r.comments = [...(r.comments || []), { user, text, date: new Date().toISOString() }];
    });
  }
};

const Profiles = {
  all: () => DB.get("gb_profiles", {}),
  get: (user) => Profiles.all()[user] || { avatar: "🕹️", bio: "" },
  set(user, data) {
    const all = Profiles.all();
    all[user] = { ...Profiles.get(user), ...data };
    DB.set("gb_profiles", all);
  }
};

const Follows = {
  list: (user) => DB.get("gb_follows_" + user, []),
  is: (me, other) => Follows.list(me).includes(other),
  toggle(me, other) {
    const l = Follows.list(me);
    DB.set("gb_follows_" + me, l.includes(other) ? l.filter((x) => x !== other) : [...l, other]);
  },
  counts(user, viewer) {
    const p = MOCK_PROFILES[user];
    if (p) return { followers: p.followers + (viewer && Follows.is(viewer, user) ? 1 : 0), following: p.following };
    const l = Follows.list(user);
    return { followers: l.filter((n) => MOCK_PROFILES[n] && MOCK_PROFILES[n].followsBack).length, following: l.length };
  }
};

const Favorites = {
  get: (user) => DB.get("gb_fav_" + user, []),
  toggle(user, gameId) {
    let favs = Favorites.get(user);
    if (favs.includes(gameId)) favs = favs.filter((id) => id !== gameId);
    else if (favs.length < 4) favs.push(gameId);
    else return false;
    DB.set("gb_fav_" + user, favs);
    return true;
  }
};

const Lists = {
  mine: (user) => DB.get("gb_lists", []).filter((l) => l.user === user),
  _save(all) { DB.set("gb_lists", all); },
  create(user, name) {
    const all = DB.get("gb_lists", []);
    all.push({ id: Date.now(), user, name, games: [] });
    Lists._save(all);
  },
  addGame(listId, gameId) {
    const all = DB.get("gb_lists", []);
    const l = all.find((x) => x.id === listId);
    if (l && !l.games.includes(gameId)) l.games.push(gameId);
    Lists._save(all);
  },
  removeGame(listId, gameId) {
    const all = DB.get("gb_lists", []);
    const l = all.find((x) => x.id === listId);
    if (l) l.games = l.games.filter((id) => id !== gameId);
    Lists._save(all);
  },
  remove(listId) { Lists._save(DB.get("gb_lists", []).filter((l) => l.id !== listId)); }
};

function seedData() {
  if (DB.get("gb_seeded_v3", false)) return;
  DB.set("gb_profiles", { ...Profiles.all(), ...MOCK_PROFILES });
  Object.entries(MOCK_PROFILES).forEach(([u, p]) => DB.set("gb_fav_" + u, p.favorites));
  DB.set("gb_lists", [...DB.get("gb_lists", []), ...MOCK_LISTS.map((l, i) => ({ id: i + 1, ...l }))]);
  const mock = MOCK_REVIEWS.map((m, i) => {
    const g = gameById(m.gameId);
    return {
      id: i + 1, gameId: g.id, title: g.title, cover: g.cover, user: m.user, stars: m.stars, text: m.text,
      date: new Date(Date.now() - m.daysAgo * 864e5).toISOString(),
      likes: Array.from({ length: m.likes }, (_, k) => "fã" + (k + 1)),
      comments: (m.comments || []).map((c) => ({ ...c, date: new Date().toISOString() }))
    };
  });
  DB.set("gb_reviews", [...Reviews.all(), ...mock]);
  DB.set("gb_seeded_v3", true);
}
seedData();
