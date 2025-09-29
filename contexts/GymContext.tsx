import { DailySchedule, Exercise, WorkoutPlan, WorkoutSession } from '@/types/gym';
import { exerciseStorage, scheduleStorage, sessionStorage, storageUtils, workoutPlanStorage } from '@/utils/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface GymContextType {
  // Data
  exercises: Exercise[];
  workoutPlans: WorkoutPlan[];
  schedule: DailySchedule[];
  sessions: WorkoutSession[];
  
  // Loading states
  isLoading: boolean;
  
  // Exercise functions
  addExercise: (exercise: Exercise) => Promise<void>;
  updateExercise: (exerciseId: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  
  // Workout plan functions
  addWorkoutPlan: (plan: WorkoutPlan) => Promise<void>;
  updateWorkoutPlan: (planId: string, updates: Partial<WorkoutPlan>) => Promise<void>;
  deleteWorkoutPlan: (planId: string) => Promise<void>;
  
  // Schedule functions
  updateSchedule: (dayId: string, updates: Partial<DailySchedule>) => Promise<void>;
  
  // Session functions
  addSession: (session: WorkoutSession) => Promise<void>;
  updateSession: (sessionId: string, updates: Partial<WorkoutSession>) => Promise<void>;
  
  // Utility functions
  refreshData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

interface GymProviderProps {
  children: ReactNode;
}

export function GymProvider({ children }: GymProviderProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [schedule, setSchedule] = useState<DailySchedule[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Initialize with mock data if first time
      await storageUtils.initializeWithMockData();
      
      // Load all data
      const [loadedExercises, loadedPlans, loadedSchedule, loadedSessions] = await Promise.all([
        exerciseStorage.load(),
        workoutPlanStorage.load(),
        scheduleStorage.load(),
        sessionStorage.load(),
      ]);

      setExercises(loadedExercises);
      setWorkoutPlans(loadedPlans);
      setSchedule(loadedSchedule);
      setSessions(loadedSessions);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Exercise functions
  const addExercise = async (exercise: Exercise) => {
    await exerciseStorage.add(exercise);
    setExercises(prev => [...prev, exercise]);
  };

  const updateExercise = async (exerciseId: string, updates: Partial<Exercise>) => {
    await exerciseStorage.update(exerciseId, updates);
    setExercises(prev => 
      prev.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, ...updates, updatedAt: new Date() }
          : exercise
      )
    );
  };

  const deleteExercise = async (exerciseId: string) => {
    await exerciseStorage.delete(exerciseId);
    setExercises(prev => prev.filter(exercise => exercise.id !== exerciseId));
  };

  // Workout plan functions
  const addWorkoutPlan = async (plan: WorkoutPlan) => {
    await workoutPlanStorage.add(plan);
    setWorkoutPlans(prev => [...prev, plan]);
  };

  const updateWorkoutPlan = async (planId: string, updates: Partial<WorkoutPlan>) => {
    await workoutPlanStorage.update(planId, updates);
    setWorkoutPlans(prev =>
      prev.map(plan =>
        plan.id === planId
          ? { ...plan, ...updates, updatedAt: new Date() }
          : plan
      )
    );
  };

  const deleteWorkoutPlan = async (planId: string) => {
    await workoutPlanStorage.delete(planId);
    setWorkoutPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  // Schedule functions
  const updateSchedule = async (dayId: string, updates: Partial<DailySchedule>) => {
    await scheduleStorage.update(dayId, updates);
    setSchedule(prev =>
      prev.map(day =>
        day.id === dayId
          ? { ...day, ...updates, updatedAt: new Date() }
          : day
      )
    );
  };

  // Session functions
  const addSession = async (session: WorkoutSession) => {
    await sessionStorage.add(session);
    setSessions(prev => [...prev, session]);
  };

  const updateSession = async (sessionId: string, updates: Partial<WorkoutSession>) => {
    await sessionStorage.update(sessionId, updates);
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, ...updates, updatedAt: new Date() }
          : session
      )
    );
  };

  // Utility functions
  const refreshData = async () => {
    await loadData();
  };

  const clearAllData = async () => {
    await storageUtils.clearAll();
    setExercises([]);
    setWorkoutPlans([]);
    setSchedule([]);
    setSessions([]);
  };

  const contextValue: GymContextType = {
    // Data
    exercises,
    workoutPlans,
    schedule,
    sessions,
    
    // Loading states
    isLoading,
    
    // Exercise functions
    addExercise,
    updateExercise,
    deleteExercise,
    
    // Workout plan functions
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    
    // Schedule functions
    updateSchedule,
    
    // Session functions
    addSession,
    updateSession,
    
    // Utility functions
    refreshData,
    clearAllData,
  };

  return (
    <GymContext.Provider value={contextValue}>
      {children}
    </GymContext.Provider>
  );
}

export function useGym() {
  const context = useContext(GymContext);
  if (context === undefined) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
}