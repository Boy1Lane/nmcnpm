import { useEffect, useState } from "react";
import {
  Card,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Table,
  Pagination,
  message,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import reportService from "../../../services/Admin/reportService";
import RevenueChart from "./RevenueCharts";

const { Title, Text } = Typography;
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

  // ================= LOAD + JOIN =================
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

  // ================= FILTER =================
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

  // ================= TOTAL =================
  const totalRevenue = filtered.reduce((sum, b) => sum + b.totalPrice, 0);

  // ================= TABLE =================
  const columns = [
    {
      title: "Mã GD",
      render: (_, r) => `#ORD-${r.id}`,
    },
    {
      title: "Ngày giờ",
      render: (_, r) => dayjs(r.createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Phim",
      dataIndex: "movieTitle",
    },
    {
      title: "Rạp / Phòng",
      dataIndex: "cinemaRoom",
    },
    {
      title: "Số vé",
      dataIndex: "ticketCount",
    },
    {
      title: "Tổng tiền",
      render: (_, r) => (
        <span
          style={{
            color: "#c0392b",
            fontWeight: 600,
          }}
        >
          {r.totalPrice.toLocaleString()} đ
        </span>
      ),
    },
  ];

  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ================= EXPORT EXCEL =================
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

    const buf = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buf]), "bao_cao_doanh_thu.xlsx");
  };

  // ================= RENDER =================
  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3}>Báo cáo Doanh thu</Title>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportExcel}
        >
          Xuất Báo cáo
        </Button>
      </Row>

      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col>
            <RangePicker
              onChange={(dates) =>
                setFilters({
                  ...filters,
                  dates,
                })
              }
            />
          </Col>
          <Col>
            <Select
              style={{ width: 180 }}
              value={filters.cinemaId}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  cinemaId: v,
                })
              }
            >
              <Select.Option value="all">Tất cả rạp</Select.Option>
              {cinemas.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              style={{ width: 180 }}
              value={filters.movieId}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  movieId: v,
                })
              }
            >
              <Select.Option value="all">Tất cả phim</Select.Option>
              {movies.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.title}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={handleFilter}>
              Lọc dữ liệu
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Text>Tổng doanh thu (kỳ này)</Text>
            <Title level={2}>{totalRevenue.toLocaleString()} đ</Title>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="Doanh thu 7 ngày qua">
            <RevenueChart bookings={filtered} />
          </Card>
        </Col>
      </Row>

      <Card title="Giao dịch gần đây">
        <Table
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
          style={{
            marginTop: 16,
            textAlign: "right",
          }}
        />
      </Card>
    </>
  );
}
