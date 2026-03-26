import React, { createContext, useContext, useState, ReactNode } from 'react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const C = {
  bg: '#0c0c0f', s1: '#131318', s2: '#1a1a22', s3: '#242430',
  border: '#2a2a38', acc: '#e8ff47', acc2: '#ff4d6d', acc3: '#7c6aff',
  text: '#f0f0f8', muted: '#6b6b80', card: '#18181f',
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
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

// ─── DATA ─────────────────────────────────────────────────────────────────────
export const EXERCISES_DATA: Exercise[] = [
  {
    id: 'e1', emoji: '🏋️', name: 'Press con Mancuerna',
    muscleGroup: 'Pecho', difficulty: 'Intermedio',
    description: 'Ejercicio fundamental para pecho con mancuernas. Permite mayor rango de movimiento que la barra y trabaja cada lado de forma independiente.',
    sets: 4, reps: 10, restSeconds: 60,
    secondaryMuscles: ['Tríceps braquial', 'Deltoides anterior'],
    steps: [
      'Acuéstate en un banco con una mancuerna en cada mano a la altura del pecho.',
      'Empuja las mancuernas hacia arriba hasta extender los brazos completamente.',
      'Baja de forma controlada hasta sentir estiramiento en el pecho.',
      'Mantén los codos a 45–75° del torso durante todo el movimiento.',
    ],
    commonErrors: 'No arquear la espalda · No dejar caer los codos · No rebotar las mancuernas',
  },
  {
    id: 'e2', emoji: '💪', name: 'Curl de Bíceps',
    muscleGroup: 'Bíceps', difficulty: 'Principiante',
    description: 'El ejercicio clásico para desarrollar los bíceps. Sencillo y muy efectivo para ganar masa muscular en la parte frontal del brazo.',
    sets: 3, reps: 12, restSeconds: 45,
    secondaryMuscles: ['Braquial', 'Supinador largo'],
    steps: [
      'De pie, sostén una mancuerna en cada mano con agarre supino (palmas hacia arriba).',
      'Mantén los codos pegados al cuerpo y flexiona los brazos hacia arriba.',
      'Aprieta el bíceps en la posición más alta durante 1 segundo.',
      'Baja lentamente hasta la posición inicial controlando el movimiento.',
    ],
    commonErrors: 'No balancear el torso · No soltar los codos del cuerpo · No bajar completamente',
  },
  {
    id: 'e3', emoji: '🦵', name: 'Sentadilla con Mancuernas',
    muscleGroup: 'Piernas', difficulty: 'Intermedio',
    description: 'Versión con mancuernas de la sentadilla. Ideal para trabajar cuádriceps y glúteos sin necesidad de barra.',
    sets: 4, reps: 12, restSeconds: 90,
    secondaryMuscles: ['Glúteos', 'Isquiotibiales', 'Core'],
    steps: [
      'De pie con pies a la anchura de los hombros, mancuernas colgando a los lados.',
      'Desciende flexionando rodillas y caderas como si fueras a sentarte.',
      'Mantén la espalda recta y el pecho hacia arriba durante todo el movimiento.',
      'Empuja desde los talones para volver a la posición inicial.',
    ],
    commonErrors: 'No doblar la espalda · No dejar caer las rodillas hacia adentro · Levantar talones',
  },
  {
    id: 'e4', emoji: '🔼', name: 'Press de Hombros',
    muscleGroup: 'Hombros', difficulty: 'Intermedio',
    description: 'Presión sobre la cabeza con mancuernas para desarrollar hombros completos y fuertes.',
    sets: 3, reps: 10, restSeconds: 60,
    secondaryMuscles: ['Tríceps', 'Trapecio superior'],
    steps: [
      'Sentado o de pie, lleva las mancuernas a la altura de los hombros con codos a 90°.',
      'Empuja hacia arriba hasta extender los brazos sin bloquear los codos.',
      'Baja de forma controlada hasta la posición inicial.',
      'Mantén el core activo y la espalda recta durante todo el movimiento.',
    ],
    commonErrors: 'No arquear la espalda lumbar · No empujar hacia adelante · No usar demasiado impulso',
  },
  {
    id: 'e5', emoji: '🔩', name: 'Remo con Mancuerna',
    muscleGroup: 'Espalda', difficulty: 'Intermedio',
    description: 'Remo unilateral apoyado en banco para desarrollar la espalda media y dar forma al músculo.',
    sets: 4, reps: 10, restSeconds: 60,
    secondaryMuscles: ['Bíceps', 'Romboides', 'Trapecio medio'],
    steps: [
      'Apoya una rodilla y una mano en el banco, sostén la mancuerna con la otra mano.',
      'Jala la mancuerna hacia la cadera manteniendo el codo cerca del cuerpo.',
      'Aprieta los músculos de la espalda en la posición más alta.',
      'Baja lentamente y con control hasta el estiramiento completo.',
    ],
    commonErrors: 'No rotar el torso · No levantar el hombro · No usar inercia excesiva',
  },
  {
    id: 'e6', emoji: '💎', name: 'Extensión de Tríceps',
    muscleGroup: 'Tríceps', difficulty: 'Principiante',
    description: 'Extensión sobre la cabeza con mancuerna para aislar el tríceps completamente.',
    sets: 3, reps: 12, restSeconds: 45,
    secondaryMuscles: ['Ancóneo'],
    steps: [
      'Siéntate y sujeta una mancuerna con ambas manos sobre la cabeza.',
      'Mantén los codos apuntando al frente y cerca de la cabeza.',
      'Flexiona los codos bajando la mancuerna detrás de la cabeza lentamente.',
      'Extiende los brazos de vuelta hacia arriba apretando el tríceps al final.',
    ],
    commonErrors: 'No abrir los codos · No bajar demasiado si hay molestia · No usar peso excesivo',
  },
];

