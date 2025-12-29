import axiosAdmin from "./axiosAdmin";
const promotionService = {
  getAll: () => {
    return axiosAdmin.get("/promotions");
  },

  getById: (id) => {
    return axiosAdmin.get(`/promotions/${id}`);
  },

  create: (data) => {
    return axiosAdmin.post("/promotions", data);
  },

  update: (id, data) => {
    return axiosAdmin.put(`/promotions/${id}`, data);
  },

  delete: (id) => {
    return axiosAdmin.delete(`/promotions/${id}`);
  },
};

export default promotionService;
