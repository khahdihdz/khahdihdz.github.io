// Buy Me A Coffee JavaScript - Optimized Version

class CoffeeApp {
    constructor() {
        this.currentLanguage = 'vi';
        this.currentAmount = 25000; // Default 1 coffee = 25,000 VND
        this.coffeePrice = 25000;
        this.exchangeRate = 0.00004; // 1 VND = 0.00004 USDT (approximate)
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeUI();
    }

    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupLanguageToggle();
            this.setupCoffeeButtons();
            this.setupCustomAmountInput();
            this.setupPaymentButtons();
            this.initializeAnimations();
            this.initializeTooltips();
            this.setupKeyboardShortcuts();
        });
    }

    setupLanguageToggle() {
        const langToggle = document.getElementById('langToggle');
        if (!langToggle) return;

        langToggle.addEventListener('click', () => {
            this.currentLanguage = this.currentLanguage === 'vi' ? 'en' : 'vi';
            this.switchLanguage();
            this.updateLanguageButton(langToggle);
        });
    }

    updateLanguageButton(button) {
        const icon = '<i class="fas fa-globe"></i>';
        button.innerHTML = this.currentLanguage === 'vi' ? `${icon} EN` : `${icon} VI`;
    }

    setupCoffeeButtons() {
        const coffeeButtons = document.querySelectorAll('.coffee-btn');
        const customAmountInput = document.getElementById('customAmount');

        coffeeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectCoffeeButton(e.target, coffeeButtons);
                this.calculateAmount(parseInt(e.target.dataset.amount));
                if (customAmountInput) customAmountInput.value = '';
                this.updateTotalAmount();
            });
        });
    }

    selectCoffeeButton(selectedButton, allButtons) {
        allButtons.forEach(btn => btn.classList.remove('active'));
        selectedButton.classList.add('active');
    }

    calculateAmount(coffeeCount) {
        this.currentAmount = coffeeCount * this.coffeePrice;
    }

    setupCustomAmountInput() {
        const customAmountInput = document.getElementById('customAmount');
        if (!customAmountInput) return;

        customAmountInput.addEventListener('input', (e) => {
            const customValue = parseInt(e.target.value) || 0;
            if (customValue > 0) {
                this.clearCoffeeButtonSelection();
                this.currentAmount = customValue;
                this.updateTotalAmount();
            }
            this.validateAmount(customValue, e.target);
        });
    }

    clearCoffeeButtonSelection() {
        document.querySelectorAll('.coffee-btn').forEach(btn => 
            btn.classList.remove('active')
        );
    }

    validateAmount(amount, inputElement) {
        const minAmount = 5000;
        const maxAmount = 10000000;
        const isInvalid = amount && (amount < minAmount || amount > maxAmount);

        inputElement.style.borderColor = isInvalid ? '#dc3545' : '';
        inputElement.style.boxShadow = isInvalid ? 
            '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' : '';
    }

    setupPaymentButtons() {
        document.querySelectorAll('.btn-payment').forEach(button => {
            // Add hover effects
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });

            // Add click tracking
            button.addEventListener('click', () => {
                this.trackPaymentMethod(button.textContent.trim());
            });
        });
    }

    trackPaymentMethod(method) {
        // Analytics tracking can be implemented here
        console.log(`Payment method selected: ${method}`);
    }

    switchLanguage() {
        this.updateTextElements();
        this.updatePlaceholders();
        this.updateTitle();
        this.updateTotalAmount();
    }

    updateTextElements() {
        const elements = document.querySelectorAll('[data-vi][data-en]');
        elements.forEach(element => {
            const text = this.currentLanguage === 'vi' ? 
                element.getAttribute('data-vi') : 
                element.getAttribute('data-en');
            element.textContent = text;
        });
    }

    updatePlaceholders() {
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) {
            customAmountInput.placeholder = this.currentLanguage === 'vi' ? '25000' : '1.00';
        }
    }

    updateTitle() {
        document.title = this.currentLanguage === 'vi' ? 
            'Mua Cà Phê Cho Tôi | Buy Me A Coffee' : 
            'Buy Me A Coffee | Mua Cà Phê Cho Tôi';
    }

    updateTotalAmount() {
        const totalElement = document.getElementById('totalAmount');
        if (!totalElement) return;

        // Add animation
        totalElement.style.transform = 'scale(1.1)';
        totalElement.style.color = '#d4a574';
        
        setTimeout(() => {
            totalElement.textContent = this.formatCurrency(this.currentAmount);
            totalElement.style.transform = 'scale(1)';
            totalElement.style.color = '';
        }, 150);
    }

    formatCurrency(amount) {
        if (this.currentLanguage === 'vi') {
            return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
        } else {
            const usdtAmount = Math.round(amount * this.exchangeRate * 100) / 100;
            return usdtAmount.toFixed(2) + ' USDT';
        }
    }

    copyToClipboard(text) {
        const copyPromise = navigator.clipboard ? 
            navigator.clipboard.writeText(text) : 
            this.fallbackCopyToClipboard(text);

        copyPromise.then(() => {
            this.showToast();
            this.showCopyFeedback();
            this.showConfetti();
        }).catch(() => {
            this.fallbackCopyToClipboard(text);
            this.showToast();
        });
    }

    fallbackCopyToClipboard(text) {
        return new Promise((resolve) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            resolve();
        });
    }

    showCopyFeedback() {
        if (event && event.target) {
            const originalBg = event.target.style.background;
            const originalHtml = event.target.innerHTML;
            
            event.target.style.background = '#28a745';
            event.target.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                event.target.style.background = originalBg;
                event.target.innerHTML = originalHtml;
            }, 2000);
        }
    }

    showToast() {
        const toastElement = document.getElementById('copyToast');
        if (toastElement && typeof bootstrap !== 'undefined') {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }
    }

    showConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 50);
        }
    }

    createConfettiPiece(color) {
        const confetti = document.createElement('div');
        Object.assign(confetti.style, {
            position: 'fixed',
            width: '6px',
            height: '6px',
            backgroundColor: color,
            left: Math.random() * window.innerWidth + 'px',
            top: '-10px',
            zIndex: '9999',
            pointerEvents: 'none',
            borderRadius: '50%'
        });
        
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

    initializeAnimations() {
        // Card fade-in animation
        const card = document.querySelector('.coffee-card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }

        // Coffee icon floating animation
        this.startCoffeeIconAnimation();

        // Smooth scrolling for collapse elements
        document.addEventListener('shown.bs.collapse', (e) => {
            e.target.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        });
    }

    startCoffeeIconAnimation() {
        const coffeeIcon = document.querySelector('.coffee-icon');
        if (!coffeeIcon) return;

        setInterval(() => {
            coffeeIcon.style.transition = 'transform 1s ease-in-out';
            coffeeIcon.style.transform = 'translateY(-5px)';
            
            setTimeout(() => {
                coffeeIcon.style.transform = 'translateY(0)';
            }, 1000);
        }, 3000);
    }

    initializeTooltips() {
        if (typeof bootstrap === 'undefined') return;

        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.map(tooltipTriggerEl => 
            new bootstrap.Tooltip(tooltipTriggerEl)
        );
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl+L to toggle language
            if (event.key.toLowerCase() === 'l' && event.ctrlKey) {
                event.preventDefault();
                const langToggle = document.getElementById('langToggle');
                if (langToggle) langToggle.click();
            }
            
            // Numbers 1, 3, 5 for quick coffee selection
            if (['1', '3', '5'].includes(event.key)) {
                const button = document.querySelector(`[data-amount="${event.key}"]`);
                if (button) button.click();
            }
        });
    }

    getCurrentText(selector) {
        const element = document.querySelector(selector);
        if (!element) return '';
        
        return this.currentLanguage === 'vi' ? 
            element.getAttribute('data-vi') : 
            element.getAttribute('data-en');
    }

    handleDonation() {
        const message = this.currentLanguage === 'vi' ? 
            'Cảm ơn bạn đã ủng hộ!' : 
            'Thank you for your support!';
        alert(message);
    }

    initializeUI() {
        // Set initial language button text
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            this.updateLanguageButton(langToggle);
        }

        // Set initial total amount
        this.updateTotalAmount();
    }
}

// Initialize the application
const coffeeApp = new CoffeeApp();

// Expose global functions for HTML onclick handlers
window.copyToClipboard = (text) => coffeeApp.copyToClipboard(text);
window.handleDonation = () => coffeeApp.handleDonation();
