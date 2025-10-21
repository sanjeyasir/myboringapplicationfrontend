import axios from "axios";

// Create a reusable axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_LIVE_TEST_URL, // change to your base URL
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});


// Add a request interceptor to include token conditionally
api.interceptors.request.use(
  (config) => {
    // Only add token in production environment
    if (process.env.REACT_APP_ENV === "production") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function for GET
export const get = async (endpoint, config = {}) => {
  try {
    const response = await api.get(endpoint, config);
    return response.data;
  } catch (err) {
    console.error("GET Error:", err.response?.data || err.message);
    throw err;
  }
};

// Utility function for POST
export const post = async (endpoint, data, config = {}) => {
  try {
    const response = await api.post(endpoint, data, config);
    return response.data;
  } catch (err) {
    console.error("POST Error:", err.response?.data || err.message);
    throw err;
  }
};

