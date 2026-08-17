export type CourseId = 
  | 'literatura' 
  | 'biologia' 
  | 'psicologia' 
  | 'geografia' 
  | 'razonamiento-verbal' 
  | 'civica' 
  | 'filosofia' 
  | 'ingles';

export type PracticeMode = 'rapida' | 'estandar' | 'intensiva' | 'errores' | 'favoritos' | 'simulacro';

export type QuestionDifficulty = 'facil' | 'intermedio' | 'avanzado';

export interface Alternative {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface Question {
  id: string;
  courseId: CourseId;
  topicId: string;
  topicName: string;
  pregunta: string;
  alternativas: Alternative[];
  respuestaCorrecta: 'A' | 'B' | 'C' | 'D' | 'E';
  explicacion: string;
  universidad?: string;
  anio?: number;
  dificultad?: QuestionDifficulty;
}

export interface Topic {
  id: string;
  courseId: CourseId;
  numero: number;
  nombre: string;
  descripcion: string;
  totalPreguntas: number;
}

export interface Course {
  id: CourseId;
  nombre: string;
  descripcion: string;
  icono: string;
  colorHex: string;
  bgGradient: string;
  accentColor: string;
  temas: Topic[];
}

export interface QuestionAttempt {
  questionId: string;
  courseId: CourseId;
  topicId: string;
  respuestaSeleccionada: 'A' | 'B' | 'C' | 'D' | 'E';
  esCorrecta: boolean;
  tiempoSegundos: number;
  fecha: string;
}

export interface PracticeSession {
  id: string;
  courseId: CourseId;
  courseName: string;
  topicId?: string;
  topicName?: string;
  mode: PracticeMode;
  fecha: string;
  duracionSegundos: number;
  totalPreguntas: number;
  correctas: number;
  incorrectas: number;
  porcentaje: number;
  xpGanado: number;
  attempts: QuestionAttempt[];
}

export interface MistakeRecord {
  questionId: string;
  courseId: CourseId;
  topicId: string;
  fallosConsecutivos: number;
  vecesAcertadaDespues: number;
  dominada: boolean;
  ultimoIntento: string;
}

export type ChallengeType = 'tests_completed' | 'questions_answered' | 'accuracy_target' | 'courses_practiced' | 'streak_days';

export interface Challenge {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  tipo: ChallengeType;
  meta: number;
  recompensaXP: number;
  periodo: 'diario' | 'semanal';
  reclamado?: boolean;
}

export interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: 'racha' | 'preguntas' | 'precision' | 'cursos' | 'especial';
  requisitoValor: number;
  desbloqueadoEn?: string;
}

export interface UserPreferences {
  metaDiaria: number; // 10, 20, 30, 50
  sonido: boolean;
  vibracion: boolean;
  recordatorios: boolean;
  temaOscuro: boolean;
}

export interface UserProfile {
  id: string;
  nombre: string;
  avatar: string;
  xp: number;
  nivel: number;
  tituloNivel: string;
  rachaActual: number;
  mejorRacha: number;
  ultimaFechaRacha: string; // YYYY-MM-DD
  preguntasRespondidasHoy: number;
  fechaPreguntasHoy: string; // YYYY-MM-DD
  metaDiariaCumplidaHoy: boolean;
  preferencias: UserPreferences;
  onboardingCompletado: boolean;
}

export interface LevelThreshold {
  nivel: number;
  titulo: string;
  xpMinimo: number;
  xpMaximo: number;
}