import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Select,
  Tabs,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  AppstoreOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import roomService from "../../../services/Admin/roomService";
import showtimeService from "../../../services/Admin/showtimeService";
import cinemaService from "../../../services/Admin/cinemaService";
import CreateRoomModal from "./CreateRoomModal";
import SeatMapModal from "./SeatMapModal";
import EditRoomModal from "./EditRoomModal";
import CreateCinemaModal from "./CreateCinemaModal";

import "../../../styles/Admin/Room.css";

const { Text } = Typography;

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateCinema, setOpenCreateCinema] = useState(false);
  const [openSeatMap, setOpenSeatMap] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);

  const loadData = async () => {
    try {
      const [roomRes, showtimeRes, cinemaRes] = await Promise.all([
        roomService.getAll(),
        showtimeService.getAll(),
        cinemaService.getAll(),
      ]);

      const now = new Date();

      const roomsWithFlag = roomRes.data.map((room) => ({
        ...room,
        hasFutureShowtime: showtimeRes.data.some(
          (st) => st.roomId === room.id && new Date(st.startTime) > now
        ),
      }));

      // lấy danh sách rạp từ API và từ rooms (merge để tránh thiếu)
      const cinemaMap = {};
      (cinemaRes.data || []).forEach((c) => {
        if (c && c.id) cinemaMap[c.id] = c;
      });
      roomsWithFlag.forEach((r) => {
        if (r.Cinema) cinemaMap[r.Cinema.id] = r.Cinema;
      });

      setRooms(roomsWithFlag);
      const sortedCinemas = Object.values(cinemaMap).sort((a, b) =>
        a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
      );

      setCinemas(sortedCinemas);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRooms = rooms.filter((r) => {
    if (selectedCinema !== "all" && r.Cinema?.id != selectedCinema)
      return false;
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    return true;
  });

  const handleDelete = async (room) => {
    if (room.hasFutureShowtime) {
      message.warning("Không thể xóa phòng đang có lịch chiếu trong tương lai");
      return;
    }
    if (!confirm(`Xóa phòng ${room.name}?`)) return;

    try {
      await roomService.delete(room.id);
      message.success("Đã xóa phòng chiếu");
      loadData();
    } catch (error) {
      message.error("Lỗi khi xóa phòng");
    }
  };

  return (
    <div className="admin-room-page">
      <div className="page-header">
        <h2 className="page-title">Quản lý Phòng chiếu</h2>
      </div>

      {/* ===== FILTER BAR (Đã tách CSS) ===== */}
      <div className="filter-section">
        <div className="filter-left">
          <Select
            value={selectedCinema}
            onChange={setSelectedCinema}
            className="custom-select"
            style={{ width: 220 }}
            placeholder="Chọn rạp"
          >
            <Select.Option value="all">Tất cả Rạp</Select.Option>
            {cinemas.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>

          <Tabs
            activeKey={typeFilter}
            onChange={setTypeFilter}
            className="filter-tabs"
            items={[
              { key: "all", label: "Tất cả" },
              { key: "2D", label: "2D" },
              { key: "3D", label: "3D" },
              { key: "IMAX", label: "IMAX" },
            ]}
          />
        </div>

        <div className="filter-actions">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="btn-add"
              onClick={() => setOpenCreateCinema(true)}
            >
              Thêm rạp
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="btn-add"
              onClick={() => setOpenCreate(true)}
            >
              Thêm phòng
            </Button>
          </Space>
        </div>
      </div>

      {/* ===== ROOM LIST ===== */}
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className="room-card"
            title={
              <Space>
                <span className="room-name">{room.name}</span>
                <Tag color="geekblue">{room.type}</Tag>
              </Space>
            }
            extra={
              room.hasFutureShowtime ? (
                <Tag color="red" style={{ borderRadius: 4 }}>
                  Có lịch chiếu
                </Tag>
              ) : (
                <Tag color="success" style={{ borderRadius: 4 }}>
                  Lịch trống
                </Tag>
              )
            }
          >
            <div className="room-info">
              {/* Thông tin bên trái */}
              <div>
                <span className="cinema-name">{room.Cinema?.name}</span>
                <span className="seat-count">Tổng ghế: {room.totalSeats}</span>
              </div>

              {/* Nút thao tác bên phải */}
              <Space>
                <Tooltip title="Sửa thông tin phòng">
                  <Button
                    className="action-btn"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSelectedRoom(room);
                      setOpenEdit(true);
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title={
                    room.hasFutureShowtime
                      ? "Không thể sửa sơ đồ ghế khi đã có lịch chiếu"
                      : "Thiết kế sơ đồ ghế"
                  }
                >
                  <Button
                    className="action-btn"
                    icon={<AppstoreOutlined />}
                    disabled={room.hasFutureShowtime}
                    onClick={() => {
                      setSelectedRoom(room);
                      setOpenSeatMap(true);
                    }}
                  />
                </Tooltip>

                <Tooltip title="Xóa phòng">
                  <Button
                    danger
                    className="action-btn action-btn-danger"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(room)}
                  />
                </Tooltip>
              </Space>
            </div>
          </Card>
        ))}
      </Space>

      {/* ===== MODALS (Logic giữ nguyên) ===== */}
      {openCreate && (
        <CreateRoomModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSuccess={loadData}
        />
      )}

      {openCreateCinema && (
        <CreateCinemaModal
          open={openCreateCinema}
          onClose={() => setOpenCreateCinema(false)}
          onSuccess={() => {
            setOpenCreateCinema(false);
            loadData();
          }}
        />
      )}

      {openSeatMap && selectedRoom && (
        <SeatMapModal
          open={openSeatMap}
          room={selectedRoom}
          disabled={selectedRoom.hasFutureShowtime}
          onClose={() => {
            setOpenSeatMap(false);
            setSelectedRoom(null);
          }}
        />
      )}
      {openEdit && selectedRoom && (
        <EditRoomModal
          key={selectedRoom.id}
          open={openEdit}
          room={selectedRoom}
          onClose={() => {
            setOpenEdit(false);
            setSelectedRoom(null);
          }}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
