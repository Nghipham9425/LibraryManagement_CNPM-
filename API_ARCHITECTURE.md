# 📚 LIBRARY MANAGEMENT SYSTEM - API ARCHITECTURE

> **Tài liệu mô tả chi tiết kiến trúc API, Services, Repositories và Frontend Pages**

---

## 📐 Tổng Quan Kiến Trúc

```
┌─────────────────┐
│  Frontend Pages │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Controllers   │ ◄── Xử lý HTTP requests, validation
└────────┬────────┘
         │ Business Logic
         ▼
┌─────────────────┐
│    Services     │ ◄── Business logic, validation rules
└────────┬────────┘
         │ Data Access
         ▼
┌─────────────────┐
│  Repositories   │ ◄── Truy xuất database với EF Core
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │ (MySQL)
└─────────────────┘
```

---

## 1️⃣ AUTH MODULE (Xác thực & Phân quyền)

### **🎯 Controller:** `LibraryManagement.API/Controllers/AuthController.cs`

#### **📍 API Endpoints:**

| Method | Endpoint | Dùng ở Page nào? | File Frontend | Giải thích |
|--------|----------|------------------|---------------|------------|
| POST | `/api/Auth/register` | Trang Đăng ký | `library-frontend/src/pages/user/Auth/Register.jsx` | User nhập username, email, password → Gọi API này → Tạo tài khoản mới |
| POST | `/api/Auth/login` | Trang Đăng nhập User | `library-frontend/src/pages/user/Auth/Login.jsx` | User nhập username, password → Gọi API → Nhận JWT token → Lưu localStorage |
| POST | `/api/Auth/login` | Trang Đăng nhập Admin | `library-frontend/src/pages/admin/auth/AdminLogin.jsx` | Admin/Librarian login → Role Admin hoặc Librarian → Redirect vào `/admin` |
| POST | `/api/Auth/logout` | Header (nút Logout) | `library-frontend/src/components/layout/Header.jsx` | User ấn nút Đăng xuất → Xóa token → Redirect về home |
| POST | `/api/Auth/refresh-token` | Tự động (Axios Interceptor) | `library-frontend/src/apis/axiosConfig.js` | Khi token hết hạn → Tự động gọi API refresh → Lấy token mới |

---

### **🔧 Service:** `LibraryManagement.API/Services/AuthService.cs`
- **Methods:**
  - `RegisterAsync(username, email, password, role)` - Tạo user mới, hash password với BCrypt
  - `LoginAsync(username, password)` - Verify password → Tạo JWT token
  - `LogoutAsync()` - Xóa refresh token khỏi database
  - `GenerateJwtToken(user)` - Tạo JWT với claims: UserId, Username, Role

### **💾 Repository:** `LibraryManagement.API/Repositories/AuthRepository.cs`
- **Methods:**
  - `FindByUsernameAsync(username)` - Query: `SELECT * FROM Users WHERE Username = @username`
  - `CreateUserAsync(user)` - Insert user mới vào bảng Users
  - `UpdateRefreshTokenAsync(userId, token)` - Update refresh token cho user

---

### **📱 Frontend Pages sử dụng API này:**

#### 1️⃣ **Register.jsx** - Đăng ký tài khoản
- **Path:** `library-frontend/src/pages/user/Auth/Register.jsx`
- **Route:** `/register`
- **API gọi:** `POST /api/Auth/register`
- **Flow:** 
  1. User điền form: Username, Email, Password, Confirm Password
  2. Submit → `authAPI.register(data)`
  3. Success → Alert "Đăng ký thành công" → Redirect `/login`

#### 2️⃣ **Login.jsx** - Đăng nhập User
- **Path:** `library-frontend/src/pages/user/Auth/Login.jsx`
- **Route:** `/login`
- **API gọi:** `POST /api/Auth/login`
- **Flow:**
  1. User điền Username, Password
  2. Submit → `authAPI.login(credentials)`
  3. Nhận response: `{ token, user: { id, username, role } }`
  4. Lưu token vào `localStorage.setItem('token', token)`
  5. Redirect về `/` (Home)

#### 3️⃣ **AdminLogin.jsx** - Đăng nhập Admin/Librarian
- **Path:** `library-frontend/src/pages/admin/auth/AdminLogin.jsx`
- **Route:** `/admin/auth`
- **API gọi:** `POST /api/Auth/login` (cùng API nhưng check Role)
- **Flow:**
  1. Admin điền Username, Password
  2. Submit → `authAPI.login(credentials)`
  3. Check `user.role === 'Admin' || user.role === 'Librarian'`
  4. Nếu đúng → Redirect `/admin` (Dashboard)
  5. Nếu sai → Alert "Bạn không có quyền truy cập"

---

## 2️⃣ BOOKS MODULE (Quản lý sách)

### **🎯 Controller:** `LibraryManagement.API/Controllers/BooksController.cs`

#### **📍 API Endpoints:**

| Method | Endpoint | Dùng ở Page nào? | File Frontend | Giải thích |
|--------|----------|------------------|---------------|------------|
| GET | `/api/Books?search=&genreId=&authorId=` | Trang Danh sách Sách | `library-frontend/src/pages/user/Books/Books.jsx` | User vào trang /books → Load tất cả sách → Có thể search, filter theo Genre/Author |
| GET | `/api/Books/{id}` | Trang Chi tiết Sách | `library-frontend/src/pages/user/BookDetails/BookDetails.jsx` | User click vào 1 cuốn sách → Xem thông tin chi tiết (tác giả, thể loại, mô tả, các bản sao) |
| GET | `/api/Books` | Trang Quản lý Sách (Admin) | `library-frontend/src/pages/admin/management/Books.jsx` | Admin vào /admin/books → Xem toàn bộ sách dạng bảng để quản lý |
| POST | `/api/Books` | Modal "Thêm sách mới" | `library-frontend/src/pages/admin/management/Books.jsx` | Admin ấn nút "Thêm sách" → Điền form → Gọi API tạo sách mới |
| PUT | `/api/Books/{id}` | Modal "Sửa sách" | `library-frontend/src/pages/admin/management/Books.jsx` | Admin ấn nút "Sửa" trên 1 sách → Điền form → Gọi API cập nhật |
| DELETE | `/api/Books/{id}` | Nút "Xóa" trong bảng | `library-frontend/src/pages/admin/management/Books.jsx` | Admin ấn nút "Xóa" → Confirm → Gọi API xóa sách (chỉ Admin mới có quyền) |

---

### **🔧 Service:** `LibraryManagement.API/Services/BookService.cs`
- **Methods:**
  - `GetAllBooksAsync(search, genreId, authorId)` - Lấy danh sách, filter theo search text, thể loại, tác giả
  - `GetBookByIdAsync(id)` - Lấy chi tiết 1 sách, include Authors, Genres, BookItems (bản sao)
  - `CreateBookAsync(bookDto)` - Tạo sách mới, liên kết với Authors & Genres (many-to-many)
  - `UpdateBookAsync(id, bookDto)` - Cập nhật thông tin sách (title, ISBN, description...)
  - `DeleteBookAsync(id)` - Xóa sách (kiểm tra xem có bản sao đang mượn không)

