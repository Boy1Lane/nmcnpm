import { Modal, Form, Input, Select, message, Row, Col } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import userService from "../../../services/Admin/userServices";
import "../../../styles/Admin/UserManagement.css";

const { Option } = Select;

export default function CreateUserModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();

  // --- LOGIC GIỮ NGUYÊN ---
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await userService.create(values);
      message.success("Thêm nhân sự thành công");
      form.resetFields();
      onSuccess();
      onClose();
    } catch (err) {
      message.error("Thêm nhân sự thất bại");
    }
  };
  // ------------------------

  return (
    <Modal
      title={
        <div className="modal-header">
          <UserAddOutlined className="modal-icon" />
          <span className="modal-title">Thêm nhân sự mới</span>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Tạo tài khoản"
      cancelText="Hủy bỏ"
      width={700}
      centered
      okButtonProps={{ className: "btn-submit" }}
      cancelButtonProps={{ className: "btn-cancel" }}
    >
      <Form layout="vertical" form={form} size="large" className="modal-form">
        {/* Dòng 1: Họ tên + SĐT */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Họ tên"
              name="fullName"
              rules={[{ required: true, message: "Nhập họ tên" }]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: false },
                {
                  pattern: /^[0-9]{9,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="input-icon" />}
                placeholder="Ví dụ: 0901234567"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Dòng 2: Email + Vai trò */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-icon" />}
                placeholder="example@gmail.com"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Chọn vai trò" }]}
            >
              <Select
                placeholder="Chọn quyền hạn"
                suffixIcon={
                  <SafetyCertificateOutlined className="input-icon" />
                }
              >
                <Option value="admin">Quản trị viên (Admin)</Option>
                <Option value="staff">Nhân viên (Staff)</Option>
                <Option value="customer">Khách hàng (Customer)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Dòng 3: Mật khẩu */}
        <Form.Item
          label="Mật khẩu khởi tạo"
          name="password"
          rules={[{ required: true, message: "Nhập mật khẩu" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="input-icon" />}
            placeholder="Nhập mật khẩu..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
