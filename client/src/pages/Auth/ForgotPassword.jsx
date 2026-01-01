import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import "../../styles/Auth/Auth.css";

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await authService.forgotPassword(values.email);
            message.success("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.");
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <Card className="auth-card">
                <div className="auth-title">Quên Mật Khẩu</div>
                <Text type="secondary" style={{ display: "block", marginBottom: 20, textAlign: "center" }}>
                    Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                </Text>

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
                        <Input prefix={<UserOutlined />} placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading} className="auth-btn">
                        Gửi Yêu Cầu
                    </Button>

                    <div className="auth-footer">
                        <Link to="/login">Quay lại Đăng nhập</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
