import { useState } from "react";
import { Modal, Input, Form, message } from "antd";
import cinemaService from "../../../services/Admin/cinemaService";
import "../../../styles/Admin/Room.css";

function CreateCinemaModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        name: values.name,
        address: values.address || "",
      };

      await cinemaService.create(payload);
      message.success("Đã tạo rạp");
      form.resetFields();
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      if (err.errorFields) {
        // validation error handled by antd
      } else {
        console.error(err);
        message.error("Tạo rạp thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Tạo rạp chiếu"
      onOk={handleOk}
      onCancel={onClose}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: "", address: "" }}
      >
        <Form.Item
          label="Tên rạp"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên rạp" }]}
        >
          <Input placeholder="Ví dụ: Rạp A" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Địa chỉ (tùy chọn)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateCinemaModal;
