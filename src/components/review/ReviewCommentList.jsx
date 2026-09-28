import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Star, Mail, CheckCircle2, Filter } from 'lucide-react';

export default function ReviewCommentList({ reviews, onLike }) {
  const [filterTag, setFilterTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filter reviews
  const filtered = reviews.filter((r) => {
    if (filterTag === 'all') return true;
    if (filterTag === 'project' && r.project_heavy) return true;
    if (filterTag === 'exam' && r.exam_heavy) return true;
    if (filterTag === 'homework_high' && r.homework_level === 'high') return true;
    if (filterTag === 'homework_low' && r.homework_level === 'low') return true;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedReviews = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> ตัวกรอง:
          </span>
          <button
            onClick={() => { setFilterTag('all'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filterTag === 'all'
                ? 'bg-[#0A5C5A] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            ทั้งหมด ({reviews.length})
          </button>
          <button
            onClick={() => { setFilterTag('project'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filterTag === 'project'
                ? 'bg-[#0A5C5A] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            💻 เน้นทำโปรเจกต์
          </button>
          <button
            onClick={() => { setFilterTag('exam'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filterTag === 'exam'
                ? 'bg-[#0A5C5A] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            📝 เน้นสอบข้อเขียน
          </button>
          <button
            onClick={() => { setFilterTag('homework_high'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filterTag === 'homework_high'
                ? 'bg-[#0A5C5A] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            📚 การบ้านเยอะ
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          พบ {filtered.length} ความคิดเห็น
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {paginatedReviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">ไม่พบบทวิจารณ์ในหมวดหมู่นี้</p>
          </div>
        ) : (
          paginatedReviews.map((rev) => (
            <div
              key={rev.review_id}
              className="bg-white dark:bg-[#0f2429] rounded-2xl p-5 border border-[#D1EAE5] dark:border-teal-900/40 shadow-xs hover:border-[#0A5C5A]/40 dark:hover:border-teal-500/40 transition-all space-y-3"
            >
              {/* Header: Course + Reviewer info */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0A5C5A] dark:text-teal-300 bg-[#E6F4F1] dark:bg-teal-950/60 px-2 py-0.5 rounded">
                      {rev.course_id}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {rev.course_name_th}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Mail className="w-3 h-3 text-[#0A5C5A] dark:text-teal-400" />
                      <span className="font-mono">{rev.student_email}</span>
                    </span>
                    <span>•</span>
                    <span>{rev.created_at}</span>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">{rev.rating || 5}.0</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {rev.project_heavy && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                    🚀 เน้นโปรเจกต์
                  </span>
                )}
                {rev.exam_heavy && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                    ✍️ เน้นสอบข้อเขียน
                  </span>
                )}
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  การบ้าน: {rev.homework_level === 'high' ? 'ภาระงานสูง' : rev.homework_level === 'low' ? 'งานเบาชิว' : 'ระดับปานกลาง'}
                </span>
              </div>

              {/* Comment text */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50/70 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                "{rev.comment_text}"
              </p>

              {/* Bottom footer: likes count */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => onLike && onLike(rev.review_id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#0A5C5A] dark:text-teal-400" />
                  <span>มีประโยชน์ ({rev.likes || 0})</span>
                </button>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Verified UBU Student
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            ก่อนหน้า
          </button>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 px-2">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            ถัดไป
          </button>
        </div>
      )}
    </div>
  );
}
