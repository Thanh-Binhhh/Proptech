# 🏦 Proptech

Proptech là một nền tảng trực tuyến dành cho công ty môi giới bất động sản, xây dựng dựa trên kiến trúc **Microservices** nhằm hỗ trợ đăng tải, quản lý và trình bày các sản phẩm bất động sản một cách chuyên nghiệp và dễ tiếp cận đến khách hàng.

## Công nghệ sử dụng

- [NestJs](https://nestjs.com/) - Framework Node.js dùng TypeScript để xây dựng API phía máy chủ.
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) - Cơ sở dữ liệu NoSQL trên nền tảng đám mây..
- [Docker](https://www.docker.com/) - Công cụ đóng gói và chạy dự án trong môi trường độc lập.

Công cụ hỗ trợ phát triển:

- Docker Desktop
- [Postman](https://www.postman.com/downloads/) - Kiểm thử API.
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) - Trực quan hóa dữ liệu.

---

## Cấu trúc thư mục

```
AHM-Proptech
├── apps/
│   ├── api-gateway/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   ├── contact/
│   │   │   ├── guards/
│   │   │   └── main.ts
│   │   └── .env
│   ├── auth/
│   │   ├── src/
│   │   │   ├── mail/
│   │   │   ├── schemas/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.db.ts
│   │   │   ├── auth.module.ts
│   │   │   └── main.ts
│   │   └── .env
│   ├── contact/
│   │   ├── src/
│   │   └── .env
│   ├── posts/
│   │   ├── src/
│   │   └── .env
├── libs/
│   ├── contracts/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   ├── contact/
│   │   │   └── helper-functions.ts
├── docker-compose.yml/
├── Dockerfile
└── package.json

```

---

## Các endpoints

- URL: http://localhost:3000/api
- Swagger: http://localhost:3000/api

#### 1. Auth Service

| HTTP Method | Endpoint                       | Mô tả                                                            |
| :---------- | :----------------------------- | :--------------------------------------------------------------- |
| `POST`      | `/auth/register`               | Tạo tài khoản mới được phép truy cập vào hệ thống.               |
| `POST`      | `/auth/resend`                 | Gửi lại email xác nhận cho tài khoản vừa được tạo.               |
| `POST`      | `/auth/setup`                  | Thiết lập mật khẩu đăng nhập cho tài khoản mới.                  |
| `POST`      | `/auth/login`                  | Đăng nhập.                                                       |
| `POST`      | `/auth/logout`                 | Đăng xuất.                                                       |
| `GET`       | `/auth/me`                     | Lấy thông tin tài khoản đang đăng nhập.                          |
| `POST`      | `/auth/refresh`                | Làm mới token để duy trì phiên đăng nhập.                        |
| `POST`      | `/auth/request-reset-password` | Gửi email yêu cầu đặt lại mật khẩu khi người dùng quên mật khẩu. |
| `POST`      | `/auth/reset-password`         | Cập nhật mật khẩu mới khi người dùng quên mật khẩu.              |
| `GET`       | `/auth`                        | Truy xuất danh sách tài khoản trên hệ thống.                     |

#### 2. Contact Service

#### 3. Posts Service

---

## 🚀 Cài đặt và chạy dự án

### 1. Điều kiện

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

### 2. Sao chép kho lưu trữ

```bash
git clone https://github.com/Thanh-Binhhh/Proptech.git
```

### 3. Cấu hình môi trường

Mỗi dịch vụ trong dự án cần được cấu hình môi trường riêng biệt

### 4. Khởi động dự án

```bash
# Khởi động lần đầu hoặc muốn cập nhật config/setup lại từ đầu
docker-compose -p ahm-proptech up --build -d
```

Truy cập vào `http://localhost:3000/api` để xem các endpoints.

### 5. Một số lệnh liên quan

```bash
# Dừng tất cả dịch vụ
docker-compose -p ahm-proptech stop

# Khởi động dịch vụ ở các lần sau
docker-compose -p ahm-proptech start
```

```bash
# Dừng tất cả dịch vụ, và xóa network + container + volumes.
docker-compose -p ahm-proptech down -v
```

---

## Tác giả

- **Thanh Bình** - [Github](https://github.com/Thanh-Binhhh) | [Github Student](https://github.com/Thanh-Binhh)
