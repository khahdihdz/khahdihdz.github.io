/* ============================================================
   app.js – Mua Cho Tôi Một Ly Cà Phê · khahdihdz
   SePay webhook polling + confetti
   Backend: Cloudflare Worker → Google Apps Script
   ============================================================ */

'use strict';

/* ── Config ─────────────────────────────────────────────────── */
const BANK_CODE      = '970422';        // MB Bank
const ACCOUNT_NUMBER = '8880812999';
const ACCOUNT_NAME   = 'DINH TRONG KHANH';
const PRICE_PER_CUP  = 25000;

/* Cloudflare Worker proxy URL */
const WORKER_URL = 'https://sepay-webhook.khahdihdz.workers.dev';

const POLL_INTERVAL   = 4000;   // Polling mỗi 4 giây
const POLL_TIMEOUT    = 300000; // Timeout sau 5 phút
const POLL_MAX_ERRORS = 6;      // Dừng nếu lỗi liên tiếp quá nhiều

/* ── State ──────────────────────────────────────────────────── */
let currentAmount    = 25000;
let currentNote      = '';      // note cố định theo session chọn amount
let pollTimer        = null;
let pollStart        = null;
let pollActive       = false;
let pollErrors       = 0;
let pollSessionId    = 0;       // tránh race condition khi đổi amount

