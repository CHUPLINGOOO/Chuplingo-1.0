import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { CourseId, QuestionDifficulty, SubscriptionRequest } from '../types/chuplingo';
import { Shield, Plus, Upload, Trash2, Database, BarChart3, Check, FileSpreadsheet, RefreshCw, FileUp, Clock, X, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// CSV to JSON parser handling quoted lines
function parseCSVToQuestions(csvText: string): any[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').replace(/^\uFEFF/, ''));
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
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

    if (obj.course || obj.course_id || obj.question || obj.pregunta) {
      rows.push(obj);
    }
  }

  return rows;
}

const COURSE_NAME_MAP: Record<string, CourseId> = {
  'literatura': 'literatura',
  'psicología': 'psicologia',
  'psicologia': 'psicologia',
  'geografía': 'geografia',
  'geografia': 'geografia',
  'razonamiento verbal': 'razonamiento-verbal',
  'razonamiento-verbal': 'razonamiento-verbal',
  'cívica': 'civica',
  'civica': 'civica',
  'filosofía': 'filosofia',
  'filosofia': 'filosofia',
  'inglés': 'ingles',
  'ingles': 'ingles',
  'biología': 'biologia',
  'biologia': 'biologia'
};

const AdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    allQuestions, 
    addQuestionToBank, 
    deleteQuestionFromBank, 
    importQuestionsBatch, 
    fetchQuestionsFromSupabase,
    fetchAdminSubscriptionRequests,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
    getOverallStats 
  } = useChuplingo();

  const [activeTab, setActiveTab] = useState<'suscripciones' | 'preguntas' | 'crear' | 'importar' | 'metricas'>('suscripciones');
  const [filterCourse, setFilterCourse] = useState<CourseId | 'all'>('all');
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

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
  const [batchFormat, setBatchFormat] = useState<'json' | 'csv'>('csv');
  const [batchRawText, setBatchRawText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const stats = getOverallStats();

  const loadRequests = async () => {
    setIsLoadingRequests(true);
    const data = await fetchAdminSubscriptionRequests();
    setSubscriptionRequests(data);
    setIsLoadingRequests(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (req: SubscriptionRequest) => {
    const ok = await approveSubscriptionRequest(req.id, req.userId, req.plan, req.price);
    if (ok) {
      loadRequests();
    }
  };

  const handleReject = async (req: SubscriptionRequest) => {
    const reason = window.prompt('Motivo del rechazo (opcional):', 'Comprobante no coincide con abono en Yape');
    if (reason !== null) {
      const ok = await rejectSubscriptionRequest(req.id, reason);
      if (ok) {
        loadRequests();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setBatchRawText(text);
        if (file.name.endsWith('.json')) {
          setBatchFormat('json');
        } else {
          setBatchFormat('csv');
        }
        toast.success(`Archivo "${file.name}" cargado listo para importar.`);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessBatch = async () => {
    if (!batchRawText.trim()) {
      toast.error('Pega o selecciona un archivo CSV o JSON con las preguntas');
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

      const mapped = parsedArray.map(item => {
        const rawCourse = (item.course || item.course_id || '').toLowerCase().trim();
        const normalizedCourseId = COURSE_NAME_MAP[rawCourse] || 'literatura';
        
        let diff = (item.difficulty || item.dificultad || 'intermedio').toLowerCase().trim();
        if (diff === 'básico' || diff === 'basico') diff = 'basico';
        else if (diff === 'avanzado') diff = 'avanzado';
        else diff = 'intermedio';

        return {
          id: item.id || undefined,
          course_id: normalizedCourseId,
          topic_id: item.topic || item.topic_id || 'Tema General',
          subtopic: item.subtopic || null,
          difficulty: diff,
          question_type: item.question_type || 'completar_enunciado',
          question: item.question || item.pregunta,
          option_a: item.option_a,
          option_b: item.option_b,
          option_c: item.option_c,
          option_d: item.option_d,
          option_e: item.option_e,
          correct_answer: (item.correct_answer || item.respuestaCorrecta || 'A').toUpperCase().trim(),
          explanation: item.explanation || item.explicacion || '',
          source_document: item.source_document || null,
          source_page: item.source_page || null,
          origin: item.origin || 'pregunta_generada_a_partir_del_contenido_fuente',
          official_exam_question: false,
          active: true
        };
      });

      const count = await importQuestionsBatch(mapped);
      if (count > 0) {
        setBatchRawText('');
        setActiveTab('preguntas');
      }
    } catch (e: any) {
      toast.error(`Error al procesar el lote: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

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

  const filteredList = filterCourse === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.courseId === filterCourse);

  const pendingRequests = subscriptionRequests.filter(r => r.status === 'pendiente');
  const pastRequests = subscriptionRequests.filter(r => r.status !== 'pendiente');

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Panel de Administración"
        subtitle="Gestión de suscripciones Yape y base de datos"
        iconEmoji="🛡️"
        showBack={true}
        bgGradient="from-[#183153] to-[#254A7A]"
        rightAction={
          <button
            onClick={() => {
              fetchQuestionsFromSupabase();
              loadRequests();
            }}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90"
            title="Refrescar base de datos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        }
      />

      {/* Tabs */}
      <div className="px-4">
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center text-[11px] font-black overflow-x-auto scrollbar-none gap-0.5">
          <button
            onClick={() => setActiveTab('suscripciones')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'suscripciones' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>Yape</span>
            {pendingRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F05C54] text-white text-[9px] flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('preguntas')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'preguntas' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Banco ({allQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('importar')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'importar' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Importar
          </button>
          <button
            onClick={() => setActiveTab('crear')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'crear' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            + Nueva
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'metricas' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Métricas
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 flex flex-col gap-3">
        {/* Yape Subscriptions Tab */}
        {activeTab === 'suscripciones' && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-[#183153] uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF9418]" />
              <span>Solicitudes Pendientes ({pendingRequests.length})</span>
            </h3>

            {isLoadingRequests ? (
              <div className="p-6 text-center text-xs font-bold text-slate-400">Cargando solicitudes...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-xs font-black text-[#183153]">No hay pagos Yape pendientes</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Las nuevas solicitudes aparecerán aquí en tiempo real.</p>
              </div>
            ) : (
              pendingRequests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 uppercase">
                        Plan {req.plan} • S/ {req.price}
                      </span>
                      <h4 className="text-xs font-black text-[#183153] mt-1">
                        {req.userName || `Usuario: ${req.userId.slice(0, 8)}`}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        Fecha: {new Date(req.createdAt).toLocaleString('es-PE')}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Pendiente
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-700 space-y-1">
                    <div>• <strong>N° Operación:</strong> {req.operationNumber || 'No especificado'}</div>
                    <div>• <strong>Teléfono Yape:</strong> {req.phoneNumber || 'No especificado'}</div>
                  </div>

                  {req.paymentProofUrl && (
                    <a
                      href={req.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#7354D9] hover:underline bg-purple-50 p-2 rounded-xl"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver imagen del comprobante</span>
                    </a>
                  )}

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleApprove(req)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Aprobar y Activar</span>
                    </button>

                    <button
                      onClick={() => handleReject(req)}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs border border-rose-200"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Past reviewed requests */}
            {pastRequests.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  Historial de Solicitudes Revisadas ({pastRequests.length})
                </h4>
                {pastRequests.slice(0, 5).map(req => (
                  <div key={req.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#183153]">Plan {req.plan}</span>
                      <span className="text-[10px] text-slate-400 block">{req.userName || req.userId.slice(0, 8)}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      req.status === 'aprobada' ? 'bg-emerald-1<dyad-write path="src/pages/AdminScreen.tsx" description="Completar la vista de AdminScreen con la pestaña de solicitudes Yape y gestión del banco">
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { useChuplingo } from '../context/ChuplingoContext';
import { COURSES } from '../data/coursesData';
import { CourseId, QuestionDifficulty, SubscriptionRequest } from '../types/chuplingo';
import { Shield, Plus, Upload, Trash2, Database, BarChart3, Check, FileSpreadsheet, RefreshCw, FileUp, Clock, X, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// CSV to JSON parser handling quoted lines
function parseCSVToQuestions(csvText: string): any[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').replace(/^\uFEFF/, ''));
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
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

    if (obj.course || obj.course_id || obj.question || obj.pregunta) {
      rows.push(obj);
    }
  }

  return rows;
}

const COURSE_NAME_MAP: Record<string, CourseId> = {
  'literatura': 'literatura',
  'psicología': 'psicologia',
  'psicologia': 'psicologia',
  'geografía': 'geografia',
  'geografia': 'geografia',
  'razonamiento verbal': 'razonamiento-verbal',
  'razonamiento-verbal': 'razonamiento-verbal',
  'cívica': 'civica',
  'civica': 'civica',
  'filosofía': 'filosofia',
  'filosofia': 'filosofia',
  'inglés': 'ingles',
  'ingles': 'ingles',
  'biología': 'biologia',
  'biologia': 'biologia'
};

const AdminScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    allQuestions, 
    addQuestionToBank, 
    deleteQuestionFromBank, 
    importQuestionsBatch, 
    fetchQuestionsFromSupabase,
    fetchAdminSubscriptionRequests,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
    getOverallStats 
  } = useChuplingo();

  const [activeTab, setActiveTab] = useState<'suscripciones' | 'preguntas' | 'crear' | 'importar' | 'metricas'>('suscripciones');
  const [filterCourse, setFilterCourse] = useState<CourseId | 'all'>('all');
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

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
  const [batchFormat, setBatchFormat] = useState<'json' | 'csv'>('csv');
  const [batchRawText, setBatchRawText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const stats = getOverallStats();

  const loadRequests = async () => {
    setIsLoadingRequests(true);
    const data = await fetchAdminSubscriptionRequests();
    setSubscriptionRequests(data);
    setIsLoadingRequests(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (req: SubscriptionRequest) => {
    const ok = await approveSubscriptionRequest(req.id, req.userId, req.plan, req.price);
    if (ok) {
      loadRequests();
    }
  };

  const handleReject = async (req: SubscriptionRequest) => {
    const reason = window.prompt('Motivo del rechazo (opcional):', 'Comprobante no coincide con abono en Yape');
    if (reason !== null) {
      const ok = await rejectSubscriptionRequest(req.id, reason);
      if (ok) {
        loadRequests();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setBatchRawText(text);
        if (file.name.endsWith('.json')) {
          setBatchFormat('json');
        } else {
          setBatchFormat('csv');
        }
        toast.success(`Archivo "${file.name}" cargado listo para importar.`);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessBatch = async () => {
    if (!batchRawText.trim()) {
      toast.error('Pega o selecciona un archivo CSV o JSON con las preguntas');
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

      const mapped = parsedArray.map(item => {
        const rawCourse = (item.course || item.course_id || '').toLowerCase().trim();
        const normalizedCourseId = COURSE_NAME_MAP[rawCourse] || 'literatura';
        
        let diff = (item.difficulty || item.dificultad || 'intermedio').toLowerCase().trim();
        if (diff === 'básico' || diff === 'basico') diff = 'basico';
        else if (diff === 'avanzado') diff = 'avanzado';
        else diff = 'intermedio';

        return {
          id: item.id || undefined,
          course_id: normalizedCourseId,
          topic_id: item.topic || item.topic_id || 'Tema General',
          subtopic: item.subtopic || null,
          difficulty: diff,
          question_type: item.question_type || 'completar_enunciado',
          question: item.question || item.pregunta,
          option_a: item.option_a,
          option_b: item.option_b,
          option_c: item.option_c,
          option_d: item.option_d,
          option_e: item.option_e,
          correct_answer: (item.correct_answer || item.respuestaCorrecta || 'A').toUpperCase().trim(),
          explanation: item.explanation || item.explicacion || '',
          source_document: item.source_document || null,
          source_page: item.source_page || null,
          origin: item.origin || 'pregunta_generada_a_partir_del_contenido_fuente',
          official_exam_question: false,
          active: true
        };
      });

      const count = await importQuestionsBatch(mapped);
      if (count > 0) {
        setBatchRawText('');
        setActiveTab('preguntas');
      }
    } catch (e: any) {
      toast.error(`Error al procesar el lote: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

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

  const filteredList = filterCourse === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.courseId === filterCourse);

  const pendingRequests = subscriptionRequests.filter(r => r.status === 'pendiente');
  const pastRequests = subscriptionRequests.filter(r => r.status !== 'pendiente');

  return (
    <div className="flex flex-col gap-4">
      <AppHeader
        title="Panel de Administración"
        subtitle="Gestión de suscripciones Yape y base de datos"
        iconEmoji="🛡️"
        showBack={true}
        bgGradient="from-[#183153] to-[#254A7A]"
        rightAction={
          <button
            onClick={() => {
              fetchQuestionsFromSupabase();
              loadRequests();
            }}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90"
            title="Refrescar base de datos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        }
      />

      {/* Tabs */}
      <div className="px-4">
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center text-[11px] font-black overflow-x-auto scrollbar-none gap-0.5">
          <button
            onClick={() => setActiveTab('suscripciones')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'suscripciones' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>Yape</span>
            {pendingRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F05C54] text-white text-[9px] flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('preguntas')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'preguntas' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Banco ({allQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('importar')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'importar' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Importar
          </button>
          <button
            onClick={() => setActiveTab('crear')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'crear' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            + Nueva
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`py-2 px-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'metricas' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-600'
            }`}
          >
            Métricas
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 flex flex-col gap-3">
        {/* Yape Subscriptions Tab */}
        {activeTab === 'suscripciones' && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-[#183153] uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF9418]" />
              <span>Solicitudes Pendientes ({pendingRequests.length})</span>
            </h3>

            {isLoadingRequests ? (
              <div className="p-6 text-center text-xs font-bold text-slate-400">Cargando solicitudes...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-xs font-black text-[#183153]">No hay pagos Yape pendientes</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Las nuevas solicitudes aparecerán aquí en tiempo real.</p>
              </div>
            ) : (
              pendingRequests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 uppercase">
                        Plan {req.plan} • S/ {req.price}
                      </span>
                      <h4 className="text-xs font-black text-[#183153] mt-1">
                        {req.userName || `Usuario: ${req.userId.slice(0, 8)}`}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        Fecha: {new Date(req.createdAt).toLocaleString('es-PE')}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Pendiente
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-700 space-y-1">
                    <div>• <strong>N° Operación:</strong> {req.operationNumber || 'No especificado'}</div>
                    <div>• <strong>Teléfono Yape:</strong> {req.phoneNumber || 'No especificado'}</div>
                  </div>

                  {req.paymentProofUrl && (
                    <a
                      href={req.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#7354D9] hover:underline bg-purple-50 p-2 rounded-xl"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver imagen del comprobante</span>
                    </a>
                  )}

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleApprove(req)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Aprobar y Activar</span>
                    </button>

                    <button
                      onClick={() => handleReject(req)}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs border border-rose-200"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Past reviewed requests */}
            {pastRequests.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  Historial de Solicitudes Revisadas ({pastRequests.length})
                </h4>
                {pastRequests.slice(0, 5).map(req => (
                  <div key={req.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#183153]">Plan {req.plan}</span>
                      <span className="text-[10px] text-slate-400 block">{req.userName || req.userId.slice(0, 8)}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      req.status === 'aprobada' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {req.status === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bank List Tab */}
        {activeTab === 'preguntas' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                      {q.courseId.toUpperCase()} • {q.topicName || q.topicId}
                    </span>
                    <button
                      onClick={() => deleteQuestionFromBank(q.id)}
                      className="text-rose-500 p-1 hover:bg-rose-50 rounded-lg"
                      title="Eliminar pregunta de Supabase"
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

        {/* Import Tab */}
        {activeTab === 'importar' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#183153] flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#F05C54]" />
                <span>Importador a Supabase</span>
              </h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  onClick={() => setBatchFormat('csv')}
                  className={`px-2 py-0.5 rounded ${batchFormat === 'csv' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-500'}`}
                >
                  CSV
                </button>
                <button
                  onClick={() => setBatchFormat('json')}
                  className={`px-2 py-0.5 rounded ${batchFormat === 'json' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-500'}`}
                >
                  JSON
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Sube o pega el archivo CSV / JSON de preguntas. Se insertarán directamente en la tabla <code>questions</code> de Supabase.
            </p>

            <label className="border-2 border-dashed border-slate-200 hover:border-[#F05C54] rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors bg-slate-50">
              <FileUp className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-black text-[#183153]">Seleccionar archivo CSV o JSON</span>
              <span className="text-[10px] text-slate-400 font-medium">Ej. CHUPLINGO_PRIMER_LOTE_100_PREGUNTAS.csv</span>
              <input
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                O pega el texto aquí:
              </label>
              <textarea
                rows={6}
                value={batchRawText}
                onChange={(e) => setBatchRawText(e.target.value)}
                placeholder="Pega las líneas CSV o el JSON de las preguntas..."
                className="w-full bg-slate-50 border rounded-2xl p-2.5 text-[11px] font-mono leading-tight"
              />
            </div>

            <button
              onClick={handleProcessBatch}
              disabled={isImporting || !batchRawText.trim()}
              className="w-full py-4 rounded-2xl bg-[#183153] hover:bg-[#10223A] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isImporting ? 'Guardando en Supabase...' : 'Importar a la Base de Datos de Supabase'}</span>
            </button>
          </div>
        )}

        {/* Create Single Tab */}
        {activeTab === 'crear' && (
          <form onSubmit={handleCreate} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h3 className="text-sm font-black text-[#183153]">Agregar Pregunta Individual</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500">Curso</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value as CourseId)}
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
              <label className="text-[10px] font-black uppercase text-slate-500">Explicación</label>
              <textarea
                rows={2}
                placeholder="Por qué la alternativa elegida es la correcta..."
                value={explicacion}
                onChange={(e) => setExplicacion(e.target.value)}
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
                <span className="text-[10px] text-slate-500 font-bold uppercase">Preguntas en Supabase</span>
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