import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  TrendingUp,
  BookOpen,
  Zap,
  BarChart2,
  Shield,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Map,
  Database,
  Building2,
  GraduationCap,
  UserCheck,
  ExternalLink,
  ChevronDown,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Compass,
  Briefcase,
  Share2,
  BadgeCheck,
  Activity,
  Cpu,
  FileCheck,
  ClipboardCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

export default function LandingPage({ onQuickLogin }) {
  const navigate = useNavigate();
  const { t, isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState('radar');
  const [activeFrameworkTab, setActiveFrameworkTab] = useState('domain');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Quick Demo Trigger
  const handleLaunchDemo = (portal = 'employee') => {
    if (onQuickLogin) {
      onQuickLogin(portal);
    } else {
      localStorage.setItem('ks_is_logged_in', 'true');
      if (portal === 'employee') {
        localStorage.setItem('ks_active_portal', 'employee_selection');
        navigate('/employee/select');
      } else if (portal === 'trainer') {
        localStorage.setItem('ks_active_portal', 'trainer');
        navigate('/trainer');
      } else if (portal === 'admin') {
        localStorage.setItem('ks_active_portal', 'admin');
        navigate('/admin');
      } else {
        localStorage.setItem('ks_active_portal', 'portal_selection');
        navigate('/portal');
      }
    }
  };

  const stats = [
    { label: t('statOfficersLabel'), value: t('statOfficersVal'), icon: Users, sub: isHindi ? 'सत्यापित प्रोफाइल्स' : 'Verified Profiles' },
    { label: t('statDomainsLabel'), value: t('statDomainsVal'), icon: Target, sub: isHindi ? 'सांख्यिकी डोमेन' : 'Statistical Streams' },
    { label: t('statCoursesLabel'), value: t('statCoursesVal'), icon: BookOpen, sub: isHindi ? 'कर्मयोगी मॉड्यूल्स' : 'iGOT Integrated' },
    { label: t('statAiQuestionsLabel'), value: t('statAiQuestionsVal'), icon: ClipboardCheck, sub: isHindi ? 'ब्लूम अनुरूप' : 'Bloom Aligned' },
    { label: t('statMinistriesLabel'), value: t('statMinistriesVal'), icon: Building2, sub: isHindi ? 'संबद्ध विभाग' : 'Central & States' },
    { label: t('statGapReductionLabel'), value: t('statGapReductionVal'), icon: TrendingUp, sub: isHindi ? 'त्रैमासिक प्रगति' : 'Quarterly Velocity' },
  ];

  const frameworkData = {
    domain: [
      { code: 'DOM-01', title: isHindi ? 'राष्ट्रीय लेखा सांख्यिकी (National Accounts)' : 'National Accounts & Macro Indicators', level: 'Level 4 / Expert', desc: isHindi ? 'जीडीपी गणना, आपूर्ति-उपयोग तालिकाएं और एसएनए-२००८ पद्धतियां।' : 'GDP estimation, Supply-Use Tables, quarterly national accounts, and SNA-2008 frameworks.' },
      { code: 'DOM-02', title: isHindi ? 'नमूना सर्वेक्षण अभिकल्प (Survey Design)' : 'Sample Survey Methodology & Sampling Theory', level: 'Level 4 / Advanced', desc: isHindi ? 'स्तरीकृत यादृच्छिक नमूनाकरण, बहु-चरणीय सर्वेक्षण और भार गणना।' : 'Stratified multi-stage sampling, design effects, sampling variance, and non-sampling error control.' },
      { code: 'DOM-03', title: isHindi ? 'उपभोक्ता मूल्य सूचकांक (CPI / WPI)' : 'Price Statistics, CPI & Index Numbers', level: 'Level 3 / Proficient', desc: isHindi ? 'उपभोक्ता मूल्य सूचकांक, लास्पेरेस सूत्र और बास्केट भार समायोजन।' : 'Consumer Price Index basket compilation, Laspeyres & Paasche formulations, and hedonic pricing.' },
      { code: 'DOM-04', title: isHindi ? 'कृषि एवं औद्योगिक सांख्यिकी (ASI & Agristat)' : 'Agricultural & Annual Survey of Industries (ASI)', level: 'Level 4 / Advanced', desc: isHindi ? 'उद्योगों का वार्षिक सर्वेक्षण, कारखाना अधिनियम सत्यापन और फसल कटाई प्रयोग।' : 'Factory schedule validation, gross fixed capital formation, and crop estimation surveys.' },
    ],
    foundational: [
      { code: 'FND-01', title: isHindi ? 'लोक सेवा नैतिकता एवं सत्यनिष्ठा' : 'Public Service Ethics & Data Integrity', level: 'Level 5 / Master', desc: isHindi ? 'आधिकारिक आंकड़ों की निष्पक्षता, गोपनीयता और राष्ट्रीय संहिताओं का पालन।' : 'Uncompromising data objectivity, statistical confidentiality, and code of statistical practice.' },
      { code: 'FND-02', title: isHindi ? 'नागरिक-केंद्रित नीति विश्लेषण' : 'Citizen-Centric Evidence Based Policy', level: 'Level 4 / Advanced', desc: isHindi ? 'कल्याणकारी योजनाओं के मूल्यांकन हेतु डेटा-आधारित रिपोर्टिंग।' : 'Translating complex macro data into actionable citizen welfare and policy recommendations.' },
      { code: 'FND-03', title: isHindi ? 'विश्लेषणात्मक समस्या समाधान' : 'Structured Analytical Problem Solving', level: 'Level 3 / Proficient', desc: isHindi ? 'अनियमितताओं की पहचान, डेटा विसंगति समाधान और गुणवत्ता आश्वासन।' : 'Anomaly triage, root-cause diagnosis in survey returns, and data discrepancy resolution.' },
      { code: 'FND-04', title: isHindi ? 'पार-विभागीय समन्वय' : 'Inter-Ministerial Data Coordination', level: 'Level 3 / Proficient', desc: isHindi ? 'विभिन्न मंत्रालयों के बीच डेटा मानकों का मानकीकरण और सहयोग।' : 'Harmonization of statistical metadata and registries across Line Ministries.' },
    ],
    functional: [
      { code: 'FNC-01', title: isHindi ? 'पायथन एवं आर में डेटा स्वचालन' : 'Python & R for Official Data Automation', level: 'Level 4 / Advanced', desc: isHindi ? 'पैंडास, नमपाई और आर-शाइनी के साथ सर्वेक्षण डेटा की स्वचालित सफाई।' : 'Automated ETL pipelines, Pandas, tidyverse, and reproducible statistical computation.' },
      { code: 'FNC-02', title: isHindi ? 'भू-स्थानिक विश्लेषण एवं जीआईएस (GIS)' : 'Spatial Data Analysis & Census GIS', level: 'Level 3 / Proficient', desc: isHindi ? 'सर्वेक्षण सीमाओं का भू-संदर्भन और स्थानिक क्लस्टर मानचित्रण।' : 'Geo-referencing enumeration blocks, QGIS workflows, and spatial pattern detection.' },
      { code: 'FNC-03', title: isHindi ? 'बड़े पैमाने पर सर्वेक्षण टैबलेट स्वचालन (CAPI)' : 'CAPI / CATI Field Survey Digital Automation', level: 'Level 4 / Advanced', desc: isHindi ? 'टैबलेट-आधारित क्षेत्र प्रविष्टि, तात्कालिक सत्यापन और डेटा ट्रांसमिशन।' : 'Computer-Assisted Personal Interviewing schedule design, validation rules, and sync.' },
      { code: 'FNC-04', title: isHindi ? 'सुरक्षित सरकारी डेटाबेस एवं एसक्यूएल' : 'Government SQL Data Warehousing & Security', level: 'Level 3 / Proficient', desc: isHindi ? 'रिलेशनल स्कीमा डिजाइन, अनुक्रमित क्वेरी और एक्सेस कंट्रोल ऑडिट।' : 'Complex relational queries, indexing large census extracts, and access control audit logs.' },
    ]
  };

  const steps = [
    {
      num: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: Users,
      color: 'bg-gov-blue text-white',
    },
    {
      num: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: ClipboardCheck,
      color: 'bg-gov-saffron text-white',
    },
    {
      num: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: Target,
      color: 'bg-gov-navy text-white',
    },
    {
      num: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: BookOpen,
      color: 'bg-gov-green text-white',
    },
    {
      num: '05',
      title: t('step5Title'),
      desc: t('step5Desc'),
      icon: Cpu,
      color: 'bg-indigo-600 text-white',
    },
    {
      num: '06',
      title: t('step6Title'),
      desc: t('step6Desc'),
      icon: Award,
      color: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className={`min-h-screen bg-gov-off-white text-gov-gray-800 ${isHindi ? 'font-devanagari' : ''}`}>
      {/* ── 1. TOP GOVERNMENT IDENTITY & TRICOLOR BAR ───────────────────────── */}
      <div className="bg-gov-navy text-white text-xs border-b border-white/10 w-full relative z-50">
        <div className="h-1 bg-gradient-to-r from-gov-saffron via-white to-gov-green w-full" />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-white/40 bg-white/10 flex items-center justify-center font-bold text-gov-saffron shrink-0 text-[10px] tracking-wider">
              GOI
            </div>
            <div className="truncate">
              <span className="font-bold tracking-wide text-white">{t('bharatSarkar')}</span>
              <span className="text-white/40 mx-2 hidden sm:inline">|</span>
              <span className="text-white/90 hidden sm:inline">{t('ministryName')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* National Initiative Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded text-[11px] border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-medium">{t('igotIntegrated')}</span>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher variant="landing" />
          </div>
        </div>
      </div>

      {/* ── 2. MAIN HEADER & NAVIGATION ───────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gov-gray-200 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-gov-navy via-gov-blue to-[#133e69] flex items-center justify-center text-white font-black text-lg shadow-sm border border-gov-blue/40">
              KS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-gov-navy">KarmaSiksha</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gov-saffron-light text-gov-saffron border border-gov-saffron/30 px-1.5 py-0.5 rounded">
                  MoSPI
                </span>
              </div>
              <p className="text-xs text-gov-gray-600 font-semibold leading-none mt-0.5">
                {isHindi ? 'शासकीय योग्यता एवं क्षमता विकास पोर्टल' : 'Government Competency Intelligence Portal'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-6 text-xs font-bold text-gov-gray-700">
            <a href="#showcase" className="hover:text-gov-blue transition-colors">{t('navFeatures')}</a>
            <a href="#portals" className="hover:text-gov-blue transition-colors">{t('navPortals')}</a>
            <a href="#workflow" className="hover:text-gov-blue transition-colors">{t('navWorkflow')}</a>
            <a href="#framework" className="hover:text-gov-blue transition-colors">{t('navFramework')}</a>
            <a href="#impact" className="hover:text-gov-blue transition-colors">{t('navImpact')}</a>
            <a href="#faq" className="hover:text-gov-blue transition-colors">{t('navFaq')}</a>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleLaunchDemo('portal')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold text-gov-navy bg-gov-off-white hover:bg-gov-gray-100 border border-gov-gray-300 transition-colors"
            >
              <Compass size={13} className="text-gov-blue" />
              <span>{isHindi ? 'पोर्टल समूह' : 'Portal Hub'}</span>
            </button>

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold text-white bg-gov-navy hover:bg-gov-navy-light shadow-xs transition-colors"
            >
              <UserCheck size={14} className="text-gov-saffron" />
              <span>{t('navLogin')}</span>
            </Link>

            <button
              onClick={() => handleLaunchDemo('employee')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold text-white bg-gov-saffron hover:bg-[#c66525] shadow-xs transition-all hover:scale-102"
            >
              <ShieldCheck size={14} />
              <span className="hidden md:inline">{isHindi ? 'लाइव पोर्टल डेमो' : 'Live Portal Demo'}</span>
              <span className="md:hidden">{isHindi ? 'डेमो' : 'Demo'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── 3. HERO SECTION (THE BELOVED ORIGINAL HERO WITH FLAWLESS TEXT VISIBILITY) ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06152B] via-gov-navy to-[#0F2D54] text-white py-16 lg:py-24 border-b border-white/10">
        {/* Subtle decorative grid and lighting glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#1D5F9E_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="absolute -top-40 right-10 w-96 h-96 bg-gov-saffron/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 left-10 w-96 h-96 bg-gov-blue/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Top Emblem & Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-gov-saffron animate-ping shrink-0" />
              <span className="text-xs font-semibold text-gov-saffron-light">
                {t('heroBadge')}
              </span>
            </div>

            {/* Hero Main Heading with glowing golden highlight and 100% visible text */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
              <span>{t('heroTitlePrefix')}</span>{' '}
              <span
                className="inline-block pb-1 bg-gradient-to-r from-gov-saffron via-amber-300 to-[#FCE38A] bg-clip-text text-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: '#FFB347'
                }}
              >
                {t('heroTitleHighlight')}
              </span>{' '}
              <span>{t('heroTitleSuffix')}</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
              {t('heroDescription')}
            </p>

            {/* Dynamic CTA Row */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
              <button
                onClick={() => handleLaunchDemo('employee')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded text-sm font-bold text-white bg-gov-saffron hover:bg-[#c66525] shadow-lg hover:shadow-gov-saffron/30 transition-all hover:translate-y-[-1px]"
              >
                <Play size={16} fill="currentColor" />
                <span>{t('heroSecondaryCta')}</span>
              </button>

              <button
                onClick={() => handleLaunchDemo('portal')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm transition-all"
              >
                <span>{t('heroPrimaryCta')}</span>
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => handleLaunchDemo('admin')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 border border-white/15 transition-all"
              >
                <Shield size={16} className="text-emerald-400" />
                <span>{t('heroAdminCta')}</span>
              </button>
            </div>

            {/* Key Trust Points Bar */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs text-slate-100 font-semibold">
              <div className="flex items-center justify-center gap-2 bg-white/10 py-2.5 px-3 rounded border border-white/15">
                <CheckCircle2 size={15} className="text-gov-saffron-light shrink-0" />
                <span>{t('heroTrust1')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 py-2.5 px-3 rounded border border-white/15">
                <CheckCircle2 size={15} className="text-blue-300 shrink-0" />
                <span>{t('heroTrust2')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 py-2.5 px-3 rounded border border-white/15">
                <CheckCircle2 size={15} className="text-emerald-300 shrink-0" />
                <span>{t('heroTrust3')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 py-2.5 px-3 rounded border border-white/15">
                <CheckCircle2 size={15} className="text-amber-300 shrink-0" />
                <span>{t('heroTrust4')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. NATIONAL IMPACT STATISTICS STRIP ───────────────────────────── */}
      <section id="impact" className="py-12 bg-white border-b border-gov-gray-200 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="text-center p-3.5 rounded bg-gov-off-white border border-gov-gray-200 hover:border-gov-blue/40 transition-colors">
                  <div className="w-8 h-8 rounded bg-gov-blue-light text-gov-blue flex items-center justify-center mx-auto mb-2">
                    <Icon size={16} />
                  </div>
                  <div className="text-2xl font-black text-gov-navy leading-none mb-1 font-mono">
                    {s.value}
                  </div>
                  <div className="text-xs font-bold text-gray-900 leading-snug">
                    {s.label}
                  </div>
                  <div className="text-[11px] text-gov-gray-600 mt-1 font-medium">
                    {s.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. INTERACTIVE PLATFORM INTELLIGENCE SHOWCASE ─────────────────── */}
      <section id="showcase" className="py-20 bg-gov-off-white border-b border-gov-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gov-blue-light text-gov-blue mb-3 border border-gov-blue/20">
              <Activity size={13} />
              {t('showcaseTitle')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gov-navy tracking-tight pb-1">
              {isHindi ? 'प्रत्यक्ष कार्यप्रणाली एवं नैदानिक ​​इंजन' : 'Live Platform Cockpit & Diagnostic Engine'}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto mt-2 font-medium">
              {t('showcaseSubtitle')}
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-4 py-2.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'radar'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:text-gov-navy border border-gov-gray-300'
              }`}
            >
              <Activity size={14} className={activeTab === 'radar' ? 'text-gov-saffron' : 'text-gray-500'} />
              <span>{t('tabRadar')}</span>
            </button>

            <button
              onClick={() => setActiveTab('gap')}
              className={`px-4 py-2.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'gap'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:text-gov-navy border border-gov-gray-300'
              }`}
            >
              <Layers size={14} className={activeTab === 'gap' ? 'text-gov-saffron' : 'text-gray-500'} />
              <span>{t('tabSkillGap')}</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ai'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:text-gov-navy border border-gov-gray-300'
              }`}
            >
              <FileCheck size={14} className={activeTab === 'ai' ? 'text-gov-saffron' : 'text-gray-500'} />
              <span>{t('tabAiStudio')}</span>
            </button>

            <button
              onClick={() => setActiveTab('passport')}
              className={`px-4 py-2.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'passport'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:text-gov-navy border border-gov-gray-300'
              }`}
            >
              <BadgeCheck size={14} className={activeTab === 'passport' ? 'text-gov-saffron' : 'text-gray-500'} />
              <span>{t('tabPassport')}</span>
            </button>
          </div>

          {/* Active Tab Preview Card */}
          <div className="bg-white rounded border border-gov-gray-300 shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'radar' && (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 sm:p-8"
                >
                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="badge-gov-blue text-[11px] font-bold">
                        {isHindi ? 'वास्तविक समय बेंचमार्किंग' : 'Real-time Benchmarking'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gov-navy">
                        {t('radarTitle')}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                        {t('radarDesc')}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold p-3 rounded bg-gov-off-white border border-gov-gray-200">
                          <span className="text-gray-700">{isHindi ? 'लक्ष्य स्तर (Target Level)' : 'Cadre Required Level'}</span>
                          <span className="font-mono text-gov-navy">{t('radarStat1')}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold p-3 rounded bg-gov-off-white border border-gov-gray-200">
                          <span className="text-gray-700">{isHindi ? 'सत्यापित वर्तमान स्तर' : 'Verified Current Level'}</span>
                          <span className="font-mono text-gov-saffron">{t('radarStat2')}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold p-3 rounded bg-gov-off-white border border-gov-gray-200">
                          <span className="text-gray-700">{isHindi ? 'प्रवीणता समग्र इंडेक्स' : 'Aggregate Readiness'}</span>
                          <span className="font-mono text-gov-green">{t('radarStat3')}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => handleLaunchDemo('employee')}
                          className="btn-gov-primary text-xs font-bold py-2.5 px-4"
                        >
                          <span>{isHindi ? 'मेरा व्यक्तिगत रडार देखें' : 'View My Competency Radar'}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Adjusted SVG Radar: Wide 460x260 ViewBox so NO letters are clipped */}
                    <div className="lg:col-span-7 bg-[#08182E] rounded p-6 text-white border border-slate-700 shadow-inner">
                      <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-gov-saffron" />
                          <span className="text-xs font-mono font-bold text-slate-200">ARJUN SHARMA · ISS SENIOR INVESTIGATOR</span>
                        </div>
                        <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-amber-300 font-bold border border-white/20">
                          CADRE BENCHMARK: 4.0
                        </span>
                      </div>

                      {/* SVG Visual Pentagon Radar Simulation with full letter visibility */}
                      <div className="relative py-2 flex items-center justify-center">
                        <svg viewBox="0 0 460 260" className="w-full max-w-md h-56">
                          {/* Concentric Grid lines */}
                          <polygon points="230,35 345,95 305,210 155,210 115,95" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                          <polygon points="230,60 315,105 285,185 175,185 145,105" fill="none" stroke="#475569" strokeWidth="1" />
                          <polygon points="230,85 285,115 265,160 195,160 175,115" fill="none" stroke="#334155" strokeWidth="1" />

                          {/* Target Cadre Shape (Amber) */}
                          <polygon points="230,45 330,100 295,200 165,200 125,100" fill="rgba(224,123,57,0.18)" stroke="#E07B39" strokeWidth="2" />
                          {/* Actual Verified Score Shape (Blue) */}
                          <polygon points="230,75 295,115 275,175 180,165 140,110" fill="rgba(29,95,158,0.45)" stroke="#60A5FA" strokeWidth="2" />

                          {/* Competency Axis Text Labels - Placed with ample padding inside the 460px width */}
                          <text x="230" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Sample Surveys (3.2 / 4.5)</text>
                          <text x="355" y="98" textAnchor="start" fill="#FFFFFF" fontSize="10" fontWeight="bold">Python ETL (2.1 / 4.0)</text>
                          <text x="305" y="228" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">National Accounts (3.8 / 4.0)</text>
                          <text x="155" y="228" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Field CAPI (4.1 / 4.0)</text>
                          <text x="105" y="98" textAnchor="end" fill="#FFFFFF" fontSize="10" fontWeight="bold">Data Ethics (4.5 / 5.0)</text>
                        </svg>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-white/15 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-2 bg-gov-saffron rounded-xs" />
                          <span>Cadre Requirement (4.0)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-2 bg-blue-400 rounded-xs" />
                          <span>Actual Assessed Score</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'gap' && (
                <motion.div
                  key="gap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 sm:p-8"
                >
                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="badge-gov-saffron text-[11px] font-bold">
                        {isHindi ? 'स्वचालित कौशल निदान' : 'Automated Diagnostic System'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gov-navy">
                        {t('skillGapTitle')}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                        {t('skillGapDesc')}
                      </p>

                      <div className="space-y-2.5 pt-2">
                        <div className="p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2.5">
                          <AlertTriangle size={15} className="text-gov-red shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <p className="font-bold text-gov-red">{t('skillGapTag1')}</p>
                            <p className="text-gray-700 mt-0.5 font-medium">
                              {isHindi ? 'अनुशंसित iGOT पाठ्यक्रम: उन्नत प्रतिचयन तकनीक (Module S-402)' : 'Priority iGOT Recommendation: Advanced Sampling Designs (NSSTA Module 402)'}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                          <Clock size={15} className="text-gov-amber shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <p className="font-bold text-gov-amber">{t('skillGapTag2')}</p>
                            <p className="text-gray-700 mt-0.5 font-medium">
                              {isHindi ? 'अनुशंसित वर्चुअल लैब: ऑटोमेटेड डेटा क्लीनिंग सैंडबॉक्स' : 'Recommended Virtual Lab: Automated Census Data Cleaning Pipeline'}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded bg-green-50 border border-green-200 flex items-start gap-2.5">
                          <CheckCircle2 size={15} className="text-gov-green shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <p className="font-bold text-gov-green">{t('skillGapTag3')}</p>
                            <p className="text-gray-700 mt-0.5 font-medium">
                              {isHindi ? 'सत्यापित दक्षता: संवर्ग मानक से अधिक प्रदर्शन' : 'Mastery Confirmed: Certified to conduct state-level training'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Skill Gap Table Card */}
                    <div className="lg:col-span-7 bg-white rounded border border-gov-gray-300 p-5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-gov-gray-200 pb-3 mb-4">
                        <p className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                          {isHindi ? 'कौशल अंतर सारणी (Skill Gap Matrix)' : 'Skill Gap Matrix & Curated Remediations'}
                        </p>
                        <span className="text-[11px] font-bold text-gov-red bg-red-100 px-2 py-0.5 rounded border border-red-200">
                          2 Gaps Identified
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-gov-navy">Advanced Sampling Theory</span>
                            <span className="text-gov-red font-mono font-bold">-1.8 Delta</span>
                          </div>
                          <div className="w-full bg-gov-gray-100 h-2.5 rounded-full overflow-hidden flex">
                            <div className="bg-gov-red h-full rounded-full" style={{ width: '45%' }} />
                            <div className="bg-gov-gray-200 h-full" style={{ width: '35%' }} />
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-600 mt-1 font-semibold">
                            <span>Current: 2.2 / 5.0</span>
                            <span>Target: 4.0 / 5.0</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-gov-navy">Survey Data Automation (Python/R)</span>
                            <span className="text-gov-amber font-mono font-bold">-0.9 Delta</span>
                          </div>
                          <div className="w-full bg-gov-gray-100 h-2.5 rounded-full overflow-hidden flex">
                            <div className="bg-gov-amber h-full rounded-full" style={{ width: '62%' }} />
                            <div className="bg-gov-gray-200 h-full" style={{ width: '28%' }} />
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-600 mt-1 font-semibold">
                            <span>Current: 3.1 / 5.0</span>
                            <span>Target: 4.0 / 5.0</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-gov-navy">National Accounts Compilation</span>
                            <span className="text-gov-green font-mono font-bold">+0.4 Verified Strength</span>
                          </div>
                          <div className="w-full bg-gov-gray-100 h-2.5 rounded-full overflow-hidden flex">
                            <div className="bg-gov-green h-full rounded-full" style={{ width: '92%' }} />
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-600 mt-1 font-semibold">
                            <span>Current: 4.4 / 5.0</span>
                            <span>Target: 4.0 / 5.0</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gov-gray-200 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">
                          {isHindi ? 'निजीकृत अध्ययन योजना तैयार है' : 'Personalized iGOT remediation ready'}
                        </span>
                        <button
                          onClick={() => handleLaunchDemo('employee')}
                          className="btn-gov-secondary text-xs font-bold py-1.5 px-3"
                        >
                          {isHindi ? 'अंतराल रिपोर्ट खोलें' : 'Open Diagnostic Report'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 sm:p-8"
                >
                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="badge-gov-green text-[11px] font-bold">
                        {isHindi ? 'प्रमाणित प्रश्न बैंक' : 'Standardized Question Bank'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gov-navy">
                        {t('aiStudioTitle')}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                        {t('aiStudioDesc')}
                      </p>

                      <ul className="space-y-2 text-xs font-semibold text-gray-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-gov-green" />
                          <span>{t('aiStudioTag1')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-gov-green" />
                          <span>{t('aiStudioTag2')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-gov-green" />
                          <span>{t('aiStudioTag3')}</span>
                        </li>
                      </ul>

                      <div className="pt-2">
                        <button
                          onClick={() => handleLaunchDemo('trainer')}
                          className="btn-gov-primary text-xs font-bold py-2.5 px-4"
                        >
                          <span>{isHindi ? 'संकाय स्टूडियो में जाएं' : 'Open Faculty Studio'}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Visual Assessment Process Mock */}
                    <div className="lg:col-span-7 bg-[#08182E] rounded p-6 text-white border border-slate-700">
                      <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <FileCheck size={15} className="text-gov-saffron" />
                          <span className="text-slate-200">CURRICULUM_PIPELINE // MoSPI_Circular_2026.pdf</span>
                        </div>
                        <span className="text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700 font-bold">
                          STATUS: COMPILED
                        </span>
                      </div>

                      <div className="bg-slate-800 rounded p-4 border border-slate-700 text-xs space-y-2 mb-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="font-bold text-amber-300">Q-104 · Bloom Level: Application & Analysis</span>
                          <span className="font-mono">Difficulty: 0.72</span>
                        </div>
                        <p className="text-white font-semibold leading-relaxed">
                          "Under the Consumer Price Index (Rural/Urban) revision, which weighting adjustment is mandated when introducing newly surveyed consumption baskets?"
                        </p>
                        <div className="space-y-2 pt-1 text-[11px] text-slate-200">
                          <div className="p-2 rounded bg-emerald-900/50 border border-emerald-500/60 text-emerald-200 flex items-center justify-between">
                            <span>A) Splicing factor application using dual price collection overlap</span>
                            <span className="text-[10px] font-bold text-emerald-300">VERIFIED ANSWER</span>
                          </div>
                          <div className="p-2 rounded bg-slate-900/60 border border-slate-700">
                            B) Unadjusted substitution using base year Laspeyres ratio
                          </div>
                          <div className="p-2 rounded bg-slate-900/60 border border-slate-700">
                            C) Immediate truncation of historical series without linking
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 font-medium">
                        <span>Faculty Review: Verified by NSSTA Subject Expert</span>
                        <span className="text-[#FFB347] font-bold">Assigned to Level 3 Examination Bank</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'passport' && (
                <motion.div
                  key="passport"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 sm:p-8"
                >
                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="badge-gov-navy text-[11px] font-bold">
                        {isHindi ? 'कैरियर एवं संवर्ग रिकॉर्ड' : 'Portable Cadre Credential'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gov-navy">
                        {t('passportTitle')}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                        {t('passportDesc')}
                      </p>

                      <ul className="space-y-2 text-xs font-semibold text-gray-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-gov-navy" />
                          <span>{t('passportTag1')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-gov-navy" />
                          <span>{t('passportTag2')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-gov-navy" />
                          <span>{t('passportTag3')}</span>
                        </li>
                      </ul>

                      <div className="pt-2">
                        <button
                          onClick={() => handleLaunchDemo('employee')}
                          className="btn-gov-primary text-xs font-bold py-2.5 px-4"
                        >
                          <span>{isHindi ? 'डिजिटल पासपोर्ट खोलें' : 'Open Digital Passport'}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Passport Card Preview */}
                    <div className="lg:col-span-7 bg-[#08182E] p-6 rounded text-white border-2 border-gov-saffron/50 shadow-xl relative overflow-hidden">
                      {/* Top Header of Passport */}
                      <div className="flex items-start justify-between border-b border-white/20 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-white/10 border border-white/30 flex items-center justify-center font-bold text-gov-saffron text-xs">
                            GOI
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-300 font-mono tracking-widest uppercase font-bold">
                              MISSION KARMAYOGI · BHARAT
                            </p>
                            <h4 className="text-sm font-bold text-white tracking-wide">
                              DIGITAL COMPETENCY PASSPORT
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono bg-gov-green/40 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500 font-bold">
                            VERIFIED OFFICIAL
                          </span>
                        </div>
                      </div>

                      {/* Officer Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                        <div className="bg-white/10 p-2.5 rounded border border-white/15">
                          <p className="text-[10px] text-slate-300">Officer Name</p>
                          <p className="font-bold text-white">Rahul Sharma</p>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded border border-white/15">
                          <p className="text-[10px] text-slate-300">Cadre ID</p>
                          <p className="font-bold font-mono text-[#FFB347]">ISS-2021-084</p>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded border border-white/15">
                          <p className="text-[10px] text-slate-300">Verified Level</p>
                          <p className="font-bold text-emerald-300">Level 4.2 / 5.0</p>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded border border-white/15">
                          <p className="text-[10px] text-slate-300">iGOT Hours</p>
                          <p className="font-bold font-mono text-white">128 Hours</p>
                        </div>
                      </div>

                      {/* Verified Badges */}
                      <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                        <span className="bg-white/10 px-2.5 py-1 rounded text-slate-200 border border-white/20">
                          ✓ National Accounts Specialist
                        </span>
                        <span className="bg-white/10 px-2.5 py-1 rounded text-slate-200 border border-white/20">
                          ✓ Survey CAPI Master Certified
                        </span>
                        <span className="bg-white/10 px-2.5 py-1 rounded text-slate-200 border border-white/20">
                          ✓ Statistical Anomaly Inspector
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── 6. THE THREE PURPOSE-BUILT PORTALS (ECOSYSTEM) ────────────────── */}
      <section id="portals" className="py-20 bg-white border-b border-gov-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gov-saffron-light text-gov-saffron mb-3 border border-gov-saffron/20">
              <Compass size={13} />
              {t('portalsSectionBadge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gov-navy tracking-tight pb-1">
              {t('portalsSectionTitle')}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto mt-2 font-medium">
              {t('portalsSectionSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 1. Employee Portal Card */}
            <div className="card hover:shadow-gov-card-hover transition-all duration-300 flex flex-col border-t-4 border-t-gov-blue">
              <div className="p-6 flex-1 flex flex-col">
                <div className="w-12 h-12 rounded bg-gov-blue-light text-gov-blue flex items-center justify-center mb-4">
                  <UserCheck size={24} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gov-blue-light text-gov-blue border border-gov-blue/20">
                    OFFICER CADRE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gov-navy mb-1">
                  {t('portalEmpTitle')}
                </h3>
                <p className="text-xs font-bold text-gov-blue mb-3">
                  {t('portalEmpSubtitle')}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed mb-6 font-normal">
                  {t('portalEmpDesc')}
                </p>

                <div className="mt-auto space-y-2.5 pt-4 border-t border-gov-gray-100 text-xs font-semibold">
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-blue shrink-0 mt-0.5" />
                    <span>{t('portalEmpFeature1')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-blue shrink-0 mt-0.5" />
                    <span>{t('portalEmpFeature2')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-blue shrink-0 mt-0.5" />
                    <span>{t('portalEmpFeature3')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-blue shrink-0 mt-0.5" />
                    <span>{t('portalEmpFeature4')}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gov-off-white border-t border-gov-gray-200">
                <button
                  onClick={() => handleLaunchDemo('employee')}
                  className="btn-gov-primary w-full justify-center py-2.5 text-xs font-bold shadow-xs"
                >
                  <span>{t('portalEmpAction')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* 2. Trainer Portal Card */}
            <div className="card hover:shadow-gov-card-hover transition-all duration-300 flex flex-col border-t-4 border-t-gov-saffron">
              <div className="p-6 flex-1 flex flex-col">
                <div className="w-12 h-12 rounded bg-gov-saffron-light text-gov-saffron flex items-center justify-center mb-4">
                  <GraduationCap size={24} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gov-saffron-light text-gov-saffron border border-gov-saffron/20">
                    FACULTY SUITE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gov-navy mb-1">
                  {t('portalTrainerTitle')}
                </h3>
                <p className="text-xs font-bold text-gov-saffron mb-3">
                  {t('portalTrainerSubtitle')}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed mb-6 font-normal">
                  {t('portalTrainerDesc')}
                </p>

                <div className="mt-auto space-y-2.5 pt-4 border-t border-gov-gray-100 text-xs font-semibold">
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-saffron shrink-0 mt-0.5" />
                    <span>{t('portalTrainerFeature1')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-saffron shrink-0 mt-0.5" />
                    <span>{t('portalTrainerFeature2')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-saffron shrink-0 mt-0.5" />
                    <span>{t('portalTrainerFeature3')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-saffron shrink-0 mt-0.5" />
                    <span>{t('portalTrainerFeature4')}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gov-off-white border-t border-gov-gray-200">
                <button
                  onClick={() => handleLaunchDemo('trainer')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gov-saffron hover:bg-[#c66525] text-white py-2.5 px-4 rounded text-xs font-bold shadow-xs transition-colors"
                >
                  <span>{t('portalTrainerAction')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* 3. Admin Portal Card */}
            <div className="card hover:shadow-gov-card-hover transition-all duration-300 flex flex-col border-t-4 border-t-gov-green">
              <div className="p-6 flex-1 flex flex-col">
                <div className="w-12 h-12 rounded bg-gov-green-light text-gov-green flex items-center justify-center mb-4">
                  <Shield size={24} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gov-green-light text-gov-green border border-gov-green/20">
                    POLICY & CADRE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gov-navy mb-1">
                  {t('portalAdminTitle')}
                </h3>
                <p className="text-xs font-bold text-gov-green mb-3">
                  {t('portalAdminSubtitle')}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed mb-6 font-normal">
                  {t('portalAdminDesc')}
                </p>

                <div className="mt-auto space-y-2.5 pt-4 border-t border-gov-gray-100 text-xs font-semibold">
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-green shrink-0 mt-0.5" />
                    <span>{t('portalAdminFeature1')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-green shrink-0 mt-0.5" />
                    <span>{t('portalAdminFeature2')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-green shrink-0 mt-0.5" />
                    <span>{t('portalAdminFeature3')}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-800">
                    <CheckCircle2 size={14} className="text-gov-green shrink-0 mt-0.5" />
                    <span>{t('portalAdminFeature4')}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gov-off-white border-t border-gov-gray-200">
                <button
                  onClick={() => handleLaunchDemo('admin')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gov-green hover:bg-[#1f563d] text-white py-2.5 px-4 rounded text-xs font-bold shadow-xs transition-colors"
                >
                  <span>{t('portalAdminAction')}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. THE 6-STEP CONTINUOUS COMPETENCY WORKFLOW ──────────────────── */}
      <section id="workflow" className="py-20 bg-gov-off-white border-b border-gov-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gov-navy/10 text-gov-navy mb-3 border border-gov-navy/20">
              <RotateCcw size={13} />
              {t('howItWorksBadge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gov-navy tracking-tight pb-1">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto mt-2 font-medium">
              {t('howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="card p-6 hover:shadow-gov-card-hover transition-all bg-white flex flex-col group border border-gov-gray-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black font-mono text-gray-500 group-hover:text-gov-saffron transition-colors">
                      STEP {s.num}
                    </span>
                    <div className={`w-9 h-9 rounded ${s.color} flex items-center justify-center shadow-xs`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gov-navy mb-2 group-hover:text-gov-blue transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. MOSPI COMPETENCY FRAMEWORK EXPLORER ───────────────────────── */}
      <section id="framework" className="py-20 bg-white border-b border-gov-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gov-blue-light text-gov-blue mb-3 border border-gov-blue/20">
              <Layers size={13} />
              {t('frameworkBadge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gov-navy tracking-tight pb-1">
              {t('frameworkTitle')}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto mt-2 font-medium">
              {t('frameworkSubtitle')}
            </p>
          </div>

          {/* Sub-framework Category Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gov-off-white border border-gov-gray-300 rounded p-1 gap-1">
              <button
                onClick={() => setActiveFrameworkTab('domain')}
                className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                  activeFrameworkTab === 'domain'
                    ? 'bg-gov-navy text-white shadow-xs'
                    : 'text-gray-700 hover:text-gov-navy'
                }`}
              >
                {t('domainCompTitle')}
              </button>
              <button
                onClick={() => setActiveFrameworkTab('foundational')}
                className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                  activeFrameworkTab === 'foundational'
                    ? 'bg-gov-navy text-white shadow-xs'
                    : 'text-gray-700 hover:text-gov-navy'
                }`}
              >
                {t('foundationalCompTitle')}
              </button>
              <button
                onClick={() => setActiveFrameworkTab('functional')}
                className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                  activeFrameworkTab === 'functional'
                    ? 'bg-gov-navy text-white shadow-xs'
                    : 'text-gray-700 hover:text-gov-navy'
                }`}
              >
                {t('functionalCompTitle')}
              </button>
            </div>
          </div>

          {/* Competency Items Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {frameworkData[activeFrameworkTab]?.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded bg-gov-off-white border border-gov-gray-300 hover:border-gov-blue/50 hover:bg-white transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold bg-gov-navy text-white px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-bold text-gov-green bg-green-50 border border-green-300 px-2 py-0.5 rounded">
                    {item.level}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gov-navy mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. INSTITUTIONAL TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-20 bg-gov-off-white border-b border-gov-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gov-saffron-light text-gov-saffron mb-3 border border-gov-saffron/20">
              <Award size={13} />
              {t('testimonialsBadge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gov-navy tracking-tight pb-1">
              {t('testimonialsTitle')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 bg-white border border-gov-gray-300 flex flex-col justify-between">
              <p className="text-xs text-gray-800 italic leading-relaxed mb-6 font-medium">
                "{t('test1Quote')}"
              </p>
              <div className="pt-4 border-t border-gov-gray-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-gov-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                  RN
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gov-navy">{t('test1Author')}</h4>
                  <p className="text-[11px] text-gray-600 leading-snug">{t('test1Role')}</p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-white border border-gov-gray-300 flex flex-col justify-between">
              <p className="text-xs text-gray-800 italic leading-relaxed mb-6 font-medium">
                "{t('test2Quote')}"
              </p>
              <div className="pt-4 border-t border-gov-gray-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-gov-saffron text-white text-xs font-bold flex items-center justify-center shrink-0">
                  SM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gov-navy">{t('test2Author')}</h4>
                  <p className="text-[11px] text-gray-600 leading-snug">{t('test2Role')}</p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-white border border-gov-gray-300 flex flex-col justify-between">
              <p className="text-xs text-gray-800 italic leading-relaxed mb-6 font-medium">
                "{t('test3Quote')}"
              </p>
              <div className="pt-4 border-t border-gov-gray-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-gov-green text-white text-xs font-bold flex items-center justify-center shrink-0">
                  VR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gov-navy">{t('test3Author')}</h4>
                  <p className="text-[11px] text-gray-600 leading-snug">{t('test3Role')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. FREQUENTLY ASKED QUESTIONS (FAQ) ─────────────────────────── */}
      <section id="faq" className="py-20 bg-white border-b border-gov-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gov-blue-light text-gov-blue mb-3 border border-gov-blue/20">
              <FileText size={13} />
              {t('faqBadge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gov-navy tracking-tight pb-1">
              {t('faqTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 mt-2 font-medium">
              {t('faqSubtitle')}
            </p>
          </div>

          <div className="space-y-3">
            {[
              { q: t('faq1Q'), a: t('faq1A') },
              { q: t('faq2Q'), a: t('faq2A') },
              { q: t('faq3Q'), a: t('faq3A') },
              { q: t('faq4Q'), a: t('faq4A') },
              { q: t('faq5Q'), a: t('faq5A') },
            ].map((item, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded border border-gov-gray-300 bg-gov-off-white overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-gov-navy hover:text-gov-blue transition-colors gap-3"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-gov-blue' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 text-xs text-gray-700 leading-relaxed border-t border-gov-gray-200 pt-3 font-normal"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 11. HIGH-IMPACT CALL TO ACTION ───────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-gov-navy via-[#0C2D54] to-gov-navy text-white relative overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gov-saffron/15 rounded-full blur-3xl pointer-events-none" />
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative z-10">
          <Award size={40} className="text-gov-saffron mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-4 tracking-tight pb-1">
            {t('ctaTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-100 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            {t('ctaSubtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => handleLaunchDemo('employee')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded text-xs font-bold text-white bg-gov-saffron hover:bg-[#c66525] shadow-lg transition-all hover:scale-102"
            >
              <Play size={14} fill="currentColor" />
              <span>{t('ctaPrimaryBtn')}</span>
            </button>

            <button
              onClick={() => handleLaunchDemo('admin')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 transition-all"
            >
              <Shield size={14} className="text-emerald-400" />
              <span>{t('ctaSecondaryBtn')}</span>
            </button>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded text-xs font-bold text-slate-100 hover:text-white border border-white/20 hover:bg-white/10 transition-colors"
            >
              <span>{t('ctaLoginBtn')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 12. OFFICIAL GOVERNMENT FOOTER ───────────────────────────────── */}
      <footer className="bg-[#051121] text-slate-300 text-xs border-t border-white/10 pt-12 pb-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Top Footer Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/15">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-gov-navy border border-white/30 text-white font-bold flex items-center justify-center text-xs">
                  KS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">KarmaSiksha</h3>
                  <p className="text-[11px] text-slate-300 font-medium">{t('ministryName')}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed max-w-md font-normal">
                {t('footerDisclaimer')}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                {t('footerQuickLinks')}
              </h4>
              <ul className="space-y-2 text-[11px] font-medium">
                <li>
                  <button onClick={() => handleLaunchDemo('employee')} className="hover:text-gov-saffron transition-colors text-slate-300">
                    {t('navEmployeePortal')}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLaunchDemo('trainer')} className="hover:text-gov-saffron transition-colors text-slate-300">
                    {t('navTrainerPortal')}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLaunchDemo('admin')} className="hover:text-gov-saffron transition-colors text-slate-300">
                    {t('navAdminPortal')}
                  </button>
                </li>
                <li>
                  <Link to="/login" className="hover:text-gov-saffron transition-colors text-slate-300">
                    {t('navLogin')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                {t('footerGovLinks')}
              </h4>
              <ul className="space-y-2 text-[11px] font-medium">
                <li>
                  <a href="https://igotkarmayogi.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-slate-300">
                    <span>{t('linkIgot')}</span>
                    <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  <a href="https://mospi.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-slate-300">
                    <span>{t('linkMospi')}</span>
                    <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-slate-300">
                    <span>{t('linkDataGov')}</span>
                    <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  <a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-slate-300">
                    <span>{t('linkDigitalIndia')}</span>
                    <ExternalLink size={10} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & National Information */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              <p className="font-medium text-slate-300">{t('footerCopyright')}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{t('footerNicNotice')}</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-medium">
              <a href="#faq" className="hover:text-white text-slate-400">{t('privacyPolicy')}</a>
              <span>·</span>
              <a href="#faq" className="hover:text-white text-slate-400">{t('termsOfService')}</a>
              <span>·</span>
              <a href="#faq" className="hover:text-white text-slate-400">{t('accessibilityStatement')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