/* ── Transfer note – tạo 1 lần, cố định cho lần polling đó ── */
function generateNote(amount) {
  const cups = Math.max(1, Math.round(amount / PRICE_PER_CUP));
  const templates = [
    `Cafein loading ${cups} coffee`,
    `Debug met qua ${cups} ly cafe`,
    `Code on thi thoi ${cups} coffee`,
    `Goi ${cups} ly nhe`,
    `Chay deadline ${cups} coffee`,
    `Uong cafe di cho tinh ${cups} ly`,
    `Keep building ${cups} coffee`,
    `Surprise ${cups} ly ca phe`,
    `Mua cafe uong code ${cups} ly`,
    `Tang ${cups} ly cafe nhe`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

/* ── Amount selection ───────────────────────────────────────── */
function selectAmount(amount, el) {
  currentAmount = amount;
  document.querySelectorAll('.coffee-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('customAmount').value = '';
  document.getElementById('amountWords').textContent = '';
  updateQR();
  stopPolling();
  startPolling();
}

function handleCustomInput(input) {
  const raw = input.value.replace(/\D/g, '');
  input.value = raw ? Number(raw).toLocaleString('vi-VN') : '';
  if (raw) {
    currentAmount = Number(raw);
    document.querySelectorAll('.coffee-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('amountWords').textContent = toWords(Number(raw));
    updateQR();
    stopPolling();
    startPolling();
  } else {
    document.getElementById('amountWords').textContent = '';
    stopPolling();
    hidePaymentStatus();
  }
}

/* ── QR ──────────────────────────────────────────────────────── */
function updateQR() {
  currentNote      = generateNote(currentAmount);  // tạo note mới khi đổi amount
  const img        = document.getElementById('qrImg');
  img.classList.add('loading');
  const name       = encodeURIComponent(ACCOUNT_NAME);
  const info       = encodeURIComponent(currentNote);
  img.src          = `https://api.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NUMBER}-compact2.jpg`
                   + `?accountName=${name}&amount=${currentAmount}&addInfo=${info}`;
  img.onload       = () => img.classList.remove('loading');
  img.onerror      = () => img.classList.remove('loading');
  document.getElementById('displayAmount').textContent =
    currentAmount.toLocaleString('vi-VN') + ' ₫';
  const noteEl = document.getElementById('transferNoteText');
  if (noteEl) noteEl.textContent = currentNote;
}

/* ── SePay Auto-Polling ──────────────────────────────────────── */
function startPolling() {
  if (pollActive) return;
  pollActive    = true;
  pollStart     = Date.now();
  pollErrors    = 0;
  const sid     = ++pollSessionId;  // snapshot session

  showPaymentStatus('checking',
    '<span class="spinner"></span> Đang chờ xác nhận thanh toán…',
    'Hệ thống tự động xác nhận ngay khi nhận được giao dịch.'
  );

  pollTimer = setInterval(async () => {
    // Session đã đổi (user chọn amount mới) → dừng
    if (sid !== pollSessionId) { stopPolling(); return; }

    // Timeout
    if (Date.now() - pollStart > POLL_TIMEOUT) {
      stopPolling();
      showPaymentStatus('timeout',
        '⏰ Hết thời gian chờ',
        'Nếu bạn đã chuyển khoản, giao dịch vẫn được ghi nhận. Tải lại trang để thử lại.'
      );
      return;
    }

    try {
      // Chỉ truyền amount – GAS tìm trong 10 phút gần nhất
      const url = `${WORKER_URL}?route=check-payment&amount=${currentAmount}`;
      const res = await fetch(url, {
        cache:  'no-store',
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        pollErrors++;
        if (pollErrors >= POLL_MAX_ERRORS) {
          stopPolling();
          showPaymentStatus('error',
            '⚠️ Không kết nối được server',
            'Kiểm tra lại kết nối mạng hoặc tải lại trang.'
          );
        }
        return;
      }

      pollErrors = 0;
      const data = await res.json();

      if (data.paid) {
        stopPolling();
        showPaymentStatus('success',
          '✅ Đã xác nhận thanh toán!',
          'Giao dịch được xác nhận tự động qua SePay.'
        );
        setTimeout(() => showThankYou(data.payer, data.amount || currentAmount), 600);
      }

    } catch (err) {
      pollErrors++;
      if (pollErrors >= POLL_MAX_ERRORS) {
        stopPolling();
        showPaymentStatus('error',
          '⚠️ Mất kết nối tới server',
          'Vui lòng kiểm tra mạng và tải lại trang.'
        );
      }
    }
  }, POLL_INTERVAL);
}

function stopPolling() {
  clearInterval(pollTimer);
  pollActive = false;
  pollErrors = 0;
}

/* ── Payment Status Banner ───────────────────────────────────── */
function showPaymentStatus(type, title, msg) {
  const el = document.getElementById('paymentStatus');
  el.className = `payment-status ${type}`;
  el.innerHTML = `<div class="status-title">${title}</div><div class="status-msg">${msg}</div>`;
}
function hidePaymentStatus() {
  const el = document.getElementById('paymentStatus');
  el.className = 'payment-status';
  el.innerHTML = '';
}

/* ── Thank-You Overlay ───────────────────────────────────────── */
function showThankYou(payer, amount) {
  const fmt = (n) => Number(n).toLocaleString('vi-VN') + ' ₫';
  const cups = Math.max(1, Math.round((amount || currentAmount) / PRICE_PER_CUP));

  // Title theo số tiền
  const titles = [
    'Cảm ơn bạn rất nhiều! 🙏',
    'Bạn thật tuyệt vời! ❤️',
    'Cà phê đến rồi! ☕',
    'Cảm ơn đã ủng hộ! 🎉',
  ];
  const msgs = [
    'Sự ủng hộ của bạn là nguồn động lực lớn nhất để mình tiếp tục xây dựng những dự án mới. Chúc bạn một ngày tuyệt vời!',
    `${cups} ly cà phê sẽ giúp mình code thêm ${cups * 2} tiếng đêm nay. Cảm ơn bạn thật nhiều! ☕`,
    'Với sự ủng hộ của bạn, mình sẽ cố gắng cho ra thêm nhiều dự án hay ho. Trân trọng lắm! 🚀',
    'Mỗi đồng ủng hộ đều có ý nghĩa rất lớn với mình. Cảm ơn bạn đã đồng hành! ❤️',
  ];
  const idx = Math.floor(Math.random() * titles.length);

  document.getElementById('ty-title').textContent  = titles[idx];
  document.getElementById('ty-msg').textContent    = msgs[idx];
  document.getElementById('ty-close').textContent  = 'Đóng lại ✕';
  document.getElementById('ty-amount').textContent = fmt(amount || currentAmount);

  const nameEl = document.getElementById('ty-name');
  if (payer && payer.trim()) {
    nameEl.textContent   = `👤 ${payer}`;
    nameEl.style.display = 'block';
  } else {
    nameEl.style.display = 'none';
  }

  document.getElementById('thankYouOverlay').classList.add('active');
  launchConfetti();

  // Tự đóng sau 15 giây
  clearTimeout(showThankYou._autoClose);
  showThankYou._autoClose = setTimeout(closeThankYou, 15000);
}

function closeThankYou() {
  clearTimeout(showThankYou._autoClose);
  document.getElementById('thankYouOverlay').classList.remove('active');
  stopConfetti();
}

/* ── Confetti ────────────────────────────────────────────────── */
let confettiAnim;
function launchConfetti() {
  const canvas  = document.getElementById('confettiCanvas');
  canvas.classList.add('active');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx     = canvas.getContext('2d');
  const pieces  = [];
  const colors  = ['#f5a623','#ff7c4d','#3ecf8e','#60a5fa','#c084fc','#fb7185','#fbbf24','#34d399'];

  for (let i = 0; i < 180; i++) {
    pieces.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * -canvas.height,
      w:       5 + Math.random() * 9,
      h:       3 + Math.random() * 5,
      color:   colors[Math.floor(Math.random() * colors.length)],
      vx:      (Math.random() - .5) * 3.5,
      vy:      1.5 + Math.random() * 4,
      rot:     Math.random() * 360,
      vr:      (Math.random() - .5) * 7,
      opacity: .85 + Math.random() * .15,
      shape:   Math.random() > .7 ? 'circle' : 'rect',
    });
  }

  cancelAnimationFrame(confettiAnim);
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y < canvas.height + 20) alive++;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = p.color;
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.rot * Math.PI / 180);
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });
    if (alive > 0) confettiAnim = requestAnimationFrame(draw);
    else stopConfetti();
  }
  draw();
}

