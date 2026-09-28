import React from 'react';
import { Clock, MapPin, Trash2, AlertCircle } from 'lucide-react';

export default function ScheduleBlock({ item, onRemove }) {
  const { course, section_no, start_time, end_time, room } = item;

  // Render stars for workload
  const renderWorkloadStars = (score) => {
    return (
      <div className="flex items-center gap-0.5" title={`ระดับความหนัก: ${score}/5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-[10px] ${
              i <= score ? 'text-amber-500' : 'text-slate-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full w-full rounded-xl p-2.5 bg-gradient-to-br from-[#E6F4F1] to-[#d6f0ea] dark:from-[#093532] dark:to-[#052624] border border-[#a8ded4] dark:border-teal-700/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden relative">
      {/* Top row */}
      <div>
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono text-[11px] font-bold text-[#0A5C5A] dark:text-teal-300 bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded shadow-2xs">
            {course.course_id} (Sec {section_no})
          </span>
          {course.workload_score >= 4 && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              หนัก 🔥
            </span>
          )}
        </div>

        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 line-clamp-2 leading-tight">
          {course.course_name_th}
        </h4>
      </div>

      {/* Bottom meta */}
      <div className="mt-2 pt-1 border-t border-[#0A5C5A]/10 dark:border-teal-500/20 text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5">
        <div className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-[#0A5C5A] dark:text-teal-400" />
          <span>{start_time} - {end_time}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{room}</span>
          </div>
          {renderWorkloadStars(course.workload_score)}
        </div>
      </div>

      {/* Remove button hover */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.section_id);
          }}
          title="ถอนออกจากแผนจัดตาราง"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-white/90 dark:bg-slate-800/90 text-red-500 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 shadow-xs cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
