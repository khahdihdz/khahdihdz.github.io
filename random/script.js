// script.js - JS riêng, không gộp
// Chú thích tiếng Việt trong file

// Data model: mảng chứa các giá trị
let items = [];

// DOM
const valueInput = document.getElementById('valueInput');
const addBtn = document.getElementById('addBtn');
const bulkTextarea = document.getElementById('bulkTextarea');
const bulkAddBtn = document.getElementById('bulkAddBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const tagsDiv = document.getElementById('tags');
const countBadge = document.getElementById('countBadge');
const spinBtn = document.getElementById('spinBtn');
const pickCount = document.getElementById('pickCount');
const speedRange = document.getElementById('speedRange');
const speedLabel = document.getElementById('speedLabel');
const resultList = document.getElementById('resultList');
const subText = document.getElementById('subText');
const copyResult = document.getElementById('copyResult');
const resetSelection = document.getElementById('resetSelection');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importModal = new bootstrap.Modal(document.getElementById('importModal'));
const importTextarea = document.getElementById('importTextarea');
const confirmImport = document.getElementById('confirmImport');
const wheel = document.getElementById('wheel');

// Cập nhật hiển thị số lượng
function updateCount() {
  countBadge.textContent = items.length;
}

// Tạo 1 tag HTML cho item
function createTag(value, index) {
  const span = document.createElement('span');
  span.className = 'tag-item';
  span.dataset.index = index;
  span.innerHTML = `${escapeHtml(value)} <button type="button" class="btn btn-sm btn-link p-0 ms-2 remove-btn" title="Xóa">&times;</button>`;
  return span;
}

// render danh sách tags
function renderTags() {
  tagsDiv.innerHTML = '';
  items.forEach((v, i) => {
    const tag = createTag(v, i);
    tagsDiv.appendChild(tag);
  });
  updateCount();
}

// escape html an toàn
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Thêm 1 giá trị
addBtn.addEventListener('click', () => {
  const v = valueInput.value.trim();
  if (!v) return;
  items.push(v);
  valueInput.value = '';
  renderTags();
});

// Thêm nhiều từ textarea (mỗi dòng 1 giá trị)
bulkAddBtn.addEventListener('click', () => {
  const raw = bulkTextarea.value;
  if (!raw.trim()) return;
  const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  items.push(...lines);
  bulkTextarea.value = '';
  renderTags();
});

// Xóa tất cả
clearAllBtn.addEventListener('click', () => {
  if (!confirm('Xóa toàn bộ giá trị?')) return;
  items = [];
  renderTags();
  resultList.textContent = '';
  subText.textContent = 'Kết quả sẽ hiển thị ở đây';
});

// click vào nút xóa trên tag (delegation)
tagsDiv.addEventListener('click', (e) => {
  if (e.target.matches('.remove-btn')) {
    const tag = e.target.closest('.tag-item');
    const idx = Number(tag.dataset.index);
    items.splice(idx, 1);
    renderTags();
  }
});

// spin button - main
spinBtn.addEventListener('click', async () => {
  if (items.length === 0) {
    alert('Chưa có giá trị nào để quay.');
    return;
  }

  const count = Math.max(1, Math.floor(Number(pickCount.value) || 1));
  const speed = Math.max(100, Number(speedRange.value) || 400);
  spinBtn.disabled = true;
  wheel.classList.add('spinning');

  // copy items and shuffle repeatedly for animation
  const available = [...items];
  const results = [];

  // animation: highlight tag vài lần trước khi chọn
  const totalFlashes = 20; // số lần highlight tổng
  for (let t = 0; t < totalFlashes; t++) {
    // chọn random index để highlight
    const i = Math.floor(Math.random() * Math.max(1, available.length));
    // render highlight
    highlightTemp(i);
    await sleep(Math.max(60, speed / (1 + t * 0.08)));
    clearTempHighlight();
  }

  // Thực tế chọn 'count' mục khác nhau nếu có thể
  const pool = [...available];
  for (let k = 0; k < count; k++) {
    if (pool.length === 0) break;
    const idx = Math.floor(Math.random() * pool.length);
    const picked = pool.splice(idx, 1)[0];
    results.push(picked);
    // hiển thị incremental
    resultList.textContent = results.join(' , ');
    await sleep(120);
  }

  // animate final highlight: tìm tag(s) và tô
  highlightFinal(results);
  subText.textContent = `Đã chọn ${results.length} mục`;
  spinBtn.disabled = false;
  wheel.classList.remove('spinning');
});

// helper sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// highlight tạm (animation) - hiển thị bằng cách thêm class vào tag element nếu có
function highlightTemp(idx) {
  clearTempHighlight();
  const tag = tagsDiv.children[idx];
  if (tag) tag.classList.add('tag-highlight');
}

// clear temp
function clearTempHighlight() {
  for (const c of tagsDiv.children) {
    c.classList.remove('tag-highlight');
  }
}

// highlight final: highlight tất cả tag khớp với kết quả
function highlightFinal(results) {
  // xóa highlight trước
  clearTempHighlight();
  for (const c of tagsDiv.children) {
    // text trong tag (lúc trước đã escapeHtml), nên so sánh bằng dataset index
    const idx = Number(c.dataset.index);
    const val = items[idx];
    if (results.includes(val)) {
      c.classList.add('tag-highlight');
    }
  }
}

// copy kết quả
copyResult.addEventListener('click', () => {
  if (!resultList.textContent.trim()) {
    alert('Chưa có kết quả để sao chép.');
    return;
  }
  navigator.clipboard?.writeText(resultList.textContent).then(() => {
    alert('Đã sao chép kết quả vào bộ nhớ tạm.');
  }, () => {
    alert('Không thể sao chép — trình duyệt không hỗ trợ.');
  });
});

// reset highlight selection
resetSelection.addEventListener('click', () => {
  clearTempHighlight();
  resultList.textContent = '';
  subText.textContent = 'Kết quả sẽ hiển thị ở đây';
});

// export JSON (download)
exportBtn.addEventListener('click', () => {
  if (items.length === 0) {
    alert('Không có gì để xuất.');
    return;
  }
  const blob = new Blob([JSON.stringify(items, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'random-values.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// import modal
importBtn.addEventListener('click', () => {
  importTextarea.value = '';
  importModal.show();
});

// confirm import từ modal
confirmImport.addEventListener('click', () => {
  const raw = importTextarea.value.trim();
  if (!raw) return;
  try {
    if (raw.startsWith('[')) {
      // JSON array
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        items.push(...parsed.map(String));
      } else {
        alert('JSON phải là mảng.');
      }
    } else {
      // mỗi dòng 1 giá trị
      const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      items.push(...lines);
    }
    renderTags();
  } catch (err) {
    alert('Không parse được nội dung. Hãy dùng JSON array hoặc mỗi dòng 1 giá trị.');
  }
});

// cập nhật label tốc độ
speedRange.addEventListener('input', () => {
  speedLabel.textContent = speedRange.value;
});

// khởi tạo
renderTags();
speedLabel.textContent = speedRange.value;