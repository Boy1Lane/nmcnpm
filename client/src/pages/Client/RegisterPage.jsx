import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; 

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gọi API Đăng ký: POST /auth/register
      await axiosInstance.post('/auth/register', {
        // 🛑 ĐIỀU CHỈNH TẠI ĐÂY: Gửi dữ liệu dưới tên trường 'fullName' để khớp với User Model
        fullName: values.name, 
        email: values.email,
        password: values.password,
        // Role mặc định khi đăng ký là 'customer'
        role: 'customer', 
      });

      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      
      // Chuyển hướng người dùng đến trang Đăng nhập
      navigate('/login');
      
    } catch (error) {
      console.error("Registration Error:", error);
      
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message; 
      } else if (error.message === 'Network Error') {
        errorMessage = 'Không thể kết nối đến máy chủ Backend.';
      }
      
      message.error(errorMessage); 
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center' }}>Đăng ký Tài khoản</Title>
        <Form
          name="register_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ tên của bạn" />
          </Form.Item>
          
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập Email!', type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Địa chỉ email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;