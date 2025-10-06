export type ExerciseType = 'cardio' | 'compound' | 'isolated' | 'mobility' | 'calisthenics' | 'endurance';

// ...existing code...
export type BodyPart = 
  | 'chest'
  | 'lowerback'
  | 'back'
  | 'shoulders'
  | 'shoulders'
  | 'upperabs'
  | 'sideabs'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'middlequads'
  | 'innerquads'
  | 'hamstrings'
  | 'glutes'
  | 'core'
  | 'calves'
  | 'frontcalves'
  | 'forearms'
  | 'lats'
  | 'traps'
  | 'reardelts'
  | 'full-body';

export interface Exercise {
  id: string;
  name: string;
  image?: string; // URL or local asset path
  bodyPart: BodyPart;
  type: ExerciseType;
  description: string;
  instructions?: string[];
  tips?: string[];
  equipment?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutPlanExercise {
  exerciseId: string;
  exercise: Exercise; // For convenience when populated
  sets?: number;
  reps?: string; // e.g., "8-12", "15", "max"
  weight?: number;
  duration?: number; // in seconds for timed exercises
  restTime?: number; // in seconds
  notes?: string;
  order: number; // position in the workout
}

export interface WorkoutPlan {
  id: string;
  name: string; // e.g., "Pull Day", "Push Day", "Leg Day"
  description?: string;
  exercises: WorkoutPlanExercise[];
  estimatedDuration?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[]; // e.g., ["strength", "upper-body", "mass-building"]
  createdAt: Date;
  updatedAt: Date;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DailySchedule {
  id: string;
  dayOfWeek: DayOfWeek;
  workoutPlanId?: string;
  workoutPlan?: WorkoutPlan; // For convenience when populated
  isRestDay: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSession {
  id: string;
  workoutPlanId: string;
  workoutPlan?: WorkoutPlan;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  completedExercises: {
    exerciseId: string;
    sets: {
      reps: number;
      weight?: number;
      duration?: number;
      completed: boolean;
      notes?: string;
    }[];
  }[];
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'struggling';
  createdAt: Date;
  updatedAt: Date;
}