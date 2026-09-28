import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TimetableGrid from '../components/schedule/TimetableGrid';
import WorkloadMeter from '../components/planner/WorkloadMeter';
import PrerequisiteAlert from '../components/planner/PrerequisiteAlert';
import {
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
  HelpCircle,
  Filter,
} from 'lucide-react';

export default function TimetablePage() {
  const {
    courses,
    courseSections,
    enrolledSections,
    enrollSection,
    unenrollSection,
    checkPrerequisites,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [alertState, setAlertState] = useState({
    isOpen: false,
    missingCourses: [],
    courseName: '',
  });
  const [bannerMessage, setBannerMessage] = useState(null);

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      c.course_id.includes(searchTerm) ||
      c.course_name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.course_name_en.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (selectedCategory === 'all') return true;
    return c.category.includes(selectedCategory);
  });

  const handleEnrollClick = (course, sectionId) => {
    // Check prerequisite first
    const prereqResult = checkPrerequisites(course.course_id);
    if (!prereqResult.passed) {
      setAlertState({
        isOpen: true,
        missingCourses: prereqResult.missingCourses,
        courseName: `${course.course_id} ${course.course_name_th}`,
      });
      return;
    }

    // Attempt enrollment
    const result = enrollSection(sectionId);
    if (!result.success) {
      setBannerMessage({
        type: 'error',
        text: result.message,
      });
      setTimeout(() => setBannerMessage(null), 6000);
    } else {
      setBannerMessage({
        type: 'success',
        text: result.message,
      });
      setTimeout(() => setBannerMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Prerequisite Alert Modal */}
      <PrerequisiteAlert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, missingCourses: [], courseName: '' })}
        missingCourses={alertState.missingCourses}
        courseName={alertState.courseName}
      />

      {/* Dynamic Flash Alert Banner for Time Clash or Success */}
      {bannerMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-md animate-in slide-in-from-top-2 duration-300 ${
            bannerMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {bannerMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <span>{bannerMessage.text}</span>
          </div>
          <button
            onClick={() => setBannerMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Workload Meter Widget */}
      <WorkloadMeter />

      {/* Timetable Grid View */}
      <TimetableGrid />

      {/* Course Selection & Planner Drawer */}
      <div className="bg-white dark:bg-[#111C24] rounded-3xl p-6 border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#0A5C5A] dark:text-teal-400" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                เลือกรายวิชาเพื่อวางแผนลงทะเบียน (Course Directory)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              คลิก "เพิ่มลงตาราง" เพื่อตรวจสอบเงื่อนไขเวลาชน (Time Clash) และวิชาบังคับก่อน (Prerequisite) โดยอัตโนมัติ
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#0A5C5A] dark:focus:border-teal-500 focus:ring-1 focus:ring-[#0A5C5A]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'Core', label: 'วิชาบังคับ (Core)' },
            { id: 'Elective', label: 'วิชาเลือก (Elective)' },
            { id: 'GenEd', label: 'ศึกษาทั่วไป (GenEd)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0A5C5A] dark:bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => {
            const sections = courseSections.filter((s) => s.course_id === course.course_id);
            const isEnrolled = enrolledSections.some((s) => s.course_id === course.course_id);
            const prereqCheck = checkPrerequisites(course.course_id);

            return (
              <div
                key={course.course_id}
                className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#0A5C5A]/50 dark:hover:border-teal-500/50 bg-white dark:bg-[#0C151D] transition-all shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0A5C5A] dark:text-teal-400 bg-[#E6F4F1] dark:bg-teal-950/60 px-2 py-0.5 rounded">
                          {course.course_id}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {course.credits} หน่วยกิต
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          • {course.category.split(' ')[0]}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                        {course.course_name_th}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                        {course.course_name_en}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {course.workload_score >= 4 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          ภาระงานสูง 🔥 ({course.workload_score}/5)
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          ภาระงาน {course.workload_score}/5
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites info */}
                  {!prereqCheck.passed && (
                    <div className="mt-2.5 p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                      <span>
                        ยังไม่ผ่านวิชาตัวต่อ: {prereqCheck.missingCourses.map((c) => c.course_id).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sections list inside course card */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    ตอนเรียนที่เปิดสอน:
                  </div>

                  <div className="space-y-1.5">
                    {sections.map((sec) => {
                      const isSecEnrolled = enrolledSections.some((s) => s.section_id === sec.section_id);

                      return (
                        <div
                          key={sec.section_id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                              ตอนเรียน {sec.section_no}:
                            </span>{' '}
                            <span className="text-slate-600 dark:text-slate-300">
                              {sec.day_of_week} {sec.start_time} - {sec.end_time} ({sec.room})
                            </span>
                            <div className="text-[10px] text-slate-400 dark:text-slate-400">
                              อาจารย์: {sec.lecturer} • ที่นั่ง {sec.enrolled_seats}/{sec.max_seats}
                            </div>
                          </div>

                          <div>
                            {isSecEnrolled ? (
                              <button
                                onClick={() => unenrollSection(sec.section_id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 font-semibold cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>ถอน</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEnrollClick(course, sec.section_id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0A5C5A] dark:bg-teal-700 hover:bg-[#064E4D] text-white font-semibold shadow-2xs cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>ลงตาราง</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
