// Vietnamese Games List JavaScript

// Sample game data
const gamesData = [
    {
        id: 1,
        title: "Neighbours from Hell",
        description: "Game puzzle hài hước về một gã hàng xóm phá phách. Hãy trở thành Woody và thực hiện những trò nghịch ngợm để trêu chọc hàng xóm Mr. Rottweiler trong chương trình TV thực tế.",
        category: "adventure",
        status: "completed",
        statusText: "Hoàn thành 100%",
        icon: "😈",
        downloadLink: "#download-neighbours",
        releaseYear: 2003,
        size: "150MB",
        screenshots: [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/260750/ss_c0b156c13b3da5b06ec16a31073b41dcf9ad6948.1920x1080.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/260750/ss_59fbcaae3e3ffcbdc0ac96d2c42add3ad32d7cb7.1920x1080.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/260750/ss_e3fd0b1b0e4a3b16c4a36d3b4a09dafce27b1f47.1920x1080.jpg"
        ],
        features: [
            "Phụ đề tiếng Việt hoàn chỉnh",
            "Menu và giao diện đã việt hóa",
            "14 tập phim với 100+ trò nghịch ngợm",
            "Đồ họa 3D cartoon dễ thương",
            "Gameplay đơn giản, phù hợp mọi lứa tuổi"
        ],
        systemRequirements: {
            os: "Windows XP/Vista/7/8/10/11",
            processor: "Pentium III 500 MHz",
            memory: "64 MB RAM",
            graphics: "DirectX 8.0",
            storage: "200 MB"
        }
    }
];

// DOM Elements
const gamesContainer = document.getElementById('gamesContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// State
let filteredGames = [...gamesData];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderGames(gamesData);
    initializeEventListeners();
    addScrollAnimations();
});

