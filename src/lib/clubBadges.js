const clubBadges = {
  "Real Madrid": "https://images.fotmob.com/image_resources/logo/teamlogo/8633.png",
  "Barcelona": "https://images.fotmob.com/image_resources/logo/teamlogo/8634.png",
  "Manchester City": "https://images.fotmob.com/image_resources/logo/teamlogo/8456.png",
  "Manchester United": "https://images.fotmob.com/image_resources/logo/teamlogo/10260.png",
  "Liverpool": "https://images.fotmob.com/image_resources/logo/teamlogo/8650.png",
  "Arsenal": "https://images.fotmob.com/image_resources/logo/teamlogo/9825.png",
  "Chelsea": "https://images.fotmob.com/image_resources/logo/teamlogo/8455.png",
  "Tottenham": "https://images.fotmob.com/image_resources/logo/teamlogo/8586.png",
  "Bayern Munich": "https://images.fotmob.com/image_resources/logo/teamlogo/9823.png",
  "Borussia Dortmund": "https://images.fotmob.com/image_resources/logo/teamlogo/9789.png",
  "Inter": "https://images.fotmob.com/image_resources/logo/teamlogo/8636.png",
  "AC Milan": "https://images.fotmob.com/image_resources/logo/teamlogo/8560.png",
  "Juventus": "https://images.fotmob.com/image_resources/logo/teamlogo/9885.png",
  "Napoli": "https://images.fotmob.com/image_resources/logo/teamlogo/9875.png",
  "Atletico Madrid": "https://images.fotmob.com/image_resources/logo/teamlogo/8635.png",
  "Paris Saint-Germain": "https://images.fotmob.com/image_resources/logo/teamlogo/9847.png",
  "Newcastle United": "https://images.fotmob.com/image_resources/logo/teamlogo/10261.png",
  "Aston Villa": "https://images.fotmob.com/image_resources/logo/teamlogo/10252.png",
  "West Ham United": "https://images.fotmob.com/image_resources/logo/teamlogo/8654.png",
  "Everton": "https://images.fotmob.com/image_resources/logo/teamlogo/8668.png",
  "Crystal Palace": "https://images.fotmob.com/image_resources/logo/teamlogo/9826.png"
};

export function getClubBadge(club) {
  return clubBadges[club] || "";
}

export default clubBadges;
