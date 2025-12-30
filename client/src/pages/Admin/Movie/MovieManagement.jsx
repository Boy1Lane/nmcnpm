import { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Tooltip, Space } from "antd";
import {
  PlayCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import movieService from "../../../services/Admin/movieService";
import CreateMovieModal from "./CreateMovieModal";

// Đảm bảo đường dẫn CSS đúng
import "../../../styles/Admin/MovieManagement.css";

export default function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await movieService.getAll();
      // Giả sử res.data là mảng phim, giữ nguyên logic của bạn
      setMovies(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách phim!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (movie) => {
    Modal.confirm({
      title: "Xác nhận xóa phim",
      content: `Bạn có chắc muốn xóa phim "${movie.title}" không?`,
      okText: "Xóa ngay",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await movieService.delete(movie.id);
          message.success("Đã xóa phim thành công!");
          fetchMovies(); // Load lại danh sách
        } catch (err) {
          message.error("Xóa thất bại!");
        }
      },
    });
  };

  // Mở modal thêm mới
  const handleOpenAdd = () => {
    setEditingMovie(null);
    setIsModalOpen(true);
  };

  // Mở modal sửa
  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  // Lọc phim theo từ khóa tìm kiếm
  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Poster",
      dataIndex: "posterUrl",
      width: 80,
      align: "center",
      render: (url) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="table-poster-box">
            {url ? (
              <img src={url} alt="poster" className="table-poster-img" />
            ) : (
              <span style={{ fontSize: 10, color: "#ccc" }}>N/A</span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "title",
      render: (text) => (
        <span style={{ fontWeight: 600, fontSize: 15, color: "#1a1c23" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Thể loại",
      dataIndex: "genre",
      render: (text) => <span style={{ color: "#4c4f52" }}>{text}</span>,
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      render: (v) => <span style={{ color: "#4c4f52" }}>{v} phút</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      align: "center",
      render: (status) => {
        let colorClass = "status-coming";
        let text = "Sắp chiếu";
        if (status === "now_showing") {
          colorClass = "status-showing";
          text = "Đang chiếu";
        } else if (status === "ended") {
          colorClass = "status-ended";
          text = "Ngưng chiếu";
        }
        return <span className={`status-badge ${colorClass}`}>{text}</span>;
      },
    },
    {
      title: "Trailer",
      dataIndex: "trailerUrl",
      align: "center",
      width: 90,
      render: (url) =>
        url ? (
          <Tooltip title="Xem trailer">
            <Button
              type="text"
              shape="circle"
              icon={
                <PlayCircleOutlined
                  style={{ fontSize: 22, color: "#7e3af2" }}
                />
              }
              onClick={() => window.open(url, "_blank")}
            />
          </Tooltip>
        ) : (
          <span style={{ color: "#bbb", fontSize: 12 }}>---</span>
        ),
    },
    {
      title: "Hành động",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa phim">
            <button
              className="action-btn"
              onClick={() => handleOpenEdit(record)}
            >
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Xóa phim">
            <button
              className="action-btn delete"
              onClick={() => handleDelete(record)}
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý Phim</h2>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>
            Danh sách phim và lịch chiếu hiện tại
          </p>
        </div>

        <div className="header-actions">
          <Input
            placeholder="Tìm kiếm phim..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            className="search-input"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="btn-primary-custom"
            onClick={handleOpenAdd}
          >
            Thêm phim mới
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="content-card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredMovies}
          loading={loading}
          pagination={{
            pageSize: 6,
            position: ["bottomRight"],
            showSizeChanger: false,
          }}
        />
      </div>

      {/* Modal tách biệt */}
      <CreateMovieModal
        open={isModalOpen}
        movie={editingMovie}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMovies}
      />
    </div>
  );
}
