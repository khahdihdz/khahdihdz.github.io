// Global Variables
let currentLang = 'vi';
let coffeePrice = 25000; // Price per coffee in VND
let selectedAmount = 1;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupEventListeners();
    updateTotalAmount();
    setupLanguageToggle();
    setupCopyButtons();
    setupAmountButtons();
    setupCustomAmount();
    updateTransferMessage();
}

// Setup Event Listeners
function setupEventListeners() {
    // Language toggle
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
    
    // Amount buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectAmount(parseInt(this.dataset.amount));
        });
    });
    
    // Custom amount input
    document.getElementById('customAmount').addEventListener('input', function() {
        const value = parseInt(this.value) || 0;
        if (value > 0) {
            selectCustomAmount(value);
        }
    });
    
    // Message textarea
    document.querySelector('.message-input').addEventListener('input', updateTransferMessage);
}

// Language Toggle Functions
function setupLanguageToggle() {
    // Set initial language state
    updateLanguageDisplay();
}

function toggleLanguage() {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    updateLanguageDisplay();
    updatePlaceholders();
    
    // Add animation
    document.querySelector('.coffee-card').classList.add('fade-in');
    setTimeout(() => {
        document.querySelector('.coffee-card').classList.remove('fade-in');
    }, 500);
}

