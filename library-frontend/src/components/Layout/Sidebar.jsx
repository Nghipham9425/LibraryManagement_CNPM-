import { Nav } from "react-bootstrap"
import { NavLink, useLocation } from "react-router-dom"
import { FaHome, FaBook, FaUsers, FaExchangeAlt, FaTags } from "react-icons/fa"

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: "/admin", label: "Tổng quan", icon: FaHome },
    { path: "/admin/books", label: "Sách", icon: FaBook },
    { path: "/admin/authors", label: "Tác giả", icon: FaUsers },
    { path: "/admin/genres", label: "Thể loại", icon: FaTags },
    { path: "/admin/borrowing", label: "Mượn trả", icon: FaExchangeAlt },
    { path: "/admin/members", label: "Thành viên", icon: FaUsers },
  ]

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div
      style={{
        width: "250px",
        height: "500px",
        backgroundColor: "#fff",
        borderRight: "1px solid #e5e7eb",
        paddingTop: "1.5rem",
        overflowY: "auto",
      }}
    >
      {/* User Profile Section */}
      <div
        className="px-4 pb-4 mb-3"
        style={{ borderBottom: "1px solid #e5e7eb" }}
      >
        <div className="d-flex align-items-center">
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              flexShrink: 0,
            }}
          >
            <img
              src="https://ui-avatars.com/api/?name=T+Nghi&background=667eea&color=fff&size=40"
              alt="User Avatar"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#1f2937",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Ngh
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
              }}
            >
              Librarian
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <Nav className="flex-column px-3">
        {menuItems.map((item) => {
          const active = isActive(item.path)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1rem",
                marginBottom: "0.25rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: active ? "#3b82f6" : "#6b7280",
                backgroundColor: active ? "#eff6ff" : "transparent",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "#f9fafb"
                  e.currentTarget.style.color = "#1f2937"
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.color = "#6b7280"
                }
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "60%",
                    backgroundColor: "#3b82f6",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <item.icon
                size={18}
                style={{
                  marginRight: "12px",
                  flexShrink: 0,
                }}
              />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </Nav>
    </div>
  )
}

export default Sidebar

// Hide scrollbar for sidebar (cross-browser)
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.innerHTML = `
    .sidebar-no-scroll::-webkit-scrollbar { display: none; }
    .sidebar-no-scroll { scrollbar-width: none; ms-overflow-style: none; }
  `
  document.head.appendChild(style)
}
