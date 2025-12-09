import { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosAdmin from "../../services/Admin/axiosAdmin.js";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axiosAdmin.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách phòng!");
    }
  };

  const columns = [
    { key: 1, title: "Tên phòng", dataIndex: "name" },
    { key: 2, title: "Loại phòng", dataIndex: "type" },
    { key: 3, title: "Tổng ghế", dataIndex: "totalSeats" },
    {
      key: 4,
      title: "Hành động",
      render: (_, record) => (
        <div>
          <EditOutlined
            style={{ marginRight: 12 }}
            onClick={() => onEditRoom(record)}
          />
          <DeleteOutlined
            style={{ color: "red" }}
            onClick={() => onDeleteRoom(record)}
          />
        </div>
      ),
    },
  ];

  const onAddRoom = () => {
    setEditingRoom({
      name: "",
      type: "2D",
      totalSeats: "",
      cinemaId: 1,
    });
    setIsEditing(true);
  };

  const onEditRoom = (room) => {
    setEditingRoom({
      id: room.id,
      name: room.name,
      type: room.type,
      totalSeats: room.totalSeats,
      cinemaId: room.cinemaId,
    });
    setIsEditing(true);
  };

  const saveRoom = async () => {
    if (!editingRoom.name || !editingRoom.totalSeats) {
      return message.error("Tên phòng + tổng số ghế là bắt buộc!");
    }

    const payload = {
      name: editingRoom.name.trim(),
      type: editingRoom.type,
      totalSeats: Number(editingRoom.totalSeats),
      cinemaId: editingRoom.cinemaId || 1,
    };

    try {
      if (editingRoom.id) {
        await axiosAdmin.put(`/rooms/${editingRoom.id}`, payload);
        message.success("Cập nhật phòng thành công!");
      } else {
        await axiosAdmin.post("/rooms", payload);
        message.success("Thêm phòng mới thành công!");
      }

      fetchRooms();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      message.error("Không thể lưu phòng!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý phòng chiếu</h2>

      <Button type="primary" onClick={onAddRoom}>
        + Thêm phòng
      </Button>

      <Table
        style={{ marginTop: 20 }}
        rowKey="id"
        columns={columns}
        dataSource={rooms}
      />

      <Modal
        title={editingRoom?.id ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
        open={isEditing}
        okText="Lưu"
        onCancel={() => setIsEditing(false)}
        onOk={saveRoom}
      >
        <Input
          placeholder="Tên phòng"
          value={editingRoom?.name}
          onChange={(e) =>
            setEditingRoom((pre) => ({ ...pre, name: e.target.value }))
          }
        />

        <Select
          style={{ width: "100%", marginTop: 10 }}
          value={editingRoom?.type}
          onChange={(v) => setEditingRoom((pre) => ({ ...pre, type: v }))}
          options={[
            { value: "2D", label: "2D" },
            { value: "3D", label: "3D" },
            { value: "IMAX", label: "IMAX" },
          ]}
        />

        <Input
          placeholder="Tổng số ghế"
          type="number"
          style={{ marginTop: 10 }}
          value={editingRoom?.totalSeats}
          onChange={(e) =>
            setEditingRoom((pre) => ({ ...pre, totalSeats: e.target.value }))
          }
        />
      </Modal>
    </div>
  );
}