function updateLanguageDisplay() {
    // Update language button text
    const langText = document.getElementById('langText');
    langText.textContent = currentLang === 'vi' ? 'English' : 'Tiếng Việt';
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Update all elements with data-vi and data-en attributes
    document.querySelectorAll('[data-vi][data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update page title
    document.title = currentLang === 'vi' ? 
        'Mua tôi một ly cà phê ☕' : 
        'Buy me a coffee ☕';
}

function updatePlaceholders() {
    // Update custom amount placeholder
    const customAmount = document.getElementById('customAmount');
    customAmount.placeholder = currentLang === 'vi' ? 'Khác' : 'Other';
    
    // Update message textarea placeholder
    const messageInput = document.querySelector('.message-input');
    messageInput.placeholder = currentLang === 'vi' ? 
        'Viết lời nhắn của bạn...' : 
        'Write your message...';
}

// Amount Selection Functions
function setupAmountButtons() {
    // Set initial active state
    document.querySelector('.amount-btn[data-amount="1"]').classList.add('active');
}

function selectAmount(amount) {
    selectedAmount = amount;
    
    // Clear custom amount input
    document.getElementById('customAmount').value = '';
    
    // Update button states
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-amount="${amount}"]`).classList.add('active');
    
    // Update total
    updateTotalAmount();
    updateTransferMessage();
    
    // Add pulse animation to total
    document.querySelector('.total-amount').classList.add('pulse');
    setTimeout(() => {
        document.querySelector('.total-amount').classList.remove('pulse');
    }, 2000);
}

function setupCustomAmount() {
    const customInput = document.getElementById('customAmount');
    
    customInput.addEventListener('focus', function() {
        // Clear amount button selections
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    });
}

function selectCustomAmount(amount) {
    selectedAmount = amount;
    
    // Clear amount button selections
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Update total
    updateTotalAmount();
    updateTransferMessage();
}

function updateTotalAmount() {
    const total = selectedAmount * coffeePrice;
    const totalElement = document.getElementById('totalAmount');
    
    // Format currency based on language
    if (currentLang === 'vi') {
        totalElement.textContent = formatVND(total);
    } else {
        // Convert to USD (approximate rate: 1 USD = 24,000 VND)
        const usdAmount = (total / 24000).toFixed(2);
        totalElement.textContent = `${usdAmount} USD`;
    }
}

// Currency Formatting
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

// Transfer Message Functions
function updateTransferMessage() {
    const messageInput = document.querySelector('.message-input');
    const customMessage = messageInput.value.trim();
    const transferMessageElement = document.getElementById('transferMessage');
    
    let message;
    if (customMessage) {
        // Use custom message with coffee count
        message = currentLang === 'vi' ? 
            `${customMessage} (${selectedAmount} ca phe)` :
            `${customMessage} (${selectedAmount} coffee${selectedAmount > 1 ? 's' : ''})`;
    } else {
        // Default message
        message = currentLang === 'vi' ? 
            `Ung ho ${selectedAmount} ca phe` :
            `Support ${selectedAmount} coffee${selectedAmount > 1 ? 's' : ''}`;
    }
    
    transferMessageElement.textContent = message;
}

// Copy to Clipboard Functions
function setupCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            let textToCopy;
            
            if (this.dataset.copy) {
                textToCopy = this.dataset.copy;
            } else if (this.dataset.copyId) {
                const element = document.getElementById(this.dataset.copyId);
                textToCopy = element.textContent;
            }
            
            if (textToCopy) {
                copyToClipboard(textToCopy);
            }
        });
    });
}

function copyToClipboard(text) {
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.focus();
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopyToast();
        
        // Add success animation to copy button
        event.target.style.transform = 'scale(1.2)';
        setTimeout(() => {
            event.target.style.transform = '';
        }, 200);
        
    } catch (err) {
        console.error('Copy failed:', err);
        // Fallback: show text in alert
        alert(currentLang === 'vi' ? 
            `Sao chép thủ công: ${text}` : 
            `Manual copy: ${text}`);
    }
    
    // Clean up
    document.body.removeChild(textarea);
}

function showCopyToast() {
    const toast = new bootstrap.Toast(document.getElementById('copyToast'));
    toast.show();
}

// Payment Tab Functions
function setupPaymentTabs() {
    // Add event listeners to payment tabs
    document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            // Add animation when tab is shown
            const targetPane = document.querySelector(e.target.dataset.bsTarget);
            targetPane.classList.add('fade-in');
            
            setTimeout(() => {
                targetPane.classList.remove('fade-in');
            }, 500);
        });
    });
}

// Utility Functions
function formatCurrency(amount, currency = 'VND') {
    if (currency === 'VND') {
        return formatVND(amount);
    } else if (currency === 'USD') {
        return `${amount.toFixed(2)} USD`;
    }
    return amount.toString();
}

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

// Animation Functions
function addPulseAnimation(element) {
    element.classList.add('pulse');
    setTimeout(() => {
        element.classList.remove('pulse');
    }, 2000);
}

function addFadeInAnimation(element) {
    element.classList.add('fade-in');
    setTimeout(() => {
        element.classList.remove('fade-in');
    }, 500);
}

// Validation Functions
function validateAmount(amount) {
    return !isNaN(amount) && amount > 0 && amount <= 100;
}

function sanitizeMessage(message) {
    return message.replace(/[<>\"']/g, '').trim();
}

// Enhanced Features
function generateQRCode() {
    // This would integrate with a QR code library in a real implementation
    // For now, we'll update the placeholder
    const amount = selectedAmount * coffeePrice;
    const message = document.getElementById('transferMessage').textContent;
    
    // In a real implementation, you would generate a QR code with payment info
    console.log('QR Code data:', { amount, message });
}

function updateBuyMeACoffeeLink() {
    // Update the BuyMeACoffee link with current amount
    const link = document.querySelector('.buymeacoffee-btn');
    const baseUrl = 'https://buymeacoffee.com/yourusername';
    
    // Add amount parameter (BuyMeACoffee supports this)
    const usdAmount = (selectedAmount * coffeePrice / 24000).toFixed(2);
    link.href = `${baseUrl}?amount=${usdAmount}`;
}

// Error Handling
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly error message
    const errorMessage = currentLang === 'vi' ? 
        'Đã xảy ra lỗi. Vui lòng thử lại.' : 
        'An error occurred. Please try again.';
    
    // You could show this in a toast or modal
    console.log(errorMessage);
}

// Initialize additional features
function initializeAdvancedFeatures() {
    setupPaymentTabs();
    
    // Update QR code when amount changes
    const originalUpdateTotal = updateTotalAmount;
    updateTotalAmount = function() {
        originalUpdateTotal();
        generateQRCode();
        updateBuyMeACoffeeLink();
    };
    
    // Add debounced message update
    const messageInput = document.querySelector('.message-input');
    const debouncedUpdateMessage = debounce(updateTransferMessage, 300);
    messageInput.addEventListener('input', debouncedUpdateMessage);
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
        initializeAdvancedFeatures();
        
        // Add welcome animation
        setTimeout(() => {
            document.querySelector('.coffee-icon').classList.add('pulse');
        }, 500);
        
    } catch (error) {
        handleError(error, 'initialization');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Language toggle with Ctrl/Cmd + L
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        toggleLanguage();
    }
    
    // Quick amount selection with number keys
    if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
        const targetInput = document.activeElement;
        if (targetInput.tagName !== 'INPUT' && targetInput.tagName !== 'TEXTAREA') {
            const amount = parseInt(e.key);
            if (amount <= 5) {
                selectAmount(amount);
            }
        }
    }
});

// Export functions for potential external use
window.BuyMeACoffee = {
    toggleLanguage,
    selectAmount,
    updateTotalAmount,
    copyToClipboard,
    formatVND
};
function updateLanguageDisplay() {
    // Update language button text
    const langText = document.getElementById('langText');
    langText.textContent = currentLang === 'vi' ? 'English' : 'Tiếng Việt';
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Update all elements with data-vi and data-en attributes
    document.querySelectorAll('[data-vi][data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update meta tags for social sharing
    updateSocialMetaTags();
    
    // Update page title
    document.title = currentLang === 'vi' ? 
        'Mua cho tôi một ly cà phê ☕' : 
        'Buy me a coffee ☕';
}

// Function to update social media meta tags based on language
function updateSocialMetaTags() {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const metaDescription = document.querySelector('meta[name="description"]');
    
    if (currentLang === 'vi') {
        // Vietnamese content
        if (ogTitle) ogTitle.content = 'Mua cho tôi một ly cà phê ☕';
        if (ogDescription) ogDescription.content = 'Hỗ trợ công việc của tôi bằng một ly cà phê nhỏ. Có thể thanh toán qua ngân hàng, QR Code hoặc BuyMeACoffee.';
        if (twitterTitle) twitterTitle.content = 'Mua cho tôi một ly cà phê ☕';
        if (twitterDescription) twitterDescription.content = 'Hỗ trợ công việc của tôi bằng một ly cà phê nhỏ. Thanh toán dễ dàng qua nhiều phương thức.';
        if (metaDescription) metaDescription.content = 'Hỗ trợ công việc của tôi bằng một ly cà phê nhỏ. Chuyển khoản ngân hàng, QR Code hoặc BuyMeACoffee.';
    } else {
        // English content
        if (ogTitle) ogTitle.content = 'Buy me a coffee ☕';
        if (ogDescription) ogDescription.content = 'Support my work with a small coffee. Payment available via bank transfer, QR Code or BuyMeACoffee.';
        if (twitterTitle) twitterTitle.content = 'Buy me a coffee ☕';
        if (twitterDescription) twitterDescription.content = 'Support my work with a small coffee. Easy payment through multiple methods.';
        if (metaDescription) metaDescription.content = 'Support my work with a small coffee. Bank transfer, QR Code or BuyMeACoffee available.';
    }
}
