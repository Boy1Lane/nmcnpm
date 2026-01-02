import { Outlet } from "react-router-dom";
import Header from "../components/Admin/Header.jsx";
import SideMenu from "../components/Admin/SideMenu.jsx";
import "../styles/Admin/AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* 1. Menu bên trái (Cố định full chiều cao) */}
      <SideMenu />

      {/* 2. Wrapper bên phải (Header + Nội dung) */}
      <div className="admin-main-wrapper">
        <Header />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
