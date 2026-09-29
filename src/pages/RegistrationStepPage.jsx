import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import TimetableGrid from '../components/schedule/TimetableGrid';
import WorkloadMeter from '../components/planner/WorkloadMeter';
import PrerequisiteAlert from '../components/planner/PrerequisiteAlert';
import confetti from 'canvas-confetti';
import {
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';

export default function RegistrationStepPage() {
  const {
    currentUser,
    courses,
    courseSections,
    enrolledSections,
    enrollSection,
    unenrollSection,
    totalCredits,
    isWorkloadHigh,
    heavyCourses,
    checkPrerequisites,
  } = useApp();

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [alertState, setAlertState] = useState({
    isOpen: false,
    missingCourses: [],
    courseName: '',
  });

  const steps = [
    { num: 1, title: 'ตรวจสอบข้อมูลนักศึกษา' },
    { num: 2, title: 'เลือกรายวิชาและตอนเรียน' },
    { num: 3, title: 'ตรวจสอบตารางและภาระงาน' },
    { num: 4, title: 'ยืนยันผลการลงทะเบียน' },
  ];

  const handleEnrollClick = (course, sectionId) => {
    const prereqResult = checkPrerequisites(course.course_id);
    if (!prereqResult.passed) {
      setAlertState({
        isOpen: true,
        missingCourses: prereqResult.missingCourses,
        courseName: `${course.course_id} ${course.course_name_th}`,
      });
      return;
    }
    enrollSection(sectionId);
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#006663', '#F07C00', '#10B981'],
      });
    } catch (e) {}
  };

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category.includes(selectedCategory);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Prerequisite Alert Modal */}
      <PrerequisiteAlert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, missingCourses: [], courseName: '' })}
        missingCourses={alertState.missingCourses}
        courseName={alertState.courseName}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006663] to-[#013f3d] rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-[11px] sm:text-xs font-semibold mb-2">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#F07C00]" />
            <span>ระบบลงทะเบียนเรียนอย่างเป็นทางการ มหาวิทยาลัยอุบลราชธานี</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black">
            ขั้นตอนการลงทะเบียนเรียน (Course Registration)
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            ภาคการศึกษาที่ {currentUser.semester}/{currentUser.academic_year} • กำหนดลงทะเบียนสูงสุด 22 หน่วยกิต
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-white/20 text-left sm:text-right shrink-0">
          <div className="text-[10px] sm:text-[11px] text-teal-100 font-medium">หน่วยกิตที่เลือก</div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {totalCredits} <span className="text-xs font-normal text-teal-200">/ 22</span>
          </div>
        </div>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-5 border border-[#D1EAE5] dark:border-slate-700 shadow-xs transition-colors">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isPassed = currentStep > s.num;

            return (
              <div
                key={s.num}
                onClick={() => !isSubmitted && setCurrentStep(s.num)}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#006663] bg-[#E6F4F1] ring-1 ring-[#006663]/30 dark:border-teal-500 dark:bg-teal-950/40 dark:ring-teal-500/20'
                    : isPassed
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/30'
                    : 'border-slate-200 bg-slate-50/40 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? 'bg-[#006663] text-white shadow-sm'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isPassed ? '✓' : s.num}
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    ขั้นตอน {s.num}
                  </div>
                  <div
                    className={`text-xs font-bold truncate ${
                      isActive
                        ? 'text-[#006663] dark:text-teal-300'
                        : isPassed
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {s.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-[#D1EAE5] dark:border-slate-700 shadow-xs transition-colors">
        {/* STEP 1: Student Information Verification */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                ขั้นตอนที่ 1: ตรวจสอบข้อมูลส่วนตัวและสถานภาพนักศึกษา
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนเริ่มเลือกรายวิชาลงทะเบียน
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="text-slate-400 dark:text-slate-500 font-semibold">รหัสนักศึกษา:</div>
                <div className="text-base font-bold text-slate-800 dark:text-teal-300 font-mono">
                  {currentUser.student_id}
                </div>
                <div className="text-slate-400 dark:text-slate-500 font-semibold pt-2">ชื่อ-นามสกุล:</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {currentUser.first_name_th} {currentUser.last_name_th} ({currentUser.first_name_en} {currentUser.last_name_en})
                </div>
                <div className="text-slate-400 dark:text-slate-500 font-semibold pt-2">อีเมลติดต่อ:</div>
                <div className="text-xs font-mono text-[#006663] dark:text-teal-400">{currentUser.email}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="text-slate-400 dark:text-slate-500 font-semibold">คณะ / สาขาวิชา:</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {currentUser.faculty}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{currentUser.department}</div>
                <div className="text-slate-400 dark:text-slate-500 font-semibold pt-2">อาจารย์ที่ปรึกษา:</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.advisor_name}</div>
                <div className="text-slate-400 dark:text-slate-500 font-semibold pt-2">สถานภาพ:</div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  {currentUser.status}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E6F4F1] dark:bg-teal-950/40 border border-[#D1EAE5] dark:border-teal-800/60 text-xs text-[#006663] dark:text-teal-300 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#006663] dark:text-teal-400" />
              <span>
                นักศึกษาผ่านเงื่อนไขการชำระเงินและการประเมินอาจารย์ประจำภาคเรียนก่อนหน้าแล้ว พร้อมสำหรับการลงทะเบียนเรียน
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Course Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  ขั้นตอนที่ 2: เลือกรายวิชาและตอนเรียน (Sections)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  เลือกวิชาที่ต้องการลงทะเบียนในภาคการศึกษา 1/2569 (สูงสุด 22 หน่วยกิต)
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                {['all', 'Core', 'Elective', 'GenEd'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#006663] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'ทั้งหมด' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((course) => {
                const sections = courseSections.filter((s) => s.course_id === course.course_id);
                const prereq = checkPrerequisites(course.course_id);

                return (
                  <div
                    key={course.course_id}
                    className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-[#006663]/40 dark:hover:border-teal-500/40 bg-white dark:bg-[#0f2429] transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#006663] dark:text-teal-300 bg-[#E6F4F1] dark:bg-teal-950/60 px-2 py-0.5 rounded">
                            {course.course_id}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {course.credits} หน่วยกิต • {course.category.split(' ')[0]}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                          {course.course_name_th}
                        </h4>
                      </div>

                      {course.workload_score >= 4 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          วิชาหนัก 🔥
                        </span>
                      )}
                    </div>

                    {!prereq.passed && (
                      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>ต้องผ่าน: {prereq.missingCourses.map((c) => c.course_id).join(', ')}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                      {sections.map((sec) => {
                        const isEnrolled = enrolledSections.some((s) => s.section_id === sec.section_id);

                        return (
                          <div
                            key={sec.section_id}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-200">Sec {sec.section_no}:</span>{' '}
                              <span className="text-slate-600 dark:text-slate-400">{sec.day_of_week} {sec.start_time}-{sec.end_time} ({sec.room})</span>
                            </div>
                            <div>
                              {isEnrolled ? (
                                <button
                                  onClick={() => unenrollSection(sec.section_id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-semibold cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/80"
                                >
                                  ถอน
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEnrollClick(course, sec.section_id)}
                                  className="px-2.5 py-1 rounded-lg bg-[#006663] hover:bg-[#004e4b] text-white font-semibold cursor-pointer"
                                >
                                  เลือก
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Timetable & Workload Verification */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                ขั้นตอนที่ 3: ตรวจสอบตารางเรียนและสมดุลภาระงาน (Timetable Validation)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ตรวจสอบไม่ให้เวลาเรียนชนกัน และตรวจสอบคะแนน Workload รวมของภาคการศึกษา
              </p>
            </div>

            {/* Workload Meter */}
            <WorkloadMeter />

            {/* Timetable Grid */}
            <TimetableGrid />
          </div>
        )}

        {/* STEP 4: Confirmation & Summary */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {!isSubmitted ? (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    ขั้นตอนที่ 4: ยืนยันผลการลงทะเบียนเรียน
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    โปรดตรวจสอบรายวิชาที่เลือกทั้งหมดก่อนกดยืนยันส่งข้อมูลเข้าระบบทะเบียน
                  </p>
                </div>

                {/* Summary Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#006663] text-white">
                      <tr>
                        <th className="p-3">ลำดับ</th>
                        <th className="p-3">รหัสวิชา</th>
                        <th className="p-3">ชื่อรายวิชา</th>
                        <th className="p-3">ตอนเรียน (Sec)</th>
                        <th className="p-3">วัน-เวลาเรียน</th>
                        <th className="p-3">ห้องเรียน</th>
                        <th className="p-3 text-right">หน่วยกิต</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {enrolledSections.map((item, idx) => (
                        <tr key={item.section_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200">
                          <td className="p-3 text-slate-400 dark:text-slate-500 font-mono">{idx + 1}</td>
                          <td className="p-3 font-mono font-bold text-[#006663] dark:text-teal-400">{item.course_id}</td>
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">{item.course?.course_name_th}</td>
                          <td className="p-3 font-bold">{item.section_no}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{item.day_of_week} {item.start_time} - {item.end_time}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{item.room}</td>
                          <td className="p-3 text-right font-bold text-slate-800 dark:text-slate-100">{item.course?.credits}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-900/80 font-bold border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td colSpan="6" className="p-3 text-right text-slate-600 dark:text-slate-400">
                          รวมทั้งสิ้น {enrolledSections.length} วิชา:
                        </td>
                        <td className="p-3 text-right text-[#006663] dark:text-teal-300 text-sm">
                          {totalCredits} หน่วยกิต
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {isWorkloadHigh && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>
                      หมายเหตุ: คุณมีวิชาหนัก {heavyCourses.length} วิชาในเทอมนี้ โปรดเตรียมความพร้อมในการจัดสรรเวลา
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Success confirmation view */
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  ลงทะเบียนเรียนสำเร็จเรียบร้อย!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  ระบบได้บันทึกการลงทะเบียนภาคเรียน 1/2569 ของคุณจำนวน {totalCredits} หน่วยกิต เรียบร้อยแล้ว พร้อมส่งข้อมูลไปยังอาจารย์ที่ปรึกษา
                </p>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>พิมพ์ใบยืนยันการลงทะเบียน</span>
                  </button>

                  <button
                    onClick={() => navigate('/timetable')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#006663] hover:bg-[#004e4b] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>ดูตารางเรียนทั้งหมด</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step Navigation Controls */}
        {!isSubmitted && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((p) => Math.min(4, p + 1))}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#006663] hover:bg-[#004e4b] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
              >
                <span>ถัดไป</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#F07C00] hover:bg-[#d96e00] text-white text-xs font-bold shadow-lg shadow-[#F07C00]/30 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันการลงทะเบียนเรียน</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
