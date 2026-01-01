import React from "react";
import "../../styles/Admin/SideMenu.css";
import { useAuth } from "../../context/AuthContext";
import { message } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  GiftOutlined, // ⭐ THÊM
  CoffeeOutlined, // ⭐ ICON THỨC ĂN
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    message.success("Đăng xuất thành công");
    await logout();
  };

  const adminMenuItems = [
    { key: "/admin/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    {
      key: "/admin/promotions",
      label: "Khuyến mãi",
      icon: <GiftOutlined />,
    },
    {
      key: "/admin/foods",
      label: "Thức ăn & Combo",
      icon: <CoffeeOutlined />,
    },

    {
      key: "/admin/movie-management",
      label: "Phim",
      icon: <VideoCameraOutlined />,
    },
    { key: "/admin/showtimes", label: "Lịch chiếu", icon: <ScheduleOutlined /> },
    { key: "/admin/room-seat", label: "Phòng và Ghế", icon: <AppstoreOutlined /> },
    { key: "/admin/user", label: "Người dùng", icon: <UserOutlined /> },
    { key: "/admin/report", label: "Báo cáo", icon: <BarChartOutlined /> },
  ];

  const staffMenuItems = [
    { key: "/admin/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "/admin/check-in", label: "Soát vé", icon: <ScheduleOutlined /> },
    {
      key: "/admin/sale",
      label: "Bán vé",
      icon: <VideoCameraOutlined />,
    },
  ];

  const menuItems = user?.role === "staff" ? staffMenuItems : adminMenuItems;

  return (
    <div className="sidebar">
      {/* Logo Area */}
      <div className="sidebar-logo">
        🎬 <span>AdminPanel</span>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`menu-item ${location.pathname === item.key ? "active" : ""
              }`}
            onClick={item.onClick || (() => navigate(item.key))}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="sidebar-footer" onClick={handleLogout}>
        <LogoutOutlined className="logout-icon" />
        <span>Đăng xuất</span>
      </div>
    </div>
  );
}
