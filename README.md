# TUAN FASHION — Website thương hiệu

Website song ngữ (Tiếng Việt / English) cho maison thời trang nữ cao cấp **TUAN FASHION**.
Xây dựng bằng **Node.js + Express + EJS**: render phía server, tải nhanh, chuẩn SEO, không cần build.

## Tính năng

| Trang | Đường dẫn (VI) | Đường dẫn (EN) |
|---|---|---|
| Trang chủ | `/` | `/en` |
| Bộ sưu tập (lọc theo dòng) | `/collections?category=evening` | `/en/collections` |
| Chi tiết sản phẩm | `/collections/wisteria-gown` | `/en/collections/wisteria-gown` |
| Lookbook (có lightbox) | `/lookbook` | `/en/lookbook` |
| Atelier — câu chuyện thương hiệu | `/atelier` | `/en/atelier` |
| Đặt lịch hẹn | `/appointment` | `/en/appointment` |
| Liên hệ + bản đồ | `/contact` | `/en/contact` |

- Form đặt lịch & liên hệ gửi email qua SMTP (Nodemailer), có kiểm tra dữ liệu, chống spam (honeypot + giới hạn 8 lần/15 phút), tự gửi email xác nhận cho khách.
- Nút chat nổi Zalo / WhatsApp trên mọi trang.
- SEO: thẻ meta, Open Graph, `hreflang`, `sitemap.xml`, `robots.txt`, JSON-LD (ClothingStore, Product).
- Bảo mật: Helmet + Content-Security-Policy, nén gzip, cache tĩnh 30 ngày.
- Truy cập: điều hướng bàn phím, focus rõ ràng, skip-link, tôn trọng `prefers-reduced-motion`, vùng chạm ≥ 44px.
- Responsive từ 375px đến màn hình lớn.

## Chạy trên máy

```bash
npm install
cp .env.example .env   # rồi điền thông tin SMTP
npm run dev            # http://localhost:3000
```

Khi chưa cấu hình SMTP và không ở chế độ production, nội dung form chỉ được in ra terminal để bạn thử.

## Chỉnh nội dung

| Muốn đổi | Sửa file |
|---|---|
| Số điện thoại, email, địa chỉ, giờ mở cửa, link mạng xã hội | `src/config.js` |
| Sản phẩm, giá, mô tả, ảnh | `src/data/products.js` |
| Ảnh lookbook | `src/data/lookbook.js` |
| Mọi câu chữ trên web | `src/locales/vi.js` và `src/locales/en.js` |
| Màu sắc, font, khoảng cách | biến CSS ở đầu `public/css/main.css` |

**Thay ảnh mẫu bằng ảnh thật:** đặt ảnh vào `public/img/products/` rồi đổi trường `image` thành đường dẫn bắt đầu bằng `/`, ví dụ `image: '/img/products/wisteria.jpg'` (khuyên dùng ảnh dọc tỉ lệ 3:4, rộng ≥ 1600px, định dạng WebP/JPG).

Ảnh hiện tại là ảnh mẫu từ [Unsplash](https://unsplash.com) (giấy phép miễn phí) — nên thay bằng ảnh chụp sản phẩm thật trước khi ra mắt.

## Deploy

Xem hướng dẫn chi tiết: **[DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md)**.

## Cấu trúc

```
server.js              Express app, routes, API form, sitemap
src/config.js          Thông tin liên hệ thương hiệu
src/i18n.js            Song ngữ
src/locales/           Câu chữ VI / EN
src/data/              Sản phẩm + lookbook
src/mailer.js          Kiểm tra form + gửi email
views/partials/        Header, footer, form, thẻ sản phẩm
views/pages/           Các trang
public/                CSS, JS, favicon
```