const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'r1', emoji: '🏋️', name: 'Fuerza — Pecho y Tríceps',
    category: 'Fuerza', durationMin: 52, createdAt: new Date().toISOString(),
    exercises: [
      { exerciseId: 'e1', sets: 4, reps: 10, weightKg: 16 },
      { exerciseId: 'e6', sets: 3, reps: 12, weightKg: 12 },
      { exerciseId: 'e2', sets: 3, reps: 10, weightKg: 10 },
      { exerciseId: 'e4', sets: 3, reps: 10, weightKg: 14 },
    ],
  },
  {
    id: 'r2', emoji: '🦵', name: 'Hipertrofia — Piernas',
    category: 'Hipertrofia', durationMin: 45, createdAt: new Date().toISOString(),
    exercises: [
      { exerciseId: 'e3', sets: 4, reps: 12, weightKg: 20 },
      { exerciseId: 'e2', sets: 3, reps: 15, weightKg: 8  },
    ],
  },
  {
    id: 'r3', emoji: '💪', name: 'Full Body Mancuernas',
    category: 'Fuerza', durationMin: 60, createdAt: new Date().toISOString(),
    exercises: [
      { exerciseId: 'e1', sets: 3, reps: 10, weightKg: 14 },
      { exerciseId: 'e3', sets: 3, reps: 12, weightKg: 18 },
      { exerciseId: 'e2', sets: 3, reps: 12, weightKg: 10 },
      { exerciseId: 'e5', sets: 3, reps: 10, weightKg: 16 },
      { exerciseId: 'e4', sets: 3, reps: 10, weightKg: 12 },
      { exerciseId: 'e6', sets: 3, reps: 12, weightKg: 10 },
    ],
  },
];

const now = new Date();
const d = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();

const INITIAL_SESSIONS: WorkoutSession[] = [
  { id: 's1', routineId: 'r1', routineName: 'Pecho y Tríceps',   durationMin: 52, kcal: 338, totalSeries: 13, completedAt: d(1) },
  { id: 's2', routineId: 'r2', routineName: 'Hipertrofia Piernas', durationMin: 45, kcal: 293, totalSeries: 10, completedAt: d(3) },
  { id: 's3', routineId: 'r3', routineName: 'Full Body',          durationMin: 60, kcal: 390, totalSeries: 18, completedAt: d(5) },
  { id: 's4', routineId: 'r1', routineName: 'Pecho y Tríceps',   durationMin: 50, kcal: 325, totalSeries: 13, completedAt: d(7) },
  { id: 's5', routineId: 'r2', routineName: 'Hipertrofia Piernas', durationMin: 44, kcal: 286, totalSeries: 10, completedAt: d(9) },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', emoji: '🏆', name: 'Semana de Hierro',  description: '7 entrenamientos seguidos', unlocked: true },
  { id: 'a2', emoji: '💪', name: 'Primer Mes',         description: '30 días con RepForce',      unlocked: true },
  { id: 'a3', emoji: '🌟', name: 'Centurión',          description: '100 sesiones completadas',  unlocked: false, progress: 5, goal: 100 },
  { id: 'a4', emoji: '🔥', name: 'Racha Imparable',    description: '14 días consecutivos',      unlocked: false, progress: 7, goal: 14 },
];

