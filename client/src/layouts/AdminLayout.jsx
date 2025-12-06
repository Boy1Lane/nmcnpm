// Outlet là nơi hiển thị trang con bên trong Layout
// Link dùng để tạo menu chuyển trang
import { Outlet, Link } from "react-router-dom";

// Import CSS riêng cho layout admin
import "../styles/adminLayout.css";

export default function AdminLayout() {
  return (
    // Layout tổng: sidebar + nội dung
    <div className="admin-layout">

      {/* Sidebar bên trái */}
      <aside className="admin-sidebar">
        <h2>CinemaVerse</h2>

        {/* Menu chuyển trang */}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/movies">Movies</Link>
      </aside>

      {/* Nội dung thay đổi tùy theo route */}
      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}
