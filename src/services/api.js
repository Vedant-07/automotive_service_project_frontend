const AUTH_BASE_URL = 'http://localhost:9002';
const API_BASE_URL = 'http://localhost:9006/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Generic fetch function with auth headers
const fetchApi = async (url, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Authentication API
const authApi = {
  // Login user
  login: (email, password) =>
    fetch(`${AUTH_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        userEmail: email,
        userPassword: password
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }
      return response.json();
    }),
};

// Work Order APIs
const workOrderApi = {
  // Get all work orders (not just open) - for manager to see everything
  getAllWorkOrders: () => fetchApi('/manager/workorders/open'),

  // Get work order by ID
  getWorkOrder: (serviceOrderId) => 
    fetchApi(`/manager/workorders/${serviceOrderId}`),

  // Assign manager to work order
  assignManager: (serviceOrderId, managerId) =>
    fetchApi(`/manager/workorders/${serviceOrderId}/assign-manager`, {
      method: 'POST',
      body: JSON.stringify({ managerId })
    }),

  // Assign mechanic to work order
  assignMechanic: (serviceOrderId, mechanicId, estimatedCost) =>
    fetchApi(`/manager/workorders/${serviceOrderId}/assign-mechanic`, {
      method: 'POST',
      body: JSON.stringify({ 
        mechanicId, 
        estimatedCost: parseFloat(estimatedCost) 
      })
    }),

  // Start work order
  startWorkOrder: (serviceOrderId, userId) =>
    fetchApi(`/manager/workorders/${serviceOrderId}/start`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    }),

  // Complete work order
  completeWorkOrder: (serviceOrderId, estimatedCost, finalCost) =>
    fetchApi(`/manager/workorders/${serviceOrderId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ 
        estimatedCost: parseFloat(estimatedCost),
        finalCost: parseFloat(finalCost)
      })
    }),

  // Update costs
  updateCosts: (serviceOrderId, estimatedCost, finalCost) =>
    fetchApi(`/manager/workorders/${serviceOrderId}/costs`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        estimatedCost: parseFloat(estimatedCost),
        finalCost: parseFloat(finalCost)
      })
    }),
};

// Export both APIs
export { authApi, workOrderApi };