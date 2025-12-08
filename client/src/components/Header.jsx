import "../styles/Header.css";
import { UserOutlined } from "@ant-design/icons";

export default function Header() {
  return (
    <div className="header-container">
      {/* ✔ Bên trái để trống */}
      <div className="header-left"></div>

      {/* ✔ Bên phải giữ nguyên */}
      <div className="header-right">
        <span className="welcome-text">
          Xin chào, <b>Admin</b>
        </span>

        <div className="avatar-box">
          <UserOutlined className="avatar-icon" />
        </div>
      </div>
    </div>
  );
}
