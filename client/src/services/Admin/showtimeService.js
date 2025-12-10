import axiosAdmin from "./axiosAdmin";

const showtimeService = {
  getByDate(date) {
    return axiosAdmin.get(`/showtimes?date=${date.format("YYYY-MM-DD")}`);
  },

  create(payload) {
    return axiosAdmin
      .post("/showtimes", payload)
      .then((res) => ({ success: true, data: res.data }))
      .catch((err) => ({
        success: false,
        error: err.response?.data?.message,
      }));
  },

  update(id, payload) {
    return axiosAdmin
      .put(`/showtimes/${id}`, payload)
      .then((res) => ({ success: true }))
      .catch((err) => ({
        success: false,
        error: err.response?.data?.message,
      }));
  },

  delete(id) {
    return axiosAdmin
      .delete(`/showtimes/${id}`)
      .then((res) => ({ success: true }))
      .catch((err) => ({
        success: false,
        error: err.response?.data?.message,
      }));
  },

  getAll() {
  return axiosAdmin.get("/showtimes");
}

};

export default showtimeService;
