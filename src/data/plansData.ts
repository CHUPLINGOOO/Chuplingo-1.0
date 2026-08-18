import { PlanConfig } from '../types/chuplingo';

export const CHUPLINGO_PLANS: PlanConfig[] = [
  {
    id: 'gratis',
    nombre: 'PLAN GRATIS',
    subtitulo: 'Empieza tu vuelo',
    precio: 0,
    periodo: 'Para siempre',
    colorHex: '#64748B',
    beneficios: [
      'Acceso a los 8 cursos preuniversitarios',
      'Prácticas diarias básicas (10 preguntas)',
      'Estadísticas y resumen de sesión',
      'Sistema de Racha y XP',
      'Desafíos diarios básicos',
      'Banco de favoritos (hasta 5 preguntas)'
    ]
  },
  {
    id: 'fan',
    nombre: 'CHUPLINGO FAN',
    subtitulo: 'Ya eres parte de la bandada',
    precio: 8,
    periodo: 'al mes',
    colorHex: '#FF9418',
    badge: 'FAN',
    beneficios: [
      'Todo lo del Plan Gratis',
      'Más prácticas diarias y simulacros',
      'Favoritos ampliados (hasta 30)',
      'Repaso de errores frecuentes',
      'Estadísticas de precisión por curso',
      'Desafíos diarios y semanales adicionales',
      'Insignia de miembro FAN en tu perfil'
    ]
  },
  {
    id: 'lover',
    nombre: 'CHUPLINGO LOVER',
    subtitulo: 'Prepárate en serio',
    precio: 15,
    periodo: 'al mes',
    colorHex: '#12B7E8',
    badge: 'LOVER',
    beneficios: [
      'Todo lo de Chuplingo Fan',
      'Prácticas ilimitadas sin restricción',
      'Simulacros cronometrados completos',
      'Estadísticas analíticas avanzadas',
      'Historial completo de todas tus sesiones',
      'Recomendaciones según tus errores',
      'Filtros detallados por tema y dificultad',
      'Insignia brillante LOVER'
    ]
  },
  {
    id: 'vip',
    nombre: 'CHUPLINGO VIP',
    subtitulo: 'Vuela al máximo',
    precio: 25,
    periodo: 'al mes',
    colorHex: '#F05C54',
    badge: 'VIP',
    destacado: true,
    beneficios: [
      'Todo lo de Chuplingo Lover',
      'Acceso total al banco de preguntas',
      'Simulacros tipo examen de admisión',
      'Análisis detallado de rendimiento y evolución',
      'Comparativa semanal y mensual',
      'Biblioteca ilimitada de preguntas guardadas',
      'Algoritmo de repaso inteligente',
      'Diseño y badge dorado VIP en perfil',
      'Soporte prioritario y acceso a novedades'
    ]
  }
];