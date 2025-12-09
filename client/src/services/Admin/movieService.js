import axiosAdmin from "./axiosAdmin";

const movieService = {
  getAll() {
    return axiosAdmin.get("/movies");
  },

  get(id) {
    return axiosAdmin.get(`/movies/${id}`);
  },

  create(payload) {
    return axiosAdmin.post("/movies", payload);
  },

  update(id, payload) {
    return axiosAdmin.put(`/movies/${id}`, payload);
  },

  delete(id) {
    return axiosAdmin.delete(`/movies/${id}`);
  }
};

export default movieService;
