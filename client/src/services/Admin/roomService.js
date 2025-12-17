import axiosAdmin from "./axiosAdmin";

const roomService = {
   // ======================
  // ROOM
  // ======================
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
  },
  // ======================
  // ROOM + CINEMA
  // ======================

  // ✅ TẠO PHÒNG THUỘC RẠP (API BẠN ĐÃ CÓ)
  createInCinema(cinemaId, payload) {
    return axiosAdmin.post(`/cinemas/${cinemaId}/rooms`, payload);
  },
  // ======================
  // SEAT (PHÒNG CHIẾU)
  // ======================

  // GET /admin/rooms/:id/seats → lấy sơ đồ ghế của phòng
  getSeats(roomId) {
    return axiosAdmin.get(`/rooms/${roomId}/seats`);
  },

  // POST /admin/rooms/:id/seats → thêm ghế cho phòng
  // payload: { seats: [...] }
  addSeats(roomId, seats) {
    return axiosAdmin.post(`/rooms/${roomId}/seats`, { seats });
  },

  // PUT /admin/rooms/:id/seats → cập nhật ghế (type, priceMultiplier)
  // payload: { seats: [...] }
  updateSeats(roomId, seats) {
    return axiosAdmin.put(`/rooms/${roomId}/seats`, { seats });
  }
};

export default roomService;
