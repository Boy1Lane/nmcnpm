import axiosAdmin from "./axiosAdmin";

const roomService = {
  // GET /admin/rooms  → lấy toàn bộ phòng
  getAll() {
    return axiosAdmin.get("/rooms");
  },

  // GET /admin/rooms/:id  → lấy 1 phòng
  get(id) {
    return axiosAdmin.get(`/rooms/${id}`);
  },

  // POST /admin/rooms → tạo phòng mới
  create(payload) {
    return axiosAdmin.post("/rooms", payload);
  },

  // PUT /admin/rooms/:id → cập nhật phòng
  update(id, payload) {
    return axiosAdmin.put(`/rooms/${id}`, payload);
  },

  // DELETE /admin/rooms/:id → xóa phòng
  delete(id) {
    return axiosAdmin.delete(`/rooms/${id}`);
  }
};

export default roomService;
