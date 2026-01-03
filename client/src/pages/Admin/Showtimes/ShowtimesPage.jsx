import { useEffect, useState } from "react";
import {
  DatePicker,
  Button,
  Card,
  Space,
  Typography,
  message,
  Select,
  Tag,
  Empty,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import showtimeService from "../../../services/Admin/showtimeService";
import roomService from "../../../services/Admin/roomService";
import ShowtimeModal from "./ShowtimeModal";
import "../../../styles/Admin/Showtimes.css";

const { Title, Text } = Typography;

export default function ShowtimesPage() {
  const [date, setDate] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("all");
  const [showtimes, setShowtimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ===== LOAD ROOMS =====
  const loadRooms = async () => {
    const res = await roomService.getAll();
    setRooms(res.data);

    const unique = {};
    res.data.forEach((r) => {
      if (r.Cinema) unique[r.Cinema.id] = r.Cinema;
    });
    const sortedCinemas = Object.values(unique).sort((a, b) =>
      a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
    );

    setCinemas(sortedCinemas);
  };

  // ===== LOAD SHOWTIMES =====
  const loadShowtimes = async (customDate = date) => {
    let res;
    if (!customDate || !dayjs(customDate).isValid()) {
      res = await showtimeService.getAll();
    } else {
      res = await showtimeService.getByDate(
        dayjs(customDate).format("YYYY-MM-DD")
      );
    }
    const formatted = res.data.map((st) => ({
      ...st,
      startLabel: dayjs(st.startTime).format("HH:mm"),
      endLabel: dayjs(st.endTime).format("HH:mm"),
    }));
    setShowtimes(formatted);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa suất chiếu này?")) return;
    const res = await showtimeService.delete(id);
    if (res.success) {
      message.success("Đã xóa thành công!");
      loadShowtimes();
    } else message.error(res.error);
  };

  const openEditModal = (st) => {
    setEditingShowtime(st);
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadRooms();
    loadShowtimes();
  }, []);

  useEffect(() => {
    loadShowtimes(date);
  }, [date]);

  // ===== FILTER ROOMS =====
  const baseRooms =
    selectedCinema === "all"
      ? rooms
      : rooms.filter((r) => r.Cinema?.id == selectedCinema);

  const filteredRooms = date
    ? baseRooms.filter((room) => showtimes.some((st) => st.roomId === room.id))
    : baseRooms;

  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 className="page-title">Quản lí lịch chiếu</h2>
        <Button
          type="primary"
          size="large"
          style={{
            background: "linear-gradient(90deg, #6200ea, #90caf9)",
            border: "none",
          }}
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingShowtime(null);
            setSelectedRoom(null);
            setIsModalOpen(true);
          }}
        >
          Tạo suất chiếu mới
        </Button>
      </div>

      {/* ==== FILTER BAR (Đã thiết kế lại) ==== */}
      <div className="filter-bar">
        <Space size="large">
          <div>
            <Text strong style={{ display: "block", marginBottom: 4 }}>
              Chọn ngày chiếu
            </Text>
            <DatePicker
              value={date}
              onChange={(value) => setDate(value ? dayjs(value) : null)}
              allowClear
              style={{ width: 200 }}
              placeholder="Lọc theo ngày"
              format={"DD/MM/YYYY"}
            />
          </div>

          <div>
            <Text strong style={{ display: "block", marginBottom: 4 }}>
              Chọn rạp
            </Text>
            <Select
              value={selectedCinema}
              onChange={(val) => setSelectedCinema(val)}
              style={{ width: 250 }}
              options={[
                { value: "all", label: "Tất cả các rạp" },
                ...cinemas.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>
        </Space>
      </div>

      {/* ==== LIST ROOMS ==== */}
      {filteredRooms.length === 0 ? (
        <Empty description="Không tìm thấy phòng chiếu nào" />
      ) : null}

      {filteredRooms.map((room) => {
        const stInRoom = showtimes.filter((s) => s.roomId === room.id);

        return (
          <Card
            key={room.id}
            className="room-card"
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: 20 }}
          >
            {/* Header của từng Phòng */}
            <div className="room-header">
              <Row justify="space-between" align="middle">
                <Col>
                  <div className="room-title">
                    <EnvironmentOutlined
                      style={{ color: "#6200ea", marginRight: 8 }}
                    />
                    {room.Cinema?.name} -{" "}
                    <span style={{ color: "#6200ea" }}>{room.name}</span>
                  </div>
                  <div className="room-info">
                    {room.type} • {room.totalSeats} ghế
                  </div>
                </Col>
                <Col>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {room.Cinema?.address}
                  </Text>
                </Col>
              </Row>
            </div>

            {/* Danh sách Suất chiếu trong phòng */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {stInRoom.map((st) => (
                <div key={st.id} className="showtime-card">
                  {/* Phần trên: Thông tin phim */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <img
                      src={st.Movie?.posterUrl}
                      alt="poster"
                      style={{
                        width: 50,
                        height: 75,
                        objectFit: "cover",
                        borderRadius: 4,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div className="st-time-badge">
                        {st.startLabel}{" "}
                        <span style={{ fontWeight: 400, fontSize: 12 }}>
                          ~ {st.endLabel}
                        </span>
                      </div>
                      <Tooltip title={st.Movie?.title}>
                        <div className="st-movie-title">{st.Movie?.title}</div>
                      </Tooltip>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {st.basePrice?.toLocaleString()} đ
                      </Text>
                    </div>
                  </div>

                  {/* Phần dưới: Action */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                      borderTop: "1px dashed #eee",
                      paddingTop: 8,
                    }}
                  >
                    <Button
                      size="small"
                      type="text"
                      icon={<EditOutlined />}
                      style={{ color: "#1890ff" }}
                      onClick={() => openEditModal(st)}
                    />
                    <Button
                      size="small"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(st.id)}
                    />
                  </div>
                </div>
              ))}

              {/* Nút Thêm nhanh suất chiếu vào phòng này */}
              <div
                className="add-btn-dashed"
                onClick={() => {
                  setSelectedRoom(room);
                  setEditingShowtime(null);
                  setIsModalOpen(true);
                }}
              >
                <PlusOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <span>Thêm suất</span>
              </div>
            </div>
          </Card>
        );
      })}

      {isModalOpen && (
        <ShowtimeModal
          open={isModalOpen}
          editing={editingShowtime}
          selectedRoom={selectedRoom}
          onClose={() => {
            setIsModalOpen(false);
            setEditingShowtime(null);
            setSelectedRoom(null);
          }}
          onSuccess={() => loadShowtimes()}
        />
      )}
    </div>
  );
}
