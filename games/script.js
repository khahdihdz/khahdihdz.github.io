// Game data with real information and download links
const gameData = [
    {
        id: 1,
        title: "Neighbours from Hell",
        description: "Game giải đố hài hước về việc trêu đùa hàng xóm khó tính. Sử dụng trí thông minh để tạo ra những trò đùa vui nhộn.",
        fullDescription: "Neighbours from Hell là một trò chơi puzzle strategy được phát triển bởi JoWood Productions. Được phát hành lần đầu cho Windows vào năm 2003, sau đó được chuyển thể cho GameCube, Xbox, Nintendo DS, Android và iOS. Trong game, bạn sẽ vào vai Woody, một người đàn ông tốt bụng cho đến khi người hàng xóm khó chịu Rottweiler làm anh ta phát điên. Nhiệm vụ của bạn là lên kế hoạch và thực hiện những trò đùa khôn ngoan để trả đũa người hàng xóm khó tính.",
        genre: ["Puzzle", "Strategy", "Comedy"],
        rating: 4.2,
        downloads: 2847,
        fileSize: "185 MB",
        releaseYear: 2003,
        developer: "JoWood Productions",
        // Link tải thực tế - thay thế bằng link thực của bạn
        downloadLink: "https://raw.githubusercontent.com/khahdihdz/khahdihdz.github.io/refs/heads/main/games/upload/Neighbours%20from%20Hell%20-%20Revenge%20Is%20a%20Sweet%20Game.zip",
        systemRequirements: {
            os: "Windows XP/Vista/7/8/10",
            processor: "Pentium III 500 MHz",
            memory: "128 MB RAM",
            graphics: "DirectX 8.0 compatible",
            storage: "200 MB"
        },
        thumbnail: "https://i.ibb.co/F4kF3sxn/Blitzkrieg-II-Screenshot-2025-06-19-11-03-56-20.png",
        screenshots: [
            "https://i.ibb.co/nMs0sJHF/Blitzkrieg-II-Screenshot-2025-06-19-11-01-28-46.png",
            "https://i.ibb.co/v6n1Fwrs/Blitzkrieg-II-Screenshot-2025-06-20-20-07-44-53.png",
            "https://i.ibb.co/QvVFNXDD/Blitzkrieg-II-Screenshot-2025-06-20-20-07-48-24.png"
        ],
        version: "1.0 Vietnamese",
        lastUpdated: "2024-01-15"
    },
    {
        id: 2,
        title: "Neighbours from Hell 2: On Vacation",
        description: "Phần tiếp theo của series game giải đố hài hước. Tiếp tục cuộc phiêu lưu trêu đùa hàng xóm với nhiều tình huống mới và thú vị hơn.",
        fullDescription: "Neighbours from Hell 2: On Vacation là phần tiếp theo của trò chơi nổi tiếng, nơi Woody tiếp tục cuộc phiêu lưu trêu đùa hàng xóm khó tính của mình. Lần này, hành động diễn ra trong kỳ nghỉ với nhiều địa điểm mới như du thuyền, khách sạn, và các khu nghỉ dưỡng nhiệt đới. Game mang đến những tình huống hài hước mới với đồ họa được cải thiện và nhiều trò đùa sáng tạo hơn.",
        genre: ["Puzzle", "Strategy", "Adventure"],
        rating: 4.5,
        downloads: 1923,
        fileSize: "220 MB",
        releaseYear: 2004,
        developer: "JoWood Productions",
        // Link tải thực tế - thay thế bằng link thực của bạn
        downloadLink: "https://raw.githubusercontent.com/khahdihdz/khahdihdz.github.io/refs/heads/main/games/upload/Neighbours%20from%20Hell%202%20-%20On%20Vacation.zip",
        systemRequirements: {
            os: "Windows XP/Vista/7/8/10",
            processor: "Pentium III 600 MHz",
            memory: "256 MB RAM",
            graphics: "DirectX 9.0 compatible",
            storage: "250 MB"
        },
        thumbnail: "https://i.ibb.co/5x91x0ct/Blitzkrieg-II-Screenshot-2025-06-22-22-34-26-20.png",
        screenshots: [
            "https://i.ibb.co/d06tW6cN/Blitzkrieg-II-Screenshot-2025-06-22-22-13-39-94.png",
            "https://i.ibb.co/HfMxQfhZ/Blitzkrieg-II-Screenshot-2025-06-22-22-13-56-62.png",
            "https://i.ibb.co/8gkqQLYB/Blitzkrieg-II-Screenshot-2025-06-22-22-14-03-55.png"
        ],
        version: "1.0 Vietnamese",
        lastUpdated: "2024-01-20"
    }
];

