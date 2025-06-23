// Vietnamese Games Website JavaScript with Download Counter

// Game data with download counter
const gameData = {
    neighbours: {
        title: "Neighbours from Hell",
        description: "Chào mừng bạn đến với cuộc sống của Woody - chàng trai có sở thích đặc biệt là làm khổ hàng xóm! 🏠💥 Trong thế giới tuyệt vời này, bạn sẽ được thỏa mãn mọi ước mơ 'trả thù' mà không cần lo lắng về hậu quả pháp lý. Hãy sử dụng trí tuệ và sự sáng tạo để biến ngôi nhà hàng xóm thành một 'chiến trường' đầy tiếng cười! Từ việc thay đổi chương trình TV thành kênh opera (khi ông ta đang xem bóng đá), đến việc 'trang trí' bánh sinh nhật bằng kem cạo râu, mỗi trò đùa đều là một tác phẩm nghệ thuật! Game này không chỉ rèn luyện tư duy logic mà còn giúp bạn trở thành một 'thiên tài của sự troll' - một kỹ năng vô cùng hữu ích trong cuộc sống! 😂🎭 Lưu ý: Đây là game, đừng áp dụng vào đời thực nhé!",
        genre: "Puzzle",
        rating: "4.2/5",
        size: "2.5 GB",
        language: "Việt hóa 100%",
        developer: "JoWooD Entertainment",
        releaseDate: "25/06/2003",
        mainImage: "https://i.ibb.co/F4kF3sxn/Blitzkrieg-II-Screenshot-2025-06-19-11-03-56-20.png",
        screenshots: [
            "https://i.ibb.co/nMs0sJHF/Blitzkrieg-II-Screenshot-2025-06-19-11-01-28-46.png",
            "https://i.ibb.co/v6n1Fwrs/Blitzkrieg-II-Screenshot-2025-06-20-20-07-44-53.png",
            "https://i.ibb.co/QvVFNXDD/Blitzkrieg-II-Screenshot-2025-06-20-20-07-48-24.png"
        ],
        systemRequirements: {
            minimum: [
                "OS: Windows XP/Vista/7/8/10",
                "Processor: Intel Pentium III 800 MHz",
                "Memory: 256 MB RAM",
                "Graphics: DirectX 8.1 compatible",
                "DirectX: Version 8.1",
                "Storage: 3 GB available space"
            ],
            recommended: [
                "OS: Windows 10 64-bit",
                "Processor: Intel Core i3-2100 hoặc AMD equivalent",
                "Memory: 512 MB RAM",
                "Graphics: DirectX 9.0c compatible",
                "DirectX: Version 9.0c",
                "Storage: 3 GB available space"
            ]
        },
        downloadGameLink: "#",
        downloadVietnameseLink: "https://raw.githubusercontent.com/khahdihdz/khahdihdz.github.io/refs/heads/main/games/upload/Neighbours%20from%20Hell%20-%20Revenge%20Is%20a%20Sweet%20Game.zip",
        downloadCount: {
            game: 0,
            vietnamese: 0
        }
    },
    neighbours2: {
        title: "Neighbours from Hell 2: On Vacation",
        description: "Woody trở lại với những trò đùa còn kinh khủng hơn! 🏖️✈️ Lần này, cuộc phiêu lưu mở rộng ra khỏi khu phố khi Woody quyết định 'đi nghỉ mát' cùng gia đình hàng xóm khó chịu của mình. Từ những bãi biển nhiệt đới đến những ngọn núi tuyết phủ, mọi địa điểm đều trở thành sân chơi cho những trò nghịch ngợm của chàng trai này! 🎪🎯 Với đồ họa được cải thiện, nhiều tình huống hài hước hơn và hàng loạt đạo cụ mới, bạn sẽ có cơ hội thực hiện những kế hoạch 'trả đũa' hoàn hảo. Từ việc thay kem chống nắng bằng mật ong (và xem hàng xóm trở thành 'nam châm' với ong bướm), đến việc biến chuyến đi trượt tuyết thành một 'cuộc phiêu lưu' đầy bất ngờ! Hãy chuẩn bị cho một kỳ nghỉ không bao giờ quên... với hàng xóm! 😈🎊",
        genre: "Puzzle",
        rating: "4.5/5",
        size: "3.2 GB",
        language: "Việt hóa 100%",
        developer: "JoWooD Entertainment",
        releaseDate: "15/03/2004",
        mainImage: "https://i.ibb.co/5x91x0ct/Blitzkrieg-II-Screenshot-2025-06-22-22-34-26-20.png",
        screenshots: [
            "https://i.ibb.co/d06tW6cN/Blitzkrieg-II-Screenshot-2025-06-22-22-13-39-94.png",
            "https://i.ibb.co/HfMxQfhZ/Blitzkrieg-II-Screenshot-2025-06-22-22-13-56-62.png",
            "https://i.ibb.co/8gkqQLYB/Blitzkrieg-II-Screenshot-2025-06-22-22-14-03-55.png"
        ],
        systemRequirements: {
            minimum: [
                "OS: Windows XP/Vista/7/8/10/11",
                "Processor: Intel Pentium III 1.0 GHz",
                "Memory: 512 MB RAM",
                "Graphics: DirectX 8.1 compatible",
                "DirectX: Version 8.1",
                "Storage: 4 GB available space"
            ],
            recommended: [
                "OS: Windows 10/11 64-bit",
                "Processor: Intel Core i3-3220 hoặc AMD equivalent",
                "Memory: 1 GB RAM",
                "Graphics: DirectX 9.0c compatible",
                "DirectX: Version 9.0c",
                "Storage: 4 GB available space"
            ]
        },
        downloadGameLink: "#",
        downloadVietnameseLink: "https://raw.githubusercontent.com/khahdihdz/khahdihdz.github.io/refs/heads/main/games/upload/Neighbours%20from%20Hell%202%20-%20On%20Vacation.zip",
        downloadCount: {
            game: 0,
            vietnamese: 0
        }
    }
};

