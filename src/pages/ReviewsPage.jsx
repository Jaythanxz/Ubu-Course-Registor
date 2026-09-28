import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ReviewCommentList from '../components/review/ReviewCommentList';
import ReviewModal from '../components/review/ReviewModal';
import { MessageSquareQuote, Plus, Sparkles, BookOpen, ThumbsUp } from 'lucide-react';

export default function ReviewsPage() {
  const { reviews } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Modal for adding review */}
      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0A5C5A] to-[#064E4D] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#F07C00]" />
            <span>UBU Peer-to-Peer Course Insights</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            ชุมชนรีวิววิชาเลือกจากรุ่นพี่ ม.อุบลฯ
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-lg">
            อ่านรีวิวจริงใจจากรุ่นพี่ที่เคยเรียน เพื่อเตรียมพร้อมรับมือภาระงาน สอบ และโปรเจกต์ได้อย่างมั่นใจ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F07C00] hover:bg-[#d96e00] text-white text-xs font-bold shadow-lg shadow-[#F07C00]/30 transition-all hover:translate-y-[-1px] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>เขียนรีวิวรายวิชา</span>
        </button>
      </div>

      {/* Review Comments Container */}
      <div className="bg-white dark:bg-[#0c1d22] rounded-3xl p-6 sm:p-8 border border-[#D1EAE5] dark:border-teal-900/40 shadow-xs transition-colors">
        <ReviewCommentList reviews={reviews} />
      </div>
    </div>
  );
}
