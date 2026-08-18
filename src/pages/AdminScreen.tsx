import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { CourseId, QuestionDifficulty } from '../types/chuplingo';
import { Shield, Plus, Upload, Trash2, Database, BarChart3, Check, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// CSV to JSON helper for question batch
function parseCSVToQuestions(csvText: string): any[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parser handling quotes
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let char of lines[i]) {
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));

    const obj: any = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });

    if (obj.course_id || obj.question || obj.pregunta) {
      rows.push(obj);
    }
  }

  return rows;
}

const AdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    allQuestions, 
    addQuestionToBank, 
    deleteQuestionFromBank, 
    importQuestionsBatch, 
    fetchQuestionsFromSupabase,
    getOverallStats 
  } = useChuplingo();

  const [activeTab, setActiveTab] = useState<'preguntas' | 'crear' | 'importar' | 'metricas'>('importar');
  const [filterCourse, setFilterCourse] = useState<CourseId | 'all'>('all');

  // Single Question Form
  const [courseId, setCourseId] = useState<CourseId>('literatura');
  const [topicId, setTopicId] = useState('lit-1');
  const [dificultad, setDificultad] = useState<QuestionDifficulty>('intermedio');
  const [pregunta, setPregunta] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [optE, setOptE] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [explicacion, setExplicacion] = useState('');
  const [fuente, setFuente] = useState('');

  // Bulk Importer State
  const [batchFormat, setBatchFormat] = useState<'json' | 'csv'>('json');
  const [batchRawText, setBatchRawText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim() || !optA || !optB || !optC || !optD || !optE) {
      toast.error('Completa el enunciado y las 5 alternativas');
      return;
    }

    await addQuestionToBank({
      courseId,
      topicId,
      dificultad,
      pregunta,
      fuente: fuente || 'Banco Oficial Chuplingo',
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

  const handleProcessBatch = async () => {
    if (!batchRawText.trim()) {
      toast.error('Pega el contenido JSON o CSV con las preguntas');
      return;
    }

    setIsImporting(true);
    try {
      let parsedArray: any[] = [];
      if (batchFormat === 'json') {
        parsedArray = JSON.parse(batchRawText);
      } else {
        parsedArray = parseCSVToQuestions(batchRawText);
      }

      const count = await importQuestionsBatch(parsedArray);
      if (count > 0) {
        setBatchRawText('');
        setActiveTab('preguntas');
      }
    } catch (e: any) {
      toast.error(`Error al analizar el formato: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const filteredList = filterCourse === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.courseId === filterCourse);

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Panel de Administración"
        subtitle="Gestor del banco de preguntas en Supabase"
        iconEmoji="🛡️"
        showBack={true}
        bgGradient="from-[#183153] to-[#254A7A]"
        rightAction={
          <button
            onClick={() => fetchQuestionsFromSupabase()}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
            title="Refrescar base de datos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        }
      />

      {/* Tabs */}
      <div className="px-4">
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center text-xs font-black">
          <button
            onClick={() => setActiveTab('importar')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'importar' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Importar 100
          </button>
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
        {/* Import Tab */}
        {activeTab === 'importar' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#183153] flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#F05C54]" />
                <span>Importador del Primer Lote (100 Preguntas)</span>
              </h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  onClick={() => setBatchFormat('json')}
                  className={`px-2 py-0.5 rounded ${batchFormat === 'json' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-500'}`}
                >
                  JSON
                </button>
                <button
                  onClick={() => setBatchFormat('csv')}
                  className={`px-2 py-0.5 rounded ${batchFormat === 'csv' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-500'}`}
                >
                  CSV
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Pega aquí el lote de 100 preguntas. Cada registro se validará e insertará directamente en la tabla <code>questions</code> de Supabase.
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-600">
              <strong className="block text-[#183153] mb-1">Columnas / Claves requeridas:</strong>
              <code>course_id, topic_id, difficulty, question, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, origin</code>
            </div>

            <textarea
              rows={9}
              value={batchRawText}
              onChange={(e) => setBatchRawText(e.target.value)}
              placeholder={
                batchFormat === 'json'
                  ? `[\n  {\n    "course_id": "literatura",\n    "topic_id": "lit-1",\n    "difficulty": "intermedio",\n    "question": "¿Enunciado...?",\n    "option_a": "Opción A",\n    "option_b": "Opción B",\n    "option_c": "Opción C",\n    "option_d": "Opción D",\n    "option_e": "Opción E",\n    "correct_answer": "A",\n    "explanation": "Explicación...",\n    "origin": "Admisión UNMSM"\n  }\n]`
                  : `course_id,topic_id,difficulty,question,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation,origin\nliteratura,lit-1,intermedio,"¿Enunciado...?","A","B","C","D","E",A,"Explicación...","UNMSM"`
              }
              className="w-full bg-slate-50 border rounded-2xl p-3 text-xs font-mono"
            />

            <button
              onClick={handleProcessBatch}
              disabled={isImporting}
              className="w-full py-4 rounded-2xl bg-[#183153] hover:bg-[#10223A] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isImporting ? 'Guardando en Supabase...' : 'Importar Lote a Supabase'}</span>
            </button>
          </div>
        )}

        {/* Bank List Tab */}
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
                      {q.courseId} • {q.topicName || q.topicId}
                    </span>
                    <button
                      onClick={() => deleteQuestionFromBank(q.id)}
                      className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

        {/* Create Single Tab */}
        {activeTab === 'crear' && (
          <form onSubmit={handleCreate} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h3 className="text-sm font-black text-[#183153]">Agregar Pregunta a Supabase</h3>

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
              <label className="text-[10px] font-black uppercase text-slate-500">Enunciado de la Pregunta</label>
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
              <label className="text-[10px] font-black uppercase text-slate-500">5 Alternativas (A - E)</label>
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
              <label className="text-[10px] font-black uppercase text-slate-500">Explicación Pedagógica</label>
              <textarea
                rows={2}
                placeholder="Por qué la alternativa elegida es la correcta..."
                value={explicacion}
                onChange={(e) => setExplicacion(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500">Origen / Examen</label>
              <input
                type="text"
                placeholder="Ej: UNMSM 2024-I"
                value={fuente}
                onChange={(e) => setFuente(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#67C66A] text-white font-black text-xs shadow-md mt-2"
            >
              Guardar Pregunta en Supabase
            </button>
          </form>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metricas' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h3 className="text-sm font-black text-[#183153]">Métricas de la Base de Datos</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-lg font-black text-[#183153] block">{allQuestions.length}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Preguntas Activas</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-lg font-black text-[#12B7E8] block">{stats.totalSessions}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Sesiones Guardadas</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-lg font-black text-[#67C66A] block">{stats.totalQuestions}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Respuestas Totales</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-lg font-black text-[#FF9418] block">{stats.overallAccuracy}%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Precisión Global</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;