// Download counter management
const DownloadCounter = {
    // Initialize download counts from memory or set defaults
    init() {
        Object.keys(gameData).forEach(gameKey => {
            const savedCounts = this.loadDownloadCounts(gameKey);
            if (savedCounts) {
                gameData[gameKey].downloadCount = savedCounts;
            }
        });
        this.updateAllDownloadDisplays();
    },

    // Save download counts to memory (in a real app, this would be saved to a database)
    saveDownloadCounts(gameKey, counts) {
        // Since we can't use localStorage, we'll simulate saving to memory
        // In a real application, this would send data to a server
        gameData[gameKey].downloadCount = counts;
        console.log(`Download counts saved for ${gameKey}:`, counts);
    },

    // Load download counts from memory
    loadDownloadCounts(gameKey) {
        // In a real application, this would fetch from a server/database
        return gameData[gameKey].downloadCount || { game: 0, vietnamese: 0 };
    },

    // Increment download count
    incrementDownload(gameKey, type) {
        if (!gameData[gameKey]) return;
        
        gameData[gameKey].downloadCount[type]++;
        this.saveDownloadCounts(gameKey, gameData[gameKey].downloadCount);
        this.updateDownloadDisplay(gameKey);
        
        // Show increment animation
        this.showDownloadAnimation(gameKey, type);
    },

    // Update download display for a specific game
    updateDownloadDisplay(gameKey) {
        const gameCount = gameData[gameKey].downloadCount;
        const totalCount = gameCount.game + gameCount.vietnamese;
        
        // Update in game cards
        const gameCards = document.querySelectorAll(`[data-game="${gameKey}"]`);
        gameCards.forEach(card => {
            const downloadCounter = card.closest('.game-card').querySelector('.download-stats');
            if (downloadCounter) {
                downloadCounter.innerHTML = `
                    <i class="fas fa-download me-1"></i>
                    <span class="download-count">${this.formatNumber(totalCount)}</span> lượt tải
                `;
            }
        });

        // Update in modal if open
        const modal = document.getElementById('gameModal');
        if (modal && modal.classList.contains('show')) {
            const modalDownloadStats = modal.querySelector('.modal-download-stats');
            if (modalDownloadStats) {
                modalDownloadStats.innerHTML = `
                    <div class="download-statistics">
                        <h6><i class="fas fa-chart-bar me-2"></i>Thống kê tải về:</h6>
                        <div class="row text-center">
                            <div class="col-md-4">
                                <div class="stat-box">
                                    <div class="stat-number">${this.formatNumber(totalCount)}</div>
                                    <div class="stat-label">Tổng lượt tải</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-box">
                                    <div class="stat-number">${this.formatNumber(gameCount.game)}</div>
                                    <div class="stat-label">Game gốc</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-box">
                                    <div class="stat-number">${this.formatNumber(gameCount.vietnamese)}</div>
                                    <div class="stat-label">Việt hóa</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    },

    // Update all download displays
    updateAllDownloadDisplays() {
        Object.keys(gameData).forEach(gameKey => {
            this.updateDownloadDisplay(gameKey);
        });
    },

    // Format large numbers (1000 -> 1K, 1000000 -> 1M)
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Show download animation
    showDownloadAnimation(gameKey, type) {
        const notification = document.createElement('div');
        notification.className = 'download-animation';
        notification.innerHTML = `
            <i class="fas fa-download"></i>
            <span>+1 Download</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            animation: downloadPop 2s ease-out forwards;
            pointer-events: none;
        `;

        // Add animation keyframes if not exists
        if (!document.getElementById('downloadAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'downloadAnimationStyle';
            style.textContent = `
                @keyframes downloadPop {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.5);
                    }
                    20% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    40% {
                        transform: translate(-50%, -50%) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -70%) scale(0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 2000);
    },

    // Get popular games based on download count
    getPopularGames() {
        return Object.entries(gameData)
            .map(([key, game]) => ({
                key,
                ...game,
                totalDownloads: game.downloadCount.game + game.downloadCount.vietnamese
            }))
            .sort((a, b) => b.totalDownloads - a.totalDownloads);
    }
};

// DOM elements
let searchInput, categoryFilter, gamesContainer, gameModal, modalTitle, modalBody, downloadGameBtn, downloadVietnameseBtn;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    gamesContainer = document.getElementById('gamesContainer');
    gameModal = document.getElementById('gameModal');
    modalTitle = document.getElementById('modalTitle');
    modalBody = document.getElementById('modalBody');
    downloadGameBtn = document.getElementById('downloadGameBtn');
    downloadVietnameseBtn = document.getElementById('downloadVietnameseBtn');
    
    // Initialize features
    DownloadCounter.init();
    initSmoothScrolling();
    initAnimations();
    initSearch();
    initModal();
    initNavbarEffects();
    initGameCardEffects();
    initEasterEgg();
    initNotificationSystem();
    initDownloadStats();
    
    console.log('Website initialized successfully with download counter!');
});

