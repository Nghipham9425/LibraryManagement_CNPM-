// src/components/Layout/UserLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader.jsx'; // <-- SỬA LẠI IMPORT
import Footer from './Footer.jsx';

const UserLayout = () => {
  return (
    <div>
      <UserHeader /> {/* <-- SỬA LẠI COMPONENT */}
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;