### **💾 Repository:** `LibraryManagement.API/Repositories/BookRepository.cs`
- **Methods:**
  - `GetAllAsync()` - Query: `SELECT * FROM Books INCLUDE Authors, Genres, BookItems`
  - `GetByIdAsync(id)` - Get 1 sách với all relations
  - `CreateAsync(book)` - Insert vào bảng Books + BookAuthors + BookGenres
  - `UpdateAsync(book)` - Update bảng Books
  - `DeleteAsync(id)` - Delete từ Books (cascade delete relations)

---

### **📱 Frontend Pages sử dụng API này:**

#### 1️⃣ **Books.jsx** - Danh sách Sách (User)
- **Path:** `library-frontend/src/pages/user/Books/Books.jsx`
- **Route:** `/books`
- **API gọi:** `GET /api/Books?search={keyword}&genreId={id}&authorId={id}`
- **Flow:**
  1. User vào trang → `useEffect` gọi `booksAPI.getAll()`
  2. Hiển thị grid các sách (ảnh bìa, title, author)
  3. User nhập search box → Gọi lại API với `?search=keyword`
  4. User chọn filter Genre/Author → Gọi lại API với `?genreId=1&authorId=2`
  5. Click vào sách → Navigate `/books/{id}`

#### 2️⃣ **BookDetails.jsx** - Chi tiết Sách
- **Path:** `library-frontend/src/pages/user/BookDetails/BookDetails.jsx`
- **Route:** `/books/:id`
- **API gọi:** `GET /api/Books/{id}`
- **Flow:**
  1. User click vào sách → Navigate với `id` trong URL
  2. `useEffect` với `params.id` → Gọi `booksAPI.getById(id)`
  3. Hiển thị: Ảnh bìa lớn, Title, Authors, Genres, Description, ISBN, Publisher
  4. Hiển thị "Các bản sao sẵn có" (BookItems với status Available)
  5. Nút "Mượn sách" (nếu user đã login)

#### 3️⃣ **Books.jsx** - Quản lý Sách (Admin)
- **Path:** `library-frontend/src/pages/admin/management/Books.jsx`
- **Route:** `/admin/books`
- **API gọi:** `GET /api/Books`, `POST /api/Books`, `PUT /api/Books/{id}`, `DELETE /api/Books/{id}`
- **Flow:**
  1. Admin vào trang → Load bảng sách với `booksAPI.getAll()`
  2. **Thêm sách:**
     - Ấn "Thêm sách" → Mở modal
     - Điền form: Title, ISBN, Description, PublicationYear, Publisher, CoverImage
     - Chọn Authors (multi-select), Chọn Genres (multi-select)
     - Submit → `booksAPI.create(bookData)`
     - Success → Đóng modal, reload danh sách
  3. **Sửa sách:**
     - Ấn nút "Sửa" trên 1 row → Mở modal với data cũ
     - Chỉnh sửa → Submit → `booksAPI.update(id, bookData)`
  4. **Xóa sách:**
     - Ấn nút "Xóa" → Confirm dialog
     - Confirm → `booksAPI.delete(id)`
     - Success → Remove row khỏi bảng

---

## 3️⃣ AUTHORS MODULE (Quản lý tác giả)

### **Controller:** `AuthorsController.cs`
- **Endpoints:**
  - `GET /api/Authors` - Lấy danh sách tác giả
  - `GET /api/Authors/{id}` - Lấy chi tiết tác giả
  - `POST /api/Authors` - Thêm tác giả (Admin, Librarian)
  - `PUT /api/Authors/{id}` - Sửa tác giả (Admin, Librarian)
  - `DELETE /api/Authors/{id}` - Xóa tác giả (Admin only)

### **Service:** `AuthorService.cs`
- **Methods:**
  - `GetAllAuthorsAsync()` - Lấy tất cả tác giả
  - `GetAuthorByIdAsync(id)` - Lấy chi tiết tác giả
  - `AddAuthorAsync(author)` - Thêm tác giả mới
  - `UpdateAuthorAsync(author)` - Cập nhật tác giả
  - `DeleteAuthorAsync(id)` - Xóa tác giả

### **Repository:** `AuthorRepository.cs`
- **Methods:**
  - `GetAllAsync()` - Select * from Authors
  - `GetByIdAsync(id)` - Select by Id
  - `CreateAsync(author)` - Insert
  - `UpdateAsync(author)` - Update
  - `DeleteAsync(id)` - Delete

### **Frontend Pages:**
- ✅ `/authors` → `pages/user/Authors/Authors.jsx` (User xem)
- ✅ `/admin/authors` → `pages/admin/management/Authors.jsx` (Admin quản lý)

---

## 4️⃣ GENRES MODULE (Quản lý thể loại)

### **Controller:** `GenresController.cs`
- **Endpoints:**
  - `GET /api/Genres` - Lấy danh sách thể loại
  - `GET /api/Genres/{id}` - Lấy chi tiết thể loại
  - `POST /api/Genres` - Thêm thể loại (Admin, Librarian)
  - `PUT /api/Genres/{id}` - Sửa thể loại (Admin, Librarian)
  - `DELETE /api/Genres/{id}` - Xóa thể loại (Admin only)

### **Service:** `GenreService.cs`
- **Methods:**
  - `GetAllGenresAsync()` - Lấy tất cả thể loại
  - `GetGenreByIdAsync(id)` - Lấy chi tiết thể loại
  - `AddGenreAsync(genre)` - Thêm thể loại mới
  - `UpdateGenreAsync(genre)` - Cập nhật thể loại
  - `DeleteGenreAsync(id)` - Xóa thể loại

### **Repository:** `GenreRepository.cs`
- **Methods:**
  - `GetAllAsync()` - Select * from Genres
  - `GetByIdAsync(id)` - Select by Id
  - `CreateAsync(genre)` - Insert
  - `UpdateAsync(genre)` - Update
  - `DeleteAsync(id)` - Delete

### **Frontend Pages:**
- ✅ `/genres` → `pages/user/Genres/Genres.jsx` (User xem)
- ✅ `/admin/genres` → `pages/admin/management/Genres.jsx` (Admin quản lý)

---

## 5️⃣ BOOK ITEMS MODULE (Quản lý bản sao sách)

### **Controller:** `BookItemsController.cs`
- **Endpoints:**
  - `GET /api/books/{bookId}/items` - Lấy tất cả bản sao của 1 sách
  - `GET /api/books/{bookId}/items/{id}` - Lấy chi tiết 1 bản sao
  - `POST /api/books/{bookId}/items` - Thêm bản sao (Admin, Librarian)
  - `PUT /api/books/{bookId}/items/{id}` - Sửa trạng thái bản sao
  - `DELETE /api/books/{bookId}/items/{id}` - Xóa bản sao (Admin)

