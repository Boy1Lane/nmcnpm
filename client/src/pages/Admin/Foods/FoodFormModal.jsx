import { Modal, Form, Input, InputNumber, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import foodService from "../../../services/Admin/foodService";

export default function FoodFormModal({
  open,
  onCancel,
  onSuccess,
  initialData,
}) {
  const [form] = Form.useForm();

  // =====================
  // SET FORM DATA KHI EDIT
  // =====================
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        price: initialData.price,
        items: initialData.items,
        image: initialData.pictureUrl
          ? {
              fileList: [
                {
                  uid: "-1",
                  name: "image.png",
                  status: "done",
                  url: initialData.pictureUrl,
                },
              ],
            }
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  // =====================
  // SUBMIT FORM
  // =====================
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        price: values.price,
        items: values.items,
        imageFile: values.image?.fileList?.[0]?.originFileObj,
      };

      if (initialData) {
        await foodService.update(initialData.id, payload);
        message.success("Cập nhật combo thành công");
      } else {
        await foodService.create(payload);
        message.success("Tạo combo thành công");
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      title={initialData ? "Sửa combo" : "Thêm combo"}
      okText="Lưu"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        {/* ===== NAME ===== */}
        <Form.Item
          label="Tên combo"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên combo" }]}
        >
          <Input />
        </Form.Item>

        {/* ===== ITEMS ===== */}
        <Form.Item
          label="Mô tả (items)"
          name="items"
          rules={[{ required: true, message: "Vui lòng nhập mô tả combo" }]}
        >
          <Input />
        </Form.Item>

        {/* ===== PRICE ===== */}
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          />
        </Form.Item>

        {/* ===== IMAGE ===== */}
        <Form.Item
          label="Ảnh combo"
          name="image"
          rules={[
            {
              required: !initialData,
              message: "Vui lòng chọn ảnh combo",
            },
          ]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // ❌ không auto upload
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
