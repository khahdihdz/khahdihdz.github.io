// Vietnamese Games List JavaScript

// Sample game data
const gamesData = [
    {
        id: 1,
        title: "The Witcher 3: Wild Hunt",
        description: "Một trong những tựa game RPG hay nhất mọi thời đại với thế giới mở rộng lớn và câu chuyện hấp dẫn. Phiên bản việt hóa đầy đủ với lồng tiếng và phụ đề.",
        category: "rpg",
        status: "completed",
        statusText: "Hoàn thành 100%",
        icon: "🗡️",
        downloadLink: "#",
        releaseYear: 2015,
        size: "35GB"
    },
    {
        id: 2,
        title: "Cyberpunk 2077",
        description: "Game nhập vai thế giới mở với bối cảnh tương lai đầy công nghệ. Việt hóa bao gồm phụ đề và menu hoàn chỉnh.",
        category: "rpg",
        status: "progress",
        statusText: "Đang việt hóa 85%",
        icon: "🤖",
        downloadLink: "#",
        releaseYear: 2020,
        size: "70GB"
    },
    {
        id: 3,
        title: "Assassin's Creed Valhalla",
        description: "Hành trình của một warrior Viking trong thế giới Anh thời trung cổ. Phiên bản việt hóa với phụ đề đầy đủ.",
        category: "action",
        status: "completed",
        statusText: "Hoàn thành 100%",
        icon: "⚔️",
        downloadLink: "#",
        releaseYear: 2020,
        size: "50GB"
    },
    {
        id: 4,
        title: "Red Dead Redemption 2",
        description: "Câu chuyện miền Tây hoang dã với đồ họa tuyệt đẹp và gameplay sâu sắc. Việt hóa hoàn chỉnh cả phụ đề và menu.",
        category: "adventure",
        status: "completed",
        statusText: "Hoàn thành 100%",
        icon: "🤠",
        downloadLink: "#",
        releaseYear: 2018,
        size: "120GB"
    },
    {
        id: 5,
        title: "Age of Empires IV",
        description: "Game chiến thuật thời gian thực kinh điển với đồ họa hiện đại. Việt hóa đầy đủ interface và tutorial.",
        category: "strategy",
        status: "progress",
        statusText: "Đang việt hóa 70%",
        icon: "🏰",
        downloadLink: "#",
        releaseYear: 2021,
        size: "25GB"
    },
    {
        id: 6,
        title: "Horizon Zero Dawn",
        description: "Phiêu lưu trong thế giới hậu tận thế với robot khủng long. Việt hóa hoàn chỉnh với phụ đề tiếng Việt.",
        category: "adventure",
        status: "completed",
        statusText: "Hoàn thành 100%",
        icon: "🏹",
        downloadLink: "#",
        releaseYear: 2017,
        size: "67GB"
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
        <div class="col-lg-4 col-md-6 game-item fade-in" data-category="${game.category}">
            <div class="game-card h-100">
                <div class="game-image">
                    <span>${game.icon}</span>
                </div>
                <div class="game-body">
                    <h5 class="game-title">${game.title}</h5>
                    <p class="game-description">${game.description}</p>
                    <span class="game-category">${getCategoryName(game.category)}</span>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <small class="game-status ${game.status === 'completed' ? 'status-completed' : 'status-progress'}">
                            ${game.statusText}
                        </small>
                        <small class="text-muted">${game.size}</small>
                    </div>
                    <div class="mt-3">
                        <a href="${game.downloadLink}" class="download-btn" onclick="handleDownload('${game.title}')">
                            📥 Tải về
                        </a>
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

// Handle download click
function handleDownload(gameTitle) {
    // Show download notification
    showNotification(`Bắt đầu tải "${gameTitle}"`, 'success');
    
    // In a real application, this would handle the actual download
    console.log(`Downloading: ${gameTitle}`);
}

// Show notification
function showNotification(message, type = 'info') {
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