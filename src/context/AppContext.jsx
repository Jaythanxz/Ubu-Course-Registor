import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_USER,
  CAREER_TRACKS,
  COURSES,
  COURSE_PREREQUISITES,
  COURSE_SECTIONS,
  STUDENT_PASSED_COURSES,
  INITIAL_REVIEWS,
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. User / Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ubu_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ubu_auth') === 'true';
  });

  // 2. Passed Courses History (Per user)
  const [passedCourses, setPassedCourses] = useState(() => {
    const saved = localStorage.getItem('ubu_passed_courses');
    return saved ? JSON.parse(saved) : STUDENT_PASSED_COURSES;
  });

  // 3. Planned Enrollments (Array of section_ids per user)
  const [enrolledSectionIds, setEnrolledSectionIds] = useState(() => {
    const saved = localStorage.getItem('ubu_enrolled_sections');
    return saved ? JSON.parse(saved) : [101, 201];
  });

  // 4. Assessment Results (Per user)
  const [assessmentData, setAssessmentData] = useState(() => {
    const saved = localStorage.getItem('ubu_assessment');
    return saved
      ? JSON.parse(saved)
      : {
          completed: false,
          answers: {},
          recommendedTracks: [1, 2],
          recommendedCourseIds: ['1146311', '1146331', '1146362'],
        };
  });

  // 5. Reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('ubu_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Theme Mode State (Site-wide)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('ubu_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ubu_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('ubu_user', JSON.stringify(currentUser));
    localStorage.setItem('ubu_auth', isAuthenticated ? 'true' : 'false');
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('ubu_enrolled_sections', JSON.stringify(enrolledSectionIds));
  }, [enrolledSectionIds]);

  useEffect(() => {
    localStorage.setItem('ubu_assessment', JSON.stringify(assessmentData));
  }, [assessmentData]);

  useEffect(() => {
    localStorage.setItem('ubu_passed_courses', JSON.stringify(passedCourses));
  }, [passedCourses]);

  useEffect(() => {
    localStorage.setItem('ubu_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Load all user-specific data from Database
  const loadUserData = useCallback(async (token, studentId) => {
    if (!token) return;
    const authHeaders = { 'Authorization': `Bearer ${token}` };

    try {
      // 1. Fetch Fresh User Profile from DB
      const meRes = await fetch('/api/auth/me', { headers: authHeaders });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.success && meData.user) {
          setCurrentUser(meData.user);
        }
      }

      // 2. Fetch Enrollments from DB
      const enrollRes = await fetch('/api/enrollments', { headers: authHeaders });
      if (enrollRes.ok) {
        const eData = await enrollRes.json();
        if (eData.success && Array.isArray(eData.sectionIds)) {
          setEnrolledSectionIds(eData.sectionIds);
        }
      }

      // 3. Fetch Assessment from DB
      const assessRes = await fetch('/api/assessment', { headers: authHeaders });
      if (assessRes.ok) {
        const aData = await assessRes.json();
        if (aData.success && aData.assessment) {
          setAssessmentData(aData.assessment);
        } else {
          setAssessmentData({
            completed: false,
            answers: {},
            recommendedTracks: [1],
            recommendedCourseIds: [],
          });
        }
      }

      // 4. Fetch Passed Courses from DB
      const passedRes = await fetch('/api/passed-courses', { headers: authHeaders });
      if (passedRes.ok) {
        const pData = await passedRes.json();
        if (pData.success && Array.isArray(pData.passedCourses)) {
          setPassedCourses(pData.passedCourses);
        }
      }
    } catch (err) {
      console.warn('Backend sync error (offline or network):', err);
    }
  }, []);

  // Initial mount: load data from DB if token is present
  useEffect(() => {
    const token = localStorage.getItem('ubu_token');
    if (token && isAuthenticated) {
      loadUserData(token, currentUser?.student_id);
    }
  }, [loadUserData]);

  // LOGIN
  const login = async (studentId, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: studentId, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) localStorage.setItem('ubu_token', data.token);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        // Load user-specific database records
        await loadUserData(data.token, data.user.student_id);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'เข้าสู่ระบบไม่สำเร็จ' };
    } catch (err) {
      // Offline fallback
      setIsAuthenticated(true);
      if (studentId) {
        setCurrentUser(prev => ({
          ...prev,
          student_id: studentId,
        }));
      }
      return { success: true, message: 'เข้าสู่ระบบสำเร็จ' };
    }
  };

  // REGISTER (Supports minimal Student ID & Password, other fields set to friendly defaults)
  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) localStorage.setItem('ubu_token', data.token);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        // Reset state for newly registered user
        setEnrolledSectionIds([]);
        setPassedCourses([]);
        setAssessmentData({
          completed: false,
          answers: {},
          recommendedTracks: [1],
          recommendedCourseIds: [],
        });
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'สมัครสมาชิกไม่สำเร็จ' };
    } catch (err) {
      // Local fallback
      const cleanId = userData.student_id.trim();
      const newUser = {
        ...INITIAL_USER,
        ...userData,
        student_id: cleanId,
        first_name_th: userData.first_name_th || 'นักศึกษา',
        last_name_th: userData.last_name_th || cleanId,
        first_name_en: userData.first_name_en || 'Student',
        last_name_en: userData.last_name_en || cleanId,
        email: userData.email || `${cleanId}@ubu.ac.th`,
        faculty: userData.faculty || 'คณะวิทยาศาสตร์ (Faculty of Science)',
        department: userData.department || 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล',
        advisor_name: userData.advisor_name || 'ยังไม่ระบุอาจารย์ที่ปรึกษา',
      };
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setEnrolledSectionIds([]);
      setPassedCourses([]);
      return { success: true, message: 'สมัครสมาชิกสำเร็จ' };
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('ubu_token');
    localStorage.removeItem('ubu_user');
    localStorage.removeItem('ubu_auth');
    localStorage.removeItem('ubu_enrolled_sections');
    localStorage.removeItem('ubu_assessment');
    localStorage.removeItem('ubu_passed_courses');
    setIsAuthenticated(false);
    setCurrentUser(INITIAL_USER);
    setEnrolledSectionIds([]);
    setPassedCourses([]);
    setAssessmentData({
      completed: false,
      answers: {},
      recommendedTracks: [1, 2],
      recommendedCourseIds: [],
    });
  };

  // UPDATE PROFILE (Save to DB & Context)
  const updateUserProfile = async (updatedData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedData,
    }));

    try {
      const token = localStorage.getItem('ubu_token');
      if (token) {
        await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        });
      }
    } catch (err) {
      console.warn('Failed to persist profile update to DB:', err);
    }
    return true;
  };

  // UPDATE AVATAR (Save to DB & Context)
  const updateAvatar = async (avatarUrl) => {
    setCurrentUser(prev => ({
      ...prev,
      avatar_url: avatarUrl,
    }));

    try {
      const token = localStorage.getItem('ubu_token');
      if (token) {
        await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ avatar_url: avatarUrl })
        });
      }
    } catch (err) {
      console.warn('Failed to persist avatar update to DB:', err);
    }
    return true;
  };

  // SYNC ENROLLMENTS TO DATABASE
  const syncEnrollmentsToDb = async (newSectionIds) => {
    try {
      const token = localStorage.getItem('ubu_token');
      if (token) {
        await fetch('/api/enrollments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sectionIds: newSectionIds })
        });
      }
    } catch (err) {
      console.warn('Failed to persist enrollments to DB:', err);
    }
  };

  // SYNC ASSESSMENT TO DATABASE
  const updateAssessment = async (newAssessment) => {
    setAssessmentData(newAssessment);
    try {
      const token = localStorage.getItem('ubu_token');
      if (token) {
        await fetch('/api/assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newAssessment)
        });
      }
    } catch (err) {
      console.warn('Failed to persist assessment to DB:', err);
    }
  };

  // SYNC PASSED COURSES TO DATABASE
  const updatePassedCourses = async (newPassed) => {
    setPassedCourses(newPassed);
    try {
      const token = localStorage.getItem('ubu_token');
      if (token) {
        await fetch('/api/passed-courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ passedCourses: newPassed })
        });
      }
    } catch (err) {
      console.warn('Failed to persist passed courses to DB:', err);
    }
  };

  // ADD REVIEW (Save to DB & Context)
  const addReview = async (newReview) => {
    const reviewWithMeta = {
      ...newReview,
      review_id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    setReviews(prev => [reviewWithMeta, ...prev]);

    try {
      const token = localStorage.getItem('ubu_token');
      if (token) {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reviewWithMeta)
        });
      }
    } catch (err) {
      console.warn('Failed to persist review to DB:', err);
    }
  };

  // Get enrolled sections with course details
  const getEnrolledSectionsDetails = () => {
    return enrolledSectionIds
      .map(secId => {
        const sec = COURSE_SECTIONS.find(s => s.section_id === secId);
        if (!sec) return null;
        const course = COURSES.find(c => c.course_id === sec.course_id);
        return {
          ...sec,
          course,
        };
      })
      .filter(Boolean);
  };

  // Check Prerequisite
  const checkPrerequisites = (courseId) => {
    const prerequisites = COURSE_PREREQUISITES.filter(p => p.course_id === courseId);
    if (prerequisites.length === 0) return { passed: true };

    const missing = [];
    for (const prereq of prerequisites) {
      if (!passedCourses.includes(prereq.prerequisite_course_id)) {
        const reqCourse = COURSES.find(c => c.course_id === prereq.prerequisite_course_id);
        missing.push(reqCourse || { course_id: prereq.prerequisite_course_id, course_name_th: prereq.prerequisite_course_id });
      }
    }

    if (missing.length > 0) {
      return {
        passed: false,
        missingCourses: missing,
      };
    }
    return { passed: true };
  };

  function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  // Check Time Clash
  const checkTimeClash = (newSection) => {
    const currentSections = getEnrolledSectionsDetails();

    for (const sec of currentSections) {
      // If same course but different section, already enrolled
      if (sec.course_id === newSection.course_id && sec.section_id !== newSection.section_id) {
        return {
          clash: true,
          reason: `คุณได้ลงทะเบียนวิชานี้ในตอนเรียนอื่นแล้ว (${sec.course_id} Sec ${sec.section_no})`,
        };
      }

      // Check day and time overlap
      if (sec.day_of_week === newSection.day_of_week) {
        const startExisting = timeToMinutes(sec.start_time);
        const endExisting = timeToMinutes(sec.end_time);
        const startNew = timeToMinutes(newSection.start_time);
        const endNew = timeToMinutes(newSection.end_time);

        // Overlap logic: max(start1, start2) < min(end1, end2)
        if (Math.max(startExisting, startNew) < Math.min(endExisting, endNew)) {
          return {
            clash: true,
            conflictingSection: sec,
            reason: `เวลาเรียนตรงกับวิชา ${sec.course.course_name_th} (${sec.day_of_week} ${sec.start_time} - ${sec.end_time})`,
          };
        }
      }
    }
    return { clash: false };
  };

  // Workload and Credits calculation
  const enrolledSections = getEnrolledSectionsDetails();
  const totalCredits = enrolledSections.reduce((sum, item) => sum + (item.course?.credits || 0), 0);
  const heavyCourses = enrolledSections.filter(item => (item.course?.workload_score || 0) >= 4);
  const isWorkloadHigh = heavyCourses.length >= 3;
  const averageWorkload = enrolledSections.length > 0
    ? (enrolledSections.reduce((sum, item) => sum + (item.course?.workload_score || 0), 0) / enrolledSections.length).toFixed(1)
    : 0;

  // Add course section to planner (Auto syncs to DB)
  const enrollSection = (sectionId) => {
    const targetSection = COURSE_SECTIONS.find(s => s.section_id === sectionId);
    if (!targetSection) return { success: false, message: 'ไม่พบข้อมูลตอนเรียน' };

    // 1. Check prerequisite
    const prereqCheck = checkPrerequisites(targetSection.course_id);
    if (!prereqCheck.passed) {
      const missingNames = prereqCheck.missingCourses.map(c => `${c.course_id} ${c.course_name_th}`).join(', ');
      return {
        success: false,
        type: 'prerequisite',
        message: `ไม่สามารถลงทะเบียนได้: คุณยังไม่ผ่านวิชาบังคับก่อน ได้แก่ [${missingNames}]`,
      };
    }

    // 2. Check time clash
    const clashCheck = checkTimeClash(targetSection);
    if (clashCheck.clash) {
      return {
        success: false,
        type: 'time_clash',
        message: `ตารางเรียนชนกัน: ${clashCheck.reason}`,
      };
    }

    // 3. Add to enrolled and persist to DB
    if (!enrolledSectionIds.includes(sectionId)) {
      const updated = [...enrolledSectionIds, sectionId];
      setEnrolledSectionIds(updated);
      syncEnrollmentsToDb(updated);
    }

    return {
      success: true,
      message: 'เพิ่มรายวิชาเข้าสู่แผนการเรียนสำเร็จ',
    };
  };

  // Remove course section from planner (Auto syncs to DB)
  const unenrollSection = (sectionId) => {
    const updated = enrolledSectionIds.filter(id => id !== sectionId);
    setEnrolledSectionIds(updated);
    syncEnrollmentsToDb(updated);
  };

  const value = {
    currentUser,
    setCurrentUser,
    updateUserProfile,
    updateAvatar,
    isAuthenticated,
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
    login,
    register,
    logout,
    careerTracks: CAREER_TRACKS,
    courses: COURSES,
    courseSections: COURSE_SECTIONS,
    passedCourses,
    setPassedCourses: updatePassedCourses,
    updatePassedCourses,
    enrolledSectionIds,
    enrolledSections,
    totalCredits,
    heavyCourses,
    isWorkloadHigh,
    averageWorkload,
    enrollSection,
    unenrollSection,
    checkPrerequisites,
    checkTimeClash,
    assessmentData,
    setAssessmentData: updateAssessment,
    updateAssessment,
    reviews,
    addReview,
    loadUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
