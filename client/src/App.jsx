// Import RouterProvider để bật Router cho ứng dụng
import { RouterProvider } from "react-router-dom";

// Import router duy nhất từ file router/index.jsx
import { router } from "./router/index.jsx";

// App chỉ cần return RouterProvider, không thêm import nào khác
export default function App() {
  return <RouterProvider router={router} />;
}
