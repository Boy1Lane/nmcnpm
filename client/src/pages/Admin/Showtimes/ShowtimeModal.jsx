import { useEffect, useState } from "react";
import {
  Modal,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
  Space,
} from "antd";
import movieService from "../../../services/Admin/movieService";
import roomService from "../../../services/Admin/roomService";
import showtimeService from "../../../services/Admin/showtimeService";
import dayjs from "dayjs";

export default function ShowtimeModal({ open, onClose, onSuccess, editing }) {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [movieId, setMovieId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [basePrice, setBasePrice] = useState(90000);

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // ------------------------------
  // LOAD danh sách phim + phòng
  // ------------------------------
  useEffect(() => {
    movieService.getAll().then((res) => setMovies(res.data || []));
    roomService.getAll().then((res) => setRooms(res.data || []));
  }, []);

  // ------------------------------
  // Nếu EDIT → load dữ liệu vào form
  // ------------------------------
  useEffect(() => {
    if (editing) {
      setMovieId(editing.movieId);
      setRoomId(editing.roomId);
      setBasePrice(editing.basePrice);

      const start = dayjs(editing.startTime);
      const end = dayjs(editing.endTime);

      setDate(start);
      setStartTime(start);
      setEndTime(end);
    } else {
      // reset form khi tạo mới
      setMovieId(null);
      setRoomId(null);
      setBasePrice(90000);
      setDate(null);
      setStartTime(null);
      setEndTime(null);
    }
  }, [editing]);

  // ------------------------------
  // Tự tính giờ kết thúc
  // ------------------------------
  useEffect(() => {
    if (!movieId || !startTime || !date) return;

    const movie = movies.find((m) => m.id === movieId);
    if (!movie) return;

    const start = dayjs(
      `${date.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}`
    );
    const end = start.add(movie.duration, "minute");

    setEndTime(end);
  }, [movieId, startTime, date]);

  // ------------------------------
  // Lưu suất chiếu
  // ------------------------------
  const handleSave = async () => {
    if (!movieId || !roomId || !date || !startTime || !endTime) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const payload = {
      movieId,
      roomId,
      startTime: dayjs(
        `${date.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}`
      ).toISOString(),
      endTime: endTime.toISOString(),
      basePrice: basePrice,
    };

    console.log("👉 PAYLOAD FE GỬI LÊN:", payload);

    let res;
    if (editing) {
      res = await showtimeService.update(editing.id, payload);
    } else {
      res = await showtimeService.create(payload);
    }

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      alert("Lỗi: " + res.error);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={600}>
      <h2>{editing ? "Sửa Suất Chiếu" : "Tạo Suất Chiếu Mới"}</h2>

      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Select
          placeholder="Chọn phim"
          value={movieId}
          onChange={setMovieId}
          options={movies.map((m) => ({ value: m.id, label: m.title }))}
        />

        <Select
          placeholder="Chọn phòng"
          value={roomId}
          onChange={setRoomId}
          options={rooms.map((r) => ({ value: r.id, label: r.name }))}
        />

        <Space.Compact block style={{ width: "100%" }}>
          <div
            style={{
              background: "#f5f5f5",
              padding: "8px 12px",
              borderRadius: "6px 0 0 6px",
              border: "1px solid #d9d9d9",
              borderRight: "none",
            }}
          >
            Giá chuẩn
          </div>

          <InputNumber
            min={0}
            value={basePrice}
            style={{ width: "100%" }}
            onChange={setBasePrice}
          />
        </Space.Compact>

        <Space>
          <DatePicker value={date} onChange={setDate} />
          <TimePicker
            value={startTime}
            format="HH:mm"
            onChange={setStartTime}
          />
        </Space>

        <div>Giờ kết thúc: {endTime ? endTime.format("HH:mm") : "--:--"}</div>

        <Button type="primary" onClick={handleSave} block>
          {editing ? "Cập nhật" : "Lưu suất chiếu"}
        </Button>
      </Space>
    </Modal>
  );
}
