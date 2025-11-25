// src/api/api.js
import axios from "axios";

const { VITE_API_HOST } = import.meta.env;

// Base URLs for different services
const API_BASES = {
  signup: `${VITE_API_HOST}:9001/signup`,
  login: `${VITE_API_HOST}:9002/login`,
  customer: `${VITE_API_HOST}:9005/api/customers`,
  serviceManager: `${VITE_API_HOST}:9006/api/manager`,
  email: `${VITE_API_HOST}:9003/api/email`,
};

// Small helper that adds Authorization + common headers
const makeHeaders = (token, extra = {}) => {
  const headers = { Accept: "application/json", ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// Generic API caller
const apiCall = async (method, url, data = null, token = null, config = {}) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      withCredentials: true, // allow cookies + CORS credentials
      headers: makeHeaders(token, config.headers),
      signal: config.signal,
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      data: null,
      error: error.response?.data || { message: error.message },
    };
  }
};

//
// ============ CUSTOMER APIs ============
//
export const customerApi = {
  getVehicles: (customerId, token, config = {}) =>
    apiCall("GET", `${API_BASES.customer}/${customerId}/vehicles`, null, token, config),

  addVehicle: (customerId, vehicleData, token, config = {}) =>
    apiCall("POST", `${API_BASES.customer}/${customerId}/vehicles`, vehicleData, token, config),

  updateVehicle: (customerId, vehicleId, vehicleData, token, config = {}) =>
    apiCall(
      "PUT",
      `${API_BASES.customer}/${customerId}/vehicles/${vehicleId}`,
      vehicleData,
      token,
      config
    ),

  deleteVehicle: (customerId, vehicleId, token, config = {}) =>
    apiCall("DELETE", `${API_BASES.customer}/${customerId}/vehicles/${vehicleId}`, null, token, config),

  bookService: (customerId, vehicleId, workOrderData, token, config = {}) =>
    apiCall(
      "POST",
      `${API_BASES.customer}/${customerId}/vehicles/${vehicleId}/workorders`,
      workOrderData,
      token,
      config
    ),

  getServiceStatus: (customerId, token, config = {}) =>
    apiCall("GET", `${API_BASES.customer}/${customerId}/service-status`, null, token, config),

  submitFeedback: (customerId, feedbackData, token, config = {}) =>
    apiCall("POST", `${API_BASES.customer}/${customerId}/feedbacks`, feedbackData, token, config),

  getFeedbacks: (customerId, token, config = {}) =>
    apiCall("GET", `${API_BASES.customer}/${customerId}/feedbacks`, null, token, config),

  getFeedbackById: (customerId, feedbackId, token, config = {}) =>
    apiCall("GET", `${API_BASES.customer}/${customerId}/feedbacks/${feedbackId}`, null, token, config),
};

//
// ============ SERVICE MANAGER APIs ============
//
export const serviceManagerApi = {
  listOpenWorkOrders: (token, config = {}) =>
    apiCall("GET", `${API_BASES.serviceManager}/workorders/open`, null, token, config),

  getWorkOrder: (serviceOrderId, token, config = {}) =>
    apiCall("GET", `${API_BASES.serviceManager}/workorders/${serviceOrderId}`, null, token, config),

  assignManager: (serviceOrderId, managerId, token, config = {}) =>
    apiCall(
      "POST",
      `${API_BASES.serviceManager}/workorders/${serviceOrderId}/assign-manager`,
      { managerId },
      token,
      config
    ),

  assignMechanic: (serviceOrderId, mechanicId, estimatedCost, token, config = {}) =>
    apiCall(
      "POST",
      `${API_BASES.serviceManager}/workorders/${serviceOrderId}/assign-mechanic`,
      { mechanicId, estimatedCost },
      token,
      config
    ),

  startWorkOrder: (serviceOrderId, managerId, token, config = {}) =>
    apiCall(
      "POST",
      `${API_BASES.serviceManager}/workorders/${serviceOrderId}/start`,
      { managerId },
      token,
      config
    ),

  completeWorkOrder: (serviceOrderId, finalCost, token, config = {}) =>
    apiCall(
      "POST",
      `${API_BASES.serviceManager}/workorders/${serviceOrderId}/complete`,
      { finalCost },
      token,
      config
    ),

  updateCosts: (serviceOrderId, estimatedCost, finalCost, token, config = {}) =>
    apiCall(
      "PATCH",
      `${API_BASES.serviceManager}/workorders/${serviceOrderId}/costs`,
      { estimatedCost, finalCost },
      token,
      config
    ),
};

//
// ============ AUTH APIs ============
//
export const authApi = {
  signup: (signupData) => apiCall("POST", `${API_BASES.signup}/signup`, signupData),
  login: (loginData) => apiCall("POST", API_BASES.login, loginData),
};
