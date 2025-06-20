// Vietnamese Games Website JavaScript

// Game data
const gameData = {
    neighbours: {
        title: "Neighbours from Hell",
        description: "Neighbours from Hell là một game giải đố hài hước nơi bạn vào vai Woody - một chàng trai muốn trả thù hàng xóm khó tính của mình. Sử dụng trí thông minh và sự sáng tạo để tạo ra những trò đùa vui nhộn, từ việc đặt bẫy trong nhà bếp đến những màn khăm khổ ngoài sân vườn. Game mang đến tiếng cười và thử thách tư duy logic.",
        genre: "Puzzle",
        rating: "4.2/5",
        size: "2.5 GB",
        language: "Việt hóa 100%",
        developer: "JoWooD Entertainment",
        releaseDate: "25/06/2003",
        mainImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
        screenshots: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop"
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
        downloadLinks: {
            mirror1: "https://mega.nz/#!abc123def456",
            mirror2: "https://mediafire.com/file/neighbours-from-hell-vn/file"
        }
    }
};

// DOM elements
let searchInput, categoryFilter, gamesContainer, gameModal, modalTitle, modalBody, downloadBtn;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    gamesContainer = document.getElementById('gamesContainer');
    gameModal = document.getElementById('gameModal');
    modalTitle = document.getElementById('modalTitle');
    modalBody = document.getElementById('modalBody');
    downloadBtn = document.getElementById('downloadBtn');
    
    // Initialize features
    initSmoothScrolling();
    initAnimations();
    initSearch();
    initModal();
    initNavbarEffects();
    initGameCardEffects();
    initEasterEgg();
    initNotificationSystem();
    
    console.log('Website initialized successfully!');
});

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
                loadGameDetails(gameData[gameKey]);
            }
        });
    });
}

// Load game details into modal
function loadGameDetails(game) {
    if (!modalTitle || !modalBody || !downloadBtn) return;
    
    modalTitle.textContent = game.title;
    
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
                <h6><i class="fas fa-info-circle me-2"></i>Mô tả:</h6>
                <p>${game.description}</p>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12">
                <div class="download-section">
                    <h6><i class="fas fa-download me-2"></i>Link tải xuống:</h6>
                    <div class="download-links">
                        <div class="btn-group-vertical w-100" role="group">
                            
                            <button type="button" class="btn btn-info mb-2" onclick="handleDownloadLink('${game.downloadLinks.mirror1}', 'MEGA')">
                                <i class="fas fa-cloud me-2"></i>Tải từ MEGA (Mirror 1)
                            </button>
                            <button type="button" class="btn btn-warning mb-2" onclick="handleDownloadLink('${game.downloadLinks.mirror2}', 'MediaFire')">
                                <i class="fas fa-fire me-2"></i>Tải từ MediaFire (Mirror 2)
                            </button>
                            <button type="button" class="btn btn-dark" onclick="handleDownloadLink('${game.downloadLinks.torrent}', 'Torrent')">
                                <i class="fas fa-magnet me-2"></i>Tải bằng Torrent
                            </button>
                        </div>
                    </div>
                    <div class="download-note mt-3">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Lưu ý:</strong> Nếu link không hoạt động, hãy thử các link mirror khác.
                            Đối với Torrent, bạn cần phần mềm BitTorrent client.
                        </div>
                    </div>
                </div>
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
                <div class="install-guide">
                    <h6><i class="fas fa-cog me-2"></i>Hướng dẫn cài đặt:</h6>
                    <ol>
                        <li>Tải file game từ một trong các link trên</li>
                        <li>Giải nén file bằng WinRAR hoặc 7-Zip</li>
                        <li>Chạy file setup.exe để cài đặt</li>
                        <li>Copy crack (nếu có) vào thư mục cài đặt</li>
                        <li>Chạy game và thưởng thức!</li>
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
    
    // Update the main download button to show download options
    if (downloadBtn) {
        downloadBtn.style.display = 'none'; // Hide the main download button since we have multiple options now
    }
}

// Handle download link clicks
function handleDownloadLink(url, platform) {
    // Show loading state
    const clickedButton = event.target.closest('button');
    const originalText = clickedButton.innerHTML;
    clickedButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang chuyển hướng...';
    clickedButton.disabled = true;
    
    // Show notification
    showNotification(`Đang chuyển hướng đến ${platform}...`, 'info');
    
    // Simulate processing time
    setTimeout(() => {
        // Reset button
        clickedButton.innerHTML = originalText;
        clickedButton.disabled = false;
        
        // Check if it's a magnet link (torrent)
        if (url.startsWith('magnet:')) {
            // Try to open magnet link
            window.location.href = url;
            showNotification('Đã mở Torrent client. Nếu không tự động mở, hãy copy link thủ công.', 'success');
        } else {
            // Open regular download link
            window.open(url, '_blank');
            showNotification(`Đã mở link tải từ ${platform} trong tab mới.`, 'success');
        }
        
        // Track download attempt
        trackDownload(platform);
    }, 1500);
}

// Track download attempts (for analytics)
function trackDownload(platform) {
    console.log(`Download attempted from: ${platform}`);
    // Here you could send analytics data to your server
    // Example: gtag('event', 'download', { platform: platform });
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
            }, 0);
        });
    }
}

// Initialize performance monitoring
logPerformance();

// Export functions for global access
window.changeMainImage = changeMainImage;
window.removeNotification = removeNotification;
window.showNotification = showNotification;
window.handleDownloadLink = handleDownloadLink;

// Console welcome message
console.log(`
🎮 Vietnamese Games Website Loaded Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Features:
• Game search and filtering
• Detailed game modals with multiple download links
• Smooth animations
• Responsive design
• Easter egg (try Konami Code!)
• Notification system
• Download tracking

Try searching for games or clicking on game cards!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

// Add CSS for download section
const downloadStyles = document.createElement('style');
downloadStyles.textContent = `
    .game-detail-image {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
    }
    
    .game-screenshots {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .screenshot {
        width: 80px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .screenshot:hover {
        border-color: #0d6efd;
        transform: scale(1.1);
    }
    
    .download-section {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #dee2e6;
    }
    
    .download-links .btn {
        text-align: left;
        position: relative;
        overflow: hidden;
    }
    
    .download-links .btn:hover {
        transform: translateX(5px);
        transition: all 0.3s ease;
    }
    
    .install-guide {
        background: #e9ecef;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #28a745;
    }
    
    .system-requirements {
        background: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #ffeaa7;
    }
    
    .system-requirements ul {
        margin-bottom: 0;
        padding-left: 20px;
    }
    
    .system-requirements li {
        margin-bottom: 5px;
        font-size: 0.9em;
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .spinner-border-sm {
        width: 1rem;
        height: 1rem;
    }
`;

document.head.appendChild(downloadStyles);