// Render games to the DOM
function renderGames(games) {
    if (games.length === 0) {
        gamesContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="display-1 mb-3">😔</div>
                <h3>Không tìm thấy game nào</h3>
                <p class="text-muted">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
        `;
        return;
    }

    const gamesHTML = games.map(game => `
        <div class="col-12 game-item fade-in" data-category="${game.category}">
            <div class="game-card-detailed">
                <div class="row">
                    <div class="col-md-4">
                        <div class="game-screenshots">
                            <div id="carousel-${game.id}" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                    ${game.screenshots.map((screenshot, index) => `
                                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                            <img src="${screenshot}" class="d-block w-100 screenshot-img" alt="Screenshot ${index + 1}">
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${game.id}" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon"></span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carousel-${game.id}" data-bs-slide="next">
                                    <span class="carousel-control-next-icon"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="game-body-detailed">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <h3 class="game-title-detailed">${game.title}</h3>
                                <span class="game-category">${getCategoryName(game.category)}</span>
                            </div>
                            
                            <p class="game-description-detailed">${game.description}</p>
                            
                            <div class="game-features mb-3">
                                <h6 class="fw-bold mb-2">✨ Tính năng việt hóa:</h6>
                                <ul class="feature-list">
                                    ${game.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="game-info-row">
                                <div class="info-item">
                                    <span class="info-label">Trạng thái:</span>
                                    <span class="game-status ${game.status === 'completed' ? 'status-completed' : 'status-progress'}">
                                        ${game.statusText}
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Dung lượng:</span>
                                    <span class="text-muted">${game.size}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Năm phát hành:</span>
                                    <span class="text-muted">${game.releaseYear}</span>
                                </div>
                            </div>
                            
                            <div class="action-buttons mt-4">
                                <button class="download-btn me-2" onclick="handleDownload('${game.title}')">
                                    📥 Tải về ngay
                                </button>
                                <button class="detail-btn" onclick="showGameDetails(${game.id})">
                                    👁️ Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    gamesContainer.innerHTML = gamesHTML;
    
    // Add animation delay for each card
    const gameCards = document.querySelectorAll('.game-item');
    gameCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Get category display name
function getCategoryName(category) {
    const categories = {
        'rpg': 'RPG',
        'action': 'Hành động',
        'adventure': 'Phiêu lưu',
        'strategy': 'Chiến thuật'
    };
    return categories[category] || category;
}

// Initialize event listeners
function initializeEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Category filter
    categoryFilter.addEventListener('change', handleCategoryFilter);
    
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
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    applyFilters(searchTerm, categoryFilter.value);
}

// Handle category filter
function handleCategoryFilter(e) {
    const category = e.target.value;
    applyFilters(searchInput.value.toLowerCase().trim(), category);
}

// Apply filters
function applyFilters(searchTerm, category) {
    filteredGames = gamesData.filter(game => {
        const matchesSearch = !searchTerm || 
            game.title.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !category || game.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    renderGames(filteredGames);
}

// Show game details modal
function showGameDetails(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;
    
    const modalHTML = `
        <div class="modal fade" id="gameDetailModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-gradient text-white">
                        <h5 class="modal-title">${game.title} - Chi tiết</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="fw-bold mb-3">📱 Yêu cầu hệ thống:</h6>
                                <ul class="list-unstyled system-requirements">
                                    <li><strong>Hệ điều hành:</strong> ${game.systemRequirements.os}</li>
                                    <li><strong>Bộ xử lý:</strong> ${game.systemRequirements.processor}</li>
                                    <li><strong>Bộ nhớ:</strong> ${game.systemRequirements.memory}</li>
                                    <li><strong>Đồ họa:</strong> ${game.systemRequirements.graphics}</li>
                                    <li><strong>Dung lượng:</strong> ${game.systemRequirements.storage}</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6 class="fw-bold mb-3">🎮 Thông tin game:</h6>
                                <ul class="list-unstyled game-info-detail">
                                    <li><strong>Thể loại:</strong> ${getCategoryName(game.category)}</li>
                                    <li><strong>Năm phát hành:</strong> ${game.releaseYear}</li>
                                    <li><strong>Dung lượng:</strong> ${game.size}</li>
                                    <li><strong>Trạng thái việt hóa:</strong> <span class="${game.status === 'completed' ? 'status-completed' : 'status-progress'}">${game.statusText}</span></li>
                                </ul>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <div class="mb-3">
                            <h6 class="fw-bold mb-2">📝 Mô tả chi tiết:</h6>
                            <p>${game.description}</p>
                        </div>
                        
                        <div class="mb-3">
                            <h6 class="fw-bold mb-2">🌟 Điểm nổi bật của bản việt hóa:</h6>
                            <div class="row">
                                ${game.features.map(feature => `
                                    <div class="col-md-6 mb-2">
                                        <div class="feature-highlight">
                                            <i class="text-success">✓</i> ${feature}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="screenshot-gallery">
                            <h6 class="fw-bold mb-2">🖼️ Ảnh chụp màn hình:</h6>
                            <div class="row">
                                ${game.screenshots.map((screenshot, index) => `
                                    <div class="col-4 mb-2">
                                        <img src="${screenshot}" class="img-fluid rounded screenshot-thumb" alt="Screenshot ${index + 1}" onclick="showFullScreenshot('${screenshot}')">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="download-btn" onclick="handleDownload('${game.title}'); bootstrap.Modal.getInstance(document.getElementById('gameDetailModal')).hide();">
                            📥 Tải về ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('gameDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('gameDetailModal'));
    modal.show();
}

// Show full screenshot
function showFullScreenshot(imageSrc) {
    const fullScreenHTML = `
        <div class="modal fade" id="screenshotModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content bg-dark">
                    <div class="modal-header border-0">
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center p-0">
                        <img src="${imageSrc}" class="img-fluid" alt="Full Screenshot">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing screenshot modal if any
    const existingModal = document.getElementById('screenshotModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', fullScreenHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('screenshotModal'));
    modal.show();
}

// Handle download click
function handleDownload(gameTitle) {
    // Show download notification
    showNotification(`Bắt đầu tải "${gameTitle}"`, 'success');
    
    // In a real application, this would handle the actual download
    console.log(`Downloading: ${gameTitle}`);
}
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        <strong>${type === 'success' ? '✅' : 'ℹ️'}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Debounce function for search
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

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    setTimeout(() => {
        document.querySelectorAll('.game-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }, 100);
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add loading effect for images
    const gameImages = document.querySelectorAll('.game-image');
    gameImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === '/' && e.ctrlKey) {
            e.preventDefault();
            searchInput.focus();
        }
    });
});

// Stats counter animation
function animateStats() {
    const statsElements = document.querySelectorAll('[data-count]');
    
    statsElements.forEach(element => {
        const finalCount = parseInt(element.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentCount = Math.floor(progress * finalCount);
            
            element.textContent = currentCount;
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        }
        
        requestAnimationFrame(updateCount);
    });
}

// Initialize stats animation when section is visible
const statsSection = document.querySelector('#stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    statsObserver.observe(statsSection);
}