// Configuration
const CONFIG = {
    API_BASE_URL: 'https://msb-y56j.onrender.com',
    ACCOUNT_NUMBER: '13001011869246',
    BANK_CODE: '970426',
    ACCOUNT_NAME: 'DINH TRONG KHANH',
    REFRESH_INTERVAL: 30000, // 30 seconds
    MAX_SUPPORTERS_DISPLAY: 5,
    STORAGE_KEY: 'buyMeCoffee_donators',
    MAX_STORAGE_RECORDS: 100,
    AUTO_EXPORT_JSON: true, // Auto export to JSON file
    EXPORT_INTERVAL: 60000 // Export every 60 seconds
};

// Global state
let currentLanguage = 'vi';
let currentAmount = 25000;
let lastTransactionId = null;
let donatorsData = {
    lastUpdate: null,
    totalAmount: 0,
    totalDonations: 0,
    donators: []
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    loadFromLocalStorage();
    loadRecentTransactions();
    startAutoRefresh();
    addExportButton();
    if (CONFIG.AUTO_EXPORT_JSON) {
        startAutoExport();
    }
});

// Local Storage Management
function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (stored) {
            donatorsData = JSON.parse(stored);
            console.log('Loaded donators data from localStorage:', donatorsData);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function saveToLocalStorage() {
    try {
        donatorsData.lastUpdate = new Date().toISOString();
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(donatorsData));
        console.log('Saved donators data to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// JSON Export/Import Functions
function exportToJSON() {
    const dataToExport = {
        ...donatorsData,
        exportDate: new Date().toISOString(),
        accountInfo: {
            accountNumber: CONFIG.ACCOUNT_NUMBER,
            accountName: CONFIG.ACCOUNT_NAME,
            bankCode: CONFIG.BANK_CODE
        }
    };
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.href = url;
    link.download = `donators_${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(
        currentLanguage === 'vi' ? 'Đã xuất dữ liệu JSON!' : 'JSON data exported!',
        'success'
    );
    
    console.log('Exported donators data to JSON file');
}

function importFromJSON(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Validate data structure
            if (imported.donators && Array.isArray(imported.donators)) {
                donatorsData = {
                    lastUpdate: imported.lastUpdate || new Date().toISOString(),
                    totalAmount: imported.totalAmount || 0,
                    totalDonations: imported.totalDonations || 0,
                    donators: imported.donators
                };
                
                saveToLocalStorage();
                displaySupporters(donatorsData.donators.slice(0, CONFIG.MAX_SUPPORTERS_DISPLAY));
                
                showNotification(
                    currentLanguage === 'vi' ? 'Đã nhập dữ liệu JSON!' : 'JSON data imported!',
                    'success'
                );
                
                console.log('Imported donators data from JSON file');
            } else {
                throw new Error('Invalid JSON structure');
            }
        } catch (error) {
            console.error('Error importing JSON:', error);
            showNotification(
                currentLanguage === 'vi' ? 'Lỗi nhập dữ liệu!' : 'Error importing data!',
                'error'
            );
        }
    };
    
    reader.readAsText(file);
}

function addExportButton() {
    const supportersCard = document.querySelector('.supporters-card h5');
    if (supportersCard) {
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'json-controls';
        buttonGroup.innerHTML = `
            <button class="btn btn-sm btn-outline-primary me-2" onclick="exportToJSON()" title="${currentLanguage === 'vi' ? 'Xuất JSON' : 'Export JSON'}">
                <i class="fas fa-download"></i>
            </button>
            <label class="btn btn-sm btn-outline-secondary" title="${currentLanguage === 'vi' ? 'Nhập JSON' : 'Import JSON'}">
                <i class="fas fa-upload"></i>
                <input type="file" accept=".json" onchange="handleFileImport(event)" style="display: none;">
            </label>
        `;
        
        const header = supportersCard.parentElement;
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.appendChild(buttonGroup);
    }
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        importFromJSON(file);
    }
    event.target.value = ''; // Reset input
}

function startAutoExport() {
    setInterval(() => {
        if (donatorsData.donators.length > 0) {
            // Auto-save to localStorage (not file download)
            saveToLocalStorage();
            console.log('Auto-saved donators data');
        }
    }, CONFIG.EXPORT_INTERVAL);
}

// Language Toggle
document.getElementById('langToggle').addEventListener('click', function() {
    currentLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
    updateLanguage();
    togglePaymentMethods();
});

function initializeLanguage() {
    updateLanguage();
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-vi][data-en]');
    elements.forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLanguage}`);
    });
    
    document.getElementById('langText').textContent = currentLanguage === 'vi' ? 'English' : 'Tiếng Việt';
}

