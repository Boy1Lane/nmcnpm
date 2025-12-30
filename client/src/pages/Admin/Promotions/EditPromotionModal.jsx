// import { Modal, Form, Input, InputNumber, DatePicker, message } from "antd";
// import { useEffect } from "react";
// import dayjs from "dayjs";
// import promotionService from "../../../services/Admin/promotionService";

// export default function EditPromotionModal({
//   open,
//   promotion,
//   onClose,
//   onSuccess,
// }) {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (promotion) {
//       form.setFieldsValue({
//         ...promotion,
//         time: [dayjs(promotion.validFrom), dayjs(promotion.validTo)],
//       });
//     }
//   }, [promotion]);

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       await promotionService.update(promotion.id, {
//         ...values,
//         validFrom: values.time[0],
//         validTo: values.time[1],
//       });
//       message.success("Cập nhật thành công");
//       onClose();
//       onSuccess();
//     } catch {
//       message.error("Cập nhật thất bại");
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       title="Sửa mã khuyến mãi"
//       onCancel={onClose}
//       onOk={handleSubmit}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item name="code" label="Mã">
//           <Input />
//         </Form.Item>

//         <Form.Item name="description" label="Mô tả">
//           <Input />
//         </Form.Item>

//         <Form.Item name="discountPercentage" label="Giảm (%)">
//           <InputNumber min={1} max={100} style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item name="usageLimit" label="Giới hạn lượt">
//           <InputNumber min={1} style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item name="time" label="Thời gian">
//           <DatePicker.RangePicker style={{ width: "100%" }} />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// }

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
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

// Import file CSS riêng cho Modal
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
      message.error("Cập nhật thất bại, vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={<span className="modal-title">✏️ Chỉnh sửa mã khuyến mãi</span>}
      onCancel={onClose}
      footer={null} // Tắt footer mặc định để tự custom
      className="promotion-modal" // Class để ăn CSS
      width={700} // Form rộng hơn cho đẹp
      centered
    >
      <Form form={form} layout="vertical" className="custom-form">
        <Row gutter={24}>
          {/* Cột 1: Mã Code */}
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã khuyến mãi"
              rules={[{ required: true, message: "Vui lòng nhập mã" }]}
            >
              <Input
                placeholder="VD: SALE50"
                style={{ textTransform: "uppercase", fontWeight: "bold" }}
              />
            </Form.Item>
          </Col>

          {/* Cột 2: Phần trăm giảm */}
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
                placeholder="1 - 100"
                addonAfter="%"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          {/* Cột 1: Thời gian */}
          <Col span={16}>
            <Form.Item
              name="time"
              label="Thời gian áp dụng"
              rules={[{ required: true, message: "Chọn khoảng thời gian" }]}
            >
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              />
            </Form.Item>
          </Col>

          {/* Cột 2: Giới hạn */}
          <Col span={8}>
            <Form.Item name="usageLimit" label="Giới hạn lượt dùng">
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Để trống là vô hạn"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng cuối: Mô tả */}
        <Form.Item name="description" label="Mô tả chi tiết">
          <Input.TextArea
            rows={3}
            placeholder="Nhập mô tả cho chương trình..."
          />
        </Form.Item>

        {/* Custom Footer Buttons */}
        <div className="modal-footer-custom">
          <Button
            onClick={onClose}
            icon={<CloseOutlined />}
            className="btn-cancel"
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            icon={<SaveOutlined />}
            className="btn-save"
          >
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
