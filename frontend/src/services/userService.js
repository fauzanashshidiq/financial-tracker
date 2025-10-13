import api from "../api/axios";

export const loginUser = async (email, password) => {
  return await api.post("/users/login", { email, password });
};

export const registerUser = async (userData) => {
  return await api.post("/users", userData);
};
