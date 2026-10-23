const Watchlist = {
    get: (user) => DB.get("gb_watch_" + user, []),
    has: (user, gameId) => Watchlist.get(user).includes(gameId),
    toggle(user, gameId) {
    const list = Watchlist.get(user);
    DB.set("gb_watch_" + user, list.includes(gameId) ? list.filter((id) => id !== gameId) : [...list, gameId]);
    }
};