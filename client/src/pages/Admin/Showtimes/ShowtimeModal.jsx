import { useEffect, useState } from "react";
import {
  Modal,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
  Space,
  message,
} from "antd";
import movieService from "../../../services/Admin/movieService";
import roomService from "../../../services/Admin/roomService";
import showtimeService from "../../../services/Admin/showtimeService";
import dayjs from "dayjs";

export default function ShowtimeModal({
  open,
  onClose,
  onSuccess,
  editing,
  selectedRoom,
}) {
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  const [movieId, setMovieId] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [basePrice, setBasePrice] = useState(90000);

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // ------------------------------
  // LOAD phim + rạp + phòng
  // ------------------------------
  useEffect(() => {
    movieService.getAll().then((res) => setMovies(res.data || []));

    roomService.getAll().then((res) => {
      const all = res.data || [];
      setRooms(all);

      const unique = {};
      all.forEach((r) => {
        if (r.Cinema) unique[r.Cinema.id] = r.Cinema;
      });

      setCinemas(Object.values(unique));
    });
  }, []);

  // ------------------------------
  // Nếu EDIT → load form
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

      // Tự xác định CINEMA từ roomId
      const room = rooms.find((r) => r.id === editing.roomId);
      if (room) setSelectedCinema(room.Cinema?.id);
    } else {
      setMovieId(null);
      setRoomId(null);
      setSelectedCinema(null);
      setBasePrice(90000);
      setDate(null);
      setStartTime(null);
      setEndTime(null);
    }
  }, [editing, rooms]);

  // ⭐ Nếu bấm "Thêm suất" trong phòng → tự chọn đúng rạp + phòng
  useEffect(() => {
    // Chỉ chạy khi rooms đã load
    if (!rooms.length) return;

    if (selectedRoom) {
      console.log("⭐ Modal nhận selectedRoom:", selectedRoom);
      setSelectedCinema(selectedRoom.Cinema?.id);
      setRoomId(selectedRoom.id);
    }
  }, [selectedRoom, rooms]);

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
  // SAVE suất chiếu
  // ------------------------------
  const handleSave = async () => {
    if (!movieId || !roomId || !date || !startTime || !endTime) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const payload = {
      movieId,
      roomId,
      startTime: dayjs(
        `${date.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}`
      ).toISOString(),
      endTime: endTime.toISOString(),
      basePrice,
    };

    console.log("👉 PAYLOAD FE:", payload);

    const res = editing
      ? await showtimeService.update(editing.id, payload)
      : await showtimeService.create(payload);

    if (res.success) {
      message.success(
        editing
          ? "Cập nhật suất chiếu thành công!"
          : "Tạo suất chiếu thành công!"
      );
      onSuccess();
      onClose();
    } else {
      message.error("Lỗi: " + res.error);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={600}>
      <h2>{editing ? "Sửa Suất Chiếu" : "Tạo Suất Chiếu Mới"}</h2>

      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        {/* CHỌN PHIM */}
        <Select
          placeholder="Chọn phim"
          value={movieId}
          onChange={setMovieId}
          options={movies.map((m) => ({ value: m.id, label: m.title }))}
        />

        {/* CHỌN RẠP */}
        <Select
          placeholder="Chọn rạp"
          value={selectedCinema}
          onChange={(v) => {
            setSelectedCinema(v);
            setRoomId(null);
          }}
          options={cinemas.map((c) => ({ value: c.id, label: c.name }))}
        />

        {/* CHỌN PHÒNG */}
        <Select
          placeholder="Chọn phòng"
          value={roomId}
          disabled={!selectedCinema}
          onChange={setRoomId}
          options={rooms
            .filter((r) => r.Cinema?.id === selectedCinema)
            .map((r) => ({ value: r.id, label: r.name }))}
        />

        {/* GIÁ */}
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

        {/* NGÀY + GIỜ */}
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
