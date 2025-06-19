// Vietnamese Games List JavaScript

// Sample games data
const gamesData = [
    {
        id: 1,
        title: "The Witcher 3: Wild Hunt",
        genre: "RPG",
        status: "Hoàn thành",
        description: "Cuộc phiêu lưu trong thế giới fantasy tuyệt vời với Geralt of Rivia. Game RPG được đánh giá cao nhất mọi thời đại.",
        image: "https://via.placeholder.com/300x200?text=The+Witcher+3",
        rating: 5,
        downloadLink: "#"
    },
    {
        id: 2,
        title: "Cyberpunk 2077",
        genre: "RPG",
        status: "Hoàn thành",
        description: "Khám phá thành phố Night City trong tương lai với đồ họa tuyệt đẹp và câu chuyện hấp dẫn.",
        image: "https://via.placeholder.com/300x200?text=Cyberpunk+2077",
        rating: 4,
        downloadLink: "#"
    },
    {
        id: 3,
        title: "Red Dead Redemption 2",
        genre: "Action",
        status: "Hoàn thành",
        description: "Trải nghiệm cuộc sống của outlaws ở miền Tây nước Mỹ với đồ họa cực kỳ chân thực.",
        image: "https://via.placeholder.com/300x200?text=Red+Dead+2",
        rating: 5,
        downloadLink: "#"
    },
    {
        id: 4,
        title: "Assassin's Creed Valhalla",
        genre: "Action",
        status: "Đang phát triển",
        description: "Hành trình của một Viking warrior trong thời đại chinh phục nước Anh.",
        image: "https://via.placeholder.com/300x200?text=AC+Valhalla",
        rating: 4,
        downloadLink: "#"
    },
    {
        id: 5,
        title: "Horizon Zero Dawn",
        genre: "Adventure",
        status: "Hoàn thành",
        description: "Khám phá thế giới hậu tận thế với những robot khổng lồ và bí ẩn của quá khứ.",
        image: "https://via.placeholder.com/300x200?text=Horizon+Zero+Dawn",
        rating: 5,
        downloadLink: "#"
    },
    {
        id: 6,
        title: "Age of Empires IV",
        genre: "Strategy",
        status: "Beta",
        description: "Game chiến thuật kinh điển trở lại với đồ họa hiện đại và gameplay cải tiến.",
        image: "https://via.placeholder.com/300x200?text=Age+of+Empires+IV",
        rating: 4,
        downloadLink: "#"
    },
    {
        id: 7,
        title: "Cities: Skylines",
        genre: "Simulation",
        status: "Hoàn thành",
        description: "Xây dựng và quản lý thành phố của riêng bạn với hệ thống mô phỏng chi tiết.",
        image: "https://via.placeholder.com/300x200?text=Cities+Skylines",
        rating: 4,
        downloadLink: "#"
    },
    {
        id: 8,
        title: "Sekiro: Shadows Die Twice",
        genre: "Action",
        status: "Hoàn thành",
        description: "Game hành động samurai với độ khó cao và combat system độc đáo.",
        image: "https://via.placeholder.com/300x200?text=Sekiro",
        rating: 5,
        downloadLink: "#"
    }
];

let filteredGames = [...gamesData];

// DOM Elements
const gamesList = document.getElementById('gamesList');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const statusFilter = document.getElementById('statusFilter');
const backToTopBtn = document.getElementById('backToTop');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayGames(gamesData);
    setupEventListeners();
    setupBackToTop();
});

// Display games function
function displayGames(games) {
    gamesList.innerHTML = '';
    
    if (games.length === 0) {
        gamesList.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Không tìm thấy game phù hợp với tiêu chí tìm kiếm.
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

// Create game card element
function createGameCard(game) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    const stars = generateStars(game.rating);
    const statusClass = getStatusClass(game.status);
    
    col.innerHTML = `
        <div class="card game-card h-100">
            <img src="${game.image}" class="card-img-top" alt="${game.title}">
            <div class="card-body d-flex flex-column">
                <h5 class="game-title">${game.title}</h5>
                <div class="mb-2">
                    <span class="game-genre">${game.genre}</span>
                    <span class="game-status ${statusClass}">${game.status}</span>
                </div>
                <div class="game-rating mb-2">
                    ${stars}
                </div>
                <p class="game-description flex-grow-1">${game.description}</p>
                <div class="mt-auto">
                    <button class="btn download-btn w-100" onclick="downloadGame(${game.id})">
                        <i class="fas fa-download me-2"></i>Tải về
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Generate star rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Get status class
function getStatusClass(status) {
    switch (status) {
        case 'Hoàn thành':
            return 'status-complete';
        case 'Đang phát triển':
            return 'status-development';
        case 'Beta':
            return 'status-beta';
        default:
            return '';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', function() {
        filterGames();
    });
    
    // Genre filter
    genreFilter.addEventListener('change', function() {
        filterGames();
    });
    
    // Status filter
    statusFilter.addEventListener('change', function() {
        filterGames();
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// Filter games function
function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    const selectedStatus = statusFilter.value;
    
    filteredGames = gamesData.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm) ||
                            game.description.toLowerCase().includes(searchTerm);
        const matchesGenre = !selectedGenre || game.genre === selectedGenre;
        const matchesStatus = !selectedStatus || game.status === selectedStatus;
        
        return matchesSearch && matchesGenre && matchesStatus;
    });
    
    displayGames(filteredGames);
}

// Download game function
function downloadGame(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (game) {
        // Show loading state
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang tải...';
        button.disabled = true;
        
        // Simulate download process
        setTimeout(() => {
            alert(`Bắt đầu tải ${game.title}!\n\nLưu ý: Đây chỉ là demo. Trong thực tế, link tải sẽ được cung cấp tại đây.`);
            
            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

// Back to top functionality
function setupBackToTop() {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add some interactive animations
function addInteractiveEffects() {
    // Add hover effect to game cards
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.game-card')) {
            e.target.closest('.game-card').style.transform = 'translateY(-5px)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.game-card')) {
            e.target.closest('.game-card').style.transform = 'translateY(0)';
        }
    });
}

// Initialize interactive effects
document.addEventListener('DOMContentLoaded', addInteractiveEffects);

// Loading simulation
function showLoading() {
    gamesList.innerHTML = `
        <div class="col-12">
            <div class="loading">
                <div class="spinner"></div>
            </div>
        </div>
    `;
}

// Utility function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN');
}

// Add game function (for future use)
function addGame(gameData) {
    const newId = Math.max(...gamesData.map(g => g.id)) + 1;
    const newGame = {
        id: newId,
        ...gameData
    };
    gamesData.push(newGame);
    filterGames(); // Refresh display
}

// Remove game function (for future use)
function removeGame(gameId) {
    const index = gamesData.findIndex(g => g.id === gameId);
    if (index > -1) {
        gamesData.splice(index, 1);
        filterGames(); // Refresh display
    }
}