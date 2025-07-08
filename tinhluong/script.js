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

// Biến toàn cục để lưu trữ phụ cấp tùy chỉnh và khấu trừ
let customAllowances = [];
let deductions = [];

// Hàm tạo ID ngẫu nhiên
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Hàm thêm phụ cấp tùy chỉnh
function addCustomAllowance() {
    const id = generateId();
    const allowanceItem = {
        id: id,
        name: '',
        amount: 0
    };
    
    customAllowances.push(allowanceItem);
    renderCustomAllowances();
    
    // Focus vào trường tên mới thêm
    setTimeout(() => {
        document.getElementById(`customAllowanceName_${id}`).focus();
    }, 100);
}

// Hàm render phụ cấp tùy chỉnh
function renderCustomAllowances() {
    const container = document.getElementById('customAllowancesList');
    container.innerHTML = '';
    
    customAllowances.forEach(allowance => {
        const itemHtml = `
            <div class="custom-item mb-2" id="customAllowance_${allowance.id}">
                <div class="row">
                    <div class="col-6">
                        <input type="text" class="form-control form-control-sm" 
                               id="customAllowanceName_${allowance.id}"
                               placeholder="Tên phụ cấp" 
                               value="${allowance.name}"
                               onchange="updateCustomAllowance('${allowance.id}', 'name', this.value)">
                    </div>
                    <div class="col-5">
                        <input type="number" class="form-control form-control-sm" 
                               id="customAllowanceAmount_${allowance.id}"
                               placeholder="Số tiền" 
                               value="${allowance.amount}"
                               onchange="updateCustomAllowance('${allowance.id}', 'amount', this.value)"
                               onkeydown="preventNegativeInput(event)">
                    </div>
                    <div class="col-1">
                        <button type="button" class="btn btn-outline-danger btn-sm" 
                                onclick="removeCustomAllowance('${allowance.id}')"
                                title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });
}

// Hàm cập nhật phụ cấp tùy chỉnh
function updateCustomAllowance(id, field, value) {
    const allowance = customAllowances.find(item => item.id === id);
    if (allowance) {
        if (field === 'amount') {
            allowance[field] = parseFloat(value) || 0;
        } else {
            allowance[field] = value;
        }
        saveTemporaryData();
    }
}

// Hàm xóa phụ cấp tùy chỉnh
function removeCustomAllowance(id) {
    customAllowances = customAllowances.filter(item => item.id !== id);
    renderCustomAllowances();
    saveTemporaryData();
}

// Hàm thêm khấu trừ
function addDeduction() {
    const id = generateId();
    const deductionItem = {
        id: id,
        name: '',
        amount: 0
    };
    
    deductions.push(deductionItem);
    renderDeductions();
    
    // Focus vào trường tên mới thêm
    setTimeout(() => {
        document.getElementById(`deductionName_${id}`).focus();
    }, 100);
}

// Hàm render khấu trừ
function renderDeductions() {
    const container = document.getElementById('deductionsList');
    container.innerHTML = '';
    
    deductions.forEach(deduction => {
        const itemHtml = `
            <div class="custom-item mb-2" id="deduction_${deduction.id}">
                <div class="row">
                    <div class="col-6">
                        <input type="text" class="form-control form-control-sm" 
                               id="deductionName_${deduction.id}"
                               placeholder="Tên khấu trừ" 
                               value="${deduction.name}"
                               onchange="updateDeduction('${deduction.id}', 'name', this.value)">
                    </div>
                    <div class="col-5">
                        <input type="number" class="form-control form-control-sm" 
                               id="deductionAmount_${deduction.id}"
                               placeholder="Số tiền" 
                               value="${deduction.amount}"
                               onchange="updateDeduction('${deduction.id}', 'amount', this.value)"
                               onkeydown="preventNegativeInput(event)">
                    </div>
                    <div class="col-1">
                        <button type="button" class="btn btn-outline-danger btn-sm" 
                                onclick="removeDeduction('${deduction.id}')"
                                title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });
}

// Hàm cập nhật khấu trừ
function updateDeduction(id, field, value) {
    const deduction = deductions.find(item => item.id === id);
    if (deduction) {
        if (field === 'amount') {
            deduction[field] = parseFloat(value) || 0;
        } else {
            deduction[field] = value;
        }
        saveTemporaryData();
    }
}

// Hàm xóa khấu trừ
function removeDeduction(id) {
    deductions = deductions.filter(item => item.id !== id);
    renderDeductions();
    saveTemporaryData();
}

