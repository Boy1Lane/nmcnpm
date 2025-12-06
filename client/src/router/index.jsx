// Hàm createBrowserRouter giúp tạo router cho ứng dụng React SPA
import { createBrowserRouter } from "react-router-dom";

// Import trang Dashboard để test router
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

import AdminLayout from "../layouts/AdminLayout.jsx";
import Movies from "../pages/Movies/Movies.jsx";   // <-- thêm dòng này

export const router = createBrowserRouter([
  {
    path: "/",                   // layout sẽ áp dụng cho tất cả path con
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "movies", element: <Movies /> },     // <-- thêm route này
    ],
  }
]);