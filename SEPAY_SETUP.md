# Hướng dẫn tích hợp SePay Webhook

## Cách hoạt động

1. User quét QR → chuyển khoản MB Bank
2. SePay nhận webhook từ ngân hàng → gọi endpoint của bạn
3. Frontend polling `/check-payment?amount=XXX&ref=UNG+HO+KHAHDIHDZ`
4. Khi `paid: true` → hiện overlay cảm ơn + confetti 🎉

---

## Bước 1 – Đăng ký SePay

1. Tạo tài khoản tại https://sepay.vn
2. Kết nối tài khoản MB Bank: `8880812999`
3. Tại **Webhook**, điền URL backend của bạn:
   ```
   https://your-backend.com/sepay-webhook
   ```

---

## Bước 2 – Backend PHP mẫu

Tạo file `sepay-webhook.php` và `check-payment.php` trên server của bạn:

### `sepay-webhook.php`
```php
<?php
// SePay gọi POST đến đây khi có giao dịch mới
header('Content-Type: application/json');

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

/*
 * SePay gửi payload dạng:
 * {
 *   "id": 12345,
 *   "gateway": "MBBank",
 *   "transactionDate": "2024-01-15 10:30:00",
 *   "accountNumber": "8880812999",
 *   "subAccount": null,
 *   "code": "UNG HO KHAHDIHDZ",
 *   "content": "UNG HO KHAHDIHDZ",
 *   "transferType": "in",
 *   "transferAmount": 25000,
 *   "accumulated": 25000,
 *   "referenceCode": "FT24015...",
 *   "description": "...",
 *   "transactionID": "..."
 * }
 */

if (
    isset($data['transferType'])   &&
    $data['transferType'] === 'in' &&
    isset($data['transferAmount']) &&
    isset($data['content'])
) {
    $amount  = (int) $data['transferAmount'];
    $content = strtoupper(trim($data['content']));
    $ref     = 'UNG HO KHAHDIHDZ';

    // Lưu vào file tạm (thay bằng DB nếu có)
    if (str_contains($content, $ref) && $amount >= 5000) {
        $record = [
            'paid'   => true,
            'amount' => $amount,
            'payer'  => $data['description'] ?? '',
            'time'   => time(),
        ];
        file_put_contents(
            sys_get_temp_dir() . '/sepay_payment.json',
            json_encode($record)
        );
    }
}

echo json_encode(['success' => true]);
```

### `check-payment.php`
```php
<?php
// Frontend polling endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // Cho phép GitHub Pages gọi

$amount = (int)($_GET['amount'] ?? 0);
$file   = sys_get_temp_dir() . '/sepay_payment.json';

if (!file_exists($file)) {
    echo json_encode(['paid' => false]);
    exit;
}

$record = json_decode(file_get_contents($file), true);

// Kiểm tra: đúng số tiền + trong vòng 10 phút
if (
    $record &&
    $record['paid'] === true &&
    $record['amount'] === $amount &&
    (time() - $record['time']) < 600
) {
    echo json_encode([
        'paid'   => true,
        'amount' => $record['amount'],
        'payer'  => $record['payer'] ?? '',
    ]);
} else {
    echo json_encode(['paid' => false]);
}
```

---

## Bước 3 – Cập nhật app.js

Đổi URL trong `assets/js/app.js`:
```js
const SEPAY_CHECK_URL = 'https://your-backend.com/check-payment.php';
```

---

## Bước 4 – Nếu dùng GitHub Pages (static)

GitHub Pages không chạy PHP. Bạn cần một trong hai:

**Option A** – Deploy backend riêng trên Render.com (miễn phí):
- Tạo repo PHP, thêm `Dockerfile`
- Kết nối Render → Web Service

**Option B** – Dùng Google Apps Script (miễn phí hoàn toàn):
```js
// Code.gs
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.transferType === 'in') {
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
    sheet.appendRow([
      new Date(), data.transferAmount,
      data.content, data.description, data.transactionID
    ]);
  }
  return ContentService.createTextOutput(JSON.stringify({success:true}))
         .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const amount = parseInt(e.parameter.amount);
  const sheet  = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
  const rows   = sheet.getDataRange().getValues();
  const now    = Date.now();

  for (let i = rows.length-1; i >= 1; i--) {
    const [time, amt, content] = rows[i];
    const ms = new Date(time).getTime();
    if (amt === amount &&
        content.includes('UNG HO KHAHDIHDZ') &&
        (now - ms) < 600000) {
      return ContentService.createTextOutput(
        JSON.stringify({ paid: true, amount: amt, payer: rows[i][3] || '' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(
    JSON.stringify({ paid: false })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

---

## Test nhanh (không cần SePay)

Mở Console trình duyệt → paste:
```js
// Giả lập thanh toán thành công
showThankYou('Nguyễn Văn A', 25000);
```
