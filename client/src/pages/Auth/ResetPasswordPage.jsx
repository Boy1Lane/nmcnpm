import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout, Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import authService from '../../services/authService';

const { Content } = Layout;
const { Title } = Typography;

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Nếu không có token, chuyển về trang chủ hoặc login
    if (!token) {
        return (
            <div style={{ padding: 50, textAlign: 'center', color: '#fff' }}>
                <Title level={3} style={{ color: '#fff' }}>Token không hợp lệ</Title>
                <Button onClick={() => navigate('/')}>Về trang chủ</Button>
            </div>
        )
    }

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await authService.resetPassword(token, values.password);
            message.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundImage: 'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop)', backgroundSize: 'cover' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <Card style={{ width: 400, padding: 20, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Title level={2} style={{ marginBottom: 20, color: '#e50914' }}>ĐẶT LẠI MẬT KHẨU</Title>

                    <Form
                        name="reset_password"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên!' }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận lại mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block size="large" danger>
                                CẬP NHẬT MẬT KHẨU
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default ResetPasswordPage;
