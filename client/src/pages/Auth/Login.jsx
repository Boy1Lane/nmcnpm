import { Card, Form, Input, Button, message } from "antd";
import { useNavigate, Navigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // Thêm icon cho đẹp
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Auth/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  // // ✅ CHẶN: nếu đã đăng nhập thì không render form login nữa
  // if (!loading && user) {
  //   if (user.role === "admin") return <Navigate to="/dashboard" replace />;
  //   return <Navigate to="/" replace />;
  // }

  const onFinish = async (values) => {
    try {
      console.log("🔵 FE gửi login values:", values); // ⭐ LOG 1
      const res = await authService.login(values);

      console.log("🟢 FE nhận response:", res.data); // ⭐ LOG 2

      // ⭐ LOG TOKEN Ở ĐÂY
      console.log("🔑 ACCESS TOKEN FE nhận:", res.data.accessToken);

      // ✅ LƯU ĐÚNG user + token
      console.log("🟡 FE lưu user:", res.data.user); // ⭐ LOG 3
      login(res.data.user, res.data.accessToken);

      // ⭐ LOG TOKEN SAU KHI LƯU
      console.log(
        "📦 TOKEN TRONG localStorage:",
        localStorage.getItem("accessToken")
      );

      message.success("Đăng nhập thành công");

      // ✅ ĐIỀU HƯỚNG THEO ROLE
      const role = res.data.user.role;
      if (role === "customer") {
        navigate("/");
        // navigate(0); // Optional: reload để cập nhật state nếu cần
      } else if (role === "admin" || role === "staff") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="auth-wrapper">
      <Card className="auth-card">
        <div className="auth-title">Đăng Nhập Hệ Thống</div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập đúng định dạng email!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block className="auth-btn">
            Đăng nhập
          </Button>

          <div className="auth-footer">
            Chưa có tài khoản? <a href="/register">Đăng ký</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
