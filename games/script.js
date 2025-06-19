// Game Việt Hóa - Simplified JavaScript

// Dữ liệu game mẫu
let games = [
    {
        id: 1,
        name: "Neighbours from Hell",
        genre: "Puzzle/Strategy",
        rating: 4,
        description: "Game giải đố hài hước về anh chàng Woody thực hiện những trò đùa tinh quái với người hàng xóm khó ở. Game đã được Việt hóa hoàn chỉnh, mang đến những tình huống vui nhộn và thử thách trí tuệ thú vị.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop&crop=center"
    }
    
];

// DOM Elements
const gamesList = document.getElementById('gamesList');
const searchInput = document.getElementById('searchInput');
const addGameBtn = document.getElementById('addGameBtn');
const addGameModal = new bootstrap.Modal(document.getElementById('addGameModal'));
const addGameForm = document.getElementById('addGameForm');
const saveGameBtn = document.getElementById('saveGameBtn');
const gameCountElement = document.getElementById('gameCount');
const fabContainer = document.getElementById('fabContainer');
const fabMain = document.getElementById('fabMain');

// Biến trạng thái
let filteredGames = [...games];
let nextGameId = 4;
let isEditMode = false;
let editingGameId = null;

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    renderGames();
    updateGameCount();
    setupEventListeners();
    setupAnimations();
});

// Thiết lập các event listener
function setupEventListeners() {
    // Tìm kiếm game
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Mở modal thêm game
    addGameBtn.addEventListener('click', openAddGameModal);

    // Lưu game mới
    saveGameBtn.addEventListener('click', saveGame);

    // Floating Action Button
    fabMain.addEventListener('click', toggleFAB);

    // Scroll effect cho header
    window.addEventListener('scroll', handleScroll);

    // Click outside để đóng FAB
    document.addEventListener('click', function(e) {
        if (!fabContainer.contains(e.target)) {
            closeFAB();
        }
    });

    // Enter key trong search
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });

    // Form validation
    addGameForm.addEventListener('input', validateForm);
}

// Thiết lập animations
function setupAnimations() {
    // Fade in animation cho game cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Quan sát tất cả game cards
    document.querySelectorAll('.game-card').forEach(card => {
        observer.observe(card);
    });
}

