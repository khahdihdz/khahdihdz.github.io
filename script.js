document.getElementById('vi-btn').addEventListener('click', function() {
    // Tiếng Việt
    document.getElementById('title').innerText = 'Ủng Hộ Chúng Tôi qua Chuyển Khoản Ngân Hàng hoặc BNB';
    document.getElementById('bank-title').innerText = 'Thông Tin Chuyển Khoản Ngân Hàng (SWIFT)';
    document.getElementById('bank-name').innerText = 'Tên ngân hàng:';
    document.getElementById('branch-address').innerText = 'Địa chỉ chi nhánh:';
    document.getElementById('account-number').innerText = 'Số tài khoản:';
    document.getElementById('account-name').innerText = 'Tên tài khoản:';
    document.getElementById('swift-code').innerText = 'Mã SWIFT:';
    document.getElementById('bank-note').innerText = 'Vui lòng kiểm tra thông tin trước khi chuyển tiền.';
    document.getElementById('bnb-title').innerText = 'Ủng Hộ qua Binance Coin (BNB)';
    document.getElementById('bnb-address-title').innerText = 'Địa chỉ ví BNB:';
    document.getElementById('bnb-note').innerText = 'Bạn có thể gửi BNB qua địa chỉ ví trên. Hãy đảm bảo bạn đang sử dụng Binance Smart Chain (BEP-20).';
    document.getElementById('qr-title').innerText = 'Quét mã QR để gửi BNB:';
});

document.getElementById('en-btn').addEventListener('click', function() {
    // English
    document.getElementById('title').innerText = 'Support Us via Bank Transfer or BNB';
    document.getElementById('bank-title').innerText = 'Bank Transfer Information (SWIFT)';
    document.getElementById('bank-name').innerText = 'Bank Name:';
    document.getElementById('branch-address').innerText = 'Branch Address:';
    document.getElementById('account-number').innerText = 'Account Number:';
    document.getElementById('account-name').innerText = 'Account Name:';
    document.getElementById('swift-code').innerText = 'SWIFT Code:';
    document.getElementById('bank-note').innerText = 'Please ensure all the information is correct before proceeding with the transfer.';
    document.getElementById('bnb-title').innerText = 'Donate via Binance Coin (BNB)';
    document.getElementById('bnb-address-title').innerText = 'BNB Wallet Address:';
    document.getElementById('bnb-note').innerText = 'You can donate Binance Coin (BNB) to the wallet address above. Ensure you\'re sending via the Binance Smart Chain (BEP-20).';
    document.getElementById('qr-title').innerText = 'Scan the QR code to send BNB:';
});
