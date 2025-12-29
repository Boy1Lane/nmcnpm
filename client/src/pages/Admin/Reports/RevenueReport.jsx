import { useEffect, useState } from "react";
import {
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Table,
  Pagination,
  message,
} from "antd";
import {
  DownloadOutlined,
  FilterOutlined,
  DollarOutlined, // Đổi icon cho hợp style mới
  RiseOutlined, // Icon tăng trưởng
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import reportService from "../../../services/Admin/reportService";
import RevenueChart from "./RevenueCharts";
import "../../../styles/Admin/Report.css";

dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

export default function RevenueReport() {
  const [rawBookings, setRawBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [filters, setFilters] = useState({
    dates: null,
    cinemaId: "all",
    movieId: "all",
  });

  useEffect(() => {
    loadData();
  }, []);

  // --- LOGIC LOAD DATA (GIỮ NGUYÊN) ---
  const loadData = async () => {
    try {
      const [bookingRes, showtimeRes, roomRes, cinemaRes, movieRes] =
        await Promise.all([
          reportService.getBookings(),
          reportService.getShowtimes(),
          reportService.getRooms(),
          reportService.getCinemas(),
          reportService.getMovies(),
        ]);

      setCinemas(cinemaRes.data);
      setMovies(movieRes.data);

      const showtimeMap = Object.fromEntries(
        showtimeRes.data.map((s) => [s.id, s])
      );
      const roomMap = Object.fromEntries(roomRes.data.map((r) => [r.id, r]));
      const cinemaMap = Object.fromEntries(
        cinemaRes.data.map((c) => [c.id, c])
      );
      const movieMap = Object.fromEntries(movieRes.data.map((m) => [m.id, m]));

      const joined = bookingRes.data.map((b) => {
        const showtime = showtimeMap[b.showtimeId];
        const room = roomMap[showtime?.roomId];
        const cinema = cinemaMap[room?.cinemaId];
        const movie = movieMap[showtime?.movieId];

        return {
          ...b,
          cinemaId: cinema?.id,
          movieId: movie?.id,
          movieTitle: movie?.title || "—",
          cinemaRoom: cinema && room ? `${cinema.name} - ${room.name}` : "—",
          ticketCount: b.seats?.length || 0,
        };
      });

      const sorted = joined.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRawBookings(sorted);
      setFiltered(sorted);
    } catch (e) {
      console.error(e);
      message.error("Không tải được dữ liệu báo cáo");
    }
  };

  // --- LOGIC FILTER (GIỮ NGUYÊN) ---
  const handleFilter = () => {
    let data = [...rawBookings];
    if (filters.dates) {
      data = data.filter((b) =>
        dayjs(b.createdAt).isBetween(
          filters.dates[0].startOf("day"),
          filters.dates[1].endOf("day"),
          null,
          "[]"
        )
      );
    }
    if (filters.cinemaId !== "all") {
      data = data.filter((b) => b.cinemaId === filters.cinemaId);
    }
    if (filters.movieId !== "all") {
      data = data.filter((b) => b.movieId === filters.movieId);
    }
    setFiltered(data);
    setPage(1);
  };

  const totalRevenue = filtered.reduce((sum, b) => sum + b.totalPrice, 0);
  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // --- LOGIC EXPORT EXCEL (GIỮ NGUYÊN) ---
  const exportExcel = () => {
    const data = filtered.map((b) => ({
      "Mã GD": `ORD-${b.id}`,
      "Ngày giờ": dayjs(b.createdAt).format("DD/MM/YYYY HH:mm"),
      Phim: b.movieTitle,
      "Rạp / Phòng": b.cinemaRoom,
      "Số vé": b.ticketCount,
      "Tổng tiền": b.totalPrice,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doanh thu");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "bao_cao_doanh_thu.xlsx");
  };

  // --- DEFINITION COLUMN ---
  const columns = [
    {
      title: "Mã GD",
      dataIndex: "id",
      render: (id) => <span className="order-id-tag">#{id}</span>,
    },
    {
      title: "Ngày giờ",
      dataIndex: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY - HH:mm"),
    },
    {
      title: "Phim",
      dataIndex: "movieTitle",
      render: (text) => (
        <span style={{ fontWeight: 600, color: "#334155" }}>{text}</span>
      ),
    },
    {
      title: "Rạp / Phòng",
      dataIndex: "cinemaRoom",
      render: (text) => <span style={{ color: "#64748b" }}>{text}</span>,
    },
    {
      title: "Số vé",
      dataIndex: "ticketCount",
      align: "center",
      render: (count) => <span style={{ fontWeight: 600 }}>{count}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      align: "right",
      render: (price) => (
        <span className="price-text">{price.toLocaleString()} đ</span>
      ),
    },
  ];

  // ================= RENDER =================
  return (
    <div className="revenue-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Báo cáo Doanh thu</h2>
        </div>
        <Button
          className="btn-export"
          icon={<DownloadOutlined />}
          size="large"
          onClick={exportExcel}
        >
          Xuất Excel
        </Button>
      </div>

      {/* FILTER SECTION */}
      <div className="filter-card">
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} md={6}>
            <span className="filter-label">Chọn khoảng thời gian</span>
            <RangePicker
              style={{ width: "100%", height: "40px" }}
              format="DD/MM/YYYY"
              onChange={(dates) => setFilters({ ...filters, dates })}
            />
          </Col>
          <Col xs={24} md={6}>
            <span className="filter-label">Lọc theo Rạp</span>
            <Select
              style={{ width: "100%", height: "40px" }}
              value={filters.cinemaId}
              onChange={(v) => setFilters({ ...filters, cinemaId: v })}
            >
              <Select.Option value="all">-- Tất cả rạp --</Select.Option>
              {cinemas.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <span className="filter-label">Lọc theo Phim</span>
            <Select
              style={{ width: "100%", height: "40px" }}
              value={filters.movieId}
              onChange={(v) => setFilters({ ...filters, movieId: v })}
            >
              <Select.Option value="all">-- Tất cả phim --</Select.Option>
              {movies.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.title}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Button
              type="primary"
              className="btn-filter"
              icon={<FilterOutlined />}
              onClick={handleFilter}
              block
            >
              Áp dụng bộ lọc
            </Button>
          </Col>
        </Row>
      </div>

      {/* --- PHẦN THỐNG KÊ MỚI (FIX LAYOUT) --- */}
      <div className="dashboard-stats-container">
        {/* Cột trái: Thẻ tổng doanh thu */}
        <div className="stat-card revenue-card">
          <div className="stat-icon-wrapper">
            <DollarOutlined />
          </div>
          <div className="stat-content">
            <h3>Tổng doanh thu (Kỳ này)</h3>
            <h2 className="gradient-text">
              {totalRevenue.toLocaleString()} <small>VND</small>
            </h2>
            <p className="sub-text">
              <RiseOutlined /> Dữ liệu cập nhật theo thời gian thực
            </p>
          </div>
        </div>

        {/* Cột phải: Biểu đồ */}
        <div className="chart-card">
          <div className="chart-header-simple">
            Biểu đồ doanh thu 7 ngày gần nhất
          </div>
          {/* Wrapper này đảm bảo Rechart có height cụ thể để render */}
          <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
            <RevenueChart bookings={filtered} />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="table-card">
        <div className="table-header-title">Chi tiết giao dịch</div>
        <Table
          className="custom-table"
          columns={columns}
          dataSource={pagedData}
          rowKey="id"
          pagination={false}
        />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filtered.length}
          onChange={setPage}
          style={{ marginTop: 24, textAlign: "right" }}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