// Render danh sách games
function renderGames() {
    if (filteredGames.length === 0) {
        gamesList.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-gamepad fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">Không tìm thấy game nào</h4>
                    <p class="text-muted">Thử tìm kiếm với từ khóa khác hoặc thêm game mới</p>
                </div>
            </div>
        `;
        return;
    }

    gamesList.innerHTML = filteredGames.map(game => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="game-card card h-100 shadow-sm" style="opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">
                <img src="${game.image}" class="card-img-top" alt="${game.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="text-muted mb-2">
                        <i class="fas fa-tag me-1"></i>${game.genre}
                    </p>
                    <div class="rating mb-2">
                        ${generateStars(game.rating)}
                    </div>
                    <p class="card-text flex-grow-1">${game.description}</p>
                    <div class="btn-group mt-auto">
                        <button class="btn btn-primary btn-sm" onclick="viewGame(${game.id})">
                            <i class="fas fa-eye me-1"></i>Xem chi tiết
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="editGame(${game.id})">
                            <i class="fas fa-edit me-1"></i>Sửa
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteGame(${game.id})">
                            <i class="fas fa-trash me-1"></i>Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Setup lại animations cho cards mới
    setupAnimations();
}

// Tạo stars rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    return stars;
}

// Xử lý tìm kiếm
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredGames = [...games];
    } else {
        filteredGames = games.filter(game => 
            game.name.toLowerCase().includes(searchTerm) ||
            game.genre.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderGames();
    updateGameCount();
    
    // Hiệu ứng loading nhỏ
    gamesList.style.opacity = '0.7';
    setTimeout(() => {
        gamesList.style.opacity = '1';
    }, 150);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mở modal thêm game
function openAddGameModal() {
    isEditMode = false;
    editingGameId = null;
    addGameForm.reset();
    document.getElementById('modalTitle').textContent = 'Thêm Game Mới';
    saveGameBtn.textContent = 'Thêm Game';
    addGameModal.show();
}

// Mở modal chỉnh sửa game
function editGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    isEditMode = true;
    editingGameId = gameId;
    
    // Điền thông tin vào form
    document.getElementById('gameName').value = game.name;
    document.getElementById('gameGenre').value = game.genre;
    document.getElementById('gameRating').value = game.rating;
    document.getElementById('gameDescription').value = game.description;
    document.getElementById('gameImage').value = game.image;
    
    document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Game';
    saveGameBtn.textContent = 'Cập Nhật';
    
    addGameModal.show();
}

// Lưu game
function saveGame() {
    if (!validateForm()) return;

    const formData = new FormData(addGameForm);
    const gameData = {
        name: formData.get('name').trim(),
        genre: formData.get('genre').trim(),
        rating: parseInt(formData.get('rating')),
        description: formData.get('description').trim(),
        image: formData.get('image').trim()
    };

    if (isEditMode && editingGameId) {
        // Cập nhật game existing
        const gameIndex = games.findIndex(g => g.id === editingGameId);
        if (gameIndex !== -1) {
            games[gameIndex] = { ...games[gameIndex], ...gameData };
            showNotification('Game đã được cập nhật thành công!', 'success');
        }
    } else {
        // Thêm game mới
        const newGame = {
            id: nextGameId++,
            ...gameData
        };
        games.unshift(newGame);
        showNotification('Game mới đã được thêm thành công!', 'success');
    }

    // Cập nhật filtered games và render lại
    filteredGames = [...games];
    renderGames();
    updateGameCount();
    
    // Đóng modal
    addGameModal.hide();
    addGameForm.reset();
}

// Validate form
function validateForm() {
    const name = document.getElementById('gameName').value.trim();
    const genre = document.getElementById('gameGenre').value.trim();
    const rating = document.getElementById('gameRating').value;
    const description = document.getElementById('gameDescription').value.trim();

    // Xóa các error messages cũ
    document.querySelectorAll('.text-danger').forEach(el => el.remove());

    let isValid = true;

    if (!name) {
        showFieldError('gameName', 'Tên game không được để trống');
        isValid = false;
    }

    if (!genre) {
        showFieldError('gameGenre', 'Thể loại không được để trống');
        isValid = false;
    }

    if (!rating || rating < 1 || rating > 5) {
        showFieldError('gameRating', 'Đánh giá phải từ 1-5 sao');
        isValid = false;
    }

    if (!description) {
        showFieldError('gameDescription', 'Mô tả không được để trống');
        isValid = false;
    }

    return isValid;
}

// Hiển thị lỗi field
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-danger small mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    field.classList.add('is-invalid');
}

// Xóa game
function deleteGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    if (confirm(`Bạn có chắc chắn muốn xóa game "${game.name}"?`)) {
        games = games.filter(g => g.id !== gameId);
        filteredGames = games.filter(g => filteredGames.some(fg => fg.id === g.id));
        renderGames();
        updateGameCount();
        showNotification('Game đã được xóa thành công!', 'warning');
    }
}

// Xem chi tiết game
function viewGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    // Tạo modal chi tiết
    const modal = `
        <div class="modal fade" id="gameDetailModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${game.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${game.image}" class="img-fluid rounded" alt="${game.name}">
                            </div>
                            <div class="col-md-6">
                                <h6><i class="fas fa-tag me-2"></i>Thể loại: ${game.genre}</h6>
                                <h6><i class="fas fa-star me-2"></i>Đánh giá: ${generateStars(game.rating)}</h6>
                                <hr>
                                <h6>Mô tả:</h6>
                                <p>${game.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-primary" onclick="editGame(${game.id})" data-bs-dismiss="modal">
                            <i class="fas fa-edit me-1"></i>Chỉnh sửa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Xóa modal cũ nếu có
    const oldModal = document.getElementById('gameDetailModal');
    if (oldModal) oldModal.remove();

    // Thêm modal mới
    document.body.insertAdjacentHTML('beforeend', modal);
    const gameDetailModal = new bootstrap.Modal(document.getElementById('gameDetailModal'));
    gameDetailModal.show();

    // Xóa modal sau khi đóng
    document.getElementById('gameDetailModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Cập nhật số lượng game
function updateGameCount() {
    gameCountElement.textContent = filteredGames.length;
}

// Toggle FAB
function toggleFAB() {
    fabContainer.classList.toggle('open');
}

// Đóng FAB
function closeFAB() {
    fabContainer.classList.remove('open');
}

// Xử lý scroll
function handleScroll() {
    const header = document.querySelector('.header-section');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    // Tạo toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    // Tự động xóa sau 3 giây
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// Export data
function exportGames() {
    const dataStr = JSON.stringify(games, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'games-viet-hoa.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Dữ liệu đã được xuất thành công!', 'success');
}

// Import data
function importGames(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedGames = JSON.parse(e.target.result);
            if (Array.isArray(importedGames)) {
                games = importedGames;
                filteredGames = [...games];
                nextGameId = Math.max(...games.map(g => g.id)) + 1;
                renderGames();
                updateGameCount();
                showNotification('Dữ liệu đã được nhập thành công!', 'success');
            } else {
                throw new Error('Invalid format');
            }
        } catch (error) {
            showNotification('Lỗi: Định dạng file không hợp lệ!', 'danger');
        }
    };
    reader.readAsText(file);
}