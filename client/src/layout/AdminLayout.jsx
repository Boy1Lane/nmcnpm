import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";
import "../styles/AdminLayout.css";
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

      <Footer />
    </div>
  );
}
