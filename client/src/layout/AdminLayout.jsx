import { Outlet } from "react-router-dom";
import Header from "../components/Admin/Header.jsx";
import Footer from "../components/Admin/Footer.jsx";
import SideMenu from "../components/Admin/SideMenu.jsx";
import "../styles/Admin/AdminLayout.css";
export default function AdminLayout() {
  return (
    <div className="layout-container">
      <Header />

      <div className="layout-main">
        <SideMenu />

        <div className="layout-content">
          {/* ⭐ Đây là nơi render page con (phần tím của bạn) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