### **Service:** `BookItemService.cs`
- **Methods:**
  - `GetAllByBookIdAsync(bookId)` - Lấy tất cả bản sao của sách
  - `GetByIdAsync(id)` - Lấy chi tiết bản sao
  - `CreateAsync(bookId, dto)` - Tạo bản sao mới, tự gen ControlNumber
  - `UpdateAsync(id, dto)` - Cập nhật trạng thái (Available/Borrowed/Lost...)
  - `DeleteAsync(id)` - Xóa bản sao

### **Repository:** `BookItemRepository.cs`
- **Methods:**
  - `GetAllByBookIdAsync(bookId)` - Filter by BookId
  - `GetByIdAsync(id)` - Get with `.Include(Book)`
  - `CreateAsync(bookItem)` - Insert
  - `UpdateAsync(bookItem)` - Update
  - `DeleteAsync(id)` - Delete

### **Frontend Pages:**
- ✅ `/admin/books` → Component `BookItemsManager.jsx` (Modal quản lý bản sao)

---

## 6️⃣ BORROWINGS MODULE (Quản lý mượn trả)

### **🎯 Controller:** `LibraryManagement.API/Controllers/BorrowingsController.cs`

#### **📍 API Endpoints:**

| Method | Endpoint | Dùng ở Page nào? | File Frontend | Giải thích |
|--------|----------|------------------|---------------|------------|
| POST | `/api/Borrowings/borrow` | Trang Chi tiết Sách | `library-frontend/src/pages/user/BookDetails/BookDetails.jsx` | User ấn nút "Mượn sách" → Chọn bản sao → Gọi API mượn |
| POST | `/api/Borrowings/return` | Trang Quản lý Mượn trả (User) | `library-frontend/src/pages/user/Borrowing/Borrowing.jsx` | User ấn "Trả sách" trên 1 phiếu mượn → Confirm → Gọi API trả |
| POST | `/api/Borrowings/renew` | Trang Quản lý Mượn trả (User) | `library-frontend/src/pages/user/Borrowing/Borrowing.jsx` | User ấn "Gia hạn" → Gọi API (max 1 lần/sách) |
| GET | `/api/Borrowings/active/{libraryCardId}` | Tab "Đang mượn" | `library-frontend/src/pages/user/Borrowing/Borrowing.jsx` | User vào tab "Đang mượn" → Hiển thị sách đang mượn |
| GET | `/api/Borrowings/history/{libraryCardId}` | Tab "Lịch sử" | `library-frontend/src/pages/user/Borrowing/Borrowing.jsx` | User vào tab "Lịch sử" → Hiển thị sách đã trả |
| GET | `/api/Borrowings/overdue/{libraryCardId}` | Tab "Quá hạn" | `library-frontend/src/pages/user/Borrowing/Borrowing.jsx` | User vào tab "Quá hạn" → Hiển thị sách trễ hạn + tiền phạt |
| GET | `/api/Borrowings/all` | Trang Quản lý Mượn trả (Admin) | `library-frontend/src/pages/admin/management/Borrowing.jsx` | Admin xem tất cả giao dịch mượn trả của hệ thống |
| POST | `/api/Borrowings/{id}/return-admin` | Nút "Trả sách" (Admin) | `library-frontend/src/pages/admin/management/Borrowing.jsx` | Admin xử lý trả sách thay cho user |
| POST | `/api/Borrowings/{id}/report-lost` | Nút "Báo mất" | `library-frontend/src/pages/admin/management/Borrowing.jsx` | Admin đánh dấu sách bị mất → Tính phạt 100k |
| POST | `/api/Borrowings/{id}/report-damaged` | Nút "Báo hỏng" | `library-frontend/src/pages/admin/management/Borrowing.jsx` | Admin đánh dấu sách bị hỏng → Tính phạt 50k |

---

### **🔧 Service:** `LibraryManagement.API/Services/BorrowingService.cs`
- **Methods:**
  - `BorrowAsync(request)` - Kiểm tra: thẻ còn hạn, sách Available, chưa đạt max 3 sách/user
  - `ReturnAsync(request)` - Trả sách, update BookItem status = Available, tính phạt nếu quá hạn
  - `RenewAsync(request)` - Gia hạn thêm 7 ngày (max 1 lần), kiểm tra tổng không quá 22 ngày
  - `GetActiveAsync(cardId)` - Lấy phiếu mượn với Status = Borrowed
  - `GetHistoryAsync(cardId)` - Lấy phiếu mượn với Status = Returned
  - `GetOverdueAsync(cardId)` - Lấy phiếu mượn quá hạn: Status = Borrowed && DueDate < Now
  - `ReportLostAsync(id)` - Update Status = Lost, tạo Fine = 100k, BookItem status = Lost
  - `ReportDamagedAsync(id)` - Update Status = Damaged, tạo Fine = 50k

### **💾 Repository:** `LibraryManagement.API/Repositories/BorrowingRepository.cs`
- **Methods:**
  - `CreateAsync(borrowing)` - Insert phiếu mượn mới
  - `GetByIdAsync(id)` - Get với `.Include(BookItem.Book, LibraryCard.User)`
  - `GetActiveByCardIdAsync(cardId)` - Query: `WHERE LibraryCardId = @id AND Status = 'Borrowed'`
  - `GetHistoryByCardIdAsync(cardId)` - Query: `WHERE LibraryCardId = @id AND Status = 'Returned'`
  - `GetOverdueAsync(cardId)` - Query: `WHERE Status = 'Borrowed' AND DueDate < GETDATE()`
  - `UpdateAsync(borrowing)` - Update phiếu mượn

---

### **📱 Frontend Pages sử dụng API này:**

#### 1️⃣ **Borrowing.jsx** - Quản lý Mượn trả (User)
- **Path:** `library-frontend/src/pages/user/Borrowing/Borrowing.jsx`
- **Route:** `/borrowing`
- **API gọi:** Multiple APIs
- **Flow:**
  1. **Tab "Đang mượn":**
     - `useEffect` → Gọi `borrowingsAPI.getActive(libraryCardId)`
     - Hiển thị bảng: Tên sách, Ngày mượn, Hạn trả, Số lần gia hạn
     - Mỗi row có 2 nút:
       - **"Trả sách"** → `borrowingsAPI.return(borrowingId)` → Success: reload danh sách
       - **"Gia hạn"** → `borrowingsAPI.renew(borrowingId)` → Success: update DueDate
  2. **Tab "Lịch sử":**
     - Gọi `borrowingsAPI.getHistory(libraryCardId)`
     - Hiển thị: Tên sách, Ngày mượn, Ngày trả thực tế, Trạng thái
  3. **Tab "Quá hạn":**
     - Gọi `borrowingsAPI.getOverdue(libraryCardId)`
     - Hiển thị: Sách quá hạn, Số ngày trễ, Tiền phạt (5k/ngày)
     - Highlight đỏ các row quá hạn

