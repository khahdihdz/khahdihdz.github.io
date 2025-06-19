// JavaScript đơn giản cho trang Game Việt Hóa

// Dữ liệu game mẫu
const gamesData = [
    {
        id: 1,
        title: "Neighbours from Hell",
        genre: "Adventure",
        status: "Hoàn thành",
        description: "Game hài hước về việc trêu chọc người hàng xóm khó tính với nhiều tình huống vui nhộn."
    }
];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    displayGames(gamesData);
    setupEventListeners();
});

// Hiển thị danh sách game
function displayGames(games) {
    const gamesList = document.getElementById('gamesList');
    gamesList.innerHTML = '';
    
    if (games.length === 0) {
        gamesList.innerHTML = '<div class="col-12 text-center"><p>Không tìm thấy game nào.</p></div>';
        return;
    }
    
    games.forEach(game => {
        const gameCard = createGameCard(game);
        gamesList.appendChild(gameCard);
    });
}

// Tạo card game
function createGameCard(game) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    const statusClass = game.status === 'Hoàn thành' ? 'status-complete' : 'status-development';
    
    col.innerHTML = `
        <div class="game-card">
            <h5 class="game-title">${game.title}</h5>
            <div class="game-info">
                <span class="game-genre">${game.genre}</span>
                <span class="game-status ${statusClass}">${game.status}</span>
            </div>
            <p class="game-description">${game.description}</p>
            <button class="download-btn" onclick="downloadGame(${game.id})">
                Tải về
            </button>
        </div>
    `;
    
    return col;
}

// Thiết lập sự kiện
function setupEventListeners() {
    // Tìm kiếm
    document.getElementById('searchInput').addEventListener('input', filterGames);
    
    // Lọc thể loại
    document.getElementById('genreFilter').addEventListener('change', filterGames);
    
    // Lọc trạng thái
    document.getElementById('statusFilter').addEventListener('change', filterGames);
}

// Lọc game
function filterGames() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedGenre = document.getElementById('genreFilter').value;
    const selectedStatus = document.getElementById('statusFilter').value;
    
    const filteredGames = gamesData.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm) ||
                            game.description.toLowerCase().includes(searchTerm);
        const matchesGenre = !selectedGenre || game.genre === selectedGenre;
        const matchesStatus = !selectedStatus || game.status === selectedStatus;
        
        return matchesSearch && matchesGenre && matchesStatus;
    });
    
    displayGames(filteredGames);
}

// Tải game
function downloadGame(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (game) {
        const button = event.target;
        button.innerHTML = 'Đang tải...';
        button.disabled = true;
        
        // Giả lập quá trình tải
        setTimeout(() => {
            alert(`Tải ${game.title} thành công!`);
            button.innerHTML = 'Tải về';
            button.disabled = false;
        }, 1500);
    }
}