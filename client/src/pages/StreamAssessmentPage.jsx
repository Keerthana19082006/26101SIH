import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  Flag,
  ArrowLeft,
  ShieldCheck,
  Award,
  Zap,
  Check,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Layers,
  BookOpen,
  Target,
  BarChart3,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { useStream } from '../context/StreamContext';
import { STREAM_QUESTIONS, STREAM_ROLES } from '../data/streamData';
import { ROLE_BLUEPRINTS } from '../data/roleBlueprints';
import { generateEmployeeAssessment, getAdaptiveNextQuestion } from '../services/roleAssessmentEngine';
import { aiAPI } from '../services/api';
import PreDashboardLayout from '../components/layout/PreDashboardLayout';

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function StreamAssessmentPage({ onBackToStreams, onComplete }) {
  const { selectedStream, submitAssessment, employee } = useStream();
  
  // Phase 3: Employee-first Diagnostic Workflow ('test' | 'analyzing' | 'intro')
  // Default to 'test' so every "Enter Employee" click immediately opens Question 1
  const [assessmentStage, setAssessmentStage] = useState('test');
  const [analyzingStep, setAnalyzingStep] = useState(0);

  // Role-aware Assessment Resolution
  const empId = employee?.id || 'demo-employee-01';
  const isRoleAware = Boolean(ROLE_BLUEPRINTS[empId]);
  const roleBlueprint = ROLE_BLUEPRINTS[empId] || null;

  const roleTitleDisplay = roleBlueprint?.roleTitle || employee?.designation || 'Statistical Investigator';
  const deptDisplay = roleBlueprint?.departmentName || employee?.department || 'MoSPI / National Statistical Office';
  const blueprintCompetencies = roleBlueprint?.competencies?.map(c => c.name) || employee?.competenciesFocus || [
    'Survey Sampling', 'Statistical Methods', 'Data Analysis', 'Survey Operations', 'Data Quality'
  ];

  // Initialize role session questions or legacy stream questions
  const [assessmentSession] = useState(() => {
    if (isRoleAware) {
      return generateEmployeeAssessment(empId);
    }
    return null;
  });

  const [questions, setQuestions] = useState(() => {
    if (assessmentSession?.questions && assessmentSession.questions.length > 0) {
      return assessmentSession.questions;
    }
    const streamId = selectedStream?.id || 'stats';
    return STREAM_QUESTIONS[streamId] || STREAM_QUESTIONS.stats;
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [adaptiveNotice, setAdaptiveNotice] = useState(null);

  // Fetch AI-generated assessment from Groq service with graceful fallback
  useEffect(() => {
    let isMounted = true;
    async function fetchAiAssessment() {
      try {
        const payload = {
          employeeId: empId,
          department: deptDisplay,
          role: roleTitleDisplay,
          professionalArea: roleBlueprint?.ministry || 'Official Statistical System & Governance',
          competencies: blueprintCompetencies,
          count: 5
        };
        const response = await aiAPI.generateAssessment(payload);
        if (response?.data?.success && response?.data?.assessment) {
          const aiData = response.data.assessment;
          if (Array.isArray(aiData.questions) && aiData.questions.length > 0 && isMounted) {
            const mappedQuestions = aiData.questions.map((q, idx) => {
              const optArray = Array.isArray(q.options) ? q.options : [];
              const formattedOptions = optArray.map((opt, oIdx) => {
                const optLetter = String.fromCharCode(65 + oIdx);
                if (typeof opt === 'string') {
                  return { id: optLetter, text: opt };
                }
                return { id: opt.id || optLetter, text: opt.text || opt.label || String(opt) };
              });

              let correctOpt = 'A';
              if (q.correctAnswer) {
                const trimmed = String(q.correctAnswer).trim();
                const matchedByLetter = formattedOptions.find(o => o.id.toUpperCase() === trimmed.toUpperCase());
                if (matchedByLetter) {
                  correctOpt = matchedByLetter.id;
                } else {
                  const matchedByText = formattedOptions.find(o => o.text.toLowerCase() === trimmed.toLowerCase());
                  if (matchedByText) {
                    correctOpt = matchedByText.id;
                  }
                }
              }

              return {
                id: q.id || `AI-Q${idx + 1}`,
                question: q.question,
                options: formattedOptions,
                correctOption: correctOpt,
                competencyName: q.competency || 'Role Competency',
                competencyId: q.competency ? q.competency.toLowerCase().replace(/\s+/g, '-') : 'general',
                difficulty: (q.difficulty || 'MEDIUM').toUpperCase(),
                explanation: q.explanation || 'Evaluated by Groq AI Competency Engine',
                source: response.data.model ? `Groq AI (${response.data.model})` : 'Groq AI Competency Engine'
              };
            });

            setQuestions(prev => {
              // Only override if user hasn't started answering yet
              if (Object.keys(answers).length === 0 && mappedQuestions.length > 0) {
                return mappedQuestions;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        // Fallback already pre-loaded from generateEmployeeAssessment; gracefully log
        console.log('[Groq AI] Fallback active:', err.message);
      }
    }

    fetchAiAssessment();
    return () => { isMounted = false; };
  }, [empId]);

  // Timer countdown
  useEffect(() => {
    if (assessmentStage !== 'test') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerAnalysis();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [assessmentStage]);

  // Stepped animation for analysis screen
  useEffect(() => {
    if (assessmentStage === 'analyzing') {
      const step1 = setTimeout(() => setAnalyzingStep(1), 250);
      const step2 = setTimeout(() => setAnalyzingStep(2), 500);
      const step3 = setTimeout(() => setAnalyzingStep(3), 800);
      const step4 = setTimeout(() => setAnalyzingStep(4), 1100);
      const step5 = setTimeout(() => setAnalyzingStep(5), 1400);
      const finish = setTimeout(() => {
        finalizeSubmission();
      }, 1750);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
        clearTimeout(step4);
        clearTimeout(step5);
        clearTimeout(finish);
      };
    }
  }, [assessmentStage]);

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[current] || questions[0];

  // ── Adaptive Difficulty Progression Handler ──────────────────────────────
  const handleSelectAnswer = (optionId) => {
    setAnswers(prev => ({
      ...prev,
      [current]: optionId,
    }));

    if (isRoleAware && currentQ) {
      const isCorrect = currentQ.correctOption === optionId;
      const compId = currentQ.competencyId;
      const currentDiff = currentQ.difficulty || 'MEDIUM';

      // Look ahead for an uncompleted question in the same competency to adapt its difficulty
      const upcomingIdx = questions.findIndex(
        (q, idx) => idx > current && q.competencyId === compId && answers[idx] === undefined
      );

      if (upcomingIdx !== -1) {
        const answeredIds = Object.keys(answers).map(i => questions[i]?.id).filter(Boolean);
        answeredIds.push(currentQ.id);

        const adaptedQ = getAdaptiveNextQuestion(
          empId,
          compId,
          currentDiff,
          isCorrect,
          answeredIds
        );

        if (adaptedQ && adaptedQ.id !== questions[upcomingIdx].id) {
          setQuestions(prev => {
            const updated = [...prev];
            updated[upcomingIdx] = adaptedQ;
            return updated;
          });

          const diffDir = isCorrect ? 'increased to ' + adaptedQ.difficulty : 'adjusted to ' + adaptedQ.difficulty;
          setAdaptiveNotice(`Next ${adaptedQ.competencyName} scenario ${diffDir} based on response`);
          setTimeout(() => setAdaptiveNotice(null), 3500);
        }
      }
    }
  };

  const handleClearAnswer = () => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[current];
      return next;
    });
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(current)) next.delete(current);
      else next.add(current);
      return next;
    });
  };

  const handleAutoFill = () => {
    const sample = {};
    questions.forEach((q, idx) => {
      const opt = q.options[idx % 3 === 0 ? 1 : 0] || q.options[0];
      sample[idx] = opt.id;
    });
    setAnswers(sample);
  };

  const triggerAnalysis = () => {
    setShowConfirmModal(false);
    setAssessmentStage('analyzing');
  };

  const finalizeSubmission = () => {
    const answersMap = {};
    questions.forEach((q, idx) => {
      const qKey = q.id || idx;
      if (answers[idx] !== undefined) {
        answersMap[qKey] = answers[idx];
      }
    });

    submitAssessment(answersMap, isRoleAware);
    if (onComplete) onComplete();
  };

  const handleInstantSubmit = () => {
    const sample = {};
    const sampleMap = {};
    questions.forEach((q, idx) => {
      let chosenOpt = q.options[0];
      if (q.correctOption && idx % 3 !== 0) {
        chosenOpt = q.options.find(o => o.id === q.correctOption) || q.options[0];
      } else {
        chosenOpt = q.options.find(o => o.id !== q.correctOption) || q.options[1] || q.options[0];
      }
      sample[idx] = chosenOpt.id;
      sampleMap[q.id || idx] = chosenOpt.id;
    });

    setAnswers(sample);
    setShowConfirmModal(false);
    setAssessmentStage('analyzing');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Resolve Header Titles
  const compNameDisplay = currentQ?.competencyName || currentQ?.competency || 'Core Competency';
  const currentDifficulty = currentQ?.difficulty || 'MEDIUM';

  // ══════════════════════════════════════════════════════════════════════════
  // STAGE 1: DIAGNOSTIC INTRO SCREEN (STEP 4)
  // ══════════════════════════════════════════════════════════════════════════
  if (assessmentStage === 'intro') {
    const introHeader = (
      <header className="bg-gov-navy text-white text-xs border-b border-white/10 w-full shadow-xs">
        <div className="h-1 bg-gradient-to-r from-gov-saffron via-white to-gov-green w-full" />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStreams}
              className="p-1.5 rounded-gov bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
              title="Back to Employee Selection"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-7 h-7 rounded-full border border-white/30 bg-white/10 flex items-center justify-center font-serif text-[9px] font-bold text-gov-saffron shrink-0">
              GOV
            </div>
            <div>
              <p className="font-bold tracking-wide text-white text-xs sm:text-sm">
                भारत सरकार · Government of India
              </p>
              <p className="text-white/60 text-[10px] hidden sm:block">
                {deptDisplay} · Competency Diagnostic Framework
              </p>
            </div>
          </div>
        </div>
      </header>
    );

    const introFooter = (
      <footer className="w-full bg-white border-t border-gov-gray-200 py-3.5 px-4 text-center text-xs text-gov-gray-500 shrink-0">
        Integrated with iGOT Karmayogi Competency Diagnostic Framework
      </footer>
    );

    return (
      <PreDashboardLayout header={introHeader} footer={introFooter}>
        {/* Main Intro Body */}
        <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center">
          <motion.div {...fadeUp} className="w-full max-w-3xl space-y-6">
            
            {/* Header Title Section */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-blue-light border border-blue-200 text-gov-blue text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>Diagnostic Assessment Required</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gov-navy tracking-tight">
                Build Your Competency Profile
              </h1>

              <p className="text-sm sm:text-base text-gov-gray-600 max-w-2xl mx-auto leading-relaxed">
                Before we recommend learning resources, we need to understand your current competency level.
              </p>
            </div>

            {/* Compact Employee Context Card */}
            <div className="gov-card p-6 border-2 border-gov-blue/20 bg-white rounded-gov-md shadow-xs space-y-5">
              
              {/* Officer Meta Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gov-gray-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gov-saffron-light text-gov-saffron text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron animate-pulse" />
                    <span>DEMO / TEST ACCOUNT</span>
                  </div>

                  <h2 className="text-lg font-black text-gov-navy">
                    {employee?.name || 'Officer Persona'}
                  </h2>
                  <p className="text-xs font-semibold text-gov-navy">{deptDisplay}</p>
                  <p className="text-xs font-bold text-gov-blue">{roleTitleDisplay}</p>
                </div>

                <div className="bg-gov-off-white p-3 rounded-gov border border-gov-gray-200 text-right shrink-0">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase tracking-wider block">Scope</span>
                  <span className="text-xs font-bold text-gov-navy">10 Diagnostic Questions</span>
                  <span className="text-[10px] text-gov-gray-500 block mt-0.5">Est. 5–10 Minutes</span>
                </div>
              </div>

              {/* Assessment Areas Pills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gov-navy uppercase tracking-wider block">
                  Assessment Blueprint Competencies:
                </span>
                <div className="flex flex-wrap gap-2">
                  {blueprintCompetencies.map((comp) => (
                    <span
                      key={comp}
                      className="badge-gov-info text-xs px-3 py-1 font-semibold border border-blue-200"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Purpose Box */}
              <div className="p-4 rounded-gov bg-gov-blue-light/40 border border-gov-blue/20 text-xs text-gov-gray-700 leading-relaxed flex items-start gap-3">
                <Sparkles size={18} className="text-gov-blue shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gov-navy font-bold">Assessment Purpose:</strong>{' '}
                  Your responses will help us identify competency strengths, development areas, and personalized learning priorities. Once evaluated, your full Employee Portal will unlock automatically.
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setAssessmentStage('test')}
                className="btn-gov-saffron w-full justify-center py-3.5 text-sm font-bold shadow-md flex items-center gap-2 hover:scale-[1.01] transition-transform"
              >
                <span>Start Diagnostic Assessment</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </motion.div>
        </main>
      </PreDashboardLayout>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STAGE 3: ANALYSIS IN PROGRESS SCREEN (STEP 8)
  // ══════════════════════════════════════════════════════════════════════════
  if (assessmentStage === 'analyzing') {
    const checkItems = [
      { id: 1, label: 'Evaluating competency performance against blueprint benchmarks' },
      { id: 2, label: 'Identifying domain strengths and established proficiencies' },
      { id: 3, label: 'Detecting critical and developing skill gaps' },
      { id: 4, label: 'Matching role-tailored iGOT Karmayogi learning resources' },
      { id: 5, label: 'Building your personalized career learning path' },
    ];

    return (
      <div className="min-h-screen bg-gov-off-white flex flex-col items-center justify-center p-4 text-gov-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gov-card p-8 max-w-lg w-full bg-white border-2 border-gov-blue/30 rounded-gov-md shadow-lg space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gov-blue-light flex items-center justify-center mx-auto text-gov-blue">
            <BrainCircuit size={32} className="animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-gov-navy">
              Analyzing Your Competency Profile...
            </h2>
            <p className="text-xs text-gov-gray-500">
              Calibrating responses for <strong>{roleTitleDisplay}</strong> ({deptDisplay})
            </p>
          </div>

          {/* Stepped Checklist */}
          <div className="space-y-2.5 text-left pt-2">
            {checkItems.map((item) => {
              const isDone = analyzingStep >= item.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-2.5 rounded-gov text-xs font-medium transition-all ${
                    isDone
                      ? 'bg-gov-green-light/40 text-gov-navy border border-green-200'
                      : 'bg-gov-gray-50 text-gov-gray-400 border border-transparent'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    isDone ? 'bg-gov-green text-white' : 'bg-gov-gray-200 text-gov-gray-500'
                  }`}>
                    {isDone ? '✓' : <Loader2 size={10} className="animate-spin" />}
                  </div>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <div className="progress-track h-2">
              <div
                className="h-full bg-gradient-to-r from-gov-blue to-gov-saffron rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (analyzingStep / 5) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-gov-gray-400 mt-2">
              Finalizing personalized diagnostic report...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STAGE 2: LIVE ROLE-SPECIFIC QUESTION TEST (STEP 5 & 6)
  // ══════════════════════════════════════════════════════════════════════════
  const testHeader = (
    <div className="bg-gov-navy text-white w-full shadow-xs">
      <div className="h-1 bg-gradient-to-r from-gov-saffron via-white to-gov-green w-full" />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStreams}
            className="p-1.5 rounded-gov bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="w-9 h-9 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-gov-saffron leading-none">iGOT</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/60 uppercase tracking-widest">
                Initial Competency Diagnostic
              </span>
              <span className="badge-gov-saffron text-[9px] px-1.5 py-0.2">
                {deptDisplay}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
              {roleTitleDisplay.toUpperCase()} · Official Competency Assessment
            </p>
          </div>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-4">
          <div className="bg-white/10 border border-white/20 rounded-gov px-3 py-1.5 flex items-center gap-2">
            <Clock size={14} className={timeLeft < 300 ? 'text-gov-red animate-pulse' : 'text-gov-saffron'} />
            <div className="text-right">
              <p className="text-[9px] text-white/60 uppercase tracking-tight">Time Left</p>
              <p className={`text-xs font-bold font-mono ${timeLeft < 300 ? 'text-gov-red' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PreDashboardLayout header={testHeader}>
      {/* Main Assessment Container */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="grid lg:grid-cols-4 gap-6 flex-1 w-full">
          
          {/* Question Left / Main Column (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            
            {/* Top Status & Role Blueprint Progress */}
            <div className="gov-card p-4 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gov-navy uppercase tracking-wide text-xs">
                    {roleTitleDisplay}
                  </span>
                  <span className="text-gov-gray-400">·</span>
                  <span className="text-gov-gray-600 font-medium">
                    {deptDisplay}
                  </span>
                  <span className="text-gov-gray-400">·</span>
                  <span className="badge-gov-info text-[11px] font-semibold">
                    Competency: {compNameDisplay}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    currentDifficulty === 'HARD' ? 'bg-red-50 text-red-700 border-red-200' :
                    currentDifficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    Difficulty: {currentDifficulty}
                  </span>
                </div>

                <div className="text-[11px] text-gov-gray-600 shrink-0">
                  <span className="font-semibold text-gov-blue">{answeredCount} of {total}</span> answered · <span className="font-semibold text-gov-amber">{flagged.size}</span> flagged
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gov-gray-500 font-mono">
                  <span>Question {current + 1} of {total}</span>
                  <span>{Math.round((answeredCount / total) * 100)}% Complete</span>
                </div>
                <div className="progress-track h-2">
                  <div
                    className="h-full bg-gradient-to-r from-gov-blue to-gov-blue-dark rounded-full transition-all duration-300"
                    style={{ width: `${((answeredCount) / total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Adaptive difficulty feedback toast notice */}
              {adaptiveNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] bg-gov-blue-light/70 text-gov-blue px-2.5 py-1 rounded border border-blue-200 flex items-center gap-1.5"
                >
                  <TrendingUp size={13} />
                  <span>{adaptiveNotice}</span>
                </motion.div>
              )}
            </div>

            {/* Question Card */}
            <div className="gov-card p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Question header row */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-gov-gray-100">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gov-navy uppercase tracking-wider bg-gov-gray-100 px-2 py-0.5 rounded">
                          Question {current + 1} of {total}
                        </span>
                        <span className="text-[11px] text-gov-gray-400 font-mono">
                          ID: {currentQ?.id || `Q-${current + 1}`}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-gov-navy mt-1 leading-snug">
                        {currentQ?.question || currentQ?.text}
                      </h2>
                    </div>

                    <button
                      onClick={toggleFlag}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-gov border text-xs font-medium transition-all
                        ${flagged.has(current)
                          ? 'bg-gov-amber-light border-amber-300 text-gov-amber shadow-sm'
                          : 'bg-white border-gov-gray-200 text-gov-gray-400 hover:text-gov-amber hover:border-amber-200'
                        }`}
                    >
                      <Flag size={13} className={flagged.has(current) ? 'fill-gov-amber' : ''} />
                      <span>{flagged.has(current) ? 'Flagged' : 'Flag'}</span>
                    </button>
                  </div>

                  {/* Options List */}
                  <div className="space-y-3 pt-2">
                    {currentQ?.options?.map((option) => {
                      const isSelected = answers[current] === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelectAnswer(option.id)}
                          className={`w-full text-left p-4 rounded-gov-md border-2 transition-all flex items-start gap-3.5
                            ${isSelected
                              ? 'border-gov-blue bg-gov-blue-light/70 text-gov-navy shadow-gov-card'
                              : 'border-gov-gray-200 bg-white hover:border-gov-blue/50 hover:bg-gov-blue-light/20 text-gov-gray-700'
                            }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border
                            ${isSelected
                              ? 'bg-gov-blue text-white border-gov-blue shadow-xs'
                              : 'bg-gov-gray-100 text-gov-gray-600 border-gov-gray-300'
                            }`}
                          >
                            {option.id}
                          </div>
                          <div className="flex-1 text-sm font-medium pt-0.5 leading-relaxed">
                            {option.text}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Nav Buttons */}
              <div className="pt-6 border-t border-gov-gray-100 mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrent(prev => Math.max(0, prev - 1))}
                    disabled={current === 0}
                    className="btn-gov-secondary text-xs px-4 py-2 disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </button>
                  {answers[current] && (
                    <button
                      onClick={handleClearAnswer}
                      className="text-xs text-gov-gray-400 hover:text-gov-red underline ml-2"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {current < total - 1 ? (
                    <button
                      onClick={() => setCurrent(prev => Math.min(total - 1, prev + 1))}
                      className="btn-gov-primary text-xs px-5 py-2"
                    >
                      Next
                      <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="btn-gov-saffron text-xs px-6 py-2 shadow-sm font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle size={15} />
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Question Grid Palette (1 col) */}
          <div className="space-y-4">
            <div className="gov-card p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                  Question Palette ({total})
                </h3>
                <p className="text-[11px] text-gov-gray-400">
                  Select any question to navigate directly.
                </p>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => {
                  const isCurrent = i === current;
                  const isAnswered = answers[i] !== undefined;
                  const isFlagged = flagged.has(i);

                  let bgStyle = 'bg-gov-gray-100 border-gov-gray-200 text-gov-gray-600 hover:border-gov-gray-400';
                  if (isCurrent) {
                    bgStyle = 'ring-2 ring-gov-blue bg-gov-blue text-white font-bold border-transparent';
                  } else if (isAnswered && isFlagged) {
                    bgStyle = 'bg-gov-amber-light border-gov-amber text-gov-amber font-semibold';
                  } else if (isAnswered) {
                    bgStyle = 'bg-gov-green-light border-green-300 text-gov-green font-semibold';
                  } else if (isFlagged) {
                    bgStyle = 'bg-gov-amber-light border-amber-300 text-gov-amber font-semibold';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-9 rounded-gov border text-xs font-medium flex items-center justify-center transition-all ${bgStyle}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-gov-gray-100 space-y-1.5 text-[11px] text-gov-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-gov-green-light border border-green-300 inline-block" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-gov-amber-light border border-amber-300 inline-block" />
                  <span>Flagged ({flagged.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-gov-gray-100 border border-gov-gray-200 inline-block" />
                  <span>Not Answered ({total - answeredCount})</span>
                </div>
              </div>

              {/* Ready to Submit Button in Palette */}
              <button
                onClick={() => setShowConfirmModal(true)}
                className="btn-gov-primary w-full justify-center py-2.5 text-xs mt-2"
              >
                <ShieldCheck size={14} />
                Finish & Submit
              </button>

              <button
                type="button"
                onClick={handleInstantSubmit}
                className="btn-gov-saffron w-full justify-center py-2 text-xs mt-1.5 font-semibold shadow-xs flex items-center gap-1.5"
                title="Evaluate answers instantly and advance to Diagnostic Report"
              >
                <span>⚡ Auto-Submit & Analyze</span>
              </button>

              <div className="flex items-center gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="w-full justify-center py-1.5 text-[11px] font-medium text-gov-blue hover:text-gov-navy border border-blue-200 bg-gov-blue-light/50 hover:bg-blue-100 rounded-gov transition-colors"
                  title="Populate sample responses for quick evaluation"
                >
                  Fill Sample Answers
                </button>
              </div>
            </div>

            {/* Assessment Meta Box */}
            <div className="gov-card p-4 space-y-2 bg-gradient-to-br from-white to-gov-off-white">
              <div className="flex items-center gap-2 text-gov-navy font-semibold text-xs">
                <Award size={14} className="text-gov-saffron" />
                <span>Role Competency Blueprint</span>
              </div>
              <p className="text-[11px] text-gov-gray-600 leading-relaxed">
                Personalized questions generated specifically for <strong>{roleTitleDisplay}</strong> ({deptDisplay}). All items are mapped to the 5 official competency blueprint domains.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-gov-lg shadow-gov-card-hover max-w-md w-full p-6 border border-gov-gray-200"
          >
            <div className="w-12 h-12 rounded-full bg-gov-blue-light flex items-center justify-center mx-auto mb-4 text-gov-blue">
              <ClipboardCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-gov-navy text-center mb-1">
              Submit Competency Diagnostic?
            </h3>
            <p className="text-xs text-gov-gray-600 text-center mb-5">
              You have answered <strong>{answeredCount} of {total}</strong> questions for <strong>{roleTitleDisplay}</strong>.
              {total - answeredCount > 0 && (
                <span className="text-gov-amber block mt-1 font-medium">
                  ⚠️ You still have {total - answeredCount} unanswered questions.
                </span>
              )}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-gov-secondary justify-center py-2.5 text-xs"
              >
                Return to Test
              </button>
              <button
                onClick={triggerAnalysis}
                className="btn-gov-saffron justify-center py-2.5 text-xs font-semibold"
              >
                Confirm & Analyze
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </PreDashboardLayout>
  );
}
