import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCheck,
  GraduationCap,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  BookOpen,
  ClipboardCheck,
  Compass,
  FileText,
  BarChart2,
  CheckCircle2,
  Building2,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import PreDashboardLayout from '../components/layout/PreDashboardLayout';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function PortalSelectionPage({ onSelectPortal, onLogout }) {
  const { isHindi } = useLanguage();
  const portals = [
    {
      id: 'employee',
      title: 'Employee Portal',
      subtitle: 'Competency Intelligence & Career Growth',
      icon: UserCheck,
      badge: 'OFFICIAL OFFICER WORKSPACE',
      badgeColor: 'bg-gov-blue text-white',
      accentBorder: 'border-gov-blue hover:border-gov-blue',
      topGradient: 'from-gov-navy to-gov-blue',
      iconBg: 'bg-gov-blue-light text-gov-blue',
      description:
        'Assess your competencies, identify skill gaps, follow personalized learning paths, and prepare for future roles.',
      features: [
        { label: 'Competency Assessment', icon: ClipboardCheck },
        { label: 'Skill Gap Analysis', icon: Layers },
        { label: 'Personalized Learning', icon: BookOpen },
        { label: 'Future Role Readiness', icon: Compass },
      ],
      ctaText: 'Continue as Employee',
      ctaClass: 'btn-gov-primary w-full justify-center py-3 text-sm font-bold shadow-sm',
    },
    {
      id: 'trainer',
      title: 'Trainer Portal',
      subtitle: 'Course & Content Development Studio',
      icon: GraduationCap,
      badge: 'FACULTY & INSTRUCTOR SUITE',
      badgeColor: 'bg-gov-saffron text-white',
      accentBorder: 'border-gov-saffron hover:border-gov-saffron',
      topGradient: 'from-[#0B2545] to-[#c26123]',
      iconBg: 'bg-gov-saffron-light text-gov-saffron',
      description:
        'Create learning content, upload training materials, generate AI-assisted assessments, and manage course delivery.',
      features: [
        { label: 'Course Management', icon: BookOpen },
        { label: 'Learning Materials', icon: FileText },
        { label: 'Standardized Question Bank', icon: ClipboardCheck },
        { label: 'Question Review', icon: CheckCircle2 },
      ],
      ctaText: 'Continue as Trainer',
      ctaClass: 'bg-gov-saffron hover:bg-[#c26123] text-white rounded-gov font-bold w-full justify-center py-3 text-sm transition-all shadow-sm flex items-center gap-2',
    },
    {
      id: 'admin',
      title: 'Administration Portal',
      subtitle: 'Workforce Intelligence & Governance',
      icon: Shield,
      badge: 'SYSTEM ADMINISTRATION & DIID',
      badgeColor: 'bg-gov-green text-white',
      accentBorder: 'border-gov-green hover:border-gov-green',
      topGradient: 'from-gov-navy to-[#1b5238]',
      iconBg: 'bg-gov-green-light text-gov-green',
      description:
        'Manage departments, roles, competencies, workforce intelligence, and organizational learning priorities.',
      features: [
        { label: 'Department Management', icon: Building2 },
        { label: 'Competency Framework', icon: Layers },
        { label: 'Workforce Intelligence', icon: BarChart2 },
        { label: 'Training Priorities', icon: ClipboardCheck },
      ],
      ctaText: 'Continue as Admin',
      ctaClass: 'bg-gov-navy hover:bg-gov-navy-light text-white rounded-gov font-bold w-full justify-center py-3 text-sm transition-all shadow-sm flex items-center gap-2',
    },
  ];

  const portalHeader = (
    <header className="bg-gov-navy text-white text-xs border-b border-white/10 w-full shadow-xs">
      <div className="h-1 bg-gradient-to-r from-gov-saffron via-white to-gov-green w-full" />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full border border-white/30 bg-white/10 flex items-center justify-center font-serif text-[9px] font-bold text-gov-saffron shrink-0">
            GOV
          </div>
          <div>
            <p className="font-bold tracking-wide text-white text-xs sm:text-sm">
              भारत सरकार · Government of India
            </p>
            <p className="text-white/60 text-[10px] hidden sm:block">
              Ministry of Statistics & Programme Implementation · DIID
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>{isHindi ? 'मुख्य पृष्ठ' : 'Home'}</span>
          </Link>

          <LanguageSwitcher variant="compact" />

          {onLogout && (
            <button
              onClick={onLogout}
              className="text-white/70 hover:text-white text-xs font-semibold px-2.5 py-1 rounded hover:bg-white/10 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );

  const portalFooter = (
    <footer className="w-full bg-white border-t border-gov-gray-200 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-gov-gray-500 shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} Government Employee Competency & Learning Platform · DIID / MoSPI</p>
        <p className="flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-gov-green" />
          <span>Integrated with iGOT Karmayogi Framework</span>
        </p>
      </div>
    </footer>
  );

  return (
    <PreDashboardLayout header={portalHeader} footer={portalFooter}>
      {/* ── 2. Main Portal Selection Container ────────────────────────────── */}
      <main className="w-full flex-1 px-4 sm:px-6 lg:px-12 py-8 lg:py-12 flex flex-col justify-center">
        <div className="w-full space-y-8">
          
          {/* Header Title Section */}
          <motion.div {...fadeUp} className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-blue-light border border-blue-200 text-gov-blue text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-gov-saffron" />
              <span>KarmaSiksha Platform Gate</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gov-navy tracking-tight">
              Select Your Portal
            </h1>

            <p className="text-sm sm:text-base text-gov-gray-600 leading-relaxed text-balance">
              Choose the workspace that matches your role in the competency intelligence ecosystem.
            </p>
          </motion.div>

          {/* Three Large Professional Portal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-2">
            {portals.map((portal, idx) => {
              const Icon = portal.icon;
              return (
                <motion.div
                  key={portal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="bg-white rounded-gov-md border border-gov-gray-200 shadow-gov-card hover:shadow-gov-card-hover transition-all flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  {/* Card Top Strip Banner */}
                  <div className={`p-6 bg-gradient-to-r ${portal.topGradient} text-white relative`}>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-xs">
                        {portal.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-gov bg-white text-gov-navy flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                        <Icon size={24} className="text-gov-blue" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white leading-tight">
                          {portal.title}
                        </h2>
                        <p className="text-xs text-white/70 mt-0.5">
                          {portal.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <p className="text-xs sm:text-sm text-gov-gray-600 leading-relaxed">
                      {portal.description}
                    </p>

                    {/* Small Feature Labels Grid */}
                    <div className="space-y-2 pt-2 border-t border-gov-gray-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gov-gray-400">
                        Included Capabilities
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {portal.features.map((feat) => {
                          const FeatIcon = feat.icon;
                          return (
                            <div
                              key={feat.label}
                              className="flex items-center gap-1.5 p-2 rounded-gov bg-gov-off-white border border-gov-gray-200 text-gov-gray-700 text-xs font-medium"
                            >
                              <FeatIcon size={13} className="text-gov-blue shrink-0" />
                              <span className="truncate">{feat.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Primary Call to Action */}
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectPortal(portal.id)}
                        className={portal.ctaClass}
                      >
                        <span>{portal.ctaText}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Clarification Notice */}
          <div className="text-center text-xs text-gov-gray-500 pt-4 flex items-center justify-center gap-2">
            <ShieldAlert size={14} className="text-gov-saffron shrink-0" />
            <span>
              Official Demonstration Environment for Ministry of Statistics & Programme Implementation (MoSPI).
            </span>
          </div>

        </div>
      </main>
    </PreDashboardLayout>
  );
}
