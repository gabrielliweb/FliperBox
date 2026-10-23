const steam = (appId) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;

const GAMES = [
  { id: 1,  title: "Hollow Knight", year: 2017, genre: "Metroidvania", cover: steam(367520), synopsis: "Explore o reino subterrâneo de Hallownest, um mundo de insetos, segredos e chefes difíceis." },
  { id: 2,  title: "Celeste", year: 2018, genre: "Plataforma", cover: steam(504230), synopsis: "Ajude Madeline a escalar a montanha Celeste em uma aventura precisa sobre superação." },
  { id: 3,  title: "The Witcher 3: Wild Hunt", year: 2015, genre: "RPG", cover: steam(292030), synopsis: "Como o caçador de monstros Geralt, procure sua filha adotiva em um vasto mundo aberto." },
  { id: 4,  title: "Stardew Valley", year: 2016, genre: "Simulação", cover: steam(413150), synopsis: "Herde uma fazenda, plante, crie animais e faça amizade com os moradores da cidade." },
  { id: 5,  title: "Hades", year: 2020, genre: "Roguelike", cover: steam(1145360), synopsis: "Fuja do submundo grego em combates rápidos, com uma história que avança a cada tentativa." },
  { id: 6,  title: "Undertale", year: 2015, genre: "RPG", cover: steam(391540), synopsis: "Um RPG em que você pode vencer batalhas sem lutar, com personagens marcantes." },
  { id: 7,  title: "Portal 2", year: 2011, genre: "Puzzle", cover: steam(620), synopsis: "Resolva quebra-cabeças com portais e testes cada vez mais criativos nos laboratórios da Aperture." },
  { id: 8,  title: "Elden Ring", year: 2022, genre: "RPG", cover: steam(1245620), synopsis: "Um RPG de ação em mundo aberto, nas Terras Intermédias, criado pela FromSoftware." },
  { id: 9,  title: "Hi-Fi Rush", year: 2023, genre: "Ação", cover: steam(1817230), synopsis: "Um jogo de ação em que cada golpe e cada movimento seguem o ritmo da música." },
  { id: 10, title: "Disco Elysium", year: 2019, genre: "RPG", cover: steam(632470), synopsis: "Você é um detetive com amnésia investigando um caso em um RPG guiado por diálogos." },
  { id: 11, title: "Baldur's Gate 3", year: 2023, genre: "RPG", cover: steam(1086940), synopsis: "Um RPG por turnos com grupo de aventureiros, escolhas profundas e modo cooperativo." },
  { id: 12, title: "Red Dead Redemption 2", year: 2018, genre: "Ação", cover: steam(1174180), synopsis: "A história de Arthur Morgan e sua gangue no fim da era dos foras da lei, no velho oeste." },
  { id: 13, title: "God of War", year: 2018, genre: "Ação", cover: steam(1593500), synopsis: "Kratos e seu filho Atreus atravessam os reinos da mitologia nórdica em uma jornada pessoal." },
  { id: 14, title: "Cyberpunk 2077", year: 2020, genre: "RPG", cover: steam(1091500), synopsis: "Como V, viva em Night City, uma metrópole futurista, em um RPG de ação em mundo aberto." },
  { id: 15, title: "The Last of Us Part I", year: 2022, genre: "Aventura", cover: steam(1888930), synopsis: "Joel e Ellie cruzam os Estados Unidos devastados por uma infecção, em uma história intensa." },
  { id: 16, title: "Sekiro: Shadows Die Twice", year: 2019, genre: "Ação", cover: steam(814380), synopsis: "Um shinobi em busca de vingança no Japão feudal, com combate baseado em espadas e postura." },
  { id: 17, title: "Dark Souls III", year: 2016, genre: "RPG", cover: steam(374320), synopsis: "Combate exigente e um mundo sombrio e interligado, no encerramento da trilogia Dark Souls." },
  { id: 18, title: "Resident Evil 4", year: 2023, genre: "Terror", cover: steam(2050650), synopsis: "Remake em que Leon S. Kennedy tenta resgatar a filha do presidente em um vilarejo europeu." },
  { id: 19, title: "Terraria", year: 2011, genre: "Sandbox", cover: steam(105600), synopsis: "Cave, construa, explore e enfrente chefes em um mundo 2D cheio de segredos." },
  { id: 20, title: "Cuphead", year: 2017, genre: "Plataforma", cover: steam(268910), synopsis: "Run and gun com visual de desenho animado dos anos 1930 e muitos chefes." },
  { id: 21, title: "Super Mario Odyssey", year: 2017, genre: "Plataforma", cover: "img/mario-odyssey.jpg", synopsis: "Mario e Cappy viajam por reinos de todo o mundo em uma aventura de plataforma 3D." },
  { id: 22, title: "Street Fighter II", year: 1991, genre: "Luta", cover: "img/street-fighter-2.jpg", synopsis: "O clássico dos fliperamas: duelos um contra um com lutadores de golpes e estilos únicos." },
  { id: 23, title: "Pac-Man", year: 1980, genre: "Arcade", cover: "img/pac-man.jpg", synopsis: "Percorra o labirinto comendo pontos e fugindo dos fantasmas, no ícone dos fliperamas." },
  { id: 24, title: "Chrono Trigger", year: 1995, genre: "JRPG", cover: steam(613830), synopsis: "Um grupo viaja por diferentes eras para impedir uma catástrofe que ameaça o futuro." },
  { id: 25, title: "Space Invaders", year: 1978, genre: "Arcade", cover: "img/space-invaders.jpg", synopsis: "Defenda a Terra atirando em ondas de alienígenas que descem cada vez mais rápido." },
  { id: 26, title: "Donkey Kong", year: 1981, genre: "Plataforma", cover: "img/donkey-kong.jpg", synopsis: "Suba as plataformas desviando de barris para resgatar Pauline, em um marco dos fliperamas." }
];
const gameById = (id) => GAMES.find((g) => g.id === Number(id));

