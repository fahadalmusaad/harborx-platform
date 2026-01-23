import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add JWT token if available
    this.client.interceptors.request.use(
      (config) => {
        // TODO: Add JWT token from auth context/storage
        // const token = getToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Global error handling
        if (error.response) {
          // Server responded with error status
          console.error('API Error:', error.response.status, error.response.data);
          
          // Handle specific status codes
          if (error.response.status === 401) {
            // Unauthorized - clear token and redirect to login
            // TODO: Implement token clearing and redirect
            console.error('Unauthorized - Please login');
          } else if (error.response.status === 503) {
            // Service unavailable
            console.error('Service temporarily unavailable');
          }
        } else if (error.request) {
          // Request made but no response received
          console.error('Network Error: No response from server');
        } else {
          // Something else happened
          console.error('Request Error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    return this.client.get('/health');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async getCurrentUser() {
    return this.client.get('/auth/me');
  }

  // Shipments endpoints
  async getShipments() {
    return this.client.get('/shipments');
  }
}

export const apiClient = new ApiClient();
