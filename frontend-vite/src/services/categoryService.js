import api from "../api/axios";

export const getCategories = async () => {
  return await api.get("/categories");
};

export const getCategoryById = async (id) => {
  return await api.get(`/categories/${id}`);
};
