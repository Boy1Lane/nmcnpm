import "../../styles/Admin/SideMenu.css";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    {
      key: "/movie-management",
      label: "Quản lý phim",
      icon: <VideoCameraOutlined />,
    },
    { key: "/showtimes", label: "Lịch chiếu", icon: <ScheduleOutlined /> },
    { key: "/room-seat", label: "Phòng & Ghế", icon: <AppstoreOutlined /> },
    { key: "/user", label: "Người dùng", icon: <UserOutlined /> },
    { key: "/report", label: "Báo cáo", icon: <BarChartOutlined /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        🎬 <span>AdminPanel</span>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`menu-item ${
              location.pathname === item.key ? "active" : ""
            }`}
            onClick={() => navigate(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <LogoutOutlined className="logout-icon" />
        <span>Đăng xuất</span>
      </div>
    </div>
  );
}
