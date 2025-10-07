import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_BASEURL

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
}

export interface AuthResponse {
  data: User;
  token: string;
  message?: string;
}

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@gym_logs_token',
  USER: '@gym_logs_user',
};

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  console.log('Auth API Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Auth API Error response:', errorData);
    throw new Error(errorData.message || errorData.error || `HTTP Error: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Auth API Response data:', data);
  return data;
}

// Transform API user to app format
function transformUser(apiUser: any): User {
    console.log("apiUser", apiUser)
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    createdAt: new Date(apiUser.created_at || apiUser.createdAt),
    updatedAt: new Date(apiUser.updated_at || apiUser.updatedAt),
  };
}

// Authentication API Service
export class AuthAPI {
  
  // Test API connection
  static async healthCheck(): Promise<boolean> {
    try {
      console.log('Testing auth API connection to:', `${API_BASE_URL}/api/users/health`);
      const response = await fetch(`${API_BASE_URL}/api/users/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth health check successful:', data);
        return true;
      } else {
        console.error('Auth health check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Auth health check error:', error);
      return false;
    }
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Registering user:', userData.email);
      
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name,
        }),
      });

      const data = await handleApiResponse<AuthResponse>(response);
      
      // Transform user data
      const transformedUser = transformUser(data?.data);
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(transformedUser));
      
      return {
        data: transformedUser,
        token: data.token,
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Logging in user:', credentials.email);
      
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await handleApiResponse<AuthResponse>(response);
      
      // Transform user data
      console.log("data.data", data.data)
      const transformedUser = transformUser(data.data);
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(transformedUser));
      
      return {
        data: transformedUser,
        token: data.token,
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      
      if (!token || !userStr) {
        return null;
      }
      
      const user = JSON.parse(userStr);
      
      // Verify token is still valid by making a request
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, clear storage
        await this.logout();
        return null;
      }

      const data = await handleApiResponse<{ user: any }>(response);
      const transformedUser = transformUser(data.user);
      
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(transformedUser));
      
      return transformedUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      await this.logout(); // Clear invalid data
      return null;
    }
  }

  // Update user profile
  static async updateUser(userId: string, updates: UpdateUserRequest): Promise<User> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await handleApiResponse<{ user: any }>(response);
      const transformedUser = transformUser(data.user);
      
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(transformedUser));
      
      return transformedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user account
  static async deleteUser(userId: string): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      await handleApiResponse<{ message: string }>(response);
      
      // Clear stored data after successful deletion
      await this.logout();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Get stored token
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }
}