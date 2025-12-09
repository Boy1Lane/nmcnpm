import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";

import Dashboard from "./pages/Admin/Dashboard";
import MovieManagement from "./pages/Admin/MovieManagement";
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
        {/* <Route path="lichChieu" element={<LichChieu />} />
          <Route path="phongVaGhe" element={<PhongVaGhe />} />
          <Route path="nguoiDung" element={<NguoiDung />} />
          <Route path="baoCao" element={<BaoCao />} /> */}
      </Route>
    </Routes>
  );
}
