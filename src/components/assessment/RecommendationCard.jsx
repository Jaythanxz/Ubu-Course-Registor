import React from 'react';
import { BookOpen, Star, Plus, Check, AlertTriangle, Sparkles, User, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RecommendationCard({
  course,
  matchTags = [],
  matchPercent = 95,
  onEnroll,
  isEnrolled = false,
}) {
  const { checkPrerequisites, courseSections } = useApp();
  const prereqCheck = checkPrerequisites(course.course_id);
  const sections = courseSections.filter(s => s.course_id === course.course_id);

  return (
    <div className="bg-white dark:bg-[#0f2429] rounded-2xl p-5 border border-[#D1EAE5] dark:border-teal-900/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header: Code, Badges, Match Score */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0A5C5A] dark:text-teal-300 bg-[#E6F4F1] dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
                {course.course_id}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {course.credits} หน่วยกิต
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0A5C5A] dark:group-hover:text-teal-300 transition-colors">
              {course.course_name_th}
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {course.course_name_en}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0A5C5A] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>ตรงใจ {matchPercent}%</span>
            </span>
          </div>
        </div>

        {/* Reason Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {matchTags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#E6F4F1] dark:bg-teal-950/60 text-[#0A5C5A] dark:text-teal-300 border border-[#D1EAE5] dark:border-teal-800/60"
            >
              {tag}
            </span>
          ))}
          {course.workload_score >= 4 ? (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              ⚡ ภาระงานสูง ({course.workload_score}/5)
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              🌱 ภาระงานพอดี ({course.workload_score}/5)
            </span>
          )}
        </div>

        {/* Course Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Prerequisite status notice */}
        {!prereqCheck.passed && (
          <div className="mt-3 p-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              ต้องผ่านวิชา: {prereqCheck.missingCourses.map(c => c.course_id).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          มีเปิดสอน {sections.length} ตอนเรียน (Sec)
        </div>

        {isEnrolled ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-3 py-1.5 rounded-xl">
            <Check className="w-3.5 h-3.5" /> อยู่ในตารางแล้ว
          </span>
        ) : (
          <button
            onClick={() => onEnroll(course, sections[0]?.section_id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0A5C5A] hover:bg-[#064E4D] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มลงตารางจำลอง</span>
          </button>
        )}
      </div>
    </div>
  );
}
