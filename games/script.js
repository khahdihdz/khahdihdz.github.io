// Vietnamese Games Website JavaScript

// Game data
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
        downloadGameLink: "https://drive.google.com/file/d/1abcdefghijklmnop/view?usp=sharing",
        downloadVietnameseLink: "https://raw.githubusercontent.com/khahdihdz/khahdihdz.github.io/refs/heads/main/games/upload/Neighbours%20from%20Hell%20-%20Revenge%20Is%20a%20Sweet%20Game.zip"
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
        mainImage: "https://i.ibb.co/QvVFNXDD/Blitzkrieg-II-Screenshot-2025-06-20-20-07-48-24.png",
        screenshots: [
            "https://i.ibb.co/v6n1Fwrs/Blitzkrieg-II-Screenshot-2025-06-20-20-07-44-53.png",
            "https://i.ibb.co/nMs0sJHF/Blitzkrieg-II-Screenshot-2025-06-19-11-01-28-46.png",
            "https://i.ibb.co/F4kF3sxn/Blitzkrieg-II-Screenshot-2025-06-19-11-03-56-20.png"
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
        downloadGameLink: "https://drive.google.com/file/d/1neighbours2gamelink/view?usp=sharing",
        downloadVietnameseLink: "https://raw.githubusercontent.com/khahdihdz/khahdihdz.github.io/refs/heads/main/games/upload/Neighbours%20from%20Hell%202%20-%20On%20Vacation.zip"
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
function loadGameDetails(game) {
    if (!modalTitle || !modalBody) return;
    
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
                        <button class="btn btn-success btn-lg me-md-2" id="downloadGameBtn" data-link="${game.downloadGameLink}">
                            <i class="fas fa-gamepad me-2"></i>Tải Game Gốc
                        </button>
                        <button class="btn btn-primary btn-lg" id="downloadVietnameseBtn" data-link="${game.downloadVietnameseLink}">
                            <i class="fas fa-language me-2"></i>Tải Việt Hóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
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
    
    if (!button || !downloadLink) return;
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Đang tải...';
    button.disabled = true;
    
    const downloadType = type === 'game' ? 'game gốc' : 'bản việt hóa';
    
    // Simulate download process
    setTimeout(() => {
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        showNotification(`Bắt đầu tải ${downloadType}! Kiểm tra thư mục Downloads của bạn.`, 'success');
        
        // Open download link in new tab
        window.open(downloadLink, '_blank');
        
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

// Console welcome message
console.log(`
🎮 Vietnamese Games Website Loaded Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Features:
• Game search and filtering
• Detailed game modals
• Smooth animations
• Responsive design
• Easter egg (try Konami Code!)
• Notification system

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