// Initialize download statistics
function initDownloadStats() {
    // Add download stats to existing game cards
    document.querySelectorAll('.game-card').forEach(card => {
        const gameKey = card.querySelector('[data-bs-toggle="modal"]').getAttribute('data-game');
        if (gameKey && gameData[gameKey]) {
            // Add download stats element if not exists
            if (!card.querySelector('.download-stats')) {
                const cardBody = card.querySelector('.card-body');
                const downloadStats = document.createElement('div');
                downloadStats.className = 'download-stats text-muted small mt-2';
                cardBody.appendChild(downloadStats);
            }
        }
    });
    
    // Update all displays
    DownloadCounter.updateAllDownloadDisplays();
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
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

// Initialize animations
function initAnimations() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Initialize search functionality
function initSearch() {
    if (searchInput) {
        searchInput.addEventListener('input', filterGames);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterGames);
    }
}

// Search and filter functionality
function filterGames() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const categoryBadges = card.querySelectorAll('.badge');
        let category = '';
        
        // Find the category badge (not the language badge)
        categoryBadges.forEach(badge => {
            if (!badge.textContent.includes('Việt hóa') && !badge.textContent.includes('%')) {
                category = badge.textContent;
            }
        });
        
        const matchesSearch = title.includes(searchTerm);
        const matchesCategory = selectedCategory === '' || category === selectedCategory;
        
        if (matchesSearch && matchesCategory) {
            card.parentElement.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}

