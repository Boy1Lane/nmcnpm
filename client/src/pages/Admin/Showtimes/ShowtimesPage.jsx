import { useEffect, useState } from "react";
import { DatePicker, Button, Card, Space, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import showtimeService from "../../../services/Admin/showtimeService.js";
import roomService from "../../../services/Admin/roomService.js";
import ShowtimeModal from "./ShowtimeModal";

const { Title } = Typography;

export default function ShowtimesPage() {
  const [date, setDate] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);

  // Load rooms
  const loadRooms = async () => {
    const res = await roomService.getAll();
    setRooms(res.data);
  };

  // Load showtimes theo ngày
  const loadShowtimes = async () => {
    if (!date) return;
    const res = await showtimeService.getByDate(date);
    setShowtimes(res.data);
  };

  // xóa
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa suất chiếu này?")) return;

    const res = await showtimeService.delete(id);
    if (res.success) {
      message.success("Đã xóa!");
      loadShowtimes();
    } else {
      message.error(res.error);
    }
  };

  // mở model suất chiếu
  const openEditModal = (st) => {
    setEditingShowtime(st);
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Quản lý Lịch chiếu</Title>

      {/* Bộ lọc */}
      <Space style={{ marginBottom: 20 }}>
        <DatePicker value={date} onChange={setDate} />
        <Button type="primary" onClick={loadShowtimes}>
          Xem lịch
        </Button>
        <Button
          type="primary"
          danger
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Tạo suất chiếu mới
        </Button>
      </Space>

      {/* Danh sách phòng */}
      {rooms.map((room) => {
        const roomShowtimes = showtimes.filter((s) => s.roomId === room.id);

        return (
          <Card
            key={room.id}
            title={`${room.name} (${room.type})`}
            extra={`Sức chứa: ${room.totalSeats} ghế`}
            style={{ marginBottom: 20, borderRadius: 10 }}
          >
            <Space wrap>
              {/* Các suất chiếu */}
              {roomShowtimes.map((st) => (
                <Card
                  key={st.id}
                  style={{
                    width: 260,
                    borderRadius: 10,
                    background: "#fff7f7",
                  }}
                >
                  <b>
                    {st.startLabel} - {st.endLabel}
                  </b>
                  <p>{st.movie?.title}</p>
                  <small>Giá chuẩn: {st.basePrice?.toLocaleString()}đ</small>

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

              {/* Nút thêm suất */}
              <Button
                type="dashed"
                style={{ width: 140, height: 80 }}
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Thêm suất
              </Button>
            </Space>
          </Card>
        );
      })}

      {/* Modal */}
      {isModalOpen && (
        <ShowtimeModal
          open={isModalOpen}
          editing={editingShowtime} // <-- truyền dữ liệu sửa
          onClose={() => {
            setIsModalOpen(false);
            setEditingShowtime(null);
          }}
          onSuccess={() => loadShowtimes()}
        />
      )}
    </div>
  );
}
