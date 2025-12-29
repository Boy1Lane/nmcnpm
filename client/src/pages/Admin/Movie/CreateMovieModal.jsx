import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Upload,
  Row,
  Col,
  message,
} from "antd";
import {
  PlusOutlined,
  LoadingOutlined,
  SaveOutlined,
  CloseOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import movieService from "../../../services/Admin/movieService";

// Import CSS
import "../../../styles/Admin/MovieManagement.css";

const { TextArea } = Input;
const { Option } = Select;

export default function CreateMovieModal({ open, movie, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [posterFile, setPosterFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [trailerFile, setTrailerFile] = useState(null);
  const [previewTrailer, setPreviewTrailer] = useState(null);

  // Reset form khi mở modal hoặc khi movie thay đổi (Edit mode)
  useEffect(() => {
    if (open) {
      if (movie) {
        // Edit Mode
        form.setFieldsValue({
          ...movie,
          releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
        });
        setPreviewImage(movie.posterUrl); // Hiển thị ảnh cũ
      } else {
        // Create Mode
        form.resetFields();
        setPreviewImage(null);
      }
      setPosterFile(null);
      setTrailerFile(null);
      setPreviewTrailer(movie?.trailerUrl || null);
    }
  }, [open, movie, form]);

  // Xử lý upload ảnh (chỉ hiển thị preview, chưa gửi server)
  const handlePreview = (file) => {
    const objectUrl = URL.createObjectURL(file);
    setPosterFile(file);
    setPreviewImage(objectUrl);
    return false; // Chặn auto upload của Antd
  };

  const handleTrailerUpload = (file) => {
    if (!file.type.startsWith("video/")) {
      message.error("Chỉ được upload video!");
      return Upload.LIST_IGNORE;
    }

    if (file.size > 30 * 1024 * 1024) {
      message.error("Trailer tối đa 30MB");
      return Upload.LIST_IGNORE;
    }

    setTrailerFile(file);
    setPreviewTrailer(URL.createObjectURL(file));
    return false; // chặn auto upload
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      // Logic append form data GIỮ NGUYÊN
      Object.keys(values).forEach((key) => {
        if (key === "releaseDate" && values[key]) {
          formData.append(key, values[key].format("YYYY-MM-DD"));
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // Logic xử lý ảnh GIỮ NGUYÊN
      if (posterFile) {
        formData.append("poster", posterFile); // Ảnh mới
      } else if (movie?.posterUrl) {
        formData.append("posterUrl", movie.posterUrl); // Giữ ảnh cũ
      }
      if (trailerFile) {
        formData.append("trailer", trailerFile); // 🔥 FIELD NAME ĐÚNG BE
      } else if (movie?.trailerUrl) {
        formData.append("trailerUrl", movie.trailerUrl);
      }

      if (movie?.id) {
        await movieService.update(movie.id, formData);
        message.success("Cập nhật phim thành công!");
      } else {
        await movieService.create(formData);
        message.success("Thêm phim mới thành công!");
      }

      onSuccess(); // Refresh list bên ngoài
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <span className="modal-title">
          {movie ? "✏️ Chỉnh sửa thông tin phim" : "🎬 Thêm phim mới"}
        </span>
      }
      onCancel={onClose}
      footer={null}
      width={800} // Tăng nhẹ độ rộng để thoáng hơn
      className="movie-modal"
      centered
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: "coming_soon" }}
        requiredMark="optional" // Ẩn dấu sao đỏ, nhìn sạch hơn
      >
        <Row gutter={32}>
          {/* Cột 1: Poster */}
          <Col span={8}>
            <Form.Item label="Poster Phim" tooltip="Tỉ lệ ảnh khuyến nghị 2:3">
              <Upload
                name="poster"
                showUploadList={false}
                beforeUpload={handlePreview}
                style={{ width: "100%" }}
              >
                {/* Custom Box Styles từ CSS */}
                <div className="poster-upload-wrapper">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="poster"
                      className="poster-preview-img"
                    />
                  ) : (
                    <div style={{ textAlign: "center", color: "#9ca3af" }}>
                      <CloudUploadOutlined
                        style={{
                          fontSize: 32,
                          marginBottom: 12,
                          color: "#d1d5db",
                        }}
                      />
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        Nhấn để tải ảnh
                      </div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        (JPG, PNG, WebP)
                      </div>
                    </div>
                  )}
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Thời lượng (phút)"
              name="duration"
              rules={[{ required: true, message: "Nhập thời lượng" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="Ví dụ: 120"
                size="large" // Input lớn
              />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Option value="now_showing">Đang chiếu</Option>
                <Option value="coming_soon">Sắp chiếu</Option>
                <Option value="ended">Ngưng chiếu</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Cột 2: Chi tiết phim */}
          <Col span={16}>
            <Form.Item
              label="Tên phim"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
            >
              <Input
                placeholder="Nhập tên phim chính xác..."
                style={{ fontWeight: 600 }}
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Đạo diễn" name="director">
                  <Input placeholder="Tên đạo diễn" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thể loại" name="genre">
                  <Input placeholder="Hành động, Hài..." size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Diễn viên" name="actor">
              <Input placeholder="Danh sách diễn viên chính" size="large" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày công chiếu"
                  name="releaseDate"
                  rules={[{ required: true, message: "Chọn ngày" }]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Trailer (Video)">
                  <Upload
                    accept="video/*"
                    showUploadList={false}
                    beforeUpload={handleTrailerUpload}
                  >
                    <Button icon={<PlusOutlined />} size="large" block>
                      {trailerFile || previewTrailer
                        ? "Thay đổi Trailer"
                        : "Tải Trailer"}
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            {/* Preview Trailer Mini */}
            {previewTrailer && (
              <div style={{ marginBottom: 24 }}>
                <video
                  src={previewTrailer}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    borderRadius: 8,
                    background: "#000",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <Form.Item label="Mô tả nội dung" name="description">
              <TextArea
                rows={4}
                placeholder="Tóm tắt nội dung phim..."
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* Footer Custom Styles */}
            <div className="modal-footer">
              <Button
                onClick={onClose}
                size="large"
                style={{ borderRadius: 8 }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={loading ? <LoadingOutlined /> : <SaveOutlined />}
                size="large"
                className="btn-primary-custom" // Dùng lại class nút tím ở bài trước
              >
                {movie ? "Lưu thay đổi" : "Tạo phim mới"}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
