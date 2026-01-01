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
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import promotionService from "../../../services/Admin/promotionService";
import "../../../styles/Admin/PromotionManagement.css";

export default function EditPromotionModal({
  open,
  promotion,
  onClose,
  onSuccess,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promotion && open) {
      form.setFieldsValue({
        ...promotion,
        time: [
          promotion.validFrom ? dayjs(promotion.validFrom) : null,
          promotion.validTo ? dayjs(promotion.validTo) : null,
        ],
      });
    }
  }, [promotion, open, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await promotionService.update(promotion.id, {
        ...values,
        validFrom: values.time[0],
        validTo: values.time[1],
      });
      message.success("Cập nhật thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="CẬP NHẬT MÃ KHUYẾN MÃI"
      onCancel={onClose}
      footer={null}
      className="promotion-modal"
      width={650}
      centered
    >
      <Form form={form} layout="vertical" className="custom-form">
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã Code"
              rules={[{ required: true, message: "Vui lòng nhập mã" }]}
            >
              <Input
                style={{ textTransform: "uppercase", fontWeight: "bold" }}
                disabled // Thường mã code không cho sửa khi đã tạo
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="discountPercentage"
              label="Mức giảm (%)"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: "100%" }}
                addonAfter="%"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={14}>
            <Form.Item
              name="time"
              label="Thời gian áp dụng"
              rules={[{ required: true }]}
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

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={2} />
        </Form.Item>

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
            Lưu Thay Đổi
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
