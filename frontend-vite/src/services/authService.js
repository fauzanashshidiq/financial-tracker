import api from "../api/axios";

export const loginUser = async (credentials) => {
  return await api.post("/users/login", credentials);
};

export const registerUser = async (userData) => {
  return await api.post("/users", userData);
};

export const updateUser = async (id, userData) => {
  return await api.patch(`/users/${id}`, userData);
};

export const getUserById = async (id, token) => {
  return await api.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
