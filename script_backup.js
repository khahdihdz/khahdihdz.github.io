// Buy Me A Coffee JavaScript

let currentLanguage = 'vi';
let currentAmount = 25000; // Default 1 coffee = 25,000 VND
const coffeePrice = 25000;

// Language switcher
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    const customAmountInput = document.getElementById('customAmount');
    const coffeeButtons = document.querySelectorAll('.coffee-btn');
    
    // Language toggle event
    langToggle.addEventListener('click', function() {
        currentLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
        switchLanguage();
        langToggle.innerHTML = currentLanguage === 'vi' ? '<i class="fas fa-globe"></i> EN' : '<i class="fas fa-globe"></i> VI';
    });
    
    // Coffee button events
    coffeeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            coffeeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Calculate amount
            const coffeeCount = parseInt(this.dataset.amount);
            currentAmount = coffeeCount * coffeePrice;
            
            // Clear custom amount
            customAmountInput.value = '';
            
            // Update total
            updateTotalAmount();
        });
    });
    
    // Custom amount input event
    customAmountInput.addEventListener('input', function() {
        const customValue = parseInt(this.value) || 0;
        if (customValue > 0) {
            // Remove active class from coffee buttons
            coffeeButtons.forEach(btn => btn.classList.remove('active'));
            currentAmount = customValue;
            updateTotalAmount();
        }
    });
});

// Switch language function
function switchLanguage() {
    const elements = document.querySelectorAll('[data-vi][data-en]');
    elements.forEach(element => {
        if (currentLanguage === 'vi') {
            element.textContent = element.getAttribute('data-vi');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Update placeholders
    const customAmountInput = document.getElementById('customAmount');
    if (currentLanguage === 'vi') {
        customAmountInput.placeholder = '25000';
        document.title = 'Mua Cà Phê Cho Tôi | Buy Me A Coffee';
    } else {
        customAmountInput.placeholder = '25000';
        document.title = 'Buy Me A Coffee | Mua Cà Phê Cho Tôi';
    }
    
    updateTotalAmount();
}

// Update total amount display
function updateTotalAmount() {
    const totalElement = document.getElementById('totalAmount');
    totalElement.textContent = formatCurrency(currentAmount);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast();
    }).catch(function(err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    });
}

// Get current text based on language
function getCurrentText(selector) {
    const element = document.querySelector(selector);
    return currentLanguage === 'vi' ? element.getAttribute('data-vi') : element.getAttribute('data-en');
}

// Show toast notification
function showToast() {
    const toast = new bootstrap.Toast(document.getElementById('copyToast'));
    toast.show();
}

// Generate QR Code (simple implementation)
function generateQRCode() {
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create a simple QR-like pattern (placeholder)
    const qrSize = 180;
    const startX = (canvas.width - qrSize) / 2;
    const startY = (canvas.height - qrSize) / 2;
    const cellSize = qrSize / 21; // 21x21 grid
    
    ctx.fillStyle = '#000000';
    
    // Create QR pattern (simplified version)
    const pattern = [
        [1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
        [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,1,1,1,0,1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
        [1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
        [0,1,0,1,1,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0],
        [1,1,1,0,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
        [0,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0],
        [1,0,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
        [0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0],
        [1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0],
        [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
        [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0],
        [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0],
        [1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1]
    ];
    
    // Draw the pattern
    for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col] === 1) {
                ctx.fillRect(
                    startX + col * cellSize,
                    startY + row * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }
    }
    
    // Add amount text below QR code
    ctx.fillStyle = '#6f4e37';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
        formatCurrency(currentAmount),
        canvas.width / 2,
        canvas.height - 10
    );
}

// Smooth scrolling for collapse elements
document.addEventListener('shown.bs.collapse', function (e) {
    e.target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
});

// Add hover effects to payment buttons
document.querySelectorAll('.btn-payment').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Initialize tooltips if needed
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation
    const card = document.querySelector('.coffee-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
    
    // Add floating animation to coffee icon
    const coffeeIcon = document.querySelector('.coffee-icon');
    setInterval(() => {
        coffeeIcon.style.transform = 'translateY(-5px)';
        setTimeout(() => {
            coffeeIcon.style.transform = 'translateY(0)';
        }, 1000);
    }, 3000);
});

// Handle form submission (placeholder)
function handleDonation() {
    // This function can be extended to handle actual payment processing
    alert(currentLanguage === 'vi' ? 'Cảm ơn bạn đã ủng hộ!' : 'Thank you for your support!');
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press L to toggle language
    if (event.key.toLowerCase() === 'l' && event.ctrlKey) {
        event.preventDefault();
        document.getElementById('langToggle').click();
    }
    
    // Press 1, 3, 5 for quick coffee selection
    if (['1', '3', '5'].includes(event.key)) {
        const button = document.querySelector(`[data-amount="${event.key}"]`);
        if (button) {
            button.click();
        }
    }
});

// Add loading state for payment methods
function showLoading(element) {
    const originalText = element.innerHTML;
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + 
        (currentLanguage === 'vi' ? 'Đang tải...' : 'Loading...');
    
    setTimeout(() => {
        element.innerHTML = originalText;
    }, 1500);
}

// Enhanced copy function with better feedback
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast();
        // Add visual feedback to the copied element
        if (event && event.target) {
            event.target.style.background = '#28a745';
            event.target.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                event.target.style.background = '';
                event.target.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        }
    }).catch(function(err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    });
}

// Add animation to total amount when it changes
function updateTotalAmount() {
    const totalElement = document.getElementById('totalAmount');
    totalElement.style.transform = 'scale(1.1)';
    totalElement.style.color = '#d4a574';
    
    setTimeout(() => {
        totalElement.textContent = formatCurrency(currentAmount);
        totalElement.style.transform = 'scale(1)';
        totalElement.style.color = '';
    }, 150);
}

// Add progress indicator for donation process
function createProgressIndicator() {
    const progressHtml = `
        <div class="progress mb-3" style="height: 6px; display: none;" id="donationProgress">
            <div class="progress-bar bg-warning" role="progressbar" style="width: 0%"></div>
        </div>
    `;
    
    const totalSection = document.querySelector('.total-section');
    totalSection.insertAdjacentHTML('afterend', progressHtml);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    createProgressIndicator();
    
    // Add click tracking to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            trackClick(this.textContent.trim(), 'button_click');
        });
    });
});

// Validate amount input
document.getElementById('customAmount').addEventListener('input', function() {
    const value = parseInt(this.value);
    const minAmount = 5000;
    const maxAmount = 10000000;
    
    if (value && (value < minAmount || value > maxAmount)) {
        this.style.borderColor = '#dc3545';
        this.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
    } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
    }
});

// Add confetti effect when copying (fun feature)
function showConfetti() {
    // Simple confetti effect using CSS animations
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    
    for (let i = 0; i < 30; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '6px';
    confetti.style.height = '6px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.style.borderRadius = '50%';
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 10}px) rotate(360deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 2000 + 1000,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => confetti.remove();
}
