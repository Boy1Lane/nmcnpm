import { useEffect, useState } from "react";
import { Modal, Button, Space, Typography, message } from "antd";
import roomService from "../../../services/Admin/roomService";

// 👇 IMPORT FILE CSS VÀO ĐÂY
import "../../../styles/Admin/Room.css";

const { Text } = Typography;

export default function SeatMapModal({ open, room, disabled, onClose }) {
  const [seats, setSeats] = useState([]);
  const [changedSeats, setChangedSeats] = useState({});

  const loadSeats = async () => {
    const res = await roomService.getSeats(room.id);
    const sortedSeats = res.data.slice().sort((a, b) => {
      if (a.row === b.row) {
        return a.number - b.number;
      }
      return a.row.localeCompare(b.row);
    });

    setSeats(sortedSeats);
    setChangedSeats({});
  };

  useEffect(() => {
    if (open) loadSeats();
  }, [open]);

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
    setChangedSeats((prev) => ({ ...prev, [seat.id]: updated }));
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

  const grouped = seats.reduce((acc, s) => {
    acc[s.row] = acc[s.row] || [];
    acc[s.row].push(s);
    return acc;
  }, {});

  return (
    <Modal
      open={open}
      width={900}
      title={`Sơ đồ ghế – ${room?.name}`} // Thêm dấu ? phòng khi room chưa load kịp
      onCancel={onClose}
      footer={null}
      centered
    >
      {/* 1. CHÚ THÍCH (LEGEND) */}
      <div className="legend-container">
        <Space size="large">
          <div className="legend-item">
            <Button size="small" className="cursor-default seat-normal">
              Ghế thường
            </Button>
          </div>
          <div className="legend-item">
            <Button
              size="small"
              type="primary"
              className="cursor-default seat-vip"
            >
              Ghế VIP
            </Button>
          </div>
        </Space>
      </div>

      {disabled && (
        <Text type="danger" className="warning-text">
          Phòng có lịch chiếu → không thể chỉnh ghế
        </Text>
      )}

      {/* 2. MÀN HÌNH (SCREEN) */}
      <div className="screen-wrapper">
        <div className="screen-visual">
          <span className="screen-text">MÀN HÌNH</span>
        </div>
      </div>

      {/* 3. SƠ ĐỒ GHẾ (SEAT MAP) */}
      <div className="seat-map-container">
        {Object.keys(grouped).map((row) => (
          <div key={row} className="seat-row">
            {/* Tên hàng (A, B, C...) */}
            <div className="row-label">{row}</div>

            {/* Các ghế trong hàng */}
            <Space wrap>
              {grouped[row].map((seat) => (
                <Button
                  key={seat.id}
                  // 1. Thêm logic class CSS vào đây
                  className={`seat-btn ${
                    seat.type === "VIP" ? "seat-vip" : "seat-normal"
                  }`}
                  // 2. Có thể bỏ type="primary" đi để tránh màu mặc định của Antd làm rối,
                  // hoặc giữ lại nếu muốn giữ hiệu ứng click
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
      </div>

      {/* 4. FOOTER (NÚT LƯU) */}
      {!disabled && (
        <div className="modal-footer">
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            className="save-btn"
          >
            Lưu sơ đồ ghế
          </Button>
        </div>
      )}
    </Modal>
  );
}
