import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

export default function MainLayout() {
  const { isAuthenticated } = useApp();
  const location = useLocation();

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

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#080F15] text-slate-800 dark:text-slate-100 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
