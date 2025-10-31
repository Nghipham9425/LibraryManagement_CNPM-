import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./contexts/AuthContext"
import AdminProtectedRoute from "./components/AdminProtectedRoute"
import UserProtectedRoute from "./components/UserProtectedRoute"
import AdminLayout from "./components/Layout/admin/Layout"
import Dashboard from "./pages/admin/management/Dashboard"
import Books from "./pages/admin/management/Books"
import Members from "./pages/admin/management/Members"
import Borrowing from "./pages/admin/management/Borrowing"
import Authors from "./pages/admin/management/Authors"
import Genres from "./pages/admin/management/Genres"
import AdminLogin from "./pages/admin/auth/AdminLogin"
import Layout from "./components/Layout/Layout"
import Home from "./pages/user/Home/Home"
import Login from "./pages/user/Auth/Login"
import Register from "./pages/user/Auth/Register"
import UserBooks from "./pages/user/Books/Books"
import UserAuthors from "./pages/user/Authors/Authors"
import UserGenres from "./pages/user/Genres/Genres"
import Contact from "./pages/user/Contact/Contact"
import BookDetails from "./pages/user/BookDetails/BookDetails"
import LibraryInfo from "./pages/user/LibraryInfo/LibraryInfo"
import Library3D from "./pages/user/Library3D/Library3D"
import UserBorrowing from "./pages/user/Borrowing/Borrowing"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="books" element={<UserBooks />} />
            <Route path="books/:id" element={<BookDetails />} />
            <Route path="authors" element={<UserAuthors />} />
            <Route path="genres" element={<UserGenres />} />
            <Route path="borrowing" element={
              <UserProtectedRoute>
                <UserBorrowing />
              </UserProtectedRoute>
            } />
            <Route path="contact" element={<Contact />} />
            <Route path="library-info" element={<LibraryInfo />} />
          </Route>
          <Route path="/library-3d" element={<Library3D />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/auth" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="authors" element={<Authors />} />
            <Route path="genres" element={<Genres />} />
            <Route path="borrowing" element={<Borrowing />} />
            <Route path="members" element={<Members />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