// Initialize modal functionality
function initModal() {
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const gameKey = this.getAttribute('data-game');
            if (gameKey && gameData[gameKey]) {
                loadGameDetails(gameData[gameKey], gameKey);
            }
        });
    });
    
    // Initialize download buttons
    document.addEventListener('click', function(e) {
        if (e.target.id === 'downloadGameBtn') {
            handleDownload(e, 'game');
        } else if (e.target.id === 'downloadVietnameseBtn') {
            handleDownload(e, 'vietnamese');
        }
    });
}

// Load game details into modal
function loadGameDetails(game, gameKey) {
    if (!modalTitle || !modalBody) return;
    
    modalTitle.textContent = game.title;
    
    const totalDownloads = game.downloadCount.game + game.downloadCount.vietnamese;
    
    const modalContent = `
        <div class="row">
            <div class="col-md-6">
                <img src="${game.mainImage}" alt="${game.title}" class="game-detail-image" id="mainGameImage">
                <div class="game-screenshots">
                    ${game.screenshots.map(screenshot => 
                        `<img src="${screenshot}" alt="Screenshot" class="screenshot" onclick="changeMainImage('${screenshot}')">`
                    ).join('')}
                </div>
            </div>
            <div class="col-md-6">
                <div class="game-info-detail">
                    <h6><i class="fas fa-gamepad me-2"></i>Thể loại:</h6>
                    <p>${game.genre}</p>
                    
                    <h6><i class="fas fa-star me-2"></i>Đánh giá:</h6>
                    <p>${game.rating}</p>
                    
                    <h6><i class="fas fa-hdd me-2"></i>Dung lượng:</h6>
                    <p>${game.size}</p>
                    
                    <h6><i class="fas fa-language me-2"></i>Ngôn ngữ:</h6>
                    <p>${game.language}</p>
                    
                    <h6><i class="fas fa-user me-2"></i>Nhà phát triển:</h6>
                    <p>${game.developer}</p>
                    
                    <h6><i class="fas fa-calendar me-2"></i>Ngày phát hành:</h6>
                    <p>${game.releaseDate}</p>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12">
                <div class="modal-download-stats">
                    <div class="download-statistics">
                        <h6><i class="fas fa-chart-bar me-2"></i>Thống kê tải về:</h6>
                        <div class="row text-center">
                            <div class="col-md-4">
                                <div class="stat-box">
                                    <div class="stat-number">${DownloadCounter.formatNumber(totalDownloads)}</div>
                                    <div class="stat-label">Tổng lượt tải</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-box">
                                    <div class="stat-number">${DownloadCounter.formatNumber(game.downloadCount.game)}</div>
                                    <div class="stat-label">Game gốc</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-box">
                                    <div class="stat-number">${DownloadCounter.formatNumber(game.downloadCount.vietnamese)}</div>
                                    <div class="stat-label">Việt hóa</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12">
                <h6><i class="fas fa-info-circle me-2"></i>Mô tả:</h6>
                <p>${game.description}</p>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12">
                <div class="system-requirements">
                    <h6><i class="fas fa-desktop me-2"></i>Cấu hình hệ thống:</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="text-primary">Tối thiểu:</h6>
                            <ul>
                                ${game.systemRequirements.minimum.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h6 class="text-success">Khuyến nghị:</h6>
                            <ul>
                                ${game.systemRequirements.recommended.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12">
                <div class="download-links text-center">
                    <h6><i class="fas fa-download me-2"></i>Tải về:</h6>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                        <button class="btn btn-success btn-lg me-md-2" id="downloadGameBtn" data-link="${game.downloadGameLink}" data-game-key="${gameKey}" data-type="game">
                            <i class="fas fa-gamepad me-2"></i>Tải Game Gốc
                            <small class="d-block">(${DownloadCounter.formatNumber(game.downloadCount.game)} lượt tải)</small>
                        </button>
                        <button class="btn btn-primary btn-lg" id="downloadVietnameseBtn" data-link="${game.downloadVietnameseLink}" data-game-key="${gameKey}" data-type="vietnamese">
                            <i class="fas fa-language me-2"></i>Tải Việt Hóa
                            <small class="d-block">(${DownloadCounter.formatNumber(game.downloadCount.vietnamese)} lượt tải)</small>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
    
    // Add CSS for stat boxes if not exists
    if (!document.getElementById('downloadStatsStyle')) {
        const style = document.createElement('style');
        style.id = 'downloadStatsStyle';
        style.textContent = `
            .download-statistics {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
            }
            .stat-box {
                background: white;
                border-radius: 8px;
                padding: 15px;
                margin: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .stat-box:hover {
                transform: translateY(-5px);
            }
            .stat-number {
                font-size: 2rem;
                font-weight: bold;
                color: #007bff;
            }
            .stat-label {
                font-size: 0.9rem;
                color: #6c757d;
                margin-top: 5px;
            }
            .download-stats {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.85rem;
            }
            .download-count {
                font-weight: 600;
                color: #28a745;
            }
        `;
        document.head.appendChild(style);
    }
}

// Change main image in modal
function changeMainImage(newSrc) {
    const mainImg = document.getElementById('mainGameImage');
    if (mainImg) {
        mainImg.style.transform = 'scale(0.95)';
        mainImg.style.opacity = '0.7';
        
        setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.transform = 'scale(1)';
            mainImg.style.opacity = '1';
        }, 150);
    }
}

// Initialize navbar scroll effects
function initNavbarEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(13, 110, 253, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.transition = 'all 0.3s ease';
            } else {
                navbar.style.backgroundColor = '';
                navbar.style.backdropFilter = '';
            }
        }
    });
}

// Handle download button click
function handleDownload(e, type) {
    e.preventDefault();
    
    const button = e.target;
    const downloadLink = button.getAttribute('data-link');
    const gameKey = button.getAttribute('data-game-key');
    const downloadType = button.getAttribute('data-type');
    
    if (!button || !downloadLink || !gameKey) return;
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Đang tải...';
    button.disabled = true;
    
    const downloadTypeName = downloadType === 'game' ? 'game gốc' : 'bản việt hóa';
    
    // Simulate download process
    setTimeout(() => {
        // Increment download counter
        DownloadCounter.incrementDownload(gameKey, downloadType);
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Update button text with new count
        const newCount = gameData[gameKey].downloadCount[downloadType];
        button.innerHTML = button.innerHTML.replace(
            /\(\d+[\w.]* lượt tải\)/,
            `(${DownloadCounter.formatNumber(newCount)} lượt tải)`
        );
        
        // Show success message
        showNotification(`Bắt đầu tải ${downloadTypeName}! Kiểm tra thư mục Downloads của bạn.`, 'success');
        
        // Open download link in new tab
        if (downloadLink !== '#') {
            window.open(downloadLink, '_blank');
        }
        
        // Close modal after a short delay
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(gameModal);
            if (modal) {
                modal.hide();
            }
        }, 2000);
    }, 2000);
}

// Initialize notification system
function initNotificationSystem() {
    // Add notification container if it doesn't exist
    if (!document.getElementById('notificationContainer')) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.style.cssText = `
        min-width: 300px;
        margin-bottom: 10px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: none;
        border-radius: 8px;
    `;
    
    const iconClass = type === 'success' ? 'check-circle' : 
                     type === 'danger' ? 'exclamation-circle' : 
                     type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${iconClass} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="removeNotification(this.parentElement)"></button>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

// Remove notification
function removeNotification(notification) {
    if (notification && notification.parentElement) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }
}

// Initialize game card hover effects
function initGameCardEffects() {
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
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

// Initialize Easter egg - Konami Code
function initEasterEgg() {
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showNotification('🎮 Konami Code activated! Bạn là một game thủ thực thụ!', 'success');
            activateRainbowEffect();
            // Bonus: Add some fake downloads as reward
            Object.keys(gameData).forEach(gameKey => {
                DownloadCounter.incrementDownload(gameKey, 'vietnamese');
                DownloadCounter.incrementDownload(gameKey, 'game');
            });
            konamiCode = []; // Reset
        }
    });
}

// Activate rainbow effect
function activateRainbowEffect() {
    // Add rainbow animation to CSS if not exists
    if (!document.getElementById('rainbowStyle')) {
        const style = document.createElement('style');
        style.id = 'rainbowStyle';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                25% { filter: hue-rotate(90deg); }
                50% { filter: hue-rotate(180deg); }
                75% { filter: hue-rotate(270deg); }
                100% { filter: hue-rotate(360deg); }
            }
            .rainbow-effect {
                animation: rainbow 2s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.classList.add('rainbow-effect');
    setTimeout(() => {
        document.body.classList.remove('rainbow-effect');
    }, 2000);
}

// Add popular games section functionality
function createPopularGamesSection() {
    const popularGames = DownloadCounter.getPopularGames().slice(0, 3);
    
    const popularSection = document.createElement('section');
    popularSection.className = 'popular-games-section py-5';
    popularSection.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-4">
                    <h2 class="section-title">
                        <i class="fas fa-fire me-2 text-danger"></i>
                        Game Được Tải Nhiều Nhất
                    </h2>
                    <p class="text-muted">Những game được cộng đồng yêu thích nhất</p>
                </div>
            </div>
            <div class="row">
                ${popularGames.map((game, index) => `
                    <div class="col-md-4 mb-4">
                        <div class="popular-game-card">
                            <div class="rank-badge">#${index + 1}</div>
                            <img src="${game.mainImage}" alt="${game.title}" class="popular-game-image">
                            <div class="popular-game-info">
                                <h5>${game.title}</h5>
                                <div class="download-info">
                                    <i class="fas fa-download me-1"></i>
                                    <span class="fw-bold text-success">${DownloadCounter.formatNumber(game.totalDownloads)}</span>
                                    lượt tải
                                </div>
                                <button class="btn btn-primary btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#gameModal" data-game="${game.key}">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add CSS for popular games section
    if (!document.getElementById('popularGamesStyle')) {
        const style = document.createElement('style');
        style.id = 'popularGamesStyle';
        style.textContent = `
            .popular-games-section {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .popular-game-card {
                position: relative;
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
                color: #333;
            }
            .popular-game-card:hover {
                transform: translateY(-10px);
            }
            .rank-badge {
                position: absolute;
                top: 10px;
                left: 10px;
                background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2rem;
                z-index: 2;
                box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
            }
            .popular-game-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }
            .popular-game-info {
                padding: 20px;
                text-align: center;
            }
            .download-info {
                color: #28a745;
                font-size: 1.1rem;
                margin: 10px 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    return popularSection;
}

// Initialize download statistics dashboard
function initDownloadStatsDashboard() {
    // Create stats dashboard button
    const statsButton = document.createElement('button');
    statsButton.className = 'btn btn-info position-fixed';
    statsButton.style.cssText = `
        bottom: 20px;
        left: 20px;
        z-index: 1000;
        border-radius: 50px;
        padding: 12px 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    statsButton.innerHTML = '<i class="fas fa-chart-line me-2"></i>Thống kê';
    statsButton.onclick = showStatsDashboard;
    
    document.body.appendChild(statsButton);
}

// Show statistics dashboard
function showStatsDashboard() {
    const totalDownloads = Object.values(gameData).reduce((total, game) => 
        total + game.downloadCount.game + game.downloadCount.vietnamese, 0
    );
    
    const mostPopular = DownloadCounter.getPopularGames()[0];
    
    const statsModal = document.createElement('div');
    statsModal.className = 'modal fade';
    statsModal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-chart-bar me-2"></i>
                        Thống kê Download
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row text-center mb-4">
                        <div class="col-md-4">
                            <div class="stats-card">
                                <div class="stats-icon">
                                    <i class="fas fa-download"></i>
                                </div>
                                <div class="stats-number">${DownloadCounter.formatNumber(totalDownloads)}</div>
                                <div class="stats-label">Tổng lượt tải</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stats-card">
                                <div class="stats-icon">
                                    <i class="fas fa-gamepad"></i>
                                </div>
                                <div class="stats-number">${Object.keys(gameData).length}</div>
                                <div class="stats-label">Tổng số game</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stats-card">
                                <div class="stats-icon">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div class="stats-number">${DownloadCounter.formatNumber(mostPopular ? mostPopular.totalDownloads : 0)}</div>
                                <div class="stats-label">Game phổ biến nhất</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-stats-list">
                        <h6 class="mb-3">Chi tiết theo game:</h6>
                        ${DownloadCounter.getPopularGames().map(game => `
                            <div class="game-stat-item d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded">
                                <div class="d-flex align-items-center">
                                    <img src="${game.mainImage}" alt="${game.title}" class="game-stat-thumb me-3">
                                    <div>
                                        <h6 class="mb-1">${game.title}</h6>
                                        <small class="text-muted">${game.genre}</small>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <div class="fw-bold text-success">${DownloadCounter.formatNumber(game.totalDownloads)} lượt tải</div>
                                    <small class="text-muted">
                                        Game: ${DownloadCounter.formatNumber(game.downloadCount.game)} | 
                                        Việt hóa: ${DownloadCounter.formatNumber(game.downloadCount.vietnamese)}
                                    </small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for stats modal
    if (!document.getElementById('statsModalStyle')) {
        const style = document.createElement('style');
        style.id = 'statsModalStyle';
        style.textContent = `
            .stats-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 20px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            }
            .stats-icon {
                font-size: 3rem;
                margin-bottom: 15px;
                opacity: 0.8;
            }
            .stats-number {
                font-size: 2.5rem;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .stats-label {
                font-size: 1rem;
                opacity: 0.9;
            }
            .game-stat-thumb {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
            }
            .game-stat-item {
                transition: transform 0.2s ease;
            }
            .game-stat-item:hover {
                transform: translateX(5px);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(statsModal);
    const modal = new bootstrap.Modal(statsModal);
    modal.show();
    
    // Remove modal after it's hidden
    statsModal.addEventListener('hidden.bs.modal', () => {
        statsModal.remove();
    });
}

// Utility function to debounce function calls
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

// Apply debounce to search
if (typeof filterGames === 'function') {
    const debouncedFilter = debounce(filterGames, 300);
    // Re-assign the debounced version when initializing search
}

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
                console.log(`Download counter initialized with ${Object.keys(gameData).length} games`);
            }, 0);
        });
    }
}

