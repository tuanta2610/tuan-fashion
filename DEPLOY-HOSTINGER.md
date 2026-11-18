# Hướng dẫn deploy TUAN FASHION lên Hostinger

Website là một ứng dụng **Node.js (Express)**, nên cần gói Hostinger **có hỗ trợ Node.js**.

## 1. Chọn gói hosting

| Gói | Chạy được website này? | Ghi chú |
|---|---|---|
| Single / Premium Web Hosting | ❌ | Không hỗ trợ ứng dụng Node.js |
| **Business Web Hosting** | ✅ **Khuyên dùng** | Có "Node.js Web App", deploy thẳng từ GitHub, kèm email tên miền miễn phí, SSL miễn phí |
| Cloud Startup / Professional | ✅ | Giống Business, tài nguyên mạnh hơn |
| VPS (KVM 1 trở lên) | ✅ | Toàn quyền máy chủ, tự cấu hình (xem mục 5) |

> Nếu chưa có tên miền, mua kèm gói hosting (ví dụ `tuanfashion.com` / `tuanfashion.vn`).

## 2. Tạo hộp thư gửi email (cho form đặt lịch)

1. hPanel → **Emails** → chọn tên miền → **Create email account**.
2. Tạo ví dụ `booking@tuanfashion.com` và đặt mật khẩu.
3. Thông số SMTP của Hostinger: máy chủ `smtp.hostinger.com`, cổng `465` (SSL).

## 3. Deploy từ GitHub (gói Business / Cloud)

1. Đăng nhập **hPanel** → **Websites** → **Add website** (hoặc vào website có sẵn) → chọn **Node.js Apps / Node.js Web App**.
2. Chọn **Import Git repository** → kết nối tài khoản GitHub → chọn repo **`tuanta2610/tuan-fashion`**, nhánh `main`.
3. Cấu hình build (Hostinger thường tự nhận diện Express):
   - **Node.js version:** 20 hoặc 22
   - **Install command:** `npm install`
   - **Build command:** để trống
   - **Start command / Entry file:** `npm start` (tương đương `server.js`)
4. Mục **Environment variables**: thêm các biến sau (giá trị thật, **không** commit lên GitHub):

   | Biến | Giá trị ví dụ |
   |---|---|
   | `NODE_ENV` | `production` |
   | `SITE_URL` | `https://tuanfashion.com` |
   | `SMTP_HOST` | `smtp.hostinger.com` |
   | `SMTP_PORT` | `465` |
   | `SMTP_USER` | `booking@tuanfashion.com` |
   | `SMTP_PASS` | *(mật khẩu hộp thư ở bước 2)* |
   | `MAIL_TO` | `tuantran261083@gmail.com` |
   | `MAIL_FROM` | `"TUAN FASHION" <booking@tuanfashion.com>` |
   | `AUTO_REPLY` | `true` |

   Không cần đặt `PORT`, vì Hostinger tự cấp.
5. Bấm **Deploy**. Sau vài phút website chạy trên tên miền tạm, rồi bạn gắn tên miền chính và bật **SSL** miễn phí.
6. Mỗi lần push code mới lên nhánh `main`, vào hPanel bấm **Redeploy**. Nếu đã bật auto-deploy thì Hostinger tự cập nhật.

> Giao diện hPanel thay đổi theo thời gian, nên tên nút có thể hơi khác. Nếu không thấy mục Node.js, hãy chat với hỗ trợ Hostinger và hỏi: *"How do I deploy an Express app from GitHub on my plan?"*

## 4. Kiểm tra sau khi deploy

- [ ] Mở `https://ten-mien/` và `https://ten-mien/en`
- [ ] Gửi thử form **Đặt lịch hẹn**, kiểm tra email về `MAIL_TO` và email xác nhận gửi cho khách
- [ ] Bấm nút chat Zalo / WhatsApp
- [ ] Mở `https://ten-mien/sitemap.xml`, rồi gửi sitemap lên Google Search Console

## 5. (Tuỳ chọn) Deploy lên Hostinger VPS

```bash
# Trên VPS Ubuntu
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm i -g pm2

git clone https://github.com/tuanta2610/tuan-fashion.git
cd tuan-fashion && npm install --omit=dev
cp .env.example .env && nano .env          # điền giá trị thật
pm2 start server.js --name tuan-fashion && pm2 save && pm2 startup
```

Cấu hình Nginx (`/etc/nginx/sites-available/tuanfashion`):

```nginx
server {
  server_name tuanfashion.com www.tuanfashion.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tuanfashion /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx
```

Cập nhật code về sau: `git pull && npm install --omit=dev && pm2 restart tuan-fashion`.

## Dùng Gmail thay cho email Hostinger

Đặt `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=<gmail của bạn>`. `SMTP_PASS` phải là **App Password** 16 ký tự: bật xác minh 2 bước, rồi vào Google Account → Security → App passwords. Đây không phải mật khẩu Gmail thường.
