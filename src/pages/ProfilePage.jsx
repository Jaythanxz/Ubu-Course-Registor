import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Award,
  Phone,
  BookOpen,
  Calendar,
  ShieldCheck,
  Compass,
  Edit3,
  Check,
  X,
  MapPin,
  Save,
  CheckCircle2,
  Camera,
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateUserProfile, updateAvatar, careerTracks, totalCredits, passedCourses, courses } = useApp();
  const fileInputRef = React.useRef(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('กรุณาเลือกไฟล์ภาพขนาดไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3500);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name_th: currentUser.first_name_th || '',
    last_name_th: currentUser.last_name_th || '',
    first_name_en: currentUser.first_name_en || '',
    last_name_en: currentUser.last_name_en || '',
    email: currentUser.email || '',
    faculty: currentUser.faculty || 'คณะวิทยาศาสตร์ (Faculty of Science)',
    department: currentUser.department || 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล',
    phone: currentUser.phone || '089-765-4321',
    address: currentUser.address || 'มหาวิทยาลัยอุบลราชธานี อ.วารินชำราบ จ.อุบลราชธานี 34190',
    advisor_name: currentUser.advisor_name || '',
    career_track_id: currentUser.career_track_id || 1,
  });

  useEffect(() => {
    setFormData({
      first_name_th: currentUser.first_name_th || '',
      last_name_th: currentUser.last_name_th || '',
      first_name_en: currentUser.first_name_en || '',
      last_name_en: currentUser.last_name_en || '',
      email: currentUser.email || '',
      faculty: currentUser.faculty || 'คณะวิทยาศาสตร์ (Faculty of Science)',
      department: currentUser.department || 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล',
      phone: currentUser.phone || '089-765-4321',
      address: currentUser.address || 'มหาวิทยาลัยอุบลราชธานี อ.วารินชำราบ จ.อุบลราชธานี 34190',
      advisor_name: currentUser.advisor_name || '',
      career_track_id: currentUser.career_track_id || 1,
    });
  }, [currentUser]);

  const [savedToast, setSavedToast] = useState(false);

  const currentTrack = (careerTracks || []).find((t) => t.track_id === currentUser?.career_track_id) || (careerTracks && careerTracks[0]) || { track_name: 'ยังไม่ระบุสายอาชีพ' };
  const passedCoursesDetails = (passedCourses || []).map((id) => (courses || []).find((c) => c.course_id === id) || { course_id: id, course_name_th: id });

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      ...formData,
      career_track_id: Number(formData.career_track_id),
    });
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center justify-between shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>บันทึกการแก้ไขข้อมูลส่วนตัวเรียบร้อยแล้ว</span>
          </div>
          <button onClick={() => setSavedToast(false)} className="text-slate-400 font-bold px-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Profile Card Header */}
      <div className="bg-white dark:bg-[#111C24] rounded-3xl p-6 sm:p-8 border border-[#D1EAE5] dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#006663] to-[#013f3d] text-white flex items-center justify-center text-3xl font-black shadow-lg ring-4 ring-[#E6F4F1] dark:ring-teal-950 overflow-hidden cursor-pointer relative"
              title="คลิกเพื่อเปลี่ยนรูปถ่ายนักศึกษา"
            >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.first_name_th}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span>{currentUser.first_name_en?.charAt(0) || 'U'}</span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">เปลี่ยนรูป</span>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-[#006663] dark:bg-teal-600 hover:bg-[#F07C00] text-white shadow-md border-2 border-white dark:border-slate-900 transition-colors cursor-pointer"
              title="อัปโหลดรูปภาพ"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-mono text-xs font-bold text-[#006663] dark:text-teal-400 bg-[#E6F4F1] dark:bg-teal-950/60 px-2.5 py-1 rounded-md">
                {currentUser.student_id}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {currentUser.status}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                สาย: {currentTrack.track_name.split('/')[0]}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {currentUser.first_name_th} {currentUser.last_name_th}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {currentUser.first_name_en} {currentUser.last_name_en} • {currentUser.email}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#006663] dark:text-teal-400" />
                <span>{currentUser.faculty}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#006663] dark:text-teal-400" />
                <span>{currentUser.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => {
            setFormData({
              first_name_th: currentUser.first_name_th || '',
              last_name_th: currentUser.last_name_th || '',
              first_name_en: currentUser.first_name_en || '',
              last_name_en: currentUser.last_name_en || '',
              email: currentUser.email || '',
              phone: currentUser.phone || '089-765-4321',
              address: currentUser.address || 'หอพักนักศึกษา อาคาร 7C มหาวิทยาลัยอุบลราชธานี อ.วารินชำราบ จ.อุบลราชธานี 34190',
              advisor_name: currentUser.advisor_name || '',
              career_track_id: currentUser.career_track_id || 1,
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006663] dark:bg-teal-700 hover:bg-[#004e4b] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>แก้ไขข้อมูลส่วนตัว</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111C24] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D1EAE5] dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  แก้ไขข้อมูลส่วนตัวนักศึกษา (Edit Profile)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ปรับปรุงข้อมูลการติดต่อและข้อมูลอาจารย์ที่ปรึกษา
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    ชื่อจริง (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name_th}
                    onChange={(e) => setFormData({ ...formData, first_name_th: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    นามสกุล (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name_th}
                    onChange={(e) => setFormData({ ...formData, last_name_th: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    First Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name_en}
                    onChange={(e) => setFormData({ ...formData, first_name_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Last Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name_en}
                    onChange={(e) => setFormData({ ...formData, last_name_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    อีเมลมหาวิทยาลัย (Email)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    เบอร์โทรศัพท์ (Phone)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    คณะ (Faculty)
                  </label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                  >
                    <option value="คณะวิทยาศาสตร์ (Faculty of Science)">คณะวิทยาศาสตร์</option>
                    <option value="คณะวิศวกรรมศาสตร์ (Faculty of Engineering)">คณะวิศวกรรมศาสตร์</option>
                    <option value="คณะบริหารศาสตร์ (Faculty of Management Science)">คณะบริหารศาสตร์</option>
                    <option value="คณะศิลปศาสตร์ (Faculty of Liberal Arts)">คณะศิลปศาสตร์</option>
                    <option value="คณะพยาบาลศาสตร์ (Faculty of Nursing)">คณะพยาบาลศาสตร์</option>
                    <option value="คณะเภสัชศาสตร์ (Faculty of Pharmaceutical Sciences)">คณะเภสัชศาสตร์</option>
                    <option value="วิทยาลัยแพทยศาสตร์และการสาธารณสุข">วิทยาลัยแพทยศาสตร์และการสาธารณสุข</option>
                    <option value="คณะนิติศาสตร์ (Faculty of Law)">คณะนิติศาสตร์</option>
                    <option value="คณะรัฐศาสตร์ (Faculty of Political Science)">คณะรัฐศาสตร์</option>
                    <option value="คณะเกษตรศาสตร์ (Faculty of Agriculture)">คณะเกษตรศาสตร์</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    สาขาวิชา (Department)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  อาจารย์ที่ปรึกษา (Advisor)
                </label>
                <input
                  type="text"
                  required
                  value={formData.advisor_name}
                  onChange={(e) => setFormData({ ...formData, advisor_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  สายอาชีพเป้าหมาย (Career Track)
                </label>
                <select
                  value={formData.career_track_id}
                  onChange={(e) => setFormData({ ...formData, career_track_id: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                >
                  {careerTracks.map((t) => (
                    <option key={t.track_id} value={t.track_id}>
                      {t.track_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  ที่อยู่ / หอพักนักศึกษา
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-[#006663] dark:focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#006663] dark:bg-teal-700 hover:bg-[#004e4b] text-white font-semibold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact & Address Card */}
      <div className="bg-white dark:bg-[#111C24] rounded-3xl p-6 border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Phone className="w-5 h-5 text-[#006663] dark:text-teal-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">ข้อมูลการติดต่อและที่อยู่</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <div className="text-slate-400 dark:text-slate-500 font-medium">เบอร์โทรศัพท์</div>
              <div className="font-bold text-slate-800 dark:text-slate-100 font-mono">{currentUser.phone || '089-765-4321'}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5" />
            <div>
              <div className="text-slate-400 dark:text-slate-500 font-medium">อีเมลสถาบัน</div>
              <div className="font-bold text-slate-800 dark:text-slate-100 font-mono">{currentUser.email}</div>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 dark:text-slate-500 font-medium">ที่อยู่ / หอพักปัจจุบัน</div>
              <div className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentUser.address || 'หอพักนักศึกษา อาคาร 7C มหาวิทยาลัยอุบลราชธานี อ.วารินชำราบ จ.อุบลราชธานี 34190'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Details */}
        <div className="bg-white dark:bg-[#111C24] rounded-3xl p-6 border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">ข้อมูลด้านการศึกษา</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">เกรดเฉลี่ยสะสม (GPAX):</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{currentUser.gpa}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">หน่วยกิตสะสมที่ผ่านแล้ว:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{currentUser.credits_completed} หน่วยกิต</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">ภาคการศึกษาปัจจุบัน:</span>
              <span className="font-bold text-[#006663] dark:text-teal-400">{currentUser.semester}/{currentUser.academic_year}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">หน่วยกิตที่วางแผนเทอมนี้:</span>
              <span className="font-bold text-[#F07C00]">{totalCredits} หน่วยกิต</span>
            </div>
          </div>
        </div>

        {/* Advisor Details */}
        <div className="bg-white dark:bg-[#111C24] rounded-3xl p-6 border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-[#006663] dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">อาจารย์ที่ปรึกษา (Advisor)</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                {currentUser.advisor_name}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                อาจารย์ประจำสาขาวิชาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล
              </div>
              <div className="text-[#006663] dark:text-teal-400 font-mono pt-1">
                อีเมล: {currentUser.advisor_email || 'advisor@ubu.ac.th'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#E6F4F1]/60 dark:bg-teal-950/40 border border-[#D1EAE5] dark:border-teal-800/60 text-[#006663] dark:text-teal-300 text-xs">
              คำแนะนำ: สามารถนัดหมายอาจารย์ที่ปรึกษาเพื่อรับการอนุมัติแผนการลงทะเบียนเรียนผ่านระบบได้
            </div>
          </div>
        </div>
      </div>

      {/* Passed Courses Transcript History (Prerequisite basis) */}
      <div className="bg-white dark:bg-[#111C24] rounded-3xl p-6 border border-[#D1EAE5] dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#006663] dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              ประวัติการสอบผ่านวิชาบังคับก่อน (Prerequisite Status)
            </h3>
          </div>
          <span className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
            สถานะผ่าน {passedCourses ? passedCourses.length : 0} รายวิชา
          </span>
        </div>

        {passedCoursesDetails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {passedCoursesDetails.map((course) => (
              <div
                key={course.course_id}
                className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/30 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="font-mono text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    {course.course_id}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {course.course_name_th}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Grade: A
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
            ยังไม่มีประวัติรายวิชาที่เรียนผ่าน (นักศึกษาใหม่ภาคการศึกษาแรก)
          </div>
        )}
      </div>
    </div>
  );
}
