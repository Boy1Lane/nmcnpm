import { useEffect, useState } from "react";
import "../../styles/Admin/Header.css";
import { UserOutlined } from "@ant-design/icons";

export default function Header() {
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.fullName || user.email || "Admin");
      } catch {
        setUserName("Admin");
      }
    }
  }, []);

  return (
    <div className="header-container">
      {/* ✔ Bên trái để trống */}
      <div className="header-left"></div>

      {/* ✔ Bên phải */}
      <div className="header-right">
        <span className="welcome-text">
          Xin chào, <b>{userName}</b>
        </span>

        <div className="avatar-box">
          <UserOutlined className="avatar-icon" />
        </div>
      </div>
    </div>
  );
}
