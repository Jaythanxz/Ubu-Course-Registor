import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';

export default function QuestionStep({
  question,
  stepNumber,
  totalSteps,
  selectedValue,
  onSelect,
}) {
  const isMulti = question.type === 'multiselect';

  const handleToggleOption = (optId) => {
    if (isMulti) {
      const currentArr = Array.isArray(selectedValue) ? selectedValue : [];
      if (currentArr.includes(optId)) {
        onSelect(currentArr.filter(id => id !== optId));
      } else {
        onSelect([...currentArr, optId]);
      }
    } else {
      onSelect(optId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#F07C00] uppercase tracking-wider mb-1">
          <span>คำถามข้อที่ {stepNumber} จาก {totalSteps}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-snug">
          {question.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {question.subtitle}
        </p>
      </div>

      {/* Options List */}
      <div className={isMulti ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
        {question.options.map((opt) => {
          const isSelected = isMulti
            ? Array.isArray(selectedValue) && selectedValue.includes(opt.id)
            : selectedValue === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => handleToggleOption(opt.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                isSelected
                  ? 'border-[#0A5C5A] bg-[#E6F4F1]/60 dark:bg-teal-950/40 dark:border-teal-500 shadow-xs ring-1 ring-[#0A5C5A]/30 dark:ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#0c1d22] hover:bg-slate-50/70 dark:hover:bg-[#11272e]'
              }`}
            >
              {/* Radio or Checkbox circle */}
              <div
                className={`w-5 h-5 rounded-${isMulti ? 'md' : 'full'} shrink-0 mt-0.5 flex items-center justify-center border transition-colors ${
                  isSelected
                    ? 'bg-[#0A5C5A] border-[#0A5C5A] text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>

              {/* Option Text */}
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {opt.label || opt.title}
                </div>
                {opt.desc && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {opt.desc}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
