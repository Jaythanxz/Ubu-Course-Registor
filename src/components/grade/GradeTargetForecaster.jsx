import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Calculator,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  Sliders,
  TrendingUp,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Standard Grade Cutoff Points
const DEFAULT_GRADE_THRESHOLDS = [
  { grade: 'A', min: 80, point: 4.0, color: 'emerald', label: 'ดีเยี่ยม (Excellent)' },
  { grade: 'B+', min: 75, point: 3.5, color: 'teal', label: 'ดีมาก (Very Good)' },
  { grade: 'B', min: 70, point: 3.0, color: 'blue', label: 'ดี (Good)' },
  { grade: 'C+', min: 65, point: 2.5, color: 'indigo', label: 'ค่อนข้างดี (Fairly Good)' },
  { grade: 'C', min: 60, point: 2.0, color: 'amber', label: 'พอใช้ (Fair)' },
  { grade: 'D+', min: 55, point: 1.5, color: 'orange', label: 'อ่อน (Poor)' },
  { grade: 'D', min: 50, point: 1.0, color: 'rose', label: 'อ่อนมาก (Very Poor)' },
];

// Preset Evaluation Weight Schemes
const SYLLABUS_PRESETS = [
  {
    id: 'standard',
    name: 'มาตรฐานทั่วไป (Standard)',
    desc: 'คะแนนเก็บ 30% | กลางภาค 30% | ปลายภาค 40%',
    parts: [
      { id: 'p1', name: 'คะแนนเก็บ / งาน / ควิซ', max: 30, earned: 26, isCompleted: true },
      { id: 'p2', name: 'สอบกลางภาค (Midterm)', max: 30, earned: 21, isCompleted: true },
      { id: 'p3', name: 'สอบปลายภาค (Final)', max: 40, earned: 0, isCompleted: false },
    ],
  },
  {
    id: 'project',
    name: 'เน้นปฏิบัติการ / โครงงาน (Project/Lab)',
    desc: 'งาน/โปรเจกต์ 50% | กลางภาค 20% | ปลายภาค 30%',
    parts: [
      { id: 'p1', name: 'โครงงาน / แล็บ / ปฏิบัติการ', max: 50, earned: 42, isCompleted: true },
      { id: 'p2', name: 'สอบกลางภาค (Midterm)', max: 20, earned: 15, isCompleted: true },
      { id: 'p3', name: 'สอบปลายภาค (Final)', max: 30, earned: 0, isCompleted: false },
    ],
  },
  {
    id: 'theory',
    name: 'เน้นสอบทฤษฎี (Heavy Exams)',
    desc: 'คะแนนเก็บ 20% | กลางภาค 40% | ปลายภาค 40%',
    parts: [
      { id: 'p1', name: 'คะแนนเก็บ / เช็คชื่อ', max: 20, earned: 18, isCompleted: true },
      { id: 'p2', name: 'สอบกลางภาค (Midterm)', max: 40, earned: 28, isCompleted: true },
      { id: 'p3', name: 'สอบปลายภาค (Final)', max: 40, earned: 0, isCompleted: false },
    ],
  },
];

