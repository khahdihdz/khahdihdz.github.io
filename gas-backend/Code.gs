// ============================================================
//  Code.gs – SePay Webhook Backend · khahdihdz
//  Google Apps Script · Deploy as Web App
//  Sheet columns: [Thời gian | Số tiền | Nội dung | Mô tả | Mã GD | Tài khoản]
//
//  ✅ Tích hợp Telegram Bot:
//     - Gửi thông báo khi có ủng hộ mới
//     - Lệnh /stats – thống kê tổng quan
//     - Lệnh /today – thống kê hôm nay
//     - Lệnh /history – 5 giao dịch gần nhất
//     - Lệnh /help   – danh sách lệnh
// ============================================================

// ── Cấu hình chính ────────────────────────────────────────
const SHEET_ID        = 'YOUR_GOOGLE_SHEET_ID';   // ← ID Google Sheet
const SHEET_NAME      = 'Transactions';
const ACCOUNT_NUMBER  = '8880812999';
const TRANSFER_PREFIX = 'UNG HO';
const PAID_WINDOW_MS  = 10 * 60 * 1000;           // 10 phút

// ── Cấu hình Telegram ─────────────────────────────────────
const TG_BOT_TOKEN = 'YOUR_BOT_TOKEN';            // ← Token từ @BotFather
const TG_CHAT_ID   = 'YOUR_CHAT_ID';              // ← Chat ID của bạn
const TG_API       = `https://api.telegram.org/bot${TG_BOT_TOKEN}`;

// ── Helpers ────────────────────────────────────────────────
function fmtMoney(amount) {
  return Number(amount).toLocaleString('vi-VN') + ' ₫';
}

function fmtDate(date) {
  const d = new Date(date);
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function coffeeEmoji(amount) {
  if (amount >= 200000) return '👑';
  if (amount >= 100000) return '🌟';
  if (amount >= 50000)  return '☕☕';
  return '☕';
}

// ── Gửi tin nhắn Telegram ─────────────────────────────────
function sendTelegram(text, chatId) {
  const cid = chatId || TG_CHAT_ID;
  if (!TG_BOT_TOKEN || TG_BOT_TOKEN === 'YOUR_BOT_TOKEN') return;
  try {
    UrlFetchApp.fetch(`${TG_API}/sendMessage`, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: cid, text: text, parse_mode: 'HTML' }),
      muteHttpExceptions: true,
    });
  } catch (err) {
    console.error('sendTelegram error:', err);
  }
}

// ── Thông báo ủng hộ mới ──────────────────────────────────
function notifyNewDonation(amount, payer, content, txId) {
  const emoji = coffeeEmoji(amount);
  const name  = payer ? `👤 <b>${payer}</b>` : '👤 Ẩn danh';
  const cups  = Math.max(1, Math.round(amount / 25000));

  const msg = [
    `${emoji} <b>Ủng hộ mới!</b>`,
    ``,
    `💰 Số tiền: <b>${fmtMoney(amount)}</b>`,
    name,
    `📝 Nội dung: <code>${content}</code>`,
    txId ? `🔖 Mã GD: <code>${txId}</code>` : '',
    ``,
    `☕ × ${cups} ly cà phê – Cảm ơn bạn rất nhiều! ❤️`,
  ].filter(Boolean).join('\n');

  sendTelegram(msg);
}

// ── Lấy thống kê từ Sheet ─────────────────────────────────
function getStats() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

  const stats = {
    total: 0, count: 0,
    today: 0, todayCount: 0,
    thisMonth: 0, thisMonthCount: 0,
    topAmount: 0, topPayer: '',
    recent: [],
  };

  if (!sheet || sheet.getLastRow() <= 1) return stats;

  const data     = sheet.getDataRange().getValues();
  const now      = new Date();
  const todayStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
  const monthKey = `${now.getMonth()}/${now.getFullYear()}`;

  for (let i = 1; i < data.length; i++) {
    const [time, amount, content, desc] = data[i];
    const amt = Number(amount) || 0;
    if (!amt) continue;

    stats.total += amt;
    stats.count++;

    const d        = new Date(time);
    const rowDay   = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    const rowMonth = `${d.getMonth()}/${d.getFullYear()}`;

    if (rowDay   === todayStr) { stats.today += amt;     stats.todayCount++;     }
    if (rowMonth === monthKey) { stats.thisMonth += amt; stats.thisMonthCount++; }

    if (amt > stats.topAmount) {
      stats.topAmount = amt;
      stats.topPayer  = extractPayer(String(desc)) || 'Ẩn danh';
    }
  }

  stats.recent = data.slice(1).slice(-5).reverse().map(row => ({
    time:   row[0],
    amount: Number(row[1]) || 0,
    content: row[2] || '',
    desc:   row[3] || '',
  }));

  return stats;
}

