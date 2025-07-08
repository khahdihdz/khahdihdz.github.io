// Hàm định dạng số tiền
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Hàm định dạng số với dấu phẩy
function formatNumber(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

// Hàm kiểm tra validation
function validateInput(value, fieldName, minValue = 0) {
    if (value === '' || value === null || value === undefined) {
        return `${fieldName} không được để trống`;
    }
    
    if (isNaN(value) || value < minValue) {
        return `${fieldName} phải là số và lớn hơn hoặc bằng ${minValue}`;
    }
    
    return null;
}

// Hàm hiển thị lỗi
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    
    field.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

// Hàm ẩn lỗi
function hideError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    
    field.classList.remove('error');
    errorDiv.classList.remove('show');
}

// Hàm ẩn tất cả lỗi
function hideAllErrors() {
    const errorFields = ['basicSalary', 'allowance', 'standardDays', 'actualDays', 'otherAllowance'];
    errorFields.forEach(fieldId => hideError(fieldId));
}

// Hàm validation toàn bộ form
function validateForm() {
    hideAllErrors();
    
    const basicSalary = document.getElementById('basicSalary').value;
    const allowance = document.getElementById('allowance').value;
    const standardDays = document.getElementById('standardDays').value;
    const actualDays = document.getElementById('actualDays').value;
    const otherAllowance = document.getElementById('otherAllowance').value;
    
    let isValid = true;
    
    // Validation cho từng trường
    const basicSalaryError = validateInput(basicSalary, 'Lương cơ bản', 0);
    if (basicSalaryError) {
        showError('basicSalary', basicSalaryError);
        isValid = false;
    }
    
    const allowanceError = validateInput(allowance, 'Phụ cấp', 0);
    if (allowanceError) {
        showError('allowance', allowanceError);
        isValid = false;
    }
    
    const standardDaysError = validateInput(standardDays, 'Số ngày công chuẩn', 1);
    if (standardDaysError) {
        showError('standardDays', standardDaysError);
        isValid = false;
    }
    
    const actualDaysError = validateInput(actualDays, 'Số ngày làm thực tế', 0);
    if (actualDaysError) {
        showError('actualDays', actualDaysError);
        isValid = false;
    }
    
    const otherAllowanceError = validateInput(otherAllowance, 'Phụ cấp khác', 0);
    if (otherAllowanceError) {
        showError('otherAllowance', otherAllowanceError);
        isValid = false;
    }
    
    // Kiểm tra số ngày làm thực tế không vượt quá số ngày công chuẩn
    if (isValid && parseFloat(actualDays) > parseFloat(standardDays)) {
        showError('actualDays', 'Số ngày làm thực tế không được vượt quá số ngày công chuẩn');
        isValid = false;
    }
    
    return isValid;
}