#### 2️⃣ **BookDetails.jsx** - Mượn sách
- **Path:** `library-frontend/src/pages/user/BookDetails/BookDetails.jsx`
- **Route:** `/books/:id`
- **API gọi:** `POST /api/Borrowings/borrow`
- **Flow:**
  1. User xem chi tiết sách → Thấy danh sách "Các bản sao sẵn có"
  2. Ấn nút "Mượn sách" → Mở modal
  3. Modal hiển thị: Các bản sao với status Available (ControlNumber, Location)
  4. User chọn 1 bản sao → Confirm
  5. Gọi `borrowingsAPI.borrow({ bookItemId, libraryCardId })`
  6. Success → Alert "Mượn thành công", redirect `/borrowing`

#### 3️⃣ **Borrowing.jsx** - Quản lý Mượn trả (Admin)
- **Path:** `library-frontend/src/pages/admin/management/Borrowing.jsx`
- **Route:** `/admin/borrowing`
- **API gọi:** `GET /api/Borrowings/all`, `POST return-admin`, `POST report-lost`, `POST report-damaged`
- **Flow:**
  1. Admin vào trang → Gọi `borrowingsAPI.getAll()`
  2. Hiển thị bảng tất cả giao dịch:
     - Columns: ID, User, Book, BorrowDate, DueDate, ReturnDate, Status, Actions
  3. **Trả sách (Admin):**
     - Ấn "Trả sách" → `borrowingsAPI.returnAdmin(id)`
     - Dùng khi user không tự trả được
  4. **Báo mất:**
     - Ấn "Báo mất" → Confirm
     - Gọi `borrowingsAPI.reportLost(id)`
     - Tạo Fine = 100,000 VNĐ, Status = Lost
  5. **Báo hỏng:**
     - Ấn "Báo hỏng" → Confirm
     - Gọi `borrowingsAPI.reportDamaged(id)`
     - Tạo Fine = 50,000 VNĐ, Status = Damaged

---

## 7️⃣ LIBRARY CARDS MODULE (Quản lý thẻ thư viện)

### **Controller:** `LibraryCardsController.cs`
- **Endpoints:**
  - `GET /api/LibraryCards` - Lấy tất cả thẻ (Admin, Librarian)
  - `GET /api/LibraryCards/{id}` - Lấy chi tiết thẻ
  - `GET /api/LibraryCards/user/{userId}` - Lấy thẻ của 1 user
  - `POST /api/LibraryCards` - Tạo thẻ mới (Admin, Librarian)
  - `PUT /api/LibraryCards/{id}/deactivate` - Hủy thẻ
  - `PUT /api/LibraryCards/{id}/activate` - Kích hoạt thẻ

### **Service:** `LibraryCardService.cs`
- **Methods:**
  - `GetAllAsync()` - Lấy tất cả thẻ
  - `GetByIdAsync(id)` - Lấy chi tiết thẻ với User
  - `GetByUserIdAsync(userId)` - Lấy thẻ của user
  - `CreateAsync(userId)` - Tạo thẻ mới (ExpiryDate = Now + 4 năm)
  - `DeactivateAsync(id)` - Đánh dấu Inactive
  - `ActivateAsync(id)` - Đánh dấu Active

### **Repository:** `LibraryCardRepository.cs`
- **Methods:**
  - `GetAllAsync()` - Select * with `.Include(User)`
  - `GetByIdAsync(id)` - Get by Id
  - `GetByUserIdAsync(userId)` - Filter by UserId
  - `CreateAsync(card)` - Insert
  - `UpdateAsync(card)` - Update

### **Frontend Pages:**
- ✅ `/my-library-card` → `pages/user/MyLibraryCard/MyLibraryCard.jsx` (User xem thẻ)
- ✅ `/admin/library-cards` → `components/admin/LibraryCards/LibraryCards.jsx` (Admin quản lý)

---

## 8️⃣ USERS MODULE (Quản lý người dùng)

### **Controller:** `UsersController.cs`
- **Endpoints:**
  - `GET /api/Users` - Lấy tất cả users (Admin)
  - `GET /api/Users/{id}` - Lấy chi tiết user
  - `POST /api/Users` - Tạo user mới (Admin)
  - `PUT /api/Users/{id}` - Cập nhật user (Admin, hoặc chính user đó)
  - `PUT /api/Users/{id}/change-password` - Đổi mật khẩu

### **Service:** `UserService.cs`
- **Methods:**
  - `GetAllUsersAsync()` - Lấy tất cả users
  - `GetUserByIdAsync(id)` - Lấy chi tiết user
  - `CreateUserAsync(userDto)` - Tạo user mới, hash password
  - `UpdateUserAsync(id, userDto)` - Cập nhật user
  - `ChangePasswordAsync(id, oldPass, newPass)` - Đổi mật khẩu

### **Repository:** `UserRepository.cs`
- **Methods:**
  - `GetAllAsync()` - Select * from Users
  - `GetByIdAsync(id)` - Get by Id
  - `CreateAsync(user)` - Insert
  - `UpdateAsync(user)` - Update
  - `GetByUsernameAsync(username)` - Filter by Username

### **Frontend Pages:**
- ✅ `/profile` → `pages/user/Profile/Profile.jsx` (User xem/sửa profile)
- ✅ `/admin/members` → `pages/admin/management/Members.jsx` (Admin quản lý)

---

## 9️⃣ DASHBOARD MODULE (Thống kê tổng quan)

### **🎯 Controller:** `LibraryManagement.API/Controllers/DashboardController.cs`

#### **📍 API Endpoints:**

| Method | Endpoint | Dùng ở Page nào? | File Frontend | Giải thích |
|--------|----------|------------------|---------------|------------|
| GET | `/api/Dashboard/stats` | Trang Dashboard Admin | `library-frontend/src/pages/admin/management/Dashboard.jsx` | Admin vào trang chủ /admin → Hiển thị các thống kê tổng quan |

**Response Example:**
```json
{
  "totalBooks": 250,
  "totalMembers": 120,
  "totalLibraryCards": 115,
  "activeBorrowings": 35,
  "overdueBooks": 8,
  "popularBooks": [
    { "id": 1, "title": "Clean Code", "borrowCount": 15 },
    { "id": 2, "title": "Design Patterns", "borrowCount": 12 }
  ],
  "monthlyStats": [
    { "month": "01/2025", "borrowCount": 45, "returnCount": 42 },
    { "month": "02/2025", "borrowCount": 52, "returnCount": 48 }
  ]
}
```

---

