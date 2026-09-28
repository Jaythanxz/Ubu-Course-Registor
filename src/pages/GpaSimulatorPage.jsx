import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Calculator,
  Award,
  Sparkles,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Target,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

const GRADE_POINTS = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0,
  'W': null, // Not counted
};

export default function GpaSimulatorPage() {
  const { currentUser, enrolledSections, courses } = useApp();

  // Baseline academic record
  const baseCredits = currentUser.credits_completed || 45;
  const baseGpa = parseFloat(currentUser.gpa) || 3.64;
  const basePoints = baseCredits * baseGpa;

  // Initialize simulated courses with enrolled courses or defaults
  const [simulatedCourses, setSimulatedCourses] = useState(() => {
    if (enrolledSections.length > 0) {
      return enrolledSections.map((sec, idx) => ({
        id: sec.course_id + '_' + idx,
        code: sec.course_id,
        name: sec.course?.course_name_th || 'วิชาที่เลือกลงทะเบียน',
        credits: sec.course?.credits || 3,
        grade: 'A',
      }));
    }
    return [
      { id: '1146201', code: '1146201', name: 'โครงสร้างข้อมูลและขั้นตอนวิธี', credits: 3, grade: 'A' },
      { id: '1146311', code: '1146311', name: 'การพัฒนาเว็บแอปพลิเคชันสมัยใหม่', credits: 3, grade: 'B+' },
      { id: '1146320', code: '1146320', name: 'วิศวกรรมซอฟต์แวร์และการจัดการโปรเจกต์', credits: 3, grade: 'A' },
      { id: '0041001', code: '0041001', name: 'ภาษาอังกฤษเพื่อการสื่อสารในงานไอที', credits: 3, grade: 'A' },
    ];
  });

  const [targetGpa, setTargetGpa] = useState('3.70');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState('3');

  // Change single course grade
  const handleGradeChange = (id, newGrade) => {
    setSimulatedCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, grade: newGrade } : c))
    );
  };

  // Add custom simulated course
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    setSimulatedCourses((prev) => [
      ...prev,
      {
        id: 'custom_' + Date.now(),
        code: 'GEN' + Math.floor(100 + Math.random() * 900),
        name: newCourseName.trim(),
        credits: parseInt(newCourseCredits, 10) || 3,
        grade: 'A',
      },
    ]);
    setNewCourseName('');
  };

  // Remove course from simulator
  const handleRemoveCourse = (id) => {
    setSimulatedCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Apply Presets
  const applyPreset = (presetType) => {
    setSimulatedCourses((prev) =>
      prev.map((c, idx) => {
        if (presetType === 'all_a') return { ...c, grade: 'A' };
        if (presetType === 'optimistic') return { ...c, grade: idx % 2 === 0 ? 'A' : 'B+' };
        if (presetType === 'balanced') return { ...c, grade: idx % 2 === 0 ? 'B+' : 'B' };
        if (presetType === 'worst') return { ...c, grade: 'C+' };
        return c;
      })
    );
  };

  // Real-time calculations
  const calculation = useMemo(() => {
    let termCredits = 0;
    let termPoints = 0;

    simulatedCourses.forEach((c) => {
      const pt = GRADE_POINTS[c.grade];
      if (pt !== null) {
        termCredits += c.credits;
        termPoints += c.credits * pt;
      }
    });

    const termGpa = termCredits > 0 ? termPoints / termCredits : 0;
    const newTotalCredits = baseCredits + termCredits;
    const newTotalPoints = basePoints + termPoints;
    const newGpaX = newTotalCredits > 0 ? newTotalPoints / newTotalCredits : 0;
    const delta = newGpaX - baseGpa;

    // Honor prediction
    let honorText = 'สถานภาพปกติ (Normal Status)';
    let honorColor = 'text-slate-700 bg-slate-100 border-slate-200';
    if (newGpaX >= 3.60) {
      honorText = 'เกียรตินิยมอันดับ 1 (First Class Honors) 🥇';
      honorColor = 'text-emerald-800 bg-emerald-50 border-emerald-300';
    } else if (newGpaX >= 3.25) {
      honorText = 'เกียรตินิยมอันดับ 2 (Second Class Honors) 🥈';
      honorColor = 'text-blue-800 bg-blue-50 border-blue-300';
    } else if (newGpaX < 2.00) {
      honorText = 'ภาวะรอพินิจ (Academic Probation) ⚠️';
      honorColor = 'text-red-800 bg-red-50 border-red-300';
    }

    // Required Term GPA to hit target
    const targetVal = parseFloat(targetGpa) || 3.70;
    const neededTotalPoints = targetVal * newTotalCredits;
    const neededTermPoints = neededTotalPoints - basePoints;
    const requiredTermGpa = termCredits > 0 ? neededTermPoints / termCredits : 0;

    return {
      termCredits,
      termPoints,
      termGpa: termGpa.toFixed(2),
      newGpaX: newGpaX.toFixed(2),
      delta: delta.toFixed(2),
      newTotalCredits,
      honorText,
      honorColor,
      requiredTermGpa: requiredTermGpa.toFixed(2),
      targetVal,
    };
  }, [simulatedCourses, baseCredits, basePoints, baseGpa, targetGpa]);

  const triggerCelebrate = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#006663', '#F07C00', '#F59E0B'],
      });
    } catch (e) {}
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#006663] via-[#085a57] to-[#013f3d] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5 text-[#F07C00]" />
            <span>GPA What-If Simulation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            เครื่องมือจำลองและคำนวณเกรดล่วงหน้า (GPA Simulator)
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl">
            ลองปรับเปลี่ยนเกรดที่คาดหวังในแต่ละรายวิชา เพื่อดูผลกระทบต่อเกรดเฉลี่ยสะสม (GPAX ใหม่) แบบเรียลไทม์ทันที
          </p>
        </div>

        {/* Live Badge */}
        <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-[11px] text-teal-200">เกรดเฉลี่ยสะสมปัจจุบัน</div>
          <div className="text-3xl font-black text-white font-mono">{baseGpa.toFixed(2)}</div>
          <div className="text-[10px] text-teal-100">สะสมแล้ว {baseCredits} หน่วยกิต</div>
        </div>
      </div>

      {/* Real-time Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Term GPA Card */}
        <div className="bg-white dark:bg-[#111C24] p-5 rounded-3xl border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>เกรดเฉลี่ยประจำเทอมนี้ (Term GPA)</span>
            <Sparkles className="w-4 h-4 text-[#F07C00]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#006663] dark:text-teal-400 font-mono">
              {calculation.termGpa}
            </span>
            <span className="text-xs text-slate-400">/ 4.00</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            รวม {calculation.termCredits} หน่วยกิตในเทอมนี้
          </div>
        </div>

        {/* New GPAX Card */}
        <div className="bg-white dark:bg-[#111C24] p-5 rounded-3xl border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>เกรดเฉลี่ยสะสมใหม่ (New GPAX)</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 font-mono">
              {calculation.newGpaX}
            </span>
            <div
              className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                parseFloat(calculation.delta) >= 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
              }`}
            >
              {parseFloat(calculation.delta) >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {parseFloat(calculation.delta) >= 0 ? `+${calculation.delta}` : calculation.delta}
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            สะสมรวมสุทธิ {calculation.newTotalCredits} หน่วยกิต
          </div>
        </div>

        {/* Predicted Honor Status */}
        <div className="bg-white dark:bg-[#111C24] p-5 rounded-3xl border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            สถานะเกียรตินิยมที่คาดการณ์
          </div>
          <div className={`p-2.5 rounded-2xl border text-xs font-bold ${calculation.honorColor} dark:border-slate-700`}>
            {calculation.honorText}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            เกณฑ์ ม.อุบลฯ: GPAX ≥ 3.60 ได้เกียรตินิยมอันดับ 1
          </div>
        </div>
      </div>

      {/* Target Goal Calculator Widget */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#E6F4F1] to-emerald-50 dark:from-amber-950/20 dark:via-teal-950/30 dark:to-emerald-950/20 rounded-3xl p-6 border border-[#D1EAE5] dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#006663] dark:bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <Target className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#006663] dark:text-teal-400 uppercase tracking-wider">
              Target Goal Analyzer
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
              วิเคราะห์เป้าหมายเกรดเฉลี่ยที่คุณต้องการ
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              หากต้องการให้ GPAX รวมขยับไปเป็น{' '}
              <span className="font-bold text-[#006663] dark:text-teal-400 font-mono">{calculation.targetVal.toFixed(2)}</span>{' '}
              คุณต้องทำเกรดเฉลี่ยเทอมนี้ให้ได้อย่างน้อย:{' '}
              <span className="font-black text-[#F07C00] text-sm font-mono">
                {parseFloat(calculation.requiredTermGpa) > 4.0
                  ? 'เกิน 4.00 (ต้องใช้เวลาสะสมเพิ่ม)'
                  : calculation.requiredTermGpa}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">เป้าหมาย:</span>
          {['3.60', '3.70', '3.75', '3.80'].map((g) => (
            <button
              key={g}
              onClick={() => setTargetGpa(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                targetGpa === g
                  ? 'bg-[#006663] dark:bg-teal-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Panel */}
      <div className="bg-white dark:bg-[#111C24] rounded-3xl p-6 sm:p-8 border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#006663] dark:text-teal-400" />
              <span>รายวิชาที่นำมาจำลองคำนวณ ({simulatedCourses.length} วิชา)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              คลิกเปลี่ยนเกรดที่ปุ่มของแต่ละวิชาเพื่อดูตัวเลขเกรดเฉลี่ยขยับแบบสดๆ
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1">ชุดตัวเลือกด่วน:</span>
            <button
              onClick={() => { applyPreset('all_a'); triggerCelebrate(); }}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 cursor-pointer"
            >
              🌟 ได้ A ทุกตัว
            </button>
            <button
              onClick={() => applyPreset('optimistic')}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 cursor-pointer"
            >
              🚀 A & B+
            </button>
            <button
              onClick={() => applyPreset('balanced')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 cursor-pointer"
            >
              ⚖️ ปานกลาง (B)
            </button>
            <button
              onClick={() => applyPreset('worst')}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 cursor-pointer"
            >
              🛡️ Worst Case (C+)
            </button>
          </div>
        </div>

        {/* Course Rows */}
        <div className="space-y-3">
          {simulatedCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#006663]/50 dark:hover:border-teal-500/50 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#006663] dark:text-teal-400 bg-[#E6F4F1] dark:bg-teal-950/60 px-2 py-0.5 rounded">
                    {course.code}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {course.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  หน่วยกิต: <span className="font-bold text-slate-700 dark:text-slate-200">{course.credits}</span> หน่วยกิต • แต้มคะแนนที่ได้:{' '}
                  <span className="font-bold text-[#006663] dark:text-teal-400">
                    {GRADE_POINTS[course.grade] !== null
                      ? (course.credits * GRADE_POINTS[course.grade]).toFixed(1)
                      : '0.0 (W)'}
                  </span>
                </div>
              </div>

              {/* Grade Selector Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {Object.keys(GRADE_POINTS).map((g) => {
                  const isSelected = course.grade === g;
                  return (
                    <button
                      key={g}
                      onClick={() => handleGradeChange(course.id, g)}
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#006663] dark:bg-teal-600 text-white shadow-md scale-105 ring-2 ring-[#006663]/30 dark:ring-teal-500/40'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}

                <button
                  onClick={() => handleRemoveCourse(course.id)}
                  title="ลบวิชานี้ออกจากการจำลอง"
                  className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add custom course form */}
        <form
          onSubmit={handleAddCourse}
          className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3"
        >
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="+ เพิ่มรายวิชาจำลองเพิ่มเติม เช่น วิชาเลือกเสรี..."
            className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
          />
          <select
            value={newCourseCredits}
            onChange={(e) => setNewCourseCredits(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="1">1 หน่วยกิต</option>
            <option value="2">2 หน่วยกิต</option>
            <option value="3">3 หน่วยกิต</option>
            <option value="4">4 หน่วยกิต</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#006663] dark:bg-teal-700 hover:bg-[#004e4b] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มวิชาจำลอง</span>
          </button>
        </form>
      </div>
    </div>
  );
}
