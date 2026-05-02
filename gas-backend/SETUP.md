# Hướng dẫn deploy Google Apps Script + Telegram Bot

---

## Bước 1 – Tạo Google Sheet

1. Vào https://sheets.google.com → **Tạo bảng tính mới**
2. Đặt tên tab đầu tiên là **`Transactions`**
3. Copy **Sheet ID** từ URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

---

## Bước 2 – Tạo Telegram Bot

1. Nhắn tin cho **@BotFather** trên Telegram
2. Gõ `/newbot` → đặt tên bot (vd: `khahdihdzCoffeeBot`)
3. Copy **Bot Token** — dạng: `1234567890:ABCdefGHI...`
4. Lấy **Chat ID** của bạn:
   - Nhắn tin cho **@userinfobot** → nó trả về `Id: 123456789`
   - Nếu dùng group: thêm bot vào group, dùng getUpdates để lấy chat_id (số âm)

---

## Bước 3 – Tạo Google Apps Script

1. Vào https://script.google.com → **Dự án mới**
2. Đặt tên: `coffee-webhook`
3. Paste toàn bộ nội dung file **`Code.gs`** vào
4. Điền 3 hằng số:
   ```js
   const SHEET_ID     = 'YOUR_GOOGLE_SHEET_ID';
   const TG_BOT_TOKEN = 'YOUR_BOT_TOKEN';
   const TG_CHAT_ID   = 'YOUR_CHAT_ID';
   ```
5. **Lưu** (Ctrl+S)

---

## Bước 4 – Deploy Web App

1. **Triển khai** → **Triển khai mới** → chọn **Ứng dụng web**
2. Cấu hình:
   - Thực thi: `Tôi`
   - Quyền truy cập: `Mọi người` ← bắt buộc
3. Copy **URL Web App** (dạng `...macros/s/AKfycb.../exec`)

---

## Bước 5 – Đăng ký Telegram Webhook (chạy 1 lần)

1. Trong `Code.gs`, điền URL vào hàm:
   ```js
   function registerTelegramWebhook() {
     const gasUrl = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
2. Trong GAS editor, chạy hàm **`registerTelegramWebhook()`**
3. Log thành công: `{"ok":true,"result":true,"description":"Webhook was set"}`

> **Lưu ý:** GAS Web App nhận cả SePay POST và Telegram webhook trên cùng 1 URL.
> Code tự phân biệt dựa vào cấu trúc body JSON.

---

## Bước 6 – Cấu hình SePay Webhook

1. Đăng nhập https://sepay.vn
2. Vào **Tài khoản ngân hàng** → MB Bank `8880812999`
3. **Webhook URL**: dán URL từ Bước 4 → Lưu và bật

---

## Bước 7 – Cập nhật app.js

```js
const SEPAY_CHECK_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

---

## Kiểm tra

| Hàm test              | Kết quả mong đợi                                |
|-----------------------|-------------------------------------------------|
| `testNotify()`        | Bot gửi tin nhắn thông báo ủng hộ vào Telegram  |
| `testStats()`         | Bot gửi tin nhắn thống kê tổng quan             |
| `testToday()`         | Bot gửi thống kê hôm nay                        |
| `testHistory()`       | Bot gửi 5 giao dịch gần nhất                   |
| `testDoPost()`        | Sheet có dòng mới + nhận thông báo Telegram     |

---

## Cấu trúc tin nhắn Telegram

**Thông báo ủng hộ mới:**
```
☕ Ủng hộ mới!

💰 Số tiền: 25.000 ₫
👤 NGUYEN VAN A
📝 Nội dung: UNG HO 1 COFFEE
🔖 Mã GD: FT24015...

☕ × 1 ly cà phê – Cảm ơn bạn rất nhiều! ❤️
```

**Lệnh /stats:**
```
📊 Thống kê ủng hộ – khahdihdz

━━━━━━━━━━━━━━━━━━
🏆 Tổng cộng
   💰 1.500.000 ₫  |  🧾 42 giao dịch

📅 Hôm nay
   💰 75.000 ₫  |  🧾 3 giao dịch

🗓 Tháng này
   💰 600.000 ₫  |  🧾 18 giao dịch

👑 Ủng hộ cao nhất: 200.000 ₫
━━━━━━━━━━━━━━━━━━
☕ Tổng: ×60 ly cà phê
```

---

## Các lệnh bot

| Lệnh       | Chức năng                        |
|------------|----------------------------------|
| `/help`    | Danh sách lệnh                   |
| `/stats`   | Thống kê tổng quan (mọi thời)    |
| `/today`   | Thống kê hôm nay                 |
| `/history` | 5 giao dịch ủng hộ gần nhất      |

---

## Gửi stats định kỳ tự động (Trigger)

Nếu muốn bot tự gửi thống kê mỗi ngày:

1. Trong GAS: **Trình kích hoạt** → **Thêm trình kích hoạt**
2. Chọn hàm: `testStats`
3. Loại: `Dựa theo thời gian` → `Bộ đếm thời gian hàng ngày` → `9h - 10h`

---

## Lưu ý

- Mỗi lần sửa `Code.gs` → deploy lại (dùng "Quản lý triển khai" để giữ nguyên URL)
- Bot chỉ phản hồi đúng `TG_CHAT_ID` — người khác bị chặn tự động
- Cửa sổ xác nhận: **10 phút** (chỉnh `PAID_WINDOW_MS`)
