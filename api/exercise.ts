import { BodyPart, Exercise, ExerciseType } from '@/types/gym';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Use 10.0.2.2 for Android emulator, localhost for iOS simulator, or your actual IP for physical devices
const API_BASE_URL = process.env.EXPO_PUBLIC_BASEURL || 'http://localhost:3000';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ExerciseListResponse {
  exercises: Exercise[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ExerciseFilters {
  bodyPart?: BodyPart | 'all';
  exerciseType?: ExerciseType | 'all';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface ExerciseConstants {
  bodyParts: BodyPart[];
  exerciseTypes: ExerciseType[];
  difficultyLevels: ('beginner' | 'intermediate' | 'advanced')[];
}

export interface ExerciseStats {
  totalExercises: number;
  byBodyPart: Record<BodyPart, number>;
  byType: Record<ExerciseType, number>;
  byDifficulty: Record<'beginner' | 'intermediate' | 'advanced', number>;
}

export interface ExercisesByBodyPart {
  [key: string]: Exercise[];
}

// Helper function to get auth headers
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await AsyncStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  console.log('API Response status:', response.status);
  console.log('API Response headers:', response.headers);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error response:', errorData);
  }

  const data = await response.json();
  console.log('API Response data:', data);
  return data?.data;
}

// Exercise API Service
export class ExerciseAPI {

  // Test API connection
  static async healthCheck(): Promise<boolean> {
    try {
      console.log('Testing API connection to:', `${API_BASE_URL}/health`);
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
      });

      console.log('Health check response status:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('Health check successful:', data);
        return true;
      } else {
        console.error('Health check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Health check error:', error);
      return false;
    }
  }

  // Create a new exercise
  static async createExercise(exercise: Omit<Exercise, 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/api/exercises`, {
        method: 'POST',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
        body: JSON.stringify({
          id: exercise.id,
          name: exercise.name,
          description: exercise.description,
          body_part: exercise.bodyPart,
          exercise_type: exercise.type,
          difficulty: exercise.difficulty,
          equipment: exercise.equipment || [],
        }),
      });

      const data = await handleApiResponse<{ exercise: Exercise }>(response);
      return data.exercise;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  }

  // Get exercises with filters and pagination
  static async getExercises(filters: ExerciseFilters = {}): Promise<ExerciseListResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.bodyPart && filters.bodyPart !== 'all') {
        params.append('body_part', filters.bodyPart);
      }

      if (filters.exerciseType && filters.exerciseType !== 'all') {
        params.append('exercise_type', filters.exerciseType);
      }

      if (filters.difficulty && filters.difficulty !== 'all') {
        params.append('difficulty', filters.difficulty);
      }

      if (filters.search) {
        params.append('search', filters.search);
      }

      if (filters.page) {
        params.append('page', filters.page.toString());
      }

      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const url = `${API_BASE_URL}/api/exercises`;
      console.log('Fetching exercises from URL:', url);
      
      const headers = await getAuthHeaders();

      const response = await fetch(url, {
        method: 'GET',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
      });

      const data = await handleApiResponse<ExerciseListResponse>(response);

      // Transform API response to match our Exercise interface
      const transformedExercises = data.exercises?.map((exercise: any) => ({
        ...exercise,
        bodyPart: exercise.body_part || exercise.bodyPart,
        type: exercise.exercise_type || exercise.type,
        createdAt: new Date(exercise.created_at || exercise.createdAt),
        updatedAt: new Date(exercise.updated_at || exercise.updatedAt),
      }));

      return {
        ...data,
        exercises: transformedExercises || [],
      };
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  // Get exercise constants
  static async getConstants(): Promise<ExerciseConstants> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/exercises/constants`, {
        method: 'GET',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
      });
      const data = await handleApiResponse<ExerciseConstants>(response);
      return data;
    } catch (error) {
      console.error('Error fetching constants:', error);
      throw error;
    }
  }

  // Get available filter values
  static async getFilterValues(): Promise<{
    bodyParts: BodyPart[];
    exerciseTypes: ExerciseType[];
    difficulties: ('beginner' | 'intermediate' | 'advanced')[];
  }> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/exercises/filters`, {
        method: 'GET',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
      });
      const data = await handleApiResponse<{
        bodyParts: BodyPart[];
        exerciseTypes: ExerciseType[];
        difficulties: ('beginner' | 'intermediate' | 'advanced')[];
      }>(response);
      return data;
    } catch (error) {
      console.error('Error fetching filter values:', error);
      throw error;
    }
  }

  // Get exercise statistics
  static async getStats(): Promise<ExerciseStats> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/exercises/stats`, {
        method: 'GET',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
      });
      const data = await handleApiResponse<ExerciseStats>(response);
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Get exercises grouped by body part
  static async getExercisesByBodyPart(): Promise<ExercisesByBodyPart> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/exercises/by-body-part`, {
        method: 'GET',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
      });
      const data = await handleApiResponse<ExercisesByBodyPart>(response);

      // Transform the exercises in each body part group
      const transformedData: ExercisesByBodyPart = {};
      Object.keys(data).forEach(bodyPart => {
        transformedData[bodyPart] = data[bodyPart].map(exercise => ({
          ...exercise,
          bodyPart: (exercise as any).body_part,
          type: (exercise as any).exercise_type,
          createdAt: new Date((exercise as any).created_at),
          updatedAt: new Date((exercise as any).updated_at),
        }));
      });

      return transformedData;
    } catch (error) {
      console.error('Error fetching exercises by body part:', error);
      throw error;
    }
  }

  // Get specific exercise by ID
  static async getExercise(id: string): Promise<Exercise> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
        method: 'GET',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
      });
      const data = await handleApiResponse<{ exercise: Exercise }>(response);

      // Transform API response to match our Exercise interface
      const exercise = data.exercise;
      return {
        ...exercise,
        bodyPart: (exercise as any).body_part,
        type: (exercise as any).exercise_type,
        createdAt: new Date((exercise as any).created_at),
        updatedAt: new Date((exercise as any).updated_at),
      };
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  }

  // Update exercise
  static async updateExercise(id: string, updates: Partial<Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Exercise> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
        method: 'PUT',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
        body: JSON.stringify({
          name: updates.name,
          description: updates.description,
          body_part: updates.bodyPart,
          exercise_type: updates.type,
          difficulty: updates.difficulty,
          equipment: updates.equipment,
        }),
      });

      const data = await handleApiResponse<{ exercise: Exercise }>(response);

      // Transform API response to match our Exercise interface
      const exercise = data.exercise;
      return {
        ...exercise,
        bodyPart: (exercise as any).body_part,
        type: (exercise as any).exercise_type,
        createdAt: new Date((exercise as any).created_at),
        updatedAt: new Date((exercise as any).updated_at),
      };
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  }

  // Delete exercise (if needed in the future)
  static async deleteExercise(id: string): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
        method: 'DELETE',
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }
}

// Export default instance
export default ExerciseAPI;