import { BodyPart, Exercise, ExerciseType } from '@/types/gym';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

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

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

// Exercise API Service
export class ExerciseAPI {
  
  // Create a new exercise
  static async createExercise(exercise: Omit<Exercise, 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      const url = `${API_BASE_URL}/exercises${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      const data = await handleApiResponse<ExerciseListResponse>(response);
      
      // Transform API response to match our Exercise interface
      const transformedExercises = data.exercises.map(exercise => ({
        ...exercise,
        bodyPart: (exercise as any).body_part,
        type: (exercise as any).exercise_type,
        createdAt: new Date((exercise as any).created_at),
        updatedAt: new Date((exercise as any).updated_at),
      }));

      return {
        ...data,
        exercises: transformedExercises,
      };
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }

  // Get exercise constants
  static async getConstants(): Promise<ExerciseConstants> {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/constants`);
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
      const response = await fetch(`${API_BASE_URL}/exercises/filters`);
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
      const response = await fetch(`${API_BASE_URL}/exercises/stats`);
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
      const response = await fetch(`${API_BASE_URL}/exercises/by-body-part`);
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
      const response = await fetch(`${API_BASE_URL}/exercises/${id}`);
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
      const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
        method: 'DELETE',
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