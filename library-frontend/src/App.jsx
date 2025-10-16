import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Layouts ---
import AdminLayout from "./components/Layout/Layout.jsx";
import UserLayout from "./components/Layout/UserLayout.jsx";

// --- Authentication ---
import ProtectedRoute from "./components/Auth/ProtectedRoute";
// Giả sử bạn sẽ tạo một file tương tự cho Admin
// import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute"; 

// --- User-Facing Pages ---
import Home from "./user/pages/Home.jsx";
import SearchBooks from "./user/pages/SearchBooks.jsx";
import BookCategories from "./user/pages/BookCategories.jsx";
import CategoryPage from "./user/pages/CategoryPage.jsx";
import BookDetails from "./user/pages/BookDetails.jsx";
import LibraryInfo from "./user/pages/LibraryInfo.jsx";
import RegisterReader from "./user/pages/RegisterReader.jsx";
import Login from "./user/pages/Login.jsx";
import Profile from "./user/pages/Profile.jsx";

// --- Admin Pages ---
import AdminLogin from "./pages/AdminLogin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Books from "./pages/Books.jsx";
import Authors from "./pages/Authors.jsx";
import Genres from "./pages/Genres.jsx";
import Borrowing from "./pages/Borrowing.jsx";
import Members from "./pages/Members.jsx";
import LibraryCards from "./pages/LibraryCards.jsx"; 

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <Routes>
        {/* ======================= USER ROUTES ================================= */}
        <Route path="/" element={<UserLayout />}>
          {/* --- Public User Routes --- */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<RegisterReader />} />
          <Route path="search" element={<SearchBooks />} />
          <Route path="categories" element={<BookCategories />} />
          <Route path="categories/:categoryName" element={<CategoryPage />} />
          <Route path="book/:id" element={<BookDetails />} />
          <Route path="library-info" element={<LibraryInfo />} />

          {/* --- Protected User Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ======================= ADMIN ROUTES ================================ */}
        {/* --- Public Admin Route --- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* --- Protected Admin Panel --- */}
        {/* 💡 Bọc các route admin trong một Protected Route riêng */}
        <Route element={<ProtectedRoute />}> {/* Thay bằng AdminProtectedRoute sau này */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="authors" element={<Authors />} />
            <Route path="genres" element={<Genres />} />
            <Route path="borrowing" element={<Borrowing />} />
            <Route path="members" element={<Members />} />
            <Route path="library-cards" element={<LibraryCards />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;