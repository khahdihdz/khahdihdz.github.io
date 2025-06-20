// Vietnamese Games Website JavaScript

// Game data
const gameData = {
    cyberpunk: {
        title: "Cyberpunk 2077",
        description: "Cyberpunk 2077 là một game nhập vai thế giới mở lấy bối cảnh trong tương lai dystopian. Người chơi vào vai V, một mercenary đang cố gắng tìm kiếm một implant độc đáo là chìa khóa đến sự bất tử. Với đồ họa tuyệt đẹp, gameplay sâu sắc và cốt truyện hấp dẫn, đây là một trong những tựa game RPG đáng chơi nhất.",
        genre: "RPG",
        rating: "4.5/5",
        size: "70 GB",
        language: "Việt hóa 100%",
        developer: "CD Projekt Red",
        releaseDate: "10/12/2020",
        mainImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
        screenshots: [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop"
        ],
        systemRequirements: {
            minimum: [
                "OS: Windows 10 64-bit",
                "Processor: Intel Core i5-3570K hoặc AMD FX-8310",
                "Memory: 8 GB RAM",
                "Graphics: NVIDIA GeForce GTX 780 hoặc AMD Radeon RX 470",
                "DirectX: Version 12",
                "Storage: 70 GB available space"
            ],
            recommended: [
                "OS: Windows 10 64-bit",
                "Processor: Intel Core i7-4790 hoặc AMD Ryzen 3 3200G",
                "Memory: 12 GB RAM",
                "Graphics: NVIDIA GeForce GTX 1060 hoặc AMD Radeon R9 Fury",
                "DirectX: Version 12",
                "Storage: 70 GB available space"
            ]
        },
        downloadLink: "https://example.com/download/cyberpunk2077"
    },
    witcher3: {
        title: "The Witcher 3: Wild Hunt",
        description: "The Witcher 3: Wild Hunt là một game nhập vai thế giới mở epic, theo chân Geralt of Rivia trong cuộc hành trình tìm kiếm con gái nuôi Ciri. Với thế giới rộng lớn, cốt truyện phong phú và gameplay chất lượng cao, đây được coi là một trong những tựa game RPG hay nhất mọi thời đại.",
        genre: "RPG",
        rating: "5.0/5",
        size: "50 GB",
        language: "Việt hóa 100%",
        developer: "CD Projekt Red",
        releaseDate: "19/05/2015",
        mainImage: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop",
        screenshots: [
            "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop"
        ],
        systemRequirements: {
            minimum: [
                "OS: Windows 7 64-bit",
                "Processor: Intel CPU Core i5-2500K 3.3GHz",
                "Memory: 6 GB RAM",
                "Graphics: Nvidia GPU GeForce GTX 660",
                "DirectX: Version 11",
                "Storage: 35 GB available space"
            ],
            recommended: [
                "OS: Windows 10 64-bit",
                "Processor: Intel CPU Core i7 3770 3.4 GHz",
                "Memory: 8 GB RAM",
                "Graphics: Nvidia GPU GeForce GTX 770",
                "DirectX: Version 11",
                "Storage: 35 GB available space"
            ]
        },
        downloadLink: "https://example.com/download/witcher3"
    },
    gta5: {
        title: "Grand Theft Auto V",
        description: "Grand Theft Auto V là một game hành động thế giới mở diễn ra tại thành phố Los Santos. Người chơi có thể khám phá thành phố rộng lớn, tham gia vào các hoạt động đa dạng từ đua xe, cướp ngân hàng đến các mini-game thú vị. Với chế độ Online phong phú, GTA V mang đến trải nghiệm gaming không giới hạn.",
        genre: "Action",
        rating: "4.8/5",
        size: "95 GB",
        language: "Việt hóa 95%",
        developer: "Rockstar Games",
        releaseDate: "17/09/2013",
        mainImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
        screenshots: [
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop"
        ],
        systemRequirements: {
            minimum: [
                "OS: Windows 10 64-bit",
                "Processor: Intel Core 2 Quad CPU Q6600 @ 2.40GHz",
                "Memory: 4 GB RAM",
                "Graphics: NVIDIA 9800 GT 1GB / AMD HD 4870 1GB",
                "DirectX: Version 10",
                "Storage: 72 GB available space"
            ],
            recommended: [
                "OS: Windows 10 64-bit",
                "Processor: Intel Core i5 3470 @ 3.2GHz",
                "Memory: 8 GB RAM",
                "Graphics: NVIDIA GTX 660 2GB / AMD HD 7870 2GB",
                "DirectX: Version 11",
                "Storage: 72 GB available space"
            ]
        },
        downloadLink: "https://example.com/download/gta5"
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
    
    // Initialize download button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }
}

// Load game details into modal
function loadGameDetails(game) {
    if (!modalTitle || !modalBody || !downloadBtn) return;
    
    modalTitle.textContent = game.title;
    downloadBtn.href = game.downloadLink;
    
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
function handleDownload(e) {
    e.preventDefault();
    
    if (!downloadBtn) return;
    
    // Show loading state
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span class="loading"></span> Đang tải...';
    downloadBtn.disabled = true;
    
    // Simulate download process
    setTimeout(() => {
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        // Show success message
        showNotification('Bắt đầu tải xuống! Kiểm tra thư mục Downloads của bạn.', 'success');
        
        // Close modal after a short delay
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(gameModal);
            if (modal) {
                modal.hide();
            }
        }, 2000);
    }, 3000);
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