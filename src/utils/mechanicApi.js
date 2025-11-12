import axios from "axios";

const { VITE_API_HOST, DEV } = import.meta.env;
// In dev, use Vite proxy to avoid CORS. In prod, use the configured host.
const API_BASE = import.meta.env.DEV ? "" : `${VITE_API_HOST}:9007`;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Attach Authorization header if token is available (e.g., set during login)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
  } catch {}
  return config;
});

// Log responses for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

// List assigned work orders
export const getMechanicWorkOrders = async (mechanicId) => {
  const response = await api.get(`/api/mechanic/${mechanicId}/workorders`);
  return response.data;
};

// Get a single work order details
export const getWorkOrderDetails = async (mechanicId, serviceOrderId) => {
  const response = await api.get(`/api/mechanic/${mechanicId}/workorders/${serviceOrderId}`);
  return response.data;
};

// Start work order
export const startWorkOrder = async (mechanicId, serviceOrderId) => {
  const response = await api.post(`/api/mechanic/${mechanicId}/workorders/${serviceOrderId}/start`, {});
  return response.data;
};

// Complete work order
export const completeWorkOrder = async (mechanicId, serviceOrderId) => {
  const response = await api.post(`/api/mechanic/${mechanicId}/workorders/${serviceOrderId}/complete`, {});
  return response.data;
};

// Update work order progress (not currently used in UI)
export const updateWorkOrderProgress = async (mechanicId, serviceOrderId, payload) => {
  const response = await api.patch(`/api/mechanic/${mechanicId}/workorders/${serviceOrderId}/progress`, payload ?? {});
  return response.data;
};

