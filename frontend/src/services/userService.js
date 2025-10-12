import api from "../api/axios";

export const loginUser = async (email, password) => {
  return await api.post("/users/login", { email, password });
};

export const registerUser = async (name, email, password) => {
  return await api.post("/users", { name, email, password });
};