### **🔧 Service:** Không có (logic trực tiếp trong Controller)
- **Logic trong Controller:**
  - Đếm tổng sách: `_context.Books.CountAsync()`
  - Đếm thành viên: `_context.Users.Where(u => u.Role == "Reader").CountAsync()`
  - Đếm thẻ thư viện: `_context.LibraryCards.CountAsync()`
  - Đếm đang mượn: `_context.Borrowings.Where(b => b.Status == "Borrowed").CountAsync()`
  - Top sách: `_context.Borrowings.GroupBy(b => b.BookItem.BookId).OrderByDescending(g => g.Count())`
  - Thống kê theo tháng: Group by Month(BorrowDate)

### **💾 Repository:** Không có

---

### **📱 Frontend Pages sử dụng API này:**

#### 1️⃣ **Dashboard.jsx** - Trang chủ Admin
- **Path:** `library-frontend/src/pages/admin/management/Dashboard.jsx`
- **Route:** `/admin` (trang đầu tiên sau khi Admin login)
- **API gọi:** `GET /api/Dashboard/stats`
- **Flow:**
  1. Admin login thành công → Redirect `/admin`
  2. `useEffect` → Gọi `dashboardAPI.getStats()`
  3. **Hiển thị 4 Card thống kê:**
     - 📚 Tổng số sách: {totalBooks}
     - 👥 Tổng thành viên: {totalMembers}
     - 🎫 Tổng thẻ thư viện: {totalLibraryCards}
     - 📖 Đang mượn: {activeBorrowings}
  4. **Biểu đồ "Sách mượn nhiều nhất":**
     - Chart.js Bar Chart
     - X-axis: Tên sách
     - Y-axis: Số lần mượn
     - Data: `popularBooks` array
  5. **Biểu đồ "Thống kê theo tháng":**
     - Chart.js Line Chart
     - X-axis: Tháng
     - 2 Lines: Số sách mượn (xanh), Số sách trả (đỏ)
     - Data: `monthlyStats` array
  6. **Bảng "Sách quá hạn":**
     - Hiển thị {overdueBooks} sách
     - Link tới `/admin/borrowing?filter=overdue`

---

## 🔟 REPORTS MODULE (Báo cáo thống kê)

### **Controller:** `ReportsController.cs`
- **Endpoints:**
  - `GET /api/Reports/borrowing-stats` - Thống kê mượn trả
  - `GET /api/Reports/overdue-books` - Danh sách sách quá hạn
  - `GET /api/Reports/popular-books` - Sách phổ biến
  - `GET /api/Reports/user-activity` - Hoạt động người dùng

### **Service:** `ReportService.cs`
- **Methods:**
  - `GetBorrowingStatsAsync(fromDate, toDate)` - Thống kê theo khoảng thời gian
  - `GetOverdueBooksAsync()` - Lấy sách quá hạn
  - `GetPopularBooksAsync(limit)` - Top sách mượn nhiều
  - `GetUserActivityAsync(userId)` - Lịch sử hoạt động user

### **Repository:** Không có (query trực tiếp từ Service)

### **Frontend Pages:**
- ✅ `/admin/reports` → `pages/admin/management/Reports.jsx` (Admin, Librarian)

---

## 1️⃣1️⃣ SETTINGS MODULE (Cài đặt hệ thống)

### **Controller:** `SettingsController.cs`
- **Endpoints:**
  - `GET /api/Settings` - Lấy tất cả cài đặt (Admin, Librarian)
  - `GET /api/Settings/{key}` - Lấy 1 cài đặt theo key
  - `PUT /api/Settings/{key}` - Cập nhật cài đặt (Admin only)

### **Service:** `SettingsService.cs`
- **Methods:**
  - `GetAllAsync()` - Lấy tất cả settings
  - `GetByKeyAsync(key)` - Lấy setting theo key
  - `UpdateAsync(key, dto)` - Cập nhật value (validate datatype)
  - `GetIntValueAsync(key, defaultValue)` - Helper get int
  - `GetDecimalValueAsync(key, defaultValue)` - Helper get decimal

### **Repository:** Không có (EF Core trực tiếp)

### **Frontend Pages:**
- ✅ `/admin/settings` → `pages/admin/management/Settings.jsx` (Admin only)

**Các Setting keys:**
- `MaxBorrowDays` - Số ngày mượn tối đa (15)
- `MaxBooksPerUser` - Số sách được mượn đồng thời (3)
- `MaxRenewCount` - Số lần gia hạn tối đa (1)
- `RenewExtensionDays` - Số ngày gia hạn thêm (7)
- `MaxTotalBorrowDays` - Tổng số ngày mượn tối đa (22)
- `LostBookFine` - Phạt sách mất (100,000 VNĐ)
- `DamagedBookFine` - Phạt sách hỏng (50,000 VNĐ)
- `CardValidityYears` - Thời hạn thẻ (4 năm)
- `OverdueFinePerDay` - Phạt quá hạn/ngày (5,000 VNĐ)

---

## 1️⃣2️⃣ ACTIVITY LOGS MODULE (Nhật ký hoạt động)

### **🎯 Controller:** `LibraryManagement.API/Controllers/ActivityLogsController.cs`

#### **📍 API Endpoints:**

| Method | Endpoint | Dùng ở Page nào? | File Frontend | Giải thích |
|--------|----------|------------------|---------------|------------|
| GET | `/api/ActivityLogs?action=&entity=&userId=&page=1&pageSize=20` | Trang Nhật ký Hoạt động | `library-frontend/src/pages/admin/management/ActivityLogs.jsx` | Admin xem toàn bộ logs với filter |
| GET | `/api/ActivityLogs/recent?count=20` | Dashboard (Widget) | `library-frontend/src/pages/admin/management/Dashboard.jsx` | Hiển thị 20 logs gần nhất ở Dashboard |
| GET | `/api/ActivityLogs/user/{userId}` | Trang Chi tiết User | `library-frontend/src/pages/admin/management/Members.jsx` | Admin xem lịch sử hoạt động của 1 user cụ thể |
| GET | `/api/ActivityLogs/stats` | Trang Nhật ký (Header) | `library-frontend/src/pages/admin/management/ActivityLogs.jsx` | Thống kê: Hôm nay, Tuần này, Tổng, Top users |

---

### **🔧 Service:** `LibraryManagement.API/Services/ActivityLogService.cs`
- **Methods:**
  - `LogAsync(action, entity, entityId, description)` - Tạo log mới, tự động lấy UserId từ JWT claims
  - `GetLogsAsync(filters, page, pageSize)` - Lấy logs với phân trang + filter action/entity/userId
  - `GetRecentAsync(count)` - Lấy N logs mới nhất (OrderByDescending CreatedAt)
  - `GetByUserAsync(userId, limit)` - Lấy logs của 1 user (dùng cho profile user)
  - `GetStatsAsync()` - Trả về: logsToday, logsThisWeek, totalLogs, topUsers (top 5 active users)

### **💾 Repository:** Không có (EF Core trực tiếp)

