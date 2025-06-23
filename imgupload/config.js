// ImgBB API Configuration
// Bảo mật: Thay thế API_KEY bằng key thực tế của bạn
const CONFIG = {
    // Lấy API key từ: https://api.imgbb.com/
    API_KEY: 'YOUR_IMGBB_API_KEY_HERE',
    
    // ImgBB API endpoint
    API_URL: 'https://api.imgbb.com/1/upload',
    
    // Cài đặt upload mặc định
    UPLOAD_SETTINGS: {
        // Thời gian hết hạn (giây) - null là không hết hạn
        expiration: null,
        
        // Kích thước file tối đa (bytes) - 32MB
        maxFileSize: 32 * 1024 * 1024,
        
        // Các định dạng file được hỗ trợ
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        
        // Timeout cho request (ms)
        requestTimeout: 30000
    },
    
    // Cài đặt watermark mặc định
    WATERMARK_DEFAULTS: {
        text: 'Ảnh được upload từ https://khahdihdz.github.io/imgupload',
        fontSize: 24,
        position: 'bottom-right',
        opacity: 0.7,
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
    }
};

// Kiểm tra tính hợp lệ của cấu hình
const validateConfig = () => {
    if (!CONFIG.API_KEY || CONFIG.API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
        console.warn('⚠️ Cảnh báo: Bạn cần cập nhật API_KEY trong file config.js');
        return false;
    }
    return true;
};

// Export config để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateConfig };
}
