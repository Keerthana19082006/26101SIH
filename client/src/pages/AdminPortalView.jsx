import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  BookOpen,
  Award,
  Target,
  BarChart3,
  Compass,
  Activity,
  FileText,
  FileSpreadsheet,
  Bell,
  Settings,
  User,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  GraduationCap,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Filter,
  Eye,
  Trash2,
  UserPlus,
  Download,
  Clock,
  Shield,
  Send,
  Database,
  Lock,
  RefreshCw,
  Sliders,
  ExternalLink
} from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar';
import {
  DEPARTMENTS,
  getStoredEmployees,
  addStoredEmployee,
  updateStoredEmployee,
  deleteStoredEmployee,
  getStoredTrainers,
  addStoredTrainer,
  deleteStoredTrainer
} from '../services/portalManagementService';

export default function AdminPortalView({ onBackToPortals }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Live persistent data
  const [employees, setEmployees] = useState(getStoredEmployees());
  const [trainers, setTrainers] = useState(getStoredTrainers());

  // Filter & Search states
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('all');

  // Modals state
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);
  const [selectedPerformanceEmp, setSelectedPerformanceEmp] = useState(null);

  // New Employee Form state
  const [newEmp, setNewEmp] = useState({
    name: '',
    department: 'MoSPI / National Statistical Office',
    cadre: 'Subordinate Statistical Service (SSS)',
    currentRole: 'Statistical Investigator',
    targetRole: 'Senior Statistical Officer',
    email: '',
    overallCompetency: 65,
    station: 'Sardar Patel Bhawan, New Delhi',
  });

  // New Trainer Form state
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    email: '',
    department: 'MoSPI / National Statistical Office',
    specialization: 'Survey Sampling & Statistical Quality',
    role: 'Senior Faculty & Training Specialist',
  });

  // System Health state
  const [healthStatus, setHealthStatus] = useState('OPTIMAL');
  const [lastSyncTime, setLastSyncTime] = useState('Just Now');

  // Audit Logs
  const [auditLogs] = useState([
    { id: 1, action: 'Officer Competency Diagnostic Submitted', user: 'Officer 01 (MoSPI)', ip: '10.24.18.91', timestamp: '20 Sep 2026 10:45 AM', status: 'SUCCESS' },
    { id: 2, action: 'New Curriculum Document Uploaded', user: 'Dr. Rajeshwar Sharma', ip: '10.24.16.14', timestamp: '20 Sep 2026 09:30 AM', status: 'SUCCESS' },
    { id: 3, action: 'iGOT Karmayogi Telemetry Re-synced', user: 'System Cron', ip: '127.0.0.1', timestamp: '20 Sep 2026 08:00 AM', status: 'SUCCESS' },
    { id: 4, action: 'Cadre Access Privilege Assigned', user: 'Admin DIID', ip: '10.24.12.05', timestamp: '19 Sep 2026 05:15 PM', status: 'SUCCESS' },
  ]);

  // Notifications State
  const [adminNotifications, setAdminNotifications] = useState([
    { id: 1, title: 'Annual Capacity Building Plan (ACBP) Due', desc: 'MoSPI and Agriculture departments must submit Q3 training quotas by end of week.', time: '2h ago', unread: true },
    { id: 2, title: 'iGOT API Version 2.4 Deployed', desc: 'New competency passport synchronization endpoints are now active.', time: '5h ago', unread: true },
    { id: 3, title: 'Cadre Review Circular Published', desc: 'DoPT notification regarding Subordinate Statistical Service promotions.', time: '1d ago', unread: false },
  ]);

  const refreshData = () => {
    setEmployees(getStoredEmployees());
    setTrainers(getStoredTrainers());
  };

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    if (!newEmp.name.trim()) return;
    addStoredEmployee(newEmp);
    refreshData();
    setShowAddEmpModal(false);
    setNewEmp({
      name: '',
      department: 'MoSPI / National Statistical Office',
      cadre: 'Subordinate Statistical Service (SSS)',
      currentRole: 'Statistical Investigator',
      targetRole: 'Senior Statistical Officer',
      email: '',
      overallCompetency: 65,
      station: 'Sardar Patel Bhawan, New Delhi',
    });
  };

  const handleDeleteEmployee = (id) => {
    if (confirm('Are you sure you want to remove this employee record?')) {
      deleteStoredEmployee(id);
      refreshData();
    }
  };

  const handleCreateTrainer = (e) => {
    e.preventDefault();
    if (!newTrainer.name.trim()) return;
    addStoredTrainer(newTrainer);
    refreshData();
    setShowAddTrainerModal(false);
    setNewTrainer({
      name: '',
      email: '',
      department: 'MoSPI / National Statistical Office',
      specialization: 'Survey Sampling & Statistical Quality',
      role: 'Senior Faculty & Training Specialist',
    });
  };

  const handleDeleteTrainer = (id) => {
    if (confirm('Are you sure you want to remove this trainer from the faculty roster?')) {
      deleteStoredTrainer(id);
      refreshData();
    }
  };

  // Filtered lists
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(empSearch.toLowerCase()) ||
      (emp.currentRole && emp.currentRole.toLowerCase().includes(empSearch.toLowerCase())) ||
      (emp.igotId && emp.igotId.toLowerCase().includes(empSearch.toLowerCase()));
    const matchesDept =
      empDeptFilter === 'all' ||
      emp.department.toLowerCase().includes(empDeptFilter.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const departmentHealth = [
    { name: 'MoSPI / National Statistical Office', officers: 580, readiness: 71, criticalGaps: 12, topNeed: 'Survey Sampling & Geospatial' },
    { name: 'Ministry of Agriculture (DES)', officers: 290, readiness: 64, criticalGaps: 9, topNeed: 'Crop Estimation & Remote Sensing' },
    { name: 'Health & Family Welfare (MoHFW)', officers: 210, readiness: 74, criticalGaps: 6, topNeed: 'Public Health Analytics' },
    { name: 'Ministry of Labour & Employment', officers: 190, readiness: 58, criticalGaps: 8, topNeed: 'Periodic Labour Force Data' },
    { name: 'Ministry of Education', officers: 150, readiness: 69, criticalGaps: 3, topNeed: 'Learning Outcomes Metrics' },
  ];

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
            <div className="w-8 h-8 rounded bg-gov-green flex items-center justify-center font-bold text-white shadow-xs">
              <Shield size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white leading-tight">Admin Portal</h1>
                <span className="badge-gov-success text-[9px] font-bold hidden sm:inline-block">DIID Master Control</span>
              </div>
              <p className="text-[10px] text-white/70 hidden md:block">Ministry Workforce Hierarchy, Competency Engine & Governance Suite</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowAddEmpModal(true)}
            className="btn-gov-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus size={14} />
            <span className="hidden sm:inline">Add Employee</span>
          </button>

          <button
            onClick={() => setShowAddTrainerModal(true)}
            className="btn-gov-saffron text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Trainer</span>
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
          <AdminSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onBackToPortals={onBackToPortals}
            employeeCount={employees.length}
            unreadNotificationsCount={adminNotifications.filter(n => n.unread).length}
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
              <AdminSidebar
                mobile
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onBackToPortals={onBackToPortals}
                onClose={() => setMobileSidebarOpen(false)}
                employeeCount={employees.length}
                unreadNotificationsCount={adminNotifications.filter(n => n.unread).length}
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
                <span>Governance Control</span>
                <ChevronRight size={12} />
                <span className="font-semibold text-gov-navy capitalize">{activeTab.replace('_', ' ')}</span>
              </div>
              <h2 className="text-xl font-bold text-gov-navy capitalize">
                {activeTab === 'dashboard' && 'Workforce Intelligence & Governance Dashboard'}
                {activeTab === 'employees' && 'Government Employee Directory & Onboarding'}
                {activeTab === 'departments_roles' && 'Department Hierarchy & Role Blueprints'}
                {activeTab === 'user_access' && 'User & Role-Based Access Management (RBAC)'}
                {activeTab === 'course_catalogue' && 'Master Course Catalogue & Curricula'}
                {activeTab === 'programmes' && 'National Capacity Building Programmes'}
                {activeTab === 'competency_framework' && 'Civil Service Competency Framework'}
                {activeTab === 'workforce_analytics' && 'Workforce Competency & Readiness Analytics'}
                {activeTab === 'future_demand' && 'Future Role Demand & Succession Forecasting'}
                {activeTab === 'system_health' && 'Integration & System Health Monitor'}
                {activeTab === 'audit_logs' && 'Security Audit & Compliance Logs'}
                {activeTab === 'reports_exports' && 'Reports, Data Exports & Ministerial Rollups'}
                {activeTab === 'notifications' && 'System Notifications & Circulars'}
                {activeTab === 'settings' && 'Platform Governance & System Settings'}
                {activeTab === 'profile' && 'DIID Administrator Profile & Session'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gov-green/10 text-gov-green text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-gov-green animate-pulse" />
                Live MoSPI Production Node
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
                  { title: 'TOTAL EMPLOYEES', value: (1420 + employees.length - 5).toLocaleString(), sub: 'Across 5 Ministries', icon: Users, color: 'text-gov-blue', border: 'border-l-gov-blue' },
                  { title: 'ORGANIZATION READINESS', value: '68.4%', sub: 'Target: 75%', icon: TrendingUp, color: 'text-gov-green', border: 'border-l-gov-green' },
                  { title: 'CRITICAL SKILL GAPS', value: '38', sub: 'Urgent Intervention Required', icon: AlertTriangle, color: 'text-gov-red', border: 'border-l-gov-red' },
                  { title: 'REGISTERED FACULTY', value: String(trainers.length), sub: 'NSSTA & Domain Academies', icon: GraduationCap, color: 'text-gov-saffron', border: 'border-l-gov-saffron' },
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

              {/* Department Competency Matrix */}
              <div className="gov-card overflow-hidden shadow-xs">
                <div className="p-4 border-b border-gov-gray-200 flex items-center justify-between bg-gov-off-white">
                  <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={15} className="text-gov-blue" />
                    Department Workforce Competency Matrix
                  </h3>
                  <span className="text-xs text-gov-gray-500">Live Ministry Rollup</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gov-gray-100 text-gov-gray-600 font-bold border-b border-gov-gray-200">
                      <tr>
                        <th className="p-3">Department / Division</th>
                        <th className="p-3 text-center">Officers</th>
                        <th className="p-3">Average Readiness</th>
                        <th className="p-3 text-center">Critical Gaps</th>
                        <th className="p-3">Priority Capacity Need</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gov-gray-200">
                      {departmentHealth.map((dept) => (
                        <tr key={dept.name} className="hover:bg-gov-gray-50 transition-colors">
                          <td className="p-3 font-bold text-gov-navy">{dept.name}</td>
                          <td className="p-3 text-center text-gov-gray-700">{dept.officers}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="progress-track h-2 w-28 bg-gov-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    dept.readiness >= 70 ? 'bg-gov-green' : dept.readiness >= 60 ? 'bg-gov-saffron' : 'bg-gov-red'
                                  }`}
                                  style={{ width: `${dept.readiness}%` }}
                                />
                              </div>
                              <span className="font-bold text-gov-navy">{dept.readiness}%</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="badge-gov-danger text-[10px] font-bold">{dept.criticalGaps} Gaps</span>
                          </td>
                          <td className="p-3 text-gov-gray-600 font-medium">{dept.topNeed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              2. EMPLOYEE MANAGEMENT
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="gov-card p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 max-w-md">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gov-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, role, or iGOT ID..."
                      value={empSearch}
                      onChange={(e) => setEmpSearch(e.target.value)}
                      className="gov-input pl-9 text-xs w-full"
                    />
                  </div>
                  <select
                    value={empDeptFilter}
                    onChange={(e) => setEmpDeptFilter(e.target.value)}
                    className="gov-input text-xs w-52"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowAddEmpModal(true)}
                  className="btn-gov-primary text-xs py-2 px-4 flex items-center gap-2 shrink-0 shadow-xs"
                >
                  <UserPlus size={15} />
                  <span>Add New Employee</span>
                </button>
              </div>

              <div className="gov-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gov-gray-100 text-gov-gray-600 font-bold border-b border-gov-gray-200">
                      <tr>
                        <th className="p-3">Officer Details</th>
                        <th className="p-3">Department & Cadre</th>
                        <th className="p-3">Designation / Role</th>
                        <th className="p-3 text-center">Competency</th>
                        <th className="p-3 text-center">Diagnostic</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gov-gray-200">
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gov-gray-50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-gov-navy">{emp.name}</div>
                            <div className="text-[10px] text-gov-gray-400">{emp.igotId || emp.email || 'IGOT-SYS-001'}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-gov-navy">{emp.department}</div>
                            <div className="text-[10px] text-gov-gray-500">{emp.cadre}</div>
                          </td>
                          <td className="p-3 font-semibold text-gov-navy">{emp.currentRole || emp.designation}</td>
                          <td className="p-3 text-center font-bold text-gov-navy">{emp.overallCompetency}%</td>
                          <td className="p-3 text-center font-bold text-gov-blue">{emp.diagnosticScore || emp.overallCompetency}%</td>
                          <td className="p-3 text-center"><span className="badge-gov-success text-[10px]">ACTIVE</span></td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => setSelectedPerformanceEmp(emp)} className="p-1 rounded text-gov-blue hover:bg-gov-blue-light">
                                <Eye size={14} />
                              </button>
                              <button onClick={() => handleDeleteEmployee(emp.id)} className="p-1 rounded text-gov-red hover:bg-gov-red/10">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              3. DEPARTMENTS & ROLES
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'departments_roles' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEPARTMENTS.filter(d => d.id !== 'all').map((dept) => (
                  <div key={dept.id} className="gov-card p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-gov-blue" />
                        <h4 className="text-sm font-bold text-gov-navy">{dept.name}</h4>
                      </div>
                      <span className="badge-gov-info text-[10px]">{dept.code}</span>
                    </div>
                    <p className="text-xs text-gov-gray-600">{dept.ministry}</p>
                    <div className="p-3 bg-gov-off-white rounded text-xs space-y-1 border border-gov-gray-200">
                      <p className="font-semibold text-gov-navy">Cadre Hierarchy:</p>
                      <p className="text-gov-gray-500">Statistical Investigator (Level 6) · Senior Statistical Officer (Level 7) · Deputy Director (Level 11)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              4. USER & ACCESS MANAGEMENT (RBAC)
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'user_access' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gov-navy">Role-Based Access Control (RBAC) Directory</h3>
                <button onClick={() => setShowAddTrainerModal(true)} className="btn-gov-saffron text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Plus size={14} /> Register Faculty / Trainer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainers.map((tr) => (
                  <div key={tr.id} className="gov-card p-4 space-y-2 shadow-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-gov-navy">{tr.name}</h4>
                        <p className="text-xs text-gov-gray-600">{tr.role}</p>
                        <p className="text-[11px] text-gov-gray-400">{tr.email}</p>
                      </div>
                      <span className="badge-gov-saffron text-[9px]">FACULTY</span>
                    </div>
                    <div className="p-2 bg-gov-off-white rounded text-xs border border-gov-gray-200 flex justify-between">
                      <span>Assigned: <strong>{tr.department}</strong></span>
                      <button onClick={() => handleDeleteTrainer(tr.id)} className="text-gov-red text-[11px] font-bold hover:underline">Revoke</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              5. COURSE CATALOGUE
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'course_catalogue' && (
            <div className="space-y-4">
              <div className="gov-card p-4 bg-gov-off-white flex justify-between items-center text-xs">
                <span className="font-bold text-gov-navy">National Civil Service Course Repository (50+ Curricula)</span>
                <span className="badge-gov-success text-[10px]">Synced with iGOT & TPAC</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'National Statistical Systems Foundations', dept: 'MoSPI', hours: '36h', tier: 'Mandatory' },
                  { title: 'Crop Cutting & Remote Sensing Analytics', dept: 'Agriculture', hours: '24h', tier: 'Elective' },
                  { title: 'Public Health Telemetry & HMIS Audit', dept: 'Health', hours: '28h', tier: 'Specialized' },
                  { title: 'Periodic Labour Force Field Procedures', dept: 'Labour', hours: '32h', tier: 'Mandatory' },
                  { title: 'UDISE+ School Telemetry Standards', dept: 'Education', hours: '20h', tier: 'Specialized' },
                ].map((c) => (
                  <div key={c.title} className="gov-card p-4 space-y-2 shadow-xs">
                    <span className="badge-gov-info text-[9px]">{c.dept}</span>
                    <h4 className="text-xs font-bold text-gov-navy">{c.title}</h4>
                    <div className="text-[11px] text-gov-gray-500 flex justify-between pt-1 border-t border-gov-gray-100">
                      <span>Duration: {c.hours}</span>
                      <span className="font-semibold text-gov-blue">{c.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              6. TRAINING PROGRAMMES
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'programmes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Mission Karmayogi Phase 2: Statistical Capacity', cohorts: 4, budget: 'Plan Approved', status: 'ACTIVE' },
                  { title: 'Agricultural Statistics Digital Census Workshop', cohorts: 2, budget: 'DES Allocated', status: 'SCHEDULED' },
                  { title: 'Public Health Analytics Cadre Elevation', cohorts: 3, budget: 'NHM Supported', status: 'ACTIVE' },
                ].map((p) => (
                  <div key={p.title} className="gov-card p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="badge-gov-success text-[10px]">{p.status}</span>
                      <span className="text-xs text-gov-gray-400">{p.budget}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gov-navy">{p.title}</h4>
                    <p className="text-xs text-gov-gray-500">Active Cohorts: {p.cohorts} batches across regional academies.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              7. COMPETENCY FRAMEWORK
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'competency_framework' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="gov-card p-5 space-y-2 border-l-4 border-l-gov-blue">
                  <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Domain Competencies</h4>
                  <p className="text-xs text-gov-gray-600">Survey Sampling, Crop Estimation, Epidemiological Data, Labour Indices, Price Indices.</p>
                </div>
                <div className="gov-card p-5 space-y-2 border-l-4 border-l-gov-green">
                  <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Functional Competencies</h4>
                  <p className="text-xs text-gov-gray-600">Data Validation, Quality Auditing, Geospatial Mapping, Statistical Inference.</p>
                </div>
                <div className="gov-card p-5 space-y-2 border-l-4 border-l-gov-saffron">
                  <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Behavioral Competencies</h4>
                  <p className="text-xs text-gov-gray-600">Ethical Data Handling, Citizen Centricity, Public Accountability, Leadership.</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              8. WORKFORCE ANALYTICS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'workforce_analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="gov-card p-4 border-l-4 border-l-gov-green">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase">High Competency (&gt;70%)</span>
                  <p className="text-2xl font-black text-gov-green">
                    {employees.filter(e => (e.overallCompetency || 60) >= 70).length} Officers
                  </p>
                </div>
                <div className="gov-card p-4 border-l-4 border-l-gov-saffron">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase">Moderate (60-70%)</span>
                  <p className="text-2xl font-black text-gov-saffron">
                    {employees.filter(e => (e.overallCompetency || 60) >= 60 && (e.overallCompetency || 60) < 70).length} Officers
                  </p>
                </div>
                <div className="gov-card p-4 border-l-4 border-l-gov-red">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase">Attention (&lt;60%)</span>
                  <p className="text-2xl font-black text-gov-red">
                    {employees.filter(e => (e.overallCompetency || 60) < 60).length} Officers
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              9. FUTURE ROLE DEMAND
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'future_demand' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { targetRole: 'Senior Statistical Officer (SSO)', dept: 'MoSPI / NSO', required: 120, ready: 78, gap: 42 },
                  { targetRole: 'Deputy Director (Health Analytics)', dept: 'Health (MoHFW)', required: 45, ready: 24, gap: 21 },
                  { targetRole: 'Senior Agricultural Economist', dept: 'Agriculture (DES)', required: 60, ready: 34, gap: 26 },
                  { targetRole: 'Senior Research Officer (Labour)', dept: 'Labour (MoLE)', required: 40, ready: 19, gap: 21 },
                ].map((role) => (
                  <div key={role.targetRole} className="gov-card p-5 space-y-2">
                    <span className="badge-gov-info text-[9px]">{role.dept}</span>
                    <h4 className="text-sm font-bold text-gov-navy">{role.targetRole}</h4>
                    <div className="p-2.5 bg-gov-off-white rounded border border-gov-gray-200 text-xs flex justify-between">
                      <span>Demand: <strong>{role.required}</strong></span>
                      <span className="text-gov-green font-bold">Ready: {role.ready}</span>
                      <span className="text-gov-red font-bold">Deficit: {role.gap}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              10. INTEGRATION & SYSTEM HEALTH
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'system_health' && (
            <div className="gov-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={20} className="text-gov-green" />
                  <h3 className="text-sm font-bold text-gov-navy">National Platform Health & Telemetry</h3>
                </div>
                <span className="badge-gov-success text-[10px]">ALL SYSTEMS OPERATIONAL</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-gov-off-white rounded border border-gov-gray-200 space-y-1">
                  <span className="text-gov-gray-400 font-bold">iGOT API v2.4</span>
                  <p className="font-bold text-gov-navy">Latency 14ms · 200 OK</p>
                </div>
                <div className="p-3 bg-gov-off-white rounded border border-gov-gray-200 space-y-1">
                  <span className="text-gov-gray-400 font-bold">Database Replica</span>
                  <p className="font-bold text-gov-navy">Synchronized · 99.98% Uptime</p>
                </div>
                <div className="p-3 bg-gov-off-white rounded border border-gov-gray-200 space-y-1">
                  <span className="text-gov-gray-400 font-bold">DigiLocker Ledger</span>
                  <p className="font-bold text-gov-navy">Active Signing Key Valid</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              11. AUDIT LOGS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'audit_logs' && (
            <div className="gov-card divide-y divide-gov-gray-200 shadow-xs">
              <div className="p-4 bg-gov-off-white flex justify-between items-center text-xs">
                <span className="font-bold text-gov-navy uppercase tracking-wider">System Security & Compliance Trail</span>
                <span className="badge-gov-info text-[10px]">{auditLogs.length} Events</span>
              </div>
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-gov-navy">{log.action}</p>
                    <p className="text-[11px] text-gov-gray-500">{log.user} · IP: {log.ip}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge-gov-success text-[9px]">{log.status}</span>
                    <p className="text-[10px] text-gov-gray-400 mt-0.5">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              12. REPORTS & EXPORTS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'reports_exports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'National Competency Rollup Q3.csv', size: '2.4 MB', type: 'CSV Spreadsheet' },
                  { title: 'Ministry Skill Gap Audit 2026.pdf', size: '4.8 MB', type: 'Official Report' },
                  { title: 'Civil Servant Onboarding Registry.xlsx', size: '1.9 MB', type: 'Excel Workbook' },
                ].map((r) => (
                  <div key={r.title} className="gov-card p-5 space-y-3">
                    <FileSpreadsheet size={20} className="text-gov-green" />
                    <h4 className="text-xs font-bold text-gov-navy leading-snug">{r.title}</h4>
                    <div className="flex justify-between items-center text-xs text-gov-gray-500 pt-2 border-t border-gov-gray-100">
                      <span>{r.size}</span>
                      <button onClick={() => alert(`Exporting ${r.title}...`)} className="btn-gov-secondary text-[11px] py-1 px-2.5 flex items-center gap-1">
                        <Download size={12} /> Export
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              13. NOTIFICATIONS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'notifications' && (
            <div className="gov-card divide-y divide-gov-gray-200 shadow-xs">
              <div className="p-4 bg-gov-off-white flex justify-between items-center text-xs">
                <span className="font-bold text-gov-navy uppercase tracking-wider">Administrative Bulletins & Alerts</span>
                <span className="badge-gov-info text-[10px]">{adminNotifications.length} Bulletins</span>
              </div>
              {adminNotifications.map((n) => (
                <div key={n.id} className="p-4 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-bold text-gov-navy flex items-center gap-2">
                      {n.title}
                      {n.unread && <span className="w-2 h-2 rounded-full bg-gov-saffron" />}
                    </h5>
                    <p className="text-gov-gray-600 mt-1">{n.desc}</p>
                  </div>
                  <span className="text-[10px] text-gov-gray-400 shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              14. PLATFORM SETTINGS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div className="gov-card p-6 space-y-5 text-xs">
              <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                <Settings size={18} className="text-gov-navy" />
                DIID Governance Suite Configuration
              </h3>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 bg-gov-off-white rounded border border-gov-gray-200">
                  <div>
                    <p className="font-bold text-gov-navy">Enforce 2FA via Gov.in Single Sign-On</p>
                    <p className="text-gov-gray-500 text-[11px]">Require NIC/Gov.in OTP authentication for all administrative actions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-gov-navy rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gov-off-white rounded border border-gov-gray-200">
                  <div>
                    <p className="font-bold text-gov-navy">Automated Daily Telemetry Sync</p>
                    <p className="text-gov-gray-500 text-[11px]">Push updated employee competency scores to iGOT Karmayogi central server</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-gov-navy rounded" />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              15. ADMIN PROFILE
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="gov-card p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gov-green/20 text-gov-navy flex items-center justify-center font-bold text-2xl">
                  AD
                </div>
                <div>
                  <h3 className="text-base font-bold text-gov-navy">National DIID Administrator</h3>
                  <p className="text-xs text-gov-gray-600">Ministry of Statistics & Programme Implementation (MoSPI)</p>
                  <p className="text-[11px] text-gov-gray-400 mt-0.5">Admin ID: DIID-ADM-001 · admin.diid@nic.in</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-gov-gray-200">
                <div className="p-3 bg-gov-off-white rounded border border-gov-gray-200 space-y-1">
                  <span className="text-gov-gray-400 font-bold block uppercase text-[10px]">Administrative Privileges</span>
                  <p className="font-bold text-gov-navy">Full Governance Master Control · Cadre Onboarding & Faculty Management</p>
                </div>
                <div className="p-3 bg-gov-off-white rounded border border-gov-gray-200 space-y-1">
                  <span className="text-gov-gray-400 font-bold block uppercase text-[10px]">Active Session</span>
                  <p className="font-bold text-gov-navy">Encrypted TLS 1.3 Session · National NIC Intranet</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODALS (ADD EMPLOYEE, ADD TRAINER, PERFORMANCE AUDIT) ─────── */}
      <AnimatePresence>
        {showAddEmpModal && (
          <div className="fixed inset-0 bg-gov-navy/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-gov border border-gov-gray-300 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 bg-gov-navy text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <UserPlus size={18} className="text-gov-saffron" />
                  <h3 className="text-sm font-bold text-white">Onboard New Government Officer</h3>
                </div>
                <button onClick={() => setShowAddEmpModal(false)} className="p-1 rounded text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateEmployee} className="p-5 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gov-navy mb-1">Full Name & Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Verma"
                    value={newEmp.name}
                    onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                    className="gov-input w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Department / Ministry *</label>
                    <select
                      value={newEmp.department}
                      onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                      className="gov-input w-full"
                    >
                      {DEPARTMENTS.filter(d => d.id !== 'all').map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Cadre Level</label>
                    <input
                      type="text"
                      placeholder="e.g. Subordinate Statistical Service"
                      value={newEmp.cadre}
                      onChange={(e) => setNewEmp({ ...newEmp, cadre: e.target.value })}
                      className="gov-input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Current Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Statistical Investigator"
                      value={newEmp.currentRole}
                      onChange={(e) => setNewEmp({ ...newEmp, currentRole: e.target.value })}
                      className="gov-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Target Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Statistical Officer"
                      value={newEmp.targetRole}
                      onChange={(e) => setNewEmp({ ...newEmp, targetRole: e.target.value })}
                      className="gov-input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Official Email</label>
                    <input
                      type="email"
                      placeholder="officer@nic.in"
                      value={newEmp.email}
                      onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                      className="gov-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Competency (%)</label>
                    <input
                      type="number"
                      min="20"
                      max="100"
                      value={newEmp.overallCompetency}
                      onChange={(e) => setNewEmp({ ...newEmp, overallCompetency: e.target.value })}
                      className="gov-input w-full"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gov-gray-200 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowAddEmpModal(false)} className="btn-gov-secondary text-xs py-2 px-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gov-primary text-xs py-2 px-5 font-bold">
                    Save & Enroll Officer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Trainer Modal */}
      <AnimatePresence>
        {showAddTrainerModal && (
          <div className="fixed inset-0 bg-gov-navy/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-gov border border-gov-gray-300 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-gov-navy text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-gov-saffron" />
                  <h3 className="text-sm font-bold text-white">Register Academy Faculty</h3>
                </div>
                <button onClick={() => setShowAddTrainerModal(false)} className="p-1 rounded text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTrainer} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gov-navy mb-1">Faculty Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. K. Radhakrishnan"
                    value={newTrainer.name}
                    onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                    className="gov-input w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Department / Academy *</label>
                    <select
                      value={newTrainer.department}
                      onChange={(e) => setNewTrainer({ ...newTrainer, department: e.target.value })}
                      className="gov-input w-full"
                    >
                      {DEPARTMENTS.filter(d => d.id !== 'all').map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gov-navy mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="faculty@nssta.gov.in"
                      value={newTrainer.email}
                      onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                      className="gov-input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gov-navy mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Survey Sampling & National Accounts"
                    value={newTrainer.specialization}
                    onChange={(e) => setNewTrainer({ ...newTrainer, specialization: e.target.value })}
                    className="gov-input w-full"
                  />
                </div>

                <div className="pt-3 border-t border-gov-gray-200 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowAddTrainerModal(false)} className="btn-gov-secondary text-xs py-2 px-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gov-saffron text-xs py-2 px-5 font-bold">
                    Register Faculty
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Performance Audit Modal */}
      <AnimatePresence>
        {selectedPerformanceEmp && (
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
                  <h3 className="text-sm font-bold text-white">Competency Performance Audit</h3>
                </div>
                <button onClick={() => setSelectedPerformanceEmp(null)} className="p-1 rounded text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                <div className="p-4 bg-gov-off-white rounded-gov border border-gov-gray-200 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gov-navy text-white flex items-center justify-center font-bold text-base">
                    {selectedPerformanceEmp.avatarInitials || 'EM'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gov-navy">{selectedPerformanceEmp.name}</h4>
                    <p className="text-gov-gray-600">{selectedPerformanceEmp.currentRole || selectedPerformanceEmp.designation}</p>
                    <p className="text-[10px] text-gov-gray-400">{selectedPerformanceEmp.department} · {selectedPerformanceEmp.cadre}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gov-gray-400 block">OVERALL READINESS</span>
                    <span className="text-xl font-black text-gov-navy">{selectedPerformanceEmp.overallCompetency}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded border border-gov-gray-200 text-center">
                    <span className="text-[10px] text-gov-gray-400 font-bold block">DIAGNOSTIC QUIZ</span>
                    <span className="text-base font-black text-gov-blue">{selectedPerformanceEmp.diagnosticScore || selectedPerformanceEmp.overallCompetency}%</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-gov-gray-200 text-center">
                    <span className="text-[10px] text-gov-gray-400 font-bold block">LEARNING PROGRESS</span>
                    <span className="text-base font-black text-gov-green">{selectedPerformanceEmp.learningProgressPercent || 65}%</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-gov-gray-200 text-center">
                    <span className="text-[10px] text-gov-gray-400 font-bold block">CRITICAL GAPS</span>
                    <span className="text-base font-black text-gov-red">{selectedPerformanceEmp.criticalGapsCount || 1} Gaps</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gov-off-white border-t border-gov-gray-200 flex justify-end shrink-0">
                <button onClick={() => setSelectedPerformanceEmp(null)} className="btn-gov-primary text-xs py-1.5 px-4">
                  Close Audit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
