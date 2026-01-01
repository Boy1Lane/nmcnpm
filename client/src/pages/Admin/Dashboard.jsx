import { useEffect, useState } from "react";
import dashboardService from "../../services/Admin/dashboardService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Admin/Dashboard.css";
import {
  VideoCameraFilled, // Đổi sang icon đặc cho đậm
  ClockCircleFilled,
  SnippetsFilled, // Icon vé
  DollarCircleFilled,
  PlaySquareOutlined, // Icon trang trí nền
} from "@ant-design/icons";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 11) return "Chào buổi sáng";
  if (hour >= 11 && hour < 12) return "Chào buổi trưa";
  if (hour >= 12 && hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    movies: 0,
    showtimes: 0,
    tickets: 0,
    revenue: 0,
  });

  useEffect(() => {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    Promise.all([
      dashboardService.getMovies(),
      dashboardService.getShowtimesByDate(dateStr),
      dashboardService.getTodayStats(dateStr),
    ])
      .then(([moviesRes, showtimesRes, todayRes]) => {
        const showingMovies = moviesRes.data.filter(
          (m) => m.status === "showing"
        ).length;

        setStats({
          movies: showingMovies,
          showtimes: showtimesRes.data.length,
          tickets: todayRes?.data?.totalTickets || 0,
          revenue: todayRes?.data?.totalRevenue || 0,
        });
      })
      .catch((error) => {
        console.error("Dashboard load error:", error);
      });
  }, []);

  return (
    <div className="dashboard-container">
      {/* ===== HERO SECTION ===== */}
      <div className="dashboard-hero">
        <div className="hero-content">
          {/* <div className="dashboard-badge">✨ GALAXY CINEMA ADMIN</div> */}
          <h1>
            {getGreeting()}, {user?.fullName || "Admin"}! 👋
          </h1>
          {/* <p className="dashboard-quote">
            “Không có gì vĩ đại đạt được mà thiếu đi sự nhiệt huyết.”
          </p> */}
          <p className="dashboard-sub">
            Chúc bạn một ngày làm việc hiệu quả và tràn đầy năng lượng!
          </p>
        </div>

        {/* Icon trang trí nền */}
        <PlaySquareOutlined className="hero-bg-icon" />
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="dashboard-stats">
        {/* Card 1: Phim */}
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <VideoCameraFilled />
          </div>
          <div className="stat-info">
            <span className="stat-label">Phim Đang Chiếu</span>
            <strong className="stat-value">
              {stats.movies < 10 ? `0${stats.movies}` : stats.movies}
            </strong>
          </div>
        </div>

        {/* Card 2: Suất chiếu */}
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <ClockCircleFilled />
          </div>
          <div className="stat-info">
            <span className="stat-label">Suất Hôm Nay</span>
            <strong className="stat-value">
              {stats.showtimes < 10 ? `0${stats.showtimes}` : stats.showtimes}
            </strong>
          </div>
        </div>

        {/* Card 3: Vé */}
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <SnippetsFilled />
          </div>
          <div className="stat-info">
            <span className="stat-label">Vé Đã Bán</span>
            <strong className="stat-value">{stats.tickets}</strong>
          </div>
        </div>

        {/* Card 4: Doanh thu */}
        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <DollarCircleFilled />
          </div>
          <div className="stat-info">
            <span className="stat-label">Doanh Thu Ngày</span>
            <strong className="stat-value revenue-text">
              {stats.revenue.toLocaleString("vi-VN")}
              <small>đ</small>
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