// ── Các tin nhắn thống kê ─────────────────────────────────
function buildStatsMessage() {
  const s = getStats();
  if (s.count === 0) return '📊 <b>Thống kê</b>\n\nChưa có giao dịch nào. ☕';

  const avg = s.count > 0 ? Math.round(s.total / s.count) : 0;

  return [
    '📊 <b>Thống kê ủng hộ – khahdihdz</b>',
    '',
    '━━━━━━━━━━━━━━━━━━',
    '🏆 <b>Tổng cộng</b>',
    `   💰 ${fmtMoney(s.total)}`,
    `   🧾 ${s.count} giao dịch`,
    `   📈 TB: ${fmtMoney(avg)}/lần`,
    '',
    '📅 <b>Hôm nay</b>',
    `   💰 ${fmtMoney(s.today)}`,
    `   🧾 ${s.todayCount} giao dịch`,
    '',
    '🗓 <b>Tháng này</b>',
    `   💰 ${fmtMoney(s.thisMonth)}`,
    `   🧾 ${s.thisMonthCount} giao dịch`,
    '',
    s.topAmount > 0
      ? `👑 <b>Ủng hộ cao nhất:</b> ${fmtMoney(s.topAmount)}\n   👤 ${s.topPayer}`
      : '',
    '━━━━━━━━━━━━━━━━━━',
    `☕ Tổng: ×${Math.round(s.total / 25000)} ly cà phê`,
  ].filter(x => x !== '').join('\n');
}

function buildTodayMessage() {
  const s = getStats();
  return [
    `📅 <b>Hôm nay</b>`,
    '',
    `💰 Tổng thu: <b>${fmtMoney(s.today)}</b>`,
    `🧾 Số lượng: <b>${s.todayCount}</b> lần ủng hộ`,
    s.todayCount > 0
      ? `☕ Tương đương <b>${Math.round(s.today/25000)}</b> ly cà phê`
      : 'Chưa có ai ủng hộ hôm nay – mời cà phê để có thêm động lực! ☕',
  ].join('\n');
}

function buildHistoryMessage() {
  const s = getStats();
  if (s.recent.length === 0) return '📜 <b>Lịch sử</b>\n\nChưa có giao dịch nào.';

  const lines = ['📜 <b>5 ủng hộ gần nhất</b>', ''];
  s.recent.forEach((tx, i) => {
    const payer = extractPayer(tx.desc) || 'Ẩn danh';
    lines.push(
      `${i+1}. ${coffeeEmoji(tx.amount)} <b>${fmtMoney(tx.amount)}</b>`,
      `   👤 ${payer}`,
      `   🕐 ${fmtDate(tx.time)}`,
      ''
    );
  });
  return lines.join('\n').trim();
}

// ── CORS helper ────────────────────────────────────────────
function corsResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  doPost – SePay Webhook + Telegram Webhook
// ============================================================
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // ── Telegram Webhook update ────────────────────────────
    if (body.update_id !== undefined && body.message) {
      return handleTelegramUpdate(body);
    }

    // ── SePay Webhook ──────────────────────────────────────
    if (
      body.transferType !== 'in' ||
      String(body.accountNumber).replace(/\s/g, '') !== ACCOUNT_NUMBER
    ) {
      return corsResponse({ success: true, skipped: true });
    }

    const content = String(body.content || body.code || '').toUpperCase().trim();
    const amount  = Number(body.transferAmount) || 0;

    if (!content.includes(TRANSFER_PREFIX) || amount <= 0) {
      return corsResponse({ success: true, skipped: true });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Thời gian','Số tiền (VNĐ)','Nội dung','Mô tả','Mã giao dịch','Tài khoản']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date(),
      amount,
      content,
      body.description || '',
      body.transactionID || body.referenceCode || '',
      body.accountNumber || ACCOUNT_NUMBER,
    ]);

    // 🔔 Gửi thông báo Telegram
    const payer = extractPayer(String(body.description || ''));
    notifyNewDonation(amount, payer, content, body.transactionID || body.referenceCode || '');

    return corsResponse({ success: true });

  } catch (err) {
    console.error('doPost error:', err);
    return corsResponse({ success: false, error: err.message });
  }
}

