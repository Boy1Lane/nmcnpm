import axiosAdmin from "./axiosAdmin";

const movieService = {
  getAll() {
    return axiosAdmin.get("/movies");
  },

  get(id) {
    return axiosAdmin.get(`/movies/${id}`);
  },

  create: (formData) =>
    axiosAdmin.post("/movies", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    axiosAdmin.put(`/movies/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete(id) {
    return axiosAdmin.delete(`/movies/${id}`);
  },

   // ✅ ALIAS CHO CHECK-IN (QUAN TRỌNG)
  getMovieById(id) {
    return axiosAdmin.get(`/movies/${id}`);
  },
};

export default movieService;
