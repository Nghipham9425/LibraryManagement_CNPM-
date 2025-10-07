import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBook, FaUsers, FaExchangeAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Tổng Quan', icon: FaHome },
    { path: '/books', label: 'Quản Lý Sách', icon: FaBook },
    { path: '/members', label: 'Quản Lý Thành Viên', icon: FaUsers },
    { path: '/borrowing', label: 'Quản Lý Mượn Trả', icon: FaExchangeAlt },
  ];

  return (
    <div className="sidebar bg-light border-end">
      <Nav className="flex-column p-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center py-3 px-3 mb-2 rounded ${
                isActive ? 'active bg-primary text-white' : 'text-dark'
              }`
            }
          >
            <item.icon className="me-3" size={20} />
            <span className="fw-semibold">{item.label}</span>
          </NavLink>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
