import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Compass,
  Calendar,
  FileText,
  Menu,
  Sparkles,
} from 'lucide-react';

export default function MainLayout() {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close mobile drawer when switching routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Determine page title based on path
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'หน้าหลักและภาพรวมการเรียน (Dashboard)', subtitle: 'ศูนย์กลางข้อมูลและแนะนำแผนการเรียนอัจฉริยะ' };
      case '/registration':
        return { title: 'ระบบลงทะเบียนเรียนออนไลน์ (Course Registration)', subtitle: 'ขั้นตอน 1-2-3-4 สำหรับลงทะเบียนเรียนภาคการศึกษา 1/2569' };
      case '/gpa-simulator':
        return { title: 'เครื่องมือจำลองและคำนวณเกรดล่วงหน้า (GPA What-If Simulator)', subtitle: 'จำลองเกรดที่คาดหวังในแต่ละรายวิชาเพื่อคำนวณ GPAX ใหม่และสถานะเกียรตินิยมแบบเรียลไทม์' };
      case '/recommendations':
      case '/recommendation':
        return { title: 'แนะนำจัดตารางเรียน & แผนผังสายอาชีพ (Smart Advisory)', subtitle: 'จัดตารางเรียนที่เหมาะสมกับศักยภาพและเป้าหมายของคุณ' };
      case '/assessment':
        return { title: 'แบบสอบถามความสนใจและสไตล์การเรียนรู้ (Learning Style Assessment)', subtitle: 'วิเคราะห์ทักษะเด่นและความถนัดเฉพาะตัวเพื่อจับคู่วิชาเรียนและสายอาชีพ' };
      case '/timetable':
        return { title: 'ตารางเรียนจำลอง & วางแผนลงทะเบียน (Course Planner)', subtitle: 'ระบบตรวจจับวิชาชนและควบคุมสมดุลความหนักของวิชา (Workload)' };
      case '/reviews':
        return { title: 'ชุมชนรีวิววิชาเลือกจากรุ่นพี่ (Course Community Review)', subtitle: 'ข้อมูลเชิงลึกจริงใจจากเพื่อนและรุ่นพี่ ม.อุบลฯ' };
      case '/profile':
        return { title: 'ข้อมูลส่วนตัวนักศึกษา (Student Profile)', subtitle: 'รายละเอียดหลักสูตร คณะ สาขา และประวัติการศึกษา' };
      default:
        return { title: 'ระบบลงทะเบียนเรียน มหาวิทยาลัยอุบลราชธานี', subtitle: 'UBU Smart Advisory & Course Registration' };
    }
  };

  const { title, subtitle } = getPageInfo();

  // Bottom navigation items for mobile
  const bottomNavItems = [
    { to: '/', label: 'หน้าหลัก', icon: Home, end: true },
    { to: '/recommendation', label: 'แนะนำตาราง', icon: Compass, end: false },
    { to: '/timetable', label: 'ตารางเรียน', icon: Calendar, end: false },
    { to: '/gpa-simulator', label: 'คำนวณเกรด', icon: FileText, end: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#080F15] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Sidebar with responsive mobile drawer support */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with hamburger toggle */}
        <Header
          title={title}
          subtitle={subtitle}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 lg:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Dock (Thumb-friendly on Smartphones) */}
      <nav
        aria-label="เมนูหลักบนมือถือ"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0C151D]/95 border-t border-[#D1EAE5]/80 dark:border-slate-800/80 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-inset-bottom"
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-[10px] font-bold transition-all ${
                  isActive
                    ? 'text-[#005A56] dark:text-teal-300 font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#E6F4F1] dark:bg-teal-950/80 text-[#005A56] dark:text-teal-300 shadow-2xs'
                        : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="mt-0.5 tracking-tight truncate max-w-[64px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Menu Toggle Button in Bottom Bar */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
          title="เมนูทั้งหมด"
        >
          <div className="p-1 rounded-xl">
            <Menu className="w-5 h-5" />
          </div>
          <span className="mt-0.5 tracking-tight">เมนูอื่น ๆ</span>
        </button>
      </nav>
    </div>
  );
}
