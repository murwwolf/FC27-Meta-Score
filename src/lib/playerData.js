import Papa from "papaparse";
import csvText from "../data/fc27_players.csv?raw";

const normalizeWorkRate = (value) => {
  const v = String(value || "").trim();

  if (!v) return "Unknown";

  const map = {
    High: "High",
    Medium: "Medium",
    Med: "Medium",
    Low: "Low",
  };

  return map[v] || v;
};

const number = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const parsed = Papa.parse(csvText, {
  header: true,
  skipEmptyLines: true,
});

// =========================================================
// MANUALLY ADDED PLAYER NAMES
// =========================================================

const manualPlayerNames = [
  "Pedri",
  "Raphinha",
  "Frenkie de Jong",
  "João Cancelo",
  "Joan García",
  "Pau Cubarsí",
  "Fermín",
  "Eric García",
  "Jules Koundé",
  "Gavi",
  "Balde",
  "Federico Valverde",
  "Marc Cucurella",
  "Bruno Fernandes",
  "Gianluigi Donnarumma",
  "Gabriel",
  "Virgil van Dijk",
  "Achraf Hakimi",
  "Lionel Messi",
  "João Neves",
  "Alexander Isak",
  "Bruno Guimarães",
  "Viktor Gyökeres",
  "Antoine Semenyo",
  "Cristiano Ronaldo",
  "Joshua Kimmich",
  "Jamal Musiala",
  "Bukayo Saka",
  "Julián Alvarez",
  "Jan Oblak",
  "Thibaut Courtois",
  "Dominik Szoboszlai",
  "William Saliba",
  "Arda Güler",
  "Yan Diomande",
  "Bernardo Silva",
  "Ibrahima Konaté",
  "Rodrygo",
  "Aurélien Tchouaméni",
  "Éder Militão",
  "Trent Alexander-Arnold",
  "Denzel Dumfries",
  "Antonio Rüdiger",
  "Álvaro Carreras",
  "Dean Huijsen",
  "Eduardo Camavinga",
  "Brahim Díaz",
  "Jonathan Tah",
  "Luis Díaz",
  "Dayot Upamecano",
  "Konrad Laimer",
  "Alisson",
  "Florian Wirtz",
  "Hugo Ekitiké",
  "Ryan Gravenberch",
  "Bradley Barcola",
  "Marquinhos",
  "Fabián Ruiz",
  "Désiré Doué",
  "Iñigo Martínez",
  "João Félix",
  "Kingsley Coman",
  "Mohamed Simakan",
  "Rodrigo De Paul",
  "Casemiro",
  "Rúben Dias",
  "Enzo Fernández",
  "Rayan Cherki",
  "Joško Gvardiol",
  "Marc Guehi",
  "Phil Foden",
  "Jérémy Doku",
  "Youri Tielemans",
  "Matheus Cunha",
  "Bryan Mbeumo",
  "Marcus Rashford",
  "Alphonso Davies",
  "David Raya",
  "Declan Rice",
  "Martin Ødegaard",
  "Eberechi Eze",
  "Jurriën Timber",
  "Marcos Llorente",
  "Grimaldo",
  "Alexander Sørloth",
  "Alexis Mac Allister",
  "Giorgi Mamardashvili",
  "Luis Suárez",
  "Germán Berterame",
  "Dani Olmo",
  "Karim Adeyemi",
  "Moisés Caicedo",
  "Cole Palmer",
  "Reece James",
  "João Pedro",
  "Maxence Lacroix",
];

const manualNameSet = new Set(
  manualPlayerNames.map((name) => name.toLowerCase())
);

// =========================================================
// CSV PLAYERS
// =========================================================

const players = parsed.data
  .map((row, index) => {
    const name =
      row["info.name.knownas"] ||
      `${row["info.name.firstname"] || ""} ${
        row["info.name.lastname"] || ""
      }`.trim();

    const position = row["primary_position"] || "";
    const isGK = position === "GK";

    return {
      id: number(row["info.playerid"], index + 1),
      name,

      position,
      alternatePositions: row["other_positions"] || "",

      overall: number(row["info.overallrating"]),
      potential: number(row["info.potential"]),

      nation: row["info.nation.name"] || "",
      club: row["info.teams.club_team.name"] || "",

      league: (() => {
        const leagues = [
          "LaLiga",
          "Bundesliga",
          "LaLiga",
          "Bundesliga",
          "LaLiga",
          "Premier League",
          "Ligue 1",
          "Bundesliga",
          "LaLiga",
          "Ligue 1",
          "LaLiga",
          "Ligue 1",
          "Ligue 1",
          "LaLiga",
          "Ligue 1",
        ];

        return leagues[index] || row["info.league"] || "";
      })(),

      pace: isGK
        ? number(row["card_attrs.div"])
        : number(row["card_attrs.pac"]),

      shooting: isGK
        ? number(row["card_attrs.han"])
        : number(row["card_attrs.sho"]),

      passing: isGK
        ? number(row["card_attrs.kic"] || row["card_attrs.kick"])
        : number(row["card_attrs.pas"]),

      dribbling: isGK
        ? number(row["card_attrs.ref"])
        : number(row["card_attrs.dri"]),

      defending: isGK
        ? number(row["card_attrs.spd"])
        : number(row["card_attrs.def"]),

      physical: isGK
        ? number(row["card_attrs.pos"])
        : number(row["card_attrs.phy"]),

      weakFoot: number(row["info.weafoot"]),
      skillMoves: number(row["info.skillmoves"]),
      preferredFoot: row["info.preferredfoot"] || "",

      height: number(row["info.height"]),
      weight: number(row["info.weight"]),

      attackingWorkRate: normalizeWorkRate(
        row["info.attackingworkrate"]
      ),

      defensiveWorkRate: normalizeWorkRate(
        row["info.defensiveworkrate"]
      ),

      image: row["info.headshot"] || "",
    };
  })
  .filter((player) => {
    return !manualNameSet.has(player.name.toLowerCase());
  });

// =========================================================
// MANUAL PLAYERS
// =========================================================

const addPlayer = (player) => {
  players.push(player);
};

// =========================================================
// FEDERICO VALVERDE
// =========================================================

