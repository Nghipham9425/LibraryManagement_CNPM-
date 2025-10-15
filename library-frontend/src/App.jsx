import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "./components/Layout/Layout"
import Dashboard from "./pages/admin/management/Dashboard"
import Books from "./pages/admin/management/Books"
import Members from "./pages/admin/management/Members"
import Borrowing from "./pages/admin/management/Borrowing"
import Authors from "./pages/admin/management/Authors"
import Genres from "./pages/admin/management/Genres"
import Login from "./pages/user/auth/Login"
import Register from "./pages/user/auth/Register"
import AdminLogin from "./pages/admin/auth/AdminLogin"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/" element={<Layout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/books" element={<Books />} />
          <Route path="/admin/authors" element={<Authors />} />
          <Route path="/admin/genres" element={<Genres />} />
          <Route path="/admin/borrowing" element={<Borrowing />} />
          <Route path="/admin/members" element={<Members />} />
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