// Hàm tính lương
function calculateSalary() {
    if (!validateForm()) {
        return;
    }
    
    // Lấy giá trị từ form
    const basicSalary = parseFloat(document.getElementById('basicSalary').value);
    const allowance = parseFloat(document.getElementById('allowance').value);
    const standardDays = parseFloat(document.getElementById('standardDays').value);
    const actualDays = parseFloat(document.getElementById('actualDays').value);
    const otherAllowance = parseFloat(document.getElementById('otherAllowance').value);
    
    // Tính toán
    const fullSalary = basicSalary + allowance; // Tổng lương đủ công
    const dailySalary = fullSalary / standardDays; // Lương 1 ngày
    const actualSalary = (dailySalary * actualDays) + otherAllowance; // Lương thực nhận
    
    // Hiển thị kết quả
    document.getElementById('fullSalary').textContent = formatCurrency(fullSalary);
    document.getElementById('dailySalary').textContent = formatCurrency(dailySalary);
    document.getElementById('otherAllowanceResult').textContent = formatCurrency(otherAllowance);
    document.getElementById('actualSalary').textContent = formatCurrency(actualSalary);
    
    // Tạo các bước tính toán
    const stepsHtml = `
        <div class="step-item">
            <strong>Bước 1:</strong> Tính tổng lương đủ công = Lương cơ bản + Phụ cấp<br>
            = ${formatCurrency(basicSalary)} + ${formatCurrency(allowance)} = ${formatCurrency(fullSalary)}
        </div>
        <div class="step-item">
            <strong>Bước 2:</strong> Tính lương 1 ngày = Tổng lương đủ công ÷ Số ngày công chuẩn<br>
            = ${formatCurrency(fullSalary)} ÷ ${formatNumber(standardDays)} = ${formatCurrency(dailySalary)}
        </div>
        <div class="step-item">
            <strong>Bước 3:</strong> Tính lương theo ngày công thực tế = Lương 1 ngày × Số ngày làm thực tế<br>
            = ${formatCurrency(dailySalary)} × ${formatNumber(actualDays)} = ${formatCurrency(dailySalary * actualDays)}
        </div>
        <div class="step-item">
            <strong>Bước 4:</strong> Tính lương thực nhận = Lương theo ngày công + Phụ cấp khác<br>
            = ${formatCurrency(dailySalary * actualDays)} + ${formatCurrency(otherAllowance)} = ${formatCurrency(actualSalary)}
        </div>
    `;
    
    document.getElementById('stepsList').innerHTML = stepsHtml;
    
    // Hiển thị kết quả với animation
    const resultCard = document.getElementById('resultCard');
    resultCard.style.display = 'block';
    resultCard.classList.add('success-animation');
    
    // Cuộn xuống kết quả
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Hàm reset form
function resetForm() {
    // Reset các giá trị về mặc định
    document.getElementById('basicSalary').value = '4976000';
    document.getElementById('allowance').value = '248800';
    document.getElementById('standardDays').value = '26';
    document.getElementById('actualDays').value = '16';
    document.getElementById('otherAllowance').value = '0';
    
    // Ẩn tất cả lỗi
    hideAllErrors();
    
    // Ẩn kết quả
    document.getElementById('resultCard').style.display = 'none';
    
    // Focus vào trường đầu tiên
    document.getElementById('basicSalary').focus();
}

// Hàm xử lý khi nhấn Enter
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        calculateSalary();
    }
}

// Hàm xử lý khi input thay đổi (ẩn lỗi)
function handleInputChange(event) {
    const fieldId = event.target.id;
    hideError(fieldId);
}

// Hàm định dạng input số khi nhập
function formatInputNumber(event) {
    const value = event.target.value;
    if (value && !isNaN(value)) {
        // Có thể thêm logic định dạng số khi nhập ở đây
    }
}

// Hàm kiểm tra số âm
function preventNegativeInput(event) {
    const key = event.key;
    if (key === '-' || key === 'e' || key === 'E') {
        event.preventDefault();
    }
}

// Hàm tính lương nhanh (có thể dùng cho tính năng mở rộng)
function quickCalculate(basicSalary, allowance, standardDays, actualDays, otherAllowance = 0) {
    const fullSalary = basicSalary + allowance;
    const dailySalary = fullSalary / standardDays;
    const actualSalary = (dailySalary * actualDays) + otherAllowance;
    
    return {
        fullSalary: fullSalary,
        dailySalary: dailySalary,
        actualSalary: actualSalary,
        otherAllowance: otherAllowance
    };
}

// Hàm tính phần trăm công việc đã hoàn thành
function calculateWorkPercentage() {
    const standardDays = parseFloat(document.getElementById('standardDays').value) || 0;
    const actualDays = parseFloat(document.getElementById('actualDays').value) || 0;
    
    if (standardDays > 0) {
        return Math.round((actualDays / standardDays) * 100);
    }
    return 0;
}

// Hàm hiển thị thông tin thêm về tính lương
function showSalaryInfo() {
    const percentage = calculateWorkPercentage();
    if (percentage > 0) {
        console.log(`Tỷ lệ công việc hoàn thành: ${percentage}%`);
    }
}

