import axios from 'axios';

// The backend now runs on port 5000 to avoid conflicts with the React dev server.
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