// DOM elements
const gamesList = document.getElementById('gamesList');
const gameModal = new bootstrap.Modal(document.getElementById('gameModal'));
const gameModalTitle = document.getElementById('gameModalTitle');
const gameModalBody = document.getElementById('gameModalBody');
const downloadBtn = document.getElementById('downloadBtn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadGames();
    setupEventListeners();
    animateCounters();
});

// Load games into the page
function loadGames() {
    gamesList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    // Simulate loading delay
    setTimeout(() => {
        gamesList.innerHTML = '';
        gameData.forEach(game => {
            const gameCard = createGameCard(game);
            gamesList.appendChild(gameCard);
        });
        
        // Add fade-in animation
        document.querySelectorAll('.game-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 1000);
}

// Create game card HTML
function createGameCard(game) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 col-sm-12';
    
    const genreTags = game.genre.map(g => `<span class="game-genre">${g}</span>`).join('');
    
    col.innerHTML = `
        <div class="game-card" data-game-id="${game.id}">
            <div class="game-image" style="background-image: url('${game.thumbnail}'); background-size: cover; background-position: center;">
                <div class="image-overlay">
                    <i class="fas fa-play-circle play-icon"></i>
                </div>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-genres mb-2">
                    ${genreTags}
                </div>
                <div class="game-meta">
                    <div class="game-rating">
                        ${generateStars(game.rating)}
                        <span class="ms-1">${game.rating}</span>
                    </div>
                    <div class="file-size">${game.fileSize}</div>
                </div>
                <div class="download-info">
                    <div class="download-count">
                        <i class="fas fa-download"></i>
                        <span>${formatNumber(game.downloads)}</span>
                    </div>
                    <button class="btn btn-download">
                        <i class="fas fa-info-circle me-1"></i>
                        Chi tiết
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Format number with thousands separator
function formatNumber(num) {
    return num.toLocaleString('vi-VN');
}

// Setup event listeners
function setupEventListeners() {
    // Game card click handler
    document.addEventListener('click', function(e) {
        const gameCard = e.target.closest('.game-card');
        if (gameCard) {
            const gameId = parseInt(gameCard.dataset.gameId);
            showGameModal(gameId);
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Show game modal with details
function showGameModal(gameId) {
    const game = gameData.find(g => g.id === gameId);
    if (!game) return;
    
    gameModalTitle.textContent = game.title;
    
    const systemReqList = Object.entries(game.systemRequirements)
        .map(([key, value]) => `<li><strong>${translateSystemReq(key)}:</strong> ${value}</li>`)
        .join('');
    
    const genreTags = game.genre.map(g => `<span class="game-genre">${g}</span>`).join('');
    
    gameModalBody.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="game-image mb-3" style="height: 200px; border-radius: 10px; background-image: url('${game.thumbnail}'); background-size: cover; background-position: center;">
                </div>
                <div class="game-stats">
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Đánh giá:</strong></span>
                        <span>${generateStars(game.rating)} ${game.rating}/5</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Lượt tải:</strong></span>
                        <span>${formatNumber(game.downloads)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Dung lượng:</strong></span>
                        <span>${game.fileSize}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Năm phát hành:</strong></span>
                        <span>${game.releaseYear}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Nhà phát triển:</strong></span>
                        <span>${game.developer}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Phiên bản:</strong></span>
                        <span>${game.version}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="mb-3">
                    ${genreTags}
                </div>
                <h5>Mô tả chi tiết</h5>
                <p>${game.fullDescription}</p>
                
                <h5>Ảnh chụp màn hình</h5>
                <div class="screenshots-gallery mb-4">
                    <div class="row g-2">
                        ${game.screenshots.map((screenshot, index) => `
                            <div class="col-6">
                                <img src="${screenshot}" 
                                     alt="Screenshot ${index + 1}" 
                                     class="img-fluid rounded screenshot-thumb"
                                     style="cursor: pointer; height: 120px; width: 100%; object-fit: cover;"
                                     onclick="showScreenshotModal('${screenshot}', '${game.title}', ${index + 1})">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <h5>Cấu hình tối thiểu</h5>
                <ul class="list-unstyled">
                    ${systemReqList}
                </ul>
            </div>
        </div>
    `;
    
    // Update download button
    downloadBtn.onclick = () => downloadVietnameseVersion(game.id);
    
    gameModal.show();
}

// Translate system requirements keys
function translateSystemReq(key) {
    const translations = {
        'os': 'Hệ điều hành',
        'processor': 'CPU',
        'memory': 'RAM',
        'graphics': 'Card đồ họa',
        'storage': 'Dung lượng trống'
    };
    return translations[key] || key;
}

// Download Vietnamese version function - CẬP NHẬT VỚI LINK TẢI THỰC TẾ
function downloadVietnameseVersion(gameId) {
    const game = gameData.find(g => g.id == gameId);
    if (!game) return;
    
    // Kiểm tra xem có link tải hay không
    if (!game.downloadLink) {
        showErrorNotification('Không tìm thấy link tải cho game này!');
        return;
    }
    
    // Tạo thông báo bắt đầu tải
    showDownloadNotification(`Đang chuẩn bị tải ${game.title}...`);
    
    // Tăng số lượt tải
    game.downloads++;
    updateDownloadCount(gameId, game.downloads);
    
    // Thực hiện tải file thực tế
    setTimeout(() => {
        try {
            // Tạo element link ẩn để thực hiện tải
            const downloadLink = document.createElement('a');
            downloadLink.href = game.downloadLink;
            downloadLink.download = `${game.title.replace(/\s+/g, '_')}_Vietnamese.zip`;
            downloadLink.style.display = 'none';
            
            // Thêm vào DOM và click
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // Xóa element sau khi sử dụng
            document.body.removeChild(downloadLink);
            
            showSuccessNotification(`Đã bắt đầu tải ${game.title} (Bản Việt hóa)`);
            
        } catch (error) {
            console.error('Lỗi khi tải file:', error);
            showErrorNotification('Có lỗi xảy ra khi tải file. Vui lòng thử lại sau!');
        }
    }, 1000);
}

// Update download count in the UI
function updateDownloadCount(gameId, newCount) {
    const gameCard = document.querySelector(`[data-game-id="${gameId}"]`);
    if (gameCard) {
        const downloadCountElement = gameCard.querySelector('.download-count span');
        if (downloadCountElement) {
            downloadCountElement.textContent = formatNumber(newCount);
        }
    }
    
    // Update in modal if open
    const modalStats = document.querySelector('.game-stats');
    if (modalStats) {
        const downloadStat = modalStats.children[1];
        if (downloadStat) {
            downloadStat.children[1].textContent = formatNumber(newCount);
        }
    }
}

// Show download notification - thông báo tải thành công
function showDownloadNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-info alert-dismissible fade show position-fixed';
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1060; min-width: 300px;';
    
    notification.innerHTML = `
        <i class="fas fa-download me-2"></i>
        <strong>Đang tải...</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Show success notification - thông báo thành công
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show position-fixed';
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1060; min-width: 300px;';
    
    notification.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>Thành công!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Show error notification - thông báo lỗi
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1060; min-width: 300px;';
    
    notification.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Lỗi!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Animate counters in stats section
function animateCounters() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-card h3');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Animate counter function
function animateCounter(element) {
    const target = element.textContent;
    const numericValue = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/\d/g, '');
    
    let current = 0;
    const increment = numericValue / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 20);
}

// Search functionality (for future enhancement)
function searchGames(query) {
    const filteredGames = gameData.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase()) ||
        game.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );
    
    displayFilteredGames(filteredGames);
}