function stopConfetti() {
  cancelAnimationFrame(confettiAnim);
  const canvas = document.getElementById('confettiCanvas');
  canvas.classList.remove('active');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/* ── Copy ────────────────────────────────────────────────────── */
function copyText(text, btn) {
  const doFallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
  };
  (navigator.clipboard
    ? navigator.clipboard.writeText(text).catch(doFallback)
    : Promise.resolve(doFallback())
  ).finally(() => {
    const orig = btn.innerHTML;
    btn.classList.add('copied'); btn.innerHTML = '✓';
    showToast('✓ Đã sao chép!', 'success');
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2000);
  });
}

/* ── Toast ───────────────────────────────────────────────────── */
function showToast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = 'toast'; }, 2500);
}

/* ── Number → Vietnamese words ──────────────────────────────── */
function toWords(num) {
  if (!num) return '';
  const units = ['','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
  const teens = ['mười','mười một','mười hai','mười ba','mười bốn','mười lăm',
                 'mười sáu','mười bảy','mười tám','mười chín'];
  const tens  = ['','','hai mươi','ba mươi','bốn mươi','năm mươi',
                 'sáu mươi','bảy mươi','tám mươi','chín mươi'];
  const scales = ['','nghìn','triệu','tỷ'];

  function chunk(n) {
    if (!n) return '';
    let r = '';
    const h = Math.floor(n / 100), rem = n % 100;
    if (h) r += units[h] + ' trăm' + (rem ? ' ' : '');
    if      (rem >= 10 && rem < 20) r += teens[rem - 10];
    else if (rem >= 20) {
      r += tens[Math.floor(rem / 10)];
      const o = rem % 10;
      if (o) r += ' ' + (o === 5 ? 'lăm' : (o === 1 && Math.floor(rem / 10) > 1 ? 'mốt' : units[o]));
    } else if (rem) r += (h ? 'lẻ ' : '') + units[rem];
    return r.trim();
  }

  let parts = []; let i = 0;
  while (num > 0) {
    const c = num % 1000;
    if (c) parts.unshift(chunk(c) + (i ? ' ' + scales[i] : ''));
    num = Math.floor(num / 1000); i++;
  }
  const w = parts.join(' ');
  return w.charAt(0).toUpperCase() + w.slice(1) + ' đồng';
}

/* ── Keyboard: Esc đóng overlay ─────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeThankYou();
});

/* ── Click ngoài overlay để đóng ────────────────────────────── */
document.getElementById('thankYouOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeThankYou();
});

/* ── Init ────────────────────────────────────────────────────── */
updateQR();
startPolling();
