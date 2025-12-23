import { Modal, Form, Input, Select, message } from "antd";
import userService from "../../../services/Admin/userServices";

const { Option } = Select;

export default function CreateUserModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();

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

  return (
    <Modal
      title="Thêm nhân sự mới"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Tạo"
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
          rules={[
            { required: false }, // hoặc true nếu bạn muốn bắt buộc
            {
              pattern: /^[0-9]{9,11}$/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input placeholder="" />
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
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Nhập mật khẩu" }]}
        >
          <Input.Password />
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
