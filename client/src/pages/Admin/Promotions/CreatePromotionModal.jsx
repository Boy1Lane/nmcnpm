import { Modal, Form, Input, InputNumber, DatePicker, message } from "antd";
import promotionService from "../../../services/Admin/promotionService";

export default function CreatePromotionModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await promotionService.create({
        ...values,
        validFrom: values.time[0],
        validTo: values.time[1],
      });
      message.success("Tạo khuyến mãi thành công");
      form.resetFields();
      onClose();
      onSuccess();
    } catch {
      message.error("Tạo thất bại");
    }
  };

  return (
    <Modal
      open={open}
      title="Thêm mã khuyến mãi"
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="code" label="Mã" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input />
        </Form.Item>

        <Form.Item
          name="discountPercentage"
          label="Giảm (%)"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={100} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="usageLimit" label="Giới hạn lượt">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="time"
          label="Thời gian áp dụng"
          rules={[{ required: true }]}
        >
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
