import api from "../api/axios";

export const loginUser = async (credentials) => {
  return await api.post("/users/login", credentials);
};

export const registerUser = async (userData) => {
  return await api.post("/users", userData);
};