export const CALENDAR_DATA: any[] = [
  null, null, null,
  { d: 1, rest: true },  { d: 2,  done: true },  { d: 3,  done: true },
  { d: 4, rest: true },  { d: 5,  done: true },  { d: 6,  done: true },
  { d: 7, done: true },  { d: 8,  rest: true },  { d: 9,  done: true },
  { d: 10, rest: true }, { d: 11, rest: true },  { d: 12, done: true },
  { d: 13, done: true }, { d: 14, done: true },  { d: 15, rest: true },
  { d: 16, done: true }, { d: 17, rest: true },  { d: 18, rest: true },
  { d: 19, done: true }, { d: 20, done: true },  { d: 21, done: true },
  { d: 22, rest: true }, { d: 23, done: true },  { d: 24, done: true },
  { d: 25, done: true }, { d: 26, rest: true },  { d: 27, done: true },
  { d: 28, done: true }, { d: 29, today: true },
];

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
interface AppState {
  currentUser: User | null;
  exercises: Exercise[];
  routines: Routine[];
  sessions: WorkoutSession[];
  achievements: Achievement[];
  login:    (username: string, password: string) => boolean;
  logout:   () => void;
  register: (data: Omit<User, 'id'>) => void;
  updateUser: (updates: Partial<User>) => void;
  addSession: (s: Omit<WorkoutSession, 'id'>) => void;
  markExerciseDone: (routineId: string, exerciseIndex: number) => void;
  resetRoutine: (routineId: string) => void;
  // computed
  totalSessions: number;
  totalKcal: number;
  streakDays: number;
  weekMinutes: number;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [exercises] = useState<Exercise[]>(EXERCISES_DATA);
  const [routines,  setRoutines]  = useState<Routine[]>(INITIAL_ROUTINES);
  const [sessions,  setSessions]  = useState<WorkoutSession[]>(INITIAL_SESSIONS);
  const [achievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // ── Auth ──
  const login = (username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) return false;
    setCurrentUser({
      id: '1', name: 'Tovar Sanchez', username,
      email: `${username}@repforce.app`,
      weightKg: 75, heightCm: 178,
      avatarEmoji: '👤', plan: 'pro',
    });
    return true;
  };

  const logout = () => setCurrentUser(null);

  const register = (data: Omit<User, 'id'>) => {
    setCurrentUser({ ...data, id: Date.now().toString() });
  };

  const updateUser = (updates: Partial<User>) => {
    setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  // ── Sessions ──
  const addSession = (s: Omit<WorkoutSession, 'id'>) => {
    setSessions(prev => [{ ...s, id: Date.now().toString() }, ...prev]);
  };

  // ── Routine progress ──
  const markExerciseDone = (routineId: string, exerciseIndex: number) => {
    setRoutines(prev => prev.map(r => {
      if (r.id !== routineId) return r;
      const exs = r.exercises.map((e, i) => {
        if (i === exerciseIndex) return { ...e, done: true, active: false };
        if (i === exerciseIndex + 1) return { ...e, active: true };
        return e;
      });
      return { ...r, exercises: exs };
    }));
  };

  const resetRoutine = (routineId: string) => {
    setRoutines(prev => prev.map(r => {
      if (r.id !== routineId) return r;
      return {
        ...r,
        exercises: r.exercises.map((e, i) => ({
          ...e, done: false, active: i === 0,
        })),
      };
    }));
  };

  // ── Computed stats ──
  const totalSessions = sessions.length;
  const totalKcal     = sessions.reduce((acc, s) => acc + s.kcal, 0);
  const streakDays    = 7;

  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
  const weekMinutes = sessions
    .filter(s => new Date(s.completedAt) > oneWeekAgo)
    .reduce((acc, s) => acc + s.durationMin, 0);

  return (
    <AppContext.Provider value={{
      currentUser, exercises, routines, sessions, achievements,
      login, logout, register, updateUser, addSession,
      markExerciseDone, resetRoutine,
      totalSessions, totalKcal, streakDays, weekMinutes,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const BADGE_COLORS: Record<BadgeType, { bg: string; color: string }> = {
  lime:   { bg: '#e8ff4720', color: '#e8ff47' },
  coral:  { bg: '#ff4d6d20', color: '#ff4d6d' },
  violet: { bg: '#7c6aff20', color: '#7c6aff' },
  muted:  { bg: '#242430',   color: '#6b6b80' },
};

export const MUSCLE_BADGE: Record<string, BadgeType> = {
  Pecho: 'coral', Espalda: 'violet', Piernas: 'lime',
  Hombros: 'coral', Bíceps: 'violet', Tríceps: 'lime', Core: 'muted',
};
