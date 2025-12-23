import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout.jsx";
// Layouts
import Dashboard from "./pages/Admin/Dashboard.jsx";
import MovieManagement from "./pages/Admin/MovieManagement.jsx";
import RoomManagement from "./pages/Admin/Rooms/RoomManagement.jsx";
import ShowtimesPage from "./pages/Admin/Showtimes/ShowtimesPage.jsx";
import RevenueReport from "./pages/Admin/Reports/RevenueReport.jsx";
import UserManagement from "./pages/Admin/Users/UserManagement.jsx";

// import LichChieu from "./pages/LichChieu";
// import PhongVaGhe from "./pages/PhongVaGhe";
// import NguoiDung from "./pages/NguoiDung";
// import BaoCao from "./pages/BaoCao";

export default function App() {
  return (
    <Routes>
      {/* Tất cả trang admin đều nằm trong Layout chung */}
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="movie-management" element={<MovieManagement />} />
        <Route path="room-seat" element={<RoomManagement />} />
        <Route path="showtimes" element={<ShowtimesPage />} />
        <Route path="report" element={<RevenueReport />} />
        <Route path="user" element={<UserManagement />} />

        {/* /* <Route path="lichChieu" element={<LichChieu />} />
          <Route path="phongVaGhe" element={<PhongVaGhe />} />
          <Route path="nguoiDung" element={<NguoiDung />} />
           */}
      </Route>
    </Routes>
  );
}
