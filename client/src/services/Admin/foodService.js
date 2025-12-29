import axiosAdmin from "./axiosAdmin";

const foodService = {
  // GET /admin/foods
  getAll() {
    return axiosAdmin.get("/foods");
  },

  // GET /admin/foods/:id
  getById(id) {
    return axiosAdmin.get(`/foods/${id}`);
  },

  // POST /admin/foods
  create(data) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("items", data.items);

    // ⭐ CHỈ gửi file, không gửi pictureUrl
    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    return axiosAdmin.post("/foods", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // PUT /admin/foods/:id
  update(id, data) {
    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.price !== undefined) formData.append("price", data.price);
    if (data.items !== undefined) formData.append("items", data.items);

    // ⭐ chỉ gửi ảnh khi có ảnh mới
    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    return axiosAdmin.put(`/foods/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // DELETE /admin/foods/:id
  delete(id) {
    return axiosAdmin.delete(`/foods/${id}`);
  },
};

export default foodService;