const CATEGORIES = [
  { label: "Todos", genres: null },
  { label: "Ação/Aventura", genres: ["Ação", "Aventura"] },
  { label: "RPG", genres: ["RPG", "JRPG"] },
  { label: "Luta", genres: ["Luta"] },
  { label: "Plataforma", genres: ["Plataforma"] },
  { label: "Metroidvania", genres: ["Metroidvania"] },
  { label: "Arcade", genres: ["Arcade"] },
  { label: "Outros", genres: ["Simulação", "Roguelike", "Puzzle", "Terror", "Sandbox"] }
];

const MOCK_PROFILES = {
  Alex_Arcade:  { avatar: "👾", bio: "Fliperama raiz e RPG de fim de semana.", followers: 128, following: 54,  followsBack: true,  favorites: [22, 1, 8, 24] },
  PixelQueen:   { avatar: "👑", bio: "Plataforma, pixel art e trilhas sonoras.", followers: 342, following: 77,  followsBack: false, favorites: [2, 20, 21, 5] },
  RetroGamer99: { avatar: "🕹️", bio: "Colecionador de clássicos dos anos 80 e 90.", followers: 89, following: 120, followsBack: true,  favorites: [23, 25, 26, 22] }
};

const MOCK_LISTS = [
  { user: "Alex_Arcade",  name: "Fliperama essencial", games: [22, 23, 25, 26] },
  { user: "PixelQueen",   name: "Plataformas que amo", games: [2, 20, 21, 1] },
  { user: "RetroGamer99", name: "Anos 80 em fichas",   games: [23, 25, 26] }
];

const MOCK_REVIEWS = [
  { user: "Alex_Arcade",  gameId: 22, stars: 5, daysAgo: 1, likes: 14, text: "Gastei muita ficha nesse. Cada lutador tem um estilo próprio e dominar os golpes é viciante.", comments: [{ user: "PixelQueen", text: "Hadouken eterno! Melhor jogo de luta." }] },
  { user: "PixelQueen",   gameId: 23, stars: 4, daysAgo: 1, likes: 9,  text: "Simples e perfeito. Decorar o caminho dos fantasmas é metade da graça." },
  { user: "RetroGamer99", gameId: 24, stars: 5, daysAgo: 2, likes: 21, text: "Trilha sonora e história sem enrolação. Um dos melhores RPGs de todos os tempos.", comments: [{ user: "Alex_Arcade", text: "A trilha sonora é de outro mundo." }] },
  { user: "Alex_Arcade",  gameId: 1,  stars: 5, daysAgo: 3, likes: 11, text: "Atmosfera incrível e chefes memoráveis. Vale cada morte." },
  { user: "PixelQueen",   gameId: 12, stars: 5, daysAgo: 4, likes: 17, text: "Um mundo vivo e uma história que fica na cabeça por dias.", comments: [{ user: "RetroGamer99", text: "Concordo, o final me marcou." }] },
  { user: "RetroGamer99", gameId: 25, stars: 3, daysAgo: 5, likes: 4,  text: "Histórico e importante, mas hoje funciona melhor em partidas curtas." },
  { user: "PixelQueen",   gameId: 8,  stars: 4, daysAgo: 6, likes: 12, text: "Difícil, bonito e cheio de segredos. Exige paciência." },
  { user: "Alex_Arcade",  gameId: 21, stars: 4, daysAgo: 8, likes: 7,  text: "Criativo em cada reino. Dá vontade de explorar tudo." }
];
const NEWS = [
  { tag: "Lançamento", title: "Novo RPG de mundo aberto ganha data", text: "Exemplo de notícia: substitua pelo texto real." },
  { tag: "Trailer", title: "Estúdio indie revela trailer de plataforma 2D", text: "Exemplo de notícia: substitua pelo texto real." },
  { tag: "Evento", title: "Feira de games anuncia programação", text: "Exemplo de notícia: substitua pelo texto real." },
  { tag: "Atualização", title: "Jogo de sobrevivência recebe grande patch", text: "Exemplo de notícia: substitua pelo texto real." }
];