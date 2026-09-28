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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
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
    { to: '/gpa-simulator', label: 'ผลการเรียน', icon: FileText },
    { to: '/reviews', label: 'รีวิวรายวิชา', icon: MessageSquareQuote },
    { to: '/profile', label: 'ข้อมูลส่วนตัว', icon: User },
  ];

  return (
    <aside className="w-60 sm:w-64 bg-[#005A56] dark:bg-[#061716] text-white flex flex-col justify-between h-screen sticky top-0 shrink-0 shadow-xl border-r border-[#004744] dark:border-[#0c2e2b] z-40 transition-all select-none">
      {/* Top Nav Area */}
      <div className="pt-5 sm:pt-6 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-5 py-3 text-sm sm:text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1D7470] dark:bg-[#0e3b37] text-white shadow-xs rounded-r-2xl border-l-4 border-amber-400 pl-4.5'
                      : 'text-teal-100/90 dark:text-teal-200/80 hover:bg-[#086864] dark:hover:bg-[#0a2c29] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="tracking-wide text-xs sm:text-sm font-bold">{item.label}</span>
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
          {/* Logout icon inside box matching Image 1 */}
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
  );
}
