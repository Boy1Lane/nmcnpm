// import { useEffect, useState } from "react";
// import {
//   Modal,
//   Select,
//   DatePicker,
//   TimePicker,
//   InputNumber,
//   Button,
//   Space,
// } from "antd";
// import movieService from "../../../services/Admin/movieService";
// import roomService from "../../../services/Admin/roomService";
// import showtimeService from "../../../services/Admin/showtimeService";
// import dayjs from "dayjs";

// export default function ShowtimeModal({
//   open,
//   onClose,
//   onSuccess,
//   editing,
//   selectedRoom,
// }) {
//   const [movies, setMovies] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [cinemas, setCinemas] = useState([]);

//   const [movieId, setMovieId] = useState(null);
//   const [selectedCinema, setSelectedCinema] = useState(null);
//   const [roomId, setRoomId] = useState(null);
//   const [basePrice, setBasePrice] = useState(90000);

//   const [date, setDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);

//   // ------------------------------
//   // LOAD phim + rạp + phòng
//   // ------------------------------
//   useEffect(() => {
//     movieService.getAll().then((res) => setMovies(res.data || []));

//     roomService.getAll().then((res) => {
//       const all = res.data || [];
//       setRooms(all);

//       const unique = {};
//       all.forEach((r) => {
//         if (r.Cinema) unique[r.Cinema.id] = r.Cinema;
//       });

//       setCinemas(Object.values(unique));
//     });
//   }, []);

//   // ------------------------------
//   // Nếu EDIT → load form
//   // ------------------------------
//   useEffect(() => {
//     if (editing) {
//       setMovieId(editing.movieId);
//       setRoomId(editing.roomId);
//       setBasePrice(editing.basePrice);

//       const start = dayjs(editing.startTime);
//       const end = dayjs(editing.endTime);

//       setDate(start);
//       setStartTime(start);
//       setEndTime(end);

//       // Tự xác định CINEMA từ roomId
//       const room = rooms.find((r) => r.id === editing.roomId);
//       if (room) setSelectedCinema(room.Cinema?.id);
//     } else {
//       setMovieId(null);
//       setRoomId(null);
//       setSelectedCinema(null);
//       setBasePrice(90000);
//       setDate(null);
//       setStartTime(null);
//       setEndTime(null);
//     }
//   }, [editing, rooms]);

//   // ⭐ Nếu bấm "Thêm suất" trong phòng → tự chọn đúng rạp + phòng
//   useEffect(() => {
//     if (selectedRoom) {
//       setSelectedCinema(selectedRoom.Cinema?.id);
//       setRoomId(selectedRoom.id);
//     }
//   }, [selectedRoom]);

//   // ------------------------------
//   // Tự tính giờ kết thúc
//   // ------------------------------
//   useEffect(() => {
//     if (!movieId || !startTime || !date) return;

//     const movie = movies.find((m) => m.id === movieId);
//     if (!movie) return;

//     const start = dayjs(
//       `${date.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}`
//     );
//     const end = start.add(movie.duration, "minute");

//     setEndTime(end);
//   }, [movieId, startTime, date]);

//   // ------------------------------
//   // SAVE suất chiếu
//   // ------------------------------
//   const handleSave = async () => {
//     if (!movieId || !roomId || !date || !startTime || !endTime) {
//       alert("Vui lòng nhập đầy đủ thông tin!");
//       return;
//     }

//     const payload = {
//       movieId,
//       roomId,
//       startTime: dayjs(
//         `${date.format("YYYY-MM-DD")} ${startTime.format("HH:mm")}`
//       ).toISOString(),
//       endTime: endTime.toISOString(),
//       basePrice,
//     };

//     console.log("👉 PAYLOAD FE:", payload);

//     const res = editing
//       ? await showtimeService.update(editing.id, payload)
//       : await showtimeService.create(payload);

//     if (res.success) {
//       onSuccess();
//       onClose();
//     } else alert("Lỗi: " + res.error);
//   };

//   return (
//     <Modal open={open} onCancel={onClose} footer={null} width={600}>
//       <h2 className="page-title">
//         {editing ? "Sửa Suất Chiếu" : "Tạo Suất Chiếu Mới"}
//       </h2>

//       <Space orientation="vertical" style={{ width: "100%" }} size="large">
//         {/* CHỌN PHIM */}
//         <Select
//           placeholder="Chọn phim"
//           value={movieId}
//           onChange={setMovieId}
//           options={movies.map((m) => ({ value: m.id, label: m.title }))}
//         />

//         {/* CHỌN RẠP */}
//         <Select
//           placeholder="Chọn rạp"
//           value={selectedCinema}
//           onChange={(v) => {
//             setSelectedCinema(v);
//             setRoomId(null);
//           }}
//           options={cinemas.map((c) => ({ value: c.id, label: c.name }))}
//         />

