import React from 'react';
import { AlertCircle, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrerequisiteAlert({ isOpen, onClose, missingCourses, courseName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111C24] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 dark:border-red-900/60 transform transition-all scale-100 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            ไม่ผ่านเงื่อนไขวิชาบังคับก่อน (Prerequisite)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            ระบบตรวจสอบพบว่าคุณยังไม่ผ่านวิชาบังคับก่อนสำหรับรายวิชา{' '}
            <span className="font-semibold text-slate-900 dark:text-teal-300">{courseName}</span>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-2">
          <div className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">
            วิชาบังคับก่อนที่ยังไม่ผ่าน:
          </div>
          <ul className="space-y-1.5 text-xs text-red-700 dark:text-red-300">
            {missingCourses?.map((c) => (
              <li key={c.course_id} className="flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>
                  {c.course_id} - {c.course_name_th || c.course_name_en}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          ตามระเบียบมหาวิทยาลัยอุบลราชธานี นักศึกษาต้องได้รับผลการเรียนผ่านในวิชาบังคับก่อนจึงจะสามารถลงทะเบียนวิชาต่อเนื่องได้
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            รับทราบและปิด
          </button>
        </div>
      </div>
    </div>
  );
}
