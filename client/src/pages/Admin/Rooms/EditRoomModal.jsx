import { Modal, Input, Select, message } from "antd";
import { useState, useEffect } from "react";
import roomService from "../../../services/Admin/roomService";

// 👇 Import file CSS
import "../../../styles/Admin/Room.css";

export default function EditRoomModal({ open, room, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    type: "2D",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setForm({
        name: room.name,
        type: room.type,
      });
    }
  }, [room]);

  const handleOk = async () => {
    if (!form.name.trim()) {
      message.error("Tên phòng không được để trống");
      return;
    }

    setLoading(true);
    try {
      await roomService.update(room.id, {
        name: form.name,
        type: form.type,
      });

      message.success("Đã cập nhật phòng chiếu");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Sửa thông tin phòng chiếu"
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnHidden
    >
      <div className="edit-room-form">
        {/* Nhập tên phòng */}
        <div className="form-group">
          <label className="form-label">Tên phòng:</label>
          <Input
            placeholder="Ví dụ: Room 1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Chọn loại phòng */}
        <div className="form-group">
          <label className="form-label">Loại phòng:</label>
          <Select
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
            className="full-width-select" // Class CSS chỉnh width 100%
          >
            <Select.Option value="2D">2D</Select.Option>
            <Select.Option value="3D">3D</Select.Option>
            <Select.Option value="IMAX">IMAX</Select.Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
