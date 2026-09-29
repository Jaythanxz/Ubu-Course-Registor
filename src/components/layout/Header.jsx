import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  ChevronDown,
  User,
  LogOut,
  Calendar,
  X,
  Upload,
  AlertTriangle,
  Sun,
  Moon,
  Sparkles,
  Trash2,
  Menu,
} from 'lucide-react';

export default function Header({ onToggleMobileMenu = () => {} }) {
  const { currentUser, updateAvatar, logout, totalCredits, isWorkloadHigh, isDarkMode, toggleTheme } = useApp();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Handle local image file upload (convert to Base64 data URL)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('กรุณาเลือกไฟล์ภาพขนาดไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
        setIsUploadModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="bg-white/95 dark:bg-[#0C151D]/95 border-b border-[#D1EAE5]/80 dark:border-slate-800/80 px-3.5 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs backdrop-blur-md transition-colors">
      {/* Left side: Hamburger button (mobile) & Context Badges */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#005A56] dark:text-teal-300 shadow-2xs hover:bg-[#E6F4F1] dark:hover:bg-slate-700 cursor-pointer transition-colors"
          title="เปิดเมนูหลัก"
          aria-label="เปิดเมนูหลัก"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Semester Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#E6F4F1] dark:bg-teal-950/50 border border-[#D1EAE5] dark:border-teal-800/60 text-[#005A56] dark:text-teal-300 text-[11px] sm:text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#005A56] dark:text-teal-400 shrink-0" />
          <span>
            <span className="hidden xs:inline">ภาคเรียนที่ </span>
            {currentUser.semester}/{currentUser.academic_year}
          </span>
        </div>

        {isWorkloadHigh && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>ภาระงานสูง</span>
          </div>
        )}
      </div>

      {/* Right side: Theme Toggle & Professional Profile Header Widget */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Site-wide Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่าง (Switch to Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Switch to Dark Mode)'}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 shadow-2xs transition-all cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pl-3.5 rounded-full border border-slate-200/90 dark:border-slate-700 hover:border-[#005A56] dark:hover:border-teal-400 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Student Info Details */}
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#005A56] dark:group-hover:text-teal-300 transition-colors flex items-center justify-end gap-1.5">
                <span>{currentUser.first_name_th} {currentUser.last_name_th}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium flex items-center justify-end gap-1">
                <span>{currentUser.student_id}</span>
                <span>•</span>
                <span className="text-[#005A56] dark:text-teal-400 font-semibold">GPA {currentUser.gpa}</span>
              </div>
            </div>

            {/* Avatar with Status Ring & Quick Camera Badge */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full ring-2 ring-[#005A56]/30 dark:ring-teal-400/40 overflow-hidden bg-gradient-to-br from-[#005A56] to-[#013f3d] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                {currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.first_name_th}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{currentUser.first_name_en?.charAt(0) || 'U'}</span>
                )}
              </div>

              {/* Quick Camera Edit Button Badge */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUploadModalOpen(true);
                }}
                title="เปลี่ยนรูปโปรไฟล์"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#005A56] hover:bg-[#F07C00] text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900 transition-colors cursor-pointer"
              >
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform mr-1" />
          </button>

          {/* Professional Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-[#111C24] rounded-3xl shadow-2xl border border-[#D1EAE5] dark:border-slate-800 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150 z-50">
              {/* Header info in dropdown */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full ring-2 ring-[#005A56]/40 overflow-hidden bg-[#005A56] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {currentUser.avatar_url ? (
                      <img
                        src={currentUser.avatar_url}
                        alt="Student Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{currentUser.first_name_en?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsUploadModalOpen(true);
                    }}
                    className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#005A56] text-white hover:bg-[#F07C00] shadow-xs border border-white dark:border-slate-900 cursor-pointer"
                    title="เปลี่ยนรูปภาพ"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>

                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {currentUser.first_name_th} {currentUser.last_name_th}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {currentUser.student_id}
                  </p>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsUploadModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-[#005A56] dark:text-teal-400 hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-[#F07C00]" />
                    <span>เปลี่ยนรูปโปรไฟล์</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics Snapshot */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400">เกรดเฉลี่ย (GPAX)</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">{currentUser.gpa}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">หน่วยกิตในแผน</span>
                  <div className="font-bold text-[#005A56] dark:text-teal-400 font-mono text-sm">{totalCredits} / 22</div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1 text-xs">
                <Link
                  to="/assessment"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-[#E6F4F1] dark:hover:bg-slate-800 hover:text-[#005A56] dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#F07C00]" />
                  <span>แบบสอบถามความสนใจ (AI)</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-[#E6F4F1] dark:hover:bg-slate-800 hover:text-[#005A56] dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>ดูข้อมูลส่วนตัวนักศึกษา</span>
                </Link>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload & Change Avatar Modal */}
      {isUploadModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#111C24] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#D1EAE5] dark:border-slate-800 space-y-5 my-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    อัปโหลดรูปโปรไฟล์
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    เลือกรูปภาพจากเครื่องของคุณเพื่อเปลี่ยนรูปโปรไฟล์
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Avatar Display */}
              <div className="flex flex-col items-center justify-center space-y-3 py-2">
                <div className="w-24 h-24 rounded-full ring-4 ring-[#005A56]/20 dark:ring-teal-400/30 overflow-hidden shadow-md bg-[#005A56] flex items-center justify-center text-white text-3xl font-black">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{currentUser.first_name_en?.charAt(0) || currentUser.first_name_th?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">
                  ขนาดที่แนะนำ: รูปสี่เหลี่ยมจัตุรัส ไฟล์ไม่เกิน 2MB
                </div>
              </div>

              {/* Upload File Input */}
              <div className="pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#005A56] hover:bg-[#004744] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>เลือกไฟล์รูปภาพจากเครื่อง (Upload Photo)</span>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                {currentUser.avatar_url ? (
                  <button
                    onClick={() => {
                      updateAvatar('');
                      setIsUploadModalOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบรูปภาพ</span>
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
