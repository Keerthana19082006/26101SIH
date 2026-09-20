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
  LogOut,
  X,
  GraduationCap
} from 'lucide-react';

export default function TrainerSidebar({
  activeTab,
  onSelectTab,
  onBackToPortals,
  mobile = false,
  onClose,
  materialsCount = 6,
  traineesCount = 5,
  pendingReviewCount = 3,
  unreadNotificationsCount = 2,
}) {
  const navSections = [
    {
      title: 'ACADEMIC CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'My Courses', icon: BookOpen, badge: '6 Active' },
        { id: 'materials', label: 'Learning Materials', icon: FileText, badge: `${materialsCount}` },
        { id: 'programmes', label: 'Training Programmes', icon: Award },
      ],
    },
    {
      title: 'AI & ASSESSMENT',
      items: [
        { id: 'ai_generator', label: 'AI MCQ Generator', icon: Sparkles, badge: 'AI' },
        { id: 'question_review', label: 'Question Review', icon: ClipboardCheck, badge: pendingReviewCount ? `${pendingReviewCount} Pending` : null },
        { id: 'question_bank', label: 'Question Bank', icon: Layers, badge: '160+' },
      ],
    },
    {
      title: 'PERFORMANCE & ANALYTICS',
      items: [
        { id: 'performance', label: 'Employee Performance', icon: TrendingUp, badge: `${traineesCount}` },
        { id: 'analytics', label: 'Training Analytics', icon: BarChart3 },
        { id: 'assistant', label: 'AI Training Assistant', icon: Bot, badge: 'Interactive' },
      ],
    },
    {
      title: 'ACCOUNT & SYSTEM',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount ? `${unreadNotificationsCount}` : null },
        { id: 'profile', label: 'Trainer Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
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
            <div className="w-8 h-8 rounded bg-gov-saffron flex items-center justify-center font-bold text-white shadow-xs">
              <GraduationCap size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold leading-tight text-white tracking-wide">Trainer Portal</p>
                <span className="w-1.5 h-1.5 rounded-full bg-gov-saffron animate-pulse" />
              </div>
              <p className="text-[10px] text-white/70 leading-tight">NSSTA / iGOT Karmayogi</p>
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
        <span className="font-bold text-gov-navy uppercase tracking-wider text-[10px]">Faculty Studio</span>
        <span className="badge-gov-saffron text-[9px] font-bold">NSSTA Academy</span>
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
                          : item.badge === 'AI'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
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
          <div className="w-7 h-7 rounded-full bg-gov-saffron/20 text-gov-navy flex items-center justify-center font-bold text-xs">
            TR
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gov-navy truncate">Dr. Rajeshwar Sharma</p>
            <p className="text-[10px] text-gov-gray-500 truncate">Senior Faculty · NSSTA</p>
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
