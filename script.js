// Đợi tài liệu HTML được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật năm hiện tại ở cuối trang
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Lấy các phần tử DOM
    const coffeeOptions = document.querySelectorAll('.coffee-option');
    const customAmountInput = document.getElementById('customAmount');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const transferContentInput = document.getElementById('transferContent');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    
    // Số tiền mặc định là ly nhỏ
    let selectedAmount = 20000;
    
    // Xử lý sự kiện khi người dùng click vào các tùy chọn cà phê
    coffeeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Xóa class active của tất cả các tùy chọn
            coffeeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Thêm class active cho tùy chọn được chọn
            this.classList.add('active');
            
            // Lấy giá trị số tiền từ thuộc tính data-amount
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            
            // Cập nhật giá trị số tiền tùy chọn
            customAmountInput.value = selectedAmount;
        });
    });
    
    // Khi người dùng thay đổi số tiền tùy chọn
    customAmountInput.addEventListener('input', function() {
        // Xóa class active của tất cả các tùy chọn cà phê
        coffeeOptions.forEach(opt => opt.classList.remove('active'));
        
        // Cập nhật số tiền được chọn
        selectedAmount = parseInt(this.value) || 0;
    });
    
    // Xử lý sự kiện khi người dùng nhập tên
    nameInput.addEventListener('input', function() {
        updateTransferContent();
    });
    
    // Xử lý nút tạo nội dung chuyển khoản
    generateButton.addEventListener('click', function() {
        // Kiểm tra xem người dùng đã nhập tên và số tiền chưa
        if (!nameInput.value.trim()) {
            showToast('Vui lòng nhập tên của bạn!', 'warning');
            nameInput.focus();
            return;
        }
        
        if (!customAmountInput.value || parseInt(customAmountInput.value) <= 0) {
            showToast('Vui lòng nhập số tiền hợp lệ!', 'warning');
            customAmountInput.focus();
            return;
        }
        
        // Cập nhật nội dung chuyển khoản
        updateTransferContent();
        
        // Hiển thị thông báo thành công
        showToast('Đã tạo nội dung chuyển khoản!', 'success');
    });
    
    // Xử lý nút sao chép nội dung chuyển khoản
    copyButton.addEventListener('click', function() {
        // Kiểm tra nội dung có trống không
        if (!transferContentInput.value.trim()) {
            showToast('Vui lòng tạo nội dung chuyển khoản trước!', 'warning');
            return;
        }
        
        // Sao chép nội dung vào clipboard
        transferContentInput.select();
        document.execCommand('copy');
        
        // Hiển thị thông báo thành công
        showToast('Đã sao chép nội dung chuyển khoản!', 'success');
    });
    
    // Hàm cập nhật nội dung chuyển khoản
    function updateTransferContent() {
        const name = nameInput.value.trim();
        if (name) {
            // Loại bỏ dấu tiếng Việt và các ký tự đặc biệt
            const sanitizedName = removeVietnameseAccents(name).replace(/[^a-zA-Z0-9]/g, '');
            transferContentInput.value = sanitizedName.toUpperCase();
        } else {
            transferContentInput.value = '';
        }
    }
    
    // Hàm loại bỏ dấu tiếng Việt
    function removeVietnameseAccents(str) {
        return str.normalize('NFD')
                 .replace(/[\u0300-\u036f]/g, '')
                 .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
    
    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
    }
    
    // Hàm hiển thị thông báo toast
    function showToast(message, type = 'info') {
        // Kiểm tra xem container đã tồn tại chưa, nếu chưa thì tạo mới
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Tạo toast mới
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${type === 'success' ? 'Thành công' : 'Thông báo'}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        
        // Thêm toast vào container
        toastContainer.appendChild(toast);
        
        // Khởi tạo toast bootstrap
        const bootstrapToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        
        // Hiển thị toast
        bootstrapToast.show();
        
        // Xóa toast khỏi DOM sau khi ẩn
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }
    
    // Chọn ly nhỏ mặc định
    coffeeOptions[0].classList.add('active');
    
    // Tạo một thẻ div cho toast container
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Thêm hiệu ứng hover cho các phần tử
    addHoverEffects();
});

// Hàm thêm hiệu ứng hover cho các phần tử
function addHoverEffects() {
    // Thêm hiệu ứng hover cho nút
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Thêm hiệu ứng ripple cho các tùy chọn cà phê
    const coffeeOptions = document.querySelectorAll('.coffee-option');
    coffeeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            // Tạo hiệu ứng ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            // Xóa hiệu ứng sau khi hoàn thành
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}
