import api from "../api/axios";

export const getTransactionsByUser = async () => {
  return await api.get("/transactions/user");
};

export const createTransaction = async (data) => {
  return await api.post("/transactions", data);
};

export const updateTransaction = async (id, data) => {
  return await api.put(`/transactions/${id}`, data);
};

export const deleteTransaction = async (id) => {
  return await api.delete(`/transactions/${id}`);
};
