import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Compass,
  Calendar,
  FileText,
  MessageSquareQuote,
  User,
  X,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ isMobileOpen = false, onClose = () => {} }) {
  const { logout, assessmentData } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sidebar Navigation Items
  const navItems = [
    { to: '/', label: 'หน้าหลัก', icon: Home },
    { to: '/assessment', label: 'แบบสอบถามความสนใจ', icon: Sparkles, badge: 'AI' },
    { to: '/recommendation', label: 'แนะนำจัดตาราง', icon: Compass },
    { to: '/timetable', label: 'ตารางเรียน', icon: Calendar },
    { to: '/gpa-simulator', label: 'ผลการเรียน & คำนวณเกรด', icon: FileText },
    { to: '/reviews', label: 'รีวิวรายวิชา', icon: MessageSquareQuote },
    { to: '/profile', label: 'ข้อมูลส่วนตัว', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#005A56] dark:bg-[#072421] text-white flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#086864]/60 dark:border-teal-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-teal-950 flex items-center justify-center font-black text-sm shadow-md">
              UBU
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">UBU Registration</div>
              <div className="text-[11px] text-teal-200">มหาวิทยาลัยอุบลราชธานี</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            aria-label="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation List */}
        <div className="py-4 flex-1 overflow-y-auto">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${
                      isActive
                        ? 'bg-[#1D7470] dark:bg-[#0e3b37] text-white shadow-md border-l-4 border-amber-400 pl-3.5'
                        : 'text-teal-100/90 hover:bg-[#086864] hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-teal-950 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Mobile Logout Button */}
        <div className="p-4 shrink-0 border-t border-[#086864]/50 dark:border-[#0c2e2b]">
          <button
            onClick={() => {
              onClose();
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F07C00] hover:bg-[#d96e00] text-white text-sm font-bold shadow-lg shadow-[#F07C00]/30 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#005A56] dark:bg-[#072421] text-white flex-col justify-between h-screen sticky top-0 shrink-0 shadow-xl border-r border-[#004744] dark:border-teal-900/60 z-40 transition-all select-none">
        {/* Top Nav Area */}
        <div className="pt-6 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-5 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1D7470] dark:bg-[#0e3b37] text-white shadow-xs rounded-r-2xl border-l-4 border-amber-400 pl-4.5'
                        : 'text-teal-100/90 dark:text-teal-200/80 hover:bg-[#086864] dark:hover:bg-[#0a2c29] hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="tracking-wide text-sm font-bold">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-400 text-teal-950 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Permanently Docked Bottom Left Logout Button */}
        <div className="p-5 sm:p-6 shrink-0 mt-auto border-t border-[#086864]/50 dark:border-[#0c2e2b]">
          <button
            onClick={handleLogout}
            id="logout-btn"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#F07C00] hover:bg-[#d96e00] text-white text-base font-bold shadow-lg shadow-[#F07C00]/30 transition-all hover:translate-y-[-1px] active:translate-y-0 cursor-pointer"
          >
            <div className="w-6 h-6 rounded border-2 border-white flex items-center justify-center shrink-0">
              <svg
                className="w-3.5 h-3.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}
