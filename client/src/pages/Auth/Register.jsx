import { Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

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
    <div style={styles.wrapper}>
      <Card title="Đăng ký tài khoản" style={styles.card}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
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
  card: { width: 420 },
};