// ── Xử lý lệnh Telegram ───────────────────────────────────
function handleTelegramUpdate(update) {
  const msg    = update.message;
  const chatId = String(msg.chat.id);
  const text   = String(msg.text || '').trim();
  const cmd    = text.split(' ')[0].toLowerCase().replace(/@.*$/, '');

  // Chặn người lạ (chỉ admin mới dùng được)
  if (chatId !== String(TG_CHAT_ID)) {
    sendTelegram('⛔ Bạn không có quyền dùng bot này.', chatId);
    return corsResponse({ ok: true });
  }

  switch (cmd) {
    case '/stats':   sendTelegram(buildStatsMessage(),   chatId); break;
    case '/today':   sendTelegram(buildTodayMessage(),   chatId); break;
    case '/history': sendTelegram(buildHistoryMessage(), chatId); break;
    case '/start':
    case '/help':
      sendTelegram([
        '☕ <b>Coffee Bot – khahdihdz</b>',
        '',
        'Các lệnh có sẵn:',
        '/stats   – Thống kê tổng quan',
        '/today   – Thống kê hôm nay',
        '/history – 5 giao dịch gần nhất',
        '/help    – Hướng dẫn',
        '',
        'Bot tự động thông báo mỗi khi có ủng hộ mới. ❤️',
      ].join('\n'), chatId);
      break;
    default:
      sendTelegram('❓ Lệnh không hợp lệ. Gõ /help để xem hướng dẫn.', chatId);
  }

  return corsResponse({ ok: true });
}

// ============================================================
//  doGet – Frontend polling + gửi stats qua URL
// ============================================================
function doGet(e) {
  // ?cmd=stats → gửi stats vào Telegram rồi return
  if (e.parameter.cmd === 'stats') {
    sendTelegram(buildStatsMessage());
    return corsResponse({ ok: true, sent: true });
  }

  try {
    const amount = Number(e.parameter.amount) || 0;
    if (amount <= 0) return corsResponse({ paid: false, error: 'Missing amount' });

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) return corsResponse({ paid: false });

    const data = sheet.getDataRange().getValues();
    const now  = Date.now();

    for (let i = data.length - 1; i >= 1; i--) {
      const [time, rowAmount, content, desc] = data[i];
      const txTime = new Date(time).getTime();

      if (
        Number(rowAmount) === amount &&
        String(content).toUpperCase().includes(TRANSFER_PREFIX) &&
        (now - txTime) <= PAID_WINDOW_MS
      ) {
        return corsResponse({ paid: true, amount: Number(rowAmount), payer: extractPayer(String(desc)) });
      }
    }

    return corsResponse({ paid: false });

  } catch (err) {
    console.error('doGet error:', err);
    return corsResponse({ paid: false, error: err.message });
  }
}

// ── Helper: trích tên người chuyển ────────────────────────
function extractPayer(desc) {
  if (!desc) return '';
  const m = desc.match(/(?:CT|FT)\s+TU\s+[\d]+\s+([A-Z\s]+?)\s+DEN/i);
  if (m && m[1]) return m[1].trim();
  return '';
}

// ============================================================
//  Setup Telegram Webhook (chạy 1 lần sau khi deploy GAS)
// ============================================================
function registerTelegramWebhook() {
  const gasUrl = 'YOUR_GAS_WEB_APP_URL'; // ← dán URL GAS Web App sau khi deploy
  const res = UrlFetchApp.fetch(
    `${TG_API}/setWebhook?url=${encodeURIComponent(gasUrl)}`,
    { muteHttpExceptions: true }
  );
  Logger.log(res.getContentText());
  // Kết quả thành công: {"ok":true,"result":true,...}
}

function unregisterTelegramWebhook() {
  const res = UrlFetchApp.fetch(`${TG_API}/deleteWebhook`, { muteHttpExceptions: true });
  Logger.log(res.getContentText());
}

// ── Test thủ công (chạy trong GAS editor) ─────────────────
function testNotify() {
  notifyNewDonation(25000, 'NGUYEN VAN A', 'UNG HO 1 COFFEE', 'TEST001');
}
function testStats()   { sendTelegram(buildStatsMessage()); }
function testToday()   { sendTelegram(buildTodayMessage()); }
function testHistory() { sendTelegram(buildHistoryMessage()); }

function testDoPost() {
  const fakeE = {
    postData: {
      contents: JSON.stringify({
        transferType: 'in',
        accountNumber: '8880812999',
        content: 'UNG HO 1 COFFEE',
        transferAmount: 25000,
        description: 'CT TU 0123456789 NGUYEN VAN A DEN 8880812999 UNG HO 1 COFFEE',
        transactionID: 'TEST001',
      })
    }
  };
  Logger.log(doPost(fakeE).getContent());
}

function testDoGet() {
  const fakeE = { parameter: { amount: '25000', ref: 'Ung ho 1 coffee' } };
  Logger.log(doGet(fakeE).getContent());
}