---

### **📱 Frontend Pages sử dụng API này:**

#### 1️⃣ **ActivityLogs.jsx** - Trang Nhật ký Hoạt động
- **Path:** `library-frontend/src/pages/admin/management/ActivityLogs.jsx`
- **Route:** `/admin/activity-logs`
- **API gọi:** `GET /api/ActivityLogs`, `GET /api/ActivityLogs/stats`
- **Flow:**
  1. Admin vào trang → Gọi `activityLogsAPI.getAll({ page: 1, pageSize: 20 })`
  2. **Header hiển thị thống kê:**
     - Gọi `activityLogsAPI.getStats()`
     - Hiển thị 4 badges: "Hôm nay: 12", "Tuần này: 85", "Tổng: 1,234"
  3. **Bảng Logs:**
     - Columns: Thời gian, User, Action, Entity, Mô tả
     - Mỗi Action có màu khác nhau:
       - Create → Badge xanh lá
       - Update → Badge vàng
       - Delete → Badge đỏ
       - Register → Badge xanh dương
  4. **Filter:**
     - Dropdown Action: [All, Create, Update, Delete, Register, Borrow, Return...]
     - Dropdown Entity: [All, Book, Author, Genre, User, Borrowing, Setting]
     - Input Username: Tìm logs của user cụ thể
     - Submit filter → Gọi lại API với query params
  5. **Pagination:**
     - Phân trang: Prev, 1, 2, 3..., Next
     - Click page → Gọi API với `?page={n}`

#### 2️⃣ **Dashboard.jsx** - Widget Logs gần đây
- **Path:** `library-frontend/src/pages/admin/management/Dashboard.jsx`
- **Route:** `/admin`
- **API gọi:** `GET /api/ActivityLogs/recent?count=5`
- **Flow:**
  1. Dashboard load → Gọi `activityLogsAPI.getRecent(5)`
  2. **Widget "Hoạt động gần đây":**
     - Hiển thị 5 logs mới nhất
     - Format: "Nghi đã thêm sách 'Clean Code' - 5 phút trước"
     - Link "Xem tất cả" → Navigate `/admin/activity-logs`

#### 3️⃣ **Members.jsx** - Lịch sử User
- **Path:** `library-frontend/src/pages/admin/management/Members.jsx`
- **Route:** `/admin/members`
- **API gọi:** `GET /api/ActivityLogs/user/{userId}`
- **Flow:**
  1. Admin click vào 1 user trong bảng Members → Mở modal chi tiết
  2. Tab "Lịch sử hoạt động" → Gọi `activityLogsAPI.getByUser(userId)`
  3. Hiển thị timeline các hoạt động của user đó:
     - Đăng ký: 01/01/2025
     - Mượn sách 'Book A': 05/01/2025
     - Trả sách 'Book A': 10/01/2025

---

### **📋 Các Action được log:**

| Action | Entity | Mô tả | Ví dụ |
|--------|--------|-------|-------|
| `Create` | Book | Thêm sách mới | "Đã thêm sách 'Clean Code'" |
| `Update` | Book | Cập nhật sách | "Đã cập nhật sách 'Clean Code'" |
| `Delete` | Book | Xóa sách | "Đã xóa sách 'Clean Code'" |
| `Create` | Author | Thêm tác giả | "Đã thêm tác giả 'Robert Martin'" |
| `Update` | Author | Sửa tác giả | "Đã cập nhật tác giả 'Robert Martin'" |
| `Delete` | Author | Xóa tác giả | "Đã xóa tác giả 'Robert Martin'" |
| `Create` | Genre | Thêm thể loại | "Đã thêm thể loại 'Programming'" |
| `Update` | Genre | Sửa thể loại | "Đã cập nhật thể loại 'Programming'" |
| `Delete` | Genre | Xóa thể loại | "Đã xóa thể loại 'Programming'" |
| `Create` | User | Thêm user | "Đã tạo tài khoản user 'nghi123'" |
| `Update` | User | Sửa user | "Đã cập nhật thông tin user 'nghi123'" |
| `Register` | Auth | Đăng ký | "Người dùng 'nghi123' đã đăng ký tài khoản" |
| `Borrow` | Borrowing | Mượn sách | "Đã mượn sách 'Clean Code' - Phiếu mượn #15" |
| `Return` | Borrowing | Trả sách | "Đã trả sách 'Clean Code' - Phiếu mượn #15" |
| `ReportLost` | Borrowing | Báo mất | "Đã báo mất sách 'Clean Code' - Phiếu mượn #15" |
| `ReportDamaged` | Borrowing | Báo hỏng | "Đã báo hỏng sách 'Clean Code' - Phiếu mượn #15" |
| `Update` | Setting | Sửa cài đặt | "Đã thay đổi cài đặt 'MaxBorrowDays' từ '14' thành '15'" |

**Lưu ý:** Login và Logout không được log (đã bỏ) vì quá nhiều, không cần thiết.

---

## 1️⃣3️⃣ NOTIFICATIONS MODULE (Thông báo)

### **Controller:** `NotificationsController.cs`
- **Endpoints:**
  - `GET /api/Notifications/user/{userId}` - Lấy thông báo của user
  - `GET /api/Notifications/unread-count/{userId}` - Đếm thông báo chưa đọc
  - `PUT /api/Notifications/{id}/mark-read` - Đánh dấu đã đọc

### **Service:** `NotificationService.cs`
- **Methods:**
  - `GetByUserIdAsync(userId)` - Lấy thông báo của user
  - `GetUnreadCountAsync(userId)` - Đếm chưa đọc
  - `MarkAsReadAsync(id)` - Đánh dấu đã đọc
  - `CreateNotificationAsync(userId, type, message)` - Tạo thông báo mới

### **Repository:** Không có (EF Core trực tiếp)

### **Frontend Pages:**
- ✅ Component `NotificationBell.jsx` (Header của user)

**Loại thông báo:**
- Sách sắp hết hạn (3 ngày trước)
- Sách quá hạn
- Thông báo phạt
- Gia hạn thành công

---

## 📊 BẢNG TỔNG HỢP MAPPING

| Module | Controller | Service | Repository | Frontend Pages |
|--------|-----------|---------|------------|----------------|
| Auth | AuthController | AuthService | AuthRepository | Login, Register, AdminLogin |
| Books | BooksController | BookService | BookRepository | Books, BookDetails, admin/Books |
| Authors | AuthorsController | AuthorService | AuthorRepository | Authors, admin/Authors |
| Genres | GenresController | GenreService | GenreRepository | Genres, admin/Genres |
| BookItems | BookItemsController | BookItemService | BookItemRepository | BookItemsManager (modal) |
| Borrowings | BorrowingsController | BorrowingService | BorrowingRepository | Borrowing, admin/Borrowing |
| LibraryCards | LibraryCardsController | LibraryCardService | LibraryCardRepository | MyLibraryCard, admin/LibraryCards |
| Users | UsersController | UserService | UserRepository | Profile, admin/Members |
| Dashboard | DashboardController | - | - | admin/Dashboard |
| Reports | ReportsController | ReportService | - | admin/Reports |
| Settings | SettingsController | SettingsService | - | admin/Settings |
| ActivityLogs | ActivityLogsController | ActivityLogService | - | admin/ActivityLogs |
| Notifications | NotificationsController | NotificationService | - | NotificationBell |

