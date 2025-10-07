import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys - consistent across all APIs
export const STORAGE_KEYS = {
  TOKEN: '@gym_logs_token',
  USER: '@gym_logs_user',
};

// Helper function to get authentication headers
export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function to get just the token
export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token from storage:', error);
    return null;
  }
}

// Helper function to check if user is authenticated (has token)
export async function isAuthenticated(): Promise<boolean> {
  const token = await getStoredToken();
  return !!token;
}

// API Base URL configuration
export const getApiBaseUrl = () => {
  return process.env.EXPO_PUBLIC_BASEURL;
};

// Platform-specific API URL
export const getPlatformApiUrl = () => {
  return getApiBaseUrl();
};