dotnet run

# Library Management System

Hệ thống quản lý thư viện với giao diện admin panel, hỗ trợ quản lý sách và tác giả.

## 🚀 Tính năng

- ✅ Quản lý sách (CRUD)
- ✅ Quản lý tác giả (CRUD)
- ✅ Hỗ trợ nhiều tác giả cho một cuốn sách
- ✅ Giao diện admin responsive
- ✅ API RESTful
- ✅ Database MySQL (Aiven Cloud)

## 🛠️ Công nghệ sử dụng

### Backend

- **ASP.NET Core 9.0**
- **Entity Framework Core**
- **MySQL** (Aiven Cloud)
- **FluentValidation**
- **Clean Architecture** (Repository-Service-Controller)

### Frontend

- **React 18**
- **React Router**
- **Axios**
- **Bootstrap 5**
- **React Toastify**
- **SweetAlert2**

## 📋 Yêu cầu hệ thống

- .NET 9.0 SDK
- Node.js 18+
- MySQL Database (Aiven Cloud)

## ⚙️ Cài đặt và Setup

### 1. Clone repository

```bash
git clone <repository-url>
cd LibraryManagement
```

### 2. Cấu hình Backend

#### Tạo file .env trong thư mục `LibraryManagement.API`

//file env nhắn zalo để lấy link db

#### Cài đặt dependencies và chạy migration

```bash
cd LibraryManagement.API
dotnet restore
dotnet ef database update
dotnet build
```

### 3. Cấu hình Frontend

```bash
cd ../library-frontend
npm install
```

### 4. Chạy ứng dụng

#### Terminal 1: Backend API

```bash
cd LibraryManagement.API
dotnet run
```

API sẽ chạy tại: `http://localhost:5000`

#### Terminal 2: Frontend

```bash
cd library-frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 📚 API Endpoints

### Books

- `GET /api/books` - Lấy danh sách sách
- `GET /api/books/{id}` - Lấy chi tiết sách
- `POST /api/books` - Thêm sách mới
- `PUT /api/books/{id}` - Cập nhật sách
- `DELETE /api/books/{id}` - Xóa sách

### Authors

- `GET /api/authors` - Lấy danh sách tác giả
- `GET /api/authors/{id}` - Lấy chi tiết tác giả
- `POST /api/authors` - Thêm tác giả mới
- `PUT /api/authors/{id}` - Cập nhật tác giả
- `DELETE /api/authors/{id}` - Xóa tác giả

## 🗂️ Cấu trúc dự án

```
LibraryManagement/
├── LibraryManagement.API/          # Backend .NET Core
│   ├── Controllers/                # API Controllers
│   ├── Data/                       # Database Context
│   ├── Models/                     # Entity Models
│   ├── Repositories/               # Data Access Layer
│   ├── Services/                   # Business Logic Layer
│   ├── Validators/                 # Input Validation
│   ├── Middlewares/                # Custom Middlewares
│   ├── Utils/                      # Utilities
│   └── Program.cs                  # Application Entry Point
├── library-frontend/               # Frontend React
│   ├── src/
│   │   ├── components/             # Reusable Components
│   │   ├── pages/                  # Page Components
│   │   ├── apis/                   # API Services
│   │   └── App.jsx                 # Main App Component
│   └── package.json
└── README.md
```

## 🔧 Scripts hữu ích

### Backend

<!-- ```bash
# Tạo migration mới
dotnet ef migrations add MigrationName

# Cập nhật database
dotnet ef database update

# Build project
dotnet build

# Chạy ứng dụng
dotnet run -->

````

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
````

## 🚨 Lưu ý quan trọng

1. **Bảo mật .env**: Đừng commit file `LibraryManagement.API/.env` vào Git. Đã thêm vào `.gitignore`
2. **Database Connection**: Connection string đã được cấu hình cho Aiven Cloud MySQL
3. **CORS**: Backend đã cấu hình cho phép frontend React chạy trên `http://localhost:5173`
4. **SSL**: Database sử dụng SSL mode Required cho Aiven Cloud

## 📊 Database Schema

### Bảng chính:

- **Books**: Thông tin sách
- **Authors**: Thông tin tác giả
- **BookAuthors**: Quan hệ nhiều-nhiều giữa sách và tác giả
- **BookItems**: Các bản sao của sách (để quản lý tồn kho)

### Quan hệ:

- Một cuốn sách có thể có nhiều tác giả (many-to-many)
- Một tác giả có thể viết nhiều cuốn sách (many-to-many)
- Một cuốn sách có thể có nhiều bản sao vật lý (one-to-many)

## 🐛 Troubleshooting

### Lỗi kết nối Database

- Kiểm tra connection string trong file `.env`
- Đảm bảo Aiven Cloud database đang hoạt động
- Kiểm tra firewall và network connectivity

### Lỗi CORS

- Đảm bảo frontend chạy trên `http://localhost:5173`
- Kiểm tra cấu hình CORS trong `Program.cs`

### Lỗi Migration

```bash
# Reset database và chạy lại migration
dotnet ef database drop --force
dotnet ef database update
```

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- Email: your-email@example.com
- Project Link: [GitHub Repository]

---

**Happy coding! 🎉**
