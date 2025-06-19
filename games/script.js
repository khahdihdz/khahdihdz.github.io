const games = [
  {
    title: "Neighbours From Hell",
    image: "https://cdn.mobygames.com/covers/4458374-neighbours-from-hell-windows-front-cover.jpg",
    desc: "Game hài hước chơi khăm hàng xóm cực gắt đã được Việt hóa.",
    link: "https://example.com/download-nfh",
    screenshots: [
      "https://i.imgur.com/0KFBHTB.jpeg",
      "https://i.imgur.com/jnZTaaK.jpeg"
    ],
    info: "Dung lượng: 500MB | Hệ điều hành: Windows | Việt hóa: Full phụ đề"
  },
  {
    title: "Assassin's Creed Rogue",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4a/Assassin%27s_Creed_Rogue_cover.jpg",
    desc: "Phiên bản AC đặc biệt cho fan Việt đã có bản dịch đầy đủ.",
    link: "https://example.com/download-acr",
    screenshots: [
      "https://i.imgur.com/ZkYXJcU.jpeg"
    ],
    info: "Dung lượng: 8GB | Hệ điều hành: Windows | Việt hóa: Full thoại + phụ đề"
  }
];

const container = document.getElementById('game-list');

games.forEach((game, index) => {
  const screenshotsHTML = game.screenshots.map(img => `<img src="${img}" alt="Screenshot">`).join('');

  container.innerHTML += `
    <div class="col">
      <div class="card h-100">
        <img src="${game.image}" class="card-img-top" alt="${game.title}">
        <div class="card-body">
          <h5 class="card-title">${game.title}</h5>
          <p class="card-text">${game.desc}</p>
          <button class="btn btn-primary" onclick="toggleDetails(${index})">Xem chi tiết</button>
          <div id="details-${index}" class="details mt-3">
            <p><strong>Thông tin:</strong> ${game.info}</p>
            ${screenshotsHTML}
            <a href="${game.link}" target="_blank" class="btn btn-success mt-2">⬇️ Tải Game</a>
          </div>
        </div>
      </div>
    </div>
  `;
});

function toggleDetails(index) {
  const details = document.getElementById(`details-${index}`);
  details.style.display = details.style.display === "block" ? "none" : "block";
}