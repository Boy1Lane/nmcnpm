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
import CreateRoomModal from "./CreateRoomModal";
import SeatMapModal from "./SeatMapModal";
import EditRoomModal from "./EditRoomModal";

const { Title, Text } = Typography;

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [openCreate, setOpenCreate] = useState(false);
  const [openSeatMap, setOpenSeatMap] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);

  const loadData = async () => {
    const [roomRes, showtimeRes] = await Promise.all([
      roomService.getAll(),
      showtimeService.getAll(),
    ]);

    const now = new Date();

    const roomsWithFlag = roomRes.data.map((room) => ({
      ...room,
      hasFutureShowtime: showtimeRes.data.some(
        (st) => st.roomId === room.id && new Date(st.startTime) > now
      ),
    }));

    // lấy danh sách rạp từ rooms
    const cinemaMap = {};
    roomsWithFlag.forEach((r) => {
      if (r.Cinema) cinemaMap[r.Cinema.id] = r.Cinema;
    });

    setRooms(roomsWithFlag);
    setCinemas(Object.values(cinemaMap));
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

    await roomService.delete(room.id);
    message.success("Đã xóa phòng chiếu");
    loadData();
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Quản lý Phòng chiếu</Title>

      {/* ===== FILTER BAR ===== */}
      <Space style={{ marginBottom: 20 }}>
        <Select
          value={selectedCinema}
          onChange={setSelectedCinema}
          style={{ width: 220 }}
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
          items={[
            { key: "all", label: "Tất cả" },
            { key: "2D", label: "2D" },
            { key: "3D", label: "3D" },
            { key: "IMAX", label: "IMAX" },
          ]}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenCreate(true)}
        >
          Thêm phòng
        </Button>
      </Space>

      {/* ===== ROOM LIST ===== */}
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            style={{ borderRadius: 12 }}
            title={
              <Space>
                <Text strong>{room.name}</Text>
                <Tag color="blue">{room.type}</Tag>
              </Space>
            }
            extra={
              room.hasFutureShowtime ? (
                <Tag color="red">Có lịch chiếu</Tag>
              ) : (
                <Tag color="green">Lịch trống</Tag>
              )
            }
          >
            <Space
              style={{ width: "100%" }}
              align="center"
              justify="space-between"
            >
              <div>
                <Text>{room.Cinema?.name}</Text>
                <br />
                <Text type="secondary">Tổng ghế: {room.totalSeats}</Text>
              </div>

              <Space>
                <Tooltip title="Sửa thông tin phòng">
                  <Button
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
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(room)}
                  />
                </Tooltip>
              </Space>
            </Space>
          </Card>
        ))}
      </Space>

      {/* ===== MODALS ===== */}
      {openCreate && (
        <CreateRoomModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSuccess={loadData}
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
          key={selectedRoom.id} // ⭐ DÒNG QUAN TRỌNG
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
