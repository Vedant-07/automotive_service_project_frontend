const API_BASE_URL = 'http://localhost:9008/api/callcenter'; // Update with your actual port
const AUTH_BASE_URL = 'http://localhost:9002'; // Authentication service

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

// Call Center Agent APIs
const callCenterApi = {
  // Sync feedbacks for a customer
  syncFeedbacks: (customerId) => 
    fetchApi(`/agents/sync/${customerId}`),

  // Get all feedbacks
  getAllFeedbacks: () => 
    fetchApi('/agents/feedbacks'),

  // Assign agent to feedback
  assignFeedback: (agentId, feedbackId) =>
    fetchApi(`/agents/${agentId}/feedbacks/${feedbackId}/assign`, {
      method: 'PUT'
    }),

  // Respond to feedback
  respondToFeedback: (agentId, feedbackId, response) =>
    fetchApi(`/agents/${agentId}/feedbacks/${feedbackId}/respond`, {
      method: 'PUT',
      body: JSON.stringify(response)
    }),

  // Get feedbacks assigned to specific agent
  getAgentFeedbacks: (agentId) =>
    fetchApi(`/agents/${agentId}/feedbacks`),
};

// Export APIs
export { authApi, callCenterApi };