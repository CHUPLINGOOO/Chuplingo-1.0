import { Challenge } from '../types/chuplingo';

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-daily-1',
    titulo: 'Completa 1 test',
    descripcion: 'Realiza un test completo en cualquier curso.',
    icono: 'CheckCircle2',
    tipo: 'tests_completed',
    meta: 1,
    recompensaXP: 50,
    periodo: 'diario'
  },
  {
    id: 'ch-daily-2',
    titulo: 'Responde 20 preguntas',
    descripcion: 'Contesta 20 preguntas en total hoy.',
    icono: 'HelpCircle',
    tipo: 'questions_answered',
    meta: 20,
    recompensaXP: 75,
    periodo: 'diario'
  },
  {
    id: 'ch-daily-3',
    titulo: 'Obtén 80% de precisión',
    descripcion: 'Logra 80% o más de precisión en una sesión.',
    icono: 'Target',
    tipo: 'accuracy_target',
    meta: 80,
    recompensaXP: 100,
    periodo: 'diario'
  },
  {
    id: 'ch-daily-4',
    titulo: 'Practica 2 cursos',
    descripcion: 'Estudia y realiza tests en al menos 2 cursos diferentes.',
    icono: 'Layers',
    tipo: 'courses_practiced',
    meta: 2,
    recompensaXP: 80,
    periodo: 'diario'
  },

  // Weekly Challenges
  {
    id: 'ch-weekly-1',
    titulo: 'Completar 5 tests',
    descripcion: 'Termina 5 sesiones de práctica durante esta semana.',
    icono: 'Award',
    tipo: 'tests_completed',
    meta: 5,
    recompensaXP: 250,
    periodo: 'semanal'
  },
  {
    id: 'ch-weekly-2',
    titulo: 'Responder 100 preguntas',
    descripcion: 'Suma 100 respuestas registradas en la semana.',
    icono: 'Flame',
    tipo: 'questions_answered',
    meta: 100,
    recompensaXP: 300,
    periodo: 'semanal'
  },
  {
    id: 'ch-weekly-3',
    titulo: 'Racha de 7 días',
    descripcion: 'Cumple tu objetivo diario durante 7 días continuos.',
    icono: 'Zap',
    tipo: 'streak_days',
    meta: 7,
    recompensaXP: 450,
    periodo: 'semanal'
  },
  {
    id: 'ch-weekly-4',
    titulo: 'Maestría multidisplinaria',
    descripcion: 'Practica en 4 o más cursos diferentes en la semana.',
    icono: 'GraduationCap',
    tipo: 'courses_practiced',
    meta: 4,
    recompensaXP: 350,
    periodo: 'semanal'
  }
];