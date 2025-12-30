import { Modal, Form, Input, Select, message, Row, Col } from "antd";
import { useEffect } from "react";
import userService from "../../../services/Admin/userServices";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function EditUserModal({ open, onClose, onSuccess, user }) {
  const [form] = Form.useForm();

  // --- LOGIC GIỮ NGUYÊN ---
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await userService.update(user.id, values);
      message.success("Cập nhật thành công");
      onSuccess();
      onClose();
    } catch {
      message.error("Cập nhật thất bại");
    }
  };
  // ------------------------

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#1e293b",
          }}
        >
          <UserOutlined style={{ color: "#1890ff" }} />
          <span>Cập nhật thông tin nhân sự</span>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Lưu thay đổi"
      cancelText="Hủy bỏ"
      width={650} // Tăng chiều rộng cho thoáng
      centered
      okButtonProps={{
        style: { background: "#1890ff", borderColor: "#1890ff" },
      }}
    >
      <Form
        layout="vertical"
        form={form}
        size="large" // Input to hơn, dễ bấm hơn
        style={{ marginTop: "20px" }}
      >
        {/* Hàng 1: Họ tên + Số điện thoại (Chia 2 cột) */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Họ tên"
              name="fullName"
              rules={[{ required: true, message: "Nhập họ tên" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Nhập họ tên đầy đủ"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: "Nhập số điện thoại" }]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="09xx..."
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 2: Email (Full chiều rộng) */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="example@gmail.com"
          />
        </Form.Item>

        {/* Hàng 3: Vai trò */}
        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Chọn vai trò" }]}
        >
          <Select
            placeholder="Chọn quyền hạn cho tài khoản"
            suffixIcon={
              <SafetyCertificateOutlined style={{ color: "#bfbfbf" }} />
            }
          >
            <Option value="admin">Quản trị viên (Admin)</Option>
            <Option value="staff">Nhân viên (Staff)</Option>
            <Option value="customer">Khách hàng (Customer)</Option>
            {/* Bạn có thể thêm Option customer nếu cần */}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
