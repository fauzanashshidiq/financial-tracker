import api from "../api/axios";

export const getCategories = async () => {
  return await api.get("/categories");
};

export const createCategory = async (data) => {
  return await api.post("/categories", data);
};