function togglePaymentMethods() {
    const viPayment = document.querySelector('.vi-payment');
    const enPayment = document.querySelector('.en-payment');
    
    if (currentLanguage === 'vi') {
        viPayment.style.display = 'block';
        enPayment.style.display = 'none';
    } else {
        viPayment.style.display = 'none';
        enPayment.style.display = 'block';
    }
}

// Coffee Selection
function selectCoffee(button, amount) {
    // Remove active class from all buttons
    document.querySelectorAll('.coffee-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    button.classList.add('active');
    
    // Update amount
    currentAmount = amount;
    updateQRCode(amount);
    updateDisplayAmount(amount);
    
    // Clear custom amount input
    document.getElementById('customAmount').value = '';
}

function updateCustomAmount() {
    const customInput = document.getElementById('customAmount');
    const amount = parseInt(customInput.value);
    
    if (!amount || amount < 2000) {
        showNotification('Vui lòng nhập số tiền tối thiểu 2,000 VNĐ', 'warning');
        return;
    }
    
    // Remove active class from preset buttons
    document.querySelectorAll('.coffee-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    currentAmount = amount;
    updateQRCode(amount);
    updateDisplayAmount(amount);
}

function updateQRCode(amount) {
    const qrImage = document.getElementById('qrCode');
    const baseUrl = 'https://api.vietqr.io/image';
    const accountName = encodeURIComponent(CONFIG.ACCOUNT_NAME);
    
    qrImage.src = `${baseUrl}/${CONFIG.BANK_CODE}-${CONFIG.ACCOUNT_NUMBER}-GuEo6F2.jpg?accountName=${accountName}&amount=${amount}`;
}

function updateDisplayAmount(amount) {
    const displayElement = document.getElementById('displayAmount');
    displayElement.textContent = formatCurrency(amount);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Copy to Clipboard
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = element.innerHTML;
        element.innerHTML = text + ' <i class="fas fa-check ms-2 text-success"></i>';
        
        setTimeout(() => {
            element.innerHTML = originalHTML;
        }, 2000);
        
        showNotification(
            currentLanguage === 'vi' ? 'Đã sao chép!' : 'Copied!',
            'success'
        );
    }).catch(err => {
        showNotification(
            currentLanguage === 'vi' ? 'Không thể sao chép' : 'Failed to copy',
            'error'
        );
    });
}

