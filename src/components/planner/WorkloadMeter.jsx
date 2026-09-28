import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export default function WorkloadMeter() {
  const { totalCredits, heavyCourses, isWorkloadHigh, averageWorkload, enrolledSections } = useApp();

  // Calculate score index (1 to 5)
  const score = parseFloat(averageWorkload) || 0;
  const percentage = Math.min(100, Math.round((score / 5) * 100));

  // Determine severity style
  const getSeverity = () => {
    if (isWorkloadHigh) {
      return {
        label: 'วิกฤต (ภาระงานหนักมาก)',
        badgeClass: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
        barColor: 'bg-red-500',
        textColor: 'text-red-600 dark:text-red-400',
      };
    }
    if (score >= 3.5 || heavyCourses.length === 2) {
      return {
        label: 'ปานกลางค่อนข้างหนัก',
        badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        barColor: 'bg-amber-500',
        textColor: 'text-amber-600 dark:text-amber-400',
      };
    }
    return {
      label: 'สมดุลดีเยี่ยม (Optimal)',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      barColor: 'bg-[#0A5C5A] dark:bg-teal-500',
      textColor: 'text-[#0A5C5A] dark:text-teal-400',
    };
  };

  const severity = getSeverity();

  return (
    <div className="bg-white dark:bg-[#111C24] rounded-2xl p-5 border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] dark:bg-teal-950/60 flex items-center justify-center text-[#0A5C5A] dark:text-teal-300">
            <Flame className="w-5 h-5 text-[#F07C00]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">ดัชนีภาระงานรายเทอม (Workload Meter)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">วิเคราะห์ความยากและภาระงานรวมเพื่อป้องกัน Burnout</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${severity.badgeClass}`}>
          {severity.label}
        </span>
      </div>

      {/* Progress Bar & Scores */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-300">คะแนนความหนักเฉลี่ย: <span className={severity.textColor}>{score} / 5.0</span></span>
          <span className="text-slate-500 dark:text-slate-400">{enrolledSections.length} วิชา ({totalCredits} หน่วยกิต)</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${severity.barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Warning Box if >= 3 heavy courses as required by spec */}
      {isWorkloadHigh ? (
        <div className="p-3.5 rounded-xl bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-start gap-3 animate-pulse">
          <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-red-900 dark:text-red-200">
              ⚠️ คำเตือน: คุณมีวิชาที่เน้นโปรเจกต์/ภาระงานสูง {heavyCourses.length} วิชาในเทอมนี้ อาจเสี่ยงต่อการจัดสรรเวลา
            </p>
            <p className="text-red-700 dark:text-red-300 leading-relaxed">
              วิชาที่ภาระงานระดับ 4–5 ดาวได้แก่:{' '}
              <span className="font-semibold underline">
                {heavyCourses.map(h => `${h.course.course_id} ${h.course.course_name_th}`).join(', ')}
              </span>
              {' '}— แนะนำสลับบางวิชาไปลงในเทอมถัดไป หรือลงคู่กับวิชาศึกษาทั่วไป (GenEd) เพื่อลดความตึงเครียด
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-[#E6F4F1]/60 dark:bg-teal-950/40 border border-[#D1EAE5] dark:border-teal-800/60 text-[#0A5C5A] dark:text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            {heavyCourses.length > 0
              ? `คุณมีวิชาหนัก ${heavyCourses.length} วิชา อยู่ในเกณฑ์ที่สามารถบริหารจัดการได้ดี`
              : 'ตารางเรียนของคุณอยู่ในระดับภาระงานที่เหมาะสมและผ่อนคลาย'}
          </span>
        </div>
      )}
    </div>
  );
}
