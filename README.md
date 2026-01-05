# CinemaVerse 🎬

**QUAN TRỌNG:** Vui lòng đọc kỹ file `Hướng-dẫn-sử-dụng.pdf` để nắm rõ cách thức sử dụng ứng dụng.

## Giới thiệu
CinemaVerse là một nền tảng **quản lý rạp chiếu phim và đặt vé trực tuyến toàn diện**, được xây dựng trên **PERN stack** (PostgreSQL, Express.js, React, Node.js). Hệ thống cung cấp giao diện hiện đại cho ba nhóm người dùng:
- **Khách hàng** – đặt vé, xem phim, mua đồ ăn
- **Nhân viên** – bán vé tại quầy, soát vé
- **Quản trị viên** – quản lý toàn bộ hoạt động rạp

## 🚀 Công nghệ sử dụng

### Frontend (Client)
- **React 19** với Vite (build tool nhanh)
- **Ant Design** – UI component library
- **React Router DOM** – định tuyến
- **Axios** – gọi API
- **@ant-design/charts** – biểu đồ thống kê
- **React Easy Crop** – cắt ảnh
- **XLSX + File-saver** – xuất Excel
- **Google OAuth 2.0** – đăng nhập bằng Google

### Backend (Server – từ file seed)
- **Node.js + Express.js**
- **PostgreSQL + Sequelize ORM**
- **JWT** – xác thực người dùng
- **Bcrypt** – mã hóa mật khẩu
- **Cloudinary** – lưu trữ hình ảnh/video
- **Multer** – upload file
- **Nodemailer** – gửi email (quên mật khẩu)
- **QR Code** – tạo mã vé

## 📁 Cấu trúc dự án


```

CinemaVerse/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/    # Component tái sử dụng
│   │   ├── context/       # AuthContext
│   │   ├── layout/        # AdminLayout, ClientLayout
│   │   ├── pages/         # Trang theo vai trò
│   │   ├── services/      # API service (axios)
│   │   └── styles/        # CSS/SCSS
│   ├── index.html
│   └── package.json
├── server/                 # Backend Node.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── app.js
│   └── server.js
└── README.md

```

## ⚙️ Cài đặt & Chạy dự án

### 1. Yêu cầu hệ thống
- Node.js (v18 trở lên)
- PostgreSQL (v12 trở lên)
- npm hoặc yarn

### 2. Clone repository
```bash
git clone <repository-url>
cd CinemaVerse

```

### 3. Cấu hình Backend

* Tạo file `.env` trong thư mục `server` với nội dung mẫu:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=cinemaverse
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:5173

```

* Cài đặt dependencies:

```bash
cd server
npm install

```

### 4. Cấu hình Frontend

* Tạo file `.env` trong thư mục `client`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE_URL=http://localhost:5000

```

* Cài đặt dependencies:

```bash
cd ../client
npm install

```

### 5. Chạy ứng dụng

Mở **3 terminal riêng biệt**:

**Terminal 1 – Backend:**

```bash
cd server
npm run dev

```

**Terminal 2 – Seed dữ liệu mẫu:**

```bash
cd server
node seedData.js

```

**Terminal 3 – Frontend:**

```bash
cd client
npm run dev

```

Truy cập:

* **Client:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
* **Admin:** [http://localhost:5173/admin](https://www.google.com/search?q=http://localhost:5173/admin)

## 👥 Tài khoản mẫu (sau khi seed)

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Admin | admin@test.com | admin123 |
| Staff | staff@test.com | staff123 |
| Customer | test@example.com | password123 |

## ✨ Tính năng chính

### 🎟️ Khách hàng (Client)

* **Đăng ký/Đăng nhập** (Email + Google OAuth)
* **Xem danh sách phim** (đang chiếu/sắp chiếu)
* **Chi tiết phim** + Trailer
* **Đặt vé online**:
* Chọn suất chiếu & ghế ngồi (real-time)
* Thêm đồ ăn/combo
* Thanh toán VietQR
* Nhận vé điện tử (QR code)


* Quản lý hồ sơ & lịch sử đặt vé

### 👨‍💼 Nhân viên (Staff)

* **Bán vé tại quầy** (POS interface)
* **Soát vé** (check-in bằng QR code)

### ⚙️ Quản trị viên (Admin)

* **Dashboard** thống kê doanh thu, vé bán
* **Quản lý phim** (thêm/sửa/xóa, upload poster/trailer)
* **Quản lý rạp & phòng chiếu** (thiết kế sơ đồ ghế)
* **Xếp lịch chiếu**
* **Quản lý đồ ăn/combo**
* **Khuyến mãi** (mã giảm giá)
* **Quản lý người dùng** (phân quyền)
* **Báo cáo doanh thu** + xuất Excel

## 🔐 Bảo mật

* Xác thực JWT + Refresh Token
* Mã hóa mật khẩu với bcrypt
* Phân quyền route (AdminRoute, StaffRoute)
* Google OAuth 2.0

## 📱 Giao diện

* **Client:** Thiết kế hiện đại, tối ưu trải nghiệm đặt vé
* **Admin:** Giao diện dashboard chuyên nghiệp, tối giản
* **Responsive** trên nhiều thiết bị

## 🚨 Lưu ý quan trọng

1. Đảm bảo PostgreSQL đang chạy trước khi khởi động server
2. Cần có tài khoản Cloudinary để upload ảnh/video
3. Cấu hình Google OAuth tại [Google Cloud Console](https://console.cloud.google.com/)
4. Ứng dụng dùng `multer-storage-cloudinary` – không lưu file cục bộ
