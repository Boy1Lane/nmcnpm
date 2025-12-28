import axiosAdmin from "./axiosAdmin";

const cinemaService = {
  // ======================
  // CINEMA
  // ======================

  // GET /admin/cinemas → lấy tất cả rạp
  getAll() {
    return axiosAdmin.get("/cinemas");
  },

  // GET /admin/cinemas/:id → lấy 1 rạp
  getById(id) {
    return axiosAdmin.get(`/cinemas/${id}`);
  },

  // POST /admin/cinemas → tạo rạp
  create(payload) {
    return axiosAdmin.post("/cinemas", payload);
  },

  // PUT /admin/cinemas/:id → cập nhật rạp
  update(id, payload) {
    return axiosAdmin.put(`/cinemas/${id}`, payload);
  },

  // DELETE /admin/cinemas/:id → xoá rạp
  delete(id) {
    return axiosAdmin.delete(`/cinemas/${id}`);
  },

  // ======================
  // CINEMA → ROOMS
  // ======================

  // GET /admin/cinemas/:id/rooms → lấy phòng theo rạp
  getRooms(cinemaId) {
    return axiosAdmin.get(`/cinemas/${cinemaId}/rooms`);
  },

  // POST /admin/cinemas/:id/rooms → thêm phòng vào rạp
  addRoom(cinemaId, payload) {
    return axiosAdmin.post(`/cinemas/${cinemaId}/rooms`, payload);
  },

  // DELETE /admin/cinemas/:cinemaId/rooms/:roomId
  removeRoom(cinemaId, roomId) {
    return axiosAdmin.delete(`/cinemas/${cinemaId}/rooms/${roomId}`);
  },
};

export default cinemaService;
