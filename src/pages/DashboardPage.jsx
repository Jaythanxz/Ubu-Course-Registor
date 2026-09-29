import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Headphones,
  Search,
  Calendar,
  ClipboardList,
  X,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, passedCourses, courses, assessmentData } = useApp();
  const navigate = useNavigate();
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(null);

  const passedDetails = passedCourses.map(
    (id) => courses.find((c) => c.course_id === id) || { course_id: id, course_name_th: id }
  );

  const newsList = [
    {
      id: 1,
      title: 'ประกาศรับสมัครนักศึกษา',
      subtitle: 'เริ่มเปิดรับสมัครในวันที่ 10/09/2569',
      details: 'มหาวิทยาลัยอุบลราชธานี ประกาศเปิดรับสมัครนักศึกษาใหม่ ประจำปีการศึกษา 2569 รอบทั่วไป สามารถตรวจสอบคุณสมบัติและส่งเอกสารได้ผ่านระบบออนไลน์ของมหาวิทยาลัย',
    },
    {
      id: 2,
      title: 'เริ่มสอบปลายภาค',
      subtitle: 'เริ่มการสอบปลายภาค ปีการศึกษา 2569/1 ในวันที่ 5-16 ตุลาคม 2569',
      details: 'กำหนดการสอบปลายภาค ภาคการศึกษาที่ 1/2569 ขอให้นักศึกษาตรวจสอบตารางสอบและห้องสอบให้เรียบร้อย และปฏิบัติตามระเบียบการเข้าห้องสอบอย่างเคร่งครัด',
    },
    {
      id: 3,
      title: 'วันปิด - เปิด ภาคเรียน',
      subtitle: 'อ่านเพิ่มเติม....',
      details: 'กำหนดการเปิดภาคเรียนที่ 2/2569 เริ่มวันที่ 1 พฤศจิกายน 2569 และปิดภาคเรียนวันที่ 15 มีนาคม 2570 ติดตามปฏิทินการศึกษาฉบับเต็มได้ที่สำนักทะเบียน',
    },
    {
      id: 4,
      title: 'เปิดการลงเรียนภาคฤดูร้อน',
      subtitle: 'ติดตามประกาศและสอบถามในเพจ Facebook',
      details: 'การลงทะเบียนเรียนภาคฤดูร้อน ปีการศึกษา 2569 จะเปิดให้ลงทะเบียนล่วงหน้าผ่านระบบ สำหรับนักศึกษาที่ต้องการเก็บวิชาตกค้างหรือวิชาเลือกเสรี',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-10 select-none">
      {/* Registration History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111C24] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D1EAE5] dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#006663] dark:text-teal-400" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  ประวัติการลงทะเบียนเรียน (Registration History)
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              รายวิชาที่ลงทะเบียนและสอบผ่านแล้วในภาคการศึกษาที่ผ่านมา
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {passedDetails.map((c) => (
                <div
                  key={c.course_id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-[#006663] dark:text-teal-400">{c.course_id}</span>{' '}
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{c.course_name_th}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                    ผ่าน (A)
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-[#006663] dark:bg-teal-700 hover:bg-[#004e4b] text-white text-xs font-bold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Details Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111C24] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D1EAE5] dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {showNewsModal.title}
              </h3>
              <button
                onClick={() => setShowNewsModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{showNewsModal.subtitle}</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
              {showNewsModal.details}
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowNewsModal(null)}
                className="px-4 py-2 rounded-xl bg-[#006663] dark:bg-teal-700 hover:bg-[#004e4b] text-white text-xs font-bold cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Header Pill Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Left Pill: ประวัติการลงทะเบียน */}
        <button
          onClick={() => setShowHistoryModal(true)}
          className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border-2 border-[#009688] dark:border-teal-500 bg-white dark:bg-[#111C24] hover:bg-[#E6F4F1] dark:hover:bg-[#172530] text-[#005B58] dark:text-teal-300 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-[#005B58] dark:bg-teal-600 text-white flex items-center justify-center">
            <RotateCcw className="w-3.5 h-3.5" />
          </div>
          <span>ประวัติการลงทะเบียน</span>
        </button>

        {/* Right Pill: ปีการศึกษา 2569/1 */}
        <div className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border-2 border-[#009688] dark:border-teal-500 bg-white dark:bg-[#111C24] text-[#005B58] dark:text-teal-300 text-xs sm:text-sm font-bold shadow-2xs">
          <span>ปีการศึกษา 2569/1</span>
          <div className="flex flex-col text-[#F07C00] font-bold text-xs leading-none">
            <span>▲</span>
            <span>▼</span>
          </div>
        </div>
      </div>

      {/* แบบสอบถามความสนใจ (AI Interest & Learning Style Assessment Banner) */}
      <div className="bg-gradient-to-r from-[#005A56] via-[#006e69] to-[#013f3d] dark:from-[#092e2b] dark:to-[#041716] rounded-3xl p-4 sm:p-6 text-white shadow-md border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold text-teal-200 uppercase tracking-wider">AI Course Advisor</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                {assessmentData?.completed ? 'ประเมินแล้ว' : 'แบบสอบถามแนะนำ'}
              </span>
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-white mt-0.5">
              แบบสอบถามความสนใจและสไตล์การเรียนรู้ (5 ข้อสั้นๆ)
            </h3>
            <p className="text-[11px] sm:text-xs text-teal-100/85 mt-0.5 max-w-xl">
              ค้นหาจุดเด่น ทักษะเฉพาะตัว และสายอาชีพที่เหมาะกับคุณ เพื่อจับคู่วิชาเลือกและ Roadmap ที่ตรงใจ
            </p>
          </div>
        </div>

        <Link
          to="/assessment"
          className="self-stretch sm:self-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#F07C00] hover:bg-[#d96e00] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#F07C00]/30 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>{assessmentData?.completed ? 'ทำแบบสอบถามใหม่' : 'เริ่มทำแบบสอบถาม'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Big Feature Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {/* Card 1: แนะนำการจัดตาราง -> /recommendation */}
        <Link
          to="/recommendation"
          className="bg-white dark:bg-[#111C24] rounded-3xl p-4 sm:p-7 border border-[#D1EAE5] dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-[#009688] dark:hover:border-teal-400 transition-all flex flex-col items-center justify-between text-center min-h-[160px] sm:min-h-[220px] group cursor-pointer"
        >
          <div className="text-sm sm:text-lg font-bold text-[#003835] dark:text-teal-100 leading-snug">
            แนะนำ<br />การจัดตาราง
          </div>
          <div className="my-auto py-2">
            <div className="w-12 h-12 sm:w-18 sm:h-18 rounded-full flex items-center justify-center text-[#005A56] dark:text-teal-400 group-hover:scale-110 transition-transform">
              <svg
                className="w-10 h-10 sm:w-16 sm:h-16 text-[#005A56] dark:text-teal-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                <path d="M9 21h6" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Card 2: ค้นหารายวิชา -> /registration */}
        <Link
          to="/registration"
          className="bg-white dark:bg-[#111C24] rounded-3xl p-4 sm:p-7 border border-[#D1EAE5] dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-[#009688] dark:hover:border-teal-400 transition-all flex flex-col items-center justify-between text-center min-h-[160px] sm:min-h-[220px] group cursor-pointer"
        >
          <div className="text-sm sm:text-lg font-bold text-[#003835] dark:text-teal-100 leading-snug">
            ค้นหารายวิชา
          </div>
          <div className="my-auto py-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#005A56] dark:bg-teal-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3]" />
            </div>
          </div>
        </Link>

        {/* Card 3: จัดตารางเรียน -> /timetable */}
        <Link
          to="/timetable"
          className="bg-white dark:bg-[#111C24] rounded-3xl p-4 sm:p-7 border border-[#D1EAE5] dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-[#009688] dark:hover:border-teal-400 transition-all flex flex-col items-center justify-between text-center min-h-[160px] sm:min-h-[220px] group cursor-pointer"
        >
          <div className="text-sm sm:text-lg font-bold text-[#003835] dark:text-teal-100 leading-snug">
            จัดตารางเรียน
          </div>
          <div className="my-auto py-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#005A56] dark:bg-teal-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
            </div>
          </div>
        </Link>

        {/* Card 4: ผลการลงทะเบียน -> /registration step 4 */}
        <Link
          to="/registration"
          className="bg-white dark:bg-[#111C24] rounded-3xl p-4 sm:p-7 border border-[#D1EAE5] dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-[#009688] dark:hover:border-teal-400 transition-all flex flex-col items-center justify-between text-center min-h-[160px] sm:min-h-[220px] group cursor-pointer"
        >
          <div className="text-sm sm:text-lg font-bold text-[#003835] dark:text-teal-100 leading-snug">
            ผลการลงทะเบียน
          </div>
          <div className="my-auto py-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#005A56] dark:bg-teal-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
            </div>
          </div>
        </Link>
      </div>

      {/* News & Announcements Section matching Image 1 */}
      <div className="space-y-3">
        {/* Heading: 📣 ข่าวสาร / ประกาศ */}
        <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[#004744] dark:text-teal-300">
          <span className="text-2xl">📣</span>
          <h2>ข่าวสาร / ประกาศ</h2>
        </div>

        {/* Outer Teal Box Container matching Image 1 */}
        <div className="rounded-3xl border-2 border-[#009688] dark:border-teal-600 bg-white dark:bg-[#111C24] overflow-hidden shadow-xs">
          {/* List of 4 announcements with right arrows */}
          <div className="divide-y divide-[#E0F2F1] dark:divide-slate-800">
            {newsList.map((item) => (
              <div
                key={item.id}
                onClick={() => setShowNewsModal(item)}
                className="p-4 sm:p-4.5 hover:bg-[#F2FAF9] dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 truncate">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 shrink-0">
                    {item.title}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {item.subtitle}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-400 shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>

          {/* Bottom Bar: ดูทั้งหมด */}
          <button
            onClick={() => setShowNewsModal(newsList[0])}
            className="w-full py-3 bg-[#D2EFEA] hover:bg-[#c2eae4] dark:bg-teal-950/70 dark:hover:bg-teal-900/70 text-center text-xs sm:text-sm font-bold text-[#004744] dark:text-teal-300 transition-colors cursor-pointer border-t border-[#009688]/20 dark:border-slate-800"
          >
            ดูทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}