// API Integration
async function loadRecentTransactions() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/transactions?accountNumber=${CONFIG.ACCOUNT_NUMBER}&limit=50`);
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        if (data.success && data.transactions && data.transactions.length > 0) {
            processTransactions(data.transactions);
            displaySupporters(data.transactions.slice(0, CONFIG.MAX_SUPPORTERS_DISPLAY));
            checkNewTransaction(data.transactions[0]);
        } else {
            // Display from cached data if available
            if (donatorsData.donators.length > 0) {
                displaySupporters(donatorsData.donators.slice(0, CONFIG.MAX_SUPPORTERS_DISPLAY));
            } else {
                displayNoSupporters();
            }
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
        // Display from cached data if available
        if (donatorsData.donators.length > 0) {
            displaySupporters(donatorsData.donators.slice(0, CONFIG.MAX_SUPPORTERS_DISPLAY));
        } else {
            displayErrorState();
        }
    }
}

function processTransactions(transactions) {
    // Update donators data
    transactions.forEach(transaction => {
        const existingIndex = donatorsData.donators.findIndex(
            d => d.transactionId === (transaction.transactionId || transaction.id)
        );
        
        if (existingIndex === -1) {
            // New transaction
            const donator = {
                transactionId: transaction.transactionId || transaction.id,
                amount: transaction.amount,
                description: transaction.description || 'Buy Me a Coffee',
                transactionDate: transaction.transactionDate,
                addedDate: new Date().toISOString()
            };
            
            donatorsData.donators.unshift(donator);
            donatorsData.totalAmount += transaction.amount;
            donatorsData.totalDonations += 1;
        }
    });
    
    // Keep only MAX_STORAGE_RECORDS
    if (donatorsData.donators.length > CONFIG.MAX_STORAGE_RECORDS) {
        donatorsData.donators = donatorsData.donators.slice(0, CONFIG.MAX_STORAGE_RECORDS);
    }
    
    // Save to localStorage
    saveToLocalStorage();
}

function displaySupporters(transactions) {
    const supportersList = document.getElementById('supportersList');
    
    if (transactions.length === 0) {
        displayNoSupporters();
        return;
    }
    
    const html = transactions.map(transaction => {
        const amount = formatCurrency(transaction.amount);
        const time = formatTransactionTime(transaction.transactionDate);
        const description = transaction.description || 'Buy Me a Coffee';
        
        return `
            <div class="supporter-item animate-slide-in">
                <div class="supporter-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="supporter-info">
                    <div class="supporter-name">${escapeHtml(description)}</div>
                    <div class="supporter-time">${time}</div>
                </div>
                <div class="supporter-amount">${amount}</div>
            </div>
        `;
    }).join('');
    
    supportersList.innerHTML = html;
}

function displayNoSupporters() {
    const supportersList = document.getElementById('supportersList');
    supportersList.innerHTML = `
        <div class="text-center text-muted py-3">
            <i class="fas fa-coffee me-2"></i>
            <span data-vi="Chưa có người ủng hộ. Hãy là người đầu tiên!" data-en="No supporters yet. Be the first!">
                ${currentLanguage === 'vi' ? 'Chưa có người ủng hộ. Hãy là người đầu tiên!' : 'No supporters yet. Be the first!'}
            </span>
        </div>
    `;
}

function displayErrorState() {
    const supportersList = document.getElementById('supportersList');
    supportersList.innerHTML = `
        <div class="text-center text-muted py-3">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <span data-vi="Không thể tải dữ liệu. Đang thử lại..." data-en="Unable to load data. Retrying...">
                ${currentLanguage === 'vi' ? 'Không thể tải dữ liệu. Đang thử lại...' : 'Unable to load data. Retrying...'}
            </span>
        </div>
    `;
}

function checkNewTransaction(latestTransaction) {
    if (!latestTransaction) return;
    
    const transactionId = latestTransaction.transactionId || latestTransaction.id;
    
    if (lastTransactionId && transactionId !== lastTransactionId) {
        showNewSupporterNotification(latestTransaction);
        playNotificationSound();
    }
    
    lastTransactionId = transactionId;
}

function showNewSupporterNotification(transaction) {
    const amount = formatCurrency(transaction.amount);
    const message = currentLanguage === 'vi' 
        ? `Cảm ơn sự ủng hộ ${amount}!`
        : `Thank you for ${amount} support!`;
    
    showNotification(message, 'success', 5000);
}

function playNotificationSound() {
    // Create a simple notification sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio notification not supported');
    }
}

function formatTransactionTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
        return currentLanguage === 'vi' ? 'Vừa xong' : 'Just now';
    } else if (diffMins < 60) {
        return currentLanguage === 'vi' ? `${diffMins} phút trước` : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return currentLanguage === 'vi' ? `${diffHours} giờ trước` : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        return currentLanguage === 'vi' ? `${diffDays} ngày trước` : `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString(currentLanguage === 'vi' ? 'vi-VN' : 'en-US');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-refresh transactions
function startAutoRefresh() {
    setInterval(() => {
        loadRecentTransactions();
    }, CONFIG.REFRESH_INTERVAL);
}

// Notification System
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification custom-notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Smooth scroll for internal links
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

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.payment-card, .thank-card').forEach(el => {
    observer.observe(el);
});
