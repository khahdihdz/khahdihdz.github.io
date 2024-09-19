function switchLanguage(lang) {
    if (lang === 'vi') {
        document.getElementById('header-title').innerText = 'Donate | Quyên góp';
        document.getElementById('header-description').innerText = 'Support us via Bank Transfer or Binance Coin (BNB) | Hỗ trợ chúng tôi qua chuyển khoản ngân hàng hoặc Binance Coin (BNB)';
        
        document.getElementById('bank-info').style.display = 'block';
        document.getElementById('bank-info-en').style.display = 'none';
        
        document.getElementById('bnb-title').innerText = 'Donate via Binance Coin (BNB)';
        document.getElementById('bnb-wallet-address').innerText = 'Địa chỉ ví BNB: [Địa chỉ ví BNB của bạn]';
        document.getElementById('bnb-note').innerText = 'Hãy đảm bảo bạn sử dụng Binance Smart Chain (BEP-20) khi gửi BNB | Ensure you\'re sending via Binance Smart Chain (BEP-20).';
        document.getElementById('qr-title').innerText = 'Quét mã QR để gửi BNB | Scan the QR code to send BNB:';
        
    } else if (lang === 'en') {
        document.getElementById('header-title').innerText = 'Donate | Quyên góp';
        document.getElementById('header-description').innerText = 'Support us via Bank Transfer or Binance Coin (BNB) | Hỗ trợ chúng tôi qua chuyển khoản ngân hàng hoặc Binance Coin (BNB)';
        
        document.getElementById('bank-info').style.display = 'none';
        document.getElementById('bank-info-en').style.display = 'block';
        
        document.getElementById('bnb-title').innerText = 'Donate via Binance Coin (BNB)';
        document.getElementById('bnb-wallet-address-en').innerText = 'BNB Wallet Address: [Your BNB wallet address]';
        document.getElementById('bnb-note').innerText = 'Ensure you\'re sending via Binance Smart Chain (BEP-20).';
        document.getElementById('qr-title').innerText = 'Scan the QR code to send BNB:';
    }
}
