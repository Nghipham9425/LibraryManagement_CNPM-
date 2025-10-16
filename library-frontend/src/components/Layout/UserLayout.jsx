// src/components/Layout/UserLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

// Import Header và Footer từ cùng thư mục
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const UserLayout = () => {
  return (
    <div>
      <Header /> {/* Header sẽ luôn hiển thị */}
      
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        {/* Nội dung của trang con (Home, Login, Profile...) sẽ được render ở đây */}
        <Outlet />
      </main>

      <Footer /> {/* Footer sẽ luôn hiển thị */}
    </div>
  );
};

export default UserLayout;