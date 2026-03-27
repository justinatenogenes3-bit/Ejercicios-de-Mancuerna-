import React, { createContext, useContext, useState, ReactNode } from 'react';

// ─── DESIGN TOKENS ─────────────────────────────────────────
export const C = {
  bg: '#0c0c0f', s1: '#131318', s2: '#1a1a22', s3: '#242430',
  border: '#2a2a38', acc: '#e8ff47', acc2: '#ff4d6d', acc3: '#7c6aff',
  text: '#f0f0f8', muted: '#6b6b80', card: '#18181f',
};

// ─── TYPES ─────────────────────────────────────────────────
export type MuscleGroup = 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Bíceps' | 'Tríceps' | 'Core';
export type Difficulty  = 'Principiante' | 'Intermedio' | 'Avanzado';
export type BadgeType   = 'lime' | 'coral' | 'violet' | 'muted';

export interface User {
  id: string; name: string; username: string; password?: string;
  email?: string; weightKg?: number; heightCm?: number;
  avatarEmoji?: string; plan?: 'free' | 'pro';
}

export interface Exercise {
  id: string; emoji: string; name: string;
  muscleGroup: MuscleGroup; difficulty: Difficulty;
  description: string; sets: number; reps: number; restSeconds: number;
  secondaryMuscles: string[]; steps: string[]; commonErrors: string;

  video: any; // 🔥 VIDEO LOCAL
}

export interface RoutineExercise {
  exerciseId: string; sets: number; reps: number;
  weightKg?: number; done?: boolean; active?: boolean;
}

export interface Routine {
  id: string; emoji: string; name: string; category: string;
  durationMin: number; exercises: RoutineExercise[]; createdAt: string;
}

export interface WorkoutSession {
  id: string; routineId: string; routineName: string;
  durationMin: number; kcal: number; totalSeries: number; completedAt: string;
}

export interface Achievement {
  id: string; emoji: string; name: string;
  description: string; unlocked: boolean; progress?: number; goal?: number;
}

// ─── DATA ──────────────────────────────────────────────────
export const EXERCISES_DATA: Exercise[] = [
  {
    id: 'e1',
    emoji: '🏋️',
    name: 'Press con Mancuerna',
    muscleGroup: 'Pecho',
    difficulty: 'Intermedio',
    description: 'Ejercicio fundamental para pecho.',
    sets: 4,
    reps: 10,
    restSeconds: 60,
    secondaryMuscles: ['Tríceps', 'Hombros'],
    steps: ['Acuéstate', 'Empuja', 'Baja controlado'],
    commonErrors: 'No arquear espalda',
    video: require('../../assets/videos/press.mp4'),
  },
  {
    id: 'e2',
    emoji: '💪',
    name: 'Curl de Bíceps',
    muscleGroup: 'Bíceps',
    difficulty: 'Principiante',
    description: 'Ejercicio de bíceps.',
    sets: 3,
    reps: 12,
    restSeconds: 45,
    secondaryMuscles: ['Braquial'],
    steps: ['Sujeta', 'Sube', 'Baja'],
    commonErrors: 'No balancearse',
    video: require('../../assets/videos/curl.mp4'),
  },
  {
    id: 'e3',
    emoji: '🦵',
    name: 'Sentadilla',
    muscleGroup: 'Piernas',
    difficulty: 'Intermedio',
    description: 'Ejercicio de piernas.',
    sets: 4,
    reps: 12,
    restSeconds: 90,
    secondaryMuscles: ['Glúteos'],
    steps: ['Baja', 'Sube'],
    commonErrors: 'Rodillas mal',
    video: require('../../assets/videos/sentadilla.mp4'),
  },
  {
    id: 'e4',
    emoji: '🔼',
    name: 'Press Hombro',
    muscleGroup: 'Hombros',
    difficulty: 'Intermedio',
    description: 'Ejercicio hombros.',
    sets: 3,
    reps: 10,
    restSeconds: 60,
    secondaryMuscles: ['Tríceps'],
    steps: ['Sube', 'Baja'],
    commonErrors: 'Espalda mal',
    video: require('../../assets/videos/hombro.mp4'),
  },
  {
    id: 'e5',
    emoji: '🔩',
    name: 'Remo',
    muscleGroup: 'Espalda',
    difficulty: 'Intermedio',
    description: 'Ejercicio espalda.',
    sets: 4,
    reps: 10,
    restSeconds: 60,
    secondaryMuscles: ['Bíceps'],
    steps: ['Jala', 'Baja'],
    commonErrors: 'No girar',
    video: require('../../assets/videos/remo.mp4'),
  },
  {
    id: 'e6',
    emoji: '💎',
    name: 'Tríceps',
    muscleGroup: 'Tríceps',
    difficulty: 'Principiante',
    description: 'Ejercicio tríceps.',
    sets: 3,
    reps: 12,
    restSeconds: 45,
    secondaryMuscles: ['Ancóneo'],
    steps: ['Baja', 'Sube'],
    commonErrors: 'Codos abiertos',
    video: require('../../assets/videos/triceps.mp4'),
  },
];

// ─── CONTEXT ───────────────────────────────────────────────
interface AppState {
  currentUser: User | null;
  exercises: Exercise[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [exercises] = useState<Exercise[]>(EXERCISES_DATA);

  const login = (username: string, password: string) => {
    if (!username || !password) return false;
    setCurrentUser({
      id: '1',
      name: 'Usuario',
      username,
      avatarEmoji: '👤',
      plan: 'pro',
    });
    return true;
  };

  const logout = () => setCurrentUser(null);

  return (
    <AppContext.Provider value={{ currentUser, exercises }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};