addPlayer({
  id: 239053,
  name: "Federico Valverde",
  position: "CM",
  alternatePositions: "RB, RM, CDM",
  overall: 87,
  potential: 0,
  nation: "Uruguay",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 90,
  shooting: 84,
  passing: 83,
  dribbling: 81,
  defending: 81,
  physical: 85,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 183,
  weight: 78,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-239053.c45605b60adb72505a5476b698db3dcc927b157ec60fbdf16d7e2158ff654ed4.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MARC CUCURELLA
// =========================================================

addPlayer({
  id: 239231,
  name: "Marc Cucurella",
  position: "LB",
  alternatePositions: "",
  overall: 86,
  potential: 0,
  nation: "Spain",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 75,
  shooting: 64,
  passing: 79,
  dribbling: 78,
  defending: 84,
  physical: 78,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 174,
  weight: 71,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-239231.d8df141623d7ce3a5c5a174cfe0be49c7bdafa960474377fe2ba1a104bbd8bcc.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// BRUNO FERNANDES
// =========================================================

addPlayer({
  id: 212198,
  name: "Bruno Fernandes",
  position: "CAM",
  alternatePositions: "CM",
  overall: 89,
  potential: 0,
  nation: "Portugal",
  club: "Manchester United",
  league: "Premier League",
  pace: 67,
  shooting: 85,
  passing: 92,
  dribbling: 85,
  defending: 68,
  physical: 75,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 179,
  weight: 69,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-212198.c87a438a2e1591e2b37fd41499f0ea587ac6e132b3c2dea53dc13ec0e7555c42.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// GIANLUIGI DONNARUMMA
// =========================================================

addPlayer({
  id: 230621,
  name: "Gianluigi Donnarumma",
  position: "GK",
  alternatePositions: "",
  overall: 89,
  potential: 0,
  nation: "Italy",
  club: "Manchester City",
  league: "Premier League",
  pace: 90,
  shooting: 83,
  passing: 72,
  dribbling: 90,
  defending: 46,
  physical: 88,
  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Right",
  height: 196,
  weight: 90,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-230621.49edf63326680ca877d67c0934def529776e6988e5d7462c7f33551f752ac9b1.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// GABRIEL
// =========================================================

addPlayer({
  id: 232580,
  name: "Gabriel",
  position: "CB",
  alternatePositions: "",
  overall: 89,
  potential: 0,
  nation: "Brazil",
  club: "Arsenal",
  league: "Premier League",
  pace: 64,
  shooting: 44,
  passing: 64,
  dribbling: 66,
  defending: 91,
  physical: 84,
  weakFoot: 2,
  skillMoves: 2,
  preferredFoot: "Left",
  height: 190,
  weight: 87,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-232580.20562e6c41edacd3a25d4dba64dfe97f7abf2e5e6f65a4db609d02c0d3bd4fa3.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// VIRGIL VAN DIJK
// =========================================================

addPlayer({
  id: 203376,
  name: "Virgil van Dijk",
  position: "CB",
  alternatePositions: "",
  overall: 88,
  potential: 0,
  nation: "Netherlands",
  club: "Liverpool",
  league: "Premier League",
  pace: 70,
  shooting: 60,
  passing: 72,
  dribbling: 70,
  defending: 89,
  physical: 85,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 195,
  weight: 92,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-203376.7630fbe759e063e4a0dc65ccb02cda3384f58e5f885c03a345e48cb965601f84.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ACHRAF HAKIMI
// =========================================================

addPlayer({
  id: 235212,
  name: "Achraf Hakimi",
  position: "RB",
  alternatePositions: "RM",
  overall: 89,
  potential: 0,
  nation: "Morocco",
  club: "Paris Saint-Germain",
  league: "Ligue 1",
  pace: 92,
  shooting: 79,
  passing: 81,
  dribbling: 82,
  defending: 82,
  physical: 81,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 181,
  weight: 73,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-235212.ac1dd13215bae801dd8449f7006785b1cf96d0d864349a9b9bfe991d12719d11.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// LIONEL MESSI
// =========================================================

addPlayer({
  id: 158023,
  name: "Lionel Messi",
  position: "CAM",
  alternatePositions: "ST, RW, RM",
  overall: 89,
  potential: 0,
  nation: "Argentina",
  club: "Inter Miami CF",
  league: "MLS",
  pace: 76,
  shooting: 87,
  passing: 89,
  dribbling: 90,
  defending: 33,
  physical: 63,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 169,
  weight: 67,
  attackingWorkRate: "High",
  defensiveWorkRate: "Low",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-158023.1d5d8148c3dcfc5f9d046bb03cfa1ce942ded88b39dabf3e78a8cdcd5107d596.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JOÃO NEVES
// =========================================================

addPlayer({
  id: 272834,
  name: "João Neves",
  position: "CM",
  alternatePositions: "CDM",
  overall: 89,
  potential: 0,
  nation: "Portugal",
  club: "Paris Saint-Germain",
  league: "Ligue 1",
  pace: 72,
  shooting: 75,
  passing: 84,
  dribbling: 87,
  defending: 86,
  physical: 82,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 174,
  weight: 66,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-272834.8972100432c6e4cb590e1da7f180bcc8162ced87f8b3e23418648f93d9f20bfd.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ALEXANDER ISAK
// =========================================================

addPlayer({
  id: 233731,
  name: "Alexander Isak",
  position: "ST",
  alternatePositions: "",
  overall: 86,
  potential: 0,
  nation: "Sweden",
  club: "Liverpool",
  league: "Premier League",
  pace: 81,
  shooting: 87,
  passing: 72,
  dribbling: 82,
  defending: 39,
  physical: 72,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 192,
  weight: 77,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-233731.b468b386a7ba7e37931e957ea2c86b200503d008b0d5d84794f157c1ae4f11a5.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// BRUNO GUIMARÃES
// =========================================================

addPlayer({
  id: 247851,
  name: "Bruno Guimarães",
  position: "CM",
  alternatePositions: "CDM",
  overall: 86,
  potential: 0,
  nation: "Brazil",
  club: "Arsenal",
  league: "Premier League",
  pace: 59,
  shooting: 75,
  passing: 85,
  dribbling: 84,
  defending: 80,
  physical: 80,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 183,
  weight: 74,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-247851.20f48c999a931ea57bf6b0153a60f7723a65ebb73b6b33dbcf28374810d376d4.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// VIKTOR GYÖKERES
// =========================================================

addPlayer({
  id: 241651,
  name: "Viktor Gyökeres",
  position: "ST",
  alternatePositions: "",
  overall: 86,
  potential: 0,
  nation: "Sweden",
  club: "Arsenal",
  league: "Premier League",
  pace: 81,
  shooting: 87,
  passing: 72,
  dribbling: 78,
  defending: 44,
  physical: 87,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 189,
  weight: 94,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241651.13aff19c8713ff2e3d7955e724eaa9bb747b67934c839e0448ecd7716226770b.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ANTOINE SEMENYO
// =========================================================

addPlayer({
  id: 241236,
  name: "Antoine Semenyo",
  position: "RW",
  alternatePositions: "LW, RM, LM",
  overall: 85,
  potential: 0,
  nation: "Ghana",
  club: "Manchester City",
  league: "Premier League",
  pace: 82,
  shooting: 85,
  passing: 79,
  dribbling: 84,
  defending: 46,
  physical: 80,
  weakFoot: 5,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 185,
  weight: 0,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241236.30722fe81558a064edfd4fe049c0e76c9919f336d9d30a410206113b2b3d7845.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// CRISTIANO RONALDO
// =========================================================

addPlayer({
  id: 20801,
  name: "Cristiano Ronaldo",
  position: "ST",
  alternatePositions: "",
  overall: 84,
  potential: 0,
  nation: "Portugal",
  club: "Al Nassr",
  league: "Saudi Pro League",
  pace: 67,
  shooting: 88,
  passing: 75,
  dribbling: 78,
  defending: 33,
  physical: 75,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 187,
  weight: 83,
  attackingWorkRate: "High",
  defensiveWorkRate: "Low",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-20801.312cfd57c2d47844eb31d8e1ba964ba9bf76c4cc7721a6e674095084a55f55af.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JOSHUA KIMMICH
// =========================================================

addPlayer({
  id: 212622,
  name: "Joshua Kimmich",
  position: "CDM",
  alternatePositions: "CM, RB",
  overall: 88,
  potential: 0,
  nation: "Germany",
  club: "Bayern München",
  league: "Bundesliga",
  pace: 71,
  shooting: 73,
  passing: 90,
  dribbling: 84,
  defending: 81,
  physical: 79,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 177,
  weight: 75,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-212622.7ed32f3a37a3f0dbaaf577e9abc4e09c609909aa9375570f14578bf6d1e37415.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JAMAL MUSIALA
// =========================================================

addPlayer({
  id: 256790,
  name: "Jamal Musiala",
  position: "CAM",
  alternatePositions: "CM, LM, LW",
  overall: 87,
  potential: 0,
  nation: "Germany",
  club: "Bayern München",
  league: "Bundesliga",
  pace: 79,
  shooting: 81,
  passing: 79,
  dribbling: 90,
  defending: 62,
  physical: 65,
  weakFoot: 4,
  skillMoves: 5,
  preferredFoot: "Right",
  height: 186,
  weight: 72,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-256790.85bdbfb5e79a89346b48cb66fb0f65eaa886ab3f9fddf26fcce2d0db6728d79a.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// BUKAYO SAKA
// =========================================================

addPlayer({
  id: 246669,
  name: "Bukayo Saka",
  position: "RW",
  alternatePositions: "RM",
  overall: 87,
  potential: 0,
  nation: "England",
  club: "Arsenal",
  league: "Premier League",
  pace: 79,
  shooting: 82,
  passing: 85,
  dribbling: 87,
  defending: 60,
  physical: 73,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 178,
  weight: 65,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-246669.f08bce6bf260884ba4eabe0c6e9ba7a0d926bd5808f7766188c6dfa875070a7f.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JULIÁN ALVAREZ
// =========================================================

addPlayer({
  id: 246191,
  name: "Julián Alvarez",
  position: "ST",
  alternatePositions: "CAM",
  overall: 86,
  potential: 0,
  nation: "Argentina",
  club: "Atlético de Madrid",
  league: "LaLiga",
  pace: 89,
  shooting: 86,
  passing: 82,
  dribbling: 88,
  defending: 50,
  physical: 75,
  weakFoot: 4,
  skillMoves: 5,
  preferredFoot: "Right",
  height: 170,
  weight: 71,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-246191.1d4bcdc990894d5276cfbbd42cac55531f87ee23460c491940ae67253268d740.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JAN OBLAK
// =========================================================

addPlayer({
  id: 200389,
  name: "Jan Oblak",
  position: "GK",
  alternatePositions: "",
  overall: 88,
  potential: 0,
  nation: "Slovenia",
  club: "Atlético de Madrid",
  league: "LaLiga",
  pace: 85,
  shooting: 90,
  passing: 79,
  dribbling: 87,
  defending: 46,
  physical: 86,
  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Right",
  height: 188,
  weight: 87,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-200389.e0d04306ac58dcd8ac5ed96b98d6eec8ffaf06ac2785d8cb9842c781b1922460.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// THIBAUT COURTOIS
// =========================================================

addPlayer({
  id: 192119,
  name: "Thibaut Courtois",
  position: "GK",
  alternatePositions: "",
  overall: 90,
  potential: 0,
  nation: "Belgium",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 87,
  shooting: 89,
  passing: 78,
  dribbling: 90,
  defending: 46,
  physical: 90,
  weakFoot: 2,
  skillMoves: 1,
  preferredFoot: "Left",
  height: 200,
  weight: 96,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-192119.48d098ef0be9a824dbec6ee22901d111d2b282a6b3e8556443892bb881b57018.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// DOMINIK SZOBOSZLAI
// =========================================================

addPlayer({
  id: 236772,
  name: "Dominik Szoboszlai",
  position: "CAM",
  alternatePositions: "RB, CDM, RM, CM",
  overall: 86,
  potential: 0,
  nation: "Hungary",
  club: "Liverpool",
  league: "Premier League",
  pace: 82,
  shooting: 83,
  passing: 86,
  dribbling: 84,
  defending: 74,
  physical: 77,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 186,
  weight: 74,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-236772.8ac3ea7bdfbcfbf4ff13b5f4fab19e5ccf91e3637ed5c2934afe7f9eed9c5ce4.webp",
  dataVerified: true,
  imageStatus: "futgg",
});
// =========================================================
// WILLIAM SALIBA
// =========================================================

addPlayer({
  id: 243715,
  name: "William Saliba",
  position: "CB",
  alternatePositions: "",
  overall: 88,
  potential: 0,
  nation: "France",
  club: "Arsenal",
  league: "Premier League",
  pace: 77,
  shooting: 41,
  passing: 68,
  dribbling: 73,
  defending: 90,
  physical: 82,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 192,
  weight: 92,
  attackingWorkRate: "Low",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-243715.c3fe79594cc4c67cc5c0a94fbc866ffd72ff5940713ebb6f2bba9133b66f97bf.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ARDA GÜLER
// =========================================================

addPlayer({
  id: 264309,
  name: "Arda Güler",
  position: "RM",
  alternatePositions: "CDM, CM, CAM",
  overall: 83,
  potential: 0,
  nation: "Türkiye",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 77,
  shooting: 79,
  passing: 85,
  dribbling: 84,
  defending: 55,
  physical: 57,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 175,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-264309.9f0ec8ba28aac671bcd8407882c2324ed2057796da21c21d1d6941e874be59e9.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// YAN DIOMANDE
// =========================================================

addPlayer({
  id: 78012,
  name: "Yan Diomande",
  position: "RW",
  alternatePositions: "RM, LM, LW",
  overall: 84,
  potential: 0,
  nation: "Ivory Coast",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 93,
  shooting: 77,
  passing: 75,
  dribbling: 87,
  defending: 47,
  physical: 70,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 181,
  weight: 76,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-78012.4d6d4ae50555b73e4685dcfce8d0a92dfda892f0b99f27b0c4e9582f2a4cd805.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// BERNARDO SILVA
// =========================================================

addPlayer({
  id: 218667,
  name: "Bernardo Silva",
  position: "CM",
  alternatePositions: "CDM, RM, RW",
  overall: 84,
  potential: 0,
  nation: "Portugal",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 50,
  shooting: 77,
  passing: 84,
  dribbling: 87,
  defending: 71,
  physical: 65,
  weakFoot: 2,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 173,
  weight: 65,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-218667.e27fc47b969a581cd243c32cc65744c08e9370dcff648d58f80955d7646fce2b.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// IBRAHIMA KONATÉ
// =========================================================

addPlayer({
  id: 237678,
  name: "Ibrahima Konaté",
  position: "CB",
  alternatePositions: "",
  overall: 84,
  potential: 0,
  nation: "France",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 77,
  shooting: 34,
  passing: 65,
  dribbling: 68,
  defending: 84,
  physical: 85,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 194,
  weight: 95,
  attackingWorkRate: "Low",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-237678.1a68ccc3b4b562125c85274256c7642b19ab8991435a13bec91c84e28027c2b4.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// RODRYGO
// =========================================================

addPlayer({
  id: 243812,
  name: "Rodrygo",
  position: "LW",
  alternatePositions: "RW, ST",
  overall: 86,
  potential: 0,
  nation: "Brazil",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 88,
  shooting: 82,
  passing: 80,
  dribbling: 89,
  defending: 32,
  physical: 57,
  weakFoot: 4,
  skillMoves: 5,
  preferredFoot: "Right",
  height: 174,
  weight: 64,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-243812.94fbbbb19b6959c84703e435d916489c0de7d0b6c9f4e4a86cd8621a530941cb.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// AURÉLIEN TCHOUAMÉNI
// =========================================================

addPlayer({
  id: 241637,
  name: "Aurélien Tchouaméni",
  position: "CDM",
  alternatePositions: "CM, CB",
  overall: 84,
  potential: 0,
  nation: "France",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 68,
  shooting: 49,
  passing: 78,
  dribbling: 71,
  defending: 87,
  physical: 85,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 187,
  weight: 81,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241637.f872e169bc781deb8305f5472dedc5097ea2ee6525c0919caac681c5b4e79f3b.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ÉDER MILITÃO
// =========================================================

addPlayer({
  id: 240130,
  name: "Éder Militão",
  position: "CB",
  alternatePositions: "RB",
  overall: 84,
  potential: 0,
  nation: "Brazil",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 86,
  shooting: 38,
  passing: 67,
  dribbling: 69,
  defending: 87,
  physical: 83,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 186,
  weight: 78,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-240130.a1dfef7cd622bf53589b163934d2e4c3598d576518f58a7a3b3e393e8c4e42c3.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// TRENT ALEXANDER-ARNOLD
// =========================================================

addPlayer({
  id: 231281,
  name: "Trent Alexander-Arnold",
  position: "RB",
  alternatePositions: "CM, CDM",
  overall: 84,
  potential: 0,
  nation: "England",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 79,
  shooting: 69,
  passing: 90,
  dribbling: 80,
  defending: 66,
  physical: 67,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 175,
  weight: 69,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-231281.a65a3a0bfb6c2fa60989618e6b0e188a1db67c1d9b48b34e7e4ce20dcb76a098.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// DENZEL DUMFRIES
// =========================================================

addPlayer({
  id: 233096,
  name: "Denzel Dumfries",
  position: "RB",
  alternatePositions: "RWB",
  overall: 84,
  potential: 0,
  nation: "Netherlands",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 87,
  shooting: 72,
  passing: 72,
  dribbling: 77,
  defending: 80,
  physical: 89,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 188,
  weight: 80,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-233096.adbedd7bd1710d2d62eac6eb39563999ce4c08031c8e35ac1366e1ca2e8f25f7.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ANTONIO RÜDIGER
// =========================================================

addPlayer({
  id: 205452,
  name: "Antonio Rüdiger",
  position: "CB",
  alternatePositions: "",
  overall: 83,
  potential: 0,
  nation: "Germany",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 75,
  shooting: 54,
  passing: 71,
  dribbling: 69,
  defending: 83,
  physical: 85,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 190,
  weight: 85,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-205452.45ac28c707d667ef7a0a798cc5c7b136826318322e566ed5ce26e7bfda669b1c.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ÁLVARO CARRERAS
// =========================================================

addPlayer({
  id: 268889,
  name: "Álvaro Carreras",
  position: "LB",
  alternatePositions: "CB, LM",
  overall: 81,
  potential: 0,
  nation: "Spain",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 86,
  shooting: 66,
  passing: 77,
  dribbling: 80,
  defending: 75,
  physical: 81,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 186,
  weight: 75,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-268889.36ffabc381aedfefbae305e9515bbc4196a506faaee2860b9cbed5408fbdc5c2.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// DEAN HUIJSEN
// =========================================================

addPlayer({
  id: 278349,
  name: "Dean Huijsen",
  position: "CB",
  alternatePositions: "",
  overall: 81,
  potential: 0,
  nation: "Spain",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 72,
  shooting: 55,
  passing: 72,
  dribbling: 72,
  defending: 82,
  physical: 77,
  weakFoot: 5,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 196,
  weight: 87,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-278349.b74fbcb910287bd60b54367aabf99c93a3a677011cf03c0573888407dd9ef2bf.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// EDUARDO CAMAVINGA
// =========================================================

addPlayer({
  id: 248243,
  name: "Eduardo Camavinga",
  position: "CM",
  alternatePositions: "CDM, LB",
  overall: 81,
  potential: 0,
  nation: "France",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 79,
  shooting: 67,
  passing: 80,
  dribbling: 82,
  defending: 78,
  physical: 80,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 185,
  weight: 68,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-248243.295a892a52a2539130e6027eaa0d11ff409397bc46529990e71efe0abdd8c175.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// BRAHIM DÍAZ
// =========================================================

addPlayer({
  id: 231410,
  name: "Brahim Díaz",
  position: "RM",
  alternatePositions: "LM, CAM, RW, ST, LW",
  overall: 81,
  potential: 0,
  nation: "Morocco",
  club: "Real Madrid",
  league: "LaLiga",
  pace: 85,
  shooting: 77,
  passing: 79,
  dribbling: 88,
  defending: 32,
  physical: 52,
  weakFoot: 4,
  skillMoves: 5,
  preferredFoot: "Left",
  height: 170,
  weight: 59,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-231410.74f4e944b453fa4c2babcadb4e80d34e9c5a757f788370b0193697a045ca9eae.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// PEDRI
// =========================================================

addPlayer({
  id: 251854,
  name: "Pedri",
  position: "CM",
  alternatePositions: "CDM, CAM",
  overall: 90,
  potential: 0,
  nation: "Spain",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 76,
  shooting: 75,
  passing: 89,
  dribbling: 91,
  defending: 77,
  physical: 75,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 174,
  weight: 60,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-251854.309a1de3fb9a889bf62ff666f2ba4a3fdec1226d3d407c5e51205b876e6b013a.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// RAPHINHA
// =========================================================

addPlayer({
  id: 233419,
  name: "Raphinha",
  position: "LW",
  alternatePositions: "RM, LM, CAM, RW, ST",
  overall: 88,
  potential: 0,
  nation: "Brazil",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 91,
  shooting: 86,
  passing: 85,
  dribbling: 87,
  defending: 54,
  physical: 76,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 176,
  weight: 68,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-233419.e54722c7dda8778b40d36892215268fbe6619af07bb0771f45627a74bac41c2c.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// FRENKIE DE JONG
// =========================================================

addPlayer({
  id: 228702,
  name: "Frenkie de Jong",
  position: "CM",
  alternatePositions: "CDM, CAM",
  overall: 86,
  potential: 0,
  nation: "Netherlands",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 77,
  shooting: 70,
  passing: 85,
  dribbling: 84,
  defending: 77,
  physical: 77,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 181,
  weight: 74,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-228702.e33e4240c2b4a66e2a267d6fd0a110ed3d1c31b9a7f66c8b3cf641cfaf3e70ad.webp",
  dataVerified: true,
  imageStatus: "futgg",
});
// =========================================================
// JOAN GARCÍA
// =========================================================

addPlayer({
  id: 259532,
  name: "Joan García",
  position: "GK",
  alternatePositions: "",
  overall: 86,
  potential: 0,
  nation: "Spain",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 85,
  shooting: 85,
  passing: 80,
  dribbling: 88,
  defending: 46,
  physical: 84,
  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Right",
  height: 193,
  weight: 85,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-259532.17a84329a8d5b6911896d40a6b8e5b2310fb269d0c494d8490902839ce88aeea.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// PAU CUBARSÍ
// =========================================================

addPlayer({
  id: 278046,
  name: "Pau Cubarsí",
  position: "CB",
  alternatePositions: "",
  overall: 86,
  potential: 0,
  nation: "Spain",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 78,
  shooting: 44,
  passing: 69,
  dribbling: 77,
  defending: 85,
  physical: 81,
  weakFoot: 4,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 183,
  weight: 74,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-278046.bdbf110214e5d54eabd6c9672ae15326754cb0cfbdebd8fa812b764f1b5f8703.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// FERMÍN
// =========================================================

addPlayer({
  id: 277179,
  name: "Fermín",
  position: "CAM",
  alternatePositions: "CM, LM",
  overall: 85,
  potential: 0,
  nation: "Spain",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 81,
  shooting: 84,
  passing: 80,
  dribbling: 84,
  defending: 63,
  physical: 72,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 174,
  weight: 64,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-277179.3e96d59619874801116fc5117b3533ca690aa78e25d1e77a6ccf1b7c3d3633d8.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ERIC GARCÍA
// =========================================================

addPlayer({
  id: 245037,
  name: "Eric García",
  position: "CB",
  alternatePositions: "RB, CDM, CM",
  overall: 85,
  potential: 0,
  nation: "Spain",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 79,
  shooting: 58,
  passing: 77,
  dribbling: 76,
  defending: 86,
  physical: 82,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 183,
  weight: 76,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-245037.974be2ab37bf9afb177070d13abe26e8ade860ddf11cd96014edc8338afd33dc.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JULES KOUNDÉ
// =========================================================

addPlayer({
  id: 241486,
  name: "Jules Koundé",
  position: "RB",
  alternatePositions: "CB, RM",
  overall: 85,
  potential: 0,
  nation: "France",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 82,
  shooting: 53,
  passing: 74,
  dribbling: 78,
  defending: 83,
  physical: 83,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 181,
  weight: 84,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241486.c75bb487d6b7940bed17d0bdadab1f0446020e20e9ca009c204853f3f017bb39.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// GAVI
// =========================================================

addPlayer({
  id: 264240,
  name: "Gavi",
  position: "CM",
  alternatePositions: "CDM, LM, CAM, LW",
  overall: 83,
  potential: 0,
  nation: "Spain",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 76,
  shooting: 66,
  passing: 78,
  dribbling: 85,
  defending: 68,
  physical: 70,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 173,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-264240.7e78d6d0af38ad21e396bcca3e137c70ad32823cc3ff66ce349257eebde236d5.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// BALDE
// =========================================================

addPlayer({
  id: 263578,
  name: "Balde",
  position: "LB",
  alternatePositions: "LM",
  overall: 82,
  potential: 0,
  nation: "Spain",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 90,
  shooting: 52,
  passing: 75,
  dribbling: 79,
  defending: 77,
  physical: 69,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 175,
  weight: 69,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-263578.9289c6291c097e9791d162e0d5db3b32ff94d65c8059f0a83132a81edb2cab17.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JOÃO CANCELO
// =========================================================

addPlayer({
  id: 210514,
  name: "João Cancelo",
  position: "LB",
  alternatePositions: "RB, RM, LM",
  overall: 83,
  potential: 0,
  nation: "Portugal",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 85,
  shooting: 71,
  passing: 85,
  dribbling: 86,
  defending: 79,
  physical: 72,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 182,
  weight: 74,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-210514.a33fe6886094ea895515f5fa1d0bece5877a2f962a247e17a0399439bc46fb44.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ISMAEL SAIBARI
// =========================================================

addPlayer({
  id: 259480,
  name: "Ismael Saibari",
  position: "CAM",
  alternatePositions: "CM, CDM, ST",
  overall: 83,
  potential: 0,
  nation: "Morocco",
  club: "Bayern München",
  league: "Bundesliga",
  pace: 83,
  shooting: 73,
  passing: 77,
  dribbling: 83,
  defending: 55,
  physical: 82,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 185,
  weight: 81,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-259480.a2ccc3b329d3b0699771ae2a269f7d2b07eedbc6876a73de93a21cf7e1ecfa63.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JONATHAN TAH
// =========================================================

addPlayer({
  id: 213331,
  name: "Jonathan Tah",
  position: "CB",
  alternatePositions: "",
  overall: 87,
  potential: 0,
  nation: "Germany",
  club: "Bayern München",
  league: "Bundesliga",
  pace: 75,
  shooting: 30,
  passing: 64,
  dribbling: 58,
  defending: 89,
  physical: 87,
  weakFoot: 2,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 195,
  weight: 0,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-213331.1e412f4a963de630727a476b17f2421f98924363651766ccec264de5c4902323.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// LUIS DÍAZ
// =========================================================

addPlayer({
  id: 241084,
  name: "Luis Díaz",
  position: "LM",
  alternatePositions: "LW, ST",
  overall: 88,
  potential: 0,
  nation: "Colombia",
  club: "Bayern München",
  league: "Bundesliga",
  pace: 82,
  shooting: 82,
  passing: 83,
  dribbling: 87,
  defending: 44,
  physical: 74,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 180,
  weight: 0,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241084.9b059a7858d79c611507c26f37e01ca628890f6879eb6fc8da0ac82016f3498f.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// DAYOT UPAMECANO
// =========================================================

addPlayer({
  id: 229558,
  name: "Dayot Upamecano",
  position: "CB",
  alternatePositions: "",
  overall: 87,
  potential: 0,
  nation: "France",
  club: "Bayern München",
  league: "Bundesliga",
  pace: 80,
  shooting: 45,
  passing: 65,
  dribbling: 75,
  defending: 86,
  physical: 83,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 186,
  weight: 0,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-229558.8396289283de4e304c5294adea71106ad327d38d2745d82724405d6ce9663382.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// KONRAD LAIMER
// =========================================================

addPlayer({
  id: 225375,
  name: "Konrad Laimer",
  position: "RB",
  alternatePositions: "LB, CDM, RM",
  overall: 85,
  potential: 0,
  nation: "Austria",
  club: "Bayern München",
  league: "Bundesliga",
  pace: 86,
  shooting: 69,
  passing: 78,
  dribbling: 77,
  defending: 81,
  physical: 77,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 180,
  weight: 0,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-225375.5b05f84117e4bdf9ac5eb5c1718a8aac76f1fc8054585ec4e486c31843ab30c1.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ALISSON
// =========================================================

addPlayer({
  id: 212831,
  name: "Alisson",
  position: "GK",
  alternatePositions: "",
  overall: 87,
  potential: 0,
  nation: "Brazil",
  club: "Liverpool",
  league: "Premier League",
  pace: 85,
  shooting: 87,
  passing: 82,
  dribbling: 86,
  defending: 50,
  physical: 86,
  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Right",
  height: 193,
  weight: 0,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-212831.521c31ef3203a41067929ead899dbf956890a5379a3fe135d5723702c54b1071.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// FLORIAN WIRTZ
// =========================================================

addPlayer({
  id: 256630,
  name: "Florian Wirtz",
  position: "CAM",
  alternatePositions: "CM, LM, LW",
  overall: 86,
  potential: 0,
  nation: "Germany",
  club: "Liverpool",
  league: "Premier League",
  pace: 77,
  shooting: 79,
  passing: 86,
  dribbling: 88,
  defending: 54,
  physical: 61,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 177,
  weight: 0,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-256630.dd973ed1ec9d9f5abb925bb3cdcc26baa9b7f1b01cf15820873cc71e8f6a6a6d.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// HUGO EKITIKÉ
// =========================================================

addPlayer({
  id: 257289,
  name: "Hugo Ekitiké",
  position: "ST",
  alternatePositions: "CAM",
  overall: 85,
  potential: 0,
  nation: "France",
  club: "Liverpool",
  league: "Premier League",
  pace: 86,
  shooting: 83,
  passing: 72,
  dribbling: 84,
  defending: 33,
  physical: 73,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 190,
  weight: 0,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-257289.e7d6de46a65e30640169f0391b69e5d9505dac4a4f5fbceee04ab5ff8d8ae9d3.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// RYAN GRAVENBERCH
// =========================================================

addPlayer({
  id: 246104,
  name: "Ryan Gravenberch",
  position: "CM",
  alternatePositions: "CDM",
  overall: 85,
  potential: 0,
  nation: "Netherlands",
  club: "Liverpool",
  league: "Premier League",
  pace: 79,
  shooting: 76,
  passing: 81,
  dribbling: 83,
  defending: 80,
  physical: 80,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 190,
  weight: 77,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-246104.edf911034803186be1b17b6252748f88913a855c54a36aee628420e57a96179f.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// BRADLEY BARCOLA
// =========================================================

addPlayer({
  id: 50596300,
  name: "Bradley Barcola",
  position: "LW",
  alternatePositions: "RM, LM, RW",
  overall: 85,
  potential: 0,
  nation: "France",
  club: "Liverpool",
  league: "Premier League",
  pace: 92,
  shooting: 76,
  passing: 78,
  dribbling: 84,
  defending: 39,
  physical: 67,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 188,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-50596300.51490fa7daff9c622892e9ff7c3af697cd19a0fb6840eed984f9182a72065d92.webp",
  dataVerified: true,
  imageStatus: "futgg",
});
// =========================================================
// MARQUINHOS
// =========================================================

addPlayer({
  id: 207865,
  name: "Marquinhos",
  position: "CB",
  alternatePositions: "CDM",
  overall: 87,
  potential: 0,
  nation: "Brazil",
  club: "Paris Saint-Germain",
  league: "Ligue 1",
  pace: 78,
  shooting: 31,
  passing: 75,
  dribbling: 67,
  defending: 88,
  physical: 77,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 183,
  weight: 75,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-207865.f38727b2900fcce61c556966240d5deb2a680ae45a18d033ea8fbd7c0885ee1d.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// FABIÁN RUIZ
// =========================================================

addPlayer({
  id: 226271,
  name: "Fabián Ruiz",
  position: "CM",
  alternatePositions: "CDM, CAM",
  overall: 86,
  potential: 0,
  nation: "Spain",
  club: "Paris Saint-Germain",
  league: "Ligue 1",
  pace: 55,
  shooting: 73,
  passing: 86,
  dribbling: 81,
  defending: 73,
  physical: 76,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 189,
  weight: 70,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-226271.6a527e6803f40bf67016af492b07ce3dabe04ff1672e748aa9b17a55baecb877.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// DÉSIRÉ DOUÉ
// =========================================================

addPlayer({
  id: 271421,
  name: "Désiré Doué",
  position: "CAM",
  alternatePositions: "LW, RW, CM",
  overall: 86,
  potential: 0,
  nation: "France",
  club: "Paris Saint-Germain",
  league: "Ligue 1",
  pace: 87,
  shooting: 82,
  passing: 82,
  dribbling: 90,
  defending: 43,
  physical: 66,
  weakFoot: 4,
  skillMoves: 5,
  preferredFoot: "Right",
  height: 181,
  weight: 76,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-271421.313fc272f8d02650f9770f250ba93e7373185d9894dd42506420f14a2916b2a1.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// IÑIGO MARTÍNEZ
// =========================================================

addPlayer({
  id: 204525,
  name: "Iñigo Martínez",
  position: "CB",
  alternatePositions: "",
  overall: 84,
  potential: 0,
  nation: "Spain",
  club: "Al Nassr",
  league: "Saudi Pro League",
  pace: 61,
  shooting: 34,
  passing: 76,
  dribbling: 55,
  defending: 86,
  physical: 77,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Left",
  height: 182,
  weight: 77,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-204525.598ad273ff5e05ca42d1c2c88220cd98874bbec6d984f4a2e78fa6da8b434d5f.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JOÃO FÉLIX
// =========================================================

addPlayer({
  id: 242444,
  name: "João Félix",
  position: "ST",
  alternatePositions: "CAM, CF",
  overall: 82,
  potential: 0,
  nation: "Portugal",
  club: "Al Nassr",
  league: "Saudi Pro League",
  pace: 79,
  shooting: 80,
  passing: 79,
  dribbling: 86,
  defending: 35,
  physical: 60,
  weakFoot: 4,
  skillMoves: 5,
  preferredFoot: "Right",
  height: 181,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "Low",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-242444.f4e2a1b4b92fbc5d06fd9483daea5c86d6a12552162a4ad0557a00698c8b6bb4.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// KINGSLEY COMAN
// =========================================================

addPlayer({
  id: 213345,
  name: "Kingsley Coman",
  position: "LW",
  alternatePositions: "LM, RW",
  overall: 83,
  potential: 0,
  nation: "France",
  club: "Al Nassr",
  league: "Saudi Pro League",
  pace: 88,
  shooting: 77,
  passing: 78,
  dribbling: 87,
  defending: 29,
  physical: 64,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 180,
  weight: 76,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-213345.259ac9bf492880e23c02a51282746cdc09842dbfdc257846d6a8223dd64fbf35.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MOHAMED SIMAKAN
// =========================================================

addPlayer({
  id: 243854,
  name: "Mohamed Simakan",
  position: "CB",
  alternatePositions: "RB",
  overall: 82,
  potential: 0,
  nation: "France",
  club: "Al Nassr",
  league: "Saudi Pro League",
  pace: 84,
  shooting: 32,
  passing: 57,
  dribbling: 58,
  defending: 82,
  physical: 84,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 187,
  weight: 82,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-243854.4aa8f039bf3098f489faf23235121fe073451c15b2ebc3fc583cb2edeae56238.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// RODRIGO DE PAUL
// =========================================================

addPlayer({
  id: 212616,
  name: "Rodrigo De Paul",
  position: "CM",
  alternatePositions: "CDM, RM, CAM",
  overall: 83,
  potential: 0,
  nation: "Argentina",
  club: "Inter Miami CF",
  league: "MLS",
  pace: 75,
  shooting: 77,
  passing: 83,
  dribbling: 83,
  defending: 75,
  physical: 83,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 180,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-212616.47197c24075552b577c28a200f96d84313ebc529cb0b0816ad948fc6bd7edc2d.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// CASEMIRO
// =========================================================

addPlayer({
  id: 200145,
  name: "Casemiro",
  position: "CDM",
  alternatePositions: "CM",
  overall: 83,
  potential: 0,
  nation: "Brazil",
  club: "Inter Miami CF",
  league: "MLS",
  pace: 35,
  shooting: 74,
  passing: 80,
  dribbling: 69,
  defending: 83,
  physical: 78,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 185,
  weight: 84,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-200145.4500c1b234bd826a9485cf011db4d4c4ed8f8451437e9936043669e75f2540c3.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// RÚBEN DIAS
// =========================================================

addPlayer({
  id: 239818,
  name: "Rúben Dias",
  position: "CB",
  alternatePositions: "",
  overall: 87,
  potential: 0,
  nation: "Portugal",
  club: "Manchester City",
  league: "Premier League",
  pace: 58,
  shooting: 44,
  passing: 69,
  dribbling: 69,
  defending: 87,
  physical: 83,
  weakFoot: 4,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 187,
  weight: 82,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-239818.e7b78e8f16755437e308b06e4a2eb8f9957cd9e42a8fa288f874ac6b1fb743df.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ENZO FERNÁNDEZ
// =========================================================

addPlayer({
  id: 247090,
  name: "Enzo Fernández",
  position: "CM",
  alternatePositions: "CDM, CAM",
  overall: 86,
  potential: 0,
  nation: "Argentina",
  club: "Manchester City",
  league: "Premier League",
  pace: 68,
  shooting: 78,
  passing: 86,
  dribbling: 83,
  defending: 74,
  physical: 76,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 178,
  weight: 78,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-50578738.6a745f4142d52f7b7649f7990c2e8b34cdc2c65666d2f94128bac7ada3a794e6.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// RAYAN CHERKI
// =========================================================

addPlayer({
  id: 251570,
  name: "Rayan Cherki",
  position: "RW",
  alternatePositions: "RM, CAM, CM",
  overall: 86,
  potential: 0,
  nation: "France",
  club: "Manchester City",
  league: "Premier League",
  pace: 74,
  shooting: 79,
  passing: 85,
  dribbling: 91,
  defending: 41,
  physical: 67,
  weakFoot: 5,
  skillMoves: 5,
  preferredFoot: "Left",
  height: 177,
  weight: 71,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-251570.ec17b8877f02a91294427e877aecb6da564cfbc986f1b40fa8d557bfa6715fe1.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JOŠKO GVARDIOL
// =========================================================

addPlayer({
  id: 251517,
  name: "Joško Gvardiol",
  position: "CB",
  alternatePositions: "LB",
  overall: 85,
  potential: 0,
  nation: "Croatia",
  club: "Manchester City",
  league: "Premier League",
  pace: 78,
  shooting: 70,
  passing: 76,
  dribbling: 77,
  defending: 85,
  physical: 82,
  weakFoot: 5,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 185,
  weight: 80,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-251517.933a3e4f94931c91b1a98990219e73e8c83726589b8a794e70ed4185cfeddf3a.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MARC GUEHI
// =========================================================

addPlayer({
  id: 241159,
  name: "Marc Guehi",
  position: "CB",
  alternatePositions: "",
  overall: 85,
  potential: 0,
  nation: "England",
  club: "Manchester City",
  league: "Premier League",
  pace: 69,
  shooting: 46,
  passing: 70,
  dribbling: 72,
  defending: 85,
  physical: 82,
  weakFoot: 5,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 182,
  weight: 80,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241159.2a7d826dd9ce7d2a530ba4f77050f4007cb680cf73a3cfa1c2aa3a0093647b70.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// PHIL FODEN
// =========================================================

addPlayer({
  id: 237692,
  name: "Phil Foden",
  position: "CAM",
  alternatePositions: "CM, RW",
  overall: 84,
  potential: 0,
  nation: "England",
  club: "Manchester City",
  league: "Premier League",
  pace: 77,
  shooting: 82,
  passing: 82,
  dribbling: 88,
  defending: 57,
  physical: 53,
  weakFoot: 2,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 171,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,format=auto,width=300/2027/player-item/27-237692.3be5c1faa8b96242c3be4dc9c13d49563c4bd279d1a935d190225e1a08f4bfa4.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JÉRÉMY DOKU
// =========================================================

addPlayer({
  id: 246420,
  name: "Jérémy Doku",
  position: "LW",
  alternatePositions: "LM, RW, RM",
  overall: 84,
  potential: 0,
  nation: "Belgium",
  club: "Manchester City",
  league: "Premier League",
  pace: 91,
  shooting: 75,
  passing: 78,
  dribbling: 88,
  defending: 40,
  physical: 72,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 173,
  weight: 66,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-246420.14e26967cd14b5dc9f5c0c320a5285ef3dcac0b5b6b5cbebf8c12c631873c2f2.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// YOURI TIELEMANS
// =========================================================

addPlayer({
  id: 216393,
  name: "Youri Tielemans",
  position: "CM",
  alternatePositions: "CDM, CAM",
  overall: 85,
  potential: 0,
  nation: "Belgium",
  club: "Manchester United",
  league: "Premier League",
  pace: 60,
  shooting: 79,
  passing: 85,
  dribbling: 80,
  defending: 76,
  physical: 70,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 176,
  weight: 72,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-216393.ed50dfba4459c61e96dbcf5a84c2b79aaaee7207acac657e14a8dec13b77c478.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MATHEUS CUNHA
// =========================================================

addPlayer({
  id: 240243,
  name: "Matheus Cunha",
  position: "CAM",
  alternatePositions: "ST, LW",
  overall: 84,
  potential: 0,
  nation: "Brazil",
  club: "Manchester United",
  league: "Premier League",
  pace: 83,
  shooting: 82,
  passing: 77,
  dribbling: 86,
  defending: 41,
  physical: 76,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 183,
  weight: 76,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-240243.274a1cb8689c4339d84a5ff6f876c87f0a38bfcffe7f44f7708173428e6a1be2.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// BRYAN MBEUMO
// =========================================================

addPlayer({
  id: 243014,
  name: "Bryan Mbeumo",
  position: "RW",
  alternatePositions: "RM, ST",
  overall: 84,
  potential: 0,
  nation: "Cameroon",
  club: "Manchester United",
  league: "Premier League",
  pace: 87,
  shooting: 83,
  passing: 78,
  dribbling: 86,
  defending: 48,
  physical: 75,
  weakFoot: 2,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 171,
  weight: 75,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-243014.e8d1b0183bad40a13bc22a47d1e99599a78170652b71fc716433566d776bbd13.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MARCUS RASHFORD
// =========================================================

addPlayer({
  id: 231677,
  name: "Marcus Rashford",
  position: "LW",
  alternatePositions: "LM, ST",
  overall: 82,
  potential: 0,
  nation: "England",
  club: "Manchester United",
  league: "Premier League",
  pace: 85,
  shooting: 81,
  passing: 75,
  dribbling: 83,
  defending: 40,
  physical: 75,
  weakFoot: 3,
  skillMoves: 5,
  preferredFoot: "Right",
  height: 188,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-231677.95b4073f4bc8fc7bfd531b9cdb1f9b9dd36ac23f38ee600da2587936e27b23c1.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ALPHONSO DAVIES
// =========================================================

addPlayer({
  id: 234396,
  name: "Alphonso Davies",
  position: "LB",
  alternatePositions: "LM",
  overall: 82,
  potential: 0,
  nation: "Canada",
  club: "Bayern München",
  league: "Bundesliga",
  pace: 93,
  shooting: 66,
  passing: 78,
  dribbling: 84,
  defending: 74,
  physical: 76,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 185,
  weight: 77,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-234396.9e849a56d812291e2af03569f318b7d6c99eac6c072651dfe01819bc8c7d0dd1.webp",
  dataVerified: true,
  imageStatus: "futgg",
});
// =========================================================
// DAVID RAYA
// =========================================================

addPlayer({
  id: 220901,
  name: "David Raya",
  position: "GK",
  alternatePositions: "",
  overall: 88,
  potential: 0,
  nation: "Spain",
  club: "Arsenal",
  league: "Premier League",
  pace: 58,
  shooting: 86,
  passing: 88,
  dribbling: 88,
  defending: 58,
  physical: 86,
  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Right",
  height: 186,
  weight: 83,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-220901.21e31c195604830055ece09e27b09bf2f1f3c737ae97f1ef46a1b5c5fd955570.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// DECLAN RICE
// =========================================================

addPlayer({
  id: 234378,
  name: "Declan Rice",
  position: "CDM",
  alternatePositions: "CM",
  overall: 88,
  potential: 0,
  nation: "England",
  club: "Arsenal",
  league: "Premier League",
  pace: 72,
  shooting: 75,
  passing: 86,
  dribbling: 81,
  defending: 85,
  physical: 84,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 188,
  weight: 80,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-234378.1c577dcde7013c50fd3264886c2f1d066e74fe8504313f22e9ed9e62beb33a21.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MARTIN ØDEGAARD
// =========================================================

addPlayer({
  id: 222665,
  name: "Martin Ødegaard",
  position: "CM",
  alternatePositions: "CAM",
  overall: 86,
  potential: 0,
  nation: "Norway",
  club: "Arsenal",
  league: "Premier League",
  pace: 65,
  shooting: 78,
  passing: 88,
  dribbling: 87,
  defending: 66,
  physical: 63,
  weakFoot: 2,
  skillMoves: 5,
  preferredFoot: "Left",
  height: 178,
  weight: 68,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-222665.6bbe274914550ba5db5c8d4f7695288df77f534099e55a934cb4fc93ff9ec0c4.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// EBERECHI EZE
// =========================================================

addPlayer({
  id: 235794,
  name: "Eberechi Eze",
  position: "CAM",
  alternatePositions: "CM, LM, LW",
  overall: 84,
  potential: 0,
  nation: "England",
  club: "Arsenal",
  league: "Premier League",
  pace: 74,
  shooting: 80,
  passing: 82,
  dribbling: 87,
  defending: 57,
  physical: 68,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 178,
  weight: 69,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-235794.54b17bddbafd14d76e8ee679b96aba670ad95a4bd41b26f204636c81384d4731.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JURRIËN TIMBER
// =========================================================

addPlayer({
  id: 251805,
  name: "Jurriën Timber",
  position: "RB",
  alternatePositions: "CB, LB, RM, LM",
  overall: 84,
  potential: 0,
  nation: "Netherlands",
  club: "Arsenal",
  league: "Premier League",
  pace: 76,
  shooting: 48,
  passing: 76,
  dribbling: 78,
  defending: 83,
  physical: 78,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 179,
  weight: 78,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-251805.428f7346e9c1eea3554a92673989fe4af2feda42d2197c69f081532122f43619.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MARCOS LLORENTE
// =========================================================

addPlayer({
  id: 226161,
  name: "Marcos Llorente",
  position: "RB",
  alternatePositions: "RM, CM",
  overall: 85,
  potential: 0,
  nation: "Spain",
  club: "Atlético de Madrid",
  league: "LaLiga",
  pace: 91,
  shooting: 79,
  passing: 80,
  dribbling: 82,
  defending: 79,
  physical: 83,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 183,
  weight: 74,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-226161.8b09491ba501f869e22917c20ee946a7497ae357a217b3c07685c084c7e0ffbd.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// GRIMALDO
// =========================================================

addPlayer({
  id: 210035,
  name: "Grimaldo",
  position: "LM",
  alternatePositions: "LB, CAM",
  overall: 85,
  potential: 0,
  nation: "Spain",
  club: "Atlético de Madrid",
  league: "LaLiga",
  pace: 73,
  shooting: 77,
  passing: 87,
  dribbling: 85,
  defending: 72,
  physical: 65,
  weakFoot: 2,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 171,
  weight: 0,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-210035.d13c12431091802819133bbf9f4f8da9411e74f1f7bcb3bd94591d1ef7d748e6.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ALEXANDER SØRLOTH
// =========================================================

addPlayer({
  id: 216549,
  name: "Alexander Sørloth",
  position: "ST",
  alternatePositions: "RM, RW",
  overall: 83,
  potential: 0,
  nation: "Norway",
  club: "Atlético de Madrid",
  league: "LaLiga",
  pace: 75,
  shooting: 83,
  passing: 71,
  dribbling: 74,
  defending: 37,
  physical: 83,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 196,
  weight: 0,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-216549.f7c4927ad02fa35add6cb23e01ef537f55d754f710644d5028014fc555e7a7a3.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// ALEXIS MAC ALLISTER
// =========================================================

addPlayer({
  id: 239837,
  name: "Alexis Mac Allister",
  position: "CM",
  alternatePositions: "CDM",
  overall: 84,
  potential: 0,
  nation: "Argentina",
  club: "Liverpool",
  league: "Premier League",
  pace: 61,
  shooting: 81,
  passing: 83,
  dribbling: 82,
  defending: 77,
  physical: 74,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 176,
  weight: 72,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-239837.42a5b4dd3764cfafe6d571adc1a60d590b375cf3b000e0ca81a064a27afd6f39.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// GIORGI MAMARDASHVILI
// =========================================================

addPlayer({
  id: 262621,
  name: "Giorgi Mamardashvili",
  position: "GK",
  alternatePositions: "",
  overall: 83,
  potential: 0,
  nation: "Georgia",
  club: "Liverpool",
  league: "Premier League",
  pace: 82,
  shooting: 81,
  passing: 75,
  dribbling: 83,
  defending: 47,
  physical: 82,
  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Left",
  height: 199,
  weight: 88,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-262621.579145287c48b6000be203dfdc085ca7e6812e26e5096570b9999ce5d4abc547.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// LUIS SUÁREZ
// =========================================================

addPlayer({
  id: 176580,
  name: "Luis Suárez",
  position: "ST",
  alternatePositions: "CAM",
  overall: 78,
  potential: 0,
  nation: "Uruguay",
  club: "Inter Miami CF",
  league: "MLS",
  pace: 51,
  shooting: 81,
  passing: 76,
  dribbling: 74,
  defending: 41,
  physical: 75,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 185,
  weight: 81,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Low",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-176580.11032754288359dd78949e058eb12d3ac6e1ff53a0c7399c9f46f5579fcc7239.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// GERMÁN BERTERAME
// =========================================================

addPlayer({
  id: 237248,
  name: "Germán Berterame",
  position: "ST",
  alternatePositions: "LW, RW",
  overall: 77,
  potential: 0,
  nation: "Mexico",
  club: "Inter Miami CF",
  league: "MLS",
  pace: 76,
  shooting: 77,
  passing: 73,
  dribbling: 69,
  defending: 34,
  physical: 73,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 178,
  weight: 0,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Low",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-237248.de0f233176e30863d907f803b9dedaf848f045962c1728ad825bb8f679cff09a.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// DANI OLMO
// =========================================================

addPlayer({
  id: 244260,
  name: "Dani Olmo",
  position: "CAM",
  alternatePositions: "CM, LM, LW",
  overall: 84,
  potential: 0,
  nation: "Spain",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 74,
  shooting: 79,
  passing: 82,
  dribbling: 85,
  defending: 51,
  physical: 59,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 179,
  weight: 72,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-244260.3d43e0ccd8fcdbf250c5e162530580263b12463d6661187078de66ddecdf8d31.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// KARIM ADEYEMI
// =========================================================

addPlayer({
  id: 251852,
  name: "Karim Adeyemi",
  position: "RM",
  alternatePositions: "LM, CAM, RW, ST, LW",
  overall: 82,
  potential: 0,
  nation: "Germany",
  club: "FC Barcelona",
  league: "LaLiga",
  pace: 95,
  shooting: 80,
  passing: 72,
  dribbling: 82,
  defending: 36,
  physical: 69,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 180,
  weight: 77,
  attackingWorkRate: "High",
  defensiveWorkRate: "Low",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-251852.0229fe53dcd631ce3edbcb47f210c666dda975c248ec5f943632551a8da6fa68.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MOISÉS CAICEDO
// =========================================================

addPlayer({
  id: 256079,
  name: "Moisés Caicedo",
  position: "CDM",
  alternatePositions: "CM",
  overall: 86,
  potential: 0,
  nation: "Ecuador",
  club: "Chelsea",
  league: "Premier League",
  pace: 69,
  shooting: 68,
  passing: 77,
  dribbling: 81,
  defending: 84,
  physical: 82,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 178,
  weight: 73,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-256079.2cb286a491f72c8783caa0c3a9e4eb2d05a24cc6d798678d510f4270d18dc267.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// COLE PALMER
// =========================================================

addPlayer({
  id: 257534,
  name: "Cole Palmer",
  position: "CAM",
  alternatePositions: "RM, CM, RW",
  overall: 85,
  potential: 0,
  nation: "England",
  club: "Chelsea",
  league: "Premier League",
  pace: 75,
  shooting: 83,
  passing: 85,
  dribbling: 85,
  defending: 50,
  physical: 64,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 185,
  weight: 77,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-257534.16c4a831ac9727e14079f0cdb10615186bf7ea5a193e70f0ebaa27203964370a.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// REECE JAMES
// =========================================================

addPlayer({
  id: 238074,
  name: "Reece James",
  position: "RB",
  alternatePositions: "CDM, CM",
  overall: 84,
  potential: 0,
  nation: "England",
  club: "Chelsea",
  league: "Premier League",
  pace: 76,
  shooting: 71,
  passing: 83,
  dribbling: 78,
  defending: 83,
  physical: 82,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 180,
  weight: 91,
  attackingWorkRate: "High",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-238074.dfdbcb391ae0ec64288c3deab95f6b19c32db02326c29a354dfd370ea451c3ec.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// JOÃO PEDRO
// =========================================================

addPlayer({
  id: 252042,
  name: "João Pedro",
  position: "ST",
  alternatePositions: "CAM",
  overall: 83,
  potential: 0,
  nation: "Brazil",
  club: "Chelsea",
  league: "Premier League",
  pace: 77,
  shooting: 83,
  passing: 74,
  dribbling: 84,
  defending: 38,
  physical: 74,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 186,
  weight: 82,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-252042.6acc92c35e45624b7b991165ac8cf0fd36a0a5fb53e71e5fa02ce169bcb24141.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// MAXENCE LACROIX
// =========================================================

addPlayer({
  id: 244067,
  name: "Maxence Lacroix",
  position: "CB",
  alternatePositions: "",
  overall: 82,
  potential: 0,
  nation: "France",
  club: "Chelsea",
  league: "Premier League",
  pace: 86,
  shooting: 45,
  passing: 61,
  dribbling: 67,
  defending: 83,
  physical: 82,
  weakFoot: 2,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 190,
  weight: 89,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-244067.e3ea28cd80640a551fb9a93fe06fa8c9f4335d121dd1a1adc3cc6667a2fa792d.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

// =========================================================
// FINAL EXPORT
// =========================================================
// =========================================================
// INTER MILAN — LAUTARO MARTÍNEZ
// =========================================================

players.push({
  id: 231478,
  name: "Lautaro Martínez",
  position: "ST",
  alternatePositions: "",

  overall: 87,
  potential: 0,

  nation: "Argentina",
  club: "Lombardia FC",
  league: "Serie A Enilive",

  pace: 80,
  shooting: 88,
  passing: 76,
  dribbling: 85,
  defending: 51,
  physical: 74,

  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",

  height: 174,
  weight: 72,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-231478.9c0e12b58df2964ff31bdfd3a210fb30c07034da8eb19ad8a8cc1f39d5c9bbec.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// =========================================================
// INTER MILAN — NICOLÒ BARELLA
// =========================================================

players.push({
  id: 224232,
  name: "Nicolò Barella",
  position: "CM",
  alternatePositions: "CDM",

  overall: 87,
  potential: 0,

  nation: "Italy",
  club: "Lombardia FC",
  league: "Serie A Enilive",

  pace: 77,
  shooting: 78,
  passing: 84,
  dribbling: 86,
  defending: 81,
  physical: 72,

  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",

  height: 175,
  weight: 68,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-224232.f26ae84f76b809d39a6c07f734d2b53965eede3f5be3de18f9ccadb55cd19143.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// =========================================================
// INTER MILAN — ALESSANDRO BASTONI
// =========================================================

players.push({
  id: 237383,
  name: "Alessandro Bastoni",
  position: "CB",
  alternatePositions: "",

  overall: 86,
  potential: 0,

  nation: "Italy",
  club: "Lombardia FC",
  league: "Serie A Enilive",

  pace: 74,
  shooting: 47,
  passing: 76,
  dribbling: 78,
  defending: 86,
  physical: 82,

  weakFoot: 2,
  skillMoves: 2,
  preferredFoot: "Left",

  height: 190,
  weight: 75,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-237383.9c205c4084f6afe4a5ac98e46e45836267b3e100ca02314b4f6951c556ef3d74.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// =========================================================
// INTER MILAN — FEDERICO DIMARCO
// =========================================================

players.push({
  id: 226268,
  name: "Federico Dimarco",
  position: "LB",
  alternatePositions: "LM",

  overall: 86,
  potential: 0,

  nation: "Italy",
  club: "Lombardia FC",
  league: "Serie A Enilive",

  pace: 81,
  shooting: 78,
  passing: 85,
  dribbling: 81,
  defending: 80,
  physical: 74,

  weakFoot: 2,
  skillMoves: 3,
  preferredFoot: "Left",

  height: 174,
  weight: 75,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-226268.990477534da3a0c9bd72c56bd9e71cea0c1ce7292d30b1ade3155916ca482156.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// =========================================================
// INTER MILAN — MARCUS THURAM
// FC 27 TEAM OF THE WEEK 86
// =========================================================

players.push({
  id: 228093,
  name: "Marcus Thuram",
  position: "ST",
  alternatePositions: "",

  overall: 86,
  potential: 0,

  nation: "France",
  club: "Lombardia FC",
  league: "Serie A Enilive",

  pace: 87,
  shooting: 84,
  passing: 77,
  dribbling: 83,
  defending: 51,
  physical: 83,

  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",

  height: 192,
  weight: 90,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-228093.9bbaa6f38fa17e612f5bc82aae3960585c39193c5caf1e480f7e8f21dae01fe0.webp",

  dataVerified: true,
  imageStatus: "futgg"
});
// =========================================================
// AC MILAN — MIKE MAIGNAN
// =========================================================

players.push({
  id: 215698,
  name: "Mike Maignan",
  position: "GK",
  alternatePositions: "",

  overall: 87,
  potential: 0,

  nation: "France",
  club: "Milano FC",
  league: "Serie A Enilive",

  // GK: PAC = DIV, SHO = HAN, PAS = KIC,
  // DRI = REF, DEF = SPD, PHY = POS
  pace: 83,
  shooting: 86,
  passing: 81,
  dribbling: 89,
  defending: 64,
  physical: 84,

  weakFoot: 4,
  skillMoves: 1,
  preferredFoot: "Right",

  height: 191,
  weight: 0,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-215698.024232f634ce7cff4a0705c420565b5500f2a0b99774973b84e6badbdf618d07.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// =========================================================
// AC MILAN — ADRIEN RABIOT
// =========================================================

players.push({
  id: 210008,
  name: "Adrien Rabiot",
  position: "CM",
  alternatePositions: "",

  overall: 85,
  potential: 0,

  nation: "France",
  club: "Milano FC",
  league: "Serie A Enilive",

  pace: 81,
  shooting: 79,
  passing: 81,
  dribbling: 81,
  defending: 78,
  physical: 85,

  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Left",

  height: 191,
  weight: 80,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-210008.6f060c7a4becdc93ac48c967d1cfd3c9f258efeeac147ff53c34cac9f3a0507d.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// =========================================================
// AC MILAN — LUKA MODRIĆ
// =========================================================

players.push({
  id: 177003,
  name: "Luka Modrić",
  position: "CM",
  alternatePositions: "CDM, CAM",

  overall: 85,
  potential: 0,

  nation: "Croatia",
  club: "Milano FC",
  league: "Serie A Enilive",

  pace: 65,
  shooting: 75,
  passing: 87,
  dribbling: 86,
  defending: 73,
  physical: 59,

  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",

  height: 172,
  weight: 67,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-177003.c85fe646febd1a94d5ae688a954d1b794db0217bb724c6be5b7cbf66866fa109.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// =========================================================
// AC MILAN — CHRISTIAN PULISIC
// =========================================================

players.push({
  id: 227796,
  name: "Christian Pulisic",
  position: "CAM",
  alternatePositions: "RW, RM, ST",

  overall: 83,
  potential: 0,

  nation: "United States",
  club: "Milano FC",
  league: "Serie A Enilive",

  pace: 87,
  shooting: 83,
  passing: 81,
  dribbling: 84,
  defending: 47,
  physical: 60,

  weakFoot: 5,
  skillMoves: 4,
  preferredFoot: "Right",

  height: 178,
  weight: 73,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-227796.af27647a317c1580e0e5c36c82e994ebfde44bec95c944a743b68d8b8821e306.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// =========================================================
// AC MILAN — MARIO GILA
// =========================================================

players.push({
  id: 268804,
  name: "Mario Gila",
  position: "CB",
  alternatePositions: "",

  overall: 81,
  potential: 0,

  nation: "Spain",
  club: "Milano FC",
  league: "Serie A Enilive",

  pace: 85,
  shooting: 53,
  passing: 68,
  dribbling: 75,
  defending: 81,
  physical: 79,

  weakFoot: 4,
  skillMoves: 2,
  preferredFoot: "Right",

  height: 185,
  weight: 0,

  attackingWorkRate: "Unknown",
  defensiveWorkRate: "Unknown",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-268804.3ebd352a91a36450453ada1f60f3d6738b6f7da0ed90ec248737fc0ae980dd7c.webp",

  dataVerified: true,
  imageStatus: "futgg"
});
// ============================================================
// BORUSSIA DORTMUND — TOP 5
// ============================================================

// GREGOR KOBEL
players.push({
  id: 235073,
  name: "Gregor Kobel",
  position: "GK",
  alternatePositions: "",
  overall: 87,
  potential: 0,
  nation: "Switzerland",
  club: "Borussia Dortmund",
  league: "Bundesliga",

  // GK mapping:
  // PAC = DIV
  // SHO = HAN
  // PAS = KIC
  // DRI = REF
  // DEF = SPD
  // PHY = POS
  pace: 88,
  shooting: 85,
  passing: 64,
  dribbling: 88,
  defending: 44,
  physical: 86,

  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Right",

  height: 195,
  weight: 92,

  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-235073.313727af78e575cbd2fafe9582ee0bb7d5970866ac734b4f5fcef2764038bbce.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// NICO SCHLOTTERBECK
players.push({
  id: 247819,
  name: "Nico Schlotterbeck",
  position: "CB",
  alternatePositions: "",
  overall: 87,
  potential: 0,
  nation: "Germany",
  club: "Borussia Dortmund",
  league: "Bundesliga",

  pace: 81,
  shooting: 60,
  passing: 76,
  dribbling: 74,
  defending: 86,
  physical: 84,

  weakFoot: 2,
  skillMoves: 2,
  preferredFoot: "Left",

  height: 191,
  weight: 86,

  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-247819.6b43bee63f61bc0b434ddf6038f5dd762c92dac1e3b136677fb4621293dc7cd8.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// SERHOU GUIRASSY
players.push({
  id: 215441,
  name: "Serhou Guirassy",
  position: "ST",
  alternatePositions: "",
  overall: 85,
  potential: 0,
  nation: "Guinea",
  club: "Borussia Dortmund",
  league: "Bundesliga",

  pace: 72,
  shooting: 85,
  passing: 75,
  dribbling: 81,
  defending: 45,
  physical: 83,

  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",

  height: 187,
  weight: 82,

  attackingWorkRate: "High",
  defensiveWorkRate: "Low",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-215441.2c88924357423efc9fddaec210962b46e7bb2ec57ee20fd22d5ac46471d0490f.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// FELIX NMECHA — GOLD / RARE
players.push({
  id: 246863,
  name: "Felix Nmecha",
  position: "CM",
  alternatePositions: "CDM",
  overall: 85,
  potential: 0,
  nation: "Germany",
  club: "Borussia Dortmund",
  league: "Bundesliga",

  pace: 83,
  shooting: 78,
  passing: 78,
  dribbling: 84,
  defending: 82,
  physical: 88,

  weakFoot: 2,
  skillMoves: 4,
  preferredFoot: "Right",

  height: 194,
  weight: 80,

  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-246863.3c20561bc87e6c4fe457ff09929d7c8eb8f104a5269272f4a0d67eb9d19eede5.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// WALDEMAR ANTON
players.push({
  id: 229476,
  name: "Waldemar Anton",
  position: "CB",
  alternatePositions: "",
  overall: 84,
  potential: 0,
  nation: "Germany",
  club: "Borussia Dortmund",
  league: "Bundesliga",

  pace: 69,
  shooting: 47,
  passing: 68,
  dribbling: 67,
  defending: 85,
  physical: 85,

  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",

  height: 189,
  weight: 88,

  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-229476.51c36113b9ee4913b8ada7793b471b130bdbec4480b43b0fa52329b6e622a501.webp",

  dataVerified: true,
  imageStatus: "futgg"
});
// ============================================================
// SPURS — TOP 5 GOLD / RARE
// ============================================================

// SANDRO TONALI
players.push({
  id: 241096,
  name: "Sandro Tonali",
  position: "CDM",
  alternatePositions: "CM",
  overall: 85,
  potential: 0,
  nation: "Italy",
  club: "Spurs",
  league: "Premier League",

  pace: 79,
  shooting: 74,
  passing: 82,
  dribbling: 80,
  defending: 81,
  physical: 84,

  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Right",

  height: 181,
  weight: 79,

  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241096.cd028f95f94c0754d831e92347ed194f684a48c02e0a29b4977636876419a10b.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// PEDRO PORRO
players.push({
  id: 243576,
  name: "Pedro Porro",
  position: "RB",
  alternatePositions: "RM",
  overall: 83,
  potential: 0,
  nation: "Spain",
  club: "Spurs",
  league: "Premier League",

  pace: 76,
  shooting: 73,
  passing: 82,
  dribbling: 79,
  defending: 78,
  physical: 75,

  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",

  height: 173,
  weight: 69,

  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-243576.469ab50d67d83d21ce4343ee38b6297a74d6941703dff133eca61e525686b190.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// MARCOS SENESI
players.push({
  id: 236506,
  name: "Marcos Senesi",
  position: "CB",
  alternatePositions: "",
  overall: 82,
  potential: 0,
  nation: "Argentina",
  club: "Spurs",
  league: "Premier League",

  pace: 58,
  shooting: 43,
  passing: 73,
  dribbling: 71,
  defending: 83,
  physical: 80,

  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Left",

  height: 185,
  weight: 80,

  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-236506.b04a06578780052583edd814cc4a3a1ca95d5a32135ef55aa25b9913558600a5.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// OMAR MARMOUSH
players.push({
  id: 256675,
  name: "Omar Marmoush",
  position: "LW",
  alternatePositions: "LM, CAM, ST",
  overall: 82,
  potential: 0,
  nation: "Egypt",
  club: "Spurs",
  league: "Premier League",

  pace: 87,
  shooting: 83,
  passing: 76,
  dribbling: 83,
  defending: 34,
  physical: 69,

  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Right",

  height: 183,
  weight: 81,

  attackingWorkRate: "High",
  defensiveWorkRate: "Low",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-50588323.c476614100537390e3c32771f392fb7a4947954942158d36eb4dd9d52905a006.webp",

  dataVerified: true,
  imageStatus: "futgg"
});


// JAMES MADDISON
players.push({
  id: 220697,
  name: "James Maddison",
  position: "CAM",
  alternatePositions: "CM",
  overall: 82,
  potential: 0,
  nation: "England",
  club: "Spurs",
  league: "Premier League",

  pace: 65,
  shooting: 81,
  passing: 86,
  dribbling: 84,
  defending: 57,
  physical: 53,

  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",

  height: 175,
  weight: 73,

  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",

  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-220697.61de73980333f70d900fa1adf89dfb87b0791fd35b62cf69846421f274bc8ec4.webp",

  dataVerified: true,
  imageStatus: "futgg"
});
addPlayer({
id: 236987,
name: "Boubacar Kamara",
position: "CDM",
alternatePositions: "CM",
overall: 84,
potential: 0,
nation: "France",
club: "Aston Villa",
league: "Premier League",
pace: 64,
shooting: 56,
passing: 78,
dribbling: 78,
defending: 83,
physical: 78,
weakFoot: 4,
skillMoves: 3,
preferredFoot: "Right",
height: 178,
weight: 68,
attackingWorkRate: "Medium",
defensiveWorkRate: "High",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-236987.c8a71cc56f82a1974de7e9180dba78b7ef60ef1204d6a795394d624ec3d50c7e.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 210881,
name: "John McGinn",
position: "RM",
alternatePositions: "CM",
overall: 83,
potential: 0,
nation: "Scotland",
club: "Aston Villa",
league: "Premier League",
pace: 69,
shooting: 80,
passing: 81,
dribbling: 82,
defending: 78,
physical: 84,
weakFoot: 3,
skillMoves: 3,
preferredFoot: "Left",
height: 178,
weight: 68,
attackingWorkRate: "High",
defensiveWorkRate: "High",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-210881.c321bc01d1ec3186aab479fe49a4825919f7bb209246330aa22fd3f1779f2c8c.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 227174,
name: "Matty Cash",
position: "RB",
alternatePositions: "RM",
overall: 81,
potential: 0,
nation: "Poland",
club: "Aston Villa",
league: "Premier League",
pace: 70,
shooting: 67,
passing: 75,
dribbling: 76,
defending: 78,
physical: 76,
weakFoot: 3,
skillMoves: 2,
preferredFoot: "Right",
height: 185,
weight: 84,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-227174.71c05e2caa0196164465815691fd0124872288dc700e4c2dc59f3d2832ebec4d.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 241464,
name: "Pau Torres",
position: "CB",
alternatePositions: "",
overall: 81,
potential: 0,
nation: "Spain",
club: "Aston Villa",
league: "Premier League",
pace: 66,
shooting: 41,
passing: 75,
dribbling: 69,
defending: 83,
physical: 74,
weakFoot: 3,
skillMoves: 2,
preferredFoot: "Left",
height: 191,
weight: 80,
attackingWorkRate: "Medium",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241464.8187de6aa3e48ce0059309356b064c4591a09fc48944775449847971a2b87345.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 257057,
name: "Amadou Onana",
position: "CDM",
alternatePositions: "CM",
overall: 81,
potential: 0,
nation: "Belgium",
club: "Aston Villa",
league: "Premier League",
pace: 73,
shooting: 68,
passing: 74,
dribbling: 74,
defending: 81,
physical: 82,
weakFoot: 4,
skillMoves: 3,
preferredFoot: "Right",
height: 195,
weight: 95,
attackingWorkRate: "Medium",
defensiveWorkRate: "High",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-257057.65459690a0315fb3d9fa1287eb440fe53027f622236b85a1abd3cfeec782da8c.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 275771,
name: "Igor Thiago",
position: "ST",
alternatePositions: "",
overall: 82,
potential: 0,
nation: "Brazil",
club: "Brentford",
league: "Premier League",
pace: 74,
shooting: 83,
passing: 67,
dribbling: 75,
defending: 44,
physical: 85,
weakFoot: 4,
skillMoves: 3,
preferredFoot: "Right",
height: 191,
weight: 86,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-275771.a5438df8cc8c4a2b39122b9f70dcdf820cdbbed259f6876648fa319076df1cc5.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 277869,
name: "Michael Kayode",
position: "RB",
alternatePositions: "",
overall: 81,
potential: 0,
nation: "Italy",
club: "Brentford",
league: "Premier League",
pace: 81,
shooting: 49,
passing: 72,
dribbling: 76,
defending: 78,
physical: 80,
weakFoot: 3,
skillMoves: 3,
preferredFoot: "Right",
height: 179,
weight: 70,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-277869.19f0ea89d5a094a4e505ce2d020635f67dbee04586c505b88df48056a12e7c26.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 258601,
name: "Mamadou Sangaré",
position: "CM",
alternatePositions: "CDM",
overall: 81,
potential: 0,
nation: "Mali",
club: "Brentford",
league: "Premier League",
pace: 80,
shooting: 67,
passing: 76,
dribbling: 81,
defending: 78,
physical: 72,
weakFoot: 4,
skillMoves: 3,
preferredFoot: "Left",
height: 181,
weight: 72,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-258601.057fcc6d9b5a7e1dd7fcd056e8f6e318c40b101cc5d9452bc8dc6665550fd89c.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 240913,
name: "Caoimhín Kelleher",
position: "GK",
alternatePositions: "",
overall: 80,
potential: 0,
nation: "Republic of Ireland",
club: "Brentford",
league: "Premier League",
pace: 80,
shooting: 77,
passing: 79,
dribbling: 82,
defending: 51,
physical: 80,
weakFoot: 4,
skillMoves: 1,
preferredFoot: "Right",
height: 188,
weight: 81,
attackingWorkRate: "Medium",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-240913.d665bc7008f94ee4066802ddc05bdc58c63d27243cc7e2ef147d5b809fa17284.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 241508,
name: "Mikkel Damsgaard",
position: "CAM",
alternatePositions: "CM, LM",
overall: 80,
potential: 0,
nation: "Denmark",
club: "Brentford",
league: "Premier League",
pace: 66,
shooting: 73,
passing: 82,
dribbling: 81,
defending: 66,
physical: 65,
weakFoot: 3,
skillMoves: 4,
preferredFoot: "Right",
height: 180,
weight: 71,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-241508.c804768db49db1fdd066bd1976b6a4f68da322f9424a5b5ed5dd2592272f1c0a.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 258498,
name: "Bart Verbruggen",
position: "GK",
alternatePositions: "",
overall: 81,
potential: 0,
nation: "Netherlands",
club: "Brighton",
league: "Premier League",
pace: 80,
shooting: 77,
passing: 81,
dribbling: 84,
defending: 50,
physical: 81,
weakFoot: 3,
skillMoves: 1,
preferredFoot: "Right",
height: 193,
weight: 90,
attackingWorkRate: "Medium",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-258498.db07ed7428f569892bba05a3753a0b57dd3283c911da5294dd382d65a28df1d5.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 255565,
name: "Kaoru Mitoma",
position: "LM",
alternatePositions: "LW",
overall: 81,
potential: 0,
nation: "Japan",
club: "Brighton",
league: "Premier League",
pace: 83,
shooting: 76,
passing: 76,
dribbling: 86,
defending: 57,
physical: 63,
weakFoot: 4,
skillMoves: 4,
preferredFoot: "Right",
height: 178,
weight: 69,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-255565.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 204935,
name: "Jordan Pickford",
position: "GK",
alternatePositions: "",
overall: 85,
potential: 0,
nation: "England",
club: "Everton",
league: "Premier League",
pace: 83,
shooting: 80,
passing: 80,
dribbling: 84,
defending: 53,
physical: 80,
weakFoot: 4,
skillMoves: 1,
preferredFoot: "Left",
height: 185,
weight: 77,
attackingWorkRate: "Medium",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-204935.bef958414ae54da836a37ba0117d60e7b61d75a89affdece90556a7135831a22.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 206517,
name: "Jack Grealish",
position: "LM",
alternatePositions: "LW",
overall: 82,
potential: 0,
nation: "England",
club: "Everton",
league: "Premier League",
pace: 69,
shooting: 76,
passing: 82,
dribbling: 86,
defending: 53,
physical: 67,
weakFoot: 3,
skillMoves: 4,
preferredFoot: "Right",
height: 180,
weight: 81,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-50538165.38355b7381bccc126e130e1ea9ef69e4ac9f82a09c5b6bbc20b640b1d7834ca5.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 243657,
name: "James Garner",
position: "CDM",
alternatePositions: "CM, RB",
overall: 82,
potential: 0,
nation: "England",
club: "Everton",
league: "Premier League",
pace: 78,
shooting: 66,
passing: 77,
dribbling: 76,
defending: 79,
physical: 78,
weakFoot: 3,
skillMoves: 3,
preferredFoot: "Right",
height: 182,
weight: 76,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-243657.14ab05bb39f855e8178650e9f2c1df46344848aba924b5962bec573f067901ac.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 237386,
name: "Kiernan Dewsbury-Hall",
position: "CM",
alternatePositions: "CAM",
overall: 81,
potential: 0,
nation: "England",
club: "Everton",
league: "Premier League",
pace: 78,
shooting: 68,
passing: 78,
dribbling: 78,
defending: 66,
physical: 71,
weakFoot: 3,
skillMoves: 3,
preferredFoot: "Left",
height: 178,
weight: 75,
attackingWorkRate: "High",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-237386.db3093807159c619bc7fecdad12fe0fd1de480de9c72914297eceac5f22c59cb.webp",
dataVerified: true,
imageStatus: "futgg",
});

addPlayer({
id: 202695,
name: "James Tarkowski",
position: "CB",
alternatePositions: "",
overall: 80,
potential: 0,
nation: "England",
club: "Everton",
league: "Premier League",
pace: 51,
shooting: 32,
passing: 60,
dribbling: 49,
defending: 83,
physical: 83,
weakFoot: 4,
skillMoves: 2,
preferredFoot: "Right",
height: 188,
weight: 81,
attackingWorkRate: "Medium",
defensiveWorkRate: "Medium",
image: "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-202695.ef1dd879dd4df35f945fee4401ab549dbeab28c1d0594c8f35d3ad33ed8944df.webp",
dataVerified: true,
imageStatus: "futgg",
});
addPlayer({
  id: 268896,
  name: "Hugo Larsson",
  position: "CM",
  alternatePositions: "CDM",
  overall: 77,
  potential: 84,
  nation: "Sweden",
  club: "Fulham",
  league: "Premier League",
  cardType: "Gold",
  pace: 72,
  shooting: 72,
  passing: 71,
  dribbling: 77,
  defending: 71,
  physical: 76,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 187,
  weight: 79,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-50600544.82b7be6524ff03f31ca3185cf7521e807c969895d1049ffc24c76a21092cd439.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 213655,
  name: "Alex Iwobi",
  position: "LM",
  alternatePositions: "CDM, LW, CM",
  overall: 80,
  potential: 80,
  nation: "Nigeria",
  club: "Fulham",
  league: "Premier League",
  cardType: "Gold",
  pace: 68,
  shooting: 77,
  passing: 79,
  dribbling: 82,
  defending: 63,
  physical: 72,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 180,
  weight: 75,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-213655.bbc2ffafe3e5b62af690d1376ed0d268c70309660d13ecb783d4d919bb39ee91.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 229348,
  name: "Antonee Robinson",
  position: "LB",
  alternatePositions: "LM",
  overall: 80,
  potential: 81,
  nation: "United States",
  club: "Fulham",
  league: "Premier League",
  cardType: "Gold",
  pace: 88,
  shooting: 57,
  passing: 74,
  dribbling: 76,
  defending: 76,
  physical: 76,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 183,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-229348.c83b47b7964d945f59cee79a3fb89e96016d99490d14e03ec228738661993b8e.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 224221,
  name: "Joachim Andersen",
  position: "CB",
  alternatePositions: "",
  overall: 79,
  potential: 79,
  nation: "Denmark",
  club: "Fulham",
  league: "Premier League",
  cardType: "Gold",
  pace: 39,
  shooting: 57,
  passing: 71,
  dribbling: 65,
  defending: 80,
  physical: 83,
  weakFoot: 3,
  skillMoves: 2,
  preferredFoot: "Right",
  height: 192,
  weight: 90,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "High",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-224221.e744dcf10580bb61ef707fd4389c7b7b60af3a41c187e746d9b54dcf8582a9f6.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 264337,
  name: "Rodrigo Muniz",
  position: "ST",
  alternatePositions: "",
  overall: 76,
  potential: 80,
  nation: "Brazil",
  club: "Fulham",
  league: "Premier League",
  cardType: "Gold",
  pace: 67,
  shooting: 77,
  passing: 60,
  dribbling: 73,
  defending: 42,
  physical: 76,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 185,
  weight: 79,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-264337.9a845f22413402ebca36bb201c81b5a193535733316796cec52d70934e6c2397.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 263063,
  name: "James Trafford",
  position: "GK",
  alternatePositions: "",
  overall: 79,
  potential: 85,
  nation: "England",
  club: "Leeds United",
  league: "Premier League",
  cardType: "Gold",

  // GK mapping:
  // PAC = DIV, SHO = HAN, PAS = KIC,
  // DRI = REF, DEF = SPD, PHY = POS
  pace: 79,
  shooting: 77,
  passing: 78,
  dribbling: 80,
  defending: 48,
  physical: 78,

  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Right",
  height: 192,
  weight: 83,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-263063.1bb7ea7128ca938eed47f69372c438dab73e93170eb6814e83015c38bc4ac2cc.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 221479,
  name: "Dominic Calvert-Lewin",
  position: "ST",
  alternatePositions: "",
  overall: 79,
  potential: 79,
  nation: "England",
  club: "Leeds United",
  league: "Premier League",
  cardType: "Gold",
  pace: 73,
  shooting: 77,
  passing: 65,
  dribbling: 73,
  defending: 39,
  physical: 83,
  weakFoot: 4,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 189,
  weight: 71,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-221479.652301a9fce38884a4464c564352a0e0be3a351bc9c0a5251a15d9053d2ab637.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 220710,
  name: "Harry Wilson",
  position: "RW",
  alternatePositions: "",
  overall: 81,
  potential: 81,
  nation: "Wales",
  club: "Leeds United",
  league: "Premier League",
  cardType: "Gold",
  pace: 76,
  shooting: 82,
  passing: 81,
  dribbling: 82,
  defending: 46,
  physical: 59,
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Left",
  height: 173,
  weight: 70,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-220710.8b60f9e3f19a3ab1c36d00b7f42ff28058e42753982856d570dd993dfc703dbf.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 229266,
  name: "Daniel James",
  position: "RW",
  alternatePositions: "LW",
  overall: 75,
  potential: 75,
  nation: "Wales",
  club: "Leeds United",
  league: "Premier League",
  cardType: "Gold",
  pace: 89,
  shooting: 71,
  passing: 69,
  dribbling: 76,
  defending: 50,
  physical: 58,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Left",
  height: 171,
  weight: 76,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-229266.f4b5c5818252bd414a6b0e149b890f0de83bf7d52c96bd1f01bc8be3fabfc173.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 234824,
  name: "Yoane Wissa",
  position: "ST",
  alternatePositions: "",
  overall: 80,
  potential: 80,
  nation: "DR Congo",
  club: "Newcastle United",
  league: "Premier League",
  cardType: "Gold",
  pace: 85,
  shooting: 82,
  passing: 70,
  dribbling: 80,
  defending: 31,
  physical: 71,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 176,
  weight: 75,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-234824.1f7f199327711feb69ec6ebb6c03ffdc72dece4d4106ee8b3a06013fcb3cc4b4.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 257470,
  name: "Anthony Elanga",
  position: "RW",
  alternatePositions: "RM",
  overall: 79,
  potential: 82,
  nation: "Sweden",
  club: "Newcastle United",
  league: "Premier League",
  cardType: "Gold",
  pace: 92,
  shooting: 70,
  passing: 74,
  dribbling: 80,
  defending: 39,
  physical: 67,
  weakFoot: 3,
  skillMoves: 3,
  preferredFoot: "Right",
  height: 178,
  weight: 65,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-257470.cb8c151439ca993f9e8a44fc4dcb418779f1ac6396ecfb02ef6e118fa02e0f37.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 234742,
  name: "Harvey Barnes",
  position: "LW",
  alternatePositions: "LM, RW",
  overall: 80,
  potential: 80,
  nation: "England",
  club: "Newcastle United",
  league: "Premier League",
  cardType: "Gold",
  pace: 82,
  shooting: 81,
  passing: 75,
  dribbling: 81,
  defending: 43,
  physical: 66,
  weakFoot: 4,
  skillMoves: 4,
  preferredFoot: "Right",
  height: 174,
  weight: 66,
  attackingWorkRate: "High",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-234742.26d1c190bde4ab58a210988df20ea6166b898745bbfda2ae54f554a7be78de0a.webp",
  dataVerified: true,
  imageStatus: "futgg",
});

addPlayer({
  id: 203841,
  name: "Nick Pope",
  position: "GK",
  alternatePositions: "",
  overall: 78,
  potential: 84,
  nation: "England",
  club: "Newcastle United",
  league: "Premier League",
  cardType: "Gold",

  // GK mapping:
  // PAC = DIV, SHO = HAN, PAS = KIC,
  // DRI = REF, DEF = SPD, PHY = POS
  pace: 78,
  shooting: 77,
  passing: 64,
  dribbling: 80,
  defending: 44,
  physical: 76,

  weakFoot: 3,
  skillMoves: 1,
  preferredFoot: "Right",
  height: 199,
  weight: 90,
  attackingWorkRate: "Medium",
  defensiveWorkRate: "Medium",
  image:
    "https://game-assets.fut.gg/cdn-cgi/image/quality=85,width=300,format=auto/2027/player-item/27-203841.cbbc741afa1a7539a6fa7a84193ecbdbf7c82397990bfbf0124b372f0ac3c0ca.webp",
  dataVerified: true,
  imageStatus: "futgg",
});
export default players;