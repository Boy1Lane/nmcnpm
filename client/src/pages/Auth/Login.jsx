import { Card, Form, Input, Button, message, Divider } from "antd";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // Thêm icon cho đẹp
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Auth/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading } = useAuth();

  // // ✅ CHẶN: nếu đã đăng nhập thì không render form login nữa
  // if (!loading && user) {
  //   if (user.role === "admin") return <Navigate to="/dashboard" replace />;
  //   return <Navigate to="/" replace />;
  // }

  const handleNavigate = (role) => {
    // 1. Check sessionStorage (Highest priority)
    const returnUrl = sessionStorage.getItem('returnUrl');
    if (returnUrl) {
      sessionStorage.removeItem('returnUrl');
      navigate(returnUrl, { replace: true });
      return;
    }

    // 2. Check location state (Backup)
    const state = location.state;
    if (state?.from) {
      navigate(state.from, { replace: true });
      return;
    }

    // 3. Default redirect based on role
    if (role === "customer") navigate("/");
    else navigate("/admin/dashboard");
  };

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
      handleNavigate(res.data.user.role);
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await authService.loginWithGoogle(credentialResponse.credential);
      login(res.data.user, res.data.accessToken);
      message.success("Google Login Successful");
      handleNavigate(res.data.user.role);
    } catch (err) {
      message.error("Google Login Failed: " + (err.response?.data?.message || err.message));
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

          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <Button type="primary" htmlType="submit" block className="auth-btn">
            Đăng nhập
          </Button>

          <Divider>HOẶC</Divider>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log("Login Failed");
                message.error("Login Failed");
              }}
            />
          </div>

          <div className="auth-footer">
            Chưa có tài khoản? <a href="/register">Đăng ký</a>
          </div>
        </Form>
      </Card>
    </div >
  );
}
