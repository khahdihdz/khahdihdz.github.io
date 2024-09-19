function switchLanguage(lang) {
    if (lang === 'vi') {
        // Cập nhật tiêu đề và mô tả
        document.getElementById('header-title').innerText = 'Donate | Quyên góp';
        document.getElementById('header-description').innerText = 'Support us via Bank Transfer or Binance Coin (BNB) | Hỗ trợ chúng tôi qua chuyển khoản ngân hàng hoặc Binance Coin (BNB)';
        
        // Hiển thị thông tin chuyển khoản ngân hàng tiếng Việt, ẩn tiếng Anh
        document.getElementById('bank-info').style.display = 'block';
        document.getElementById('bank-info-en').style.display = 'none';
        
        // Hiển thị địa chỉ ví BNB tiếng Việt, ẩn tiếng Anh
        document.getElementById('bnb-wallet-address').style.display = 'block';
        document.getElementById('bnb-wallet-address-en').style.display = 'none';
        
        // Cập nhật ghi chú và tiêu đề QR
        document.getElementById('bnb-note').innerText = 'Hãy đảm bảo bạn sử dụng Binance Smart Chain (BEP-20) khi gửi BNB | Ensure you\'re sending via Binance Smart Chain (BEP-20).';
        document.getElementById('qr-title').innerText = 'Quét mã QR để gửi BNB | Scan the QR code to send BNB:';
    } else if (lang === 'en') {
        // Cập nhật tiêu đề và mô tả
        document.getElementById('header-title').innerText = 'Donate | Quyên góp';
        document.getElementById('header-description').innerText = 'Support us via Bank Transfer or Binance Coin (BNB) | Hỗ trợ chúng tôi qua chuyển khoản ngân hàng hoặc Binance Coin (BNB)';
        
        // Hiển thị thông tin chuyển khoản ngân hàng tiếng Anh, ẩn tiếng Việt
        document.getElementById('bank-info').style.display = 'none';
        document.getElementById('bank-info-en').style.display = 'block';
        
        // Hiển thị địa chỉ ví BNB tiếng Anh, ẩn tiếng Việt
        document.getElementById('bnb-wallet-address').style.display = 'none';
        document.getElementById('bnb-wallet-address-en').style.display = 'block';
        
        // Cập nhật ghi chú và tiêu đề QR
        document.getElementById('bnb-note').innerText = 'Ensure you\'re sending via Binance Smart Chain (BEP-20).';
        document.getElementById('qr-title').innerText = 'Scan the QR code to send BNB:';

// Hiển thị thông tin chuyển BNB tiếng Việt, ẩn tiếng Anh
        document.getElementById('bnb-title').style.display = 'block';
        document.getElementById('bnb-title-en').style.display = 'none';
    }
}
