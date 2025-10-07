import { Exercise, WorkoutPlan, WorkoutPlanExercise } from '@/types/gym';
import { getPlatformApiUrl, getStoredToken } from './shared';

// API Configuration
const API_BASE_URL = getPlatformApiUrl();

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface WorkoutPlanListResponse {
    data: WorkoutPlan[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface WorkoutPlanFilters {
    muscleTypes?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all';
    duration?: {
        min?: number;
        max?: number;
    };
    search?: string;
    isPublic?: boolean;
    page?: number;
    limit?: number;
}

export interface WorkoutPlanStats {
    totalPlans: number;
    byDifficulty: Record<'beginner' | 'intermediate' | 'advanced', number>;
    byMuscleType: Record<string, number>;
    averageDuration: number;
    totalExercises: number;
}

export interface CreateWorkoutPlanRequest {
    name: string;
    description?: string;
    muscleTypes: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration?: number;
    isPublic?: boolean;
    exercises?: CreateWorkoutPlanExerciseRequest[];
}

export interface CreateWorkoutPlanExerciseRequest {
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
    restTime?: number;
    notes?: string;
    orderIndex: number;
}

export interface UpdateWorkoutPlanRequest {
    name?: string;
    description?: string;
    muscleTypes?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration?: number;
    isPublic?: boolean;
}

export interface UpdateWorkoutPlanExerciseRequest {
    sets?: number;
    reps?: number;
    weight?: number;
    restTime?: number;
    notes?: string;
    orderIndex?: number;
}



// Helper function to get authorization headers
async function getAuthHeaders(token?: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    const authToken = token || await getStoredToken();
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
}

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error response:', errorData);
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    return data;
}

// Transform API workout plan to app format
function transformWorkoutPlan(apiPlan: any): WorkoutPlan {
    console.log("apiPlan", apiPlan)
    return {
        id: apiPlan.id,
        name: apiPlan.name,
        description: apiPlan.description,
        exercises: apiPlan.exercises?.map((exercise: any) => ({
            exerciseId: exercise.exercise_id,
            exercise: exercise.exercise ? {
                id: exercise.exercise.id,
                name: exercise.exercise.name,
                bodyPart: exercise.exercise.body_part,
                type: exercise.exercise.exercise_type,
                description: exercise.exercise.description,
                difficulty: exercise.exercise.difficulty,
                equipment: exercise.exercise.equipment || [],
                createdAt: new Date(exercise.exercise.created_at),
                updatedAt: new Date(exercise.exercise.updated_at),
            } : undefined,
            sets: exercise.sets,
            reps: exercise.reps?.toString(),
            weight: exercise.weight,
            restTime: exercise.rest_time,
            notes: exercise.notes,
            order: exercise.order_index,
        })) || [],
        estimatedDuration: apiPlan.estimated_duration,
        difficulty: apiPlan.difficulty_level,
        tags: apiPlan.muscle_types || [],
        createdAt: new Date(apiPlan.created_at),
        updatedAt: new Date(apiPlan.updated_at),
    };
}

// Workout Plans API Service
export class WorkoutPlansAPI {
    
    // Test API connection
    static async healthCheck(token?: string): Promise<boolean> {
        try {
            console.log('Testing workout plans API connection to:', `${API_BASE_URL}/api/workout-plans/health`);
            const response = await fetch(`${API_BASE_URL}/api/workout-plans/health`, {
                method: 'GET',
                headers: await getAuthHeaders(token),
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Workout plans health check successful:', data);
                return true;
            } else {
                console.error('Workout plans health check failed:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Workout plans health check error:', error);
            return false;
        }
    }

    // Create a new workout plan
    static async createWorkoutPlan(planData: CreateWorkoutPlanRequest, token?: string): Promise<WorkoutPlan> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plans`, {
                method: 'POST',
                headers: await getAuthHeaders(token),
                body: JSON.stringify({
                    name: planData.name,
                    description: planData.description,
                    muscle_types: planData.muscleTypes,
                    difficulty_level: planData.difficulty,
                    estimated_duration: planData.estimatedDuration,
                    is_public: planData.isPublic || false,
                    exercises: planData.exercises?.map(ex => ({
                        exercise_id: ex.exerciseId,
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight,
                        rest_time: ex.restTime,
                        notes: ex.notes,
                        order_index: ex.orderIndex,
                    })),
                }),
            });

            const data = await handleApiResponse<{ plan: any }>(response);
            return transformWorkoutPlan(data.plan);
        } catch (error) {
            console.error('Error creating workout plan:', error);
            throw error;
        }
    }

    // Get workout plans with filters and pagination
    static async getWorkoutPlans(filters: WorkoutPlanFilters = {}, token?: string): Promise<WorkoutPlanListResponse> {
        try {
            const params = new URLSearchParams();
            
            if (filters.muscleTypes && filters.muscleTypes.length > 0) {
                params.append('muscle_types', filters.muscleTypes.join(','));
            }
            
            if (filters.difficulty && filters.difficulty !== 'all') {
                params.append('difficulty', filters.difficulty);
            }
            
            if (filters.duration?.min) {
                params.append('duration_min', filters.duration.min.toString());
            }
            
            if (filters.duration?.max) {
                params.append('duration_max', filters.duration.max.toString());
            }
            
            if (filters.search) {
                params.append('search', filters.search);
            }
            
            if (filters.isPublic !== undefined) {
                params.append('is_public', filters.isPublic.toString());
            }
            
            if (filters.page) {
                params.append('page', filters.page.toString());
            }
            
            if (filters.limit) {
                params.append('limit', filters.limit.toString());
            }

            const getToken =  await getAuthHeaders(token);

            console.log('Auth Headers:', getToken);

            const url = `${API_BASE_URL}/api/workout-plans${params.toString() ? `?${params.toString()}` : ''}`;
            console.log('Fetching workout plans from URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: await getAuthHeaders(token),
            });

            const data = await handleApiResponse<WorkoutPlanListResponse>(response);
            console.log('Raw workout plans data:', data);
            
            // Transform API response to match our WorkoutPlan interface
            const transformedPlans = data.data.map(transformWorkoutPlan);

            return {
                ...data,
                data: transformedPlans,
            };
        } catch (error) {
            console.error('Error fetching workout plans:', error);
            throw error;
        }
    }

    // Get workout plan statistics
    static async getWorkoutPlanStats(token?: string): Promise<WorkoutPlanStats> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plans/stats`, {
                method: 'GET',
                headers: await getAuthHeaders(token),
            });

            const data = await handleApiResponse<WorkoutPlanStats>(response);
            return data;
        } catch (error) {
            console.error('Error fetching workout plan stats:', error);
            throw error;
        }
    }

    // Get specific workout plan by ID
    static async getWorkoutPlan(planId: string, token?: string): Promise<WorkoutPlan> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plans/${planId}`, {
                method: 'GET',
                headers: await getAuthHeaders(token),
            });

            const data = await handleApiResponse<{ data: any }>(response);
        
            return transformWorkoutPlan(data.data);
        } catch (error) {
            console.error('Error fetching workout plan:', error);
            throw error;
        }
    }

    // Update workout plan
    static async updateWorkoutPlan(planId: string, updates: UpdateWorkoutPlanRequest, token?: string): Promise<WorkoutPlan> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plans/${planId}`, {
                method: 'PUT',
                headers: await getAuthHeaders(token),
                body: JSON.stringify({
                    name: updates.name,
                    description: updates.description,
                    muscle_types: updates.muscleTypes,
                    difficulty_level: updates.difficulty,
                    estimated_duration: updates.estimatedDuration,
                    is_public: updates.isPublic,
                }),
            });

            const data = await handleApiResponse<{ plan: any }>(response);
            return transformWorkoutPlan(data.plan);
        } catch (error) {
            console.error('Error updating workout plan:', error);
            throw error;
        }
    }

    // Delete workout plan
    static async deleteWorkoutPlan(planId: string, token?: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plans/${planId}`, {
                method: 'DELETE',
                headers: await getAuthHeaders(token),
            });

            await handleApiResponse<{ message: string }>(response);
        } catch (error) {
            console.error('Error deleting workout plan:', error);
            throw error;
        }
    }

    // Add exercise to workout plan
    static async addExerciseToWorkoutPlan(
        planId: string, 
        exerciseData: CreateWorkoutPlanExerciseRequest,
        token?: string
    ): Promise<WorkoutPlanExercise> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plans/${planId}/exercises`, {
                method: 'POST',
                headers: await getAuthHeaders(token),
                body: JSON.stringify({
                    exercise_id: exerciseData.exerciseId,
                    sets: exerciseData.sets,
                    reps: exerciseData.reps,
                    weight: exerciseData.weight,
                    rest_time: exerciseData.restTime,
                    notes: exerciseData.notes,
                    order_index: exerciseData.orderIndex,
                }),
            });

            const data = await handleApiResponse<{ exercise: any }>(response);
            return {
                exerciseId: data.exercise.exercise_id,
                sets: data.exercise.sets,
                reps: data.exercise.reps?.toString(),
                weight: data.exercise.weight,
                restTime: data.exercise.rest_time,
                notes: data.exercise.notes,
                order: data.exercise.order_index,
                exercise: data.exercise.exercise ? {
                    id: data.exercise.exercise.id,
                    name: data.exercise.exercise.name,
                    bodyPart: data.exercise.exercise.body_part,
                    type: data.exercise.exercise.exercise_type,
                    description: data.exercise.exercise.description,
                    difficulty: data.exercise.exercise.difficulty,
                    equipment: data.exercise.exercise.equipment || [],
                    createdAt: new Date(data.exercise.exercise.created_at),
                    updatedAt: new Date(data.exercise.exercise.updated_at),
                } : {} as Exercise,
            };
        } catch (error) {
            console.error('Error adding exercise to workout plan:', error);
            throw error;
        }
    }

    // Update exercise in workout plan
    static async updateExerciseInWorkoutPlan(
        planId: string,
        exerciseId: string,
        updates: UpdateWorkoutPlanExerciseRequest,
        token?: string
    ): Promise<WorkoutPlanExercise> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plans/${planId}/exercises/${exerciseId}`, {
                method: 'PUT',
                headers: await getAuthHeaders(token),
                body: JSON.stringify({
                    sets: updates.sets,
                    reps: updates.reps,
                    weight: updates.weight,
                    rest_time: updates.restTime,
                    notes: updates.notes,
                    order_index: updates.orderIndex,
                }),
            });

            const data = await handleApiResponse<{ exercise: any }>(response);
            return {
                exerciseId: data.exercise.exercise_id,
                sets: data.exercise.sets,
                reps: data.exercise.reps?.toString(),
                weight: data.exercise.weight,
                restTime: data.exercise.rest_time,
                notes: data.exercise.notes,
                order: data.exercise.order_index,
                exercise: data.exercise.exercise ? {
                    id: data.exercise.exercise.id,
                    name: data.exercise.exercise.name,
                    bodyPart: data.exercise.exercise.body_part,
                    type: data.exercise.exercise.exercise_type,
                    description: data.exercise.exercise.description,
                    difficulty: data.exercise.exercise.difficulty,
                    equipment: data.exercise.exercise.equipment || [],
                    createdAt: new Date(data.exercise.exercise.created_at),
                    updatedAt: new Date(data.exercise.exercise.updated_at),
                } : {} as Exercise,
            };
        } catch (error) {
            console.error('Error updating exercise in workout plan:', error);
            throw error;
        }
    }

    // Remove exercise from workout plan
    static async removeExerciseFromWorkoutPlan(planId: string, exerciseId: string, token?: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plans/${planId}/exercises/${exerciseId}`, {
                method: 'DELETE',
                headers: await getAuthHeaders(token),
            });

            await handleApiResponse<{ message: string }>(response);
        } catch (error) {
            console.error('Error removing exercise from workout plan:', error);
            throw error;
        }
    }
}
