# Tip4Me

**Tip4Me** là nền tảng ủng hộ trực tuyến theo phong cách *Buy Me a Coffee*, giúp người dùng gửi lời nhắn và đóng góp cho tác giả thông qua mã QR ngân hàng.

## Tính năng

- Giao diện hiện đại, tương thích thiết bị di động và máy tính.
- Hỗ trợ tiếng Việt và tiếng Anh.
- Tạo mã QR thanh toán ngân hàng theo số tiền ủng hộ.
- Tự động xác nhận giao dịch thông qua SePay webhook.
- Hiển thị trạng thái giao dịch và thông báo khi thanh toán thành công.
- Thống kê số tiền và lượt ủng hộ.
- Trang quản trị dành cho chủ sở hữu.
- Dữ liệu giao dịch được lưu trữ trên Google Sheets.

## Công nghệ

- **Frontend:** HTML, CSS, JavaScript.
- **Hosting:** GitHub Pages.
- **Backend API:** Cloudflare Workers.
- **Lưu trữ dữ liệu:** Google Sheets.
- **Thanh toán:** VietQR và SePay.

## Kiến trúc dự án

```text
.
├── index.html
├── assets/
│   ├── css/
│   └── js/
├── worker/
│   ├── src/
│   │   └── index.js
│   └── wrangler.toml
└── .github/
    └── workflows/
```

## Bản quyền và giấy phép

© 2026 Dinh Trong Khanh. All rights reserved.

Tip4Me là phần mềm độc quyền. Mã nguồn, thiết kế, giao diện và các tài nguyên thuộc dự án được bảo hộ bản quyền. Không được sao chép, chỉnh sửa, phân phối, khai thác thương mại hoặc tạo sản phẩm phái sinh nếu chưa có sự cho phép trước bằng văn bản của chủ sở hữu.

Xem chi tiết tại [LICENSE](./LICENSE).

## Tuyên bố miễn trừ

Tip4Me được cung cấp nguyên trạng, không kèm theo bất kỳ bảo đảm nào trong phạm vi pháp luật cho phép. Người triển khai có trách nhiệm tự cấu hình, bảo vệ thông tin xác thực và tuân thủ các điều khoản của dịch vụ bên thứ ba được tích hợp.
