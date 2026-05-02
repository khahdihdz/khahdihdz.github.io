/* ============================================================
   app.js – Mua Cho Tôi Một Ly Cà Phê · khahdihdz
   SePay webhook polling + confetti + i18n
   ============================================================ */

'use strict';

/* ── Config ────────────────────────────────────────────────── */
const BANK_CODE      = '970422';       // MB Bank
const ACCOUNT_NUMBER = '8880812999';
const ACCOUNT_NAME   = 'DINH TRONG KHANH';
const PRICE_PER_CUP  = 25000; // 1 ly cà phê = 25,000 VNĐ

/** Tính nội dung CK động: "Ung ho X coffee" */
function getTransferNote(amount) {
  const cups = Math.max(1, Math.round(amount / PRICE_PER_CUP));
  return `Ung ho ${cups} coffee`;
}

/* Google Apps Script Web App URL – thay bằng URL sau khi deploy Code.gs
   Xem hướng dẫn: gas-backend/SETUP.md                                    */
const SEPAY_CHECK_URL = 'https://script.google.com/macros/s/AKfycbzr17FGigacNvM9MkNIfU8xEQaejtvFZQHQcOG8-SXpdhKGBzp4unHe-0P_F3aE2r1Y/exec';

/* Bao lâu poll một lần (ms) */
const POLL_INTERVAL  = 5000;
const POLL_TIMEOUT   = 300000; // 5 phút

/* ── State ─────────────────────────────────────────────────── */
let currentAmount = 25000;
let lang          = 'vi';
let pollTimer     = null;
let pollStart     = null;
let pollActive    = false;

/* ── i18n ──────────────────────────────────────────────────── */
const translations = {
  vi: {
    mainTitle:        'Mua Cho Tôi Một Ly Cà Phê',
    mainDesc:         'Nếu những dự án của mình từng giúp ích cho bạn, một ly cà phê nhỏ sẽ là nguồn động lực rất lớn. ❤️',
    labelChoose:      'Chọn mức ủng hộ',
    qrHint:           'Quét bằng ứng dụng ngân hàng bất kỳ',
    cryptoTitle:      'Quyên góp bằng Crypto',
    footerText:       'Cảm ơn bạn đã ủng hộ! Mỗi ly cà phê giúp mình có thêm động lực để tiếp tục xây dựng những dự án mới. ❤️',
    customPlaceholder:'Hoặc nhập số tiền khác (VNĐ)',
    copied:           '✓ Đã sao chép!',
    langBtn:          'English',
    checking:         'Đang chờ xác nhận thanh toán…',
    checkingMsg:      'Hệ thống sẽ tự động xác nhận khi nhận được giao dịch.',
    paySuccess:       'Đã nhận được thanh toán!',
    paySuccessMsg:    'Giao dịch được xác nhận tự động qua SePay.',
    payFail:          'Chưa nhận được giao dịch',
    payFailMsg:       'Bạn có thể chuyển khoản thủ công rồi thử lại.',
    thankTitle:       'Cảm ơn bạn rất nhiều!',
    thankMsg:         'Sự ủng hộ của bạn giúp mình tiếp tục xây dựng những dự án mới. Chúc bạn một ngày tuyệt vời! ☕',
    thankClose:       'Đóng lại',
  },
  en: {
    mainTitle:        'Buy Me a Coffee',
    mainDesc:         'If any of my projects have ever been useful to you, a small coffee means a great deal. ❤️',
    labelChoose:      'Choose amount',
    qrHint:           'Scan with any banking app',
    cryptoTitle:      'Donate with Crypto',
    footerText:       'Thank you for your support! Every coffee keeps me motivated to build more. ❤️',
    customPlaceholder:'Or enter custom amount (VND)',
    copied:           '✓ Copied!',
    langBtn:          'Tiếng Việt',
    checking:         'Waiting for payment confirmation…',
    checkingMsg:      'The system will automatically confirm once the transaction is received.',
    paySuccess:       'Payment received!',
    paySuccessMsg:    'Transaction confirmed automatically via SePay.',
    payFail:          'Transaction not received yet',
    payFailMsg:       'You can transfer manually then try again.',
    thankTitle:       'Thank you so much!',
    thankMsg:         'Your support helps me keep building new projects. Have a wonderful day! ☕',
    thankClose:       'Close',
  }
};
const t = k => translations[lang][k] || k;

