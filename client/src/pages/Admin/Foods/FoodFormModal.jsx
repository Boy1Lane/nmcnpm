import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  CloseOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import ImageCropper from "../../../components/Admin/ImageCropper";
import foodService from "../../../services/Admin/foodService";
import "../../../styles/Admin/FoodManagement.css";

export default function FoodFormModal({
  open,
  onCancel,
  onSuccess,
  initialData,
}) {
  const [form] = Form.useForm();
  const [cropVisible, setCropVisible] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  // =====================
  // SET FORM DATA KHI EDIT
  // =====================
  useEffect(() => {
    if (initialData) {
      const list = initialData.pictureUrl
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: initialData.pictureUrl,
            },
          ]
        : [];

      form.setFieldsValue({
        name: initialData.name,
        price: initialData.price,
        items: initialData.items,
        image: { fileList: list },
      });

      setFileList(list); // ✅ QUAN TRỌNG
    } else {
      form.resetFields();
      setFileList([]);
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
      message.error("Có lỗi xảy ra hoặc vui lòng điền đầy đủ thông tin");
    }
  };

  const beforeImageUpload = (file) => {
    // open cropper on selection
    const url = URL.createObjectURL(file);
    setPendingFile(file);
    setCropSrc(url);
    setCropVisible(true);
    return Upload.LIST_IGNORE;
  };

  const onCropDone = (blob) => {
    if (!blob) return;

    const file = new File([blob], pendingFile.name, { type: "image/jpeg" });

    const newFileList = [
      {
        uid: Date.now().toString(),
        name: file.name,
        status: "done",
        originFileObj: file,
        url: URL.createObjectURL(blob),
      },
    ];

    setFileList(newFileList); // ✅
    form.setFieldsValue({ image: { fileList: newFileList } });

    setCropVisible(false);
    setCropSrc(null);
    setPendingFile(null);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="custom-modal"
      closeIcon={<CloseOutlined style={{ color: "white" }} />}
    >
      <div className="modal-header-bg">
        {initialData ? "CHỈNH SỬA THÔNG TIN" : "THÊM COMBO / MÓN MỚI"}
      </div>

      <div className="modal-body">
        <Form layout="vertical" form={form} size="large">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Tên combo"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên combo" }]}
              >
                <Input placeholder="Ví dụ: Combo Vui Vẻ " />
              </Form.Item>

              <Form.Item
                label="Giá bán (VND)"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập giá tiền"
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="₫"
                />
              </Form.Item>

              <Form.Item
                label="Mô tả chi tiết (Các món trong combo)"
                name="items"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Ví dụ: 1 Bắp phô mai + 2 Pepsi"
                />
              </Form.Item>
            </Col>

            {/* Cột Upload ảnh - Chú trọng hiển thị */}
            <Col span={8}>
              <Form.Item
                label="Hình ảnh (Tỷ lệ 2:3)"
                name="image"
                rules={[{ required: !initialData, message: "Cần chọn ảnh" }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList} // ✅ BẮT BUỘC
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={beforeImageUpload}
                  onPreview={(file) => {
                    Modal.info({
                      title: "Xem trước hình ảnh",
                      content: (
                        <img
                          src={file.url || file.thumbUrl}
                          alt="preview"
                          style={{ width: "100%" }}
                        />
                      ),
                      width: 400,
                    });
                  }}
                >
                  {fileList.length >= 1 ? null : (
                    <div style={{ textAlign: "center" }}>
                      <InboxOutlined
                        style={{ fontSize: 24, color: "#2563eb" }}
                      />
                      <div style={{ marginTop: 8, fontSize: 12 }}>Chọn ảnh</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              {/* Image Cropper Logic giữ nguyên */}
              {cropVisible && (
                <ImageCropper
                  visible={cropVisible}
                  src={cropSrc}
                  aspect={2 / 3} // Giữ đúng tỷ lệ yêu cầu
                  onCancel={() => {
                    setCropVisible(false);
                    setCropSrc(null);
                    setPendingFile(null);
                  }}
                  onCropDone={onCropDone}
                />
              )}
            </Col>
          </Row>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              borderTop: "1px solid #f0f0f0",
              paddingTop: 20,
            }}
          >
            <Button size="large" onClick={onCancel}>
              Đóng
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              style={{ background: "#2563eb", borderColor: "#2563eb" }}
            >
              {initialData ? "Cập nhật" : "Lưu Combo"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
