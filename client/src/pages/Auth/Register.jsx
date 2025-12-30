import { Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons"; // Thêm icon
import authService from "../../services/authService";
import "../../styles/Auth/Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await authService.register(values);
      message.success("Đăng ký thành công");
      navigate("/login");
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="auth-wrapper">
      <Card className="auth-card">
        {/* Tiêu đề đẹp hơn */}
        <div className="auth-title">Đăng Ký Tài Khoản</div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          size="large" // Form to rõ hơn
          className="auth-form"
        >
          {/* Họ tên */}
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          {/* Số điện thoại */}
          <Form.Item name="phone">
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          {/* Nút Đăng ký */}
          <Button type="primary" htmlType="submit" block className="auth-btn">
            Đăng ký
          </Button>

          {/* Chuyển qua Login */}
          <div className="auth-footer">
            Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
