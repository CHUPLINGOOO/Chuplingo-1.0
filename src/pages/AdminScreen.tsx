import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { CourseId, QuestionDifficulty, Question } from '../types/chuplingo';
import { Shield, Plus, Upload, Trash2, Edit2, Database, BarChart3, Check } from 'lucide-react';
import { toast } from 'sonner';

const AdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, allQuestions, addQuestionToBank, deleteQuestionFromBank, importQuestionsJSON, getOverallStats } = useChuplingo();

  const [activeTab, setActiveTab] = useState<'preguntas' | 'crear' | 'importar' | 'metricas'>('preguntas');
  const [filterCourse, setFilterCourse] = useState<CourseId | 'all'>('all');

  // New question form state
  const [courseId, setCourseId] = useState<CourseId>('literatura');
  const [topicId, setTopicId] = useState('lit-1');
  const [topicName, setTopicName] = useState('Géneros y Figuras Literarias');
  const [dificultad, setDificultad] = useState<QuestionDifficulty>('intermedio');
  const [pregunta, setPregunta] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [optE, setOptE] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [explicacion, setExplicacion] = useState('');
  const [jsonText, setJsonText] = useState('');

  const stats = getOverallStats();

  // Protect admin screen
  if (user.rol !== 'admin' && user.email !== 'admin@chuplingo.pe') {
    return (
      <div className="min-h-screen bg-[#F7F8FC] p-6 text-center flex flex-col items-center justify-center">
        <Shield className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-black text-[#183153]">Acceso Restringido</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Esta sección es exclusiva para el equipo administrativo de Chuplingo.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-5 px-5 py-2.5 bg-[#183153] text-white rounded-2xl text-xs font-black"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim() || !optA || !optB || !optC || !optD || !optE) {
      toast.error('Completa el enunciado y las 5 alternativas');
      return;
    }

    addQuestionToBank({
      courseId,
      topicId,
      topicName,
      dificultad,
      pregunta,
      fuente: 'Banco Chuplingo Oficial',
      alternativas: [
        { id: 'A', text: optA },
        { id: 'B', text: optB },
        { id: 'C', text: optC },
        { id: 'D', text: optD },
        { id: 'E', text: optE }
      ],
      respuestaCorrecta: correctAnswer,
      explicacion
    });

    setPregunta('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setOptE('');
    setExplicacion('');
    setActiveTab('preguntas');
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const count = importQuestionsJSON(parsed);
      if (count > 0) {
        setJsonText('');
        setActiveTab('preguntas');
      }
    } catch {
      toast.error('El formato JSON no es válido');
    }
  };

  const filteredList = filterCourse === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.courseId === filterCourse);

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Panel de Administración"
        subtitle="Gestión del banco de preguntas y métricas"
        iconEmoji="🛡️"
        showBack={true}
        bgGradient="from-[#183153] to-[#254A7A]"
      />

      {/* Tabs */}
      <div className="px-4">
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center text-xs font-black">
          <button
            onClick={() => setActiveTab('preguntas')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'preguntas' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Banco ({allQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('crear')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'crear' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            + Nueva
          </button>
          <button
            onClick={() => setActiveTab('importar')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'importar' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Importar
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'metricas' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Métricas
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 flex flex-col gap-3">
        {activeTab === 'preguntas' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterCourse('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  filterCourse === 'all' ? 'bg-[#183153] text-white' : 'bg-white text-slate-600 border'
                }`}
              >
                Todos ({allQuestions.length})
              </button>
              {COURSES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setFilterCourse(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                    filterCourse === c.id ? 'bg-[#183153] text-white' : 'bg-white text-slate-600 border'
                  }`}
                >
                  {c.nombre}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              {filteredList.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-[#183153]">
                      {q.courseId} • {q.topicName}
                    </span>
                    {q.id.startsWith('custom-') && (
                      <button
                        onClick={() => deleteQuestionFromBank(q.id)}
                        className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#183153] mt-1">{q.pregunta}</p>
                  <span className="text-[10px] text-emerald-600 font-black block mt-2">
                    Correcta: ({q.respuestaCorrecta})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'crear' && (
          <form onSubmit={handleCreate} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h3 className="text-sm font-black text-[#183153]">Agregar Pregunta a los 8 Cursos</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500">Curso</label>
                <select
                  value={courseId}
                  onChange={(e) => {
                    const c = e.target.value as CourseId;
                    setCourseId(c);
                    const courseObj = COURSES.find(item => item.id === c);
                    if (courseObj?.temas[0]) {
                      setTopicId(courseObj.temas[0].id);
                      setTopicName(courseObj.temas[0].nombre);
                    }
                  }}
                  className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-bold"
                >
                  {COURSES.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500">Dificultad</label>
                <select
                  value={dificultad}
                  onChange={(e) => setDificultad(e.target.value as QuestionDifficulty)}
                  className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-bold"
                >
                  <option value="basico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500">Enunciado</label>
              <textarea
                required
                rows={3}
                placeholder="Escribe la pregunta académica..."
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold"
              />
            </div>

            {/* Alternatives */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-500">Alternativas A - E</label>
              {[
                { id: 'A', val: optA, set: setOptA },
                { id: 'B', val: optB, set: setOptB },
                { id: 'C', val: optC, set: setOptC },
                { id: 'D', val: optD, set: setOptD },
                { id: 'E', val: optE, set: setOptE }
              ].map(opt => (
                <div key={opt.id} className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#183153] w-4">{opt.id}:</span>
                  <input
                    type="text"
                    required
                    value={opt.val}
                    onChange={(e) => opt.set(e.target.value)}
                    placeholder={`Opción ${opt.id}`}
                    className="flex-1 bg-slate-50 border rounded-xl p-2 text-xs font-bold"
                  />
                  <input
                    type="radio"
                    name="correctAlt"
                    checked={correctAnswer === opt.id}
                    onChange={() => setCorrectAnswer(opt.id as 'A' | 'B' | 'C' | 'D' | 'E')}
                    className="w-4 h-4 text-emerald-600"
                    title={`Marcar ${opt.id} como correcta`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500">Explicación pedagógica</label>
              <textarea
                rows={2}
                placeholder="Explica por qué la alternativa es correcta..."
                value={explicacion}
                onChange={(e) => setExplicacion(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#67C66A] text-white font-black text-xs shadow-md mt-2"
            >
              Publicar Pregunta en el Banco
            </button>
          </form>
        )}

        {activeTab === 'importar' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h3 className="text-sm font-black text-[#183153]">Importación Masiva (JSON)</h3>
            <p className="text-xs text-slate-500">
              Pega un arreglo de objetos Question con courseId, alternativas (A-E) y respuesta correcta.
            </p>
            <textarea
              rows={8}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="[ { ... } ]"
              className="w-full bg-slate-50 border rounded-2xl p-3 text-xs font-mono"
            />
            <button
              onClick={handleImportJSON}
              className="w-full py-3.5 rounded-2xl bg-[#183153] text-white font-black text-xs shadow-md flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Procesar e Importar JSON</span>
            </button>
          </div>
        )}

        {activeTab === 'metricas' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h3 className="text-sm font-black text-[#183153]">Métricas de la Plataforma</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-lg font-black text-[#183153] block">{allQuestions.length}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Preguntas Totales</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-lg font-black text-[#12B7E8] block">{stats.totalSessions}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Sesiones Registradas</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-lg font-black text-[#67C66A] block">{stats.totalQuestions}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Intentos Respondidos</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-lg font-black text-[#FF9418] block">{stats.overallAccuracy}%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Precisión Promedio</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;