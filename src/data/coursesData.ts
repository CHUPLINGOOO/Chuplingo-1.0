import { Course, CourseId, Question } from '../types/chuplingo';

export const COURSES: Course[] = [
  {
    id: 'literatura',
    nombre: 'Literatura',
    descripcion: 'Explora la riqueza literaria hispanohablante, figuras retóricas, corrientes y grandes autores.',
    icono: 'BookOpen',
    colorHex: '#F05C54',
    bgGradient: 'from-[#F05C54] to-[#FF7B74]',
    accentColor: 'bg-[#F05C54]',
    temas: [
      { id: 'lit-1', courseId: 'literatura', numero: 1, nombre: 'Géneros y Figuras Literarias', descripcion: 'Metáfora, hipérbole, anáfora y géneros lírico, épico y dramático.', totalPreguntas: 15 },
      { id: 'lit-2', courseId: 'literatura', numero: 2, nombre: 'Literatura Griega y Latina', descripcion: 'Homero, Ilíada, Odisea, Sófocles y Virgilio.', totalPreguntas: 12 },
      { id: 'lit-3', courseId: 'literatura', numero: 3, nombre: 'Literatura Medieval y Renacimiento', descripcion: 'Cantar de Mio Cid, Dante Alighieri y Shakespeare.', totalPreguntas: 12 },
      { id: 'lit-4', courseId: 'literatura', numero: 4, nombre: 'Siglo de Oro Español', descripcion: 'Garcilaso, Cervantes, Don Quijote, Calderón de la Barca y Góngora.', totalPreguntas: 14 },
      { id: 'lit-5', courseId: 'literatura', numero: 5, nombre: 'Romanticismo y Realismo', descripcion: 'Bécquer, Víctor Hugo, Balzac, Fiódor Dostoievski.', totalPreguntas: 12 },
      { id: 'lit-6', courseId: 'literatura', numero: 6, nombre: 'Generación del 98 y del 27', descripcion: 'Unamuno, Antonio Machado, Federico García Lorca.', totalPreguntas: 10 },
      { id: 'lit-7', courseId: 'literatura', numero: 7, nombre: 'Literatura Peruana Prehispánica y Colonial', descripcion: 'Ollantay, Inca Garcilaso de la Vega, Amarilis.', totalPreguntas: 12 },
      { id: 'lit-8', courseId: 'literatura', numero: 8, nombre: 'Costumbrismo y Romanticismo Peruano', descripcion: 'Felipe Pardo y Aliaga, Manuel Ascencio Segura, Ricardo Palma.', totalPreguntas: 12 },
      { id: 'lit-9', courseId: 'literatura', numero: 9, nombre: 'Indigenismo y Vanguardismo Peruano', descripcion: 'César Vallejo, José María Arguedas, Ciro Alegría.', totalPreguntas: 15 },
      { id: 'lit-10', courseId: 'literatura', numero: 10, nombre: 'El Boom Latinoamericano', descripcion: 'Mario Vargas Llosa, Gabriel García Márquez, Julio Cortázar.', totalPreguntas: 14 },
    ]
  },
  {
    id: 'biologia',
    nombre: 'Biología',
    descripcion: 'Descubre los misterios de la vida celular, genética, anatomía humana y ecología.',
    icono: 'Dna',
    colorHex: '#48BB78',
    bgGradient: 'from-[#48BB78] to-[#68D391]',
    accentColor: 'bg-[#48BB78]',
    temas: [
      { id: 'bio-1', courseId: 'biologia', numero: 1, nombre: 'Bioelementos y Biomoléculas', descripcion: 'Glúcidos, lípidos, proteínas, ácidos nucleicos y agua.', totalPreguntas: 15 },
      { id: 'bio-2', courseId: 'biologia', numero: 2, nombre: 'Citología y Célula Eucariota', descripcion: 'Membrana, organelos, núcleo y citoesqueleto.', totalPreguntas: 16 },
      { id: 'bio-3', courseId: 'biologia', numero: 3, nombre: 'Metabolismo Celular', descripcion: 'Fotosíntesis (fase luminosa y oscura) y Respiración celular (Glucólisis, Krebs).', totalPreguntas: 14 },
      { id: 'bio-4', courseId: 'biologia', numero: 4, nombre: 'Ciclo Celular y División', descripcion: 'Mitosis, Meiosis, espermatogénesis y ovogénesis.', totalPreguntas: 14 },
      { id: 'bio-5', courseId: 'biologia', numero: 5, nombre: 'Genética Mendeliana y Molecular', descripcion: 'Leyes de Mendel, herencia ligada al sexo y código genético.', totalPreguntas: 15 },
      { id: 'bio-6', courseId: 'biologia', numero: 6, nombre: 'Microbiología y Virología', descripcion: 'Bacterias, arqueas, virus y enfermedades infecciosas.', totalPreguntas: 12 },
      { id: 'bio-7', courseId: 'biologia', numero: 7, nombre: 'Histología Humana', descripcion: 'Tejido epitelial, conectivo, muscular y nervioso.', totalPreguntas: 12 },
      { id: 'bio-8', courseId: 'biologia', numero: 8, nombre: 'Sistemas del Cuerpo Humano', descripcion: 'Sistema circulatorio, digestivo, excretor e inmunitario.', totalPreguntas: 16 },
      { id: 'bio-9', courseId: 'biologia', numero: 9, nombre: 'Sistema Nervioso y Endocrino', descripcion: 'Neuronas, sinapsis, hormonas y homeostasis.', totalPreguntas: 14 },
      { id: 'bio-10', courseId: 'biologia', numero: 10, nombre: 'Ecología y Medio Ambiente', descripcion: 'Ecosistemas, cadenas tróficas, biomas y conservación.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'psicologia',
    nombre: 'Psicología',
    descripcion: 'Comprende los procesos cognitivos, afectivos, conductuales y el desarrollo humano.',
    icono: 'Brain',
    colorHex: '#7354D9',
    bgGradient: 'from-[#7354D9] to-[#9176EA]',
    accentColor: 'bg-[#7354D9]',
    temas: [
      { id: 'psi-1', courseId: 'psicologia', numero: 1, nombre: 'Historia y Escuelas Psicológicas', descripcion: 'Estructuralismo, Conductismo, Psicoanálisis, Gestalt y Humanismo.', totalPreguntas: 12 },
      { id: 'psi-2', courseId: 'psicologia', numero: 2, nombre: 'Bases Biológicas de la Conducta', descripcion: 'Cerebro, hemisferios, lóbulos cerebrales y sistema límbico.', totalPreguntas: 14 },
      { id: 'psi-3', courseId: 'psicologia', numero: 3, nombre: 'Sensación y Percepción', descripcion: 'Umbrales sensoriales, leyes de la Gestalt e ilusiones perceptivas.', totalPreguntas: 12 },
      { id: 'psi-4', courseId: 'psicologia', numero: 4, nombre: 'Memoria y Olvido', descripcion: 'Sensorial, corto y largo plazo, causas del olvido y anomalías.', totalPreguntas: 12 },
      { id: 'psi-5', courseId: 'psicologia', numero: 5, nombre: 'Pensamiento y Lenguaje', descripcion: 'Conceptos, razonamiento deductivo e inductivo, funciones del lenguaje.', totalPreguntas: 12 },
      { id: 'psi-6', courseId: 'psicologia', numero: 6, nombre: 'Inteligencia y Teorías', descripcion: 'Cociente intelectual, inteligencias múltiples de Gardner y Goleman.', totalPreguntas: 12 },
      { id: 'psi-7', courseId: 'psicologia', numero: 7, nombre: 'Afectividad y Motivación', descripcion: 'Emociones, sentimientos, pasiones y pirámide de Maslow.', totalPreguntas: 14 },
      { id: 'psi-8', courseId: 'psicologia', numero: 8, nombre: 'Aprendizaje y Condicionamiento', descripcion: 'Clásico (Pavlov), Operante (Skinner) y Vicario (Bandura).', totalPreguntas: 14 },
      { id: 'psi-9', courseId: 'psicologia', numero: 9, nombre: 'Desarrollo Humano', descripcion: 'Etapas de Piaget y desarrollo psicosocial de Erikson.', totalPreguntas: 14 },
      { id: 'psi-10', courseId: 'psicologia', numero: 10, nombre: 'Personalidad y Mecanismos de Defensa', descripcion: 'Teorías tipológicas, psicoanálisis del Yo, Ello y Superyó.', totalPreguntas: 14 },
    ]
  },
  {
    id: 'geografia',
    nombre: 'Geografía',
    descripcion: 'Espacio geográfico, geomorfología, hidrografía, climatología y geografía peruana.',
    icono: 'Globe',
    colorHex: '#12B7E8',
    bgGradient: 'from-[#12B7E8] to-[#47CDF6]',
    accentColor: 'bg-[#12B7E8]',
    temas: [
      { id: 'geo-1', courseId: 'geografia', numero: 1, nombre: 'Geodesia y Cartografía', descripcion: 'Líneas imaginarias, coordenadas, escalas y proyecciones.', totalPreguntas: 12 },
      { id: 'geo-2', courseId: 'geografia', numero: 2, nombre: 'Geodinámica Interna y Externa', descripcion: 'Tectónica de placas, vulcanismo, sismicidad y meteorización.', totalPreguntas: 14 },
      { id: 'geo-3', courseId: 'geografia', numero: 3, nombre: 'Atmósfera y Climatología', descripcion: 'Capas atmosféricas, efecto invernadero, factores del clima.', totalPreguntas: 14 },
      { id: 'geo-4', courseId: 'geografia', numero: 4, nombre: 'Hidrografía Continental y Oceánica', descripcion: 'Océanos, corrientes marinas, ríos, lagos y cuencas.', totalPreguntas: 12 },
      { id: 'geo-5', courseId: 'geografia', numero: 5, nombre: 'Relieve Peruano (Costa, Sierra y Selva)', descripcion: 'Pampas, valles, cordilleras, mesetas y pongos.', totalPreguntas: 15 },
      { id: 'geo-6', courseId: 'geografia', numero: 6, nombre: 'Las 8 Regiones Naturales de Pulgar Vidal', descripcion: 'Chala, Yunga, Quechua, Suni, Puna, Janca, Rupa Rupa y Omagua.', totalPreguntas: 16 },
      { id: 'geo-7', courseId: 'geografia', numero: 7, nombre: 'Las 11 Ecorregiones de Antonio Brack', descripcion: 'Mar frío, mar tropical, serranía esteparia, puna y sabana.', totalPreguntas: 14 },
      { id: 'geo-8', courseId: 'geografia', numero: 8, nombre: 'Demografía y Población', descripcion: 'Tasa de natalidad, migración, densidad poblacional y censos.', totalPreguntas: 12 },
      { id: 'geo-9', courseId: 'geografia', numero: 9, nombre: 'Actividades Económicas y Recursos', descripcion: 'Minería, agricultura, pesca, industria y transporte.', totalPreguntas: 12 },
      { id: 'geo-10', courseId: 'geografia', numero: 10, nombre: 'Áreas Naturales Protegidas y Geopolítica', descripcion: 'Parques, reservas y santuarios nacionales en el Perú.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'razonamiento-verbal',
    nombre: 'Razonamiento Verbal',
    descripcion: 'Comprensión de lectura, sinonimia, antonimia, analogías y conectores lógicos.',
    icono: 'SpellCheck',
    colorHex: '#FF9418',
    bgGradient: 'from-[#FF9418] to-[#FFAB4A]',
    accentColor: 'bg-[#FF9418]',
    temas: [
      { id: 'rv-1', courseId: 'razonamiento-verbal', numero: 1, nombre: 'Sinonimia y Antonimia Contextual', descripcion: 'Significado denotativo y connotativo en oraciones.', totalPreguntas: 15 },
      { id: 'rv-2', courseId: 'razonamiento-verbal', numero: 2, nombre: 'Analogías Verbales', descripcion: 'Relaciones lógicas de causa-efecto, parte-todo y especie-género.', totalPreguntas: 15 },
      { id: 'rv-3', courseId: 'razonamiento-verbal', numero: 3, nombre: 'Conectores Lógicos y Marcadores', descripcion: 'Adversativos, consecutivos, causales y concesivos.', totalPreguntas: 15 },
      { id: 'rv-4', courseId: 'razonamiento-verbal', numero: 4, nombre: 'Oraciones Incompletas', descripcion: 'Coherencia gramatical, sentido contextual y precisión léxica.', totalPreguntas: 14 },
      { id: 'rv-5', courseId: 'razonamiento-verbal', numero: 5, nombre: 'Eliminación de Oraciones', descripcion: 'Criterios de redundancia, contradicción e impertinencia.', totalPreguntas: 14 },
      { id: 'rv-6', courseId: 'razonamiento-verbal', numero: 6, nombre: 'Plan de Redacción', descripcion: 'Estructuras deductivas, cronológicas y causa-efecto.', totalPreguntas: 14 },
      { id: 'rv-7', courseId: 'razonamiento-verbal', numero: 7, nombre: 'Jerarquía Textual (Tema y Tesis)', descripcion: 'Identificación de la idea principal y título del texto.', totalPreguntas: 15 },
      { id: 'rv-8', courseId: 'razonamiento-verbal', numero: 8, nombre: 'Inferencia y Extrapolación', descripcion: 'Deducciones lógicas a partir del texto y supuestos contrafácticos.', totalPreguntas: 15 },
      { id: 'rv-9', courseId: 'razonamiento-verbal', numero: 9, nombre: 'Textos Filosóficos y Científicos', descripcion: 'Estrategias de lectura crítica en temas complejos.', totalPreguntas: 12 },
      { id: 'rv-10', courseId: 'razonamiento-verbal', numero: 10, nombre: 'Textos Dialécticos y Continuos', descripcion: 'Contraste de posturas antagónicas y análisis de tablas.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'civica',
    nombre: 'Cívica',
    descripcion: 'Derechos humanos, Constitución Política, poderes del Estado y ciudadanía.',
    icono: 'Scale',
    colorHex: '#F5A623',
    bgGradient: 'from-[#F5A623] to-[#F7BC59]',
    accentColor: 'bg-[#F5A623]',
    temas: [
      { id: 'civ-1', courseId: 'civica', numero: 1, nombre: 'Derechos Humanos y Generaciones', descripcion: 'Declaración Universal, derechos de 1ra, 2da y 3ra generación.', totalPreguntas: 12 },
      { id: 'civ-2', courseId: 'civica', numero: 2, nombre: 'Garantías Constitucionales', descripcion: 'Habeas Corpus, Acción de Amparo, Habeas Data, Acción Popular.', totalPreguntas: 14 },
      { id: 'civ-3', courseId: 'civica', numero: 3, nombre: 'La Persona y la Familia', descripcion: 'Capacidad de goce y ejercicio, parentesco, patria potestad.', totalPreguntas: 12 },
      { id: 'civ-4', courseId: 'civica', numero: 4, nombre: 'Poder Legislativo (Congreso)', descripcion: 'Estructura unicameral, comisiones, juicio político e inmunidad.', totalPreguntas: 12 },
      { id: 'civ-5', courseId: 'civica', numero: 5, nombre: 'Poder Ejecutivo (Presidencia y Ministros)', descripcion: 'Atribuciones del presidente, Consejo de Ministros y decretos.', totalPreguntas: 12 },
      { id: 'civ-6', courseId: 'civica', numero: 6, nombre: 'Poder Judicial y Sistema de Justicia', descripcion: 'Corte Suprema, cortes superiores, juzgados y principios procesales.', totalPreguntas: 12 },
      { id: 'civ-7', courseId: 'civica', numero: 7, nombre: 'Organismos Constitucionales Autónomos', descripcion: 'TC, JNE, ONPE, RENIEC, SBS, BCR, Defensoría del Pueblo.', totalPreguntas: 15 },
      { id: 'civ-8', courseId: 'civica', numero: 8, nombre: 'Participación y Control Ciudadano', descripcion: 'Referéndum, iniciativa legislativa, revocatoria y rendición.', totalPreguntas: 12 },
      { id: 'civ-9', courseId: 'civica', numero: 9, nombre: 'Estructura del Estado Peruano', descripcion: 'Descentralización, gobiernos regionales y municipalidades.', totalPreguntas: 12 },
      { id: 'civ-10', courseId: 'civica', numero: 10, nombre: 'Organismos Internacionales', descripcion: 'ONU, OEA, CIDH, Pacto de San José y tratados limítrofes.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'filosofia',
    nombre: 'Filosofía',
    descripcion: 'Pensamiento crítico, ramas filosóficas, epistemología, ética y filosofía política.',
    icono: 'Sparkles',
    colorHex: '#5856D6',
    bgGradient: 'from-[#5856D6] to-[#7B79E8]',
    accentColor: 'bg-[#5856D6]',
    temas: [
      { id: 'fil-1', courseId: 'filosofia', numero: 1, nombre: 'Disciplinas y Origen de la Filosofía', descripcion: 'Ontología, gnoseología, axiología, ética y el paso del mito al logos.', totalPreguntas: 12 },
      { id: 'fil-2', courseId: 'filosofia', numero: 2, nombre: 'Filosofía Antigua: Presocráticos y Sócrates', descripcion: 'Arjé, Tales, Heráclito, Parménides, mayéutica e ironía.', totalPreguntas: 14 },
      { id: 'fil-3', courseId: 'filosofia', numero: 3, nombre: 'Platón y Aristóteles', descripcion: 'Mundo de las ideas, alegoría de la caverna, hilemorfismo y causas.', totalPreguntas: 15 },
      { id: 'fil-4', courseId: 'filosofia', numero: 4, nombre: 'Filosofía Helenístico-Romana y Medieval', descripcion: 'Estoicismo, epicureísmo, San Agustín y Santo Tomás de Aquino.', totalPreguntas: 12 },
      { id: 'fil-5', courseId: 'filosofia', numero: 5, nombre: 'Racionalismo y Empirismo Moderno', descripcion: 'Descartes (Duda metódica), Spinoza, Locke y David Hume.', totalPreguntas: 14 },
      { id: 'fil-6', courseId: 'filosofia', numero: 6, nombre: 'Criticismo Kantiano e Idealismo de Hegel', descripcion: 'Imperativo categórico, juicios sintéticos a priori y dialéctica.', totalPreguntas: 12 },
      { id: 'fil-7', courseId: 'filosofia', numero: 7, nombre: 'Filosofía del Siglo XIX (Marx y Nietzsche)', descripcion: 'Materialismo histórico, alineación, superhombre y nihilismo.', totalPreguntas: 14 },
      { id: 'fil-8', courseId: 'filosofia', numero: 8, nombre: 'Filosofía Contemporánea y Existencialismo', descripcion: 'Heidegger, Sartre, Camus y la condición humana.', totalPreguntas: 12 },
      { id: 'fil-9', courseId: 'filosofia', numero: 9, nombre: 'Epistemología y Filosofía de la Ciencia', descripcion: 'Popper (Falsacionismo), Kuhn (Paradigmas) y epistemología actual.', totalPreguntas: 12 },
      { id: 'fil-10', courseId: 'filosofia', numero: 10, nombre: 'Filosofía Latinoamericana y Peruana', descripcion: 'Alejandro Deustua, Manuel Vicente Villarán, Francisco Miró Quesada.', totalPreguntas: 12 },
    ]
  },
  {
    id: 'ingles',
    nombre: 'Inglés',
    descripcion: 'English grammar, vocabulary, reading comprehension and pre-university language skills.',
    icono: 'Languages',
    colorHex: '#007AFF',
    bgGradient: 'from-[#007AFF] to-[#3498FF]',
    accentColor: 'bg-[#007AFF]',
    temas: [
      { id: 'ing-1', courseId: 'ingles', numero: 1, nombre: 'Vocabulary', descripcion: 'Essential academic vocabulary, idioms, false friends and collocations.', totalPreguntas: 15 },
      { id: 'ing-2', courseId: 'ingles', numero: 2, nombre: 'Grammar & Parts of Speech', descripcion: 'Nouns, adjectives, adverbs, pronouns, modals and determiners.', totalPreguntas: 15 },
      { id: 'ing-3', courseId: 'ingles', numero: 3, nombre: 'Verb Tenses', descripcion: 'Present, Past, Future, Perfect aspects and conditional structures (0, 1, 2, 3).', totalPreguntas: 15 },
      { id: 'ing-4', courseId: 'ingles', numero: 4, nombre: 'Prepositions', descripcion: 'Prepositions of time, place, direction and dependent prepositions.', totalPreguntas: 14 },
      { id: 'ing-5', courseId: 'ingles', numero: 5, nombre: 'Connectors & Conjunctions', descripcion: 'Linking words: however, therefore, although, in spite of, moreover.', totalPreguntas: 14 },
      { id: 'ing-6', courseId: 'ingles', numero: 6, nombre: 'Sentence Completion', descripcion: 'Context clues, semantic coherence and pre-university cloze tests.', totalPreguntas: 14 },
      { id: 'ing-7', courseId: 'ingles', numero: 7, nombre: 'Error Recognition', descripcion: 'Spotting subject-verb agreement, syntax and morphological mistakes.', totalPreguntas: 14 },
      { id: 'ing-8', courseId: 'ingles', numero: 8, nombre: 'Synonyms and Antonyms', descripcion: 'Advanced lexical relations and contextual equivalence.', totalPreguntas: 14 },
      { id: 'ing-9', courseId: 'ingles', numero: 9, nombre: 'Reading Comprehension', descripcion: 'Main idea, supporting details, inferences and tone analysis in texts.', totalPreguntas: 15 },
      { id: 'ing-10', courseId: 'ingles', numero: 10, nombre: 'Mixed Practice & University Exam Style', descripcion: 'Comprehensive simulation with typical admission exam questions.', totalPreguntas: 15 },
    ]
  }
];

// Rich starter question bank for demo & real practice
export const INITIAL_QUESTIONS: Question[] = [
  // LITERATURA
  {
    id: 'lit-q1',
    courseId: 'literatura',
    topicId: 'lit-1',
    topicName: 'Géneros y Figuras Literarias',
    universidad: 'UNMSM',
    anio: 2023,
    dificultad: 'intermedio',
    pregunta: 'En los versos "Érase un hombre a una nariz pegado / érase una nariz superlativa", ¿qué figura retórica resalta de manera predominante?',
    alternativas: [
      { id: 'A', text: 'Metáfora pura' },
      { id: 'B', text: 'Hipérbole' },
      { id: 'C', text: 'Asíndeton' },
      { id: 'D', text: 'Elipsis' },
      { id: 'E', text: 'Aliteración' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Francisco de Quevedo utiliza la hipérbole (exageración desmesurada de la realidad) para satirizar la fisonomía de Luis de Góngora.'
  },
  {
    id: 'lit-q2',
    courseId: 'literatura',
    topicId: 'lit-1',
    topicName: 'Géneros y Figuras Literarias',
    universidad: 'UNI',
    anio: 2022,
    dificultad: 'facil',
    pregunta: 'El género literario caracterizado por estar escrito para ser representado en un escenario ante un público a través del diálogo de personajes es el:',
    alternativas: [
      { id: 'A', text: 'Lírico' },
      { id: 'B', text: 'Épico' },
      { id: 'C', text: 'Dramático' },
      { id: 'D', text: 'Narrativo' },
      { id: 'E', text: 'Ensayístico' }
    ],
    respuestaCorrecta: 'C',
    explicacion: 'El género dramático presenta los hechos mediante acotaciones y parlamentos directamente interpretados por actores frente a un auditorio.'
  },
  {
    id: 'lit-q3',
    courseId: 'literatura',
    topicId: 'lit-4',
    topicName: 'Siglo de Oro Español',
    universidad: 'UNMSM',
    anio: 2024,
    dificultad: 'intermedio',
    pregunta: 'En "El ingenioso hidalgo don Quijote de la Mancha", el personaje que representa el idealismo caballeresco y la locura lúcida es:',
    alternativas: [
      { id: 'A', text: 'Sancho Panza' },
      { id: 'B', text: 'El bachiller Sansón Carrasco' },
      { id: 'C', text: 'Alonso Quijano' },
      { id: 'D', text: 'El cura Pero Pérez' },
      { id: 'E', text: 'Maese Nicolás' }
    ],
    respuestaCorrecta: 'C',
    explicacion: 'Alonso Quijano es el nombre real de don Quijote, quien encarna el ideal de justicia y amor caballeresco.'
  },
  {
    id: 'lit-q4',
    courseId: 'literatura',
    topicId: 'lit-9',
    topicName: 'Indigenismo y Vanguardismo Peruano',
    universidad: 'PUCP',
    anio: 2023,
    dificultad: 'avanzado',
    pregunta: 'El poemario de César Vallejo publicado en 1922 que rompió radicalmente con la sintaxis tradicional y la métrica modernista se titula:',
    alternativas: [
      { id: 'A', text: 'Los heraldos negros' },
      { id: 'B', text: 'Trilce' },
      { id: 'C', text: 'España, aparta de mí este cáliz' },
      { id: 'D', text: 'Poemas humanos' },
      { id: 'E', text: 'Fabla salvaje' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Trilce (1922) es la cumbre de la vanguardia poética en lengua castellana, transformando la ortografía, el léxico y la estructura poética.'
  },

  // BIOLOGÍA
  {
    id: 'bio-q1',
    courseId: 'biologia',
    topicId: 'bio-2',
    topicName: 'Citología y Célula Eucariota',
    universidad: 'UNMSM',
    anio: 2023,
    dificultad: 'intermedio',
    pregunta: '¿Cuál es el organelo celular eucariota encargado de la síntesis de lípidos (fosfolípidos y esteroides) y de la detoxificación celular?',
    alternativas: [
      { id: 'A', text: 'Retículo endoplasmático rugoso' },
      { id: 'B', text: 'Aparato de Golgi' },
      { id: 'C', text: 'Retículo endoplasmático liso' },
      { id: 'D', text: 'Peroxisoma' },
      { id: 'E', text: 'Mitocondria' }
    ],
    respuestaCorrecta: 'C',
    explicacion: 'El Retículo Endoplasmático Liso (REL) sintetiza lípidos y metaboliza fármacos y sustancias tóxicas en hepatocitos.'
  },
  {
    id: 'bio-q2',
    courseId: 'biologia',
    topicId: 'bio-3',
    topicName: 'Metabolismo Celular',
    universidad: 'UNI',
    anio: 2024,
    dificultad: 'avanzado',
    pregunta: 'Durante la fotosíntesis, el oxígeno molecular (O₂) liberado al medio ambiente proviene directamente de:',
    alternativas: [
      { id: 'A', text: 'La fijación del dióxido de carbono (CO₂)' },
      { id: 'B', text: 'La fotólisis del agua (H₂O)' },
      { id: 'C', text: 'La reducción del NADP+' },
      { id: 'D', text: 'El ciclo de Calvin-Benson' },
      { id: 'E', text: 'La síntesis de ribulosa 1,5-bisfosfato' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'En la fase luminosa (reacción de Hill), el fotosistema II rompe moléculas de agua (fotólisis), liberando protones, electrones y O₂.'
  },
  {
    id: 'bio-q3',
    courseId: 'biologia',
    topicId: 'bio-1',
    topicName: 'Bioelementos y Biomoléculas',
    universidad: 'UNFV',
    anio: 2023,
    dificultad: 'facil',
    pregunta: 'El enlace covalente característico que une a los aminoácidos para formar cadenas polipeptídicas y proteínas se denomina:',
    alternativas: [
      { id: 'A', text: 'Enlace glucosídico' },
      { id: 'B', text: 'Enlace fosfodiéster' },
      { id: 'C', text: 'Enlace éster' },
      { id: 'D', text: 'Enlace peptídico' },
      { id: 'E', text: 'Puente de hidrógeno' }
    ],
    respuestaCorrecta: 'D',
    explicacion: 'El enlace peptídico se produce entre el grupo amino (-NH₂) de un aminoácido y el grupo carboxilo (-COOH) del contiguo, con pérdida de una molécula de agua.'
  },

  // PSICOLOGÍA
  {
    id: 'psi-q1',
    courseId: 'psicologia',
    topicId: 'psi-1',
    topicName: 'Historia y Escuelas Psicológicas',
    universidad: 'UNMSM',
    anio: 2023,
    dificultad: 'facil',
    pregunta: 'Wilhelm Wundt fundó en 1879 el primer laboratorio de psicología experimental en Leipzig (Alemania), sentando las bases de la escuela:',
    alternativas: [
      { id: 'A', text: 'Conductista' },
      { id: 'B', text: 'Funcionalista' },
      { id: 'C', text: 'Estructuralista' },
      { id: 'D', text: 'Psicoanalítica' },
      { id: 'E', text: 'Cognitivista' }
    ],
    respuestaCorrecta: 'C',
    explicacion: 'Wundt y Titchener desarrollaron el Estructuralismo, estudiando los elementos de la conciencia mediante la introspección experimental.'
  },
  {
    id: 'psi-q2',
    courseId: 'psicologia',
    topicId: 'psi-8',
    topicName: 'Aprendizaje y Condicionamiento',
    universidad: 'PUCP',
    anio: 2024,
    dificultad: 'intermedio',
    pregunta: 'Un estudiante que estudia con anticipación para evitar la ansiedad del examen final y no reprobar está experimentando un reforzamiento:',
    alternativas: [
      { id: 'A', text: 'Positivo' },
      { id: 'B', text: 'Negativo (escape o evitación)' },
      { id: 'C', text: 'Castigo positivo' },
      { id: 'D', text: 'Castigo negativo' },
      { id: 'E', text: 'Extinción vicaria' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'El reforzamiento negativo incrementa la conducta mediante la eliminación o prevención de un estímulo aversivo (la ansiedad o desaprobación).'
  },

  // GEOGRAFÍA
  {
    id: 'geo-q1',
    courseId: 'geografia',
    topicId: 'geo-6',
    topicName: 'Las 8 Regiones Naturales de Pulgar Vidal',
    universidad: 'UNMSM',
    anio: 2023,
    dificultad: 'facil',
    pregunta: 'Según la tesis de Javier Pulgar Vidal, la región natural ubicada entre los 2300 y 3500 m.s.n.m., caracterizada por tener el "mejor clima del Perú" y ser la despensa agrícola, es la región:',
    alternativas: [
      { id: 'A', text: 'Yunga' },
      { id: 'B', text: 'Quechua' },
      { id: 'C', text: 'Suni' },
      { id: 'D', text: 'Puna' },
      { id: 'E', text: 'Janca' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'La región Quechua (2300 - 3500 msnm) posee clima templado seco y es el área de mayor poblamiento andino e intensa actividad agrícola.'
  },
  {
    id: 'geo-q2',
    courseId: 'geografia',
    topicId: 'geo-5',
    topicName: 'Relieve Peruano (Costa, Sierra y Selva)',
    universidad: 'UNI',
    anio: 2024,
    dificultad: 'intermedio',
    pregunta: 'Las formas de relieve costero de origen eólico y marino compuestas por depósitos de arena con potencial agrícola mediante irrigación son:',
    alternativas: [
      { id: 'A', text: 'Tablazos' },
      { id: 'B', text: 'Pampas' },
      { id: 'C', text: 'Estepas' },
      { id: 'D', text: 'Mesetas' },
      { id: 'E', text: 'Esteros' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Las pampas son llanuras aluviales desérticas fértiles que requieren obras de irrigación como Olmos o Chavimochic para volverse altamente productivas.'
  },

  // RAZONAMIENTO VERBAL
  {
    id: 'rv-q1',
    courseId: 'razonamiento-verbal',
    topicId: 'rv-1',
    topicName: 'Sinonimia y Antonimia Contextual',
    universidad: 'UNMSM',
    anio: 2024,
    dificultad: 'intermedio',
    pregunta: 'En el enunciado: "El juez emitió un fallo PROTERVO que desató la indignación ciudadana", el término subrayado es sinónimo de:',
    alternativas: [
      { id: 'A', text: 'Perverso o inicuo' },
      { id: 'B', text: 'Inocuo o benigno' },
      { id: 'C', text: 'Prudente y sobrio' },
      { id: 'D', text: 'Laxante e indiferente' },
      { id: 'E', text: 'Improvisado y pueril' }
    ],
    respuestaCorrecta: 'A',
    explicacion: 'Protervo significa obstinado en la maldad, perverso, vil o ruin.'
  },
  {
    id: 'rv-q2',
    courseId: 'razonamiento-verbal',
    topicId: 'rv-3',
    topicName: 'Conectores Lógicos y Marcadores',
    universidad: 'PUCP',
    anio: 2023,
    dificultad: 'intermedio',
    pregunta: 'Completa con los conectores adecuados: "Estudió con ahínco durante todo el año, _______ no logró el puntaje esperado; _______, no se desanimó e insistió en su meta."',
    alternativas: [
      { id: 'A', text: 'porque — es decir' },
      { id: 'B', text: 'sin embargo — no obstante' },
      { id: 'C', text: 'por tanto — por consiguiente' },
      { id: 'D', text: 'ya que — además' },
      { id: 'E', text: 'aunque — luego' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'Ambos espacios requieren conectores adversativos de contraste ("sin embargo", "no obstante").'
  },

  // CÍVICA
  {
    id: 'civ-q1',
    courseId: 'civica',
    topicId: 'civ-2',
    topicName: 'Garantías Constitucionales',
    universidad: 'UNMSM',
    anio: 2023,
    dificultad: 'facil',
    pregunta: 'La garantía constitucional que protege la libertad individual y los derechos conexos ante una detención arbitraria se denomina:',
    alternativas: [
      { id: 'A', text: 'Acción de Amparo' },
      { id: 'B', text: 'Habeas Corpus' },
      { id: 'C', text: 'Habeas Data' },
      { id: 'D', text: 'Acción Popular' },
      { id: 'E', text: 'Acción de Cumplimiento' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'El Habeas Corpus procede ante el hecho u omisión de cualquier autoridad o particular que vulnera o amenaza la libertad personal o física.'
  },
  {
    id: 'civ-q2',
    courseId: 'civica',
    topicId: 'civ-7',
    topicName: 'Organismos Constitucionales Autónomos',
    universidad: 'UNI',
    anio: 2024,
    dificultad: 'intermedio',
    pregunta: '¿Cuál es el organismo constitucional autónomo encargado de preservar la estabilidad monetaria y regular la moneda y el crédito del sistema financiero en el Perú?',
    alternativas: [
      { id: 'A', text: 'Superintendencia de Banca y Seguros (SBS)' },
      { id: 'B', text: 'Banco Central de Reserva del Perú (BCRP)' },
      { id: 'C', text: 'Ministerio de Economía y Finanzas (MEF)' },
      { id: 'D', text: 'Contraloría General de la República' },
      { id: 'E', text: 'Superintendencia de Mercado de Valores (SMV)' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'El BCRP tiene como finalidad exclusiva defender la estabilidad monetaria mediante el control de la inflación y emisión de billetes.'
  },

  // FILOSOFÍA
  {
    id: 'fil-q1',
    courseId: 'filosofia',
    topicId: 'fil-2',
    topicName: 'Filosofía Antigua: Presocráticos y Sócrates',
    universidad: 'UNMSM',
    anio: 2023,
    dificultad: 'intermedio',
    pregunta: 'El método socrático consistente en formular preguntas continuas para ayudar al interlocutor a "dar a luz" la verdad mediante su propia razón es:',
    alternativas: [
      { id: 'A', text: 'La mayéutica' },
      { id: 'B', text: 'La dialéctica hegeliana' },
      { id: 'C', text: 'La duda metódica' },
      { id: 'D', text: 'La hermenéutica' },
      { id: 'E', text: 'La deducción trascendental' }
    ],
    respuestaCorrecta: 'A',
    explicacion: 'La mayéutica (del griego maieutiké, arte de las parteras) es el método con el que Sócrates facilitaba el alumbramiento de nociones universales.'
  },
  {
    id: 'fil-q2',
    courseId: 'filosofia',
    topicId: 'fil-5',
    topicName: 'Racionalismo y Empirismo Moderno',
    universidad: 'PUCP',
    anio: 2024,
    dificultad: 'intermedio',
    pregunta: 'La célebre máxima cartesiana "Cogito, ergo sum" (Pienso, luego existo) representa en la filosofía moderna:',
    alternativas: [
      { id: 'A', text: 'La primera verdad indubitable tras la duda metódica' },
      { id: 'B', text: 'Una afirmación empírica basada en los sentidos' },
      { id: 'C', text: 'Un dogma teológico inmutable' },
      { id: 'D', text: 'Una falacia formal de afirmación del consecuente' },
      { id: 'E', text: 'La prueba de la inexistencia material del mundo' }
    ],
    respuestaCorrecta: 'A',
    explicacion: 'René Descartes concluyó que aunque dude de todo, el acto mismo de dudar confirma indefectiblemente la existencia del sujeto pensante.'
  },

  // INGLÉS (8th course - full integration)
  {
    id: 'ing-q1',
    courseId: 'ingles',
    topicId: 'ing-2',
    topicName: 'Grammar & Parts of Speech',
    universidad: 'UNMSM',
    anio: 2024,
    dificultad: 'intermedio',
    pregunta: 'Choose the correct option: "Neither the professor nor the students _______ able to solve the equation yesterday."',
    alternativas: [
      { id: 'A', text: 'was' },
      { id: 'B', text: 'were' },
      { id: 'C', text: 'is' },
      { id: 'D', text: 'are' },
      { id: 'E', text: 'has been' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'With the correlative conjunction "neither... nor", the verb agrees in number with the closer subject ("the students" = plural past -> "were").'
  },
  {
    id: 'ing-q2',
    courseId: 'ingles',
    topicId: 'ing-3',
    topicName: 'Verb Tenses',
    universidad: 'UNI',
    anio: 2023,
    dificultad: 'intermedio',
    pregunta: 'Identify the grammatically correct conditional sentence:',
    alternativas: [
      { id: 'A', text: 'If she studied harder, she will pass the entrance exam.' },
      { id: 'B', text: 'If she had studied harder, she would have passed the entrance exam.' },
      { id: 'C', text: 'If she studies harder, she would pass the entrance exam.' },
      { id: 'D', text: 'If she would study harder, she passed the exam.' },
      { id: 'E', text: 'If she had studied harder, she would pass the exam.' }
    ],
    respuestaCorrecta: 'B',
    explicacion: 'The Third Conditional follows the structure: If + Past Perfect, would have + past participle (expressing an unreal condition in the past).'
  },
  {
    id: 'ing-q3',
    courseId: 'ingles',
    topicId: 'ing-1',
    topicName: 'Vocabulary',
    universidad: 'PUCP',
    anio: 2024,
    dificultad: 'facil',
    pregunta: 'In the sentence "The scientist made a REMARKABLE breakthrough in renewable energy", what is the closest synonym of the word in capital letters?',
    alternativas: [
      { id: 'A', text: 'Ordinary' },
      { id: 'B', text: 'Extraordinary' },
      { id: 'C', text: 'Dangerous' },
      { id: 'D', text: 'Doubtful' },
      { id: 'E', text: 'Tedious' }
    ],
    respuestaCorrecta: 'B',
    explicacion: '"Remarkable" means worthy of attention, extraordinary or impressive.'
  },
  {
    id: 'ing-q4',
    courseId: 'ingles',
    topicId: 'ing-5',
    topicName: 'Connectors & Conjunctions',
    universidad: 'UNMSM',
    anio: 2023,
    dificultad: 'intermedio',
    pregunta: 'Select the connector that best fits: "_______ the severe weather conditions, the researchers continued their expedition in the Andes."',
    alternativas: [
      { id: 'A', text: 'Although' },
      { id: 'B', text: 'Even though' },
      { id: 'C', text: 'In spite of' },
      { id: 'D', text: 'Because' },
      { id: 'E', text: 'Moreover' }
    ],
    respuestaCorrecta: 'C',
    explicacion: '"In spite of" is a prepositional phrase followed by a noun phrase ("the severe weather conditions") indicating concession.'
  }
];

export const LEVEL_THRESHOLDS = [
  { nivel: 1, titulo: 'Aspirante', xpMinimo: 0, xpMaximo: 200 },
  { nivel: 2, titulo: 'Explorador', xpMinimo: 200, xpMaximo: 600 },
  { nivel: 3, titulo: 'Constante', xpMinimo: 600, xpMaximo: 1300 },
  { nivel: 4, titulo: 'Competidor', xpMinimo: 1300, xpMaximo: 2400 },
  { nivel: 5, titulo: 'Experto', xpMinimo: 2400, xpMaximo: 4000 },
  { nivel: 6, titulo: 'Maestro', xpMinimo: 4000, xpMaximo: 6500 },
  { nivel: 7, titulo: 'Catedrático', xpMinimo: 6500, xpMaximo: 10000 },
  { nivel: 8, titulo: 'Leyenda Chuplingo', xpMinimo: 10000, xpMaximo: 20000 },
];