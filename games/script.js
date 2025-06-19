// Game data with compressed thumbnails and full descriptions
const gamesData = [
    {
        id: 1,
        title: "Neighbours from Hell",
        genre: "Strategy",
        description: "Game giải đố vui nhộn về việc chơi khăm hàng xóm khó tính với những mánh khóe hài hước.",
        fullDescription: "Neighbours from Hell là một tựa game puzzle-strategy độc đáo và hài hước được phát triển bởi JoWooD Productions. Người chơi sẽ vào vai Woody, một chàng trai quyết tâm trả đũa ông hàng xóm khó tính Mr. Rottweiler bằng những trò chơi khăm sáng tạo và hài hước. Game có gameplay đơn giản nhưng đầy thử thách, yêu cầu người chơi lên kế hoạch và thực hiện các pha chơi khăm một cách khéo léo mà không bị phát hiện. Với đồ họa cartoon dễ thương, âm thanh vui nhộn và các tình huống hài hước, Neighbours from Hell mang đến trải nghiệm giải trí nhẹ nhàng nhưng không kém phần thú vị. Game bao gồm nhiều level với độ khó tăng dần và các vật dụng chơi khăm đa dạng.",
        thumbnail: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6Vooor1DxQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9k=",
        features: ["Gameplay hài hước", "Puzzle sáng tạo", "Đồ họa cartoon", "Nhiều level thử thách"],
        downloadLink: "#download-neighbours",
        size: "500 MB",
        version: "Season 1 & 2",
        releaseDate: "2003",
        developer: "JoWooD Productions",
        genre_full: "Puzzle Strategy",
        language: "Tiếng Việt hóa",
        rating: "Everyone 10+",
        platforms: ["PC"]
    }
    
];

// DOM elements
const gamesList = document.getElementById('games-list');
const searchInput = document.getElementById('search-input');
const genreFilter = document.getElementById('genre-filter');
const modal = document.getElementById('game-modal');
const modalContent = document.querySelector('.modal-game-info');
const closeModal = document.querySelector('.close-modal');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    displayGames(gamesData);
    setupEventListeners();
    populateGenreFilter();
});

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    genreFilter.addEventListener('change', handleGenreFilter);
    closeModal.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideModal();
        }
    });
}

// Display games
function displayGames(games) {
    if (games.length === 0) {
        gamesList.innerHTML = '<div class="no-results">Không tìm thấy game nào phù hợp.</div>';
        return;
    }
    
    gamesList.innerHTML = games.map(game => `
        <div class="game-card" data-game-id="${game.id}">
            <div class="game-thumbnail">
                <img src="${game.thumbnail}" alt="${game.title}" loading="lazy">
                <div class="game-overlay">
                    <button class="btn-primary" onclick="showGameDetails(${game.id})">Xem chi tiết</button>
                </div>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-meta">
                    <span class="game-genre">${game.genre}</span>
                    <span class="game-size">${game.size}</span>
                </div>
                <p class="game-description">${game.description}</p>
                <div class="game-features">
                    ${game.features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="game-actions">
                    <button class="btn-primary" onclick="showGameDetails(${game.id})">Chi tiết</button>
                    <a href="${game.downloadLink}" class="btn-secondary">Tải xuống</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Show game details modal
function showGameDetails(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <img src="${game.thumbnail}" alt="${game.title}" class="modal-thumbnail">
            <div class="modal-title-info">
                <h2>${game.title}</h2>
                <div class="modal-meta">
                    <span class="meta-item"><strong>Thể loại:</strong> ${game.genre_full}</span>
                    <span class="meta-item"><strong>Kích thước:</strong> ${game.size}</span>
                    <span class="meta-item"><strong>Phiên bản:</strong> ${game.version}</span>
                    <span class="meta-item"><strong>Năm phát hành:</strong> ${game.releaseDate}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-body">
            <div class="modal-section">
                <h3>Mô tả</h3>
                <p>${game.fullDescription}</p>
            </div>
            
            <div class="modal-section">
                <h3>Tính năng chính</h3>
                <div class="features-grid">
                    ${game.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-section">
                <h3>Thông tin chi tiết</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Nhà phát triển:</strong>
                        <span>${game.developer}</span>
                    </div>
                    <div class="info-item">
                        <strong>Ngôn ngữ:</strong>
                        <span>${game.language}</span>
                    </div>
                    <div class="info-item">
                        <strong>Độ tuổi:</strong>
                        <span>${game.rating}</span>
                    </div>
                    <div class="info-item">
                        <strong>Nền tảng:</strong>
                        <span>${game.platforms.join(', ')}</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <a href="${game.downloadLink}" class="btn-primary btn-large">
                    <i class="download-icon">⬇</i>
                    Tải xuống ngay
                </a>
                <button class="btn-secondary" onclick="shareGame(${game.id})">
                    <i class="share-icon">📤</i>
                    Chia sẻ
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide modal
function hideModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreFilter.value;
    
    let filteredGames = gamesData;
    
    // Filter by search term
    if (searchTerm) {
        filteredGames = filteredGames.filter(game => 
            game.title.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm) ||
            game.features.some(feature => feature.toLowerCase().includes(searchTerm))
        );
    }
    
    // Filter by genre
    if (selectedGenre && selectedGenre !== 'all') {
        filteredGames = filteredGames.filter(game => 
            game.genre.toLowerCase() === selectedGenre.toLowerCase()
        );
    }
    
    displayGames(filteredGames);
}

// Handle genre filter
function handleGenreFilter() {
    handleSearch(); // Reuse search logic
}

// Populate genre filter
function populateGenreFilter() {
    const genres = [...new Set(gamesData.map(game => game.genre))];
    
    genreFilter.innerHTML = '<option value="all">Tất cả thể loại</option>' +
        genres.map(genre => `<option value="${genre}">${genre}</option>`).join('');
}

// Share game function
function shareGame(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;
    
    if (navigator.share) {
        navigator.share({
            title: game.title,
            text: game.description,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        const shareText = `${game.title} - ${game.description}\n${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Đã sao chép link chia sẻ!');
        }).catch(() => {
            alert('Không thể chia sẻ. Vui lòng sao chép link thủ công.');
        });
    }
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading after DOM content is loaded
document.addEventListener('DOMContentLoaded', setupLazyLoading);