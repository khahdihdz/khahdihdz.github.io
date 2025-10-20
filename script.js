// Language Management
let currentLang = 'vi';
let selectedAmount = 25000; // Default amount

const translations = {
    vi: {
        langText: 'English'
    },
    en: {
        langText: 'Tiếng Việt'
    }
};

// Select Coffee Amount
function selectCoffee(button, amount) {
    // Remove active class from all buttons
    document.querySelectorAll('.coffee-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Update selected amount
    selectedAmount = amount;
    
    // Update QR code
    updateQRCode(amount);
    
    // Update display amount
    updateDisplayAmount(amount);
    
    // Clear custom amount input
    document.getElementById('customAmount').value = '';
}

// Update Custom Amount
function updateCustomAmount() {
    const customInput = document.getElementById('customAmount');
    const amount = parseInt(customInput.value);
    
    if (amount && amount >= 1000) {
        // Remove active class from all preset buttons
        document.querySelectorAll('.coffee-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        selectedAmount = amount;
        updateQRCode(amount);
        updateDisplayAmount(amount);
    } else {
        alert(currentLang === 'vi' 
            ? 'Vui lòng nhập số tiền từ 1,000 VNĐ trở lên' 
            : 'Please enter amount from 1,000 VNĐ or more');
    }
}

// Update QR Code
function updateQRCode(amount) {
    const qrImg = document.getElementById('qrCode');
    qrImg.src = `https://api.vietqr.io/image/970426-13001011869246-GuEo6F2.jpg?accountName=DINH%20TRONG%20KHANH&amount=${amount}`;
}

// Update Display Amount
function updateDisplayAmount(amount) {
    const displayElement = document.getElementById('displayAmount');
    const formattedAmount = amount.toLocaleString('vi-VN');
    displayElement.textContent = `${formattedAmount} VNĐ`;
}

// Allow Enter key on custom amount input
document.addEventListener('DOMContentLoaded', function() {
    const customInput = document.getElementById('customAmount');
    if (customInput) {
        customInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                updateCustomAmount();
            }
        });
    }
});

// Toggle Language
document.getElementById('langToggle').addEventListener('click', function() {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    updateLanguage();
    togglePaymentCards();
});

// Update all translatable elements
function updateLanguage() {
    const elements = document.querySelectorAll('[data-vi][data-en]');
    
    elements.forEach(element => {
        const text = currentLang === 'vi' ? element.getAttribute('data-vi') : element.getAttribute('data-en');
        element.textContent = text;
    });

    // Update language button text
    document.getElementById('langText').textContent = translations[currentLang].langText;
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
}

// Toggle Payment Cards based on language
function togglePaymentCards() {
    const viPayment = document.querySelector('.vi-payment');
    const enPayment = document.querySelector('.en-payment');
    
    if (currentLang === 'vi') {
        viPayment.style.display = 'block';
        enPayment.style.display = 'none';
        
        // Animation
        setTimeout(() => {
            viPayment.style.animation = 'none';
            setTimeout(() => {
                viPayment.style.animation = 'slideUp 0.6s ease-out';
            }, 10);
        }, 10);
    } else {
        viPayment.style.display = 'none';
        enPayment.style.display = 'block';
        
        // Animation
        setTimeout(() => {
            enPayment.style.animation = 'none';
            setTimeout(() => {
                enPayment.style.animation = 'slideUp 0.6s ease-out';
            }, 10);
        }, 10);
    }
}

// Copy to Clipboard Function
function copyToClipboard(text, element) {
    // Create temporary input
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    try {
        // Copy text
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = element.innerHTML;
        element.classList.add('copied');
        element.innerHTML = '<i class="fas fa-check"></i> ' + (currentLang === 'vi' ? 'Đã sao chép!' : 'Copied!');
        
        // Reset after 2 seconds
        setTimeout(() => {
            element.classList.remove('copied');
            element.innerHTML = originalText;
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert(currentLang === 'vi' ? 'Không thể sao chép. Vui lòng thử lại.' : 'Failed to copy. Please try again.');
    }

    // Remove temporary input
    document.body.removeChild(tempInput);
}

// Smooth scroll for any anchor links
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

// Add hover effect for cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language display
    updateLanguage();
    togglePaymentCards();
    
    // Add animation classes
    const paymentCards = document.querySelectorAll('.payment-card');
    paymentCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Prevent right-click on QR code (optional security)
document.querySelector('.qr-container img')?.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});