// Hàm lưu dữ liệu tạm thời (trong session hiện tại)
function saveTemporaryData() {
    const formData = {
        basicSalary: document.getElementById('basicSalary').value,
        allowance: document.getElementById('allowance').value,
        standardDays: document.getElementById('standardDays').value,
        actualDays: document.getElementById('actualDays').value,
        otherAllowance: document.getElementById('otherAllowance').value
    };
    
    // Lưu vào biến toàn cục (chỉ trong session hiện tại)
    window.tempSalaryData = formData;
}

// Hàm khôi phục dữ liệu tạm thời
function restoreTemporaryData() {
    if (window.tempSalaryData) {
        document.getElementById('basicSalary').value = window.tempSalaryData.basicSalary;
        document.getElementById('allowance').value = window.tempSalaryData.allowance;
        document.getElementById('standardDays').value = window.tempSalaryData.standardDays;
        document.getElementById('actualDays').value = window.tempSalaryData.actualDays;
        document.getElementById('otherAllowance').value = window.tempSalaryData.otherAllowance;
    }
}

// Hàm thêm hiệu ứng loading
function showLoadingState() {
    const calculateBtn = document.getElementById('calculateBtn');
    const originalText = calculateBtn.innerHTML;
    
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang tính toán...';
    calculateBtn.disabled = true;
    
    setTimeout(() => {
        calculateBtn.innerHTML = originalText;
        calculateBtn.disabled = false;
    }, 1000);
}

// Khởi tạo khi trang web load
document.addEventListener('DOMContentLoaded', function() {
    // Thêm event listeners cho buttons
    document.getElementById('calculateBtn').addEventListener('click', function() {
        showLoadingState();
        setTimeout(calculateSalary, 500);
    });
    
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    
    // Thêm event listeners cho các input
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('keypress', handleEnterKey);
        input.addEventListener('input', handleInputChange);
        input.addEventListener('blur', formatInputNumber);
        input.addEventListener('keydown', preventNegativeInput);
        
        // Lưu dữ liệu tạm thời khi có thay đổi
        input.addEventListener('change', saveTemporaryData);
    });
    
    // Focus vào trường đầu tiên
    document.getElementById('basicSalary').focus();
    
    // Thêm tooltip hoặc help text
    const tooltips = {
        'basicSalary': 'Nhập lương cơ bản hàng tháng',
        'allowance': 'Nhập phụ cấp nặng nhọc, độc hại',
        'standardDays': 'Số ngày công chuẩn trong tháng (thường là 26)',
        'actualDays': 'Số ngày bạn thực tế làm việc',
        'otherAllowance': 'Các phụ cấp khác như ăn trưa, chuyên cần, tăng ca...'
    };
    
    // Thêm placeholder động
    Object.keys(tooltips).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.setAttribute('title', tooltips[fieldId]);
        }
    });
    
    // Thêm sự kiện cuộn mượt khi click vào kết quả
    document.addEventListener('click', function(event) {
        if (event.target.closest('.result-card')) {
            event.target.closest('.result-card').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    });
    
    // Khôi phục dữ liệu nếu có
    restoreTemporaryData();
});

// Hàm xuất kết quả (có thể mở rộng để xuất PDF, Excel)
function exportResults() {
    const resultCard = document.getElementById('resultCard');
    if (resultCard.style.display === 'none') {
        alert('Vui lòng tính lương trước khi xuất kết quả!');
        return;
    }
    
    const results = {
        fullSalary: document.getElementById('fullSalary').textContent,
        dailySalary: document.getElementById('dailySalary').textContent,
        otherAllowance: document.getElementById('otherAllowanceResult').textContent,
        actualSalary: document.getElementById('actualSalary').textContent,
        timestamp: new Date().toLocaleString('vi-VN')
    };
    
    console.log('Kết quả tính lương:', results);
    // Có thể mở rộng để xuất file Excel, PDF...
}

// Hàm kiểm tra trình duyệt hỗ trợ
function checkBrowserSupport() {
    const isSupported = 'Intl' in window && 'NumberFormat' in window.Intl;
    if (!isSupported) {
        console.warn('Trình duyệt không hỗ trợ định dạng số quốc tế');
    }
    return isSupported;
}

// Khởi tạo kiểm tra trình duyệt
document.addEventListener('DOMContentLoaded', function() {
    checkBrowserSupport();
});
