/* ============================================================
   app.js – Mua Cho Tôi Một Ly Cà Phê · khahdihdz
   SePay webhook polling + confetti
   ============================================================ */

'use strict';

/* ── Config ─────────────────────────────────────────────────── */
const BANK_CODE      = '970422';       // MB Bank
const ACCOUNT_NUMBER = '8880812999';
const ACCOUNT_NAME   = 'DINH TRONG KHANH';
const PRICE_PER_CUP  = 25000;

/* Render.com backend – thay bằng URL thực sau khi deploy */
const SEPAY_CHECK_URL = 'https://sepay-backend-khahdihdz.onrender.com/check-payment';

const POLL_INTERVAL = 5000;
const POLL_TIMEOUT  = 300000; // 5 phút

/* ── State ──────────────────────────────────────────────────── */
let currentAmount = 25000;
let pollTimer     = null;
let pollStart     = null;
let pollActive    = false;

/* ── Helpers ─────────────────────────────────────────────────── */
function getTransferNote(amount) {
  const cups = Math.max(1, Math.round(amount / PRICE_PER_CUP));
  return `Ung ho ${cups} coffee`;
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
  } else {
    document.getElementById('amountWords').textContent = '';
  }
  stopPolling();
  if (raw) startPolling();
  else hidePaymentStatus();
}

/* ── QR ──────────────────────────────────────────────────────── */
function updateQR() {
  const img  = document.getElementById('qrImg');
  img.classList.add('loading');
  const note = getTransferNote(currentAmount);
  const name = encodeURIComponent(ACCOUNT_NAME);
  const info = encodeURIComponent(note);
  img.src    = `https://api.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NUMBER}-compact2.jpg`
             + `?accountName=${name}&amount=${currentAmount}&addInfo=${info}`;
  img.onload = () => img.classList.remove('loading');
  document.getElementById('displayAmount').textContent =
    currentAmount.toLocaleString('vi-VN') + ' ₫';
  const noteEl = document.getElementById('transferNoteText');
  if (noteEl) noteEl.textContent = note;
}

/* ── SePay Auto-Polling ──────────────────────────────────────── */
function startPolling() {
  if (pollActive) return;
  pollActive = true;
  pollStart  = Date.now();

  showPaymentStatus('checking',
    `<span class="spinner"></span> Đang chờ xác nhận thanh toán…`,
    'Hệ thống sẽ tự động xác nhận khi nhận được giao dịch.'
  );

  pollTimer = setInterval(async () => {
    if (Date.now() - pollStart > POLL_TIMEOUT) {
      stopPolling();
      hidePaymentStatus();
      return;
    }
    try {
      const res  = await fetch(
        `${SEPAY_CHECK_URL}?amount=${currentAmount}&ref=${encodeURIComponent(getTransferNote(currentAmount))}`,
        { cache: 'no-store' }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.paid) {
        stopPolling();
        showPaymentStatus('success', 'Đã nhận được thanh toán!',
          'Giao dịch được xác nhận tự động qua SePay.');
        setTimeout(() => showThankYou(data.payer, data.amount || currentAmount), 800);
      }
    } catch (_) { /* network error – keep trying */ }
  }, POLL_INTERVAL);
}

function stopPolling() {
  clearInterval(pollTimer);
  pollActive = false;
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
  document.getElementById('ty-title').textContent  = 'Cảm ơn bạn rất nhiều!';
  document.getElementById('ty-msg').textContent    = 'Sự ủng hộ của bạn giúp mình tiếp tục xây dựng những dự án mới. Chúc bạn một ngày tuyệt vời! ☕';
  document.getElementById('ty-close').textContent  = 'Đóng lại';
  document.getElementById('ty-amount').textContent =
    (amount || currentAmount).toLocaleString('vi-VN') + ' ₫';
  const nameEl = document.getElementById('ty-name');
  if (payer) {
    nameEl.textContent   = `👤 ${payer}`;
    nameEl.style.display = 'block';
  } else {
    nameEl.style.display = 'none';
  }
  document.getElementById('thankYouOverlay').classList.add('active');
  launchConfetti();
}

function closeThankYou() {
  document.getElementById('thankYouOverlay').classList.remove('active');
  stopConfetti();
}

/* ── Confetti ────────────────────────────────────────────────── */
let confettiAnim;
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  canvas.classList.add('active');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx    = canvas.getContext('2d');
  const pieces = [];
  const colors = ['#f5a623','#ff7c4d','#3ecf8e','#60a5fa','#c084fc','#fb7185'];

  for (let i = 0; i < 140; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - .5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      vr: (Math.random() - .5) * 6,
      opacity: .9 + Math.random() * .1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y < canvas.height + 20) alive++;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x + p.w/2, p.y + p.h/2);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
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
    const h = Math.floor(n/100), rem = n%100;
    if (h) r += units[h] + ' trăm' + (rem ? ' ' : '');
    if      (rem>=10 && rem<20) r += teens[rem-10];
    else if (rem>=20) {
      r += tens[Math.floor(rem/10)];
      const o = rem%10;
      if (o) r += ' ' + (o===5 ? 'lăm' : (o===1 && Math.floor(rem/10)>1 ? 'mốt' : units[o]));
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

/* ── Init ────────────────────────────────────────────────────── */
updateQR();
startPolling();
