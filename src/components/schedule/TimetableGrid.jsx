import React from 'react';
import ScheduleBlock from './ScheduleBlock';
import { useApp } from '../../context/AppContext';
import { Coffee, Calendar, Info, ArrowLeftRight } from 'lucide-react';

const DAYS = [
  { key: 'Mon', label: 'จันทร์ (Mon)', color: 'bg-yellow-400' },
  { key: 'Tue', label: 'อังคาร (Tue)', color: 'bg-pink-400' },
  { key: 'Wed', label: 'พุธ (Wed)', color: 'bg-emerald-500' },
  { key: 'Thu', label: 'พฤหัสฯ (Thu)', color: 'bg-orange-400' },
  { key: 'Fri', label: 'ศุกร์ (Fri)', color: 'bg-blue-400' },
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export default function TimetableGrid() {
  const { enrolledSections, unenrollSection } = useApp();

  // Helper to calculate column start and span based on start_time and end_time
  // Times: 08:00 is col 2, 09:00 is col 3, ..., 18:00 is col 12
  const getSlotPosition = (startTime, endTime) => {
    const startH = parseInt(startTime.split(':')[0], 10);
    const endH = parseInt(endTime.split(':')[0], 10);

    const startCol = startH - 8 + 2; // e.g. 09:00 -> 9 - 8 + 2 = 3
    const span = endH - startH;     // e.g. 12 - 9 = 3
    return { startCol, span };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#D1EAE5] dark:border-slate-700 shadow-xs overflow-hidden">
      {/* Table Header Bar */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#0A5C5A] to-[#064E4D] dark:from-[#0b3b38] dark:to-[#062422] text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-200" />
          <h3 className="text-sm sm:text-base font-bold">ตารางเรียนประจำสัปดาห์ (Weekly Timetable)</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-teal-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-[#E6F4F1] dark:bg-teal-900 border border-[#a8ded4] dark:border-teal-700 inline-block" />
            <span className="text-[11px] sm:text-xs">วิชาในแผน</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 inline-block" />
            <span className="text-[11px] sm:text-xs">วิชาหนัก (4-5 ดาว)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-slate-200 dark:bg-slate-700 inline-block" />
            <span className="text-[11px] sm:text-xs">พักกลางวัน</span>
          </div>
        </div>
      </div>

      {/* Mobile Swipe Hint Banner */}
      <div className="lg:hidden flex items-center justify-between px-3.5 py-2 bg-[#E6F4F1] dark:bg-teal-950/60 mx-3 mt-3 rounded-xl text-xs text-[#005A56] dark:text-teal-300 font-semibold border border-[#D1EAE5] dark:border-teal-800/40">
        <span className="flex items-center gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#F07C00]" />
          <span>เลื่อนซ้าย-ขวา เพื่อดูตารางเรียนทั้งหมด</span>
        </span>
        <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">08:00 - 18:00</span>
      </div>

      {/* Grid Canvas */}
      <div className="overflow-x-auto touch-pan-x p-3 sm:p-4">
        <div className="min-w-[840px]">
          {/* Header Row: Time Slots */}
          <div className="grid grid-cols-[90px_repeat(10,_1fr)] gap-1 text-center font-medium text-xs text-slate-500 dark:text-slate-400 mb-2">
            <div className="p-2 text-slate-400 dark:text-slate-500 font-semibold">วัน / เวลา</div>
            {TIME_SLOTS.slice(0, 10).map((time, idx) => (
              <div
                key={time}
                className={`p-2 rounded-lg ${
                  time === '12:00'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800/60'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{time} - {TIME_SLOTS[idx + 1]}</span>
                {time === '12:00' && (
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
                    <Coffee className="w-2.5 h-2.5" /> พักเที่ยง
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Days Rows */}
          <div className="space-y-2">
            {DAYS.map((day) => {
              // Find courses on this day
              const dayCourses = enrolledSections.filter((s) => s.day_of_week === day.key);

              return (
                <div
                  key={day.key}
                  className="grid grid-cols-[90px_repeat(10,_1fr)] gap-1 min-h-[92px] items-stretch relative"
                >
                  {/* Day Label */}
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col items-center justify-center p-2 text-center">
                    <span className={`w-2.5 h-2.5 rounded-full ${day.color} mb-1`} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{day.label.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{day.key}</span>
                  </div>

                  {/* 10 Time slot empty backgrounds */}
                  {TIME_SLOTS.slice(0, 10).map((time, idx) => {
                    const isLunch = time === '12:00';
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border border-dashed transition-colors ${
                          isLunch
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 flex items-center justify-center'
                            : 'bg-white/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-700/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        {isLunch && (
                          <span className="text-[10px] text-amber-400 font-medium select-none">
                            พักกลางวัน
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {/* Render actual Course Blocks overlaid on their respective slot columns */}
                  {dayCourses.map((item) => {
                    const { startCol, span } = getSlotPosition(item.start_time, item.end_time);

                    return (
                      <div
                        key={item.section_id}
                        className="absolute top-1 bottom-1 z-10 transition-transform"
                        style={{
                          left: `calc(90px + 4px + (${startCol - 2} * ((100% - 94px) / 10)))`,
                          width: `calc((${span} * ((100% - 94px) / 10)) - 4px)`,
                        }}
                      >
                        <ScheduleBlock item={item} onRemove={unenrollSection} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>คลิกที่ไอคอนถังขยะบนการ์ดวิชาเพื่อถอนวิชาออกจากแผนจำลอง</span>
        </div>
        <span>ภาคการศึกษา 1/2569 • ข้อมูลตารางเรียน ม.อุบลฯ</span>
      </div>
    </div>
  );
}
