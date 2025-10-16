import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./user/Header";
import Footer from "./user/Footer";

const Layout = () => (
  <div className="bg-light min-vh-100 d-flex flex-column">
    <Header />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
