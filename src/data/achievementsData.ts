import { Achievement } from '../types/chuplingo';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    nombre: 'Primera Racha',
    descripcion: 'Mantén una racha de 3 días cumpliendo tu meta.',
    icono: 'Flame',
    categoria: 'racha',
    requisitoValor: 3,
  },
  {
    id: 'ach-2',
    nombre: 'Estudiante Constante',
    descripcion: 'Responde 100 preguntas en total.',
    icono: 'BookOpen',
    categoria: 'preguntas',
    requisitoValor: 100,
  },
  {
    id: 'ach-3',
    nombre: 'Francotirador de Precisión',
    descripcion: 'Obtén 90% o más en un test de práctica.',
    icono: 'Target',
    categoria: 'precision',
    requisitoValor: 90,
  },
  {
    id: 'ach-4',
    nombre: 'Imparable',
    descripcion: 'Mantén una racha activa de 30 días.',
    icono: 'Trophy',
    categoria: 'racha',
    requisitoValor: 30,
  },
  {
    id: 'ach-5',
    nombre: 'Multidisciplinario',
    descripcion: 'Practica al menos una sesión en los 8 cursos.',
    icono: 'Globe2',
    categoria: 'cursos',
    requisitoValor: 8,
  },
  {
    id: 'ach-6',
    nombre: 'English Starter',
    descripcion: 'Completa tu primera práctica del curso de Inglés.',
    icono: 'Languages',
    categoria: 'especial',
    requisitoValor: 1,
  },
  {
    id: 'ach-7',
    nombre: 'Cazador de Errores',
    descripcion: 'Domina 5 preguntas que habías fallado previamente.',
    icono: 'CheckCircle2',
    categoria: 'especial',
    requisitoValor: 5,
  },
  {
    id: 'ach-8',
    nombre: 'Coleccionista de Joyas',
    descripcion: 'Guarda 10 preguntas en tus favoritos.',
    icono: 'Star',
    categoria: 'especial',
    requisitoValor: 10,
  }
];