---

## 🔒 PHÂN QUYỀN (Authorization)

### **Guest (Không đăng nhập):**
- ✅ Xem danh sách sách, tác giả, thể loại
- ✅ Tìm kiếm sách
- ✅ Xem FAQ, Policy, Contact
- ✅ Đăng ký tài khoản

### **Reader (Độc giả):**
- ✅ Tất cả quyền của Guest
- ✅ Đăng nhập/Đăng xuất
- ✅ Xem & sửa profile
- ✅ Xem thẻ thư viện
- ✅ Mượn/Trả/Gia hạn sách
- ✅ Xem lịch sử, sách đang mượn, quá hạn
- ✅ Báo mất/hỏng sách
- ✅ Nhận thông báo

### **Librarian (Thủ thư):**
- ✅ Đăng nhập trang quản trị
- ✅ Quản lý Sách/Tác giả/Thể loại/Bản sao (Thêm/Sửa)
- ✅ Quản lý giao dịch mượn trả
- ✅ Xử lý sách mất/hỏng
- ✅ Xem báo cáo thống kê
- ✅ Xem danh sách thẻ thư viện
- ✅ Xem cài đặt hệ thống (read-only)

### **Admin (Quản trị viên):**
- ✅ Tất cả quyền của Librarian
- ✅ Xem Dashboard tổng quan
- ✅ Quản lý thành viên (tạo/sửa user)
- ✅ Xóa Sách/Tác giả/Thể loại
- ✅ Quản lý cài đặt hệ thống (update)
- ✅ Xem nhật ký hoạt động

---

## 🛠️ UTILITIES & HELPERS

### **JwtTokenService.cs**
- `GenerateToken(user)` - Tạo JWT token với claims
- `ValidateToken(token)` - Validate token
- `GetUserIdFromToken(token)` - Extract UserId từ token

### **ApiException.cs**
- Custom exception với statusCode và message
- Xử lý bởi `ErrorHandlingMiddleware.cs`

### **Validators (FluentValidation):**
- `AuthValidator.cs` - Validate login/register
- `BookValidator.cs` - Validate book input
- `AuthorValidator.cs` - Validate author
- `GenreValidator.cs` - Validate genre
- `LibraryCardValidator.cs` - Validate library card

### **Mappers (AutoMapper):**
- `BookProfile.cs` - Map Book ↔ BookDto
- `GenreProfile.cs` - Map Genre ↔ GenreDto
- `LibraryCardProfile.cs` - Map LibraryCard ↔ Dto
- `UserProfile.cs` - Map User ↔ UserDto

---

## 📦 DATABASE ENTITIES

### **Core Entities:**
- `User` - Người dùng (Id, Username, Email, PasswordHash, Role)
- `Book` - Sách (Id, Title, ISBN, Description, PublicationYear, Publisher)
- `Author` - Tác giả (Id, Name, Bio, BirthDate)
- `Genre` - Thể loại (Id, Name, Description)
- `BookItem` - Bản sao sách (Id, BookId, ControlNumber, Status, Location)
- `LibraryCard` - Thẻ thư viện (Id, UserId, CardNumber, IssueDate, ExpiryDate, Status)
- `Borrowing` - Phiếu mượn (Id, LibraryCardId, BookItemId, BorrowDate, DueDate, ReturnDate, Status, RenewCount)
- `Fine` - Phạt (Id, BorrowingId, Amount, Reason, IsPaid)
- `Setting` - Cài đặt (Id, Key, Value, Description, DataType)
- `ActivityLog` - Nhật ký (Id, UserId, Action, Entity, EntityId, Description, CreatedAt)
- `Notification` - Thông báo (Id, UserId, Type, Message, IsRead, CreatedAt)

### **Junction Tables (Many-to-Many):**
- `BookAuthor` - Liên kết Book ↔ Author
- `BookGenre` - Liên kết Book ↔ Genre

---

## 🎯 KẾT LUẬN

Hệ thống được thiết kế theo mô hình **3-Layer Architecture**:
1. **Controller Layer** - Xử lý HTTP requests, authorization
2. **Service Layer** - Business logic, validation
3. **Repository Layer** - Data access với EF Core

**Ưu điểm:**
- ✅ Tách biệt rõ ràng giữa các layer
- ✅ Dễ bảo trì và mở rộng
- ✅ Testable (có thể mock Service/Repository)
- ✅ Follow SOLID principles
- ✅ RESTful API design

**Công nghệ sử dụng:**
- **Backend:** ASP.NET Core 8, EF Core, MySQL
- **Frontend:** React 18, Vite, React Router, Bootstrap 5
- **Authentication:** JWT Bearer Token
- **Validation:** FluentValidation
- **Mapping:** AutoMapper

---

## 🎓 HƯỚNG DẪN PASTE VÀO BÁO CÁO

### **Cách sử dụng tài liệu này:**

1. **Muốn giải thích Controller → Service → Repository:**
   - Copy phần "Service" và "Repository" của module tương ứng
   - Vẽ sơ đồ luồng: Controller → Service → Repository → Database

2. **Muốn giải thích API nào dùng ở Page nào:**
   - Copy bảng "API Endpoints" của module đó
   - Bảng có sẵn: Method, Endpoint, Dùng ở Page nào, File Frontend, Giải thích

3. **Muốn viết về Flow nghiệp vụ:**
   - Copy phần "Frontend Pages sử dụng API này"
   - Có luồng step-by-step chi tiết từng tính năng

4. **Muốn vẽ sơ đồ Use Case:**
   - Dựa vào phần "Frontend Pages" + "Endpoints"
   - Ví dụ: Actor "Reader" → Use Case "Mượn sách" → API `POST /api/Borrowings/borrow`

---

## 📋 BẢNG TỔNG HỢP NHANH (PASTE VÀO BÁO CÁO)

### **1. Mapping API Controller → Frontend Pages**

