import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  message,
  Row,
  Col,
  Button,
} from "antd";
import { useState } from "react";
import promotionService from "../../../services/Admin/promotionService";
import "../../../styles/Admin/PromotionManagement.css";

export default function CreatePromotionModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await promotionService.create({
        ...values,
        validFrom: values.time[0],
        validTo: values.time[1],
      });
      message.success("Tạo mã khuyến mãi thành công");
      form.resetFields();
      onSuccess();
      onClose();
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="TẠO MÃ KHUYẾN MÃI MỚI"
      onCancel={onClose}
      footer={null}
      className="promotion-modal" // Class quan trọng để ăn CSS
      width={650}
      centered
    >
      <Form form={form} layout="vertical" className="custom-form">
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã Code"
              rules={[{ required: true, message: "Nhập mã code" }]}
            >
              <Input
                placeholder="VD: SUMMER2025"
                style={{ textTransform: "uppercase", fontWeight: "bold" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="discountPercentage"
              label="Mức giảm (%)"
              rules={[{ required: true, message: "Nhập % giảm" }]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: "100%" }}
                addonAfter="%"
                placeholder="VD: 20"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={14}>
            <Form.Item
              name="time"
              label="Thời gian áp dụng"
              rules={[{ required: true, message: "Chọn thời gian" }]}
            >
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item name="usageLimit" label="Giới hạn số lượng">
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Để trống = không giới hạn"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả chương trình">
          <Input.TextArea
            rows={2}
            placeholder="VD: Giảm giá cho khách hàng mới..."
          />
        </Form.Item>

        {/* Custom Footer */}
        <div className="modal-footer-custom">
          <Button onClick={onClose} style={{ height: 40, borderRadius: 8 }}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={{
              height: 40,
              borderRadius: 8,
              background: "#2563eb",
              fontWeight: 600,
            }}
          >
            Tạo mã mới
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