// Initialize performance monitoring
logPerformance();

// Initialize additional features after DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize download stats dashboard
    initDownloadStatsDashboard();
    
    // Add popular games section to main content if games section exists
    const gamesSection = document.querySelector('#games');
    if (gamesSection) {
        const popularSection = createPopularGamesSection();
        gamesSection.parentNode.insertBefore(popularSection, gamesSection.nextSibling);
    }
});

// Export functions for global access
window.changeMainImage = changeMainImage;
window.removeNotification = removeNotification;
window.showNotification = showNotification;
window.DownloadCounter = DownloadCounter;
window.showStatsDashboard = showStatsDashboard;

// Console welcome message with download counter info
console.log(`
🎮 Vietnamese Games Website Loaded Successfully with Download Counter!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Features:
• Game search and filtering
• Detailed game modals with download statistics
• Download counter with real-time updates
• Popular games section based on download counts
• Statistics dashboard
• Smooth animations and notifications
• Easter egg (try Konami Code for bonus downloads!)
• Responsive design

Download Counter Features:
• Tracks game and Vietnamese pack downloads separately
• Shows formatted numbers (1K, 1M format)
• Real-time counter updates
• Download animations
• Statistics dashboard
• Popular games ranking

Current Download Stats:
${Object.entries(gameData).map(([key, game]) => 
    `• ${game.title}: ${game.downloadCount.game + game.downloadCount.vietnamese} total downloads`
).join('\n')}

Try downloading games to see the counter in action!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Website Error:', e.error);
    showNotification('Đã xảy ra lỗi. Vui lòng tải lại trang.', 'danger');
});

// Prevent right-click context menu on images (optional)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Add some initial download counts for demo purposes
setTimeout(() => {
    // Simulate some existing downloads
    gameData.neighbours.downloadCount = { game: 1250, vietnamese: 2100 };
    gameData.neighbours2.downloadCount = { game: 980, vietnamese: 1650 };
    
    // Update displays
    DownloadCounter.updateAllDownloadDisplays();
    
    console.log('Demo download counts loaded!');
}, 1000);

// Auto-save download counts periodically (in a real app, this would sync with server)
setInterval(() => {
    console.log('Auto-saving download counts...', {
        neighbours: gameData.neighbours.downloadCount,
        neighbours2: gameData.neighbours2.downloadCount
    });
}, 30000); // Every 30 seconds