// ============================
// SCREENSHOT MODAL FUNCTIONALITY
// ============================
function openScreenshot(imageSrc, gameName) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('screenshotModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'screenshotModal';
        modal.className = 'screenshot-modal';
        modal.innerHTML = `
            <div class="screenshot-modal-content">
                <span class="screenshot-close" onclick="closeScreenshot()">&times;</span>
                <img id="screenshotImage" src="" alt="">
                <div class="screenshot-caption" id="screenshotCaption"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Set image and caption
    document.getElementById('screenshotImage').src = imageSrc;
    document.getElementById('screenshotCaption').textContent = gameName;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeScreenshot() {
    const modal = document.getElementById('screenshotModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('screenshotModal');
    if (modal && e.target === modal) {
        closeScreenshot();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeScreenshot();
    }
});

// ============================
// GAME DATA
// ============================
const games = [
    {
        id: 1,
        name: "Neighbours From Hell",
        genre: "Strategy",
        rating: 4,
        description: "Game giải đố hài hước về anh chàng Woody thực hiện những trò đùa tinh quái với người hàng xóm khó ở. Game đã được Việt hóa hoàn chỉnh, mang đến những tình huống vui nhộn và thử thách trí tuệ thú vị.",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        screenshots: [
            "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1556438064-2d7646166914?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop"
        ],
        downloadLink: "https://example.com/download/neighbours-from-hell-viet-hoa"
    }
];

// ============================
// DOM ELEMENTS
// ============================
const gamesList = document.getElementById('gamesList');
const searchInput = document.getElementById('searchInput');
const gameCount = document.getElementById('gameCount');
const scrollToTopBtn = document.getElementById('scrollToTop');

// ============================
// INITIALIZE APP
// ============================
document.addEventListener('DOMContentLoaded', function() {
    renderGames();
    setupEventListeners();
    updateGameCount();
});

// ============================
// EVENT LISTENERS
// ============================
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Scroll to top button
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scroll for scroll indicator
    document.querySelector('.scroll-indicator').addEventListener('click', function() {
        document.querySelector('.games-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// ============================
// GAME RENDERING
// ============================
function renderGames(gamesToRender = games) {
    if (gamesToRender.length === 0) {
        gamesList.innerHTML = `
            <div class="col-12 text-center">
                <div class="no-games-message">
                    <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                    <h3>Không tìm thấy game nào</h3>
                    <p class="text-muted">Thử tìm kiếm với từ khóa khác</p>
                </div>
            </div>
        `;
        return;
    }

    gamesList.innerHTML = gamesToRender.map(game => `
        <div class="game-card" data-aos="fade-up">
            <div class="game-image">
                ${game.image ? 
                    `<img src="${game.image}" alt="${game.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="game-image-placeholder" style="display: none;">
                         <i class="fas fa-gamepad"></i>
                     </div>` :
                    `<div class="game-image-placeholder">
                         <i class="fas fa-gamepad"></i>
                     </div>`
                }
                <div class="game-badge">${game.genre}</div>
            </div>
            <div class="game-content">
                <h3 class="game-title">${game.name}</h3>
                <div class="game-genre">${game.genre}</div>
                <p class="game-description">${game.description}</p>
                <div class="game-rating">
                    <div class="stars">
                        ${generateStars(game.rating)}
                    </div>
                    <span class="rating-text">${game.rating}/5</span>
                </div>
                ${game.screenshots ? `
                    <div class="game-screenshots">
                        <h5 class="screenshots-title">
                            <i class="fas fa-images me-2"></i>Ảnh chụp màn hình
                        </h5>
                        <div class="screenshots-grid">
                            ${game.screenshots.map((screenshot, index) => `
                                <img src="${screenshot}" alt="Screenshot ${index + 1}" 
                                     class="screenshot-thumb" onclick="openScreenshot('${screenshot}', '${game.name}')">
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${game.downloadLink ? `
                    <div class="game-actions">
                        <a href="${game.downloadLink}" class="btn-download" target="_blank" rel="noopener">
                            <i class="fas fa-download me-2"></i>Tải về
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// ============================
// UTILITY FUNCTIONS
// ============================
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="fas fa-star empty"></i>';
        }
    }
    return stars;
}

function updateGameCount() {
    const count = games.length;
    gameCount.textContent = count;
    
    // Animate the number
    gameCount.style.animation = 'pulse 0.6s ease';
    setTimeout(() => {
        gameCount.style.animation = '';
    }, 600);
}

// ============================
// SEARCH FUNCTIONALITY
// ============================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderGames();
        return;
    }
    
    const filteredGames = games.filter(game => 
        game.name.toLowerCase().includes(searchTerm) ||
        game.genre.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
    );
    
    renderGames(filteredGames);
}

// ============================
// SCROLL FUNCTIONALITY
// ============================
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide scroll to top button
    if (scrollTop > 500) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================
// ANIMATIONS
// ============================
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.game-card').forEach(card => {
        observer.observe(card);
    });
}

// ============================
// THEME UTILITIES
// ============================
function addHoverEffects() {
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ============================
// PERFORMANCE OPTIMIZATION
// ============================
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
const debouncedSearch = debounce(handleSearch, 300);
if (searchInput) {
    searchInput.removeEventListener('input', handleSearch);
    searchInput.addEventListener('input', debouncedSearch);
}

// ============================
// ACCESSIBILITY IMPROVEMENTS
// ============================
function improveAccessibility() {
    // Add ARIA labels
    document.querySelectorAll('.game-card').forEach((card, index) => {
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Game thứ ${index + 1}`);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.blur();
        }
    });
}

// ============================
// ERROR HANDLING
// ============================
window.addEventListener('error', function(e) {
    console.warn('Đã xảy ra lỗi:', e.error);
});

// ============================
// INIT ADDITIONAL FEATURES
// ============================
setTimeout(() => {
    addScrollAnimations();
    addHoverEffects();
    improveAccessibility();
}, 100);