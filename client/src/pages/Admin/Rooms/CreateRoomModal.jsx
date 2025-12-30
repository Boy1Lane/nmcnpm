import { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Input,
  Select,
  InputNumber,
  Space,
  message,
  Button,
  Typography,
} from "antd";
import axiosAdmin from "../../../services/Admin/axiosAdmin";
import roomService from "../../../services/Admin/roomService";
import "../../../styles/Admin/Room.css";

const { Text } = Typography;

function CreateRoomModal({ open, onClose, onSuccess }) {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Form nhập liệu (Giữ nguyên logic cũ)
  const [form, setForm] = useState({
    cinemaId: null,
    name: "",
    type: "2D",
    rows: 8,
    cols: 12,
  });

  // State lưu danh sách ghế để hiển thị và cấu hình
  const [seatList, setSeatList] = useState([]);

  // 1. Load danh sách rạp (Logic cũ)
  useEffect(() => {
    axiosAdmin.get("/cinemas").then((res) => setCinemas(res.data));
  }, []);

  // 2. Logic mới: Tự động sinh ghế khi thay đổi rows/cols để Preview
  useEffect(() => {
    const newSeats = [];
    for (let r = 0; r < form.rows; r++) {
      const rowChar = String.fromCharCode(65 + r); // A, B, C...
      for (let c = 1; c <= form.cols; c++) {
        newSeats.push({
          id: `${rowChar}${c}`, // ID tạm để render list
          row: rowChar,
          number: c,
          type: "NORMAL", // Mặc định NORMAL
          priceMultiplier: 1,
        });
      }
    }
    setSeatList(newSeats);
  }, [form.rows, form.cols]);

  // Hàm toggle loại ghế VIP <-> NORMAL
  const toggleSeatType = (seatId) => {
    setSeatList((prev) =>
      prev.map((s) => {
        if (s.id === seatId) {
          const newType = s.type === "VIP" ? "NORMAL" : "VIP";
          return {
            ...s,
            type: newType,
            priceMultiplier: newType === "VIP" ? 1.2 : 1.0,
          };
        }
        return s;
      })
    );
  };

  // Group ghế theo hàng để render giao diện (A, B, C...)
  const groupedSeats = useMemo(() => {
    return seatList.reduce((acc, s) => {
      acc[s.row] = acc[s.row] || [];
      acc[s.row].push(s);
      return acc;
    }, {});
  }, [seatList]);

  const handleOk = async () => {
    if (!form.cinemaId || !form.name) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const totalSeats = form.rows * form.cols;

      // 1️⃣ Tạo phòng thuộc rạp (Logic gốc)
      const res = await roomService.createInCinema(form.cinemaId, {
        name: form.name,
        totalSeats,
        type: form.type,
      });

      const roomId = res.data.room.id;

      // 2️⃣ Sinh ghế (Logic gốc nhưng lấy dữ liệu từ seatList đã cấu hình)
      // Map lại đúng format server cần (bỏ field 'id' tạm đi)
      const seatsPayload = seatList.map((s) => ({
        row: s.row,
        number: s.number,
        type: s.type,
        priceMultiplier: s.priceMultiplier,
      }));

      await roomService.addSeats(roomId, seatsPayload);

      message.success("Đã tạo phòng chiếu");

      // Reset form
      setForm({ cinemaId: null, name: "", type: "2D", rows: 8, cols: 12 });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Tạo phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Tạo phòng chiếu & Cấu hình ghế"
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu phòng"
      cancelText="Hủy"
      confirmLoading={loading}
      width={900}
      centered
      destroyOnHidden
    >
      <div className="create-room-form">
        {/* Chọn Rạp */}
        <div className="form-group">
          <Text className="form-label">Thuộc rạp:</Text>
          <Select
            placeholder="Chọn rạp"
            value={form.cinemaId}
            onChange={(v) => setForm({ ...form, cinemaId: v })}
            className="full-width-select"
          >
            {cinemas.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Space style={{ width: "100%" }} size="middle">
          {/* Tên phòng */}
          <div className="form-group" style={{ flex: 1 }}>
            <Text className="form-label">Tên phòng:</Text>
            <Input
              placeholder="Ví dụ: Cinema 01"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Loại phòng */}
          <div className="form-group" style={{ width: 140 }}>
            <Text className="form-label">Loại:</Text>
            <Select
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v })}
              className="full-width-select"
            >
              <Select.Option value="2D">2D</Select.Option>
              <Select.Option value="3D">3D</Select.Option>
              <Select.Option value="IMAX">IMAX</Select.Option>
            </Select>
          </div>
        </Space>

        {/* Cấu hình hàng/cột */}
        <div className="form-group">
          <Text className="form-label">Kích thước sơ đồ:</Text>
          <Space>
            <InputNumber
              min={1}
              max={20} // Giới hạn max 20 hàng cho đẹp
              addonBefore="Số hàng"
              value={form.rows}
              onChange={(v) => setForm({ ...form, rows: v || 1 })}
              style={{ width: 150 }}
            />
            <InputNumber
              min={1}
              max={40}
              addonBefore="Ghế/Hàng"
              value={form.cols}
              onChange={(v) => setForm({ ...form, cols: v || 1 })}
              style={{ width: 150 }}
            />
            <Text type="secondary" style={{ marginLeft: 8 }}>
              Tổng: {seatList.length} ghế
            </Text>
          </Space>
        </div>
      </div>

      {/* --- PHẦN CẤU HÌNH GHẾ --- */}
      <div className="seat-map-preview">
        <Text className="preview-title">
          Cấu hình nhanh (Click ghế để đổi VIP/Thường)
        </Text>

        <div className="legend-container">
          <Button size="small" className="seat-normal">
            Thường
          </Button>
          <Button size="small" className="seat-vip">
            VIP (+20%)
          </Button>
        </div>

        <div className="screen-wrapper">
          <div className="screen-visual">
            <span className="screen-text">MÀN HÌNH</span>
          </div>
        </div>

        <div className="seat-rows-container">
          {Object.keys(groupedSeats).map((row) => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>
              <Space wrap size={4}>
                {groupedSeats[row].map((seat) => (
                  <Button
                    key={seat.id}
                    className={`seat-btn-config ${
                      seat.type === "VIP" ? "seat-vip" : "seat-normal"
                    }`}
                    onClick={() => toggleSeatType(seat.id)}
                  >
                    {seat.number}
                  </Button>
                ))}
              </Space>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default CreateRoomModal;
