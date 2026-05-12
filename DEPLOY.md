# 🚀 Hướng dẫn Deploy – SePay Backend lên Google Apps Script

## Kiến trúc

```
[User quét QR]
      │  chuyển khoản MB Bank
      ▼
  SePay.vn  ──POST webhook──►  [Google Apps Script – Code.gs]
                                      │
                                      ├─ Lưu vào Google Sheets
                                      ├─ Gửi Telegram thông báo
                                      │
[Frontend polling]  ◄──GET ?route=check-payment──  GAS trả { paid: true/false }
      │
      ▼  paid: true
  Hiện overlay cảm ơn + confetti 🎉
```

---

## Bước 1 – Deploy Google Apps Script (Code.gs)

1. Truy cập https://script.google.com → **New project**
2. Paste toàn bộ nội dung `Code.gs` vào editor
3. **Project Settings** → **Script Properties** → thêm:

| Key | Giá trị |
|-----|---------|
| `ACCOUNT_NUMBER` | `8880812999` |
| `TRANSFER_PREFIX` | `UNG HO` |
| `SEPAY_SECRET` | chuỗi random bất kỳ |
| `TG_BOT_TOKEN` | token Telegram bot |
| `TG_CHAT_ID` | chat ID Telegram |
| `STATS_API_KEY` | (tùy chọn) key bảo vệ /stats |
| `SPREADSHEET_ID` | *(để trống – script tự tạo Sheet)* |

4. **Deploy** → **New deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy URL dạng:
   ```
   https://script.google.com/macros/s/AKfyc.../exec
   ```

---

## Bước 2 – Cập nhật frontend

Trong `assets/js/app.js`, thay URL GAS:

```js
const GAS_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

> ⚠️ Mỗi lần **redeploy** Code.gs phải chọn **"New deployment"** –
> nếu chọn "Manage deployments → Edit" thì URL không đổi (khuyến nghị).

---

## Bước 3 – Cấu hình SePay Webhook

1. Đăng nhập https://my.sepay.vn
2. **Tài khoản ngân hàng** → chọn `8880812999`
3. **Webhook** → Thêm mới:
   - **URL:**
     ```
     https://script.google.com/macros/s/YOUR_ID/exec?route=sepay-webhook&secret=YOUR_SEPAY_SECRET
     ```
   - **Method:** POST
4. Nhấn **Lưu** → **Test**

> ℹ️ GAS Web App không đọc được HTTP headers tùy chỉnh, nên secret
> được truyền qua query param `?secret=` thay vì header `x-sepay-token`.

---

## Bước 4 – (Tùy chọn) Cấu hình Telegram Bot

### Tạo bot:
1. Chat với @BotFather → `/newbot` → copy token
2. Chat với @userinfobot → copy Chat ID

### Đăng ký webhook Telegram:
```bash
curl "https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://script.google.com/macros/s/YOUR_ID/exec?route=tg-webhook"
```

---

## Endpoints

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `?route=` *(trống)* | Health check |
| POST | `?route=sepay-webhook&secret=XXX` | SePay gọi vào đây |
| GET | `?route=check-payment&amount=25000` | Frontend polling |
| GET | `?route=stats&key=XXX` | Thống kê tổng quan |
| POST | `?route=tg-webhook` | Nhận lệnh Telegram bot |

---

## Test thủ công

```bash
# Giả lập SePay gọi webhook
curl -X POST "https://script.google.com/macros/s/YOUR_ID/exec?route=sepay-webhook&secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "transferType": "in",
    "accountNumber": "8880812999",
    "content": "UNG HO 1 COFFEE",
    "transferAmount": 25000,
    "description": "CT TU 0123456789 NGUYEN VAN A DEN 8880812999",
    "id": "TEST001"
  }'

# Kiểm tra payment
curl "https://script.google.com/macros/s/YOUR_ID/exec?route=check-payment&amount=25000"
```

---

## So sánh với bản Render.com cũ

| | Render.com (cũ) | Google Apps Script (mới) |
|--|--|--|
| Database | SQLite (ephemeral) | Google Sheets (persistent) |
| Cold start | ~30 giây | Không có |
| Free tier | Ngủ sau 15 phút | Luôn sẵn sàng |
| Auth | Header `x-sepay-token` | Query `?secret=` |
| Giới hạn | 750h/tháng | 6 phút/execution, 90 phút/ngày tổng |
| Xem data | Cần tool DB | Mở Google Sheet trực tiếp |
