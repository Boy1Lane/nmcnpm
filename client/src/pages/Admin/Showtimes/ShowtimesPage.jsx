import { useEffect, useState } from "react";
import { DatePicker, Button, Card, Space, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import showtimeService from "../../../services/Admin/showtimeService";
import roomService from "../../../services/Admin/roomService";
import ShowtimeModal from "./ShowtimeModal";

const { Title } = Typography;

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
    console.log("📌 FE nhận rooms:", res.data);

    setRooms(res.data);

    const unique = {};
    res.data.forEach((r) => {
      if (r.Cinema) unique[r.Cinema.id] = r.Cinema;
    });

    setCinemas(Object.values(unique));
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
      message.success("Đã xóa!");
      loadShowtimes();
    } else message.error(res.error);
  };

  const openEditModal = (st) => {
    setEditingShowtime(st);
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadRooms();
    loadShowtimes(); // ⭐ Load tất cả suất chiếu mặc định
  }, []);

  useEffect(() => {
    loadShowtimes(date); // ⭐ TỰ LOAD LẠI KHI ĐỔI NGÀY
  }, [date]);

  // ===== FILTER ROOMS THEO RẠP =====
  const baseRooms =
    selectedCinema === "all"
      ? rooms
      : rooms.filter((r) => r.Cinema?.id == selectedCinema);

  const filteredRooms = date
    ? baseRooms.filter((room) => showtimes.some((st) => st.roomId === room.id))
    : baseRooms;

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Quản lý Lịch chiếu</Title>

      {/* ==== FILTER BAR ==== */}
      <Space style={{ marginBottom: 20 }}>
        <DatePicker
          value={date}
          onChange={(value) => setDate(value ? dayjs(value) : null)}
          allowClear
        />

        <Button type="primary" onClick={() => loadShowtimes(date)}>
          Xem lịch
        </Button>

        {/* CHỌN RẠP */}
        <select
          value={selectedCinema}
          onChange={(e) => setSelectedCinema(e.target.value)}
          style={{ padding: "6px 12px", borderRadius: 6 }}
        >
          <option value="all">Tất cả Rạp</option>
          {cinemas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <Button
          type="primary"
          danger
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingShowtime(null);
            setSelectedRoom(null); // ⭐ không chọn phòng mặc định
            setIsModalOpen(true);
          }}
        >
          Tạo suất chiếu mới
        </Button>
      </Space>

      {/* ==== RENDER THEO RẠP → PHÒNG ==== */}
      {filteredRooms.map((room) => {
        const stInRoom = showtimes.filter((s) => s.roomId === room.id);

        return (
          <Card
            key={room.id}
            title={`${room.Cinema?.name} • ${room.name} (${room.type})`}
            extra={
              <div style={{ textAlign: "right" }}>
                <div>{room.Cinema?.address}</div>
                <div>Sức chứa: {room.totalSeats} ghế</div>
              </div>
            }
            style={{ marginBottom: 20, borderRadius: 10 }}
          >
            <Space wrap>
              {stInRoom.map((st) => (
                <Card
                  key={st.id}
                  style={{
                    width: 260,
                    background: "#fff7f7",
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: "flex", gap: 10 }}>
                    <img
                      src={st.Movie?.posterUrl}
                      alt="poster"
                      style={{
                        width: 70,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <b>
                        {st.startLabel} - {st.endLabel}
                      </b>
                      <p>{st.Movie?.title}</p>
                      <small>Giá: {st.basePrice?.toLocaleString()}đ</small>
                    </div>
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                    <Button size="small" onClick={() => openEditModal(st)}>
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => handleDelete(st.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </Card>
              ))}

              <Button
                type="dashed"
                style={{ width: 140, height: 80 }}
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedRoom(room); // ⭐ Gán phòng hiện tại!
                  setEditingShowtime(null);
                  setIsModalOpen(true);
                }}
              >
                Thêm suất
              </Button>
            </Space>
          </Card>
        );
      })}

      {isModalOpen && (
        <ShowtimeModal
          open={isModalOpen}
          editing={editingShowtime}
          selectedRoom={selectedRoom} // ⭐ rất quan trọng
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