export default function GradeTargetForecaster({ onNavigateToDropAdvisor = () => {} }) {
  const { enrolledSections, courses } = useApp();

  // Selected Course
  const [selectedCourseCode, setSelectedCourseCode] = useState(() => {
    if (enrolledSections.length > 0) return enrolledSections[0].course_id;
    return '1146201';
  });

  const [courseName, setCourseName] = useState(() => {
    if (enrolledSections.length > 0) {
      return enrolledSections[0].course?.course_name_th || 'โครงสร้างข้อมูลและขั้นตอนวิธี';
    }
    return 'โครงสร้างข้อมูลและขั้นตอนวิธี';
  });

  // Score breakdown parts
  const [parts, setParts] = useState(SYLLABUS_PRESETS[0].parts);
  const [activePreset, setActivePreset] = useState('standard');

  // Custom Final Simulator Slider
  const [simulatedFinalScore, setSimulatedFinalScore] = useState(30);

  // Saved Courses in localStorage
  const [savedCourses, setSavedCourses] = useState(() => {
    try {
      const data = localStorage.getItem('ubu_grade_forecaster_courses');
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  });

  // When changing course selection
  const handleSelectCourse = (code) => {
    setSelectedCourseCode(code);
    const enrolled = enrolledSections.find((s) => s.course_id === code);
    if (enrolled) {
      setCourseName(enrolled.course?.course_name_th || code);
    } else {
      const catalog = courses.find((c) => c.course_id === code);
      if (catalog) setCourseName(catalog.course_name_th);
    }

    // Load saved data if exists
    if (savedCourses[code]) {
      setParts(savedCourses[code].parts);
      setActivePreset(savedCourses[code].preset || 'custom');
    }
  };

  // Change preset
  const handleApplyPreset = (presetId) => {
    setActivePreset(presetId);
    const found = SYLLABUS_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setParts(JSON.parse(JSON.stringify(found.parts)));
    }
  };

  // Update a score part
  const updatePart = (index, field, value) => {
    setActivePreset('custom');
    setParts((prev) => {
      const next = [...prev];
      const val = parseFloat(value) || 0;
      next[index] = {
        ...next[index],
        [field]: field === 'name' ? value : Math.max(0, val),
      };
      return next;
    });
  };

  // Add new evaluation part
  const handleAddPart = () => {
    setActivePreset('custom');
    setParts((prev) => [
      ...prev,
      {
        id: 'p_' + Date.now(),
        name: 'ส่วนคะแนนเพิ่มเติม',
        max: 10,
        earned: 0,
        isCompleted: false,
      },
    ]);
  };

  // Remove evaluation part
  const handleRemovePart = (index) => {
    if (parts.length <= 1) return;
    setActivePreset('custom');
    setParts((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle completed status of a part
  const toggleCompleted = (index) => {
    setParts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isCompleted: !next[index].isCompleted };
      return next;
    });
  };

  // Save current calculation to localStorage
  const handleSaveCalculation = () => {
    try {
      const updated = {
        ...savedCourses,
        [selectedCourseCode]: {
          courseCode: selectedCourseCode,
          courseName,
          parts,
          preset: activePreset,
          updatedAt: new Date().toISOString(),
        },
      };
      setSavedCourses(updated);
      localStorage.setItem('ubu_grade_forecaster_courses', JSON.stringify(updated));

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#006663', '#F07C00', '#10B981'],
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Core Calculations
  const calculation = useMemo(() => {
    const totalMax = parts.reduce((acc, p) => acc + (parseFloat(p.max) || 0), 0);
    const completedParts = parts.filter((p) => p.isCompleted);
    const uncompletedParts = parts.filter((p) => !p.isCompleted);

    const completedMax = completedParts.reduce((acc, p) => acc + (parseFloat(p.max) || 0), 0);
    const earnedScore = completedParts.reduce((acc, p) => acc + (parseFloat(p.earned) || 0), 0);
    const remainingMax = totalMax - completedMax;

    // Percent earned of completed part
    const earnedPercentage = completedMax > 0 ? (earnedScore / completedMax) * 100 : 0;

    // Target breakdown for each grade threshold
    const gradeTargets = DEFAULT_GRADE_THRESHOLDS.map((item) => {
      const neededFromRemaining = item.min - earnedScore;
      const neededPercent = remainingMax > 0 ? (neededFromRemaining / remainingMax) * 100 : 0;

      let status = 'achievable';
      let statusText = 'เป็นไปได้สูง (Achievable)';
      let statusColor = 'emerald';

      if (neededFromRemaining <= 0) {
        status = 'secured';
        statusText = 'คะแนนถึงแล้ว การันตีเกรดนี้! 🎉';
        statusColor = 'emerald';
      } else if (neededPercent <= 60) {
        status = 'easy';
        statusText = 'โอกาสสดใส (High Chance)';
        statusColor = 'emerald';
      } else if (neededPercent <= 75) {
        status = 'achievable';
        statusText = 'เป็นไปได้ถ้าตั้งใจ (Achievable)';
        statusColor = 'teal';
      } else if (neededPercent <= 90) {
        status = 'challenging';
        statusText = 'ต้องฟิตเต็มที่ (Challenging)';
        statusColor = 'amber';
      } else if (neededPercent <= 100) {
        status = 'critical';
        statusText = 'เสี่ยงสูงมาก / ต้องเกือบเต็ม (Critical)';
        statusColor = 'orange';
      } else {
        status = 'impossible';
        statusText = 'คะแนนไม่พอแล้ว (Out of Reach)';
        statusColor = 'rose';
      }

      return {
        ...item,
        neededFromRemaining: Math.max(0, neededFromRemaining),
        neededPercent: Math.min(999, Math.max(0, neededPercent)),
        status,
        statusText,
        statusColor,
      };
    });

    // Simulated Final calculation
    const totalSimulatedScore = earnedScore + simulatedFinalScore;
    let simulatedGrade = 'F';
    for (const t of DEFAULT_GRADE_THRESHOLDS) {
      if (totalSimulatedScore >= t.min) {
        simulatedGrade = t.grade;
        break;
      }
    }

    return {
      totalMax,
      completedMax,
      earnedScore,
      remainingMax,
      earnedPercentage,
      gradeTargets,
      totalSimulatedScore,
      simulatedGrade,
    };
  }, [parts, simulatedFinalScore]);

  // Sync simulatedFinalScore with remainingMax
  useEffect(() => {
    if (calculation.remainingMax > 0 && simulatedFinalScore > calculation.remainingMax) {
      setSimulatedFinalScore(calculation.remainingMax);
    }
  }, [calculation.remainingMax, simulatedFinalScore]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#005A56] via-[#0A6C67] to-[#0D7F79] dark:from-[#004744] dark:via-[#073B37] dark:to-[#0A524D] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold">
            <Target className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Grade Forecaster & Target Planner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            แบบจำลองคะแนน & วางแผนเป้าหมายเกรด A, B+
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            กรอกคะแนนเก็บและคะแนนสอบกลางภาคที่ได้จริง ระบบจะคำนวณสัดส่วนคะแนนที่ต้องทำในรอบปลายภาค (Final) 
            เพื่อให้ได้เกรด A, B+, หรือเกรดที่คุณต้องการแบบแม่นยำทันที!
          </p>
        </div>

        {/* Live Score In-Hand Badge */}
        <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0 min-w-[180px] shadow-sm">
          <div className="text-[11px] text-teal-200 font-medium">คะแนนตุนในมือปัจจุบัน</div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-0.5">
            {calculation.earnedScore.toFixed(1)}
            <span className="text-sm font-normal text-teal-200"> / {calculation.completedMax}</span>
          </div>
          <div className="text-[11px] text-amber-300 font-semibold mt-1">
            เหลือให้เก็บอีก {calculation.remainingMax} คะแนน
          </div>
        </div>
      </div>

      {/* Select Course & Quick Presets Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#005A56] dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              เลือกรายวิชาที่ต้องการคำนวณ
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCalculation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#005A56] hover:bg-[#004744] dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกคะแนนวิชานี้</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pick from registered courses */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
              วิชาในตารางเรียนของฉัน / วิชาทั้งหมด:
            </label>
            <div className="relative">
              <select
                value={selectedCourseCode}
                onChange={(e) => handleSelectCourse(e.target.value)}
                className="w-full p-2.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-[#005A56] dark:focus:border-teal-500 appearance-none cursor-pointer"
              >
                <optgroup label="วิชาที่เลือกลงทะเบียนในเทอมนี้">
                  {enrolledSections.map((sec) => (
                    <option key={sec.course_id} value={sec.course_id}>
                      {sec.course_id} - {sec.course?.course_name_th || 'วิชาลงทะเบียน'} ({sec.course?.credits || 3} นก.)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="วิชาบังคับและวิชาเลือกอื่นๆ">
                  {courses.slice(0, 15).map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_id} - {c.course_name_th} ({c.credits} นก.)
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
              สัดส่วนคะแนนตามหลักสูตร (Syllabus):
            </label>
            <div className="relative">
              <select
                value={activePreset}
                onChange={(e) => handleApplyPreset(e.target.value)}
                className="w-full p-2.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-[#005A56] dark:focus:border-teal-500 appearance-none cursor-pointer"
              >
                {SYLLABUS_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                {activePreset === 'custom' && <option value="custom">⚙️ กำหนดสัดส่วนเอง (Custom)</option>}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown Table and Input */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#005A56] dark:text-teal-400" />
              <span>สัดส่วนและคะแนนที่ได้จริง (รวมเต็ม 100%)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ติ๊กถูกส่วนที่สอบหรือตรวจคะแนนแล้ว และกรอกคะแนนจริงที่ได้
            </p>
          </div>

          <button
            onClick={handleAddPart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มส่วนคะแนน</span>
          </button>
        </div>

        {/* Dynamic Part Rows */}
        <div className="space-y-3">
          {parts.map((part, idx) => (
            <div
              key={part.id || idx}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                part.isCompleted
                  ? 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                  : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40'
              } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
            >
              {/* Part Name & Toggle Check */}
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <button
                  type="button"
                  onClick={() => toggleCompleted(idx)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    part.isCompleted
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                  }`}
                  title={part.isCompleted ? 'ส่วนนี้สอบ/ประกาศคะแนนแล้ว' : 'ส่วนนี้ยังไม่สอบ (รอบไฟนอล)'}
                >
                  {part.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={part.name}
                  onChange={(e) => updatePart(idx, 'name', e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#005A56] dark:focus:border-teal-400 focus:outline-none px-1 py-0.5"
                  placeholder="ชื่อส่วนคะแนน เช่น สอบกลางภาค"
                />
              </div>

              {/* Score Input Fields */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0 flex-wrap">
                {/* Earned Score */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {part.isCompleted ? 'ได้จริง:' : 'ยังไม่สอบ:'}
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={part.max}
                    disabled={!part.isCompleted}
                    value={part.isCompleted ? part.earned : 0}
                    onChange={(e) => updatePart(idx, 'earned', e.target.value)}
                    className={`w-20 p-2 text-center text-xs font-bold rounded-xl border font-mono ${
                      part.isCompleted
                        ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-[#005A56] dark:text-teal-300'
                        : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  />
                </div>

                <span className="text-slate-400 font-bold">/</span>

                {/* Max Score */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">เต็ม:</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    value={part.max}
                    onChange={(e) => updatePart(idx, 'max', e.target.value)}
                    className="w-18 p-2 text-center text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                  />
                  <span className="text-[11px] text-slate-400">คะแนน</span>
                </div>

                {/* Delete button */}
                {parts.length > 1 && (
                  <button
                    onClick={() => handleRemovePart(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="ลบส่วนคะแนนนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Validation total indicator */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div className="text-slate-500 dark:text-slate-400">
            รวมคะแนนเต็มทุกส่วน:{' '}
            <span
              className={`font-bold font-mono ${
                calculation.totalMax === 100
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {calculation.totalMax} / 100 คะแนน
            </span>
            {calculation.totalMax !== 100 && (
              <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                (ควรปรับสัดส่วนให้รวมได้ 100 คะแนน)
              </span>
            )}
          </div>

          <div className="text-slate-500 dark:text-slate-400">
            ส่วนที่ตรวจแล้ว:{' '}
            <span className="font-bold text-[#005A56] dark:text-teal-400 font-mono">
              {calculation.completedMax} คะแนน ({calculation.earnedPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Key Requirement Matrix: What Score You Need for A, B+, B, C+, C */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>สรุปคะแนนที่ต้องทำในรอบปลายภาค (Final) เพื่อคว้าแต่ละเกรด</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              คำนวณจากคะแนนที่ตุนไว้แล้ว {calculation.earnedScore.toFixed(1)} คะแนน เทียบกับข้อสอบปลายภาคเต็ม{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">{calculation.remainingMax} คะแนน</span>
            </p>
          </div>

          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#005A56] dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            เกณฑ์อิงเกณฑ์ มหาวิทยาลัยอุบลราชธานี
          </div>
        </div>

        {/* Matrix Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {calculation.gradeTargets.slice(0, 4).map((tgt) => (
            <div
              key={tgt.grade}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                tgt.status === 'secured'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : tgt.status === 'impossible'
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/80 opacity-75'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-[#005A56] dark:hover:border-teal-500 shadow-2xs'
              }`}
            >
              {/* Header: Grade & Threshold */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow-xs ${
                      tgt.grade === 'A'
                        ? 'bg-amber-400 text-teal-950 ring-2 ring-amber-300'
                        : tgt.grade === 'B+'
                        ? 'bg-teal-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {tgt.grade}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      เกณฑ์ขั้นต่ำ {tgt.min} คะแนน
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      แต้มเกรด {tgt.point.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tgt.status === 'secured' || tgt.status === 'easy'
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                      : tgt.status === 'achievable'
                      ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300'
                      : tgt.status === 'challenging'
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                      : tgt.status === 'critical'
                      ? 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300'
                      : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {tgt.grade === 'A' ? '🎯 เป้าหมายสูงสุด' : tgt.grade === 'B+' ? '⭐ ยอดนิยม' : 'เป้าหมาย'}
                </div>
              </div>

              {/* Score Needed */}
              <div className="py-1">
                {tgt.status === 'secured' ? (
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>คะแนนสะสมผ่านเกณฑ์แล้ว!</span>
                  </div>
                ) : tgt.status === 'impossible' ? (
                  <div className="text-rose-600 dark:text-rose-400 text-xs font-bold">
                    ต้องได้ {tgt.neededFromRemaining.toFixed(1)} / {calculation.remainingMax} คะแนน (เกินคะแนนเต็ม)
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">ต้องทำ Final อีกอย่างน้อย:</div>
                    <div className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono flex items-baseline gap-1 mt-0.5">
                      <span className="text-[#005A56] dark:text-teal-400">
                        {tgt.neededFromRemaining.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        / {calculation.remainingMax} คะแนน ({tgt.neededPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div
                className={`text-[11px] font-bold p-2 rounded-xl text-center border ${
                  tgt.status === 'secured' || tgt.status === 'easy'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : tgt.status === 'achievable'
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    : tgt.status === 'challenging'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : tgt.status === 'critical'
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                }`}
              >
                {tgt.statusText}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Table for C+, C, D+, D */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-bold">เกรดเป้าหมาย</th>
                <th className="py-2.5 px-3 font-bold">เกณฑ์ขั้นต่ำ</th>
                <th className="py-2.5 px-3 font-bold">คะแนน Final ที่ต้องการ</th>
                <th className="py-2.5 px-3 font-bold">คิดเป็นสัดส่วน (%)</th>
                <th className="py-2.5 px-3 font-bold">ความเป็นไปได้</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {calculation.gradeTargets.map((tgt) => (
                <tr key={tgt.grade} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold font-mono flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                        tgt.grade === 'A'
                          ? 'bg-amber-400 text-teal-950'
                          : tgt.grade.startsWith('B')
                          ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300'
                          : tgt.grade.startsWith('C')
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {tgt.grade}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">{tgt.label}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {tgt.min} คะแนน
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#005A56] dark:text-teal-400">
                    {tgt.status === 'secured'
                      ? 'ผ่านแล้ว (0.0)'
                      : tgt.status === 'impossible'
                      ? 'เกินคะแนนเต็ม'
                      : `${tgt.neededFromRemaining.toFixed(1)} / ${calculation.remainingMax}`}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {tgt.status === 'secured'
                      ? '0.0%'
                      : tgt.status === 'impossible'
                      ? '-'
                      : `${tgt.neededPercent.toFixed(1)}%`}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tgt.status === 'secured' || tgt.status === 'easy'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : tgt.status === 'achievable'
                          ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300'
                          : tgt.status === 'challenging'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : tgt.status === 'critical'
                          ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {tgt.statusText}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Final Exam Score Slider Simulator */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 rounded-3xl p-6 sm:p-7 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-[#005A56] dark:text-teal-400 uppercase tracking-wider">
              Interactive Final Exam Simulator
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              ลองเลื่อนคะแนนสอบปลายภาค: ถ้าทำข้อสอบไฟนอลได้เท่านี้ จะได้เกรดอะไร?
            </h3>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">เกรดที่คาดว่าจะได้:</span>
            <span
              className={`text-2xl font-black font-mono ${
                calculation.simulatedGrade === 'A'
                  ? 'text-amber-500'
                  : calculation.simulatedGrade.startsWith('B')
                  ? 'text-teal-600 dark:text-teal-400'
                  : calculation.simulatedGrade.startsWith('C')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {calculation.simulatedGrade}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              ({calculation.totalSimulatedScore.toFixed(1)} / 100)
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>0 คะแนน (ทำไม่ได้เลย)</span>
            <span className="text-sm font-black text-[#005A56] dark:text-teal-400 font-mono">
              จำลองได้: {simulatedFinalScore} / {calculation.remainingMax} คะแนน
            </span>
            <span>{calculation.remainingMax} คะแนน (ได้เต็ม)</span>
          </div>

          <input
            type="range"
            min="0"
            max={calculation.remainingMax}
            step="1"
            value={simulatedFinalScore}
            onChange={(e) => setSimulatedFinalScore(parseInt(e.target.value, 10) || 0)}
            className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#005A56] dark:accent-teal-400"
          />

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400">กระโดดไปที่:</span>
            {[0.5, 0.7, 0.8, 0.9, 1.0].map((ratio) => {
              const val = Math.round(calculation.remainingMax * ratio);
              return (
                <button
                  key={ratio}
                  onClick={() => setSimulatedFinalScore(val)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
                >
                  {Math.round(ratio * 100)}% ({val} คะแนน)
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Link to Course Drop Advisor if score is low */}
        {calculation.earnedScore < 30 && calculation.remainingMax > 0 && (
          <div className="p-4 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                คะแนนสะสมของคุณอยู่ในเกณฑ์ที่ต้องเหนื่อยเป็นพิเศษในรอบไฟนอล 
                ต้องการให้ระบบช่วยวิเคราะห์ว่า <strong>"ควรเรียนต่อ หรือควรพิจารณาถอนรายวิชา (W)"</strong> หรือไม่?
              </span>
            </div>
            <button
              onClick={onNavigateToDropAdvisor}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 transition-all cursor-pointer shadow-xs"
            >
              เปิดระบบวิเคราะห์ ถอน vs สู้ต่อ →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
