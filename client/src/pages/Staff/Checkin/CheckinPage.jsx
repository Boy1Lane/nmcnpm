import { Form, Input, Button } from "antd";
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

/* ===== MAP STATUS (GIỮ NGUYÊN LOGIC) ===== */
const renderStatus = (status) => {
  switch (status) {
    case "CONFIRMED":
      return {
        text: "VÉ HỢP LỆ",
        color: "#10b981", // Emerald-500
        icon: <CheckCircleFilled />,
      };
    case "USED":
      return {
        text: "VÉ ĐÃ SỬ DỤNG",
        color: "#f59e0b", // Amber-500
        icon: <ClockCircleOutlined />,
      };
    case "PENDING":
      return {
        text: "CHƯA THANH TOÁN",
        color: "#64748b", // Slate-500
        icon: <ClockCircleOutlined />,
      };
    case "CANCELLED":
      return {
        text: "VÉ ĐÃ HUỶ",
        color: "#ef4444", // Red-500
        icon: <CloseCircleFilled />,
      };
    default:
      return {
        text: "KHÔNG HỢP LỆ",
        color: "#ef4444",
        icon: <CloseCircleFilled />,
      };
  }
};

/* ===== MAP ROOM TYPE (GIỮ NGUYÊN LOGIC) ===== */
const renderRoomType = (type) => {
  switch (type) {
    case "IMAX":
      return {
        icon: <RocketOutlined />,
        text: "IMAX",
        bg: "#f3e8ff",
        color: "#7c3aed",
      };
    case "3D":
      return {
        icon: <EyeOutlined />,
        text: "3D",
        bg: "#e0f2fe",
        color: "#0284c7",
      };
    case "2D":
    default:
      return {
        icon: <VideoCameraOutlined />,
        text: "2D",
        bg: "#f1f5f9",
        color: "#475569",
      };
  }
};

export default function CheckInPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form] = Form.useForm();

  // Logic xử lý (Không đổi)
  const onFinish = async ({ bookingId }) => {
    try {
      setLoading(true);
      setResult(null);

      const data = await checkinService.getCheckInInfo(bookingId);
      const { booking, showtime, movie, room, cinema, seats, roomType } = data;
      const isConfirmed = booking.status === "CONFIRMED";

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
        {/* ================= CARD TÌM KIẾM ================= */}
        <div className="checkin-card search-section">
          <div className="section-header">
            <QrcodeOutlined className="header-icon" />
            <span>SOÁT VÉ NHANH</span>
          </div>

          <Form form={form} onFinish={onFinish}>
            <div className="search-form-row">
              <Form.Item
                name="bookingId"
                rules={[{ required: true, message: "Vui lòng nhập mã vé" }]}
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Input
                  className="search-input"
                  placeholder="Nhập mã booking hoặc quét mã..."
                  allowClear
                  autoFocus // Tự động focus để dùng súng bắn mã vạch tiện hơn
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="btn-check"
              >
                KIỂM TRA
              </Button>
            </div>
          </Form>
        </div>

        {/* ================= CARD KẾT QUẢ ================= */}
        {result && !result.error && (
          <div className="checkin-card ticket-section">
            {/* Thanh trạng thái màu sắc dựa theo status */}
            <div
              className="ticket-status-bar"
              style={{ backgroundColor: statusUI.color }}
            >
              {statusUI.icon} <span>{statusUI.text}</span>
            </div>

            <div className="ticket-content">
              <h2 className="movie-title1">{result.movie}</h2>

              <div className="ticket-info-grid">
                {/* Cột trái: Thời gian */}
                <div className="info-item">
                  <span className="info-label">Suất chiếu</span>
                  <div className="info-value">
                    <span>{result.time}</span>
                    <div className="sub-value">
                      <ClockCircleOutlined style={{ color: "#3b82f6" }} />
                      {result.date}
                    </div>
                  </div>
                </div>

                {/* Cột phải: Địa điểm */}
                <div className="info-item text-right">
                  <span className="info-label">Rạp / Phòng</span>
                  <div className="info-value">
                    <span>{result.cinema}</span>
                    <div
                      className="sub-value"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <EnvironmentOutlined style={{ color: "#3b82f6" }} />
                      {result.room}
                      {/* Badge Room Type */}
                      <span
                        className="room-badge"
                        style={{
                          background: roomTypeUI.bg,
                          color: roomTypeUI.color,
                          marginLeft: 6,
                        }}
                      >
                        {roomTypeUI.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box Ghế Ngồi */}
              <div className="seats-box">
                <div className="seats-title">VỊ TRÍ GHẾ NGỒI</div>
                <div className="seats-number">{result.seats}</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= THÔNG BÁO LỖI ================= */}
        {result?.error && (
          <div className="checkin-card error-section">
            <div className="error-content">
              <CloseCircleFilled style={{ fontSize: "20px" }} />
              <span>{result.error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
