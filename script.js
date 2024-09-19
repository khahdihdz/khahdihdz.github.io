function switchLanguage(lang) {
    if (lang === 'vi') {
        // Hiển thị nội dung tiếng Việt và ẩn nội dung tiếng Anh
        document.getElementById('bank-info-vi').style.display = 'block';
        document.getElementById('bank-info-en').style.display = 'none';
        document.getElementById('bnb-title-vi').style.display = 'block';
        document.getElementById('bnb-wallet-address-vi').style.display = 'block';
        document.getElementById('bnb-note-vi').style.display = 'block';
        document.getElementById('bnb-title-en').style.display = 'none';
        document.getElementById('bnb-wallet-address-en').style.display = 'none';
        document.getElementById('bnb-note-en').style.display = 'none';
        document.getElementById('qr-title-vi').style.display = 'block';
        document.getElementById('qr-title-en').style.display = 'none';
    } else if (lang === 'en') {
        // Hiển thị nội dung tiếng Anh và ẩn nội dung tiếng Việt
        document.getElementById('bank-info-vi').style.display = 'none';
        document.getElementById('bank-info-en').style.display = 'block';
        document.getElementById('bnb-title-vi').style.display = 'none';
        document.getElementById('bnb-wallet-address-vi').style.display = 'none';
        document.getElementById('bnb-note-vi').style.display = 'none';
        document.getElementById('bnb-title-en').style.display = 'block';
        document.getElementById('bnb-wallet-address-en').style.display = 'block';
        document.getElementById('bnb-note-en').style.display = 'block';
        document.getElementById('qr-title-vi').style.display = 'none';
        document.getElementById('qr-title-en').style.display = 'block';
    }
}
