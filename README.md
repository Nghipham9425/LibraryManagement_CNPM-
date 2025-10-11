dotnet run

# Library Management (gốc)

Kho chứa này gồm hai phần:

- `LibraryManagement.API/` - Backend (ASP.NET Core API)
- `library-frontend/` - Frontend (React + Vite)

## Chạy nhanh Frontend (ưu tiên để kiểm UI trên Windows)

Yêu cầu trước:

- Node.js (phiên bản >=16) và npm. Tải Node.js tại: https://nodejs.org/

Các bước:

```bash
# nếu chưa clone
# git clone <url-repo-của-bạn>
# vào thư mục frontend
cd library-frontend

# cài dependencies
npm install

# chạy dev server
npm run dev
```

Mở trình duyệt tới địa chỉ thường thấy: `http://localhost:5173` (kiểm tra output terminal để biết port chính xác).

> LƯU Ý: frontend hiện đã hoạt động độc lập, bạn có thể kiểm giao diện mà không cần backend.

## Backend

Hiện tại backend (`LibraryManagement.API`) chưa được cấu hình hoàn chỉnh để chạy (chưa thêm database/migration mặc định). Nếu bạn muốn chạy backend sau, cần cài đặt .NET SDK và làm theo hướng dẫn trong thư mục `LibraryManagement.API`.

Yêu cầu trước để chạy backend:

- .NET SDK: https://dotnet.microsoft.com/en-us/download

Ví dụ các lệnh cơ bản (sau khi backend được cấu hình):

```bash
cd LibraryManagement.API
dotnet restore
dotnet run
```

## Ghi chú

- File README này tập trung giúp bạn chạy frontend nhanh để test UI trên Windows.
- Đừng commit các file nhạy cảm (ví dụ `.env` chứa mật khẩu). Sử dụng `.gitignore` để loại trừ `node_modules`, `bin/`, `obj/`, v.v.

---

Nếu bạn muốn mình cấu hình backend (EF Core + SQLite để dev nhanh) hoặc tạo `.env.example`, báo mình sẽ làm tiếp.
