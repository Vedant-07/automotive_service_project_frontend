import axios from "axios";

const API_BASE = "http://localhost:8080/api/hello";

// GET
export const getHello = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

// POST
export const createHello = async (data) => {
  const response = await axios.post(API_BASE, data);
  return response.data;
};

// PATCH
export const updateHello = async (id, data) => {
  const response = await axios.patch(`${API_BASE}/${id}`, data);
  return response.data;
};

// DELETE
export const deleteHello = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};
