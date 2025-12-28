import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom'; 
import axiosInstance from '../../api/axiosInstance'; 

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      const { token, user } = response.data; 

      localStorage.setItem('accessToken', token);
      localStorage.setItem('userRole', user.role); 

      message.success('Đăng nhập thành công!');

      if (user.role === 'admin') {
        navigate('/admin/movies', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
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
        <Title level={3} style={{ textAlign: 'center' }}>Đăng nhập CinemaVerse</Title>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập Email!', type: 'email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
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
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        {}
        <div style={{ textAlign: 'center', marginTop: 10 }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;