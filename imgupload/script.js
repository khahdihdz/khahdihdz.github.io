// ImgBB Image Uploader with Watermark - Main Script
class ImgBBUploader {
    constructor() {
        this.selectedFiles = [];
        this.canvas = null;
        this.ctx = null;
        this.currentImage = null;
        
        this.init();
    }

    init() {
        // Kiểm tra cấu hình API
        if (!validateConfig()) {
            this.showError('Vui lòng cấu hình API key trong file config.js');
            return;
        }

        this.initElements();
        this.bindEvents();
        this.updateWatermarkControls();
        
        console.log('🚀 ImgBB Uploader đã được khởi tạo');
    }

    initElements() {
        // Main elements
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.previewSection = document.getElementById('previewSection');
        this.canvas = document.getElementById('previewCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Watermark controls
        this.watermarkText = document.getElementById('watermarkText');
        this.fontSize = document.getElementById('fontSize');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.watermarkPosition = document.getElementById('watermarkPosition');
        this.watermarkOpacity = document.getElementById('watermarkOpacity');
        this.opacityValue = document.getElementById('opacityValue');
        this.watermarkColor = document.getElementById('watermarkColor');
        this.enableWatermark = document.getElementById('enableWatermark');
        
        // Results and progress
        this.progressBar = document.getElementById('progressBar');
        this.resultsSection = document.getElementById('resultsSection');
        this.uploadResults = document.getElementById('uploadResults');
        this.errorSection = document.getElementById('errorSection');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Toast
        this.toast = new bootstrap.Toast(document.getElementById('toast'));
        this.toastBody = document.getElementById('toastBody');

        // Set default watermark text
        this.watermarkText.value = '';  // Để trống để hiển thị placeholder
        this.watermarkText.placeholder = 'Để trống sẽ dùng text mặc định';
        
        // Event để xử lý focus/blur
        this.watermarkText.addEventListener('focus', () => {
            if (this.watermarkText.value === CONFIG.WATERMARK_DEFAULTS.text) {
                this.watermarkText.value = '';
            }
        });
        
        this.watermarkText.addEventListener('blur', () => {
            this.updatePreview();
        });
    }

    bindEvents() {
        // File input events
        this.uploadArea.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Watermark controls
        this.watermarkText.addEventListener('input', () => this.updatePreview());
        this.fontSize.addEventListener('input', () => this.updateWatermarkControls());
        this.watermarkPosition.addEventListener('change', () => this.updatePreview());
        this.watermarkOpacity.addEventListener('input', () => this.updateWatermarkControls());
        this.watermarkColor.addEventListener('change', () => this.updatePreview());
        this.enableWatermark.addEventListener('change', () => this.updatePreview());
        
        // Upload button
        this.uploadBtn.addEventListener('click', () => this.uploadImages());
    }

    updateWatermarkControls() {
        this.fontSizeValue.textContent = this.fontSize.value;
        this.opacityValue.textContent = Math.round(this.watermarkOpacity.value * 100);
        this.updatePreview();
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            CONFIG.UPLOAD_SETTINGS.allowedTypes.includes(file.type)
        );
        
        if (files.length > 0) {
            this.processFiles(files);
        } else {
            this.showToast('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WebP)', 'warning');
        }
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        this.selectedFiles = [];
        this.hideError();
        
        for (const file of files) {
            if (!this.validateFile(file)) continue;
            this.selectedFiles.push(file);
        }
        
        if (this.selectedFiles.length > 0) {
            this.uploadBtn.disabled = false;
            this.showPreview(this.selectedFiles[0]); // Show preview of first image
            this.showToast(`Đã chọn ${this.selectedFiles.length} ảnh`, 'success');
        } else {
            this.uploadBtn.disabled = true;
            this.hidePreview();
        }
    }

    validateFile(file) {
        if (!CONFIG.UPLOAD_SETTINGS.allowedTypes.includes(file.type)) {
            this.showError(`File ${file.name} không được hỗ trợ`);
            return false;
        }
        
        if (file.size > CONFIG.UPLOAD_SETTINGS.maxFileSize) {
            this.showError(`File ${file.name} quá lớn (tối đa 32MB)`);
            return false;
        }
        
        return true;
    }

    showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.renderImageWithWatermark();
                this.previewSection.style.display = 'block';
                this.previewSection.classList.add('fade-in');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    hidePreview() {
        this.previewSection.style.display = 'none';
        this.currentImage = null;
    }

