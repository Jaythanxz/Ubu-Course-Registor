import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ASSESSMENT_QUESTIONS } from '../data/mockData';
import QuestionStep from '../components/assessment/QuestionStep';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Award,
  BookOpen,
  Compass,
  RotateCcw,
} from 'lucide-react';

export default function AssessmentPage() {
  const { assessmentData, setAssessmentData, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(
    assessmentData.answers || {
      1: ['web', 'ai'],
      2: 'lab',
      3: 'individual_practical',
      4: 'career_value',
      5: 'portfolio',
    }
  );
  const [isCompleted, setIsCompleted] = useState(assessmentData.completed || false);

  const totalSteps = ASSESSMENT_QUESTIONS.length;
  const currentQ = ASSESSMENT_QUESTIONS[currentStep];

  const handleSelectAnswer = (val) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const finishAssessment = () => {
    setIsCompleted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0A5C5A', '#F07C00', '#10B981', '#38BDF8'],
      });
    } catch (e) {
      // fallback
    }

    // Determine career track based on answers
    let targetTrack = 1;
    const interests = answers[1] || [];
    if (interests.includes('ai') || interests.includes('data')) {
      targetTrack = 2; // Data & AI
    } else if (interests.includes('security') || interests.includes('network')) {
      targetTrack = 3; // Network
    } else if (interests.includes('uxui')) {
      targetTrack = 4; // UI/UX
    }

    // Update assessment in context and user track
    setAssessmentData({
      completed: true,
      answers,
      recommendedTrackId: targetTrack,
      recommendedCourseIds:
        targetTrack === 2
          ? ['1146331', '1146335', '1146201']
          : ['1146311', '1146320', '1146201'],
    });

    setCurrentUser((prev) => ({
      ...prev,
      career_track_id: targetTrack,
    }));
  };

  const handleRetake = () => {
    setIsCompleted(false);
    setCurrentStep(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0A5C5A] to-[#064E4D] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F07C00]" />
            <span>AI Learning Style & Course Profiler</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            แบบสอบถามความสนใจและค้นหาแผนการเรียนที่ใช่ (Interest & Learning Style Assessment)
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-xl">
            ตอบคำถามสั้นๆ 5 ข้อ เพื่อให้ระบบวิเคราะห์ความสนใจ ทักษะเด่น รูปแบบการเรียน และคัดสรรวิชาเลือกที่ตรงเป้าหมายที่สุด
          </p>
        </div>
      </div>

      {!isCompleted ? (
        /* Quiz Interface */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-[#D1EAE5] dark:border-slate-700 shadow-sm space-y-8 transition-colors">
          {/* Progress Bar & Step Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400">
                ความคืบหน้า ({currentStep + 1} จาก {totalSteps})
              </span>
              <span className="text-[#0A5C5A] dark:text-teal-400">
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0A5C5A] to-[#F07C00] transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <QuestionStep
            question={currentQ}
            stepNumber={currentStep + 1}
            totalSteps={totalSteps}
            selectedValue={answers[currentQ.id]}
            onSelect={handleSelectAnswer}
          />

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A5C5A] hover:bg-[#064E4D] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>{currentStep === totalSteps - 1 ? 'วิเคราะห์ผลลัพธ์' : 'ถัดไป'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-[#D1EAE5] dark:border-slate-700 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-300 transition-colors">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-[#E6F4F1] dark:bg-teal-950/60 text-[#0A5C5A] dark:text-teal-300 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-9 h-9 text-[#F07C00]" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>ประเมินผลเรียบร้อยสมบูรณ์</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              ผลวิเคราะห์ความสนใจ ศักยภาพ & แผนการเรียนที่เหมาะสมกับคุณ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              อิงตามสไตล์การเรียนรู้ {answers[2]} และความสนใจด้านเทคโนโลยีของคุณ
            </p>
          </div>

          {/* Core Strengths Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#E6F4F1] to-white dark:from-teal-950/50 dark:to-[#0f2429] border border-[#D1EAE5] dark:border-teal-900/60 space-y-2">
              <div className="text-xs font-bold text-[#0A5C5A] dark:text-teal-300 uppercase tracking-wider">
                ทักษะเด่น (Core Strength)
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                นักแก้ปัญหาเชิงปฏิบัติการ (Practical Builder)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                เรียนรู้ได้ไวที่สุดเมื่อได้ลองลงมือเขียนโค้ดและสร้างโปรดักต์ของจริง มีสมาธิสูงเมื่อได้เผชิญโจทย์ท้าทาย
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-[#0f2429] border border-amber-200/80 dark:border-amber-900/60 space-y-2">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                สายอาชีพที่จับคู่ได้ดีที่สุด
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Full-Stack & Intelligent Systems
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                มีโอกาสเติบโตสูงในตลาดแรงงาน เหมาะกับวิชาที่ผสมผสานทั้งหน้าบ้านและระบบหลังบ้าน
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-sky-950/30 dark:to-[#0f2429] border border-blue-200/80 dark:border-sky-900/60 space-y-2">
              <div className="text-xs font-bold text-blue-700 dark:text-sky-400 uppercase tracking-wider">
                ข้อควรระวังในการจัดตาราง
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                การกระจายภาระงานโปรเจกต์
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                เนื่องจากชอบวิชาทำแล็บ/โปรเจกต์ ไม่ควรลงวิชาโปรเจกต์ใหญ่เกิน 2 วิชาพร้อมกัน เพื่อไม่ให้ชนกันช่วงไฟนอล
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ทำแบบประเมินใหม่อีกครั้ง</span>
            </button>

            <button
              onClick={() => navigate('/recommendations')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F07C00] hover:bg-[#d96e00] text-white text-xs font-bold shadow-lg shadow-[#F07C00]/30 transition-all hover:translate-y-[-1px] cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>ไปยังหน้ารายวิชาแนะนำ & Roadmap สายอาชีพ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
