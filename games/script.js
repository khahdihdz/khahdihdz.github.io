const games = [
  {
    title: "Neighbours From Hell",
    image: "https://cdn.mobygames.com/covers/4458374-neighbours-from-hell-windows-front-cover.jpg",
    desc: "Game hài hước chơi khăm hàng xóm cực gắt đã được Việt hóa.",
    link: "#"
  },
  {
    title: "Assassin's Creed Rogue",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4a/Assassin%27s_Creed_Rogue_cover.jpg",
    desc: "Phiên bản AC đặc biệt cho fan Việt đã có bản dịch đầy đủ.",
    link: "#"
  },
  {
    title: "Stardew Valley",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Stardew_Valley_cover_art.png/220px-Stardew_Valley_cover_art.png",
    desc: "Tựa game nông trại huyền thoại đã có bản Việt hóa chất lượng cao.",
    link: "#"
  }
];

const container = document.getElementById('game-list');

games.forEach(game => {
  container.innerHTML += `
    <div class="col">
      <div class="card h-100">
        <img src="${game.image}" class="card-img-top" alt="${game.title}">
        <div class="card-body">
          <h5 class="card-title">${game.title}</h5>
          <p class="card-text">${game.desc}</p>
          <a href="${game.link}" class="btn btn-primary">Xem chi tiết</a>
        </div>
      </div>
    </div>
  `;
});