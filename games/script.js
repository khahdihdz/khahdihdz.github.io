// Game Việt Hóa - Simplified JavaScript

// Dữ liệu game mẫu
let games = [
    {
        id: 1,
        name: "Neighbours from Hell",
        genre: "Puzzle/Strategy",
        rating: 4,
        description: "Game giải đố hài hước về anh chàng Woody thực hiện những trò đùa tinh quái với người hàng xóm khó ở. Game đã được Việt hóa hoàn chỉnh, mang đến những tình huống vui nhộn và thử thách trí tuệ thú vị.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop&crop=center",
        screenshots: [
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop"
        ],
        downloadLink: "https://example.com/download/neighbours-from-hell-viet",
        fileSize: "1.2 GB",
        releaseYear: "2003",
        developer: "JoWooD Studios",
        vietnameseTeam: "Nhóm Việt Hóa GameVN",
        systemRequirements: {
            os: "Windows 7/8/10/11",
            processor: "Intel Pentium 4 1.5GHz",
            memory: "512 MB RAM",
            graphics: "DirectX 9 compatible",
            storage: "1.5 GB"
        },
        features: ["Việt hóa 100% văn bản", "Giao diện tiếng Việt", "Hướng dẫn đầy đủ"]
    },
    {
        id: 2,
        name: "Cyberpunk 2077",
        genre: "Action RPG",
        rating: 4,
        description: "Game nhập vai hành động trong tương lai dystopian. Đã được cộng đồng Việt hóa với chất lượng tốt, mang đến trải nghiệm Night City sống động.",
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop&crop=center",
        screenshots: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop"
        ],
        downloadLink: "https://example.com/download/cyberpunk2077-viet",
        fileSize: "65 GB",
        releaseYear: "2020",
        developer: "CD Projekt RED",
        vietnameseTeam: "Cộng đồng Game Việt",
        systemRequirements: {
            os: "Windows 10 64-bit",
            processor: "Intel Core i5-3570K / AMD FX-8310",
            memory: "8 GB RAM",
            graphics: "NVIDIA GTX 780 / AMD Radeon RX 470",
            storage: "70 GB SSD"
        },
        features: ["Việt hóa phụ đề", "Menu tiếng Việt", "Hỗ trợ mod Việt hóa"]
    },
    {
        id: 3,
        name: "Persona 5 Royal",
        genre: "JRPG",
        rating: 5,
        description: "JRPG xuất sắc về nhóm Phantom Thieves. Bản Việt hóa chất lượng cao với đầy đủ văn bản và giao diện.",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop&crop=center",
        screenshots: [
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
        ],
        downloadLink: "https://example.com/download/persona5royal-viet",
        fileSize: "28 GB",
        releaseYear: "2019",
        developer: "Atlus",
        vietnameseTeam: "Team JRPG Việt",
        systemRequirements: {
            os: "Windows 10/11 64-bit",
            processor: "Intel Core i7-4790 / AMD Ryzen 5 1600",
            memory: "8 GB RAM",
            graphics: "NVIDIA GTX 650 Ti / AMD Radeon R7 360",
            storage: "35 GB"
        },
        features: ["Việt hóa hoàn chỉnh", "Giao diện Việt", "Voice-over Nhật + Sub Việt"]
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
                    <div class="game-info mb-3">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>${game.releaseYear} • 
                            <i class="fas fa-hdd me-1"></i>${game.fileSize} • 
                            <i class="fas fa-users me-1"></i>${game.vietnameseTeam}
                        </small>
                    </div>
                    <div class="btn-group mt-auto">
                        <button class="btn btn-success btn-sm" onclick="downloadGame(${game.id})">
                            <i class="fas fa-download me-1"></i>Tải xuống
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="viewGame(${game.id})">
                            <i class="fas fa-eye me-1"></i>Xem chi tiết
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

    // Tạo screenshots carousel
    const screenshotsCarousel = game.screenshots.map((screenshot, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${screenshot}" class="d-block w-100 rounded" alt="Screenshot ${index + 1}">
        </div>
    `).join('');

    // Tạo features list
    const featuresList = game.features.map(feature => `
        <li class="list-group-item"><i class="fas fa-check text-success me-2"></i>${feature}</li>
    `).join('');

    // Tạo modal chi tiết
    const modal = `
        <div class="modal fade" id="gameDetailModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${game.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-8">
                                <!-- Screenshots Carousel -->
                                <div id="screenshotsCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        ${screenshotsCarousel}
                                    </div>
                                    <button class="carousel-control-prev" type="button" data-bs-target="#screenshotsCarousel" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon"></span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#screenshotsCarousel" data-bs-slide="next">
                                        <span class="carousel-control-next-icon"></span>
                                    </button>
                                </div>
                                
                                <h6><i class="fas fa-info-circle me-2"></i>Mô tả chi tiết</h6>
                                <p>${game.description}</p>
                                
                                <h6><i class="fas fa-star me-2"></i>Tính năng Việt hóa</h6>
                                <ul class="list-group list-group-flush">
                                    ${featuresList}
                                </ul>
                            </div>
                            <div class="col-lg-4">
                                <div class="card">
                                    <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                    <div class="card-body">
                                        <h6><i class="fas fa-tag me-2"></i>Thông tin cơ bản</h6>
                                        <p class="mb-2"><strong>Thể loại:</strong> ${game.genre}</p>
                                        <p class="mb-2"><strong>Năm phát hành:</strong> ${game.releaseYear}</p>
                                        <p class="mb-2"><strong>Nhà phát triển:</strong> ${game.developer}</p>
                                        <p class="mb-2"><strong>Kích thước:</strong> ${game.fileSize}</p>
                                        <p class="mb-3"><strong>Nhóm Việt hóa:</strong> ${game.vietnameseTeam}</p>
                                        
                                        <div class="rating mb-3">
                                            <strong>Đánh giá: </strong>${generateStars(game.rating)}
                                        </div>
                                        
                                        <button class="btn btn-success w-100 mb-2" onclick="downloadGame(${game.id})">
                                            <i class="fas fa-download me-2"></i>Tải xuống ngay
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-header">
                                        <h6 class="mb-0"><i class="fas fa-desktop me-2"></i>Cấu hình tối thiểu</h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="mb-1"><strong>Hệ điều hành:</strong> ${game.systemRequirements.os}</p>
                                        <p class="mb-1"><strong>CPU:</strong> ${game.systemRequirements.processor}</p>
                                        <p class="mb-1"><strong>RAM:</strong> ${game.systemRequirements.memory}</p>
                                        <p class="mb-1"><strong>Card đồ họa:</strong> ${game.systemRequirements.graphics}</p>
                                        <p class="mb-0"><strong>Dung lượng:</strong> ${game.systemRequirements.storage}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-success" onclick="downloadGame(${game.id})">
                            <i class="fas fa-download me-1"></i>Tải xuống
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

// Tải xuống game
function downloadGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    // Hiển thị modal xác nhận download
    const confirmModal = `
        <div class="modal fade" id="downloadModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-download me-2"></i>Tải xuống ${game.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <img src="${game.image}" class="img-fluid rounded" style="max-height: 150px;" alt="${game.name}">
                        </div>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Thông tin tải xuống:</strong><br>
                            • Kích thước: ${game.fileSize}<br>
                            • Nhóm Việt hóa: ${game.vietnameseTeam}<br>
                            • Đã bao gồm bản Việt hóa hoàn chỉnh
                        </div>
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Lưu ý:</strong> Đảm bảo bạn sở hữu bản quyền game gốc trước khi tải xuống bản Việt hóa.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-success" onclick="startDownload('${game.downloadLink}', '${game.name}')" data-bs-dismiss="modal">
                            <i class="fas fa-download me-1"></i>Bắt đầu tải
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Xóa modal cũ nếu có
    const oldModal = document.getElementById('downloadModal');
    if (oldModal) oldModal.remove();

    // Thêm modal mới
    document.body.insertAdjacentHTML('beforeend', confirmModal);
    const downloadModal = new bootstrap.Modal(document.getElementById('downloadModal'));
    downloadModal.show();

    // Xóa modal sau khi đóng
    document.getElementById('downloadModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Bắt đầu tải xuống
function startDownload(downloadLink, gameName) {
    // Mở link download trong tab mới
    window.open(downloadLink, '_blank');
    
    // Hiển thị thông báo
    showNotification(`Đang chuyển hướng đến trang tải xuống "${gameName}"...`, 'success');
    
    // Có thể thêm tracking analytics ở đây
    console.log(`Download started for: ${gameName}`);
}
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