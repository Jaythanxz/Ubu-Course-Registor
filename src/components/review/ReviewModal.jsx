import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ReviewModal({ isOpen, onClose }) {
  const { courses, currentUser, addReview } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.course_id || '');
  const [rating, setRating] = useState(5);
  const [projectHeavy, setProjectHeavy] = useState(true);
  const [examHeavy, setExamHeavy] = useState(false);
  const [homeworkLevel, setHomeworkLevel] = useState('medium');
  const [commentText, setCommentText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const courseObj = courses.find(c => c.course_id === selectedCourseId);

    addReview({
      course_id: selectedCourseId,
      course_name_th: courseObj?.course_name_th || '',
      student_id: currentUser.student_id,
      student_email: currentUser.email,
      rating: Number(rating),
      project_heavy: projectHeavy,
      exam_heavy: examHeavy,
      homework_level: homeworkLevel,
      comment_text: commentText.trim(),
    });

    setCommentText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c1d22] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D1EAE5] dark:border-teal-900/60 space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            เขียนรีวิวแบ่งปันประสบการณ์วิชาเรียน
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Select Course */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
              เลือกรายวิชาที่ต้องการรีวิว
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0A5C5A] focus:ring-1 focus:ring-[#0A5C5A]"
            >
              {courses.map(c => (
                <option key={c.course_id} value={c.course_id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  {c.course_id} - {c.course_name_th} ({c.course_name_en})
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
              ระดับความพึงพอใจโดยรวม
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-lg cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-slate-700 dark:text-slate-200">{rating}.0 / 5.0</span>
            </div>
          </div>

          {/* Characteristics Checkboxes */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 bg-white dark:bg-slate-900/60 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={projectHeavy}
                onChange={(e) => setProjectHeavy(e.target.checked)}
                className="w-4 h-4 text-[#0A5C5A] rounded"
              />
              <span className="font-medium text-slate-700 dark:text-slate-200">🚀 เน้นทำโปรเจกต์</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 bg-white dark:bg-slate-900/60 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={examHeavy}
                onChange={(e) => setExamHeavy(e.target.checked)}
                className="w-4 h-4 text-[#0A5C5A] rounded"
              />
              <span className="font-medium text-slate-700 dark:text-slate-200">✍️ เน้นสอบข้อเขียน</span>
            </label>
          </div>

          {/* Homework Level */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
              ปริมาณการบ้าน / ภาระงาน
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'งานน้อยชิลล์' },
                { id: 'medium', label: 'ปานกลางพอดี' },
                { id: 'high', label: 'การบ้านแน่นทุกวีค' },
              ].map(lvl => (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => setHomeworkLevel(lvl.id)}
                  className={`py-2 px-3 rounded-xl border text-center font-medium cursor-pointer transition-all ${
                    homeworkLevel === lvl.id
                      ? 'bg-[#0A5C5A] text-white border-[#0A5C5A]'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
              ความคิดเห็นจริงใจ / คำแนะนำสำหรับรุ่นน้อง
            </label>
            <textarea
              required
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="เล่ารูปแบบการสอนของอาจารย์ ข้อสอบ แนวทางการเตรียมตัว หรือทริคการแบ่งเวลา..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0A5C5A] focus:ring-1 focus:ring-[#0A5C5A]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              โพสต์ในนาม: {currentUser.email}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A5C5A] hover:bg-[#064E4D] text-white font-semibold shadow-xs cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>เผยแพร่รีวิว</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
