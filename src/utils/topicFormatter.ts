import { COURSES } from '../data/coursesData';
import { CourseId } from '../types/chuplingo';

const COURSE_EMOJIS: Record<string, string> = {
  'literatura': '📖',
  'psicologia': '🧠',
  'geografia': '🌍',
  'razonamiento-verbal': '✍️',
  'civica': '⚖️',
  'filosofia': '✨',
  'ingles': '🗣️',
  'biologia': '🧬'
};

export const getCourseEmoji = (courseId?: string): string => {
  if (!courseId) return '📚';
  const clean = courseId.toLowerCase().trim();
  return COURSE_EMOJIS[clean] || '📚';
};

/**
 * Convierte códigos como "literatura-tema-4", "lit-4", "tema-3" o "psi-1"
 * en nombres atractivos como "📖 Tema 04: Siglo de Oro Español"
 */
export const formatPrettyTopicName = (rawTopicIdOrName?: string | null, courseId?: string): string => {
  if (!rawTopicIdOrName || rawTopicIdOrName.trim() === '' || rawTopicIdOrName === 'all') {
    return 'Todos los Temas';
  }

  const raw = rawTopicIdOrName.trim();
  const emoji = getCourseEmoji(courseId);

  // 1. Buscar en el curso correspondiente si coincide con algún tema registrado
  const normalizedCourse = courseId ? courseId.toLowerCase().trim() : undefined;
  const targetCourse = COURSES.find(c => c.id === normalizedCourse);

  if (targetCourse) {
    // Buscar por ID exacto (ej. "lit-4")
    const foundById = targetCourse.temas.find(t => t.id.toLowerCase() === raw.toLowerCase());
    if (foundById) {
      return `${emoji} Tema ${foundById.numero}: ${foundById.nombre}`;
    }

    // Buscar si contiene el número del tema (ej. "literatura-tema-4", "tema-4", "tema 4", "lit-4")
    const numMatch = raw.match(/(?:tema|lit|psi|geo|rv|civ|fil|ing|bio)[-_ ]?(\d+)/i) || raw.match(/(\d+)/);
    if (numMatch && numMatch[1]) {
      const topicNum = parseInt(numMatch[1], 10);
      const foundByNum = targetCourse.temas.find(t => t.numero === topicNum);
      if (foundByNum) {
        return `${emoji} Tema ${foundByNum.numero}: ${foundByNum.nombre}`;
      }
    }

    // Buscar por nombre aproximado
    const foundByName = targetCourse.temas.find(t => 
      t.nombre.toLowerCase().includes(raw.toLowerCase()) || 
      raw.toLowerCase().includes(t.nombre.toLowerCase())
    );
    if (foundByName) {
      return `${emoji} Tema ${foundByName.numero}: ${foundByName.nombre}`;
    }
  }

  // 2. Si no pertenece a este curso, buscar en todos los cursos
  for (const c of COURSES) {
    const found = c.temas.find(t => t.id.toLowerCase() === raw.toLowerCase());
    if (found) {
      const cEmoji = getCourseEmoji(c.id);
      return `${cEmoji} Tema ${found.numero}: ${found.nombre}`;
    }
  }

  // 3. Formatear limpiamente el texto quitando guiones y números crudos
  let cleaned = raw
    .replace(/[-_]/g, ' ')
    .replace(/\b(literatura|psicologia|geografia|civica|filosofia|ingles|biologia)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalizar
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return `${emoji} ${cleaned}`;
};