//         {/* CHỌN PHÒNG */}
//         <Select
//           placeholder="Chọn phòng"
//           value={roomId}
//           disabled={!selectedCinema}
//           onChange={setRoomId}
//           options={rooms
//             .filter((r) => r.Cinema?.id === selectedCinema)
//             .map((r) => ({ value: r.id, label: r.name }))}
//         />

//         {/* GIÁ */}
//         <Space.Compact block style={{ width: "100%" }}>
//           <div
//             style={{
//               background: "#f5f5f5",
//               padding: "8px 12px",
//               borderRadius: "6px 0 0 6px",
//               border: "1px solid #d9d9d9",
//               borderRight: "none",
//             }}
//           >
//             Giá chuẩn
//           </div>

//           <InputNumber
//             min={0}
//             value={basePrice}
//             style={{ width: "100%" }}
//             onChange={setBasePrice}
//           />
//         </Space.Compact>

//         {/* NGÀY + GIỜ */}
//         <Space>
//           <DatePicker value={date} onChange={setDate} />
//           <TimePicker
//             value={startTime}
//             format="HH:mm"
//             onChange={setStartTime}
//           />
//         </Space>

//         <div>Giờ kết thúc: {endTime ? endTime.format("HH:mm") : "--:--"}</div>

//         <Button type="primary" onClick={handleSave} block>
//           {editing ? "Cập nhật" : "Lưu suất chiếu"}
//         </Button>
//       </Space>
//     </Modal>
//   );
// }

import { useEffect, useState } from "react";
import {
  Modal,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
  Space,
  Form,
  Row,
  Col,
  Typography,
} from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import movieService from "../../../services/Admin/movieService";
import roomService from "../../../services/Admin/roomService";
import showtimeService from "../../../services/Admin/showtimeService";
import dayjs from "dayjs";
import "../../../styles/Admin/Showtimes.css";

const { Text } = Typography;

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

  // --- Logic Load Data (Giữ nguyên) ---
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

  useEffect(() => {
    if (selectedRoom) {
      setSelectedCinema(selectedRoom.Cinema?.id);
      setRoomId(selectedRoom.id);
    }
  }, [selectedRoom]);

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
      basePrice,
    };
    const res = editing
      ? await showtimeService.update(editing.id, payload)
      : await showtimeService.create(payload);
    if (res.success) {
      onSuccess();
      onClose();
    } else alert("Lỗi: " + res.error);
  };

  // --- Render UI Mới ---
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
      className="custom-modal"
      closeIcon={<CloseOutlined style={{ color: "white" }} />}
    >
      {/* Header Gradient đẹp mắt */}
      <div className="modal-header-bg">
        {editing ? "CHỈNH SỬA SUẤT CHIẾU" : "THIẾT LẬP SUẤT CHIẾU MỚI"}
      </div>

      <div className="modal-body">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Chọn Phim" required>
                <Select
                  showSearch
                  placeholder="Tìm kiếm phim..."
                  optionFilterProp="label"
                  value={movieId}
                  onChange={setMovieId}
                  size="large"
                  options={movies.map((m) => ({ value: m.id, label: m.title }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Cụm Rạp" required>
                <Select
                  placeholder="Chọn rạp chiếu"
                  value={selectedCinema}
                  onChange={(v) => {
                    setSelectedCinema(v);
                    setRoomId(null);
                  }}
                  size="large"
                  options={cinemas.map((c) => ({ value: c.id, label: c.name }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Phòng Chiếu" required>
                <Select
                  placeholder="Chọn phòng"
                  value={roomId}
                  disabled={!selectedCinema}
                  onChange={setRoomId}
                  size="large"
                  options={rooms
                    .filter((r) => r.Cinema?.id === selectedCinema)
                    .map((r) => ({ value: r.id, label: r.name }))}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Ngày Chiếu" required>
                <DatePicker
                  value={date}
                  onChange={setDate}
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Giờ Bắt Đầu" required>
                <TimePicker
                  value={startTime}
                  onChange={setStartTime}
                  format="HH:mm"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Giờ Kết Thúc">
                <div
                  style={{
                    height: 40,
                    background: "#f5f5f5",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 12,
                    fontWeight: "bold",
                    color: "#6200ea",
                  }}
                >
                  {endTime ? endTime.format("HH:mm") : "--:--"}
                </div>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Giá Vé Tiêu Chuẩn (VND)" required>
                <InputNumber
                  min={0}
                  value={basePrice}
                  style={{ width: "100%" }}
                  size="large"
                  onChange={setBasePrice}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <Button size="large" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ background: "#6200ea", borderColor: "#6200ea" }}
            >
              {editing ? "Cập nhật dữ liệu" : "Lưu Suất Chiếu"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
