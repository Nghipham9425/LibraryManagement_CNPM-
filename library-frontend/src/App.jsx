import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
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
import LibraryInfo from "./pages/user/LibraryInfo/LibraryInfo"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="library-info" element={<LibraryInfo />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
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
  )
}

export default App
