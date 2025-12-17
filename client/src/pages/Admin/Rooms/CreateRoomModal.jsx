import { useEffect, useState } from "react";
import { Modal, Input, Select, InputNumber, Space, message } from "antd";
import axiosAdmin from "../../../services/Admin/axiosAdmin";
import roomService from "../../../services/Admin/roomService";
function CreateRoomModal({ open, onClose, onSuccess }) {
  const [cinemas, setCinemas] = useState([]);
  const [form, setForm] = useState({
    cinemaId: "",
    name: "",
    type: "2D",
    rows: 8,
    cols: 12,
  });

  useEffect(() => {
    axiosAdmin.get("/cinemas").then((res) => setCinemas(res.data));
  }, []);

  const handleOk = async () => {
    if (!form.cinemaId || !form.name) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const totalSeats = form.rows * form.cols;

    // 1️⃣ Tạo phòng thuộc rạp
    const res = await roomService.createInCinema(form.cinemaId, {
      name: form.name,
      totalSeats,
      type: form.type,
    });

    const roomId = res.data.room.id;

    // 2️⃣ Sinh ghế
    const seats = [];
    for (let r = 0; r < form.rows; r++) {
      const rowChar = String.fromCharCode(65 + r);
      for (let c = 1; c <= form.cols; c++) {
        seats.push({
          row: rowChar,
          number: c,
          type: "NORMAL",
          priceMultiplier: 1,
        });
      }
    }

    await roomService.addSeats(roomId, seats);

    message.success("Đã tạo phòng chiếu");
    onSuccess();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Tạo phòng chiếu"
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu"
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Select
          placeholder="Chọn rạp"
          value={form.cinemaId}
          onChange={(v) => setForm({ ...form, cinemaId: v })}
        >
          {cinemas.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>

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

        <Space>
          <InputNumber
            min={1}
            value={form.rows}
            onChange={(v) => setForm({ ...form, rows: v })}
          />
          <InputNumber
            min={1}
            value={form.cols}
            onChange={(v) => setForm({ ...form, cols: v })}
          />
        </Space>
      </Space>
    </Modal>
  );
}

export default CreateRoomModal;
