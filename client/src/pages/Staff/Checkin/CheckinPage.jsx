import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Divider,
} from "antd";
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  EyeOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import checkinService from "../../../services/Admin/checkinService";

const { Title, Text } = Typography;

/* ===== MAP STATUS ===== */
const renderStatus = (status) => {
  switch (status) {
    case "CONFIRMED":
      return { text: "VÉ HỢP LỆ", color: "#00c48c" };
    case "USED":
      return { text: "VÉ ĐÃ SỬ DỤNG", color: "#22c55e" };
    case "PENDING":
      return { text: "CHƯA THANH TOÁN", color: "#f59e0b" };
    case "CANCELLED":
      return { text: "VÉ ĐÃ HUỶ", color: "#ef4444" };
    default:
      return { text: "KHÔNG HỢP LỆ", color: "#ef4444" };
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
        color: "#334155",
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

      // 👉 IN RA TRƯỚC
      setResult({
        status: booking.status,
        movie: movie?.title || "N/A",
        time: showtime
          ? `${dayjs(showtime.startTime).format("HH:mm")} - ${dayjs(
              showtime.endTime
            ).format("HH:mm")} | ${dayjs(showtime.startTime).format(
              "DD/MM/YYYY"
            )}`
          : "N/A",
        cinema: cinema?.name || "N/A",
        room: room?.name || "N/A",
        roomType: roomType || "N/A",
        seats: seats?.length ? seats.join(", ") : "N/A",
      });

      // 👉 SAU ĐÓ MỚI CHECK-IN
      if (isConfirmed) {
        await checkinService.checkInBooking(bookingId);
      }
    } catch {
      setResult({ error: "VÉ KHÔNG TỒN TẠI" });
    } finally {
      setLoading(false);
    }
  };

  const statusUI = result && renderStatus(result.status);
  const roomTypeUI = result && renderRoomType(result.roomType);

  return (
    <Row
      justify="center"
      style={{
        padding: "48px 32px",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Col style={{ width: "100%", maxWidth: 880 }}>
        {/* ================= FORM ================= */}
        <Card
          style={{
            borderRadius: 22,
            background: "#fafafa",
            boxShadow: "0 10px 32px rgba(0,0,0,0.06)",
            marginBottom: 32,
          }}
        >
          <Form form={form} onFinish={onFinish}>
            <Row gutter={20} align="middle">
              <Col flex="auto">
                <Form.Item
                  name="bookingId"
                  rules={[{ required: true, message: "Nhập mã booking" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    size="large"
                    placeholder="Nhập mã booking"
                    style={{
                      height: 54,
                      fontSize: 18,
                      borderRadius: 14,
                    }}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    height: 54,
                    minWidth: 180,
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                    border: "none",
                  }}
                >
                  KIỂM TRA
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* ================= KẾT QUẢ ================= */}
        {result && !result.error && (
          <Card
            style={{
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
            }}
            styles={{ body: { padding: 0 } }}
          >
            {/* HEADER */}
            <div
              style={{
                background: statusUI.color,
                padding: "16px 24px",
                textAlign: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              <CheckCircleFilled /> {statusUI.text}
            </div>

            {/* BODY */}
            <div style={{ padding: 32 }}>
              <Title level={3} style={{ marginBottom: 24 }}>
                {result.movie}
              </Title>

              <Row gutter={32}>
                <Col span={12}>
                  <Text type="secondary">THỜI GIAN</Text>
                  <div style={{ marginTop: 8, fontWeight: 600 }}>
                    <ClockCircleOutlined /> {result.time}
                  </div>
                </Col>

                <Col span={12}>
                  <Text type="secondary">RẠP / PHÒNG</Text>

                  <div style={{ marginTop: 8, fontWeight: 600 }}>
                    <EnvironmentOutlined /> {result.cinema}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text strong>Phòng:</Text>
                    <Text>{result.room}</Text>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 700,
                        background: roomTypeUI.bg,
                        color: roomTypeUI.color,
                      }}
                    >
                      {roomTypeUI.icon} {roomTypeUI.text}
                    </span>
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: "28px 0" }} />

              {/* GHẾ */}
              <Card
                variant="outlined"
                style={{
                  background: "#f4f5f7",
                  borderRadius: 18,
                  textAlign: "center",
                }}
              >
                <Text type="secondary">Vị trí ghế</Text>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#7c3aed",
                    marginTop: 10,
                    letterSpacing: 2,
                  }}
                >
                  {result.seats}
                </div>
              </Card>
            </div>
          </Card>
        )}

        {/* ================= LỖI ================= */}
        {result?.error && (
          <Card
            style={{
              borderRadius: 18,
              marginTop: 24,
              background: "#fff1f0",
              borderColor: "#ffccc7",
            }}
          >
            <Text type="danger" strong>
              ❌ {result.error}
            </Text>
          </Card>
        )}
      </Col>
    </Row>
  );
}
