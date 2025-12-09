import { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosAdmin from "../../services/Admin/axiosAdmin.js";
import axiosClient from "../../services/Client/axiosClient.js";
import dayjs from "dayjs";
import "../../styles/Admin/MovieManagement.css";

export default function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [search, setSearch] = useState("");

  // ⭐ GET API – lấy danh sách phim thật từ backend
  useEffect(() => {
    fetchMovies();
  }, []);

  const resetEditing = () => {
    setIsEditing(false);
    setEditingMovie(null);
  };

  const fetchMovies = async () => {
    try {
      const res = await axiosClient.get("/movies");
      console.log("📌 FE nhận từ backend:", res.data);
      setMovies(res.data);
      console.log("Backend trả về:", res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách phim!");
    }
  };

  const columns = [
    {
      key: "1",
      title: "Poster",
      dataIndex: "posterUrl",
      render: (poster) => (
        <img
          src={poster}
          style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
    { key: "2", title: "Tên phim", dataIndex: "title" },
    { key: "3", title: "Thể loại", dataIndex: "genre" },
    { key: "4", title: "Thời lượng", dataIndex: "duration" },
    {
      key: "5",
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <span
          className={
            status === "coming_soon" ? "tag-coming-soon" : "tag-now-showing"
          }
        >
          {status === "coming_soon" ? "Sắp chiếu" : "Đang chiếu"}
        </span>
      ),
    },
    {
      key: "6",
      title: "Hành động",
      render: (_, record) => (
        <>
          <EditOutlined
            onClick={() => onEditMovie(record)}
            style={{ marginRight: 12 }}
          />
          <DeleteOutlined
            onClick={() => onDeleteMovie(record)}
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  // ⭐ Thêm phim MỚI — GỌI API THẬT
  const onAddMovie = () => {
    setIsEditing(true);
    setEditingMovie({
      title: "",
      description: "",
      director: "",
      actor: "",
      genre: "",
      duration: "",
      releaseDate: null,
      posterUrl: "",
      trailerUrl: "",
    });
  };

  // sửa
  const onEditMovie = (movie) => {
    console.log("📌 Movie to edit:", movie);
    setIsEditing(true);
    setEditingMovie({
      id: movie.id, // 🔥 bắt buộc có ID
      title: movie.title,
      description: movie.description,
      director: movie.director,
      actor: movie.actor,
      genre: movie.genre,
      duration: movie.duration,
      releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      status: movie.status,
    });
  };

  // ⭐ Lưu phim (khi THÊM hoặc SỬA)
  const saveMovie = async () => {
    if (
      !editingMovie.title ||
      !editingMovie.duration ||
      !editingMovie.releaseDate
    ) {
      message.error("Vui lòng nhập đầy đủ *Tên phim, Thời lượng, Ngày chiếu*");
      return;
    }

    const payload = {
      title: editingMovie.title,
      description: editingMovie.description,
      director: editingMovie.director,
      actor: editingMovie.actor,
      genre: editingMovie.genre,
      duration: editingMovie.duration,
      releaseDate: dayjs(editingMovie.releaseDate).format("YYYY-MM-DD"),
      posterUrl: editingMovie.posterUrl,
      trailerUrl: editingMovie.trailerUrl,
      status: editingMovie.status || "coming_soon",
    };

    try {
      // Nếu có ID → UPDATE
      if (editingMovie.id) {
        await axiosAdmin.put(`/movies/${editingMovie.id}`, payload);
        message.success("Cập nhật phim thành công!");
      } else {
        await axiosAdmin.post("/movies", payload);
        message.success("Thêm phim thành công!");
      }

      fetchMovies();
      resetEditing();
    } catch (err) {
      console.error("❌ Lỗi UPDATE/CREATE:", err);
      message.error("Lỗi! Không lưu được phim.");
    }
  };

  const onDeleteMovie = (movie) => {
    console.log("🟡 FE chuẩn bị xoá:", movie);
    Modal.confirm({
      title: "Bạn có chắc muốn xóa phim này?",
      okText: "Xóa",
      okType: "danger",
      onOk: async () => {
        try {
          await axiosAdmin.delete(`/movies/${movie.id}`);
          message.success("Đã xóa phim!");
          // ⭐ Cập nhật danh sách mà không cần fetch lại
          setMovies((prev) => prev.filter((m) => m.id !== movie.id));
        } catch (err) {
          message.error("Xóa thất bại!");
        }
      },
    });
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20, background: "white", borderRadius: 8 }}>
      <h2>Quản lý Phim</h2>

      <Button type="primary" onClick={onAddMovie}>
        + Thêm phim mới
      </Button>

      <Input
        placeholder="Tìm kiếm phim..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 300, marginTop: 15, marginBottom: 10 }}
      />

      <div className="movie-table-wrapper">
        <Table
          style={{ marginTop: 10 }}
          rowKey="id"
          columns={columns}
          dataSource={filteredMovies}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editingMovie?.id ? "Chỉnh sửa phim" : "Thêm phim mới"}
        open={isEditing}
        okText="Lưu"
        onCancel={resetEditing}
        onOk={saveMovie}
      >
        <Input
          value={editingMovie?.title}
          placeholder="Tên phim"
          onChange={(e) =>
            setEditingMovie((pre) => ({ ...pre, title: e.target.value }))
          }
        />

        {/* ĐẠO DIỄN */}
        <Input
          value={editingMovie?.director}
          placeholder="Đạo diễn"
          style={{ marginTop: 10 }}
          onChange={(e) =>
            setEditingMovie((pre) => ({ ...pre, director: e.target.value }))
          }
        />

        {/* DIỄN VIÊN */}
        <Input
          value={editingMovie?.actor}
          placeholder="Diễn viên"
          style={{ marginTop: 10 }}
          onChange={(e) =>
            setEditingMovie((pre) => ({ ...pre, actor: e.target.value }))
          }
        />

        <Input
          value={editingMovie?.genre}
          placeholder="Thể loại"
          style={{ marginTop: 10 }}
          onChange={(e) =>
            setEditingMovie((pre) => ({ ...pre, genre: e.target.value }))
          }
        />

        <Input
          value={editingMovie?.duration}
          placeholder="Thời lượng (phút)"
          style={{ marginTop: 10 }}
          onChange={(e) =>
            setEditingMovie((pre) => ({ ...pre, duration: e.target.value }))
          }
        />

        <DatePicker
          style={{ width: "100%", marginTop: 10 }}
          value={editingMovie?.releaseDate}
          onChange={(date) =>
            setEditingMovie((pre) => ({ ...pre, releaseDate: date }))
          }
        />

        {/* TRAILER */}
        <Input
          value={editingMovie?.trailerUrl}
          placeholder="Trailer URL"
          style={{ marginTop: 10 }}
          onChange={(e) =>
            setEditingMovie((pre) => ({ ...pre, trailerUrl: e.target.value }))
          }
        />

        <Input
          value={editingMovie?.posterUrl}
          placeholder="Poster URL"
          style={{ marginTop: 10 }}
          onChange={(e) =>
            setEditingMovie((pre) => ({ ...pre, posterUrl: e.target.value }))
          }
        />

        {/* MÔ TẢ */}
        <Input.TextArea
          rows={3}
          value={editingMovie?.description}
          placeholder="Tóm tắt phim"
          style={{ marginTop: 10 }}
          onChange={(e) =>
            setEditingMovie((pre) => ({ ...pre, description: e.target.value }))
          }
        />
      </Modal>
    </div>
  );
}
