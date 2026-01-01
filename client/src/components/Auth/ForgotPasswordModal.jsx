import { Modal, Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import authService from "../../services/authService";

export default function ForgotPasswordModal({ visible, onClose }) {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await authService.forgotPassword(values.email);
            message.success("Email đặt lại mật khẩu đã được gửi!");
            onClose();
        } catch (err) {
            message.error(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Quên Mật Khẩu"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
        >
            <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email của bạn" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Gửi yêu cầu
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
