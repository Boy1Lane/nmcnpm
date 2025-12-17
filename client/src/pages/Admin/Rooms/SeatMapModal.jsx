import { useEffect, useState } from "react";
import { Modal, Button, Space, Typography, message } from "antd";
import roomService from "../../../services/Admin/roomService";

const { Text } = Typography;

export default function SeatMapModal({ open, room, disabled, onClose }) {
  const [seats, setSeats] = useState([]);
  const [changedSeats, setChangedSeats] = useState({});

  const loadSeats = async () => {
    const res = await roomService.getSeats(room.id);

    // ✅ SORT GHẾ TRƯỚC KHI SET STATE
    const sortedSeats = res.data
      .slice() // tránh mutate data gốc
      .sort((a, b) => {
        if (a.row === b.row) {
          return a.number - b.number; // số ghế tăng dần
        }
        return a.row.localeCompare(b.row); // hàng A → Z
      });

    setSeats(sortedSeats);
    setChangedSeats({});
  };

  useEffect(() => {
    if (open) loadSeats();
  }, [open]);

  // 👉 CLICK GHẾ: TOGGLE NORMAL <-> VIP
  const toggleSeatType = (seat) => {
    if (disabled) return;

    const newType = seat.type === "VIP" ? "NORMAL" : "VIP";
    const newMultiplier = newType === "VIP" ? 1.2 : 1.0;

    const updated = {
      ...seat,
      type: newType,
      priceMultiplier: newMultiplier,
    };

    setSeats((prev) => prev.map((s) => (s.id === seat.id ? updated : s)));

    setChangedSeats((prev) => ({
      ...prev,
      [seat.id]: updated,
    }));
  };

  const handleSave = async () => {
    const payload = Object.values(changedSeats).map((s) => ({
      id: s.id,
      type: s.type,
      priceMultiplier: s.priceMultiplier,
    }));

    if (payload.length === 0) {
      message.info("Chưa có thay đổi");
      return;
    }

    await roomService.updateSeats(room.id, payload);
    message.success("Đã lưu sơ đồ ghế");
    loadSeats();
  };

  // group theo hàng
  const grouped = seats.reduce((acc, s) => {
    acc[s.row] = acc[s.row] || [];
    acc[s.row].push(s);
    return acc;
  }, {});

  return (
    <Modal
      open={open}
      width={900}
      title={`Sơ đồ ghế – ${room.name}`}
      onCancel={onClose}
      footer={null}
    >
      {/* LEGEND */}
      <Space style={{ marginBottom: 16 }}>
        <Button size="small">Ghế thường</Button>
        <Button size="small" type="primary">
          Ghế VIP
        </Button>
        {disabled && (
          <Text type="danger">Phòng có lịch chiếu → không thể chỉnh ghế</Text>
        )}
      </Space>

      {/* SEAT MAP */}
      {Object.keys(grouped).map((row) => (
        <div key={row} style={{ marginBottom: 12 }}>
          <b>{row}</b>
          <Space wrap>
            {grouped[row].map((seat) => (
              <Button
                key={seat.id}
                type={seat.type === "VIP" ? "primary" : "default"}
                onClick={() => toggleSeatType(seat)}
                disabled={disabled}
              >
                {seat.number}
              </Button>
            ))}
          </Space>
        </div>
      ))}

      {/* SAVE */}
      {!disabled && (
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <Button type="primary" onClick={handleSave}>
            Lưu sơ đồ ghế
          </Button>
        </div>
      )}
    </Modal>
  );
}
