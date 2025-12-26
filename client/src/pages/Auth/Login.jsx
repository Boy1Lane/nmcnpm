import { Card, Form, Input, Button, message } from "antd";
import { useNavigate, Navigate } from "react-router-dom";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  // ✅ CHẶN: nếu đã đăng nhập thì không render form login nữa
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
      if (res.data.user.role === "customer") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div style={styles.wrapper}>
      <Card title="Đăng nhập" style={styles.card}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>

          <div style={{ marginTop: 12, textAlign: "center" }}>
            Chưa có tài khoản? <a href="/register">Đăng ký</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  card: { width: 380 },
};
