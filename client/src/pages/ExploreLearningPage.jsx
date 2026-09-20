import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle,
  ExternalLink,
  Tag,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  FileText,
  Download
} from 'lucide-react';
import { useStream } from '../context/StreamContext';
import { getStoredMaterials } from '../services/portalManagementService';

export default function ExploreLearningPage() {
  const {
    courses,
    domainCourses,
    domainRecommendedCourses,
    toggleCourseEnrollment,
    selectedStream,
    departmentConfig,
    gapAnalysis,
    employee
  } = useStream();

  const [searchQuery, setSearchQuery] = useState('');
  const [catalogScope, setCatalogScope] = useState('department'); // 'department' | 'all'
  const [providerFilter, setProviderFilter] = useState('all'); // all | igot | tpac
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // all | Beginner | Intermediate | Advanced
  const [selectedCourse, setSelectedCourse] = useState(null);

  const activeDeptCourses = domainCourses && domainCourses.length > 0 ? domainCourses : courses;
  const baseList = catalogScope === 'department' ? activeDeptCourses : courses;

  const criticalGapsSet = new Set((gapAnalysis?.criticalGaps || []).map(g => g.name.toLowerCase()));
  const developingGapsSet = new Set((gapAnalysis?.developingGaps || []).map(g => g.name.toLowerCase()));

  const filteredCourses = baseList.filter(course => {
    const compName = (course.competencyName || course.competency || '').toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = query === ''
      || course.title.toLowerCase().includes(query)
      || compName.includes(query)
      || (course.tags || []).some(t => t.toLowerCase().includes(query));

    const matchesProvider = providerFilter === 'all'
      || (providerFilter === 'igot' && course.providerType === 'igot')
      || (providerFilter === 'tpac' && course.providerType === 'tpac');

    const matchesDifficulty = difficultyFilter === 'all'
      || (course.difficulty || course.level || '').toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesProvider && matchesDifficulty;
  }).sort((a, b) => {
    // Sort prioritized courses first when search is active
    const aComp = (a.competencyName || a.competency || '').toLowerCase();
    const bComp = (b.competencyName || b.competency || '').toLowerCase();
    const aPri = criticalGapsSet.has(aComp) ? 2 : developingGapsSet.has(aComp) ? 1 : 0;
    const bPri = criticalGapsSet.has(bComp) ? 2 : developingGapsSet.has(bComp) ? 1 : 0;
    return bPri - aPri;
  });

  return (
    <div className="space-y-6 w-full">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy via-[#0f2e54] to-gov-blue text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-gov-saffron text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              <BookOpen size={12} />
              <span>National Civil Services Learning Catalog</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Explore Learning Ecosystem
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Browse approved e-learning courses, micro-modules, and masterclasses from iGOT Karmayogi, TPAC, and affiliated administrative academies.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 p-4 rounded-gov text-center shrink-0">
            <span className="text-[10px] text-white/60 uppercase font-bold block">Available Modules</span>
            <span className="text-2xl font-black text-white">{courses.length} Courses</span>
            <span className="text-[10px] text-green-300 font-semibold block mt-0.5">Government Certified</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────────────────── */}
      <div className="gov-card p-4 bg-white border border-gov-gray-200 space-y-3">
        {/* Scope Selector: Department vs All-India */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gov-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gray-400">Catalogue View:</span>
            <button
              onClick={() => setCatalogScope('department')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                catalogScope === 'department'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-gov-gray-100 text-gov-gray-600 hover:bg-gov-gray-200'
              }`}
            >
              <Sparkles size={12} className="text-gov-saffron" />
              <span>{departmentConfig?.name} Recommendations ({activeDeptCourses.length})</span>
            </button>
            <button
              onClick={() => setCatalogScope('all')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                catalogScope === 'all'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-gov-gray-100 text-gov-gray-600 hover:bg-gov-gray-200'
              }`}
            >
              <span>All-India Civil Services Catalog</span>
            </button>
          </div>

          <span className="text-[11px] text-gov-gray-500 font-medium">
            Showing <strong>{filteredCourses.length}</strong> prioritized courses
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gov-gray-400" />
            <input
              type="text"
              placeholder={`Search ${departmentConfig?.name} courses, competencies (e.g. Sampling, Crop, Yield, Quality)...`}
              className="gov-input pl-8 py-2 text-xs"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gov-gray-500 font-bold text-[10px] uppercase">Provider:</span>
            <select
              value={providerFilter}
              onChange={e => setProviderFilter(e.target.value)}
              className="gov-input py-1.5 text-xs w-36"
            >
              <option value="all">All Providers</option>
              <option value="igot">iGOT Karmayogi</option>
              <option value="tpac">TPAC / Academies</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-gov-gray-500 font-bold text-[10px] uppercase">Level:</span>
            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
              className="gov-input py-1.5 text-xs w-36"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Faculty Department Materials Shelf ─────────────────────────────── */}
      {(() => {
        const empDept = employee?.department || 'MoSPI / National Statistical Office';
        const deptMaterials = getStoredMaterials(empDept);
        if (deptMaterials.length === 0) return null;

        return (
          <div className="gov-card p-5 border-l-4 border-l-gov-saffron bg-gradient-to-r from-gov-saffron/5 to-white space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gov-saffron" />
                <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                  Faculty & Academy Curated Materials ({deptMaterials.length} Documents for {empDept})
                </h3>
              </div>
              <span className="badge-gov-saffron text-[9px] font-bold">NSSTA Approved</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {deptMaterials.map((mat) => (
                <div key={mat.id} className="p-3.5 bg-white rounded-gov border border-gov-gray-200 hover:border-gov-saffron transition-all space-y-2 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="badge-gov-info text-[9px]">{mat.competency}</span>
                    <span className="text-[10px] text-gov-gray-400">{mat.size}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gov-navy leading-snug line-clamp-2">{mat.title}</h4>
                  <p className="text-[11px] text-gov-gray-500 line-clamp-2 leading-relaxed">{mat.description}</p>
                  <div className="pt-2 border-t border-gov-gray-100 flex items-center justify-between text-[10px]">
                    <span className="text-gov-gray-400 italic">By {mat.author || 'NSSTA Faculty'}</span>
                    <button
                      onClick={() => alert(`Downloading "${mat.title}"...`)}
                      className="text-gov-blue hover:underline font-bold flex items-center gap-1"
                    >
                      <Download size={11} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Course Cards Grid ───────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map(course => {
          const compTitle = course.competencyName || course.competency || '';
          const isCriticalGap = criticalGapsSet.has(compTitle.toLowerCase());
          const isDevelopingGap = developingGapsSet.has(compTitle.toLowerCase());

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`gov-card p-5 flex flex-col justify-between hover:shadow-gov-card-hover transition-all border-2 ${
                isCriticalGap
                  ? 'border-red-300 bg-gradient-to-b from-red-50/20 to-white'
                  : 'border-gov-gray-200'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    course.providerType === 'igot'
                      ? 'bg-gov-saffron text-white'
                      : 'bg-gov-blue text-white'
                  }`}>
                    {course.provider}
                  </span>

                  {isCriticalGap ? (
                    <span className="badge-gov-danger text-[9px] font-bold">
                      Matches your skill gap
                    </span>
                  ) : isDevelopingGap ? (
                    <span className="badge-gov-warning text-[9px] font-bold">
                      Recommended for your role
                    </span>
                  ) : course.badge ? (
                    <span className="badge-gov-info text-[9px] font-semibold">
                      {course.badge}
                    </span>
                  ) : null}

                  <span className="badge-gov-neutral text-[10px]">
                    {course.difficulty || course.level}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gov-navy leading-snug">{course.title}</h3>
                  <p className="text-[11px] text-gov-gray-500 mt-0.5">
                    Competency: <strong className="text-gov-navy">{compTitle}</strong>
                  </p>
                </div>

                <p className="text-xs text-gov-gray-600 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                {/* Rating & Duration */}
                <div className="pt-2 flex items-center justify-between text-xs text-gov-gray-500 border-t border-gov-gray-100">
                  <span className="flex items-center gap-1 font-semibold text-gov-navy">
                    <Clock size={12} className="text-gov-gray-400" />
                    {course.hours ? `${course.hours} hours` : course.duration}
                  </span>

                  <span className="flex items-center gap-1 text-gov-saffron font-bold">
                    <Star size={12} className="fill-gov-saffron text-gov-saffron" />
                    {course.rating || '4.8'} ({course.enrolledCount?.toLocaleString() || '950'} learners)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-gov-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="btn-gov-ghost text-xs p-0 text-gov-blue font-semibold hover:underline"
                >
                  View Details & Objectives
                </button>

                <button
                  onClick={() => toggleCourseEnrollment(course.id)}
                  className={`btn-gov-${course.isEnrolled ? 'secondary' : 'primary'} text-xs py-1.5 px-3`}
                >
                  {course.isEnrolled ? 'Enrolled (In Progress)' : 'Enroll on iGOT'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Syllabus & Objectives Preview Modal ───────────────────────────────── */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gov-navy/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-gov-lg shadow-2xl border border-gov-gray-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-4 bg-gov-navy text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="badge-gov-info text-[9px] font-bold uppercase">{selectedCourse.provider}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{selectedCourse.title}</h3>
                </div>
                <button onClick={() => setSelectedCourse(null)} className="p-1 text-white/70 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs overflow-y-auto">
                <div>
                  <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[10px] mb-1">
                    Course Overview
                  </h4>
                  <p className="text-gov-gray-700 leading-relaxed">{selectedCourse.description}</p>
                </div>

                {selectedCourse.learningObjectives && selectedCourse.learningObjectives.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[10px]">
                      Specific Learning Objectives:
                    </h4>
                    <div className="space-y-1.5">
                      {selectedCourse.learningObjectives.map((obj, i) => (
                        <div key={i} className="p-2 bg-gov-off-white border border-gov-gray-200 rounded-gov flex items-start gap-2">
                          <CheckCircle size={14} className="text-gov-green shrink-0 mt-0.5" />
                          <span className="text-gov-gray-700">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gov-navy uppercase tracking-wider text-[10px] mb-1">
                      Cadre Prerequisites:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCourse.prerequisites.map((prereq, i) => (
                        <span key={i} className="badge-gov-neutral text-[10px]">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gov-gray-100 bg-gov-off-white flex items-center justify-between shrink-0">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="btn-gov-secondary text-xs py-1.5 px-3"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    toggleCourseEnrollment(selectedCourse.id);
                    setSelectedCourse(null);
                  }}
                  className="btn-gov-primary text-xs py-1.5 px-4"
                >
                  {selectedCourse.isEnrolled ? 'Resume Course' : 'Enroll on iGOT'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
