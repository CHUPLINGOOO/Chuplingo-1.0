import { Course, Question } from '../types/chuplingo';

export const COURSES: Course[] = [
  {
    id: 'literatura',
    nombre: 'Literatura',
    descripcion: 'Géneros literarios, figuras retóricas, Siglo de Oro, literatura peruana y universal.',
    icono: 'BookOpen',
    colorHex: '#F05C54',
    bgGradient: 'from-[#F05C54] to-[#FF7B74]',
    accentColor: 'bg-[#F05C54]',
    temas: [
      { id: 'lit-1', courseId: 'literatura', numero: 1, nombre: 'Géneros y Figuras Literarias', descripcion: 'Metáfora, hipérbole, anáfora y géneros lírico, épico y dramático.', totalPreguntas: 15 },
      { id: 'lit-2', courseId: 'literatura', numero: 2, nombre: 'Literatura Clásica Griega y Latina', descripcion: 'Homero, Ilíada, Odisea, Sófocles y Virgilio.', totalPreguntas: 12 },
      { id: 'lit-3', courseId: 'literatura', numero: 3, nombre: 'Literatura Medieval y Renacentista', descripcion: 'Cantar de Mio Cid, Dante Alighieri y Shakespeare.', totalPreguntas: 12 },
      { id: 'lit-4', courseId: 'literatura', numero: 4, nombre: 'Siglo de Oro Español', descripcion: 'Garcilaso, Cervantes, Don Quijote, Calderón y Góngora.', totalPreguntas: 14 },
      { id: 'lit-5', courseId: 'literatura', numero: 5, nombre: 'Romanticismo y Realismo Universal', descripcion: 'Bécquer, Víctor Hugo, Balzac y Dostoievski.', totalPreguntas: 12 },
      { id: 'lit-6', courseId: 'literatura', numero: 6, nombre: 'Generación del 98 y Generación del 27', descripcion: 'Unamuno, Antonio Machado, Federico García Lorca.', totalPreguntas: 10 },
      { id: 'lit-7', courseId: 'literatura', numero: 7, nombre: 'Literatura Peruana Colonial e Incaica', descripcion: 'Ollantay, Inca Garcilaso de la Vega, Amarilis.', totalPreguntas: 12 },
      { id: 'lit-8', courseId: 'literatura', numero: 8, nombre: 'Costumbrismo y Romanticismo Peruano', descripcion: 'Pardo y Aliaga, Manuel A. Segura, Ricardo Palma.', totalPreguntas: 12 },
      { id: 'lit-9', courseId: 'literatura', numero: 9, nombre: 'Indigenismo y Vanguardia Peruana', descripcion: 'César Vallejo, José María Arguedas, Ciro Alegría.', totalPreguntas: 15 },
      { id: 'lit-10', courseId: 'literatura', numero: 10, nombre: 'El Boom Latinoamericano', descripcion: 'Mario Vargas Llosa, García Márquez, Cortázar, Rulfo.', totalPreguntas: 14 },
    ]
  },
  {
    id: 'psicologia',
    nombre: 'Psicología',
    descripcion: 'Escuelas psicológicas, bases biológicas, procesos cognitivos, afectividad y personalidad.',
    icono: 'Brain',
    colorHex: '#7354D9',
    bgGradient: 'from-[#7354D9] to-[#9176EA]',
    accentColor: 'bg-[#7354D9]',
    temas: [
      { id: 'psi-1', courseId: 'psicologia', numero: 1, nombre: 'Historia y Escuelas Psicológicas', descripcion: 'Estructuralismo, Conductismo, Psicoanálisis, Gestalt y Humanismo.', totalPreguntas: 12 },
      { id: 'psi-2', courseId: 'psicologia', numero: 2, nombre: 'Bases Biológicas de la Conducta', descripcion: 'Hemisferios cerebrales, lóbulos y sistema límbico.', totalPreguntas: 14 },
      { id: 'psi-3', courseId: 'psicologia', numero: 3, nombre: 'Sensación y Percepción', descripcion: 'Umbrales sensoriales y leyes perceptivas de la Gestalt.', totalPreguntas: 12 },
      { id: 'psi-4', courseId: 'psicologia', numero: 4, nombre: 'Memoria y Olvido', descripcion: 'Memoria sensorial, corto plazo, largo plazo y amnesias.', totalPreguntas: 12 },
      { id: 'psi-5', courseId: 'psicologia', numero: 5, nombre: 'Pensamiento y Lenguaje', descripcion: 'Conceptos, razonamiento deductivo e inductivo.', totalPreguntas: 12 },
      { id: 'psi-6', courseId: 'psicologia', numero: 6, nombre: 'Inteligencia y Teorías', descripcion: 'Cociente intelectual, inteligencias múltiples de Gardner.', totalPreguntas: 12 },
      { id: 'psi-7', courseId: 'psicologia', numero: 7, nombre: 'Afectividad y Motivación', descripcion: 'Emociones, sentimientos y pirámide de Maslow.', totalPreguntas: 14 },
      { id: 'psi-8', courseId: 'psicologia', numero: 8, nombre: 'Aprendizaje y Condicionamiento', descripcion: 'Condicionamiento clásico, operante y vicario.', totalPreguntas: 14 },
      { id: 'psi-9', courseId: 'psicologia', numero: 9, nombre: 'Desarrollo Humano', descripcion: 'Etapas del desarrollo cognitivo de Piaget y Erikson.', totalPreguntas: 14 },
      { id: 'psi-10', courseId: 'psicologia', numero: 10, nombre: 'Personalidad y Mecanismos de Defensa', descripcion: 'Estructura del aparato psíquico: Ello, Yo y Superyó.', totalPreguntas: 14 },
    ]
  },
  {
    id: 'geografia',
    nombre: 'Geografía',
    descripcion: 'Cartografía, geodinámica, 8 regiones naturales, 11 ecorregiones y geografía del Perú.',
    icono: 'Globe',
    colorHex: '#12B7E8',
    bgGradient: 'from-[#12B7E8] to-[#47CDF6]',
    accentColor: 'bg-[#12B7E8]',
    temas: [
      { id: 'geo-1', courseId: 'geografia', numero: 1, nombre: 'Geodesia y Cartografía', descripcion: 'Líneas imaginarias, coordenadas, escalas y mapas.', totalPreguntas: 12 },
      { id: 'geo-2', courseId: 'geografia', numero: 2, nombre: 'Geodinámica Interna y Externa', descripcion: 'Tectónica de placas, vulcanismo, sismos y erosión.', totalPreguntas: 14 },
      { id: 'geo-3', courseId: 'geografia', numero: 3, nombre: 'Atmósfera y Climatología', descripcion: 'Capas atmosféricas, efecto invernadero y clima.', totalPreguntas: 14 },
      { id: 'geo-4', courseId: 'geografia', numero: 4, nombre: 'Hidrografía y Cuencas', descripcion: 'Océanos, corrientes marinas y vertientes del Perú.', totalPreguntas: 12 },
      { id: 'geo-5', courseId: 'geografia', numero: 5, nombre: 'Relieve Peruano (Costa, Sierra y Selva)', descripcion: 'Pampas, valles interandinos, mesetas y pongos.', totalPreguntas: 15 },
      { id: 'geo-6', courseId: 'geografia', numero: 6, nombre: 'Las 8 Regiones Naturales del Perú', descripcion: 'Tesis de Javier Pulgar Vidal: Chala hasta Janca.', totalPreguntas: 16 },
      { id: 'geo-7', courseId: 'geografia', numero: 7, nombre: 'Las 11 Ecorregiones de Brack Egg', descripcion: 'Mar frío, serranía esteparia, sabana de palmeras.', totalPreguntas: 14 },
      { id: 'geo-8', courseId: 'geografia', numero: 8, nombre: 'Demografía y Población Peruana', descripcion: 'Censos, natalidad, mortalidad y migraciones.', totalPreguntas: 12 },
      { id: 'geo-9', courseId: 'geografia', numero: 9, nombre: 'Actividades Económicas y Recursos', descripcion: 'Minería, agricultura, pesca y energía.', totalPreguntas: 12 },
      { id: 'geo-10', courseId: 'geografia', numero: 10, nombre: 'Áreas Naturales Protegidas y Fronteras', descripcion: 'Parques, reservas, santuarios y tratados limítrofes.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'razonamiento-verbal',
    nombre: 'Razonamiento Verbal',
    descripcion: 'Comprensión de textos, conectores lógicos, analogías, precisión léxica y plan de redacción.',
    icono: 'SpellCheck',
    colorHex: '#FF9418',
    bgGradient: 'from-[#FF9418] to-[#FFAB4A]',
    accentColor: 'bg-[#FF9418]',
    temas: [
      { id: 'rv-1', courseId: 'razonamiento-verbal', numero: 1, nombre: 'Sinonimia y Antonimia Contextual', descripcion: 'Significado denotativo y connotativo en contexto.', totalPreguntas: 15 },
      { id: 'rv-2', courseId: 'razonamiento-verbal', numero: 2, nombre: 'Analogías Verbales', descripcion: 'Relaciones de causa-efecto, parte-todo y especie-género.', totalPreguntas: 15 },
      { id: 'rv-3', courseId: 'razonamiento-verbal', numero: 3, nombre: 'Conectores Lógicos y Marcadores', descripcion: 'Adversativos, causales, consecutivos y concesivos.', totalPreguntas: 15 },
      { id: 'rv-4', courseId: 'razonamiento-verbal', numero: 4, nombre: 'Oraciones Incompletas y Precisión Léxica', descripcion: 'Coherencia gramatical y propiedad del vocabulario.', totalPreguntas: 14 },
      { id: 'rv-5', courseId: 'razonamiento-verbal', numero: 5, nombre: 'Eliminación de Oraciones', descripcion: 'Criterios de redundancia, impertinencia y contradicción.', totalPreguntas: 14 },
      { id: 'rv-6', courseId: 'razonamiento-verbal', numero: 6, nombre: 'Plan de Redacción', descripcion: 'Ordenamiento lógico, deductivo y cronológico.', totalPreguntas: 14 },
      { id: 'rv-7', courseId: 'razonamiento-verbal', numero: 7, nombre: 'Comprensión Textual: Tema y Tesis', descripcion: 'Idea principal, ideas secundarias y propósito del autor.', totalPreguntas: 15 },
      { id: 'rv-8', courseId: 'razonamiento-verbal', numero: 8, nombre: 'Inferencia y Extrapolación', descripcion: 'Deducciones rigurosas y situaciones hipotéticas.', totalPreguntas: 15 },
      { id: 'rv-9', courseId: 'razonamiento-verbal', numero: 9, nombre: 'Textos Filosóficos y Humanísticos', descripcion: 'Lectura crítica y análisis de posturas reflexivas.', totalPreguntas: 12 },
      { id: 'rv-10', courseId: 'razonamiento-verbal', numero: 10, nombre: 'Textos Dialécticos y Discontinuos', descripcion: 'Contraste entre dos posturas contrapuestas e infografías.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'civica',
    nombre: 'Cívica',
    descripcion: 'Derechos humanos, Constitución Política, Poderes del Estado y organismos autónomos.',
    icono: 'Scale',
    colorHex: '#F5A623',
    bgGradient: 'from-[#F5A623] to-[#F7BC59]',
    accentColor: 'bg-[#F5A623]',
    temas: [
      { id: 'civ-1', courseId: 'civica', numero: 1, nombre: 'Derechos Humanos y Generaciones', descripcion: 'Declaración Universal, derechos civiles, políticos y sociales.', totalPreguntas: 12 },
      { id: 'civ-2', courseId: 'civica', numero: 2, nombre: 'Garantías Constitucionales', descripcion: 'Habeas Corpus, Acción de Amparo, Habeas Data y Popular.', totalPreguntas: 14 },
      { id: 'civ-3', courseId: 'civica', numero: 3, nombre: 'La Persona Humana y la Familia', descripcion: 'Capacidad de goce y ejercicio, patria potestad y tutela.', totalPreguntas: 12 },
      { id: 'civ-4', courseId: 'civica', numero: 4, nombre: 'Poder Legislativo del Perú', descripcion: 'Congreso de la República, comisiones y función legislativa.', totalPreguntas: 12 },
      { id: 'civ-5', courseId: 'civica', numero: 5, nombre: 'Poder Ejecutivo del Perú', descripcion: 'Presidencia, Consejo de Ministros y facultades ejecutivas.', totalPreguntas: 12 },
      { id: 'civ-6', courseId: 'civica', numero: 6, nombre: 'Poder Judicial y Sistema Procesal', descripcion: 'Corte Suprema, cortes superiores y principios de justicia.', totalPreguntas: 12 },
      { id: 'civ-7', courseId: 'civica', numero: 7, nombre: 'Organismos Constitucionales Autónomos', descripcion: 'TC, JNE, ONPE, RENIEC, BCRP, SBS y Defensoría.', totalPreguntas: 15 },
      { id: 'civ-8', courseId: 'civica', numero: 8, nombre: 'Mecanismos de Participación Ciudadana', descripcion: 'Referéndum, revocatoria, rendición de cuentas e iniciativa.', totalPreguntas: 12 },
      { id: 'civ-9', courseId: 'civica', numero: 9, nombre: 'Estructura del Estado y Gobiernos Regionales', descripcion: 'Descentralización, regiones y municipalidades.', totalPreguntas: 12 },
      { id: 'civ-10', courseId: 'civica', numero: 10, nombre: 'Derecho Internacional y Organismos Globales', descripcion: 'ONU, OEA, CIDH y Tratados de Derechos Humanos.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'filosofia',
    nombre: 'Filosofía',
    descripcion: 'Disciplinas filosóficas, filósofos presocráticos, Platón, Aristóteles, Kant y epistemología.',
    icono: 'Sparkles',
    colorHex: '#5856D6',
    bgGradient: 'from-[#5856D6] to-[#7B79E8]',
    accentColor: 'bg-[#5856D6]',
    temas: [
      { id: 'fil-1', courseId: 'filosofia', numero: 1, nombre: 'Disciplinas y Origen de la Filosofía', descripcion: 'Ontología, gnoseología, ética, estética y paso del mito al logos.', totalPreguntas: 12 },
      { id: 'fil-2', courseId: 'filosofia', numero: 2, nombre: 'Filosofía Antigua: Presocráticos y Sócrates', descripcion: 'Arjé, Tales, Heráclito, Parménides y mayéutica socrática.', totalPreguntas: 14 },
      { id: 'fil-3', courseId: 'filosofia', numero: 3, nombre: 'Platón y Aristóteles', descripcion: 'Mundo de las ideas, hilemorfismo y teoría de las cuatro causas.', totalPreguntas: 15 },
      { id: 'fil-4', courseId: 'filosofia', numero: 4, nombre: 'Filosofía Helenística y Medieval', descripcion: 'Estoicismo, epicureísmo, San Agustín y Santo Tomás.', totalPreguntas: 12 },
      { id: 'fil-5', courseId: 'filosofia', numero: 5, nombre: 'Racionalismo y Empirismo Moderno', descripcion: 'Descartes, Spinoza, John Locke y David Hume.', totalPreguntas: 14 },
      { id: 'fil-6', courseId: 'filosofia', numero: 6, nombre: 'Criticismo Kantiano e Idealismo Alemán', descripcion: 'Imperativo categórico, juicios sintéticos a priori y Hegel.', totalPreguntas: 12 },
      { id: 'fil-7', courseId: 'filosofia', numero: 7, nombre: 'Filosofía del Siglo XIX: Marx y Nietzsche', descripcion: 'Materialismo histórico, alineación y voluntad de poder.', totalPreguntas: 14 },
      { id: 'fil-8', courseId: 'filosofia', numero: 8, nombre: 'Existencialismo y Filosofía Contemporánea', descripcion: 'Sartre, Heidegger, Camus y la condición humana.', totalPreguntas: 12 },
      { id: 'fil-9', courseId: 'filosofia', numero: 9, nombre: 'Epistemología y Filosofía de la Ciencia', descripcion: 'Popper, Kuhn, falsacionismo y revoluciones científicas.', totalPreguntas: 12 },
      { id: 'fil-10', courseId: 'filosofia', numero: 10, nombre: 'Filosofía Latinoamericana y Peruana', descripcion: 'Deustua, Villarán, Miró Quesada y debate de la autenticidad.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'ingles',
    nombre: 'Inglés',
    descripcion: 'Vocabulario preuniversitario, tiempos verbales, preposiciones, conectores y lectura en inglés.',
    icono: 'Languages',
    colorHex: '#007AFF',
    bgGradient: 'from-[#007AFF] to-[#3498FF]',
    accentColor: 'bg-[#007AFF]',
    temas: [
      { id: 'ing-1', courseId: 'ingles', numero: 1, nombre: 'Academic Vocabulary & Context', descripcion: 'Essential vocabulary, false cognates and contextual meaning.', totalPreguntas: 15 },
      { id: 'ing-2', courseId: 'ingles', numero: 2, nombre: 'Grammar: Parts of Speech & Modals', descripcion: 'Pronouns, modals, adjectives, adverbs and determiners.', totalPreguntas: 15 },
      { id: 'ing-3', courseId: 'ingles', numero: 3, nombre: 'Verb Tenses & Conditionals', descripcion: 'Present, past, perfect tenses and conditionals (0, 1, 2, 3).', totalPreguntas: 15 },
      { id: 'ing-4', courseId: 'ingles', numero: 4, nombre: 'Prepositions & Phrasal Verbs', descripcion: 'Prepositions of time, place and high-frequency phrasal verbs.', totalPreguntas: 14 },
      { id: 'ing-5', courseId: 'ingles', numero: 5, nombre: 'Connectors & Sentence Structure', descripcion: 'Linking words: however, therefore, although, whereas.', totalPreguntas: 14 },
      { id: 'ing-6', courseId: 'ingles', numero: 6, nombre: 'Sentence Completion & Cloze Tests', descripcion: 'Pre-university admission style cloze passages.', totalPreguntas: 14 },
      { id: 'ing-7', courseId: 'ingles', numero: 7, nombre: 'Error Recognition & Syntax', descripcion: 'Subject-verb agreement and word order anomalies.', totalPreguntas: 14 },
      { id: 'ing-8', courseId: 'ingles', numero: 8, nombre: 'Synonyms and Antonyms in English', descripcion: 'Advanced academic lexicon and antonymous pairs.', totalPreguntas: 14 },
      { id: 'ing-9', courseId: 'ingles', numero: 9, nombre: 'Reading Comprehension', descripcion: 'Main idea, textual details, inferences and author purpose.', totalPreguntas: 15 },
      { id: 'ing-10', courseId: 'ingles', numero: 10, nombre: 'University Admission Exam Practice', descripcion: 'Authentic exam-style simulations in English language.', totalPreguntas: 15 },
    ]
  },
  {
    id: 'biologia',
    nombre: 'Biología',
    descripcion: 'Biomoléculas, citología eucariota, fotosíntesis, respiración celular, genética y anatomía.',
    icono: 'Dna',
    colorHex: '#48BB78',
    bgGradient: 'from-[#48BB78] to-[#68D391]',
    accentColor: 'bg-[#48BB78]',
    temas: [
      { id: 'bio-1', courseId: 'biologia', numero: 1, nombre: 'Bioelementos y Biomoléculas', descripcion: 'Glúcidos, lípidos, proteínas, ácidos nucleicos y agua.', totalPreguntas: 15 },
      { id: 'bio-2', courseId: 'biologia', numero: 2, nombre: 'Citología y Célula Eucariota', descripcion: 'Membrana plasmática, organelos y citoesqueleto.', totalPreguntas: 16 },
      { id: 'bio-3', courseId: 'biologia', numero: 3, nombre: 'Metabolismo Celular', descripcion: 'Fotosíntesis (fases luminosa y oscura) y Respiración celular.', totalPreguntas: 14 },
      { id: 'bio-4', courseId: 'biologia', numero: 4, nombre: 'Ciclo Celular y División', descripcion: 'Mitosis, Meiosis, espermatogénesis y ovogénesis.', totalPreguntas: 14 },
      { id: 'bio-5', courseId: 'biologia', numero: 5, nombre: 'Genética Mendeliana y Molecular', descripcion: 'Leyes de Mendel, herencia ligada al sexo y código genético.', totalPreguntas: 15 },
      { id: 'bio-6', courseId: 'biologia', numero: 6, nombre: 'Microbiología y Virología', descripcion: 'Bacterias, arqueas, virus y enfermedades infecciosas.', totalPreguntas: 12 },
      { id: 'bio-7', courseId: 'biologia', numero: 7, nombre: 'Histología Humana', descripcion: 'Tejido epitelial, conectivo, muscular y nervioso.', totalPreguntas: 12 },
      { id: 'bio-8', courseId: 'biologia', numero: 8, nombre: 'Sistemas del Cuerpo Humano', descripcion: 'Sistema circulatorio, digestivo, excretor e inmunitario.', totalPreguntas: 16 },
      { id: 'bio-9', courseId: 'biologia', numero: 9, nombre: 'Sistema Nervioso y Endocrino', descripcion: 'Neuronas, sinapsis, hormonas y homeostasis.', totalPreguntas: 14 },
      { id: 'bio-10', courseId: 'biologia', numero: 10, nombre: 'Ecología y Medio Ambiente', descripcion: 'Ecosistemas, cadenas tróficas, biomas y conservación.', totalPreguntas: 12 },
    ]
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // 1. LITERATURA
  {
    id: 'lit-q1',
    courseId: 'literatura',
    topicId: 'lit-1',
    topicName: 'Géneros y Figuras Literarias',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'En los versos "Érase un hombre a una nariz pegado / érase una nariz superlativa", ¿qué figura retórica resalta de manera predominante?',
    alternativas: [
      { id: 'A', text: 'Metáfora pura' },
      { id: 'B', text: 'Hipérbole' },
      { id: 'C', text: 'Asíndeton' },
      { id: 'D', text: 'Elipsis' },
      { id: 'E', text: 'Aliteración' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Francisco de Quevedo utiliza la hipérbole (exageración desmesurada de la realidad) para satirizar la fisonomía de su rival literario Luis de Góngora.'
  },
  {
    id: 'lit-q2',
    courseId: 'literatura',
    topicId: 'lit-4',
    topicName: 'Siglo de Oro Español',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'En "El ingenioso hidalgo don Quijote de la Mancha", el personaje que personifica el ideal caballeresco y el desinterés sublime es:',
    alternativas: [
      { id: 'A', text: 'Sancho Panza' },
      { id: 'B', text: 'El bachiller Sansón Carrasco' },
      { id: 'C', text: 'Alonso Quijano' },
      { id: 'D', text: 'El cura Pero Pérez' },
      { id: 'E', text: 'Maese Nicolás' }
    ],
    respuestaCorrecta: 'C',
    explicacion: 'Alonso Quijano es la identidad civil de Don Quijote, quien asume la investidura caballeresca para defender a los desamparados y luchar por ideales elevados.'
  },
  {
    id: 'lit-q3',
    courseId: 'literatura',
    topicId: 'lit-9',
    topicName: 'Indigenismo y Vanguardia Peruana',
    dificultad: 'avanzado',
    fuente: 'Estilo tipo admisión',
    pregunta: 'El poemario vanguardista de César Vallejo publicado en 1922 que transformó radicalmente el lenguaje lírico hispánico se titula:',
    alternativas: [
      { id: 'A', text: 'Los heraldos negros' },
      { id: 'B', text: 'Trilce' },
      { id: 'C', text: 'España, aparta de mí este cáliz' },
      { id: 'D', text: 'Poemas humanos' },
      { id: 'E', text: 'Paco Yunque' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Trilce (1922) representa el punto culminante de la vanguardia poética en castellano, desmontando las reglas ortográficas y sintácticas clásicas.'
  },

  // 2. PSICOLOGÍA
  {
    id: 'psi-q1',
    courseId: 'psicologia',
    topicId: 'psi-1',
    topicName: 'Historia y Escuelas Psicológicas',
    dificultad: 'basico',
    fuente: 'Estilo tipo admisión',
    pregunta: 'Wilhelm Wundt fundó en 1879 el primer laboratorio de psicología experimental en Leipzig (Alemania), inaugurando la escuela conocida como:',
    alternativas: [
      { id: 'A', text: 'Conductismo' },
      { id: 'B', text: 'Funcionalismo' },
      { id: 'C', text: 'Estructuralismo' },
      { id: 'D', text: 'Psicoanálisis' },
      { id: 'E', text: 'Gestalt' }
    ],
    respuestaCorrecta: 'C',
    explicacion: 'El Estructuralismo, fundado por Wundt y difundido por Titchener, se enfocó en descomponer la estructura de la mente consciente mediante la introspección experimental.'
  },
  {
    id: 'psi-q2',
    courseId: 'psicologia',
    topicId: 'psi-8',
    topicName: 'Aprendizaje y Condicionamiento',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'En el condicionamiento operante, cuando una conducta aumenta su frecuencia porque permite retirar o evitar un estímulo desagradable, se ha aplicado un:',
    alternativas: [
      { id: 'A', text: 'Reforzamiento positivo' },
      { id: 'B', text: 'Reforzamiento negativo' },
      { id: 'C', text: 'Castigo positivo' },
      { id: 'D', text: 'Castigo negativo' },
      { id: 'E', text: 'Extinción vicaria' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'El reforzamiento negativo fortalece o mantiene la respuesta a través del retiro o prevención de una consecuencia aversiva o molesta.'
  },

  // 3. GEOGRAFÍA
  {
    id: 'geo-q1',
    courseId: 'geografia',
    topicId: 'geo-6',
    topicName: 'Las 8 Regiones Naturales del Perú',
    dificultad: 'basico',
    fuente: 'Estilo tipo admisión',
    pregunta: 'De acuerdo con la clasificación geográfica de Javier Pulgar Vidal, la región ubicada entre los 2300 y 3500 m.s.n.m., con clima templado seco y considerada despensa agrícola, es la región:',
    alternativas: [
      { id: 'A', text: 'Yunga' },
      { id: 'B', text: 'Quechua' },
      { id: 'C', text: 'Suni' },
      { id: 'D', text: 'Puna' },
      { id: 'E', text: 'Janca' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'La región Quechua (2300 - 3500 msnm) goza de clima templado y propicio para la producción de maíz, papa, hortalizas y frutales andinos.'
  },
  {
    id: 'geo-q2',
    courseId: 'geografia',
    topicId: 'geo-5',
    topicName: 'Relieve Peruano (Costa, Sierra y Selva)',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'Las extensiones planas de origen aluvial en la costa peruana que poseen suelos fértiles y requieren proyectos de irrigación se denominan:',
    alternativas: [
      { id: 'A', text: 'Tablazos' },
      { id: 'B', text: 'Pampas' },
      { id: 'C', text: 'Esteros' },
      { id: 'D', text: 'Lomas' },
      { id: 'E', text: 'Albuferas' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Las pampas costeras son llanuras de sedimentos fluviales que se convierten en emporios agroexportadores mediante irrigaciones como Chavimochic u Olmos.'
  },

  // 4. RAZONAMIENTO VERBAL
  {
    id: 'rv-q1',
    courseId: 'razonamiento-verbal',
    topicId: 'rv-1',
    topicName: 'Sinonimia y Antonimia Contextual',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'En la expresión "El expositor ofreció una argumentación MEDULAR que despejó cualquier duda del jurado", el término en mayúsculas equivale a:',
    alternativas: [
      { id: 'A', text: 'Secundaria' },
      { id: 'B', text: 'Fundamental' },
      { id: 'C', text: 'Ambivalente' },
      { id: 'D', text: 'Superflua' },
      { id: 'E', text: 'Inverosímil' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'En sentido contextual, "medular" refiere a lo primordial, sustancial o fundamental de una tesis o propuesta.'
  },
  {
    id: 'rv-q2',
    courseId: 'razonamiento-verbal',
    topicId: 'rv-3',
    topicName: 'Conectores Lógicos y Marcadores',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'Elija los conectores adecuados: "El postulante repasó los temas con disciplina, _______ no obtuvo la vacante en el primer intento; _______, continuó entrenando con entusiasmo."',
    alternativas: [
      { id: 'A', text: 'por ello — en consecuencia' },
      { id: 'B', text: 'sin embargo — no obstante' },
      { id: 'C', text: 'ya que — además' },
      { id: 'D', text: 'porque — luego' },
      { id: 'E', text: 'dado que — por lo tanto' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Ambos nexos ("sin embargo" y "no obstante") cumplen una función adversativa contrastando esfuerzos frente a resultados y la perseverancia posterior.'
  },

  // 5. CÍVICA
  {
    id: 'civ-q1',
    courseId: 'civica',
    topicId: 'civ-2',
    topicName: 'Garantías Constitucionales',
    dificultad: 'basico',
    fuente: 'Estilo tipo admisión',
    pregunta: 'La garantía constitucional que procede ante la vulneración o amenaza de la libertad individual y los derechos conexos a ella es el:',
    alternativas: [
      { id: 'A', text: 'Habeas Data' },
      { id: 'B', text: 'Habeas Corpus' },
      { id: 'C', text: 'Acción de Amparo' },
      { id: 'D', text: 'Acción Popular' },
      { id: 'E', text: 'Acción de Cumplimiento' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'El Habeas Corpus tutela de forma directa la libertad personal, integridad física y el libre tránsito ante detenciones o apremios indebidos.'
  },
  {
    id: 'civ-q2',
    courseId: 'civica',
    topicId: 'civ-7',
    topicName: 'Organismos Constitucionales Autónomos',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: '¿Cuál es el organismo constitucional autónomo cuya función primordial según la Constitución es preservar la estabilidad monetaria nacional?',
    alternativas: [
      { id: 'A', text: 'Superintendencia de Banca y Seguros (SBS)' },
      { id: 'B', text: 'Banco Central de Reserva del Perú (BCRP)' },
      { id: 'C', text: 'Ministerio de Economía y Finanzas (MEF)' },
      { id: 'D', text: 'Contraloría General de la República' },
      { id: 'E', text: 'Superintendencia de Mercado de Valores (SMV)' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'El Banco Central de Reserva del Perú (BCRP) tiene el mandato expreso de regular la moneda y el crédito financiero para mantener baja y controlada la inflación.'
  },

  // 6. FILOSOFÍA
  {
    id: 'fil-q1',
    courseId: 'filosofia',
    topicId: 'fil-2',
    topicName: 'Filosofía Antigua: Presocráticos y Sócrates',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'El método socrático orientado a guiar al discípulo para que descubra la verdad por sí mismo mediante el diálogo y preguntas sistemáticas es:',
    alternativas: [
      { id: 'A', text: 'La mayéutica' },
      { id: 'B', text: 'La duda hiperbólica' },
      { id: 'C', text: 'La hermenéutica' },
      { id: 'D', text: 'La fenomenología' },
      { id: 'E', text: 'La dialéctica hegeliana' }
    ],
    respuestaCorrecta: 'A',
    explicacion: 'La mayéutica (del griego para parir o dar a luz) simboliza el alumbramiento reflexivo de nociones morales universales a través del diálogo socrático.'
  },
  {
    id: 'fil-q2',
    courseId: 'filosofia',
    topicId: 'fil-5',
    topicName: 'Racionalismo y Empirismo Moderno',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'Para René Descartes, el principio fundamental e indubitable alcanzado tras el ejercicio de la duda metódica se enuncia como:',
    alternativas: [
      { id: 'A', text: '"El hombre es la medida de todas las cosas"' },
      { id: 'B', text: '"Pienso, luego existo" (Cogito, ergo sum)' },
      { id: 'C', text: '"La mente es una tabla rasa"' },
      { id: 'D', text: '"Nada hay en el intelecto que no haya estado en los sentidos"' },
      { id: 'E', text: '"Solo sé que nada sé"' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Descartes determinó que mientras dudaba de todas las percepciones, el acto mismo del pensamiento demostraba irrebatiblemente su propia existencia como sustancia pensante.'
  },

  // 7. INGLÉS
  {
    id: 'ing-q1',
    courseId: 'ingles',
    topicId: 'ing-2',
    topicName: 'Grammar: Parts of Speech & Modals',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'Choose the correct verb form: "Neither the teacher nor the students _______ present during yesterday\'s lecture."',
    alternativas: [
      { id: 'A', text: 'was' },
      { id: 'B', text: 'were' },
      { id: 'C', text: 'is' },
      { id: 'D', text: 'are' },
      { id: 'E', text: 'have been' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'With the correlative structure "neither... nor", the verb agrees with the closer subject ("the students" = plural past tense -> "were").'
  },
  {
    id: 'ing-q2',
    courseId: 'ingles',
    topicId: 'ing-5',
    topicName: 'Connectors & Sentence Structure',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: 'Select the connector that best expresses concession: "_______ the torrential rain, the researchers concluded the Andean environmental study."',
    alternativas: [
      { id: 'A', text: 'Although' },
      { id: 'B', text: 'Even though' },
      { id: 'C', text: 'In spite of' },
      { id: 'D', text: 'Therefore' },
      { id: 'E', text: 'Because' }
    ],
    respuestaCorrecta: 'C',
    explicacion: '"In spite of" is followed by a noun phrase ("the torrential rain") to introduce a contrast or concession, whereas "although" requires a full clause.'
  },

  // 8. BIOLOGÍA
  {
    id: 'bio-q1',
    courseId: 'biologia',
    topicId: 'bio-2',
    topicName: 'Citología y Célula Eucariota',
    dificultad: 'intermedio',
    fuente: 'Estilo tipo admisión',
    pregunta: '¿Cuál es la organela celular responsable de la síntesis de fosfolípidos y esteroides, así como de la detoxificación celular?',
    alternativas: [
      { id: 'A', text: 'Retículo endoplasmático rugoso' },
      { id: 'B', text: 'Aparato de Golgi' },
      { id: 'C', text: 'Retículo endoplasmático liso' },
      { id: 'D', text: 'Peroxisoma' },
      { id: 'E', text: 'Lisosoma' }
    ],
    respuestaCorrecta: 'C',
    explicacion: 'El Retículo Endoplasmático Liso (REL) participa en la síntesis de lípidos membranosos y esteroides, además de degradar sustancias tóxicas en los hepatocitos.'
  },
  {
    id: 'bio-q2',
    courseId: 'biologia',
    topicId: 'bio-3',
    topicName: 'Metabolismo Celular',
    dificultad: 'avanzado',
    fuente: 'Estilo tipo admisión',
    pregunta: 'Durante la etapa fotoquímica o fase luminosa de la fotosíntesis, el oxígeno molecular (O₂) liberado al ambiente proviene de:',
    alternativas: [
      { id: 'A', text: 'La fijación del CO₂' },
      { id: 'B', text: 'La fotólisis del H₂O' },
      { id: 'C', text: 'La reducción del NADP+' },
      { id: 'D', text: 'La hidrólisis del ATP' },
      { id: 'E', text: 'El ciclo de Calvin-Benson' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'En el fotosistema II, la fotólisis de las moléculas de agua produce electrones para la cadena fotosintética, liberando protones e iones de oxígeno que forman O₂.'
  }
];

export const LEVEL_THRESHOLDS = [
  { nivel: 1, titulo: 'Aspirante', xpMinimo: 0, xpMaximo: 200 },
  { nivel: 2, titulo: 'Explorador', xpMinimo: 200, xpMaximo: 600 },
  { nivel: 3, titulo: 'Constante', xpMinimo: 600, xpMaximo: 1300 },
  { nivel: 4, titulo: 'Competidor', xpMinimo: 1300, xpMaximo: 2400 },
  { nivel: 5, titulo: 'Experto', xpMinimo: 2400, xpMaximo: 4000 },
  { nivel: 6, titulo: 'Maestro', xpMinimo: 4000, xpMaximo: 6500 },
  { nivel: 7, titulo: 'Leyenda Chuplingo', xpMinimo: 6500, xpMaximo: 12000 },
];