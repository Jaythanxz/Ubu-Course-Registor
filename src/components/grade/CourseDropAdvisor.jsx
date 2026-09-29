import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Calendar,
  FileCheck,
  UserCheck,
  Scale,
  Sparkles,
  Info,
  ChevronDown,
} from 'lucide-react';

export default function CourseDropAdvisor({ onNavigateToForecaster = () => {} }) {
  const { currentUser, enrolledSections, courses } = useApp();

  // Baseline student data
  const baseCredits = currentUser.credits_completed || 45;
  const baseGpa = parseFloat(currentUser.gpa) || 3.64;
  const basePoints = baseCredits * baseGpa;

  // Selected course to evaluate
  const [selectedCourseCode, setSelectedCourseCode] = useState(() => {
    if (enrolledSections.length > 0) return enrolledSections[0].course_id;
    return '1146201';
  });

  const [courseCredits, setCourseCredits] = useState(3);
  const [courseName, setCourseName] = useState(() => {
    if (enrolledSections.length > 0) {
      return enrolledSections[0].course?.course_name_th || 'โครงสร้างข้อมูลและขั้นตอนวิธี';
    }
    return 'โครงสร้างข้อมูลและขั้นตอนวิธี';
  });

  // Scores
  const [earnedScore, setEarnedScore] = useState(22); // e.g. Midterm + Quizzes
  const [completedMax, setCompletedMax] = useState(60); // Total points examined so far
  const [remainingMax, setRemainingMax] = useState(40); // Total points in Final exam
  const [targetGrade, setTargetGrade] = useState('C'); // Desired minimum grade (C = 60, D = 50, B = 70)

  // Cutoff thresholds
  const GRADE_MINS = {
    'A': 80,
    'B+': 75,
    'B': 70,
    'C+': 65,
    'C': 60,
    'D+': 55,
    'D': 50,
  };

  // Handle course switch
  const handleSelectCourse = (code) => {
    setSelectedCourseCode(code);
    const enrolled = enrolledSections.find((s) => s.course_id === code);
    if (enrolled) {
      setCourseName(enrolled.course?.course_name_th || code);
      setCourseCredits(enrolled.course?.credits || 3);
    } else {
      const catalog = courses.find((c) => c.course_id === code);
      if (catalog) {
        setCourseName(catalog.course_name_th);
        setCourseCredits(catalog.credits || 3);
      }
    }
  };

  // Real-time Risk Analysis
  const analysis = useMemo(() => {
    const curEarned = Math.max(0, parseFloat(earnedScore) || 0);
    const curMax = Math.max(1, parseFloat(completedMax) || 1);
    const remMax = Math.max(0, parseFloat(remainingMax) || 0);
    const totalMax = curMax + remMax;

    // Percent earned in midterm & quizzes
    const currentPercent = (curEarned / curMax) * 100;

    // Target cutoff
    const targetMin = GRADE_MINS[targetGrade] || 60;
    const passMin = 50; // Minimum for grade D (Pass)

    // Points needed to reach target grade
    const neededForTarget = targetMin - curEarned;
    const neededPercentTarget = remMax > 0 ? (neededForTarget / remMax) * 100 : 999;

    // Points needed just to pass (Avoid F)
    const neededToPass = passMin - curEarned;
    const neededPercentPass = remMax > 0 ? (neededToPass / remMax) * 100 : 999;

    // Maximum possible score if 100% in Final
    const maxPossibleTotal = curEarned + remMax;

    // Risk Classification
    let riskLevel = 'safe'; // 'safe', 'warning', 'critical'
    let recommendationTitle = '';
    let recommendationDesc = '';
    let verdictBadge = '';

    if (maxPossibleTotal < targetMin || neededPercentTarget > 90 || neededPercentPass > 80) {
      // CRITICAL
      riskLevel = 'critical';
      verdictBadge = '🔴 ควรพิจารณาถอนรายวิชา (ติด W)';
      recommendationTitle = 'สุ่มเสี่ยงสูงมาก แนะนำให้พิจารณา "ถอนรายวิชา (Withdraw W)"';
      recommendationDesc = `เนื่องจากคุณต้องการคะแนนในรอบไฟนอลถึง ${neededPercentTarget.toFixed(
        1
      )}% ซึ่งมีความเสี่ยงสูงมากที่จะติด F หรือได้เกรด D/D+ ซึ่งจะดึงเกรดเฉลี่ยรวม (GPAX) ให้ตกลง การถอนติด W จะช่วยรักษา GPAX และให้โอกาสลงเรียนใหม่ในเทอมหน้า`;
    } else if (neededPercentTarget > 65 || neededPercentPass > 50) {
      // WARNING
      riskLevel = 'warning';
      verdictBadge = '🟡 โซนเฝ้าระวัง: สู้ต่อได้ แต่ต้องเพิ่มความพยายาม';
      recommendationTitle = 'แนะนำ "สู้ต่อ" โดยต้องวางแผนอ่านหนังสือและติวอย่างเข้มข้น';
      recommendationDesc = `คุณยังมีโอกาสทำได้ตามเป้าหมายเกรด ${targetGrade} แต่ต้องทำข้อสอบปลายภาคให้ได้ไม่ต่ำกว่า ${neededForTarget.toFixed(
        1
      )} / ${remMax} คะแนน (${neededPercentTarget.toFixed(
        1
      )}%) แนะนำให้เข้าพบอาจารย์ผู้สอนช่วง Office Hour และรวมกลุ่มติวกับเพื่อน`;
    } else {
      // SAFE
      riskLevel = 'safe';
      verdictBadge = '🟢 ปลอดภัย: เรียนต่อแน่นอน ไม่ต้องถอน';
      recommendationTitle = 'แนะนำ "เรียนต่อได้เลยอย่างมั่นใจ"';
      recommendationDesc = `คะแนนสะสมของคุณอยู่ในเกณฑ์ดี ต้องการคะแนนไฟนอลเพียง ${neededForTarget.toFixed(
        1
      )} / ${remMax} คะแนน (${neededPercentTarget.toFixed(
        1
      )}%) เท่านั้น มีโอกาสสูงที่จะได้เกรด ${targetGrade} หรือดีกว่า รักษาวินัยการทบทวนบทเรียนได้เลย`;
    }

    // What-If GPAX Comparison
    const credits = parseFloat(courseCredits) || 3;

    // Scenario 1: Keep & get F (0.0 points)
    const gpaxWithF = (basePoints + 0) / (baseCredits + credits);
    const deltaF = gpaxWithF - baseGpa;

    // Scenario 2: Keep & get D (1.0 points)
    const gpaxWithD = (basePoints + credits * 1.0) / (baseCredits + credits);
    const deltaD = gpaxWithD - baseGpa;

    // Scenario 3: Keep & get Target Grade
    const targetPoints = { 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0 }[targetGrade] || 2.0;
    const gpaxWithTarget = (basePoints + credits * targetPoints) / (baseCredits + credits);
    const deltaTarget = gpaxWithTarget - baseGpa;

    // Scenario 4: Withdraw (W) - GPAX remains unchanged
    const gpaxWithW = baseGpa;

    return {
      currentPercent,
      neededForTarget: Math.max(0, neededForTarget),
      neededPercentTarget: Math.min(999, Math.max(0, neededPercentTarget)),
      neededToPass: Math.max(0, neededToPass),
      neededPercentPass: Math.min(999, Math.max(0, neededPercentPass)),
      maxPossibleTotal,
      riskLevel,
      verdictBadge,
      recommendationTitle,
      recommendationDesc,
      gpaxWithF: gpaxWithF.toFixed(2),
      deltaF: deltaF.toFixed(2),
      gpaxWithD: gpaxWithD.toFixed(2),
      deltaD: deltaD.toFixed(2),
      gpaxWithTarget: gpaxWithTarget.toFixed(2),
      deltaTarget: (deltaTarget >= 0 ? `+${deltaTarget.toFixed(2)}` : deltaTarget.toFixed(2)),
      gpaxWithW: gpaxWithW.toFixed(2),
      credits,
    };
  }, [earnedScore, completedMax, remainingMax, targetGrade, courseCredits, baseCredits, basePoints, baseGpa]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-700/60">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Course Keep vs. Drop (W) Risk Advisor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            ระบบวิเคราะห์ความเสี่ยง: ควรเรียนต่อหรือถอนรายวิชาดี (W)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ช่วยนักศึกษาประเมินจุดคุ้มทุนหลังสอบกลางภาค (Midterm) 
            วิเคราะห์คะแนนที่ต้องทำในรอบไฟนอล เปรียบเทียบผลกระทบต่อ GPAX รวม 
            และให้คำแนะนำที่ชัดเจนเพื่อการตัดสินใจที่ดีที่สุด
          </p>
        </div>

        {/* Current GPAX Snapshot */}
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 text-center shrink-0 min-w-[180px]">
          <div className="text-[11px] text-slate-300 font-medium">เกรดเฉลี่ยสะสมปัจจุบัน (GPAX)</div>
          <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-0.5">
            {baseGpa.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">สะสมแล้ว {baseCredits} หน่วยกิต</div>
        </div>
      </div>

      {/* Input Parameters Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#005A56] dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              กรอกข้อมูลคะแนนเพื่อประเมินสถานการณ์
            </h3>
          </div>

          <span className="text-xs text-slate-400">คำนวณแบบเรียลไทม์ทันที</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Pick Course */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              วิชาที่ต้องการประเมินความเสี่ยง:
            </label>
            <div className="relative">
              <select
                value={selectedCourseCode}
                onChange={(e) => handleSelectCourse(e.target.value)}
                className="w-full p-2.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-[#005A56] dark:focus:border-teal-500 appearance-none cursor-pointer"
              >
                <optgroup label="วิชาที่ลงทะเบียนในเทอมนี้">
                  {enrolledSections.map((sec) => (
                    <option key={sec.course_id} value={sec.course_id}>
                      {sec.course_id} - {sec.course?.course_name_th || 'วิชาลงทะเบียน'} ({sec.course?.credits || 3} นก.)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="วิชาอื่นๆ ทั้งหมด">
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

          {/* 2. Target Grade */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              เป้าหมายเกรดขั้นต่ำที่ต้องการ:
            </label>
            <div className="relative">
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="w-full p-2.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 text-xs font-bold font-mono focus:outline-none focus:border-[#005A56] dark:focus:border-teal-500 appearance-none cursor-pointer"
              >
                <option value="A">เกรด A (≥ 80 คะแนน)</option>
                <option value="B+">เกรด B+ (≥ 75 คะแนน)</option>
                <option value="B">เกรด B (≥ 70 คะแนน)</option>
                <option value="C+">เกรด C+ (≥ 65 คะแนน)</option>
                <option value="C">เกรด C (≥ 60 คะแนน - ปลอดภัย)</option>
                <option value="D+">เกรด D+ (≥ 55 คะแนน)</option>
                <option value="D">เกรด D (≥ 50 คะแนน - ขอแค่รอด F)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 3. Course Credits */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              จำนวนหน่วยกิตวิชานี้:
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={courseCredits}
              onChange={(e) => setCourseCredits(parseInt(e.target.value, 10) || 3)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-[#005A56] dark:focus:border-teal-500"
            />
          </div>

          {/* 4. Earned Score (Midterm + Quizzes) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              คะแนนที่ได้แล้ว (มิดเทอม + คะแนนเก็บ):
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={earnedScore}
              onChange={(e) => setEarnedScore(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-[#005A56] dark:focus:border-teal-500"
            />
          </div>

          {/* 5. Examined Max Score */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              จากคะแนนเต็มของส่วนที่สอบไปแล้ว:
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={completedMax}
              onChange={(e) => setCompletedMax(parseFloat(e.target.value) || 60)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-[#005A56] dark:focus:border-teal-500"
            />
          </div>

          {/* 6. Remaining Max in Final */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              คะแนนสอบปลายภาค (Final) ที่เหลืออยู่:
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={remainingMax}
              onChange={(e) => setRemainingMax(parseFloat(e.target.value) || 40)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-[#005A56] dark:focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Primary Verdict & Advisory Recommendation Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-all ${
          analysis.riskLevel === 'critical'
            ? 'bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 dark:from-rose-950/40 dark:via-red-950/30 dark:to-slate-800 border-rose-300 dark:border-rose-800'
            : analysis.riskLevel === 'warning'
            ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-slate-800 border-amber-300 dark:border-amber-800'
            : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-800 border-emerald-300 dark:border-emerald-800'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black shadow-2xs border">
              <span className="text-sm">
                {analysis.riskLevel === 'critical' ? '🚨' : analysis.riskLevel === 'warning' ? '⚡' : '✅'}
              </span>
              <span>{analysis.verdictBadge}</span>
            </div>

            <h3
              className={`text-xl sm:text-2xl font-black ${
                analysis.riskLevel === 'critical'
                  ? 'text-rose-900 dark:text-rose-200'
                  : analysis.riskLevel === 'warning'
                  ? 'text-amber-900 dark:text-amber-200'
                  : 'text-emerald-900 dark:text-emerald-200'
              }`}
            >
              {analysis.recommendationTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {analysis.recommendationDesc}
            </p>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 pt-1 flex-wrap text-xs font-semibold">
              <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                คะแนนสอบไฟนอลที่ต้องได้:{' '}
                <span className="font-bold text-[#005A56] dark:text-teal-400 font-mono">
                  {analysis.neededForTarget.toFixed(1)} / {remainingMax} คะแนน ({analysis.neededPercentTarget.toFixed(1)}%)
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                คะแนนขั้นต่ำเพื่อรอด F (เกรด D):{' '}
                <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {analysis.neededToPass.toFixed(1)} / {remainingMax} คะแนน ({analysis.neededPercentPass.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Big Action Callout */}
          <div className="shrink-0 w-full md:w-auto text-center p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2 min-w-[200px]">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              คะแนนเต็มสูงสุดที่เป็นไปได้
            </div>
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono">
              {analysis.maxPossibleTotal}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
            <div
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                analysis.maxPossibleTotal >= 80
                  ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60'
                  : analysis.maxPossibleTotal >= 60
                  ? 'text-teal-700 bg-teal-50 dark:bg-teal-950/60'
                  : 'text-rose-700 bg-rose-50 dark:bg-rose-950/60'
              }`}
            >
              โอกาสสูงสุด: เกรด {analysis.maxPossibleTotal >= 80 ? 'A' : analysis.maxPossibleTotal >= 70 ? 'B' : analysis.maxPossibleTotal >= 60 ? 'C' : analysis.maxPossibleTotal >= 50 ? 'D' : 'F'}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side GPAX Impact Simulator: If F vs If D vs If W */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-[#F07C00]" />
            <span>เปรียบเทียบผลกระทบต่อเกรดเฉลี่ยสะสม (What-If GPAX Comparison)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            เห็นผลลัพธ์ชัดเจนว่าการตัดสินใจแต่ละทางเลือกจะส่งผลต่อทรานสคริปต์และ GPAX รวมอย่างไร
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: If Stay & Fail (Get F) */}
          <div className="p-5 rounded-2xl border-2 border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                  ทางเลือกที่ 1: สู้ต่อแล้วติด F
                </span>
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
                  F
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                ได้แต้มเกรด 0.0 แต้ม
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ฉุด GPAX รวมตก เสียประวัติในทรานสคริปต์ และต้องลงทะเบียนเรียนซ้ำ
              </p>
            </div>

            <div className="pt-2 border-t border-rose-200 dark:border-rose-900/40 space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">GPAX ใหม่จะกลายเป็น:</div>
              <div className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono flex items-baseline gap-2">
                <span>{analysis.gpaxWithF}</span>
                <span className="text-xs font-bold text-rose-600">({analysis.deltaF})</span>
              </div>
            </div>
          </div>

          {/* Card 2: If Stay & Get Target Grade (C) */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 space-y-3 flex flex-col justify-between shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                  ทางเลือกที่ 2: สู้ต่อแล้วได้เกรด {targetGrade}
                </span>
                <span className="w-6 h-6 rounded-full bg-[#005A56] text-white font-black text-xs flex items-center justify-center">
                  {targetGrade}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                สอบผ่านตามเป้าหมาย
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ต้องทำข้อสอบปลายภาคให้ได้ {analysis.neededForTarget.toFixed(1)} คะแนนขึ้นไป
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">GPAX ใหม่จะกลายเป็น:</div>
              <div className="text-3xl font-black text-[#005A56] dark:text-teal-400 font-mono flex items-baseline gap-2">
                <span>{analysis.gpaxWithTarget}</span>
                <span className="text-xs font-bold text-emerald-600">({analysis.deltaTarget})</span>
              </div>
            </div>
          </div>

          {/* Card 3: If Withdraw with W */}
          <div className="p-5 rounded-2xl border-2 border-blue-300 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  ทางเลือกที่ 3: ถอนรายวิชา (ติด W)
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  W
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                ไม่นำมาคิดแต้ม GPAX
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                เกรดเฉลี่ยสะสมไม่ตก ไม่กระทบสิทธิ์เกียรตินิยม/ทุน และไม่ติดทัณฑ์บน
              </p>
            </div>

            <div className="pt-2 border-t border-blue-200 dark:border-blue-900/40 space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">GPAX ใหม่จะคงเดิมที่:</div>
              <div className="text-3xl font-black text-blue-700 dark:text-blue-300 font-mono flex items-baseline gap-2">
                <span>{analysis.gpaxWithW}</span>
                <span className="text-xs font-bold text-blue-600">(คงที่ ±0.00)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UBU Official Withdrawal Guide & Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-[#D1EAE5] dark:border-slate-700 shadow-xs space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-700/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#005A56] dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              ข้อควรรู้และแนวปฏิบัติในการถอนรายวิชา (W) มหาวิทยาลัยอุบลราชธานี
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            สำนักบริหารการศึกษา REG UBU
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Item 1 */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              1
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-100">
              หน่วยกิตขั้นต่ำหลังถอน
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              หลังการถอนรายวิชานี้ จำนวนหน่วยกิตคงเหลือในภาคเรียนปกติ <strong>ต้องไม่น้อยกว่า 9 หน่วยกิต</strong> (เว้นแต่เป็นภาคการศึกษาสุดท้ายก่อนสำเร็จการศึกษา)
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
              2
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-100">
              ตรวจเช็ควิชาตัวต่อ (Prerequisite)
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              ตรวจสอบว่าวิชานี้เป็นวิชาบังคับก่อนของเทอมหน้าหรือไม่ หากถอนอาจต้องรอลงเรียนใหม่ในรอบปีถัดไป หรือภาคฤดูร้อน
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
              3
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-100">
              ปรึกษาอาจารย์ที่ปรึกษา (Advisor)
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              ก่อนกดยืนยันการถอน ควรเข้าพบอาจารย์ที่ปรึกษาประจำตัว เพื่อขอความเห็นชอบและวางแผนการลงทะเบียนในเทอมถัดไป
            </p>
          </div>

          {/* Item 4 */}
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
              4
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-100">
              ยื่นคำร้องผ่านระบบ REG UBU
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              ทำรายการถอนรายวิชาออนไลน์ผ่านเว็บไซต์สำนักทะเบียน ภายในระยะเวลาที่กำหนดตามปฏิทินการศึกษา
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