// Hàm tính tổng phụ cấp tùy chỉnh
function calculateCustomAllowanceTotal() {
    return customAllowances.reduce((total, allowance) => total + allowance.amount, 0);
}

// Hàm tính tổng khấu trừ
function calculateDeductionTotal() {
    return deductions.reduce((total, deduction) => total + deduction.amount, 0);
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
    
    // Tính tổng phụ cấp tùy chỉnh và khấu trừ
    const customAllowanceTotal = calculateCustomAllowanceTotal();
    const deductionTotal = calculateDeductionTotal();
    
    // Tính toán
    const fullSalary = basicSalary + allowance; // Tổng lương đủ công
    const dailySalary = fullSalary / standardDays; // Lương 1 ngày
    const salaryByDays = dailySalary * actualDays; // Lương theo ngày công
    const totalAllowances = otherAllowance + customAllowanceTotal; // Tổng phụ cấp
    const actualSalary = salaryByDays + totalAllowances - deductionTotal; // Lương thực nhận
    
    // Hiển thị kết quả
    document.getElementById('fullSalary').textContent = formatCurrency(fullSalary);
    document.getElementById('dailySalary').textContent = formatCurrency(dailySalary);
    document.getElementById('otherAllowanceResult').textContent = formatCurrency(otherAllowance);
    document.getElementById('customAllowanceTotal').textContent = formatCurrency(customAllowanceTotal);
    document.getElementById('deductionTotal').textContent = formatCurrency(deductionTotal);
    document.getElementById('actualSalary').textContent = formatCurrency(actualSalary);
    
    // Tạo các bước tính toán
    let stepsHtml = `
        <div class="step-item">
            <strong>Bước 1:</strong> Tính tổng lương đủ công = Lương cơ bản + Phụ cấp nặng nhọc<br>
            = ${formatCurrency(basicSalary)} + ${formatCurrency(allowance)} = ${formatCurrency(fullSalary)}
        </div>
        <div class="step-item">
            <strong>Bước 2:</strong> Tính lương 1 ngày = Tổng lương đủ công ÷ Số ngày công chuẩn<br>
            = ${formatCurrency(fullSalary)} ÷ ${formatNumber(standardDays)} = ${formatCurrency(dailySalary)}
        </div>
        <div class="step-item">
            <strong>Bước 3:</strong> Tính lương theo ngày công thực tế = Lương 1 ngày × Số ngày làm thực tế<br>
            = ${formatCurrency(dailySalary)} × ${formatNumber(actualDays)} = ${formatCurrency(salaryByDays)}
        </div>
    `;
    
    // Thêm bước tính phụ cấp nếu có
    if (totalAllowances > 0) {
        stepsHtml += `
            <div class="step-item">
                <strong>Bước 4:</strong> Tính tổng phụ cấp = Phụ cấp khác + Phụ cấp tùy chỉnh<br>
                = ${formatCurrency(otherAllowance)} + ${formatCurrency(customAllowanceTotal)} = ${formatCurrency(totalAllowances)}
            </div>
        `;
    }
    
    // Thêm bước tính khấu trừ nếu có
    if (deductionTotal > 0) {
        stepsHtml += `
            <div class="step-item">
                <strong>Bước ${totalAllowances > 0 ? '5' : '4'}:</strong> Tính tổng khấu trừ = ${formatCurrency(deductionTotal)}
            </div>
        `;
    }
    
    // Bước cuối cùng
    const lastStep = (totalAllowances > 0 ? 1 : 0) + (deductionTotal > 0 ? 1 : 0) + 4;
    stepsHtml += `
        <div class="step-item">
            <strong>Bước ${lastStep}:</strong> Tính lương thực nhận = Lương theo ngày công + Tổng phụ cấp - Tổng khấu trừ<br>
            = ${formatCurrency(salaryByDays)} + ${formatCurrency(totalAllowances)} - ${formatCurrency(deductionTotal)} = ${formatCurrency(actualSalary)}
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
    // Reset các giá trị về 0
    document.getElementById('basicSalary').value = '0';
    document.getElementById('allowance').value = '0';
    document.getElementById('standardDays').value = '0';
    document.getElementById('actualDays').value = '0';
    document.getElementById('otherAllowance').value = '0';
    
    // Reset phụ cấp tùy chỉnh và khấu trừ
    customAllowances = [];
    deductions = [];
    renderCustomAllowances();
    renderDeductions();
    
    // Ẩn tất cả lỗi
    hideAllErrors();
    
    // Ẩn kết quả
    document.getElementById('resultCard').style.display = 'none';
    
    // Xóa dữ liệu tạm thời
    window.tempSalaryData = null;
    
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
    saveTemporaryData();
}

// Hàm định dạng input số khi nhập
function formatInputNumber(event) {
    const value = event.target.value;
    if (value && !isNaN(value)) {
        // Có thể thêm logic định dạng số khi nhập ở đây
        saveTemporaryData();
    }
}

// Hàm kiểm tra số âm
function preventNegativeInput(event) {
    const key = event.key;
    if (key === '-' || key === 'e' || key === 'E') {
        event.preventDefault();
    }
}

// Hàm lưu dữ liệu tạm thời (trong session hiện tại)
function saveTemporaryData() {
    const basicSalaryEl = document.getElementById('basicSalary');
    const allowanceEl = document.getElementById('allowance');
    const standardDaysEl = document.getElementById('standardDays');
    const actualDaysEl = document.getElementById('actualDays');
    const otherAllowanceEl = document.getElementById('otherAllowance');
    
    if (basicSalaryEl && allowanceEl && standardDaysEl && actualDaysEl && otherAllowanceEl) {
        const formData = {
            basicSalary: basicSalaryEl.value,
            allowance: allowanceEl.value,
            standardDays: standardDaysEl.value,
            actualDays: actualDaysEl.value,
            otherAllowance: otherAllowanceEl.value,
            customAllowances: customAllowances,
            deductions: deductions
        };
        
        // Lưu vào biến toàn cục (chỉ trong session hiện tại)
        window.tempSalaryData = formData;
    }
}

// Hàm khôi phục dữ liệu tạm thời
function restoreTemporaryData() {
    if (window.tempSalaryData) {
        const data = window.tempSalaryData;
        
        // Khôi phục các giá trị cơ bản
        document.getElementById('basicSalary').value = data.basicSalary || '0';
        document.getElementById('allowance').value = data.allowance || '0';
        document.getElementById('standardDays').value = data.standardDays || '0';
        document.getElementById('actualDays').value = data.actualDays || '0';
        document.getElementById('otherAllowance').value = data.otherAllowance || '0';
        
        // Khôi phục phụ cấp tùy chỉnh và khấu trừ
        customAllowances = data.customAllowances || [];
        deductions = data.deductions || [];
        
        renderCustomAllowances();
        renderDeductions();
    }
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Hàm khởi tạo các sự kiện
function initializeEvents() {
    // Sự kiện cho nút tính lương
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSalary);
    }
    
    // Sự kiện cho nút reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }
    
    // Sự kiện cho nút thêm phụ cấp tùy chỉnh
    const addCustomAllowanceBtn = document.getElementById('addCustomAllowance');
    if (addCustomAllowanceBtn) {
        addCustomAllowanceBtn.addEventListener('click', addCustomAllowance);
    }
    
    // Sự kiện cho nút thêm khấu trừ
    const addDeductionBtn = document.getElementById('addDeduction');
    if (addDeductionBtn) {
        addDeductionBtn.addEventListener('click', addDeduction);
    }
    
    // Sự kiện cho các input chính
    const mainInputs = ['basicSalary', 'allowance', 'standardDays', 'actualDays', 'otherAllowance'];
    mainInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', handleInputChange);
            input.addEventListener('keydown', handleEnterKey);
            input.addEventListener('keydown', preventNegativeInput);
            input.addEventListener('blur', formatInputNumber);
        }
    });
    
    // Sự kiện cho form
    const form = document.getElementById('salaryForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            calculateSalary();
        });
    }
}

// Hàm khởi tạo ứng dụng
function initializeApp() {
    // Khởi tạo các sự kiện
    initializeEvents();
    
    // Khôi phục dữ liệu tạm thời nếu có
    restoreTemporaryData();
    
    // Render các danh sách ban đầu
    renderCustomAllowances();
    renderDeductions();
    
    // Focus vào trường đầu tiên
    const firstInput = document.getElementById('basicSalary');
    if (firstInput) {
        firstInput.focus();
    }
}

// Chạy khi DOM đã load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Xử lý khi trang sắp đóng/tải lại
window.addEventListener('beforeunload', function() {
    saveTemporaryData();
});