| Controller | Frontend User Pages | Frontend Admin Pages |
|-----------|-------------------|---------------------|
| `AuthController.cs` | `/login` (Login.jsx)<br>`/register` (Register.jsx) | `/admin/auth` (AdminLogin.jsx) |
| `BooksController.cs` | `/books` (Books.jsx)<br>`/books/:id` (BookDetails.jsx) | `/admin/books` (Books.jsx) |
| `AuthorsController.cs` | `/authors` (Authors.jsx) | `/admin/authors` (Authors.jsx) |
| `GenresController.cs` | `/genres` (Genres.jsx) | `/admin/genres` (Genres.jsx) |
| `BookItemsController.cs` | - | `/admin/books` (Modal quản lý bản sao) |
| `BorrowingsController.cs` | `/borrowing` (Borrowing.jsx)<br>`/books/:id` (Nút mượn) | `/admin/borrowing` (Borrowing.jsx) |
| `LibraryCardsController.cs` | `/my-library-card` (MyLibraryCard.jsx) | `/admin/library-cards` |
| `UsersController.cs` | `/profile` (Profile.jsx) | `/admin/members` (Members.jsx) |
| `DashboardController.cs` | - | `/admin` (Dashboard.jsx) |
| `ReportsController.cs` | - | `/admin/reports` (Reports.jsx) |
| `SettingsController.cs` | - | `/admin/settings` (Settings.jsx) |
| `ActivityLogsController.cs` | - | `/admin/activity-logs` (ActivityLogs.jsx) |
| `NotificationsController.cs` | Component (NotificationBell.jsx) | - |

---

### **2. Kiến trúc 3 tầng - Ví dụ mượn sách**

```
1. User ấn nút "Mượn sách" tại BookDetails.jsx
         ↓
2. Frontend gọi: POST /api/Borrowings/borrow
         ↓
3. BorrowingsController.cs nhận request
   - Validate dữ liệu (FluentValidation)
   - Authorize (Check JWT token, role Reader)
         ↓
4. BorrowingService.cs xử lý business logic:
   - Kiểm tra thẻ thư viện còn hạn không
   - Kiểm tra user đã mượn max 3 sách chưa
   - Kiểm tra sách available không
   - Tính ngày hạn trả (BorrowDate + MaxBorrowDays)
         ↓
5. BorrowingRepository.cs truy xuất database:
   - Insert vào bảng Borrowings
   - Update BookItem.Status = "Borrowed"
         ↓
6. MySQL Database thực hiện transaction
         ↓
7. Return response về Frontend
   - Success: { borrowingId, dueDate }
   - Error: { message: "User đã mượn đủ 3 sách" }
         ↓
8. Frontend xử lý response:
   - Success: Alert "Mượn thành công", redirect /borrowing
   - Error: Alert message lỗi
```

---

### **3. Service Layer - Các Methods chính**

| Service | Methods Quan Trọng | Chức năng |
|---------|-------------------|-----------|
| `AuthService.cs` | `LoginAsync(username, password)` | Xác thực user, tạo JWT token |
| `BookService.cs` | `GetAllBooksAsync(search, filters)` | Lấy danh sách sách có search & filter |
| `BorrowingService.cs` | `BorrowAsync(request)` | Kiểm tra điều kiện mượn, tạo phiếu mượn |
| `ActivityLogService.cs` | `LogAsync(action, entity, id, desc)` | Ghi lại mọi hành động quan trọng |
| `ReportService.cs` | `GetBorrowingStatsAsync(from, to)` | Thống kê mượn trả theo khoảng thời gian |

---

### **4. Repository Layer - Data Access**

| Repository | Extends từ | Methods |
|-----------|-----------|---------|
| `BookRepository.cs` | `IBookRepository` | `GetAllAsync()`, `GetByIdAsync(id)`, `CreateAsync(book)`, `UpdateAsync(book)`, `DeleteAsync(id)` |
| `BorrowingRepository.cs` | `IBorrowingRepository` | `GetActiveByCardIdAsync(cardId)`, `GetHistoryByCardIdAsync(cardId)`, `GetOverdueAsync(cardId)` |
| `UserRepository.cs` | `IUserRepository` | `GetByUsernameAsync(username)`, `GetByEmailAsync(email)`, `CreateAsync(user)` |

**Lưu ý:** Tất cả Repository đều sử dụng **EF Core** với pattern:
- `.Include()` để load related data (eager loading)
- `.Where()` để filter
- `.OrderBy()`, `.OrderByDescending()` để sort
- `async/await` cho tất cả database operations

---

### **5. Entities & Database Schema**

**Bảng chính:**
- `Users` - Lưu thông tin người dùng (Admin, Librarian, Reader)
- `Books` - Thông tin sách (Title, ISBN, Description...)
- `BookItems` - Các bản sao vật lý của sách (1 Book có nhiều BookItems)
- `Borrowings` - Phiếu mượn sách
- `LibraryCards` - Thẻ thư viện (1 User có 1 Card)
- `ActivityLogs` - Nhật ký hoạt động hệ thống

**Quan hệ Many-to-Many:**
- `BookAuthor` - Book ↔ Author (1 sách nhiều tác giả)
- `BookGenre` - Book ↔ Genre (1 sách nhiều thể loại)

---

### **6. Authentication & Authorization Flow**

```
1. User login → POST /api/Auth/login
         ↓
2. AuthService verify password (BCrypt)
         ↓
3. Generate JWT Token với claims:
   - UserId: "123"
   - Username: "nghi123"
   - Role: "Reader"
   - Expiration: 24h
         ↓
4. Frontend lưu token: localStorage.setItem('token', token)
         ↓
5. Mọi request tiếp theo gửi header:
   Authorization: Bearer {token}
         ↓
6. Backend verify token → Extract UserId, Role
         ↓
7. Authorize endpoints:
   - [Authorize(Roles = "Admin")] → Chỉ Admin
   - [Authorize(Roles = "Admin,Librarian")] → Admin hoặc Librarian
   - [Authorize] → Bất kỳ user đã login
```

---

### **7. Error Handling & Validation**

**FluentValidation:**
- `BookValidator.cs` - Validate: Title required, ISBN format, Year > 0
- `AuthValidator.cs` - Validate: Username min 3 chars, Email format, Password min 6 chars

**Custom Exception:**
- `ApiException.cs` - Throw với statusCode + message
- `ErrorHandlingMiddleware.cs` - Catch tất cả exceptions → Return JSON response

**Ví dụ:**
```csharp
if (user.BorrowedBooksCount >= maxBooks)
    throw new ApiException(400, "Bạn đã mượn đủ 3 quyển sách");
```

Frontend nhận:
```json
{
  "statusCode": 400,
  "message": "Bạn đã mượn đủ 3 quyển sách"
}
```

---

## 💡 TIPS VIẾT BÁO CÁO

1. **Phần Kiến trúc hệ thống:** Copy sơ đồ 3-layer ở đầu file
2. **Phần Mô tả API:** Copy bảng Endpoints của từng module
3. **Phần Nghiệp vụ:** Copy phần "Flow" chi tiết từng tính năng
4. **Phần Database:** Copy phần Entities & Relations
5. **Phần Bảo mật:** Copy phần Authentication & Authorization Flow

---

📅 **Ngày tạo:** 23/11/2025  
👥 **Team:** Group 7 - Library Management System  
📚 **Project:** Library Management System - CNPM
