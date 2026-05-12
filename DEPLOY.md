# 🚀 Hướng dẫn Deploy – SePay Backend lên Render.com

## Kiến trúc mới

```
[User quét QR]
      │  chuyển khoản MB Bank
      ▼
  SePay.vn  ──POST webhook──►  [Render.com – server.js]
                                      │
                                      ├─ Lưu vào SQLite
                                      ├─ Gửi Telegram thông báo
                                      │
[Frontend polling]  ◄──GET /check-payment──  Render trả { paid: true/false }
      │
      ▼  paid: true
  Hiện overlay cảm ơn + confetti 🎉
```

---

## Bước 1 – Push backend lên GitHub

```bash
cd sepay-backend
git init
git add .
git commit -m "feat: sepay webhook backend"
git remote add origin https://github.com/<username>/sepay-backend.git
git push -u origin main
```

---

## Bước 2 – Deploy lên Render.com

1. Truy cập https://render.com → **New → Web Service**
2. Kết nối GitHub repo `sepay-backend`
3. Cấu hình:
   - **Name:** `sepay-backend-khahdihdz`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

4. Điền **Environment Variables** (tab *Environment*):

| Key | Giá trị |
|-----|---------|
| `ACCOUNT_NUMBER` | `8880812999` |
| `TRANSFER_PREFIX` | `UNG HO` |
| `FRONTEND_URL` | URL GitHub Pages/Netlify của bạn |
| `SEPAY_SECRET` | Chuỗi random bất kỳ (tự tạo) |
| `TG_BOT_TOKEN` | Token từ @BotFather |
| `TG_CHAT_ID` | Chat ID Telegram của bạn |
| `STATS_API_KEY` | (Tùy chọn) key bảo vệ /stats |

5. Nhấn **Create Web Service** → đợi build xong (~2 phút)
6. Copy URL Render cấp, ví dụ: `https://sepay-backend-khahdihdz.onrender.com`

---

## Bước 3 – Cập nhật frontend

Trong `assets/js/app.js`, thay URL:

```js
const SEPAY_CHECK_URL = 'https://sepay-backend-khahdihdz.onrender.com/check-payment';
```

*(File đã được cập nhật sẵn trong bản này)*

---

## Bước 4 – Cấu hình SePay Webhook

1. Đăng nhập https://my.sepay.vn
2. **Tài khoản ngân hàng** → chọn tài khoản `8880812999`
3. **Webhook** → Thêm webhook mới:
   - **URL:** `https://sepay-backend-khahdihdz.onrender.com/sepay-webhook`
   - **Method:** POST
   - **Header (tùy chọn):** `x-sepay-token: <SEPAY_SECRET của bạn>`
4. Nhấn **Lưu** → Nhấn **Test** để kiểm tra

---

## Bước 5 – (Tùy chọn) Cấu hình Telegram Bot

### Tạo bot:
1. Chat với @BotFather → `/newbot` → đặt tên → copy token
2. Chat với @userinfobot → copy Chat ID

### Đăng ký Telegram webhook (để nhận lệnh /stats, /today...):
```bash
# Thay YOUR_TOKEN và YOUR_RENDER_URL
curl "https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://your-render-url.onrender.com/tg-webhook"
```

---

## Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/` | Health check |
| POST | `/sepay-webhook` | SePay gọi vào đây |
| GET | `/check-payment?amount=25000` | Frontend polling |
| GET | `/stats` | Thống kê (có thể bảo vệ bằng API key) |
| POST | `/tg-webhook` | Nhận lệnh Telegram bot |

---

## Lưu ý Free Tier Render.com

- **Cold start:** Server ngủ sau 15 phút không có request → lần đầu gọi sẽ chậm ~30 giây
- **Giải pháp:** Dùng dịch vụ như UptimeRobot để ping `/` mỗi 14 phút (miễn phí)
- **Dữ liệu:** SQLite lưu trong ephemeral disk → mất khi redeploy. Nếu cần persistent, nâng lên plan có disk hoặc dùng Turso/PlanetScale.

---

## Test webhook thủ công

```bash
# Giả lập SePay gọi webhook
curl -X POST https://sepay-backend-khahdihdz.onrender.com/sepay-webhook \
  -H "Content-Type: application/json" \
  -H "x-sepay-token: your_secret" \
  -d '{
    "transferType": "in",
    "accountNumber": "8880812999",
    "content": "UNG HO 1 COFFEE",
    "transferAmount": 25000,
    "description": "CT TU 0123456789 NGUYEN VAN A DEN 8880812999",
    "transactionID": "TEST001"
  }'

# Kiểm tra payment
curl "https://sepay-backend-khahdihdz.onrender.com/check-payment?amount=25000"
```
