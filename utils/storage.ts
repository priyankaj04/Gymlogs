import { DailySchedule, Exercise, WorkoutPlan, WorkoutSession } from '@/types/gym';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  EXERCISES: '@gymlogs/exercises',
  WORKOUT_PLANS: '@gymlogs/workout_plans',
  DAILY_SCHEDULE: '@gymlogs/daily_schedule',
  WORKOUT_SESSIONS: '@gymlogs/workout_sessions',
};

// Generic storage functions
const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};

const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return null;
  }
};

// Exercise storage functions
export const exerciseStorage = {
  async save(exercises: Exercise[]): Promise<void> {
    await setItem(STORAGE_KEYS.EXERCISES, exercises);
  },

  async load(): Promise<Exercise[]> {
    const exercises = await getItem<Exercise[]>(STORAGE_KEYS.EXERCISES);
    return exercises || [];
  },

  async add(exercise: Exercise): Promise<void> {
    const exercises = await this.load();
    exercises.push(exercise);
    await this.save(exercises);
  },

  async update(exerciseId: string, updates: Partial<Exercise>): Promise<void> {
    const exercises = await this.load();
    const index = exercises.findIndex(e => e.id === exerciseId);
    if (index !== -1) {
      exercises[index] = { ...exercises[index], ...updates, updatedAt: new Date() };
      await this.save(exercises);
    }
  },

  async delete(exerciseId: string): Promise<void> {
    const exercises = await this.load();
    const filtered = exercises.filter(e => e.id !== exerciseId);
    await this.save(filtered);
  },

  async findById(exerciseId: string): Promise<Exercise | null> {
    const exercises = await this.load();
    return exercises.find(e => e.id === exerciseId) || null;
  },
};

// Workout Plan storage functions
export const workoutPlanStorage = {
  async save(plans: WorkoutPlan[]): Promise<void> {
    await setItem(STORAGE_KEYS.WORKOUT_PLANS, plans);
  },

  async load(): Promise<WorkoutPlan[]> {
    const plans = await getItem<WorkoutPlan[]>(STORAGE_KEYS.WORKOUT_PLANS);
    return plans || [];
  },

  async add(plan: WorkoutPlan): Promise<void> {
    const plans = await this.load();
    plans.push(plan);
    await this.save(plans);
  },

  async update(planId: string, updates: Partial<WorkoutPlan>): Promise<void> {
    const plans = await this.load();
    const index = plans.findIndex(p => p.id === planId);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates, updatedAt: new Date() };
      await this.save(plans);
    }
  },

  async delete(planId: string): Promise<void> {
    const plans = await this.load();
    const filtered = plans.filter(p => p.id !== planId);
    await this.save(filtered);
  },

  async findById(planId: string): Promise<WorkoutPlan | null> {
    const plans = await this.load();
    return plans.find(p => p.id === planId) || null;
  },
};

// Daily Schedule storage functions
export const scheduleStorage = {
  async save(schedule: DailySchedule[]): Promise<void> {
    await setItem(STORAGE_KEYS.DAILY_SCHEDULE, schedule);
  },

  async load(): Promise<DailySchedule[]> {
    const schedule = await getItem<DailySchedule[]>(STORAGE_KEYS.DAILY_SCHEDULE);
    return schedule || [];
  },

  async update(dayId: string, updates: Partial<DailySchedule>): Promise<void> {
    const schedule = await this.load();
    const index = schedule.findIndex(s => s.id === dayId);
    if (index !== -1) {
      schedule[index] = { ...schedule[index], ...updates, updatedAt: new Date() };
      await this.save(schedule);
    }
  },

  async findByDay(dayOfWeek: string): Promise<DailySchedule | null> {
    const schedule = await this.load();
    return schedule.find(s => s.dayOfWeek === dayOfWeek) || null;
  },
};

// Workout Session storage functions
export const sessionStorage = {
  async save(sessions: WorkoutSession[]): Promise<void> {
    await setItem(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
  },

  async load(): Promise<WorkoutSession[]> {
    const sessions = await getItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUT_SESSIONS);
    return sessions || [];
  },

  async add(session: WorkoutSession): Promise<void> {
    const sessions = await this.load();
    sessions.push(session);
    await this.save(sessions);
  },

  async update(sessionId: string, updates: Partial<WorkoutSession>): Promise<void> {
    const sessions = await this.load();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates, updatedAt: new Date() };
      await this.save(sessions);
    }
  },

  async getRecent(limit: number = 10): Promise<WorkoutSession[]> {
    const sessions = await this.load();
    return sessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },
};

// Utility functions
export const storageUtils = {
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  },

  async initializeWithMockData(): Promise<void> {
    // Check if data already exists
    const exercises = await exerciseStorage.load();
    if (exercises.length > 0) return;

    // Initialize with mock data
    const mockExercises: Exercise[] = [
      {
        id: '1',
        name: 'Bench Press',
        bodyPart: 'chest',
        type: 'compound',
        description: 'A compound exercise that primarily targets the chest, shoulders, and triceps.',
        difficulty: 'intermediate',
        equipment: ['barbell', 'bench'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Pull-ups',
        bodyPart: 'back',
        type: 'compound',
        description: 'A bodyweight exercise that targets the back muscles and biceps.',
        difficulty: 'intermediate',
        equipment: ['pull-up bar'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Running',
        bodyPart: 'full-body',
        type: 'cardio',
        description: 'Cardiovascular exercise for endurance and fat burning.',
        difficulty: 'beginner',
        equipment: ['treadmill'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockPlans: WorkoutPlan[] = [
      {
        id: '1',
        name: 'Push Day',
        description: 'Chest, shoulders, and triceps focused workout',
        exercises: [],
        estimatedDuration: 60,
        difficulty: 'intermediate',
        tags: ['strength', 'upper-body'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Pull Day',
        description: 'Back and biceps focused workout',
        exercises: [],
        estimatedDuration: 55,
        difficulty: 'intermediate',
        tags: ['strength', 'upper-body'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await exerciseStorage.save(mockExercises);
    await workoutPlanStorage.save(mockPlans);
  },
};