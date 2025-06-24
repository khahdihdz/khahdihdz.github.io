// Custom JavaScript - Download Manager

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const customAddressForm = document.getElementById('customAddressForm');
    const customUrlInput = document.getElementById('customUrl');
    const customDownloadSection = document.getElementById('customDownloadSection');
    const customDownloadBtn = document.getElementById('customDownloadBtn');

    // Form submission handler
    customAddressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const customUrl = customUrlInput.value.trim();
        
        if (customUrl && isValidUrl(customUrl)) {
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            
            setTimeout(() => {
                // Update custom download button
                customDownloadBtn.href = customUrl;
                customDownloadBtn.innerHTML = '<i class="fas fa-download me-2"></i>Bắt đầu tải xuống';
                
                // Show custom download section
                customDownloadSection.style.display = 'block';
                customDownloadSection.scrollIntoView({ behavior: 'smooth' });
                
                // Remove loading state
                submitBtn.classList.remove('loading');
                
                // Show success message
                showNotification('Liên kết tải xuống đã được tạo thành công!', 'success');
                
                // Store in session storage for persistence
                sessionStorage.setItem('customDownloadUrl', customUrl);
                
            }, 1000);
        } else {
            showNotification('Vui lòng nhập một URL hợp lệ!', 'error');
        }
    });

    // Load saved custom URL on page load
    const savedUrl = sessionStorage.getItem('customDownloadUrl');
    if (savedUrl) {
        customUrlInput.value = savedUrl;
        customDownloadBtn.href = savedUrl;
        customDownloadBtn.innerHTML = '<i class="fas fa-download me-2"></i>Bắt đầu tải xuống';
        customDownloadSection.style.display = 'block';
    }

    // Add click tracking for custom download button
    customDownloadBtn.addEventListener('click', function(e) {
        trackDownload('custom', customDownloadBtn.href);
        addDownloadAnimation(customDownloadBtn);
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add smooth scrolling for internal links
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

    // Add input validation feedback
    customUrlInput.addEventListener('input', function() {
        const url = this.value.trim();
        const isValid = url === '' || isValidUrl(url);
        
        this.classList.toggle('is-valid', url !== '' && isValid);
        this.classList.toggle('is-invalid', url !== '' && !isValid);
    });

    // Clear form functionality
    const clearFormBtn = document.createElement('button');
    clearFormBtn.type = 'button';
    clearFormBtn.className = 'btn btn-outline-secondary btn-sm mt-2';
    clearFormBtn.innerHTML = '<i class="fas fa-trash me-1"></i>Xóa';
    clearFormBtn.addEventListener('click', clearForm);
    
    // Add clear button after the form
    customAddressForm.appendChild(clearFormBtn);

    // Initialize tooltips if Bootstrap tooltips are available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Auto-focus on URL input
    customUrlInput.focus();
});

