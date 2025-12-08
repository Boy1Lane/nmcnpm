import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

export default function SideMenu() {
  const navigate = useNavigate();

  return (
    <div style={{ width: 220, height: "100%", background: "white" }}>
      <Menu
        style={{ height: "100%", borderRight: 0 }}
        onClick={({ key }) => navigate(key)}
        items={[
          { label: "Dashboard", key: "dashboard", icon: <DashboardOutlined /> },
          {
            label: "Quản lý phim",
            key: "movie-management",
            icon: <VideoCameraOutlined />,
          },
          { label: "Lịch chiếu", key: "lichChieu", icon: <ScheduleOutlined /> },
          {
            label: "Phòng và ghế",
            key: "phongVaGhe",
            icon: <AppstoreOutlined />,
          },
          { label: "Người dùng", key: "nguoiDung", icon: <UserOutlined /> },
          { label: "Báo cáo", key: "baoCao", icon: <BarChartOutlined /> },
          {
            label: "Đăng xuất",
            key: "dangXuat",
            icon: <LogoutOutlined />,
            danger: true,
          },
        ]}
      />
    </div>
  );
}
