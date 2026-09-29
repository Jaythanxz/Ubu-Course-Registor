import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PrerequisiteAlert from '../components/planner/PrerequisiteAlert';
import {
  Compass,
  Users,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  MapPin,
  User,
  Plus,
  Trash2,
  FileText,
  Star,
  MessageSquare,
  Award,
  ChevronRight,
  Code2,
  BrainCircuit,
  ShieldCheck,
  Layout,
  Check,
} from 'lucide-react';

export default function RecommendationPage() {
  const {
    careerTracks,
    courses,
    courseSections,
    enrolledSections,
    enrollSection,
    unenrollSection,
    checkPrerequisites,
    currentUser,
    setCurrentUser,
    reviews,
  } = useApp();

  // Active track state
  const [selectedTrackId, setSelectedTrackId] = useState(currentUser.career_track_id || 1);

  // Active track object
  const activeTrack = careerTracks.find((t) => t.track_id === selectedTrackId) || careerTracks[0];

  // Courses filtered by active track
  const trackCourses = courses.filter(
    (c) => c.career_track_id === selectedTrackId || c.category.includes('Core')
  );

  // Selected course for detail view
  const [selectedCourseId, setSelectedCourseId] = useState(trackCourses[0]?.course_id || '1146201');

  // Active detail sub-tab inside selected subject
  const [detailTab, setDetailTab] = useState('overview'); // 'overview' | 'sections' | 'prereq' | 'reviews'

  // Alert & Notification toast
  const [alertState, setAlertState] = useState({
    isOpen: false,
    missingCourses: [],
    courseName: '',
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Current selected course object
  const selectedCourse = courses.find((c) => c.course_id === selectedCourseId) || trackCourses[0] || courses[0];
  const prereqCheck = checkPrerequisites(selectedCourse.course_id);
  const sectionsForCourse = courseSections.filter((s) => s.course_id === selectedCourse.course_id);
  const isSelectedEnrolled = enrolledSections.some((s) => s.course_id === selectedCourse.course_id);
  const courseReviews = reviews.filter((r) => r.course_id === selectedCourse.course_id);

  // Handle enrollment
  const handleEnrollCourse = (sectionId) => {
    if (!prereqCheck.passed) {
      setAlertState({
        isOpen: true,
        missingCourses: prereqCheck.missingCourses,
        courseName: `${selectedCourse.course_id} ${selectedCourse.course_name_th}`,
      });
      return;
    }

    const secId = sectionId || sectionsForCourse[0]?.section_id;
    if (!secId) return;

    const result = enrollSection(secId);
    if (result.success) {
      setToastMessage({ type: 'success', text: `เพิ่ม ${selectedCourse.course_name_th} ลงในตารางจำลองสำเร็จ` });
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setToastMessage({ type: 'error', text: result.message });
      setTimeout(() => setToastMessage(null), 4500);
    }
  };

  const handleUnenrollCourse = () => {
    const enrolledItem = enrolledSections.find((s) => s.course_id === selectedCourse.course_id);
    if (enrolledItem) {
      unenrollSection(enrolledItem.section_id);
      setToastMessage({ type: 'info', text: `ถอน ${selectedCourse.course_name_th} ออกจากตารางแล้ว` });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const getTrackIcon = (iconName) => {
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Layout': return <Layout className="w-4 h-4" />;
      default: return <Code2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Prerequisite Alert Modal */}
      <PrerequisiteAlert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, missingCourses: [], courseName: '' })}
        missingCourses={alertState.missingCourses}
        courseName={alertState.courseName}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg animate-in slide-in-from-top-2 fixed top-4 right-8 z-50 max-w-md ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-300'
              : toastMessage.type === 'info'
              ? 'bg-slate-100 text-slate-800 border border-slate-300'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 font-bold px-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Minimalist, Crisp, Professional */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-[#D1EAE5] dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#006663] dark:text-teal-400 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-[#F07C00]" />
            <span>Smart Advisory & Subject Details</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            แนะนำจัดตารางเรียนตามสายอาชีพ (Career Track)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            เลือกสายอาชีพและคลิกรายวิชาเพื่ออ่านรายละเอียด (Subject Detail) แบบเจาะลึก
          </p>
        </div>

        {/* Actions & Badges */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#E6F4F1] dark:bg-teal-950/60 border border-[#D1EAE5] dark:border-teal-800/60 text-xs font-semibold text-[#006663] dark:text-teal-300">
            <Users className="w-4 h-4 text-[#F07C00]" />
            <span>
              เพื่อนรุ่นเดียวกัน <strong className="text-slate-900 dark:text-white font-bold">{activeTrack.peer_count} คน</strong> สนใจสายนี้
            </span>
          </div>

          <Link
            to="/assessment"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F07C00] hover:bg-[#d96e00] text-white text-xs font-bold shadow-md shadow-[#F07C00]/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>ทำแบบสอบถามความสนใจ</span>
          </Link>
        </div>
      </div>

      {/* Clean Career Track Horizontal Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {careerTracks.map((track) => {
          const isSelected = track.track_id === selectedTrackId;
          return (
            <button
              key={track.track_id}
              onClick={() => {
                setSelectedTrackId(track.track_id);
                setCurrentUser((prev) => ({ ...prev, career_track_id: track.track_id }));
                // Select first course of that track
                const firstC = courses.find(
                  (c) => c.career_track_id === track.track_id || c.category.includes('Core')
                );
                if (firstC) setSelectedCourseId(firstC.course_id);
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-xs transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#005A56] dark:bg-teal-700 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {getTrackIcon(track.icon_name)}
              <span>{track.track_name.split('/')[0]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {track.peer_count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Master-Detail Layout: Left Course Directory | Right Subject Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Course Directory (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl p-4 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-2">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">รายวิชาในสาย ({trackCourses.length})</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">คลิกเพื่อดูรายละเอียด</span>
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {trackCourses.map((c, idx) => {
              const isSelected = c.course_id === selectedCourseId;
              const isEnrolled = enrolledSections.some((s) => s.course_id === c.course_id);
              const matchScore = 98 - idx * 3;

              return (
                <div
                  key={c.course_id}
                  onClick={() => setSelectedCourseId(c.course_id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#005A56] dark:border-teal-500 bg-[#E6F4F1]/70 dark:bg-teal-950/60 shadow-xs ring-1 ring-[#005A56]/30 dark:ring-teal-500/30'
                      : 'border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/70 dark:hover:bg-slate-700/60 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#005A56] dark:text-teal-400">
                        {c.course_id}
                      </span>
                      {isEnrolled && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          ในตาราง ✓
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {c.course_name_th}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {c.credits} หน่วยกิต • {c.category.split(' ')[0]}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-[#005A56] dark:text-teal-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                      {matchScore}%
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 ml-auto mt-2 text-slate-400 ${
                        isSelected ? 'text-[#005A56] dark:text-teal-400 translate-x-0.5' : ''
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Subject Detail Pane with Tabs (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-6">
          {/* Subject Detail Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#E6F4F1] dark:bg-teal-950/60 text-[#005A56] dark:text-teal-300 border border-[#D1EAE5] dark:border-teal-800/60">
                  {selectedCourse.course_id}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {selectedCourse.credits} หน่วยกิต • {selectedCourse.category}
                </span>
                {selectedCourse.workload_score >= 4 ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                    ภาระงานสูง ({selectedCourse.workload_score}/5)
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    ภาระงานพอดี ({selectedCourse.workload_score}/5)
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {selectedCourse.course_name_th}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">
                {selectedCourse.course_name_en}
              </p>
            </div>

            {/* Quick Action Button: Add or Remove from timetable */}
            <div className="shrink-0">
              {isSelectedEnrolled ? (
                <button
                  onClick={handleUnenrollCourse}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ถอนออกจากตาราง</span>
                </button>
              ) : (
                <button
                  onClick={() => handleEnrollCourse()}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#005A56] dark:bg-teal-700 hover:bg-[#004744] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มลงตารางจำลอง</span>
                </button>
              )}
            </div>
          </div>

          {/* Internal Tabs for this Subject Detail */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            {[
              { id: 'overview', label: 'ภาพรวมรายวิชา', icon: FileText },
              { id: 'sections', label: `ตอนเรียน (${sectionsForCourse.length})`, icon: Calendar },
              { id: 'prereq', label: 'วิชาบังคับก่อน', icon: Award },
              { id: 'reviews', label: `รีวิวรุ่นพี่ (${courseReviews.length})`, icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = detailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#005A56] dark:bg-teal-700 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {detailTab === 'overview' && (
            <div className="space-y-5 text-xs animate-in fade-in duration-200">
              {/* Course Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">คำอธิบายรายวิชา (Course Description)</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Why recommended highlight */}
              <div className="p-4 rounded-2xl bg-[#E6F4F1]/60 dark:bg-teal-950/40 border border-[#D1EAE5] dark:border-teal-800/50 space-y-2">
                <div className="flex items-center gap-2 text-[#005A56] dark:text-teal-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#F07C00]" />
                  <span>ทำไมวิชานี้ถึงเหมาะกับสาย {activeTrack.track_name.split('/')[0]}?</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  เป็นหนึ่งในวิชาสำคัญที่ปูพื้นฐานทักษะและโปรเจกต์สำหรับสายอาชีพนี้ ได้รับการออกแบบให้สอดคล้องกับความต้องการของตลาดงานสายไอทีและบริษัทเทคโนโลยีชั้นนำ
                </p>
              </div>

              {/* Workload evaluation metrics */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
                  <div className="text-slate-400 dark:text-slate-400 font-medium text-[11px]">สัดส่วนโปรเจกต์</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {selectedCourse.workload_score >= 4 ? '50% (ชิ้นงานใหญ่)' : '30% (งานเดี่ยว/กลุ่ม)'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
                  <div className="text-slate-400 dark:text-slate-400 font-medium text-[11px]">สัดส่วนข้อสอบ</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {selectedCourse.category.includes('Core') ? '40% (กลางภาค/ปลายภาค)' : '25% (วัดผลปฏิบัติ)'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
                  <div className="text-slate-400 dark:text-slate-400 font-medium text-[11px]">ความหนักวิชา</div>
                  <div className="text-sm font-bold text-[#005A56] dark:text-teal-400 mt-1">
                    {selectedCourse.workload_score} / 5.0
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS & SCHEDULE */}
          {detailTab === 'sections' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                ตอนเรียนที่เปิดสอนในภาคการศึกษานี้ ({sectionsForCourse.length} ตอนเรียน):
              </div>

              {sectionsForCourse.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  ไม่มีตอนเรียนที่เปิดสอนในเทอมนี้
                </div>
              ) : (
                <div className="space-y-3">
                  {sectionsForCourse.map((sec) => {
                    const isSecEnrolled = enrolledSections.some((s) => s.section_id === sec.section_id);

                    return (
                      <div
                        key={sec.section_id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#005A56]/40 dark:hover:border-teal-500/40 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                              ตอนเรียน {sec.section_no}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                              {sec.day_of_week}
                            </span>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">
                              {sec.start_time} - {sec.end_time} น.
                            </span>
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 pt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{sec.room}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{sec.lecturer}</span>
                            </span>
                            <span>•</span>
                            <span>ที่นั่ง {sec.enrolled_seats}/{sec.max_seats}</span>
                          </div>
                        </div>

                        <div>
                          {isSecEnrolled ? (
                            <button
                              onClick={() => unenrollSection(sec.section_id)}
                              className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-bold cursor-pointer"
                            >
                              ถอนวิชา
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnrollCourse(sec.section_id)}
                              className="px-4 py-2 rounded-xl bg-[#005A56] dark:bg-teal-700 hover:bg-[#004744] text-white font-bold cursor-pointer shadow-xs"
                            >
                              เลือกตอนเรียนนี้
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PREREQUISITES */}
          {detailTab === 'prereq' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  สถานะวิชาบังคับก่อน (Prerequisite Validation)
                </div>

                {prereqCheck.passed ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold">ผ่านเงื่อนไขวิชาบังคับก่อนเรียบร้อยแล้ว</div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                        คุณมีสิทธิ์ลงทะเบียนรายวิชานี้ในระบบได้ทันที
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-rose-900 dark:text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>ยังไม่ผ่านวิชาบังคับก่อน</span>
                    </div>
                    <p className="text-rose-700 dark:text-rose-300">
                      รายวิชาที่ต้องเรียนผ่านก่อน ได้แก่:
                    </p>
                    <ul className="space-y-1 list-disc list-inside font-semibold">
                      {prereqCheck.missingCourses.map((c) => (
                        <li key={c.course_id}>
                          {c.course_id} - {c.course_name_th}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {detailTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ความคิดเห็นจากรุ่นพี่ที่เคยเรียนวิชานี้ ({courseReviews.length} ความเห็น)
                </span>
                <span className="text-slate-400 dark:text-slate-500">Verified UBU Student</span>
              </div>

              {courseReviews.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  ยังไม่มีรีวิวสำหรับวิชานี้ เป็นคนแรกที่แบ่งปันประสบการณ์ได้ที่หน้า "รีวิวรายวิชา"
                </div>
              ) : (
                <div className="space-y-3">
                  {courseReviews.map((rev) => (
                    <div
                      key={rev.review_id}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold">
                          {rev.student_email}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed italic bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                        "{rev.comment_text}"
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        {rev.project_heavy && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-200 dark:border-blue-800/50">
                            🚀 เน้นโปรเจกต์
                          </span>
                        )}
                        {rev.exam_heavy && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[10px] font-semibold border border-rose-200 dark:border-rose-800/50">
                            ✍️ เน้นสอบ
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