// Utility Functions
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed notification-toast`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        border-radius: 10px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }
    }, 5000);
}

function trackDownload(type, url) {
    // Analytics tracking (replace with your analytics service)
    console.log(`Download tracked: ${type} - ${url}`);
    
    // You can add Google Analytics, Facebook Pixel, or other tracking here
    // Example: gtag('event', 'download', { 'type': type, 'url': url });
    
    // Log to session storage for debugging
    const downloads = JSON.parse(sessionStorage.getItem('downloadHistory') || '[]');
    downloads.push({
        type: type,
        url: url,
        timestamp: new Date().toISOString()
    });
    sessionStorage.setItem('downloadHistory', JSON.stringify(downloads));
}

function addDownloadAnimation(button) {
    // Prevent multiple clicks
    if (button.disabled) return;
    
    // Add download animation
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang chuẩn bị...';
    button.disabled = true;
    button.classList.add('loading');
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check me-2"></i>Đã sẵn sàng!';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.classList.remove('loading');
        }, 2000);
    }, 1500);
}

function clearForm() {
    const customUrlInput = document.getElementById('customUrl');
    const customDownloadSection = document.getElementById('customDownloadSection');
    
    // Clear input
    customUrlInput.value = '';
    customUrlInput.classList.remove('is-valid', 'is-invalid');
    
    // Hide download section
    customDownloadSection.style.display = 'none';
    
    // Clear session storage
    sessionStorage.removeItem('customDownloadUrl');
    
    // Show notification
    showNotification('Form đã được xóa!', 'info');
    
    // Focus back to input
    customUrlInput.focus();
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (!text) {
        showNotification('Không có liên kết để sao chép!', 'error');
        return;
    }
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Liên kết đã được sao chép vào clipboard!', 'success');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Liên kết đã được sao chép vào clipboard!', 'success');
        } else {
            showNotification('Không thể sao chép liên kết!', 'error');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showNotification('Không thể sao chép liên kết!', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Enter key on custom URL input
    if (e.key === 'Enter' && document.activeElement === document.getElementById('customUrl')) {
        e.preventDefault();
        document.getElementById('customAddressForm').dispatchEvent(new Event('submit'));
    }
    
    // Escape key to clear form
    if (e.key === 'Escape') {
        const alerts = document.querySelectorAll('.alert.notification-toast');
        alerts.forEach(alert => {
            if (alert.classList.contains('show')) {
                alert.remove();
            }
        });
        
        // If no alerts, clear form
        if (alerts.length === 0) {
            clearForm();
        }
    }
    
    // Ctrl+V to auto-focus and paste into URL input
    if (e.ctrlKey && e.key === 'v') {
        const urlInput = document.getElementById('customUrl');
        if (document.activeElement !== urlInput) {
            setTimeout(() => urlInput.focus(), 10);
        }
    }
    
    // Ctrl+Enter to submit form
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('customAddressForm').dispatchEvent(new Event('submit'));
    }
});

// Add responsive image loading effects
function addImageLoadingEffects() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });
}

// URL validation with more detailed feedback
function validateUrl(url) {
    if (!url) return { valid: false, message: 'URL không được để trống' };
    
    try {
        const urlObj = new URL(url);
        
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return { valid: false, message: 'URL phải bắt đầu với http:// hoặc https://' };
        }
        
        if (!urlObj.hostname) {
            return { valid: false, message: 'URL không hợp lệ' };
        }
        
        return { valid: true, message: 'URL hợp lệ' };
    } catch (error) {
        return { valid: false, message: 'Định dạng URL không đúng' };
    }
}

// Enhanced URL input with real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('customUrl');
    let validationTimeout;
    
    urlInput.addEventListener('input', function() {
        clearTimeout(validationTimeout);
        
        validationTimeout = setTimeout(() => {
            const url = this.value.trim();
            const validation = validateUrl(url);
            
            // Remove all validation classes
            this.classList.remove('is-valid', 'is-invalid');
            
            if (url) {
                if (validation.valid) {
                    this.classList.add('is-valid');
                } else {
                    this.classList.add('is-invalid');
                }
            }
        }, 500);
    });
});

// Initialize functions on page load
document.addEventListener('DOMContentLoaded', function() {
    addImageLoadingEffects();
    
    // Add version info to console
    console.log('%cDownload Manager v1.0', 'color: #007bff; font-size: 16px; font-weight: bold;');
    console.log('Trang web quản lý tải xuống với tính năng URL tùy chỉnh');
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.now();
    console.log(`Trang đã tải xong trong ${Math.round(loadTime)}ms`);
    
    // Store performance data
    sessionStorage.setItem('pageLoadTime', loadTime.toString());
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Đã xảy ra lỗi. Vui lòng thử lại!', 'error');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    showNotification('Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại!', 'error');
});

// Export functions for global use
window.downloadManager = {
    copyToClipboard,
    clearForm,
    validateUrl,
    showNotification,
    isValidUrl
};