import { Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import userService from "../../../services/Admin/userServices";

const { Option } = Select;

export default function EditUserModal({ open, onClose, onSuccess, user }) {
  const [form] = Form.useForm();

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

  return (
    <Modal
      title="Cập nhật nhân sự"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Nhập họ tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Chọn vai trò" }]}
        >
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="staff">Staff</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
