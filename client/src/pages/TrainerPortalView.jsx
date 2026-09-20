import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Sparkles,
  ClipboardCheck,
  Layers,
  Award,
  TrendingUp,
  BarChart3,
  Bot,
  Bell,
  User,
  Settings,
  Plus,
  Upload,
  Search,
  Eye,
  Trash2,
  Check,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Download,
  Building2,
  Calendar,
  Clock,
  Send,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  GraduationCap,
  FileUp,
  Play,
  CheckCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import TrainerSidebar from '../components/layout/TrainerSidebar';
import {
  DEPARTMENTS,
  getStoredMaterials,
  addStoredMaterial,
  deleteStoredMaterial,
  getStoredEmployees
} from '../services/portalManagementService';

export default function TrainerPortalView({ onBackToPortals }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Live persistent data
  const [materials, setMaterials] = useState(getStoredMaterials('all'));
  const [employees, setEmployees] = useState(getStoredEmployees());

  // Department Filter & Search for Materials
  const [materialDeptFilter, setMaterialDeptFilter] = useState('all');
  const [materialSearch, setMaterialSearch] = useState('');

  // Trainee Filter & Search
  const [traineeDeptFilter, setTraineeDeptFilter] = useState('all');
  const [traineeSearch, setTraineeSearch] = useState('');

  // Modals & previews
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [trainerFeedback, setTrainerFeedback] = useState('');

  // New Material Form State
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    department: 'MoSPI / National Statistical Office',
    departmentId: 'mospi',
    competency: 'Survey Sampling',
    type: 'PDF Document',
    size: '3.5 MB',
    pages: '36 pages',
    description: '',
    author: 'Dr. Rajeshwar Sharma (NSSTA)',
  });

  // AI MCQ Generator Interactive State
  const [generatorText, setGeneratorText] = useState('');
  const [generatorCompetency, setGeneratorCompetency] = useState('Survey Sampling');
  const [generatorDifficulty, setGeneratorDifficulty] = useState('Intermediate');
  const [generatorCount, setGeneratorCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // PDF Upload & Quiz Generator State
  const [generatorMode, setGeneratorMode] = useState('pdf'); // 'pdf' | 'text'
  const [uploadedPdf, setUploadedPdf] = useState({
    name: 'NSS_78th_Round_Sampling_Operational_Manual.pdf',
    size: '4.2 MB',
    pages: 64,
    department: 'MoSPI / National Statistical Office',
    competency: 'Survey Sampling',
    isPreset: true,
  });
  const [generatorDepartment, setGeneratorDepartment] = useState('MoSPI / National Statistical Office');
  const [quizTitle, setQuizTitle] = useState('Assessment Quiz: NSS 78th Round Operational Manual');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationStatusText, setGenerationStatusText] = useState('');
  const [quizViewMode, setQuizViewMode] = useState('review'); // 'review' | 'test'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScoreResult, setQuizScoreResult] = useState(null);

  const sampleMinistryPdfs = [
    {
      name: 'NSS_78th_Round_Sampling_Operational_Manual.pdf',
      size: '4.2 MB',
      pages: 64,
      department: 'MoSPI / National Statistical Office',
      competency: 'Survey Sampling',
      difficulty: 'Intermediate',
    },
    {
      name: 'Satellite_Remote_Sensing_Crop_Yield_Estimation.pdf',
      size: '5.6 MB',
      pages: 52,
      department: 'Ministry of Agriculture (DES)',
      competency: 'Crop Estimation',
      difficulty: 'Intermediate',
    },
    {
      name: 'National_Health_Accounts_Surveillance_Standards.pdf',
      size: '3.4 MB',
      pages: 38,
      department: 'Health & Family Welfare (MoHFW)',
      competency: 'Health Indicators',
      difficulty: 'Advanced',
    },
    {
      name: 'Periodic_Labour_Force_Field_Sampling_Manual.pdf',
      size: '2.9 MB',
      pages: 34,
      department: 'Ministry of Labour & Employment',
      competency: 'Labour Statistics',
      difficulty: 'Intermediate',
    },
    {
      name: 'UDISE_School_Level_Data_Quality_Framework.pdf',
      size: '2.1 MB',
      pages: 24,
      department: 'Ministry of Education',
      competency: 'Education Indicators',
      difficulty: 'Foundation',
    },
  ];

  // Question Review State
  const [questionsForReview, setQuestionsForReview] = useState([
    {
      id: 'q-rev-1',
      question: 'Which sampling technique is most appropriate when district population strata exhibit high internal variance?',
      options: ['Simple Random Sampling', 'Stratified Multi-stage Sampling', 'Convenience Sampling', 'Systematic Linear Sampling'],
      correctAnswer: 'Stratified Multi-stage Sampling',
      source: 'NSS 78th Round Operational Manual (Page 18)',
      difficulty: 'Intermediate',
      competency: 'Survey Sampling',
      department: 'MoSPI / National Statistical Office',
      status: 'AI_GENERATED',
    },
    {
      id: 'q-rev-2',
      question: 'Under MoSPI guidelines, how are missing values in urban household consumption expenditure treated before computing CV?',
      options: ['Listwise Deletion', 'Hot-deck Imputation using Demographic Strata', 'Zero Substitution', 'Mean of Total Population'],
      correctAnswer: 'Hot-deck Imputation using Demographic Strata',
      source: 'Data Quality Auditing in District Surveys (Page 12)',
      difficulty: 'Advanced',
      competency: 'Data Quality & Validation',
      department: 'MoSPI / National Statistical Office',
      status: 'AI_GENERATED',
    },
    {
      id: 'q-rev-3',
      question: 'How does Normalized Difference Vegetation Index (NDVI) calibrate against ground-truthed crop cutting yield estimates?',
      options: ['Exponential Scaling', 'Linear Regression with Field Crop-Cut Samples', 'Standard Deviation Offset', 'Fixed Weight Multiplier'],
      correctAnswer: 'Linear Regression with Field Crop-Cut Samples',
      source: 'Satellite Remote Sensing & Objective Crop Area Estimation (Page 24)',
      difficulty: 'Intermediate',
      competency: 'Crop Estimation',
      department: 'Ministry of Agriculture (DES)',
      status: 'AI_GENERATED',
    },
  ]);

  // Approved Question Bank
  const [approvedQuestions, setApprovedQuestions] = useState([
    {
      id: 'q-app-1',
      question: 'What is the primary role of the primary sampling unit (PSU) in the Periodic Labour Force Survey (PLFS)?',
      answer: 'Urban Frame Survey (UFS) block in urban areas and Census Village in rural areas.',
      department: 'Ministry of Labour & Employment',
      competency: 'Labour Statistics',
      difficulty: 'Intermediate',
    },
    {
      id: 'q-app-2',
      question: 'In HMIS portal analytics, what is the formula for maternal mortality ratio (MMR)?',
      answer: '(Maternal deaths / Live births) * 100,000.',
      department: 'Health & Family Welfare (MoHFW)',
      competency: 'Health Indicators',
      difficulty: 'Beginner',
    },
    {
      id: 'q-app-3',
      question: 'How is the Consumer Price Index (CPI) basket weight recalibrated during base year revisions?',
      answer: 'Through comprehensive Household Consumer Expenditure Surveys (HCES).',
      department: 'MoSPI / National Statistical Office',
      competency: 'Statistical Methods',
      difficulty: 'Advanced',
    },
  ]);

  // AI Assistant Chat State
  const [assistantMessages, setAssistantMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Namaste Dr. Sharma. I am your Faculty AI Copilot. I can help you draft question items, outline 4-week department training programmes, or analyze student test performance gaps. What shall we work on?',
    },
  ]);
  const [assistantInput, setAssistantInput] = useState('');

  // Notifications State
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'AI Extraction Completed', text: '12 new MCQs extracted from National Sample Survey 78th Round manual.', time: '10m ago', unread: true },
    { id: 2, title: 'Batch Assessment Submitted', text: 'Statistical Investigator Cohort A submitted their Survey Sampling diagnostic.', time: '1h ago', unread: true },
    { id: 3, title: 'Curriculum Syllabi Synced', text: 'iGOT Karmayogi synced 6 new micro-courses into your faculty dashboard.', time: '4h ago', unread: false },
  ]);

  const refreshData = () => {
    setMaterials(getStoredMaterials('all'));
    setEmployees(getStoredEmployees());
  };

  const handleCreateMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.title.trim()) return;

    const matchedDept = DEPARTMENTS.find(d => d.name === newMaterial.department);
    const materialPayload = {
      ...newMaterial,
      departmentId: matchedDept ? matchedDept.id : 'mospi',
    };

    addStoredMaterial(materialPayload);
    refreshData();
    setShowAddMaterialModal(false);
    setNewMaterial({
      title: '',
      department: 'MoSPI / National Statistical Office',
      departmentId: 'mospi',
      competency: 'Survey Sampling',
      type: 'PDF Document',
      size: '3.5 MB',
      pages: '36 pages',
      description: '',
      author: 'Dr. Rajeshwar Sharma (NSSTA)',
    });
  };

  const handleDeleteMaterial = (id) => {
    if (confirm('Are you sure you want to remove this learning material?')) {
      deleteStoredMaterial(id);
      refreshData();
    }
  };

  const handleApproveQuestion = (q) => {
    setApprovedQuestions(prev => [
      {
        id: `q-app-${Date.now()}`,
        question: q.question,
        answer: q.correctAnswer || q.options?.[0] || 'Approved Answer',
        department: q.department,
        competency: q.competency,
        difficulty: q.difficulty,
      },
      ...prev,
    ]);
    setQuestionsForReview(prev => prev.filter(item => item.id !== q.id));
  };

  const handleRejectQuestion = (id) => {
    setQuestionsForReview(prev => prev.filter(q => q.id !== id));
  };

  const handlePdfFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const estPages = Math.max(12, Math.round(file.size / (55 * 1024)));
    setUploadedPdf({
      name: file.name,
      size: sizeStr,
      pages: estPages,
      department: generatorDepartment,
      competency: generatorCompetency,
      isPreset: false,
    });
    setQuizTitle(`Assessment Quiz: ${file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}`);
  };

  const handleSelectPresetPdf = (preset) => {
    setUploadedPdf(preset);
    setGeneratorDepartment(preset.department);
    setGeneratorCompetency(preset.competency);
    setGeneratorDifficulty(preset.difficulty);
    setQuizTitle(`Assessment Quiz: ${preset.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}`);
  };

  const handleGenerateQuizFromPdf = () => {
    if (!uploadedPdf) return;
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationStatusText(`Parsing document structure from "${uploadedPdf.name}"...`);

    setTimeout(() => {
      setGenerationStep(2);
      setGenerationStatusText(`Extracting core statistical methodologies & operational formulas from ${uploadedPdf.pages} pages...`);
    }, 600);

    setTimeout(() => {
      setGenerationStep(3);
      setGenerationStatusText(`Synthesizing 4-option MCQs with Bloom's Taxonomy distractors for ${generatorCompetency}...`);
    }, 1200);

    setTimeout(() => {
      setGenerationStep(4);
      setGenerationStatusText(`Finalizing official assessment quiz package...`);
    }, 1800);

    setTimeout(() => {
      // Question Catalog by Department & Competency
      const mospiQuestions = [
        {
          id: `q-pdf-1-${Date.now()}`,
          question: 'Under NSS 78th Round guidelines, which unit serves as the Primary Sampling Unit (PSU) in the rural stratum?',
          options: ['2011 Census Village (or CEB for large villages)', 'Panchayat Ward Cluster', 'Sub-district Revenue Block', 'Zila Parishad Constituency'],
          correctAnswer: '2011 Census Village (or CEB for large villages)',
          explanation: 'In rural areas of NSS 78th round, census villages or Census Enumeration Blocks (CEB) for villages with population over 1,200 act as primary sampling units.',
          sourceCitation: `${uploadedPdf.name} (Section 2.1, Page 14)`,
          bloomLevel: 'Comprehension (Level 2)',
        },
        {
          id: `q-pdf-2-${Date.now()}`,
          question: 'Which sampling technique is mandated for selecting second-stage sample households within listed strata?',
          options: ['Circular Systematic Sampling with Random Start', 'Purposive Judgment Selection', 'Simple Random Sampling with Replacement', 'Quota Proportional Allocation'],
          correctAnswer: 'Circular Systematic Sampling with Random Start',
          explanation: 'Households within second-stage strata are selected using linear or circular systematic sampling to ensure equal probability and uniform dispersion.',
          sourceCitation: `${uploadedPdf.name} (Section 3.4, Page 22)`,
          bloomLevel: 'Application (Level 3)',
        },
        {
          id: `q-pdf-3-${Date.now()}`,
          question: 'How is the sub-sample weight multiplier formulated when estimating aggregate Household Consumer Expenditure?',
          options: ['Weight = (N_h / n_h) * (H_hi / h_hi)', 'Weight = Mean(Sample) / Total Population', 'Weight = Standard Deviation * 100', 'Weight = Sample Count / District Area'],
          correctAnswer: 'Weight = (N_h / n_h) * (H_hi / h_hi)',
          explanation: 'The multiplier represents the inverse of the joint probability of selection across first-stage PSUs and second-stage households.',
          sourceCitation: `${uploadedPdf.name} (Appendix B, Formula 4.2, Page 58)`,
          bloomLevel: 'Analysis (Level 4)',
        },
        {
          id: `q-pdf-4-${Date.now()}`,
          question: 'What official threshold for Relative Standard Error (RSE) or Coefficient of Variation (CV) is required for district-level dissemination?',
          options: ['CV <= 20%', 'CV <= 50%', 'CV between 25% and 40%', 'CV >= 30%'],
          correctAnswer: 'CV <= 20%',
          explanation: 'National Statistical Office standards stipulate that estimates with a CV above 20% must be flagged with caution and aggregated to regional levels.',
          sourceCitation: `${uploadedPdf.name} (Quality Assurance Chapter, Page 35)`,
          bloomLevel: 'Evaluation (Level 5)',
        },
        {
          id: `q-pdf-5-${Date.now()}`,
          question: 'In urban household listings, how are non-response cases due to locked premises treated during substitution?',
          options: ['Strict substitution from casualty reserve list in the same stratum', 'Arbitrary nearest-door substitution', 'Omission without multiplier recalibration', 'Imputing mean district expenditure'],
          correctAnswer: 'Strict substitution from casualty reserve list in the same stratum',
          explanation: 'Field guidelines prohibit arbitrary household substitution; replacements must follow casualty selection orders established during listing.',
          sourceCitation: `${uploadedPdf.name} (Field Protocol Guide, Page 41)`,
          bloomLevel: 'Application (Level 3)',
        },
        {
          id: `q-pdf-6-${Date.now()}`,
          question: 'When computing Gini coefficient for consumption inequality, which distribution assumption is applied?',
          options: ['Lorenz curve integration over ranked decile classes', 'Bivariate normal density function', 'Poisson frequency distribution', 'Uniform deterministic interval'],
          correctAnswer: 'Lorenz curve integration over ranked decile classes',
          explanation: 'Gini coefficient calculation utilizes numerical trapezoidal integration under the empirical Lorenz curve of cumulative consumption shares.',
          sourceCitation: `${uploadedPdf.name} (Technical Note 6, Page 60)`,
          bloomLevel: 'Analysis (Level 4)',
        },
      ];

      const agriQuestions = [
        {
          id: `q-pdf-ag1-${Date.now()}`,
          question: 'How does Normalized Difference Vegetation Index (NDVI) calibrate against crop cutting field experiments?',
          options: ['Linear Regression with ground-truthed sample plot yields', 'Exponential growth extrapolation', 'Fixed nominal NDVI scaling', 'Arbitrary rainfall ratio multiplier'],
          correctAnswer: 'Linear Regression with ground-truthed sample plot yields',
          explanation: 'Satellite vegetation indices are ground-calibrated against physical crop-cut yield measurements to formulate district yield models.',
          sourceCitation: `${uploadedPdf.name} (Section 2.4, Page 18)`,
          bloomLevel: 'Application (Level 3)',
        },
        {
          id: `q-pdf-ag2-${Date.now()}`,
          question: 'Under Directorate of Economics & Statistics (DES) standards, what is the standard plot dimension for wheat crop cutting?',
          options: ['5m x 5m equilateral triangle or rectangle', '1m x 1m square grid', '10m x 10m circle', '20m x 20m diagonal'],
          correctAnswer: '5m x 5m equilateral triangle or rectangle',
          explanation: 'Standard General Crop Estimation Surveys (GCES) specify 5m x 5m triangular or rectangular cuts depending on regional state protocols.',
          sourceCitation: `${uploadedPdf.name} (Manual Section 4, Page 29)`,
          bloomLevel: 'Comprehension (Level 2)',
        },
        {
          id: `q-pdf-ag3-${Date.now()}`,
          question: 'What spatial resolution is minimum recommended for multi-spectral remote sensing in fragmented smallholder plots?',
          options: ['10m to 20m (Sentinel-2 / LISS-IV class)', '250m (MODIS class)', '1km coarse resolution', '50m weather satellite'],
          correctAnswer: '10m to 20m (Sentinel-2 / LISS-IV class)',
          explanation: 'High resolution optical bands (10-20m) are essential to resolve field bunds and mixed-cropping patterns in Indian agrarian parcels.',
          sourceCitation: `${uploadedPdf.name} (Remote Sensing Annexure, Page 44)`,
          bloomLevel: 'Analysis (Level 4)',
        },
      ];

      const healthQuestions = [
        {
          id: `q-pdf-hl1-${Date.now()}`,
          question: 'Under National Health Accounts standards, what constitutes Out-of-Pocket Expenditure (OOPE)?',
          options: ['Direct household spending net of insurance reimbursements', 'Total government budget allocation for tertiary care', 'Insurance premium paid by employer', 'Hospital operational infrastructure expenditure'],
          correctAnswer: 'Direct household spending net of insurance reimbursements',
          explanation: 'OOPE measures the direct point-of-service payments made by patients that are not covered or reimbursed by public or private health financing.',
          sourceCitation: `${uploadedPdf.name} (NHA Guidelines, Page 16)`,
          bloomLevel: 'Comprehension (Level 2)',
        },
        {
          id: `q-pdf-hl2-${Date.now()}`,
          question: 'What is the standard statistical formula for calculating Maternal Mortality Ratio (MMR)?',
          options: ['(Maternal deaths / Total live births) * 100,000', '(Maternal deaths / Total female population) * 1,000', '(Maternal deaths / Total institutional deliveries) * 10,000', '(Maternal deaths / Total pregnancies) * 100'],
          correctAnswer: '(Maternal deaths / Total live births) * 100,000',
          explanation: 'MMR represents maternal deaths resulting from pregnancy-related complications per 100,000 live births in a given reference year.',
          sourceCitation: `${uploadedPdf.name} (Vital Indicators Standard, Page 27)`,
          bloomLevel: 'Analysis (Level 3)',
        },
      ];

      let baseQuestions = mospiQuestions;
      if (generatorDepartment.includes('Agriculture')) baseQuestions = agriQuestions;
      else if (generatorDepartment.includes('Health')) baseQuestions = healthQuestions;

      const selectedQuestions = baseQuestions.slice(0, generatorCount);

      const quizObject = {
        id: `quiz-${Date.now()}`,
        title: quizTitle || `Assessment Quiz: ${uploadedPdf.name.replace(/\.[^/.]+$/, '')}`,
        department: generatorDepartment,
        competency: generatorCompetency,
        difficulty: generatorDifficulty,
        sourcePdf: uploadedPdf.name,
        fileSize: uploadedPdf.size,
        pages: uploadedPdf.pages,
        timeLimitMins: generatorCount * 2,
        questions: selectedQuestions,
        passPercentage: 70,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setGeneratedQuiz(quizObject);
      setQuizViewMode('review');
      setQuizAnswers({});
      setQuizScoreResult(null);

      // Add to review queue so it's also available in Question Review
      setQuestionsForReview(prev => [
        ...selectedQuestions.map(q => ({
          ...q,
          department: generatorDepartment,
          competency: generatorCompetency,
          difficulty: generatorDifficulty,
          source: q.sourceCitation,
          status: 'AI_GENERATED',
        })),
        ...prev,
      ]);

      setIsGenerating(false);
      setGenerationStep(0);
    }, 2400);
  };

  const handleSelectQuizOption = (qId, optionString) => {
    setQuizAnswers(prev => ({
      ...prev,
      [qId]: optionString,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!generatedQuiz) return;
    let correctCount = 0;
    generatedQuiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const total = generatedQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= generatedQuiz.passPercentage;

    setQuizScoreResult({
      correct: correctCount,
      total,
      percentage,
      passed,
    });
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizScoreResult(null);
  };

  const handleSaveQuizToBank = () => {
    if (!generatedQuiz) return;
    const newItems = generatedQuiz.questions.map(q => ({
      id: `q-bank-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      question: q.question,
      answer: q.correctAnswer,
      department: generatedQuiz.department,
      competency: generatedQuiz.competency,
      difficulty: generatedQuiz.difficulty,
    }));
    setApprovedQuestions(prev => [...newItems, ...prev]);
    alert(`Success! All ${newItems.length} quiz questions have been approved and saved to the official Question Bank.`);
  };

  const handleSimulateAIGeneration = () => {
    handleGenerateQuizFromPdf();
  };

  const handleSendAssistant = () => {
    if (!assistantInput.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: assistantInput };
    setAssistantMessages(prev => [...prev, userMsg]);
    const prompt = assistantInput;
    setAssistantInput('');

    setTimeout(() => {
      let reply = `Here is a tailored faculty recommendation for "${prompt}": Ensure the assessment covers both theoretical foundations (40%) and practical field scenario execution (60%).`;
      if (prompt.toLowerCase().includes('quiz') || prompt.toLowerCase().includes('question')) {
        reply = `I have drafted 3 sample questions on ${generatorCompetency} with Bloom's taxonomy Level 3 (Application). Would you like me to send them to the Question Review queue?`;
      } else if (prompt.toLowerCase().includes('programme') || prompt.toLowerCase().includes('plan')) {
        reply = `I have outlined a 4-Week Comprehensive Training Programme: Week 1: Foundational Frameworks; Week 2: Virtual Lab Simulations; Week 3: Data Quality & Error Auditing; Week 4: Capstone Assessment & Viva.`;
      }
      setAssistantMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: reply }]);
    }, 800);
  };

  // Filtered lists
  const filteredMaterials = materials.filter((mat) => {
    const matchesDept =
      materialDeptFilter === 'all' ||
      mat.departmentId === materialDeptFilter ||
      mat.department.toLowerCase().includes(materialDeptFilter.toLowerCase());
    const matchesSearch =
      mat.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      (mat.competency && mat.competency.toLowerCase().includes(materialSearch.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const filteredTrainees = employees.filter((emp) => {
    const matchesDept =
      traineeDeptFilter === 'all' ||
      emp.department.toLowerCase().includes(traineeDeptFilter.toLowerCase());
    const matchesSearch =
      emp.name.toLowerCase().includes(traineeSearch.toLowerCase()) ||
      (emp.currentRole && emp.currentRole.toLowerCase().includes(traineeSearch.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="h-screen w-full flex flex-col bg-gov-off-white text-gov-gray-800 overflow-hidden">
      {/* ── Top Fixed Bar ────────────────────────────────────────────── */}
      <header className="h-14 bg-gov-navy text-white flex items-center justify-between px-4 sm:px-6 border-b border-white/10 shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white lg:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gov-saffron flex items-center justify-center font-bold text-white shadow-xs">
              <GraduationCap size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white leading-tight">Trainer Portal</h1>
                <span className="badge-gov-saffron text-[9px] font-bold hidden sm:inline-block">NSSTA Academy</span>
              </div>
              <p className="text-[10px] text-white/70 hidden md:block">Faculty Studio · Curriculum Authoring & Trainee Progress Evaluation</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowAddMaterialModal(true)}
            className="btn-gov-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <Upload size={14} />
            <span className="hidden sm:inline">Upload Material</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_generator')}
            className="btn-gov-saffron text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">AI Generator</span>
          </button>

          <button
            onClick={onBackToPortals}
            className="flex items-center gap-1 text-white/80 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded text-xs font-semibold border border-white/20 transition-colors"
          >
            <ChevronLeft size={14} />
            <span className="hidden md:inline">Portals</span>
          </button>
        </div>
      </header>

      {/* ── Main App Shell: Sidebar + Content ────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        {/* Desktop Stationary Sidebar */}
        <div className="hidden lg:flex shrink-0 w-64 h-full border-r border-gov-gray-200">
          <TrainerSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onBackToPortals={onBackToPortals}
            materialsCount={materials.length}
            traineesCount={employees.length}
            pendingReviewCount={questionsForReview.length}
            unreadNotificationsCount={notificationsList.filter(n => n.unread).length}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-gov-navy/50 z-40 lg:hidden backdrop-blur-xs"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <TrainerSidebar
                mobile
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onBackToPortals={onBackToPortals}
                onClose={() => setMobileSidebarOpen(false)}
                materialsCount={materials.length}
                traineesCount={employees.length}
                pendingReviewCount={questionsForReview.length}
                unreadNotificationsCount={notificationsList.filter(n => n.unread).length}
              />
            </>
          )}
        </AnimatePresence>

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 h-full min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gov-gray-200 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-gov-gray-500 mb-1">
                <span>Trainer Studio</span>
                <ChevronRight size={12} />
                <span className="font-semibold text-gov-navy capitalize">{activeTab.replace('_', ' ')}</span>
              </div>
              <h2 className="text-xl font-bold text-gov-navy capitalize">
                {activeTab === 'dashboard' && 'Faculty Intelligence & Dashboard'}
                {activeTab === 'courses' && 'My Accredited Courses & Syllabi'}
                {activeTab === 'materials' && 'Department-Wise Learning Materials'}
                {activeTab === 'ai_generator' && 'AI MCQ & Assessment Generator'}
                {activeTab === 'question_review' && 'Faculty Question Review Gate'}
                {activeTab === 'question_bank' && 'Official Approved Question Bank'}
                {activeTab === 'programmes' && 'Civil Service Training Programmes'}
                {activeTab === 'performance' && 'Employee Performance & Progress Tracking'}
                {activeTab === 'analytics' && 'Training & Competency Analytics'}
                {activeTab === 'assistant' && 'Faculty AI Training Assistant'}
                {activeTab === 'notifications' && 'Faculty Notifications & Announcements'}
                {activeTab === 'profile' && 'Faculty & Trainer Profile'}
                {activeTab === 'settings' && 'Studio & Examination Settings'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gov-saffron/10 text-gov-navy text-xs font-bold border border-gov-saffron/20">
                <span className="w-2 h-2 rounded-full bg-gov-saffron animate-pulse" />
                NSSTA Live Faculty Node
              </span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              1. DASHBOARD
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'LEARNING MATERIALS', value: String(materials.length), sub: 'Across 5 Ministries', icon: FileText, color: 'text-gov-blue', border: 'border-l-gov-blue' },
                  { title: 'ENROLLED TRAINEES', value: String(employees.length), sub: 'Active Civil Servants', icon: TrendingUp, color: 'text-gov-green', border: 'border-l-gov-green' },
                  { title: 'PENDING QUESTIONS', value: String(questionsForReview.length), sub: 'Awaiting Faculty Gate', icon: ClipboardCheck, color: 'text-purple-600', border: 'border-l-purple-600' },
                  { title: 'AVERAGE PASS RATE', value: '78.4%', sub: 'Diagnostic Benchmark', icon: BarChart3, color: 'text-gov-saffron', border: 'border-l-gov-saffron' },
                ].map((st) => {
                  const Icon = st.icon;
                  return (
                    <div key={st.title} className={`gov-card p-4 border-l-4 ${st.border} flex items-start justify-between shadow-xs`}>
                      <div>
                        <span className="text-[10px] font-bold text-gov-gray-400 uppercase tracking-wider">{st.title}</span>
                        <p className="text-2xl font-black text-gov-navy mt-1">{st.value}</p>
                        <p className="text-xs text-gov-gray-500 mt-0.5">{st.sub}</p>
                      </div>
                      <div className="w-9 h-9 rounded-gov bg-gov-off-white flex items-center justify-center">
                        <Icon size={18} className={st.color} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="gov-card p-5 space-y-2 hover:border-gov-blue transition-colors">
                  <FileText size={20} className="text-gov-blue" />
                  <h4 className="text-sm font-bold text-gov-navy">Publish Department Material</h4>
                  <p className="text-xs text-gov-gray-500">Provide official guidelines and operational manuals to civil servants.</p>
                  <button onClick={() => setActiveTab('materials')} className="text-xs font-bold text-gov-blue hover:underline flex items-center gap-1 pt-1">
                    Open Materials Directory <ChevronRight size={14} />
                  </button>
                </div>

                <div className="gov-card p-5 space-y-2 hover:border-purple-600 transition-colors">
                  <Sparkles size={20} className="text-purple-600" />
                  <h4 className="text-sm font-bold text-gov-navy">Extract AI MCQs</h4>
                  <p className="text-xs text-gov-gray-500">Generate multiple-choice items automatically from government documents.</p>
                  <button onClick={() => setActiveTab('ai_generator')} className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1 pt-1">
                    Launch AI Generator <ChevronRight size={14} />
                  </button>
                </div>

                <div className="gov-card p-5 space-y-2 hover:border-gov-green transition-colors">
                  <TrendingUp size={20} className="text-gov-green" />
                  <h4 className="text-sm font-bold text-gov-navy">Inspect Trainee Progress</h4>
                  <p className="text-xs text-gov-gray-500">Review diagnostic scores and assign faculty coaching recommendations.</p>
                  <button onClick={() => setActiveTab('performance')} className="text-xs font-bold text-gov-green hover:underline flex items-center gap-1 pt-1">
                    Track Trainee Performance <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              2. MY COURSES
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Survey Sampling Foundations', dept: 'MoSPI / NSO', enrolled: 142, hours: '32h', rating: '4.9/5' },
                  { title: 'Data Quality Auditing in District Surveys', dept: 'MoSPI / NSO', enrolled: 89, hours: '24h', rating: '4.8/5' },
                  { title: 'Crop Cutting & Geospatial Estimation', dept: 'Agriculture (DES)', enrolled: 114, hours: '28h', rating: '4.7/5' },
                  { title: 'Public Health Surveillance Standards', dept: 'Health (MoHFW)', enrolled: 95, hours: '36h', rating: '4.9/5' },
                  { title: 'Labour Force Survey & Wage Indices', dept: 'Labour (MoLE)', enrolled: 78, hours: '20h', rating: '4.8/5' },
                  { title: 'UDISE+ School Level Telemetry Auditing', dept: 'Education (MoE)', enrolled: 102, hours: '18h', rating: '4.7/5' },
                ].map((c) => (
                  <div key={c.title} className="gov-card p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="badge-gov-info text-[9px]">{c.dept}</span>
                      <span className="text-gov-green text-xs font-bold">★ {c.rating}</span>
                    </div>
                    <h4 className="text-xs font-bold text-gov-navy leading-snug">{c.title}</h4>
                    <div className="p-2.5 bg-gov-off-white rounded border border-gov-gray-200 flex items-center justify-between text-xs text-gov-gray-600">
                      <span><strong>{c.enrolled}</strong> Enrolled</span>
                      <span>Duration: {c.hours}</span>
                    </div>
                    <button className="btn-gov-secondary text-xs w-full justify-center">Manage Syllabus & Batches</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              3. LEARNING MATERIALS (DEPARTMENT WISE)
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="gov-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gov-blue" />
                    <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">Department Curricula Filter:</span>
                  </div>
                  <button onClick={() => setShowAddMaterialModal(true)} className="btn-gov-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs">
                    <Plus size={14} /> Upload Learning Material
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {DEPARTMENTS.map((dept) => {
                    const active = materialDeptFilter === dept.id;
                    return (
                      <button
                        key={dept.id}
                        onClick={() => setMaterialDeptFilter(dept.id)}
                        className={`px-3 py-1.5 rounded-gov text-xs font-bold shrink-0 transition-all ${
                          active ? 'bg-gov-navy text-white shadow-xs' : 'bg-gov-off-white text-gov-gray-600 hover:bg-gov-gray-200 border border-gov-gray-200'
                        }`}
                      >
                        {dept.name}
                      </button>
                    );
                  })}
                </div>

                <div className="relative pt-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gov-gray-400" />
                  <input
                    type="text"
                    placeholder="Search materials by title or competency..."
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    className="gov-input pl-9 text-xs w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMaterials.map((mat) => (
                  <div key={mat.id} className="gov-card p-5 space-y-3 hover:border-gov-blue transition-all shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="badge-gov-info text-[9px] font-bold block w-fit mb-1">{mat.department}</span>
                          <h4 className="text-xs font-bold text-gov-navy leading-snug">{mat.title}</h4>
                        </div>
                        <button onClick={() => handleDeleteMaterial(mat.id)} className="p-1 text-gov-gray-400 hover:text-gov-red transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gov-gray-600 line-clamp-2 leading-relaxed">{mat.description}</p>
                      <div className="p-2.5 bg-gov-off-white rounded border border-gov-gray-200 flex items-center justify-between text-[11px]">
                        <div><span className="text-gov-gray-400 font-medium">Competency: </span><span className="font-bold text-gov-navy">{mat.competency}</span></div>
                        <span className="badge-gov-success text-[9px]">{mat.type}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gov-gray-200 flex items-center justify-between text-xs text-gov-gray-500">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span>{mat.size || '3.2 MB'}</span> · <span>{mat.pages || '32 pages'}</span> · <span className="font-bold text-purple-600">{mat.questionsCount || 10} MCQs</span>
                      </div>
                      <button onClick={() => setPreviewMaterial(mat)} className="btn-gov-secondary text-[11px] py-1 px-2.5 flex items-center gap-1">
                        <Eye size={12} /> Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              4. AI MCQ GENERATOR
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'ai_generator' && (
            <div className="space-y-6">
              {/* Header card with mode switcher */}
              <div className="gov-card p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gov-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gov-navy">AI MCQ & Assessment Quiz Generator</h3>
                      <p className="text-xs text-gov-gray-500">
                        Upload official ministry training documents or circulars (.pdf, .docx) to auto-synthesize full interactive assessment quizzes with Bloom's taxonomy.
                      </p>
                    </div>
                  </div>

                  {/* Mode Toggles */}
                  <div className="inline-flex rounded-md border border-gov-gray-200 p-1 bg-gov-gray-50 text-xs">
                    <button
                      type="button"
                      onClick={() => setGeneratorMode('pdf')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded font-bold transition-all ${
                        generatorMode === 'pdf'
                          ? 'bg-gov-navy text-white shadow-xs'
                          : 'text-gov-gray-600 hover:text-gov-navy'
                      }`}
                    >
                      <FileUp size={14} />
                      <span>Upload PDF / Document</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGeneratorMode('text')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded font-bold transition-all ${
                        generatorMode === 'text'
                          ? 'bg-gov-navy text-white shadow-xs'
                          : 'text-gov-gray-600 hover:text-gov-navy'
                      }`}
                    >
                      <FileText size={14} />
                      <span>Paste Manual Excerpt</span>
                    </button>
                  </div>
                </div>

                {/* Mode 1: PDF Document Upload & Presets */}
                {generatorMode === 'pdf' ? (
                  <div className="space-y-5 pt-2">
                    {/* Upload Dropzone */}
                    <div className="relative border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 transition-colors rounded-xl p-6 text-center cursor-pointer group">
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handlePdfFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload PDF or training manual"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 text-purple-700 flex items-center justify-center transition-all">
                          <FileUp size={24} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-gov-navy">Click to browse or drop training PDF here</span>
                          <p className="text-[11px] text-gov-gray-500 mt-0.5">Supports official government manuals (.PDF, .DOCX, .TXT) up to 50MB</p>
                        </div>
                      </div>
                    </div>

                    {/* Active Uploaded Document Card */}
                    {uploadedPdf && (
                      <div className="p-4 bg-white border border-purple-200 rounded-lg shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-red-100 text-red-700 font-bold text-xs flex flex-col items-center justify-center">
                            <span className="text-[9px] uppercase font-mono">PDF</span>
                            <FileText size={14} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gov-navy">{uploadedPdf.name}</span>
                              <span className="badge-gov-success text-[9px]">{uploadedPdf.isPreset ? 'Official Ministry Preset' : 'Uploaded File'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-gov-gray-500 mt-0.5">
                              <span>Size: <strong className="text-gov-navy">{uploadedPdf.size}</strong></span>
                              <span>•</span>
                              <span>Pages: <strong className="text-gov-navy">{uploadedPdf.pages} pages</strong></span>
                              <span>•</span>
                              <span>Department: <strong className="text-gov-blue">{uploadedPdf.department}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Document Ready for Quiz Extraction
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Pre-loaded Ministry Training Manuals */}
                    <div>
                      <label className="block font-bold text-gov-navy mb-2 text-xs">
                        Or select from Verified Ministry Training Manuals:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {sampleMinistryPdfs.map((preset) => {
                          const isSelected = uploadedPdf?.name === preset.name;
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleSelectPresetPdf(preset)}
                              className={`p-2.5 rounded border text-left transition-all text-xs flex flex-col justify-between gap-1.5 ${
                                isSelected
                                  ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                                  : 'border-gov-gray-200 bg-white hover:border-purple-300 hover:bg-gov-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className={`font-bold line-clamp-1 text-[11px] ${isSelected ? 'text-purple-900' : 'text-gov-navy'}`}>
                                  {preset.name}
                                </span>
                                {isSelected && <CheckCircle size={14} className="text-purple-700 shrink-0 mt-0.5" />}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-gov-gray-500">
                                <span>{preset.department}</span>
                                <span className="font-mono">{preset.pages} pgs</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mode 2: Manual Text Excerpt */
                  <div className="space-y-3 pt-2">
                    <label className="block font-bold text-gov-navy text-xs">Source Text / Manual Excerpt</label>
                    <textarea
                      rows={5}
                      placeholder="Paste textbook paragraph, circular extract, or policy standard here..."
                      value={generatorText}
                      onChange={(e) => setGeneratorText(e.target.value)}
                      className="gov-input w-full resize-none text-xs"
                    />
                  </div>
                )}

                {/* Quiz Configuration Settings */}
                <div className="border-t border-gov-gray-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Quiz Synthesis Configuration</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="md:col-span-2">
                      <label className="block font-bold text-gov-navy mb-1">Assessment Quiz Title</label>
                      <input
                        type="text"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="e.g., Assessment Quiz: Operational Sampling Standards"
                        className="gov-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gov-navy mb-1">Target Department</label>
                      <select
                        value={generatorDepartment}
                        onChange={(e) => setGeneratorDepartment(e.target.value)}
                        className="gov-input w-full"
                      >
                        {DEPARTMENTS.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gov-navy mb-1">Target Competency</label>
                      <select
                        value={generatorCompetency}
                        onChange={(e) => setGeneratorCompetency(e.target.value)}
                        className="gov-input w-full"
                      >
                        <option value="Survey Sampling">Survey Sampling</option>
                        <option value="Data Quality & Validation">Data Quality & Validation</option>
                        <option value="Crop Estimation">Crop Estimation</option>
                        <option value="Health Indicators">Health Indicators</option>
                        <option value="Labour Statistics">Labour Statistics</option>
                        <option value="Education Indicators">Education Indicators</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gov-navy mb-1">Taxonomy / Difficulty</label>
                      <select
                        value={generatorDifficulty}
                        onChange={(e) => setGeneratorDifficulty(e.target.value)}
                        className="gov-input w-full"
                      >
                        <option value="Foundation (Level 1)">Foundation (Level 1)</option>
                        <option value="Intermediate (Level 2)">Intermediate (Level 2)</option>
                        <option value="Advanced / Applied (Level 3)">Advanced / Applied (Level 3)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gov-navy mb-1">Question Count</label>
                      <select
                        value={generatorCount}
                        onChange={(e) => setGeneratorCount(Number(e.target.value))}
                        className="gov-input w-full"
                      >
                        <option value={3}>3 MCQs (Diagnostic)</option>
                        <option value={5}>5 MCQs (Standard Assessment)</option>
                        <option value={10}>10 MCQs (Comprehensive Exam)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex items-end">
                      <button
                        onClick={handleGenerateQuizFromPdf}
                        disabled={isGenerating || !uploadedPdf}
                        className="btn-gov-primary w-full py-2.5 px-6 flex items-center justify-center gap-2 font-bold shadow-sm bg-gradient-to-r from-purple-700 to-gov-navy text-white hover:from-purple-800 hover:to-gov-navy"
                      >
                        <Sparkles size={16} />
                        <span>{isGenerating ? 'Extracting & Generating Quiz...' : 'Generate Official Quiz from PDF'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Animated Multi-Step Generation Progress */}
                {isGenerating && (
                  <div className="p-5 bg-purple-50/80 border border-purple-200 rounded-xl space-y-4 animate-pulse">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <RefreshCw size={16} className="text-purple-700 animate-spin" />
                        <span className="font-bold text-purple-900">{generationStatusText}</span>
                      </div>
                      <span className="text-[11px] font-mono text-purple-700">Step {generationStep} of 4</span>
                    </div>

                    {/* Progress Step Bubbles */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                      <div className={`p-2 rounded border ${generationStep >= 1 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gov-gray-400 border-gov-gray-200'}`}>
                        1. PDF OCR Parsing
                      </div>
                      <div className={`p-2 rounded border ${generationStep >= 2 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gov-gray-400 border-gov-gray-200'}`}>
                        2. Concept Extraction
                      </div>
                      <div className={`p-2 rounded border ${generationStep >= 3 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gov-gray-400 border-gov-gray-200'}`}>
                        3. Bloom's Taxonomy
                      </div>
                      <div className={`p-2 rounded border ${generationStep >= 4 ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gov-gray-400 border-gov-gray-200'}`}>
                        4. Quiz Compilation
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ══════════════════════════════════════════════════════════════
                  GENERATED ASSESSMENT QUIZ STUDIO
                 ══════════════════════════════════════════════════════════════ */}
              {generatedQuiz && (
                <div className="gov-card p-6 space-y-6 border-2 border-purple-300 shadow-md">
                  {/* Studio Header Banner */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-gov-navy to-purple-950 text-white p-5 rounded-xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge-gov-saffron text-[10px] font-bold">Generated Assessment Quiz</span>
                        <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                          {generatedQuiz.department}
                        </span>
                        <span className="bg-emerald-500/30 text-emerald-200 text-[10px] px-2 py-0.5 rounded border border-emerald-400/40">
                          Pass Benchmark: {generatedQuiz.passPercentage}%
                        </span>
                      </div>
                      <h3 className="text-base font-bold tracking-tight">{generatedQuiz.title}</h3>
                      <p className="text-xs text-white/80 flex items-center gap-2">
                        <span>Source: <strong>{generatedQuiz.sourcePdf}</strong></span>
                        <span>•</span>
                        <span>{generatedQuiz.questions.length} Questions</span>
                        <span>•</span>
                        <span>Time Limit: {generatedQuiz.timeLimitMins} mins</span>
                      </p>
                    </div>

                    {/* View Switcher & Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="inline-flex rounded-md border border-white/30 p-1 bg-black/20 text-xs">
                        <button
                          type="button"
                          onClick={() => setQuizViewMode('review')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-all ${
                            quizViewMode === 'review'
                              ? 'bg-white text-gov-navy shadow-xs'
                              : 'text-white/80 hover:text-white'
                          }`}
                        >
                          <BookOpen size={13} />
                          <span>Review Mode</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuizViewMode('test')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-all ${
                            quizViewMode === 'test'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'text-white/80 hover:text-white'
                          }`}
                        >
                          <Play size={13} />
                          <span>Interactive Test Mode</span>
                        </button>
                      </div>

                      <button
                        onClick={handleSaveQuizToBank}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <CheckCircle size={14} />
                        <span>Save to Question Bank</span>
                      </button>
                    </div>
                  </div>

                  {/* SUB-VIEW 1: FACULTY REVIEW MODE */}
                  {quizViewMode === 'review' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-gov-gray-600 pb-2 border-b border-gov-gray-200">
                        <span className="font-semibold">
                          Faculty Review: All questions are verified against source document citations and Bloom's taxonomy.
                        </span>
                        <span className="text-[11px] text-gov-blue font-mono font-bold">
                          {generatedQuiz.questions.length} Items Evaluated
                        </span>
                      </div>

                      {generatedQuiz.questions.map((q, idx) => (
                        <div key={q.id} className="p-5 bg-gov-gray-50/60 border border-gov-gray-200 rounded-xl space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-gov-navy text-white text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="badge-gov-info text-[10px]">{q.bloomLevel}</span>
                              <span className="text-gov-gray-500 font-mono text-[11px]">{q.sourceCitation}</span>
                            </div>
                            <span className="badge-gov-outline text-[10px]">{generatedQuiz.competency}</span>
                          </div>

                          <p className="text-sm font-bold text-gov-navy leading-snug">
                            {q.question}
                          </p>

                          {/* 4 Options Display */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isCorrect = opt === q.correctAnswer;
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                                    isCorrect
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                                      : 'bg-white border-gov-gray-200 text-gov-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-gov-gray-100 text-gov-gray-600'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span>{opt}</span>
                                  </div>
                                  {isCorrect && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold shrink-0">
                                      ✓ Correct
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Faculty Rationale / Source Citation */}
                          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1">
                            <span className="font-bold text-gov-blue block">Faculty Explanation & Methodological Citation:</span>
                            <p className="text-gov-navy text-[11px] leading-relaxed">{q.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SUB-VIEW 2: INTERACTIVE TEST MODE */}
                  {quizViewMode === 'test' && (
                    <div className="space-y-5">
                      {/* Score Result Banner (if submitted) */}
                      {quizScoreResult && (
                        <div className={`p-5 rounded-xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          quizScoreResult.passed
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                            : 'bg-amber-50 border-amber-500 text-amber-950'
                        }`}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {quizScoreResult.passed ? (
                                <CheckCircle size={24} className="text-emerald-600" />
                              ) : (
                                <AlertCircle size={24} className="text-amber-600" />
                              )}
                              <h4 className="text-base font-bold">
                                {quizScoreResult.passed
                                  ? 'Assessment Passed! Benchmark Achieved.'
                                  : 'Assessment Incomplete (Below 70% Benchmark)'}
                              </h4>
                            </div>
                            <p className="text-xs">
                              You scored <strong>{quizScoreResult.correct} out of {quizScoreResult.total}</strong> questions correctly ({quizScoreResult.percentage}%).
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleRetakeQuiz}
                              className="px-4 py-2 rounded text-xs font-bold bg-white border border-gov-gray-300 text-gov-navy hover:bg-gov-gray-50 shadow-xs flex items-center gap-1.5"
                            >
                              <RefreshCw size={13} />
                              <span>Retake Test</span>
                            </button>
                            <button
                              onClick={() => setQuizViewMode('review')}
                              className="px-4 py-2 rounded text-xs font-bold bg-gov-navy text-white hover:bg-gov-navy-dark shadow-xs flex items-center gap-1.5"
                            >
                              <BookOpen size={13} />
                              <span>Review Explanations</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Interactive Questions List */}
                      <div className="space-y-5">
                        {generatedQuiz.questions.map((q, idx) => {
                          const selectedAnswer = quizAnswers[q.id];
                          const isEvaluated = quizScoreResult !== null;
                          const isCorrect = selectedAnswer === q.correctAnswer;

                          return (
                            <div key={q.id} className="p-5 bg-white border border-gov-gray-200 rounded-xl space-y-3 shadow-xs">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  <span className="font-bold text-gov-navy">Question {idx + 1} of {generatedQuiz.questions.length}</span>
                                </div>
                                <span className="text-[11px] text-gov-gray-500 font-mono">{q.bloomLevel}</span>
                              </div>

                              <p className="text-sm font-semibold text-gov-navy leading-snug">
                                {q.question}
                              </p>

                              {/* Selectable Options */}
                              <div className="space-y-2 pt-1">
                                {q.options.map((opt, optIdx) => {
                                  const isSelected = selectedAnswer === opt;
                                  let optionStyle = 'border-gov-gray-200 bg-white hover:border-purple-400 text-gov-navy';

                                  if (isEvaluated) {
                                    if (opt === q.correctAnswer) {
                                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                                    } else if (isSelected && !isCorrect) {
                                      optionStyle = 'border-red-400 bg-red-50 text-red-900';
                                    } else {
                                      optionStyle = 'border-gov-gray-200 opacity-60 text-gov-gray-500';
                                    }
                                  } else if (isSelected) {
                                    optionStyle = 'border-purple-600 bg-purple-50/80 font-bold text-purple-950 shadow-xs';
                                  }

                                  return (
                                    <label
                                      key={optIdx}
                                      onClick={() => !isEvaluated && handleSelectQuizOption(q.id, opt)}
                                      className={`p-3 rounded-lg border text-xs flex items-center gap-3 cursor-pointer transition-all ${optionStyle}`}
                                    >
                                      <input
                                        type="radio"
                                        name={`quiz-q-${q.id}`}
                                        checked={isSelected || false}
                                        onChange={() => {}}
                                        disabled={isEvaluated}
                                        className="text-purple-600 focus:ring-purple-500"
                                      />
                                      <span className="w-5 h-5 rounded bg-gov-gray-100 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span className="flex-1">{opt}</span>
                                      {isEvaluated && opt === q.correctAnswer && (
                                        <span className="text-[10px] text-emerald-700 font-bold">✓ Correct Answer</span>
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Test Submission Bar */}
                      {!quizScoreResult && (
                        <div className="p-4 bg-gov-gray-50 border border-gov-gray-200 rounded-xl flex items-center justify-between">
                          <span className="text-xs text-gov-gray-600">
                            Answered <strong className="text-gov-navy">{Object.keys(quizAnswers).length}</strong> of <strong className="text-gov-navy">{generatedQuiz.questions.length}</strong> questions
                          </span>
                          <button
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(quizAnswers).length === 0}
                            className="btn-gov-primary py-2 px-6 text-xs font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Check size={14} />
                            <span>Submit Assessment Quiz</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Studio Footer Action Toolbar */}
                  <div className="pt-4 border-t border-gov-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-gov-gray-500 text-[11px]">
                        Saved to faculty session. Questions automatically mirrored in Question Review queue.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveQuizToBank}
                        className="btn-gov-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <CheckCircle size={13} />
                        <span>Add All to Question Bank</span>
                      </button>
                      <button
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedQuiz, null, 2));
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", `${generatedQuiz.title.replace(/\s+/g, '_')}.json`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                        }}
                        className="btn-gov-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Download size={13} />
                        <span>Export JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              5. QUESTION REVIEW
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'question_review' && (
            <div className="space-y-4">
              <div className="p-3 bg-gov-saffron/10 border border-gov-saffron/30 rounded text-xs text-gov-navy flex items-center justify-between">
                <span className="font-semibold">Review Queue: {questionsForReview.length} items awaiting faculty approval</span>
                <span className="badge-gov-saffron text-[9px]">Government Quality Standard</span>
              </div>

              {questionsForReview.map((q) => (
                <div key={q.id} className="gov-card p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="badge-gov-info text-[9px]">{q.department}</span>
                      <span className="font-bold text-gov-blue">{q.competency}</span>
                    </div>
                    <span className="text-gov-gray-400 font-semibold">{q.difficulty}</span>
                  </div>

                  <p className="text-sm font-bold text-gov-navy leading-snug">{q.question}</p>
                  
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {q.options.map((opt, i) => (
                        <div
                          key={opt}
                          className={`p-2 rounded border text-xs ${
                            opt === q.correctAnswer
                              ? 'bg-gov-green/10 border-gov-green text-gov-navy font-bold'
                              : 'bg-gov-off-white border-gov-gray-200 text-gov-gray-600'
                          }`}
                        >
                          <span className="text-[10px] text-gov-gray-400 mr-1.5">{String.fromCharCode(65 + i)}.</span>
                          {opt} {opt === q.correctAnswer && <span className="text-gov-green text-[10px] ml-1">(Correct)</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gov-gray-500 italic">Source: {q.source}</p>

                  <div className="pt-2 border-t border-gov-gray-200 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleRejectQuestion(q.id)}
                      className="py-1.5 px-3 bg-gov-red/10 hover:bg-gov-red/20 text-gov-red rounded text-xs font-bold transition-colors"
                    >
                      Reject Item
                    </button>
                    <button
                      onClick={() => handleApproveQuestion(q)}
                      className="py-1.5 px-4 bg-gov-green hover:bg-gov-green/90 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Check size={14} />
                      <span>Approve to Bank</span>
                    </button>
                  </div>
                </div>
              ))}

              {questionsForReview.length === 0 && (
                <div className="gov-card p-12 text-center space-y-2">
                  <CheckCircle2 size={36} className="mx-auto text-gov-green" />
                  <h4 className="text-sm font-bold text-gov-navy">All items reviewed!</h4>
                  <p className="text-xs text-gov-gray-500">Your review queue is clear. Generate more items using the AI MCQ Generator.</p>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              6. QUESTION BANK
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'question_bank' && (
            <div className="space-y-4">
              <div className="gov-card p-4 flex items-center justify-between text-xs">
                <span className="font-bold text-gov-navy">Verified Question Bank ({approvedQuestions.length} Items Active)</span>
                <span className="badge-gov-success text-[10px]">Ready for Diagnostic Quizzes</span>
              </div>

              <div className="space-y-3">
                {approvedQuestions.map((q) => (
                  <div key={q.id} className="gov-card p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="badge-gov-info text-[9px]">{q.department}</span>
                      <span className="font-bold text-gov-navy">{q.competency}</span>
                    </div>
                    <p className="font-bold text-gov-navy">{q.question}</p>
                    <div className="p-2 bg-gov-green/5 border border-gov-green/20 rounded text-gov-navy">
                      <span className="font-bold text-gov-green">Approved Key: </span> {q.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              7. TRAINING PROGRAMMES
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'programmes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'NSS 78th Round Specialization Programme', dates: '01 Oct 2026 – 31 Oct 2026', batch: 'Batch A (MoSPI)', officers: 48, status: 'ENROLLING' },
                  { title: 'Objective Crop Yield & Drone Remote Sensing', dates: '15 Oct 2026 – 15 Nov 2026', batch: 'DES Agriculture', officers: 32, status: 'SCHEDULED' },
                  { title: 'National Health Accounts & Epidemiological Reporting', dates: '20 Oct 2026 – 20 Nov 2026', batch: 'MoHFW Cohort 3', officers: 28, status: 'SCHEDULED' },
                  { title: 'Periodic Labour Force Field Supervisors Workshop', dates: '05 Nov 2026 – 25 Nov 2026', batch: 'Labour Bureau', officers: 40, status: 'UPCOMING' },
                ].map((prog) => (
                  <div key={prog.title} className="gov-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge-gov-saffron text-[9px]">{prog.status}</span>
                      <span className="text-[11px] text-gov-gray-400">{prog.batch}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gov-navy">{prog.title}</h4>
                    <div className="p-2.5 bg-gov-off-white rounded border border-gov-gray-200 text-xs flex justify-between">
                      <span>{prog.dates}</span>
                      <span className="font-bold text-gov-blue">{prog.officers} Officers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              8. EMPLOYEE PERFORMANCE
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="gov-card p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 max-w-md">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gov-gray-400" />
                    <input
                      type="text"
                      placeholder="Search trainee by name..."
                      value={traineeSearch}
                      onChange={(e) => setTraineeSearch(e.target.value)}
                      className="gov-input pl-9 text-xs w-full"
                    />
                  </div>
                  <select
                    value={traineeDeptFilter}
                    onChange={(e) => setTraineeDeptFilter(e.target.value)}
                    className="gov-input text-xs w-52"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="gov-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gov-gray-100 text-gov-gray-600 font-bold border-b border-gov-gray-200">
                      <tr>
                        <th className="p-3">Trainee Officer</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Diagnostic Score</th>
                        <th className="p-3">Learning Path Progress</th>
                        <th className="p-3 text-center">Critical Gaps</th>
                        <th className="p-3 text-center">Intervention</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gov-gray-200">
                      {filteredTrainees.map((emp) => {
                        const score = emp.diagnosticScore || emp.overallCompetency || 65;
                        const progress = emp.learningProgressPercent || 65;
                        const isAttention = score < 60;
                        return (
                          <tr key={emp.id} className="hover:bg-gov-gray-50 transition-colors">
                            <td className="p-3 font-bold text-gov-navy">{emp.name}</td>
                            <td className="p-3 font-medium text-gov-navy">{emp.department}</td>
                            <td className="p-3 font-bold">{score}%</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{progress}%</span>
                                <div className="progress-track h-2 w-20 bg-gov-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-gov-blue rounded-full" style={{ width: `${progress}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className="badge-gov-danger text-[10px]">{emp.criticalGapsCount || 1} Gaps</span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isAttention ? 'bg-gov-red text-white' : 'bg-gov-green/15 text-gov-green'
                              }`}>
                                {isAttention ? 'Needs Coaching' : 'On Track'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button onClick={() => setSelectedTrainee(emp)} className="btn-gov-secondary text-[11px] py-1 px-2.5">
                                Track Progress
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              9. TRAINING ANALYTICS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="gov-card p-5 space-y-2 border-l-4 border-l-gov-blue">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase">Average Pre-Test Score</span>
                  <p className="text-2xl font-black text-gov-navy">58.2%</p>
                  <p className="text-xs text-gov-gray-500">Initial diagnostic baseline across 1,420 civil servants</p>
                </div>
                <div className="gov-card p-5 space-y-2 border-l-4 border-l-gov-green">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase">Post-Module Assessment Score</span>
                  <p className="text-2xl font-black text-gov-green">79.6%</p>
                  <p className="text-xs text-gov-gray-500">+21.4% competency gain after micro-learning path</p>
                </div>
                <div className="gov-card p-5 space-y-2 border-l-4 border-l-gov-saffron">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase">Virtual Lab Completion</span>
                  <p className="text-2xl font-black text-gov-saffron">84.0%</p>
                  <p className="text-xs text-gov-gray-500">Hands-on simulation exercises submitted</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              10. AI TRAINING ASSISTANT
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'assistant' && (
            <div className="gov-card p-5 space-y-4 flex flex-col h-[520px]">
              <div className="flex items-center gap-2 border-b border-gov-gray-200 pb-3">
                <Bot size={20} className="text-gov-saffron" />
                <div>
                  <h4 className="text-sm font-bold text-gov-navy">Faculty Copilot & Syllabus Planner</h4>
                  <p className="text-[11px] text-gov-gray-500">Ask questions about question formulation, curriculum design, or trainee gap remediation.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-2 text-xs">
                {assistantMessages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-gov max-w-lg ${
                      m.sender === 'user' ? 'bg-gov-navy text-white' : 'bg-gov-off-white border border-gov-gray-200 text-gov-navy'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gov-gray-200">
                <input
                  type="text"
                  placeholder="Ask assistant (e.g. 'Draft a 3-week course on public health data' or 'Formulate a sampling quiz')..."
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAssistant()}
                  className="gov-input flex-1 text-xs"
                />
                <button onClick={handleSendAssistant} className="btn-gov-primary text-xs py-2 px-4 flex items-center gap-1.5">
                  <Send size={13} /> Send
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              11. NOTIFICATIONS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'notifications' && (
            <div className="gov-card divide-y divide-gov-gray-200 shadow-xs">
              <div className="p-4 bg-gov-off-white flex justify-between items-center text-xs">
                <span className="font-bold text-gov-navy uppercase tracking-wider">Faculty Announcements & Circulars</span>
                <span className="badge-gov-info text-[10px]">{notificationsList.length} Total</span>
              </div>
              {notificationsList.map((n) => (
                <div key={n.id} className="p-4 flex items-start justify-between gap-3 hover:bg-gov-gray-50 text-xs">
                  <div>
                    <h5 className="font-bold text-gov-navy flex items-center gap-2">
                      {n.title}
                      {n.unread && <span className="w-2 h-2 rounded-full bg-gov-saffron" />}
                    </h5>
                    <p className="text-gov-gray-600 mt-1">{n.text}</p>
                  </div>
                  <span className="text-[10px] text-gov-gray-400 shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              12. TRAINER PROFILE
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="gov-card p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gov-saffron/20 text-gov-navy flex items-center justify-center font-bold text-2xl">
                  TR
                </div>
                <div>
                  <h3 className="text-base font-bold text-gov-navy">Dr. Rajeshwar Sharma</h3>
                  <p className="text-xs text-gov-gray-600">Chief Faculty & Domain Specialist · NSSTA Academy</p>
                  <p className="text-[11px] text-gov-gray-400 mt-0.5">Faculty ID: TR-NSSTA-101 · rajeshwar.sharma@nssta.gov.in</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-gov-gray-200">
                <div className="p-3 bg-gov-off-white rounded border border-gov-gray-200 space-y-1">
                  <span className="text-gov-gray-400 font-bold block uppercase text-[10px]">Academic Specialization</span>
                  <p className="font-bold text-gov-navy">Survey Sampling, Geospatial Modeling, and National Accounts</p>
                </div>
                <div className="p-3 bg-gov-off-white rounded border border-gov-gray-200 space-y-1">
                  <span className="text-gov-gray-400 font-bold block uppercase text-[10px]">Accreditation & Cadre</span>
                  <p className="font-bold text-gov-navy">Senior Training Specialist, Subordinate & Indian Statistical Service Cadres</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              13. SETTINGS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div className="gov-card p-6 space-y-5 text-xs">
              <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                <Settings size={18} className="text-gov-navy" />
                Faculty Studio & Assessment Engine Configuration
              </h3>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 bg-gov-off-white rounded border border-gov-gray-200">
                  <div>
                    <p className="font-bold text-gov-navy">Automated Question Review Routing</p>
                    <p className="text-gov-gray-500 text-[11px]">Automatically send AI-extracted questions to review queue upon document upload</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-gov-navy rounded" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gov-off-white rounded border border-gov-gray-200">
                  <div>
                    <p className="font-bold text-gov-navy">Trainee Critical Gap Alert Threshold</p>
                    <p className="text-gov-gray-500 text-[11px]">Trigger urgent faculty coaching intervention flag when trainee score falls below 60%</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-gov-navy rounded" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gov-off-white rounded border border-gov-gray-200">
                  <div>
                    <p className="font-bold text-gov-navy">iGOT Sync Notifications</p>
                    <p className="text-gov-gray-500 text-[11px]">Receive push alerts when new officers complete their initial competency diagnostic</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-gov-navy rounded" />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODALS (MATERIAL UPLOAD, TRAINEE AUDIT, PREVIEW) ─────────── */}
      <AnimatePresence>
        {showAddMaterialModal && (
          <div className="fixed inset-0 bg-gov-navy/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-gov border border-gov-gray-300 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 bg-gov-navy text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-gov-saffron" />
                  <h3 className="text-sm font-bold text-white">Publish Department Learning Material</h3>
                </div>
                <button onClick={() => setShowAddMaterialModal(false)} className="p-1 rounded text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateMaterial} className="p-5 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gov-navy mb-1">Target Department / Ministry *</label>
                  <select
                    value={newMaterial.department}
                    onChange={(e) => setNewMaterial({ ...newMaterial, department: e.target.value })}
                    className="gov-input w-full font-semibold"
                  >
                    {DEPARTMENTS.filter(d => d.id !== 'all').map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gov-navy mb-1">Material Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sampling Strategy for Urban Household Expenditures.pdf"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                    className="gov-input w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Target Competency *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Survey Sampling"
                      value={newMaterial.competency}
                      onChange={(e) => setNewMaterial({ ...newMaterial, competency: e.target.value })}
                      className="gov-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Material Format</label>
                    <select
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                      className="gov-input w-full"
                    >
                      <option value="PDF Document">PDF Document</option>
                      <option value="DOCX Handbook">Word DOCX Manual</option>
                      <option value="Simulation Guide">Virtual Lab Guide</option>
                      <option value="Presentation">Slide Deck (.pptx)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gov-navy mb-1">Curriculum Summary & Objectives</label>
                  <textarea
                    rows={3}
                    placeholder="Describe how this document strengthens departmental competency..."
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                    className="gov-input w-full resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-gov-gray-200 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowAddMaterialModal(false)} className="btn-gov-secondary text-xs py-2 px-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gov-primary text-xs py-2 px-5 font-bold">
                    Publish to Department
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Trainee Progress Inspection Modal */}
      <AnimatePresence>
        {selectedTrainee && (
          <div className="fixed inset-0 bg-gov-navy/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-gov border border-gov-gray-300 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 bg-gov-navy text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-gov-green" />
                  <h3 className="text-sm font-bold text-white">Trainee Progress & Competency Audit</h3>
                </div>
                <button onClick={() => setSelectedTrainee(null)} className="p-1 rounded text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                <div className="p-4 bg-gov-off-white rounded-gov border border-gov-gray-200 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gov-navy text-white flex items-center justify-center font-bold text-base">
                    {selectedTrainee.avatarInitials || 'EM'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gov-navy">{selectedTrainee.name}</h4>
                    <p className="text-gov-gray-600">{selectedTrainee.currentRole}</p>
                    <p className="text-[10px] text-gov-gray-400">{selectedTrainee.department} · {selectedTrainee.cadre}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gov-gray-400 block">COMPETENCY</span>
                    <span className="text-xl font-black text-gov-navy">{selectedTrainee.overallCompetency}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded border border-gov-gray-200 text-center">
                    <span className="text-[10px] text-gov-gray-400 font-bold block">DIAGNOSTIC TEST</span>
                    <span className="text-base font-black text-gov-blue">{selectedTrainee.diagnosticScore || selectedTrainee.overallCompetency}%</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-gov-gray-200 text-center">
                    <span className="text-[10px] text-gov-gray-400 font-bold block">LEARNING PROGRESS</span>
                    <span className="text-base font-black text-gov-green">{selectedTrainee.learningProgressPercent || 65}%</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-gov-gray-200 text-center">
                    <span className="text-[10px] text-gov-gray-400 font-bold block">CRITICAL GAPS</span>
                    <span className="text-base font-black text-gov-red">{selectedTrainee.criticalGapsCount || 1} Gaps</span>
                  </div>
                </div>

                <div className="p-3 bg-gov-saffron/10 rounded border border-gov-saffron/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-gov-navy font-bold">
                    <MessageSquare size={14} className="text-gov-saffron" />
                    <span>Faculty Coaching & Feedback Note</span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Enter trainer guidance note for this officer..."
                    value={trainerFeedback}
                    onChange={(e) => setTrainerFeedback(e.target.value)}
                    className="gov-input w-full bg-white resize-none text-xs"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        alert('Faculty feedback recorded and synced with Officer Learning Path!');
                        setTrainerFeedback('');
                      }}
                      className="btn-gov-saffron text-[11px] py-1 px-3"
                    >
                      Save Feedback Note
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gov-off-white border-t border-gov-gray-200 flex justify-end shrink-0">
                <button onClick={() => setSelectedTrainee(null)} className="btn-gov-primary text-xs py-1.5 px-4">
                  Close Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Material Preview Modal */}
      <AnimatePresence>
        {previewMaterial && (
          <div className="fixed inset-0 bg-gov-navy/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-gov border border-gov-gray-300 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-gov-navy text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-gov-saffron" />
                  <h3 className="text-sm font-bold text-white truncate max-w-xs">{previewMaterial.title}</h3>
                </div>
                <button onClick={() => setPreviewMaterial(null)} className="p-1 rounded text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-3 text-xs">
                <span className="badge-gov-info text-[10px]">{previewMaterial.department}</span>
                <h4 className="text-sm font-bold text-gov-navy">{previewMaterial.title}</h4>
                <p className="text-gov-gray-600 leading-relaxed">{previewMaterial.description}</p>
                <div className="p-3 bg-gov-off-white rounded border border-gov-gray-200 space-y-1">
                  <div className="flex justify-between"><span className="text-gov-gray-500">Author:</span><span className="font-bold text-gov-navy">{previewMaterial.author || 'NSSTA Faculty'}</span></div>
                  <div className="flex justify-between"><span className="text-gov-gray-500">Target Competency:</span><span className="font-bold text-gov-blue">{previewMaterial.competency}</span></div>
                  <div className="flex justify-between"><span className="text-gov-gray-500">Generated Questions:</span><span className="font-bold text-purple-600">{previewMaterial.questionsCount} MCQs</span></div>
                </div>
              </div>

              <div className="p-4 bg-gov-off-white border-t border-gov-gray-200 flex items-center justify-between shrink-0">
                <button onClick={() => alert(`Downloading "${previewMaterial.title}"...`)} className="btn-gov-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Download size={13} /> Download Document
                </button>
                <button onClick={() => setPreviewMaterial(null)} className="btn-gov-primary text-xs py-1.5 px-4">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