// Display filtered games
function displayFilteredGames(games) {
    gamesList.innerHTML = '';
    
    if (games.length === 0) {
        gamesList.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-search me-2"></i>
                    Không tìm thấy game nào phù hợp với từ khóa tìm kiếm.
                </div>
            </div>
        `;
        return;
    }
    
    games.forEach(game => {
        const gameCard = createGameCard(game);
        gamesList.appendChild(gameCard);
    });
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add scroll-to-top functionality
function addScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'btn btn-primary position-fixed';
    scrollButton.style.cssText = 'bottom: 30px; right: 30px; z-index: 1000; border-radius: 50%; width: 50px; height: 50px; display: none;';
    
    scrollButton.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
}

// Initialize scroll-to-top button
document.addEventListener('DOMContentLoaded', addScrollToTop);

// Screenshot modal functionality
function showScreenshotModal(imageSrc, gameTitle, index) {
    // Create modal if it doesn't exist
    let screenshotModal = document.getElementById('screenshotModal');
    if (!screenshotModal) {
        createScreenshotModal();
        screenshotModal = document.getElementById('screenshotModal');
    }
    
    const modalImage = screenshotModal.querySelector('.modal-body img');
    const modalTitle = screenshotModal.querySelector('.modal-title');
    
    modalImage.src = imageSrc;
    modalTitle.textContent = `${gameTitle} - Ảnh chụp màn hình ${index}`;
    
    const modal = new bootstrap.Modal(screenshotModal);
    modal.show();
}

// Create screenshot modal
function createScreenshotModal() {
    const modalHTML = `
        <div class="modal fade" id="screenshotModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ảnh chụp màn hình</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="" alt="Screenshot" class="img-fluid rounded" style="max-height: 70vh;">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Handle window resize
window.addEventListener('resize', () => {
    // Update any responsive elements if needed
    console.log('Window resized');
});

// Add loading states for better UX
function showLoadingState(element) {
    element.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

function hideLoadingState(element, content) {
    element.innerHTML = content;
}
