import axiosAdmin from "./axiosAdmin";

const userService = {
  getAll: () => axiosAdmin.get("/users"),
  create: (data) => axiosAdmin.post("/users", data),
  update: (id, data) => axiosAdmin.put(`/users/${id}`, data),
  delete: (id) => axiosAdmin.delete(`/users/${id}`),
};

export default userService;
