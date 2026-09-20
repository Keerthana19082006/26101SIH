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
  LogOut,
  X,
  Shield
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  onBackToPortals,
  mobile = false,
  onClose,
  employeeCount = 5,
  unreadNotificationsCount = 3,
}) {
  const navSections = [
    {
      title: 'GOVERNANCE & PERSONNEL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employee Management', icon: Users, badge: `${employeeCount}` },
        { id: 'departments_roles', label: 'Departments & Roles', icon: Building2 },
        { id: 'user_access', label: 'User & Access Management', icon: ShieldCheck, badge: 'RBAC' },
      ],
    },
    {
      title: 'CURRICULUM & CAPACITY',
      items: [
        { id: 'course_catalogue', label: 'Course Catalogue', icon: BookOpen, badge: '50+' },
        { id: 'programmes', label: 'Training Programmes', icon: Award },
        { id: 'competency_framework', label: 'Competency Framework', icon: Target },
      ],
    },
    {
      title: 'WORKFORCE INTELLIGENCE',
      items: [
        { id: 'workforce_analytics', label: 'Workforce Analytics', icon: BarChart3, badge: 'Live' },
        { id: 'future_demand', label: 'Future Role Demand', icon: Compass },
        { id: 'reports_exports', label: 'Reports & Exports', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'SECURITY & SYSTEM',
      items: [
        { id: 'system_health', label: 'Integration & System Health', icon: Activity, badge: 'Online' },
        { id: 'audit_logs', label: 'Audit Logs', icon: FileText },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount ? `${unreadNotificationsCount}` : null },
        { id: 'settings', label: 'Platform Settings', icon: Settings },
        { id: 'profile', label: 'Admin Profile', icon: User },
      ],
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-gov-gray-200 flex flex-col h-full select-none ${
        mobile
          ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl animate-in slide-in-from-left duration-200'
          : 'w-64 shrink-0'
      }`}
    >
      {/* Top Header Branding */}
      <div className="p-4 border-b border-gov-gray-200 bg-gov-navy text-white shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gov-green flex items-center justify-center font-bold text-white shadow-xs">
              <Shield size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold leading-tight text-white tracking-wide">Admin Portal</p>
                <span className="w-1.5 h-1.5 rounded-full bg-gov-green animate-pulse" />
              </div>
              <p className="text-[10px] text-white/70 leading-tight">DIID Governance Suite</p>
            </div>
          </div>

          {mobile && (
            <button
              onClick={onClose}
              className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Role Context Bar */}
      <div className="px-4 py-2 bg-gov-off-white border-b border-gov-gray-200 flex items-center justify-between text-[11px] shrink-0">
        <span className="font-bold text-gov-navy uppercase tracking-wider text-[10px]">DIID Master Console</span>
        <span className="badge-gov-success text-[9px] font-bold">MoSPI Node</span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-2.5 space-y-3 text-xs">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-2.5 py-0.5 text-[9px] font-extrabold text-gov-gray-400 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (mobile && onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-gov font-medium transition-all ${
                    active
                      ? 'bg-gov-navy text-white shadow-xs font-bold'
                      : 'text-gov-gray-700 hover:bg-gov-gray-100 hover:text-gov-navy'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={15} className={active ? 'text-gov-saffron' : 'text-gov-gray-500'} />
                    <span className="truncate text-left">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        active
                          ? 'bg-white/20 text-white'
                          : item.badge === 'Online'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gov-gray-100 text-gov-gray-600 border border-gov-gray-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-gov-gray-200 bg-gov-off-white/80 shrink-0 space-y-2">
        <div className="p-2 bg-white rounded-gov border border-gov-gray-200 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gov-navy/10 text-gov-navy flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gov-navy truncate">Administrator</p>
            <p className="text-[10px] text-gov-gray-500 truncate">MoSPI DIID Operations</p>
          </div>
        </div>

        <button
          onClick={onBackToPortals}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gov-gray-100 hover:bg-gov-gray-200 text-gov-gray-700 hover:text-gov-navy text-xs font-bold rounded-gov border border-gov-gray-200 transition-colors"
        >
          <LogOut size={13} />
          <span>Switch Portal Workspace</span>
        </button>
      </div>
    </aside>
  );
}
