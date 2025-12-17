import { Modal, Input, Select, Space, message } from "antd";
import { useState, useEffect } from "react";
import roomService from "../../../services/Admin/roomService";

export default function EditRoomModal({ open, room, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    type: "2D",
  });

  useEffect(() => {
    if (room) {
      setForm({
        name: room.name,
        type: room.type,
      });
    }
  }, [room]);

  const handleOk = async () => {
    if (!form.name) {
      message.error("Tên phòng không được để trống");
      return;
    }
    console.log("FORM SUBMIT:", form); // 👈 THÊM DÒNG NÀY
    try {
      await roomService.update(room.id, {
        name: form.name,
        type: form.type,
      });

      message.success("Đã cập nhật phòng chiếu");
      onSuccess();
      onClose();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <Modal
      open={open}
      title="Sửa thông tin phòng chiếu"
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu"
      destroyOnHidden
    >
      <Space orientation="vertical" style={{ width: "100%" }}>
        <Input
          placeholder="Tên phòng"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Select
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v })}
        >
          <Select.Option value="2D">2D</Select.Option>
          <Select.Option value="3D">3D</Select.Option>
          <Select.Option value="IMAX">IMAX</Select.Option>
        </Select>
      </Space>
    </Modal>
  );
}
