import { Form, Input, Button, Row, Col } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  EyeOutlined,
  RocketOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import checkinService from "../../../services/Admin/checkinService";
import "../../../styles/Admin/CheckinPage.css";

/* ===== MAP STATUS ===== */
const renderStatus = (status) => {
  switch (status) {
    case "CONFIRMED":
      return {
        text: "VÉ HỢP LỆ",
        color: "#10b981",
        icon: <CheckCircleFilled />,
      }; // Xanh lá
    case "USED":
      return {
        text: "VÉ ĐÃ SỬ DỤNG",
        color: "#f59e0b",
        icon: <ClockCircleOutlined />,
      }; // Cam
    case "PENDING":
      return {
        text: "CHƯA THANH TOÁN",
        color: "#64748b",
        icon: <ClockCircleOutlined />,
      }; // Xám
    case "CANCELLED":
      return {
        text: "VÉ ĐÃ HUỶ",
        color: "#ef4444",
        icon: <CloseCircleFilled />,
      }; // Đỏ
    default:
      return {
        text: "KHÔNG HỢP LỆ",
        color: "#ef4444",
        icon: <CloseCircleFilled />,
      };
  }
};

/* ===== MAP ROOM TYPE ===== */
const renderRoomType = (type) => {
  switch (type) {
    case "IMAX":
      return {
        icon: <RocketOutlined />,
        text: "IMAX",
        bg: "#f3e8ff",
        color: "#7c3aed", // Tím nhạt
      };
    case "3D":
      return {
        icon: <EyeOutlined />,
        text: "3D",
        bg: "#e0f2fe",
        color: "#0284c7", // Xanh dương nhạt
      };
    case "2D":
    default:
      return {
        icon: <VideoCameraOutlined />,
        text: "2D",
        bg: "#f1f5f9",
        color: "#475569", // Xám nhạt
      };
  }
};

export default function CheckInPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form] = Form.useForm();

  const onFinish = async ({ bookingId }) => {
    try {
      setLoading(true);
      setResult(null);

      const data = await checkinService.getCheckInInfo(bookingId);
      const { booking, showtime, movie, room, cinema, seats, roomType } = data;
      const isConfirmed = booking.status === "CONFIRMED";

      // Set data hiển thị
      setResult({
        status: booking.status,
        movie: movie?.title || "N/A",
        time: showtime
          ? `${dayjs(showtime.startTime).format("HH:mm")} - ${dayjs(
              showtime.endTime
            ).format("HH:mm")}`
          : "N/A",
        date: showtime ? dayjs(showtime.startTime).format("DD/MM/YYYY") : "N/A",
        cinema: cinema?.name || "N/A",
        room: room?.name || "N/A",
        roomType: roomType || "N/A",
        seats: seats?.length ? seats.join(", ") : "N/A",
      });

      // Check-in nếu vé hợp lệ
      if (isConfirmed) {
        await checkinService.checkInBooking(bookingId);
      }
    } catch {
      setResult({ error: "KHÔNG TÌM THẤY VÉ HOẶC MÃ KHÔNG ĐÚNG" });
    } finally {
      setLoading(false);
    }
  };

  const statusUI = result && !result.error && renderStatus(result.status);
  const roomTypeUI = result && !result.error && renderRoomType(result.roomType);

  return (
    <div className="checkin-container">
      <div className="checkin-wrapper">
        {/* ================= FORM TÌM KIẾM ================= */}
        <div className="search-card">
          <div
            style={{
              marginBottom: 16,
              fontWeight: 700,
              fontSize: 18,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <QrcodeOutlined style={{ color: "#2563eb" }} /> SOÁT VÉ NHANH
          </div>
          <Form form={form} onFinish={onFinish}>
            <Row gutter={12}>
              <Col flex="auto">
                <Form.Item
                  name="bookingId"
                  rules={[{ required: true, message: "Vui lòng nhập mã vé" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    className="search-input"
                    placeholder="Nhập mã booking..."
                    prefix={
                      <span style={{ color: "#94a3b8", marginRight: 4 }}></span>
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="btn-check"
                >
                  KIỂM TRA
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* ================= KẾT QUẢ VÉ ================= */}
        {result && !result.error && (
          <div className="ticket-card">
            {/* Header màu theo trạng thái */}
            <div
              className="ticket-header"
              style={{ backgroundColor: statusUI.color }}
            >
              {statusUI.icon} &nbsp; {statusUI.text}
            </div>

            <div className="ticket-body">
              <div className="movie-title">{result.movie}</div>

              {/* Thông tin chi tiết */}
              <div className="info-row">
                <span className="info-label">Suất chiếu</span>
                <div className="info-value">
                  <ClockCircleOutlined
                    style={{ marginRight: 6, color: "#2563eb" }}
                  />
                  {result.time}
                  <div
                    style={{
                      fontSize: 13,
                      color: "#64748b",
                      fontWeight: 500,
                      marginTop: 2,
                    }}
                  >
                    {result.date}
                  </div>
                </div>
              </div>

              <div className="info-row">
                <span className="info-label">Rạp / Phòng</span>
                <div className="info-value">
                  <EnvironmentOutlined
                    style={{ marginRight: 6, color: "#2563eb" }}
                  />
                  {result.cinema}
                  <div style={{ marginTop: 6 }}>
                    {result.room}
                    <span
                      className="room-tag"
                      style={{
                        background: roomTypeUI.bg,
                        color: roomTypeUI.color,
                      }}
                    >
                      {roomTypeUI.icon} {roomTypeUI.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Khu vực Ghế ngồi to rõ */}
              <div className="seats-container">
                <div className="seats-label">Vị trí ghế ngồi</div>
                <div className="seats-value">{result.seats}</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= THÔNG BÁO LỖI ================= */}
        {result?.error && (
          <div className="error-card">
            <div className="error-text">
              <CloseCircleFilled /> {result.error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
