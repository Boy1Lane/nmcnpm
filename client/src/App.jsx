import "../src/App.css";
import { Menu } from "antd";
import "antd/dist/antd.css";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import {
  HomeOutlined,
  VideoCameraOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BoldOutlined,
} from "@ant-design/icons";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100vh",
      }}
    >
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <SideMenu />
        <Content />
      </div>
      <Footer />
    </div>
  );
}
function Header() {
  return (
    <div
      style={{
        height: 60,
        backgroundColor: "lightskyblue",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
      }}
    >
      Header
    </div>
  );
}
function Footer() {
  return (
    <div
      style={{
        height: 60,
        backgroundColor: "lightskyblue",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
      }}
    >
      Footer
    </div>
  );
}
function SideMenu() {
  const navigate = useNavigate();
  return (
    <div style={{ width: 220, height: "100%", background: "white" }}>
      <Menu
        style={{
          height: "100%", // ⭐ CŨNG BẮT BUỘC
          borderRight: 0,
        }}
        onClick={({ key }) => {
          if (key === "/dangXuat") {
            alert("Bạn đã đăng xuất!"); // to do
          } else {
            navigate(key);
          }
        }}
        items={[
          {
            label: "Dashboard",
            key: "/dashboard",
            icon: <DashboardOutlined />,
          },
          {
            label: "Quản lý phim",
            key: "/quanLyPhim",
            icon: <VideoCameraOutlined />,
          },
          {
            label: "Lịch chiếu",
            key: "/lichChieu",
            icon: <ScheduleOutlined />,
          },
          {
            label: "Phòng và ghế",
            key: "/phongVaGhe",
            icon: <AppstoreOutlined />,
          },
          { label: "Người dùng", key: "/nguoiDung", icon: <UserOutlined /> },
          { label: "Báo cáo", key: "/baoCao", icon: <BarChartOutlined /> },
          {
            label: "Đăng xuất",
            key: "/dangXuat",
            icon: <LogoutOutlined />,
            danger: true,
          },
        ]}
      ></Menu>
    </div>
  );
}
function Content() {
  return (
    <div
      style={{ flex: 1, padding: 20, background: "#4b144bff", color: "white" }}
    >
      <Routes>
        <Route path="/" element={<div></div>}></Route>
        <Route path="/Dashboard" element={<div></div>}></Route>
        <Route path="/quanLyPhim" element={<div></div>}></Route>
        <Route path="/lichChieu" element={<div></div>}></Route>
        <Route path="/phongVaGhe" element={<div></div>}></Route>
        <Route path="/nguoiDung" element={<div></div>}></Route>
        <Route path="/dangXuat" element={<div></div>}></Route>
      </Routes>
    </div>
  );
}

export default App;