/* ── Language toggle ───────────────────────────────────────── */
function updateLanguage() {
  const tr = translations[lang];
  document.getElementById('main-title').textContent        = tr.mainTitle;
  document.getElementById('main-desc').textContent         = tr.mainDesc;
  document.getElementById('label-choose').textContent      = tr.labelChoose;
  document.getElementById('qr-hint').textContent           = tr.qrHint;
  document.getElementById('crypto-title').textContent      = tr.cryptoTitle;
  document.getElementById('footer-text').textContent       = tr.footerText;
  document.getElementById('langToggle').textContent        = tr.langBtn;
  document.getElementById('customAmount').placeholder      = tr.customPlaceholder;
  document.querySelectorAll('[data-vi][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
}

document.getElementById('langToggle').addEventListener('click', () => {
  lang = lang === 'vi' ? 'en' : 'vi';
  updateLanguage();
});

/* ── Amount selection ──────────────────────────────────────── */
function selectAmount(amount, el) {
  currentAmount = amount;
  document.querySelectorAll('.coffee-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('customAmount').value = '';
  document.getElementById('amountWords').textContent = '';
  updateQR();
  stopPolling();
  hidePaymentStatus();
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
  hidePaymentStatus();
}

/* ── QR ────────────────────────────────────────────────────── */
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
  // Cập nhật nội dung hiển thị trong bank-card
  const noteEl = document.getElementById('transferNoteText');
  if (noteEl) noteEl.textContent = note;
}

/* ── SePay Polling ─────────────────────────────────────────── */
/**
 * Bắt đầu polling SePay sau khi user nhấn "Tôi đã chuyển khoản".
 * Endpoint SEPAY_CHECK_URL cần trả về JSON:
 *   { paid: true,  amount: 25000, payer: "Nguyen Van A" }   // thành công
 *   { paid: false }                                          // chưa nhận
 */
function startPolling() {
  if (pollActive) return;
  pollActive = true;
  pollStart  = Date.now();

  showPaymentStatus('checking',
    `<span class="spinner"></span> ${t('checking')}`,
    t('checkingMsg')
  );

  pollTimer = setInterval(async () => {
    if (Date.now() - pollStart > POLL_TIMEOUT) {
      stopPolling();
      showPaymentStatus('failed', t('payFail'), t('payFailMsg'));
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
        showPaymentStatus('success', t('paySuccess'), t('paySuccessMsg'));
        setTimeout(() => showThankYou(data.payer, data.amount || currentAmount), 800);
      }
    } catch (_) {
      /* network error – keep trying */
    }
  }, POLL_INTERVAL);
}

function stopPolling() {
  clearInterval(pollTimer);
  pollActive = false;
}

/* ── Payment Status Banner ─────────────────────────────────── */
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

/* ── Thank-You Overlay ─────────────────────────────────────── */
function showThankYou(payer, amount) {
  document.getElementById('ty-title').textContent  = t('thankTitle');
  document.getElementById('ty-msg').textContent    = t('thankMsg');
  document.getElementById('ty-close').textContent  = t('thankClose');
  document.getElementById('ty-amount').textContent =
    (amount || currentAmount).toLocaleString('vi-VN') + ' ₫';
  if (payer) {
    document.getElementById('ty-name').textContent = `👤 ${payer}`;
    document.getElementById('ty-name').style.display = 'block';
  } else {
    document.getElementById('ty-name').style.display = 'none';
  }
  document.getElementById('thankYouOverlay').classList.add('active');
  launchConfetti();
}

function closeThankYou() {
  document.getElementById('thankYouOverlay').classList.remove('active');
  stopConfetti();
}

/* ── Confetti ──────────────────────────────────────────────── */
let confettiAnim;
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  canvas.classList.add('active');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx     = canvas.getContext('2d');
  const pieces  = [];
  const colors  = ['#f5a623','#ff7c4d','#3ecf8e','#60a5fa','#c084fc','#fb7185'];

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
      p.x  += p.vx; p.y += p.vy; p.rot += p.vr;
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

/* ── Copy ──────────────────────────────────────────────────── */
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
    showToast(t('copied'), 'success');
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2000);
  });
}

/* ── Toast ─────────────────────────────────────────────────── */
function showToast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = 'toast'; }, 2500);
}

/* ── Number → Vietnamese words ─────────────────────────────── */
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

  let parts=[]; let i=0;
  while (num>0) {
    const c = num%1000;
    if (c) parts.unshift(chunk(c) + (i ? ' '+scales[i] : ''));
    num = Math.floor(num/1000); i++;
  }
  const w = parts.join(' ');
  return w.charAt(0).toUpperCase() + w.slice(1) + ' đồng';
}

/* ── Init ──────────────────────────────────────────────────── */
updateQR();