    renderImageWithWatermark() {
        if (!this.currentImage) return;
        
        const maxWidth = 600;
        const maxHeight = 400;
        
        let { width, height } = this.currentImage;
        
        // Resize if needed
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw image
        this.ctx.drawImage(this.currentImage, 0, 0, width, height);
        
        // Draw watermark if enabled
        if (this.enableWatermark.checked) {
            this.drawWatermark(width, height);
        }
    }

    drawWatermark(canvasWidth, canvasHeight) {
        // Sử dụng text mặc định nếu không có input
        const text = this.watermarkText.value.trim() || CONFIG.WATERMARK_DEFAULTS.text;
        const fontSize = parseInt(this.fontSize.value);
        const opacity = parseFloat(this.watermarkOpacity.value);
        const color = this.watermarkColor.value;
        const position = this.watermarkPosition.value;
        
        // Set font
        this.ctx.font = `bold ${fontSize}px ${CONFIG.WATERMARK_DEFAULTS.fontFamily}`;
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        
        // Add text shadow for better visibility
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // Calculate text dimensions
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        
        // Calculate position
        let x, y;
        const padding = 20;
        
        switch (position) {
            case 'top-left':
                x = padding;
                y = padding + textHeight;
                break;
            case 'top-right':
                x = canvasWidth - textWidth - padding;
                y = padding + textHeight;
                break;
            case 'bottom-left':
                x = padding;
                y = canvasHeight - padding;
                break;
            case 'bottom-right':
                x = canvasWidth - textWidth - padding;
                y = canvasHeight - padding;
                break;
            case 'center':
                x = (canvasWidth - textWidth) / 2;
                y = (canvasHeight + textHeight) / 2;
                break;
            default:
                x = canvasWidth - textWidth - padding;
                y = canvasHeight - padding;
        }
        
        // Draw text
        this.ctx.fillText(text, x, y);
        
        // Reset shadow and opacity
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.globalAlpha = 1;
    }

    updatePreview() {
        if (this.currentImage) {
            this.renderImageWithWatermark();
        }
    }

    async applyWatermarkToFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw original image
                    ctx.drawImage(img, 0, 0);
                    
                    // Apply watermark if enabled
                    if (this.enableWatermark.checked) {
                        this.applyWatermarkToCanvas(ctx, img.width, img.height);
                    }
                    
