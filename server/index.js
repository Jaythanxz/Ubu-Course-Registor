import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {
  initDb,
  getUserByStudentId,
  getUserByEmail,
  createUser,
  updateUser,
  getAllCourses,
  getAllSections,
  getAllReviews,
  addReview,
  getEnrollments,
  saveEnrollments,
  getAssessment,
  saveAssessment,
  getPassedCourses,
  savePassedCourses
} from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ubu_registration_secret_key_2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth Token Verification Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
    req.user = decoded;
    next();
  });
}

// 1. SIGN UP (สมัครบัญชีนักศึกษาใหม่ - ใช้แค่รหัสนักศึกษาและรหัสผ่าน)
app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      student_id,
      password,
      first_name_th,
      last_name_th,
      first_name_en,
      last_name_en,
      email,
      faculty,
      department,
      advisor_name,
      phone,
      address
    } = req.body;

    if (!student_id || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกรหัสนักศึกษาและรหัสผ่าน'
      });
    }

    const cleanStudentId = student_id.toString().trim();
    if (cleanStudentId.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'รหัสนักศึกษาต้องมีความยาวอย่างน้อย 5 ตัวอักษร'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
      });
    }

    // Check existing student_id
    const existingById = await getUserByStudentId(cleanStudentId);
    if (existingById) {
      return res.status(409).json({
        success: false,
        message: `รหัสนักศึกษา ${cleanStudentId} มีในระบบแล้ว กรุณาเข้าสู่ระบบหรือใช้รหัสอื่น`
      });
    }

    // Default values for fields that can be edited later in profile
    const cleanEmail = (email && email.trim()) 
      ? email.trim().toLowerCase() 
      : `${cleanStudentId}@ubu.ac.th`;

    const existingByEmail = await getUserByEmail(cleanEmail);
    if (existingByEmail && existingByEmail.student_id !== cleanStudentId) {
      return res.status(409).json({
        success: false,
        message: `อีเมล ${cleanEmail} ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น`
      });
    }

    // Create user in database with defaults
    const newUser = await createUser({
      student_id: cleanStudentId,
      password,
      first_name_th: (first_name_th && first_name_th.trim()) || 'นักศึกษา',
      last_name_th: (last_name_th && last_name_th.trim()) || cleanStudentId,
      first_name_en: (first_name_en && first_name_en.trim()) || 'Student',
      last_name_en: (last_name_en && last_name_en.trim()) || cleanStudentId,
      email: cleanEmail,
      faculty: faculty || 'คณะวิทยาศาสตร์ (Faculty of Science)',
      department: department || 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล',
      advisor_name: advisor_name || 'ยังไม่ระบุอาจารย์ที่ปรึกษา',
      phone: phone || '08X-XXX-XXXX',
      address: address || 'มหาวิทยาลัยอุบลราชธานี อ.วารินชำราบ จ.อุบลราชธานี 34190',
      gpa: 3.50,
      credits_completed: 0,
      career_track_id: 1,
      avatar_url: ''
    });

    // Generate JWT
    const token = jwt.sign(
      { student_id: newUser.student_id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Strip password hash from response
    const { password_hash, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ระบบ UBU Smart Registration',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก โปรดลองใหม่อีกครั้ง' });
  }
});

// 2. SIGN IN (เข้าสู่ระบบ)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกรหัสนักศึกษาและรหัสผ่าน' });
    }

    const cleanUsername = username.trim();
    let user = await getUserByStudentId(cleanUsername);
    if (!user) {
      user = await getUserByEmail(cleanUsername);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'ไม่พบชื่อผู้ใช้หรือรหัสนักศึกษานี้ในระบบ' });
    }

    // Password comparison (fallback to plaintext if mock not hashed)
    let isMatch = false;
    if (user.password_hash) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    }
    if (!isMatch && user.password && user.password === password) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' });
    }

    const token = jwt.sign(
      { student_id: user.student_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});

// 3. GET CURRENT USER PROFILE
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserByStudentId(req.user.student_id);
    if (!user) return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' });
    const { password_hash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// 4. UPDATE USER PROFILE
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const updated = await updateUser(req.user.student_id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'ไม่สามารถอัปเดตข้อมูลได้' });
    const { password_hash, ...safeUser } = updated;
    res.json({ success: true, message: 'บันทึกข้อมูลเรียบร้อย', user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});

// 5. COURSES & SECTIONS API
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await getAllCourses();
    const sections = await getAllSections();
    res.json({ success: true, courses, sections });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ดึงข้อมูลวิชาไม่สำเร็จ' });
  }
});

// 6. REVIEWS API
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ดึงข้อมูลรีวิวไม่สำเร็จ' });
  }
});

app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const newRev = await addReview({
      ...req.body,
      student_id: req.user.student_id
    });
    res.status(201).json({ success: true, review: newRev });
  } catch (err) {
    res.status(500).json({ success: false, message: 'เพิ่มรีวิวไม่สำเร็จ' });
  }
});

// 7. ENROLLMENTS API
app.get('/api/enrollments', authenticateToken, async (req, res) => {
  try {
    const sectionIds = await getEnrollments(req.user.student_id);
    res.json({ success: true, sectionIds });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ดึงข้อมูลการลงทะเบียนไม่สำเร็จ' });
  }
});

app.post('/api/enrollments', authenticateToken, async (req, res) => {
  try {
    const { sectionIds } = req.body;
    await saveEnrollments(req.user.student_id, sectionIds || []);
    res.json({ success: true, message: 'บันทึกตารางลงทะเบียนเรียนสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'บันทึกการลงทะเบียนไม่สำเร็จ' });
  }
});

// 8. ASSESSMENT API (แบบประเมินความสนใจรายบุคคล)
app.get('/api/assessment', authenticateToken, async (req, res) => {
  try {
    const assessment = await getAssessment(req.user.student_id);
    res.json({ success: true, assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ดึงข้อมูลแบบประเมินไม่สำเร็จ' });
  }
});

app.post('/api/assessment', authenticateToken, async (req, res) => {
  try {
    const saved = await saveAssessment(req.user.student_id, req.body);
    res.json({ success: true, message: 'บันทึกผลการประเมินลงฐานข้อมูลสำเร็จ', assessment: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'บันทึกแบบประเมินไม่สำเร็จ' });
  }
});

// 9. PASSED COURSES API (รายวิชาที่เรียนผ่านแล้วรายบุคคล)
app.get('/api/passed-courses', authenticateToken, async (req, res) => {
  try {
    const passedCourses = await getPassedCourses(req.user.student_id);
    res.json({ success: true, passedCourses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ดึงข้อมูลวิชาที่ผ่านไม่สำเร็จ' });
  }
});

app.post('/api/passed-courses', authenticateToken, async (req, res) => {
  try {
    const { passedCourses } = req.body;
    const saved = await savePassedCourses(req.user.student_id, passedCourses || []);
    res.json({ success: true, message: 'บันทึกข้อมูลวิชาที่ผ่านสำเร็จ', passedCourses: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'บันทึกข้อมูลวิชาที่ผ่านไม่สำเร็จ' });
  }
});

// 10. HEALTH CHECK FOR RENDER
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'UBU Course Registration & Advisory System',
    timestamp: new Date().toISOString()
  });
});

// 9. SERVE VITE STATIC PRODUCTION FILES ON RENDER
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// START SERVER
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 UBU Registration Server running on http://localhost:${PORT}`);
    console.log(`🌐 Ready for deployment on Render.com`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  app.listen(PORT, () => {
    console.log(`🚀 UBU Registration Server running on http://localhost:${PORT} (fallback mode)`);
  });
});
