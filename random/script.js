// Khởi tạo dữ liệu
let items = ['Giải 1', 'Giải 2', 'Giải 3', 'Giải 4', 'Giải 5', 'Giải 6'];
let itemWeights = {}; // Lưu trọng số cho mỗi item (xác suất 1:1000000)
let isSpinning = false;
let currentRotation = 0;

// Khởi tạo trọng số mặc định cho các item ban đầu
items.forEach(item => {
    itemWeights[item] = 1; // Mỗi item có trọng số bằng nhau
});

// Màu sắc cho vòng quay
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E63946', '#A8DADC'
];

// Canvas setup
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 220;

// Elements
const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const spinBtn = document.getElementById('spinBtn');
const itemsList = document.getElementById('itemsList');
const result = document.getElementById('result');
const resultText = document.getElementById('resultText');
const modalResultText = document.getElementById('modalResultText');

// Bootstrap Modal
let resultModal;
document.addEventListener('DOMContentLoaded', function() {
    resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
});

// Vẽ vòng quay
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (items.length === 0) {
        ctx.fillStyle = '#ddd';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#666';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Chưa có mục nào', centerX, centerY);
        return;
    }
    
    const anglePerItem = (2 * Math.PI) / items.length;
    
    items.forEach((item, index) => {
        const startAngle = index * anglePerItem + currentRotation;
        const endAngle = startAngle + anglePerItem;
        
        // Vẽ phần vòng
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Vẽ text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerItem / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(item, radius / 1.5, 5);
        ctx.restore();
    });
    
    // Vẽ tâm vòng quay
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Cập nhật danh sách
function updateList() {
    itemsList.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <span>${item}</span>
            <button class="btn btn-sm btn-danger btn-remove" onclick="removeItem(${index})">Xóa</button>
        `;
        itemsList.appendChild(li);
    });
    drawWheel();
}

// Thêm mục
function addItem() {
    const value = itemInput.value.trim();
    if (value) {
        items.push(value);
        itemWeights[value] = 1; // Trọng số mặc định
        itemInput.value = '';
        updateList();
    }
}

// Xóa mục
function removeItem(index) {
    const removedItem = items[index];
    delete itemWeights[removedItem];
    items.splice(index, 1);
    updateList();
}

// Xóa tất cả
function clearAll() {
    if (confirm('Bạn có chắc muốn xóa tất cả?')) {
        items = [];
        itemWeights = {};
        updateList();
        result.style.display = 'none';
    }
}

// Thuật toán chọn ngẫu nhiên với trọng số (xác suất 1:1,000,000)
function weightedRandomSelection() {
    // Tạo mảng với tổng 1,000,000 phần tử
    const totalParts = 1000000;
    const weightedArray = [];
    
    // Tính tổng trọng số
    const totalWeight = Object.values(itemWeights).reduce((sum, weight) => sum + weight, 0);
    
    // Phân bổ số phần cho mỗi item dựa trên trọng số
    items.forEach(item => {
        const parts = Math.floor((itemWeights[item] / totalWeight) * totalParts);
        for (let i = 0; i < parts; i++) {
            weightedArray.push(item);
        }
    });
    
    // Bù đắp phần còn lại (do làm tròn)
    while (weightedArray.length < totalParts) {
        weightedArray.push(items[Math.floor(Math.random() * items.length)]);
    }
    
    // Chọn ngẫu nhiên từ mảng đã trọng số hóa
    const randomIndex = Math.floor(Math.random() * weightedArray.length);
    return weightedArray[randomIndex];
}

// Hiệu ứng pháo hoa
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.position = 'fixed';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Quay vòng
function spin() {
    if (isSpinning || items.length === 0) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    result.style.display = 'none';
    
    // Chọn kết quả trước khi quay bằng thuật toán trọng số
    const selectedItem = weightedRandomSelection();
    const selectedIndex = items.indexOf(selectedItem);
    
    // Tính toán góc quay để dừng đúng vị trí
    const anglePerItem = (2 * Math.PI) / items.length;
    const targetAngle = selectedIndex * anglePerItem;
    
    // Số vòng quay (8-12 vòng để tạo hiệu ứng kịch tính)
    const spins = 8 + Math.random() * 4;
    const totalRotation = spins * 360 * (Math.PI / 180);
    
    // Điều chỉnh để dừng chính xác tại item được chọn
    // Mũi tên ở trên (góc π/2), cần tính toán để item dừng đúng dưới mũi tên
    const finalRotation = totalRotation - targetAngle + (Math.PI / 2);
    
    const duration = 5000; // 5 giây cho animation mượt hơn
    const startTime = Date.now();
    const startRotation = currentRotation;
    
    function animate() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic) - chậm dần tự nhiên
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        currentRotation = startRotation + finalRotation * easeOut;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Hiển thị kết quả
            resultText.textContent = selectedItem;
            modalResultText.textContent = selectedItem;
            result.style.display = 'block';
            
            // Hiệu ứng pháo hoa
            createConfetti();
            
            // Hiển thị modal sau 500ms
            setTimeout(() => {
                resultModal.show();
            }, 500);
            
            isSpinning = false;
            spinBtn.disabled = false;
        }
    }
    
    animate();
}

// Event listeners
addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});
clearBtn.addEventListener('click', clearAll);
spinBtn.addEventListener('click', spin);

// Khởi tạo
updateList();