                    // Convert to blob
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, file.type, 0.9);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    applyWatermarkToCanvas(ctx, width, height) {
        // Sử dụng text mặc định nếu không có input
        const text = this.watermarkText.value.trim() || CONFIG.WATERMARK_DEFAULTS.text;
        const fontSize = Math.max(24, Math.min(width, height) * 0.05); // Responsive font size
        const opacity = parseFloat(this.watermarkOpacity.value);
        const color = this.watermarkColor.value;
        const position = this.watermarkPosition.value;
        
        ctx.font = `bold ${fontSize}px ${CONFIG.WATERMARK_DEFAULTS.fontFamily}`;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        
        // Add shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = Math.max(2, fontSize * 0.1);
        ctx.shadowOffsetX = Math.max(1, fontSize * 0.05);
        ctx.shadowOffsetY = Math.max(1, fontSize * 0.05);
        
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        
        // Calculate position
        let x, y;
        const padding = Math.max(20, width * 0.02);
        
        switch (position) {
            case 'top-left':
                x = padding;
                y = padding + textHeight;
                break;
            case 'top-right':
                x = width - textWidth - padding;
                y = padding + textHeight;
                break;
            case 'bottom-left':
                x = padding;
                y = height - padding;
                break;
            case 'bottom-right':
                x = width - textWidth - padding;
                y = height - padding;
                break;
            case 'center':
                x = (width - textWidth) / 2;
                y = (height + textHeight) / 2;
                break;
            default:
                x = width - textWidth - padding;
                y = height - padding;
        }
        
        // Draw text
        ctx.fillText(text, x, y);
        
        // Reset effects
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalAlpha = 1;
    }

    async uploadImages() {
        if (this.selectedFiles.length === 0) return;
        
        this.uploadBtn.disabled = true;
        this.uploadBtn.innerHTML = '<span class="spinner"></span>Đang upload...';
        this.showProgress();
        this.hideError();
        this.hideResults();
        
        const results = [];
        const total = this.selectedFiles.length;
        
        try {
            for (let i = 0; i < this.selectedFiles.length; i++) {
                const file = this.selectedFiles[i];
                this.updateProgress((i / total) * 50, `Đang xử lý ${file.name}...`);
                
                // Apply watermark if enabled
                const processedFile = await this.applyWatermarkToFile(file);
                
                this.updateProgress(50 + (i / total) * 40, `Đang upload ${file.name}...`);
                
                // Upload to ImgBB
                const result = await this.uploadToImgBB(processedFile, file.name);
                results.push({ file: file.name, result });
                
                this.updateProgress(90 + (i / total) * 10, `Hoàn thành ${i + 1}/${total}`);
            }
            
            this.updateProgress(100, 'Upload hoàn tất!');
            this.showResults(results);
            this.showToast('Upload thành công tất cả ảnh!', 'success');
            
        } catch (error) {
            console.error('Upload error:', error);
            this.showError(`Lỗi upload: ${error.message}`);
            this.showToast('Có lỗi xảy ra khi upload', 'error');
        } finally {
            this.hideProgress();
            this.uploadBtn.disabled = false;
            this.uploadBtn.innerHTML = '<i class="fas fa-upload me-2"></i>Upload to ImgBB';
        }
    }

    async uploadToImgBB(file, originalName) {
        const formData = new FormData();
        formData.append('key', CONFIG.API_KEY);
        formData.append('image', file);
        formData.append('name', originalName.split('.')[0]);
        
        if (CONFIG.UPLOAD_SETTINGS.expiration) {
            formData.append('expiration', CONFIG.UPLOAD_SETTINGS.expiration);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.UPLOAD_SETTINGS.requestTimeout);
        
        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error?.message || 'Upload failed');
            }
            
            return data.data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Upload timeout - vui lòng thử lại');
            }
            
            throw error;
        }
    }

    showProgress() {
        this.progressBar.style.display = 'block';
        this.updateProgress(0, 'Bắt đầu upload...');
    }

    hideProgress() {
        setTimeout(() => {
            this.progressBar.style.display = 'none';
        }, 1000);
    }

    updateProgress(percent, message = '') {
        const progressBarInner = this.progressBar.querySelector('.progress-bar');
        progressBarInner.style.width = `${percent}%`;
        progressBarInner.textContent = message;
        progressBarInner.setAttribute('aria-valuenow', percent);
    }

    showResults(results) {
        this.uploadResults.innerHTML = '';
        
        results.forEach((item, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item d-flex align-items-center justify-content-between mb-3';
            resultDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.result.thumb.url}" alt="Thumbnail" class="result-image me-3">
                    <div>
                        <h6 class="mb-1">${item.file}</h6>
                        <small class="text-muted">Kích thước: ${this.formatFileSize(item.result.size)}</small>
                    </div>
                </div>
                <div class="btn-group-vertical">
                    <button class="btn copy-btn btn-sm mb-1" onclick="copyToClipboard('${item.result.url}')">
                        <i class="fas fa-copy me-1"></i>URL
                    </button>
                    <button class="btn copy-btn btn-sm mb-1" onclick="copyToClipboard('${item.result.display_url}')">
                        <i class="fas fa-eye me-1"></i>View
                    </button>
                    <a href="${item.result.url}" target="_blank" class="btn copy-btn btn-sm">
                        <i class="fas fa-external-link-alt me-1"></i>Open
                    </a>
                </div>
            `;
            this.uploadResults.appendChild(resultDiv);
        });
        
        this.resultsSection.style.display = 'block';
        this.resultsSection.classList.add('fade-in');
    }

    hideResults() {
        this.resultsSection.style.display = 'none';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorSection.style.display = 'block';
        this.errorSection.classList.add('fade-in');
    }

    hideError() {
        this.errorSection.style.display = 'none';
    }

    showToast(message, type = 'info') {
        this.toastBody.textContent = message;
        const toastEl = document.getElementById('toast');
        
        // Set color based on type
        toastEl.className = 'toast';
        if (type === 'success') {
            toastEl.classList.add('bg-success', 'text-white');
        } else if (type === 'error') {
            toastEl.classList.add('bg-danger', 'text-white');
        } else if (type === 'warning') {
            toastEl.classList.add('bg-warning', 'text-dark');
        }
        
        this.toast.show();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Global functions for button actions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = new bootstrap.Toast(document.getElementById('toast'));
        document.getElementById('toastBody').textContent = 'Đã copy vào clipboard!';
        document.getElementById('toast').className = 'toast bg-success text-white';
        toast.show();
    }).catch(err => {
        console.error('Copy failed:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const toast = new bootstrap.Toast(document.getElementById('toast'));
            document.getElementById('toastBody').textContent = 'Đã copy vào clipboard!';
            document.getElementById('toast').className = 'toast bg-success text-white';
            toast.show();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    });
}

// Initialize the uploader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imgbbUploader = new ImgBBUploader();
});
