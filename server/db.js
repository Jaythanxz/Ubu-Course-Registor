import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import mysql from 'mysql2/promise';
import {
  SEED_CAREER_TRACKS,
  SEED_COURSES,
  SEED_SECTIONS,
  SEED_PREREQUISITES,
  SEED_USERS,
  SEED_REVIEWS
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const jsonDbPath = path.join(dbDir, 'db.json');

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
const MYSQL_URL = process.env.MYSQL_URL || (DATABASE_URL.startsWith('mysql://') ? DATABASE_URL : '');

let dbType = 'json'; // 'postgres' | 'mysql' | 'json'
let pgPool = null;
let mysqlPool = null;

if (DATABASE_URL && (DATABASE_URL.startsWith('postgres://') || DATABASE_URL.startsWith('postgresql://'))) {
  dbType = 'postgres';
  pgPool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });
  console.log('📦 Database driver: PostgreSQL (Connected via DATABASE_URL)');
} else if (MYSQL_URL) {
  dbType = 'mysql';
  mysqlPool = mysql.createPool(MYSQL_URL);
  console.log('📦 Database driver: MySQL (Connected via MYSQL_URL)');
} else {
  dbType = 'json';
  console.log('📦 Database driver: Embedded File Store (server/data/db.json) - Ready for Render standalone deployment');
}

// JSON Database Helpers
function readJsonDb() {
  if (!fs.existsSync(jsonDbPath)) {
    const initial = {
      users: [],
      courses: SEED_COURSES,
      course_sections: SEED_SECTIONS,
      course_prerequisites: SEED_PREREQUISITES,
      career_tracks: SEED_CAREER_TRACKS,
      course_reviews: SEED_REVIEWS,
      student_assessments: [],
      enrollments: [
        { student_id: '67114640285', section_id: 101, academic_year: '2569', semester: 1 },
        { student_id: '67114640285', section_id: 201, academic_year: '2569', semester: 1 }
      ]
    };
    // Seed initial users with hashed passwords
    initial.users = SEED_USERS.map(u => ({
      ...u,
      password_hash: bcrypt.hashSync(u.password, 10)
    }));
    fs.writeFileSync(jsonDbPath, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const content = fs.readFileSync(jsonDbPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading json db:', err);
    return { users: [], courses: [], course_sections: [], course_reviews: [], enrollments: [] };
  }
}

function writeJsonDb(data) {
  fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Initialize tables if PostgreSQL or MySQL is used
export async function initDb() {
  if (dbType === 'postgres') {
    try {
      const client = await pgPool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS career_tracks (
            track_id SERIAL PRIMARY KEY,
            track_name VARCHAR(150) NOT NULL,
            description TEXT,
            icon_name VARCHAR(50),
            peer_count INT DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS users (
            student_id VARCHAR(20) PRIMARY KEY,
            first_name_th VARCHAR(100) NOT NULL,
            last_name_th VARCHAR(100) NOT NULL,
            first_name_en VARCHAR(100),
            last_name_en VARCHAR(100),
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            faculty VARCHAR(150),
            department VARCHAR(150),
            advisor_name VARCHAR(150),
            gpa DECIMAL(3, 2) DEFAULT 0.00,
            credits_completed INT DEFAULT 0,
            career_track_id INT REFERENCES career_tracks(track_id) ON DELETE SET NULL,
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS courses (
            course_id VARCHAR(15) PRIMARY KEY,
            course_name_th VARCHAR(150) NOT NULL,
            course_name_en VARCHAR(150) NOT NULL,
            credits INT NOT NULL DEFAULT 3,
            workload_score INT DEFAULT 3,
            career_track_id INT REFERENCES career_tracks(track_id) ON DELETE SET NULL,
            category VARCHAR(100) DEFAULT 'Track Elective',
            description TEXT
          );

          CREATE TABLE IF NOT EXISTS course_sections (
            section_id INT PRIMARY KEY,
            course_id VARCHAR(15) REFERENCES courses(course_id) ON DELETE CASCADE,
            section_no VARCHAR(10) NOT NULL,
            day_of_week VARCHAR(10) NOT NULL,
            start_time VARCHAR(20) NOT NULL,
            end_time VARCHAR(20) NOT NULL,
            room VARCHAR(50),
            lecturer VARCHAR(100),
            max_seats INT DEFAULT 40,
            enrolled_seats INT DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS course_reviews (
            review_id SERIAL PRIMARY KEY,
            course_id VARCHAR(15) NOT NULL,
            course_name_th VARCHAR(150),
            student_id VARCHAR(20) NOT NULL,
            student_email VARCHAR(150),
            rating INT DEFAULT 5,
            project_heavy BOOLEAN DEFAULT FALSE,
            exam_heavy BOOLEAN DEFAULT FALSE,
            homework_level VARCHAR(20) DEFAULT 'medium',
            comment_text TEXT NOT NULL,
            likes INT DEFAULT 0,
            created_at VARCHAR(30)
          );

          CREATE TABLE IF NOT EXISTS enrollments (
            enrollment_id SERIAL PRIMARY KEY,
            student_id VARCHAR(20) NOT NULL,
            section_id INT NOT NULL,
            academic_year VARCHAR(10) DEFAULT '2569',
            semester INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Check if users table is empty, seed if needed
        const res = await client.query('SELECT COUNT(*) FROM users');
        if (parseInt(res.rows[0].count, 10) === 0) {
          console.log('🌱 Seeding default PostgreSQL data...');
          for (const track of SEED_CAREER_TRACKS) {
            await client.query(
              'INSERT INTO career_tracks (track_id, track_name, description, icon_name, peer_count) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (track_id) DO NOTHING',
              [track.track_id, track.track_name, track.description, track.icon_name, track.peer_count]
            );
          }

          for (const user of SEED_USERS) {
            const hash = await bcrypt.hash(user.password, 10);
            await client.query(
              `INSERT INTO users (student_id, first_name_th, last_name_th, first_name_en, last_name_en, email, password_hash, faculty, department, advisor_name, gpa, credits_completed, career_track_id)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
              [user.student_id, user.first_name_th, user.last_name_th, user.first_name_en, user.last_name_en, user.email, hash, user.faculty, user.department, user.advisor_name, user.gpa, user.credits_completed, user.career_track_id]
            );
          }

          for (const c of SEED_COURSES) {
            await client.query(
              `INSERT INTO courses (course_id, course_name_th, course_name_en, credits, workload_score, career_track_id, category, description)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (course_id) DO NOTHING`,
              [c.course_id, c.course_name_th, c.course_name_en, c.credits, c.workload_score, c.career_track_id, c.category, c.description]
            );
          }

          for (const sec of SEED_SECTIONS) {
            await client.query(
              `INSERT INTO course_sections (section_id, course_id, section_no, day_of_week, start_time, end_time, room, lecturer, max_seats, enrolled_seats)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (section_id) DO NOTHING`,
              [sec.section_id, sec.course_id, sec.section_no, sec.day_of_week, sec.start_time, sec.end_time, sec.room, sec.lecturer, sec.max_seats, sec.enrolled_seats]
            );
          }

          for (const rev of SEED_REVIEWS) {
            await client.query(
              `INSERT INTO course_reviews (course_id, course_name_th, student_id, student_email, rating, project_heavy, exam_heavy, homework_level, comment_text, likes, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
              [rev.course_id, rev.course_name_th, rev.student_id, rev.student_email, rev.rating, rev.project_heavy, rev.exam_heavy, rev.homework_level, rev.comment_text, rev.likes, rev.created_at]
            );
          }
          console.log('✅ PostgreSQL seeded successfully.');
        }
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Postgres init error (falling back to json store):', err.message);
      dbType = 'json';
      readJsonDb();
    }
  } else {
    // JSON file store initialization
    readJsonDb();
  }
}

// User CRUD operations
export async function getUserByStudentId(studentId) {
  if (dbType === 'postgres') {
    const res = await pgPool.query('SELECT * FROM users WHERE student_id = $1', [studentId]);
    return res.rows[0] || null;
  }
  const db = readJsonDb();
  return db.users.find(u => u.student_id === studentId) || null;
}

export async function getUserByEmail(email) {
  if (dbType === 'postgres') {
    const res = await pgPool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    return res.rows[0] || null;
  }
  const db = readJsonDb();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(userData) {
  const hash = await bcrypt.hash(userData.password, 10);
  const newUser = {
    student_id: userData.student_id,
    first_name_th: userData.first_name_th || '',
    last_name_th: userData.last_name_th || '',
    first_name_en: userData.first_name_en || '',
    last_name_en: userData.last_name_en || '',
    email: userData.email,
    password_hash: hash,
    faculty: userData.faculty || 'คณะวิทยาศาสตร์ (Faculty of Science)',
    department: userData.department || 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล',
    advisor_name: userData.advisor_name || 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์',
    gpa: userData.gpa ? Number(userData.gpa) : 3.50,
    credits_completed: userData.credits_completed ? Number(userData.credits_completed) : 0,
    career_track_id: userData.career_track_id ? Number(userData.career_track_id) : 1,
    avatar_url: userData.avatar_url || '',
    created_at: new Date().toISOString()
  };

  if (dbType === 'postgres') {
    await pgPool.query(
      `INSERT INTO users (student_id, first_name_th, last_name_th, first_name_en, last_name_en, email, password_hash, faculty, department, advisor_name, gpa, credits_completed, career_track_id, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [newUser.student_id, newUser.first_name_th, newUser.last_name_th, newUser.first_name_en, newUser.last_name_en, newUser.email, newUser.password_hash, newUser.faculty, newUser.department, newUser.advisor_name, newUser.gpa, newUser.credits_completed, newUser.career_track_id, newUser.avatar_url]
    );
    return newUser;
  }

  const db = readJsonDb();
  db.users.push(newUser);
  writeJsonDb(db);
  return newUser;
}

export async function updateUser(studentId, updateFields) {
  if (dbType === 'postgres') {
    const keys = Object.keys(updateFields).filter(k => k !== 'student_id');
    if (keys.length === 0) return getUserByStudentId(studentId);
    const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const values = [studentId, ...keys.map(k => updateFields[k])];
    await pgPool.query(`UPDATE users SET ${setClause} WHERE student_id = $1`, values);
    return getUserByStudentId(studentId);
  }

  const db = readJsonDb();
  const idx = db.users.findIndex(u => u.student_id === studentId);
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...updateFields };
    writeJsonDb(db);
    return db.users[idx];
  }
  return null;
}

// Courses & Sections
export async function getAllCourses() {
  if (dbType === 'postgres') {
    const res = await pgPool.query('SELECT * FROM courses ORDER BY course_id');
    return res.rows;
  }
  const db = readJsonDb();
  return db.courses;
}

export async function getAllSections() {
  if (dbType === 'postgres') {
    const res = await pgPool.query('SELECT * FROM course_sections ORDER BY section_id');
    return res.rows;
  }
  const db = readJsonDb();
  return db.course_sections;
}

export async function getAllReviews() {
  if (dbType === 'postgres') {
    const res = await pgPool.query('SELECT * FROM course_reviews ORDER BY review_id DESC');
    return res.rows;
  }
  const db = readJsonDb();
  return db.course_reviews;
}

export async function addReview(reviewData) {
  const newReview = {
    ...reviewData,
    likes: 0,
    created_at: new Date().toISOString().split('T')[0]
  };

  if (dbType === 'postgres') {
    const res = await pgPool.query(
      `INSERT INTO course_reviews (course_id, course_name_th, student_id, student_email, rating, project_heavy, exam_heavy, homework_level, comment_text, likes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [newReview.course_id, newReview.course_name_th, newReview.student_id, newReview.student_email, newReview.rating, newReview.project_heavy, newReview.exam_heavy, newReview.homework_level, newReview.comment_text, newReview.likes, newReview.created_at]
    );
    return res.rows[0];
  }

  const db = readJsonDb();
  newReview.review_id = Date.now();
  db.course_reviews.unshift(newReview);
  writeJsonDb(db);
  return newReview;
}

export async function getEnrollments(studentId) {
  if (dbType === 'postgres') {
    const res = await pgPool.query('SELECT * FROM enrollments WHERE student_id = $1', [studentId]);
    return res.rows.map(r => r.section_id);
  }
  const db = readJsonDb();
  return db.enrollments.filter(e => e.student_id === studentId).map(e => e.section_id);
}

export async function saveEnrollments(studentId, sectionIds) {
  if (dbType === 'postgres') {
    await pgPool.query('DELETE FROM enrollments WHERE student_id = $1', [studentId]);
    for (const secId of sectionIds) {
      await pgPool.query('INSERT INTO enrollments (student_id, section_id) VALUES ($1, $2)', [studentId, secId]);
    }
    return sectionIds;
  }

  const db = readJsonDb();
  db.enrollments = db.enrollments.filter(e => e.student_id !== studentId);
  for (const secId of sectionIds) {
    db.enrollments.push({ student_id: studentId, section_id: secId, academic_year: '2569', semester: 1 });
  }
  writeJsonDb(db);
  return sectionIds;
}

// Assessment Per User
export async function getAssessment(studentId) {
  if (dbType === 'postgres') {
    const res = await pgPool.query('SELECT * FROM student_assessments WHERE student_id = $1 ORDER BY assessment_id DESC LIMIT 1', [studentId]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      completed: true,
      answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : (row.answers || {}),
      recommendedTrackId: row.recommended_track_id,
      recommendedCourseIds: typeof row.recommended_course_ids === 'string' ? JSON.parse(row.recommended_course_ids) : (row.recommended_course_ids || [])
    };
  }
  const db = readJsonDb();
  if (!db.student_assessments) db.student_assessments = [];
  return db.student_assessments.find(a => a.student_id === studentId) || null;
}

export async function saveAssessment(studentId, assessmentData) {
  const record = {
    student_id: studentId,
    completed: true,
    answers: assessmentData.answers || {},
    recommendedTrackId: assessmentData.recommendedTrackId || 1,
    recommendedCourseIds: assessmentData.recommendedCourseIds || [],
    created_at: new Date().toISOString()
  };

  if (dbType === 'postgres') {
    await pgPool.query('DELETE FROM student_assessments WHERE student_id = $1', [studentId]);
    await pgPool.query(
      `INSERT INTO student_assessments (student_id, answers, recommended_track_id, recommended_course_ids, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [studentId, JSON.stringify(record.answers), record.recommendedTrackId, JSON.stringify(record.recommendedCourseIds), record.created_at]
    );
    return record;
  }

  const db = readJsonDb();
  if (!db.student_assessments) db.student_assessments = [];
  db.student_assessments = db.student_assessments.filter(a => a.student_id !== studentId);
  db.student_assessments.push(record);
  writeJsonDb(db);
  return record;
}

// Passed Courses & Grades Per User
export async function getPassedCourses(studentId) {
  const db = readJsonDb();
  if (!db.passed_courses) db.passed_courses = {};
  // If user has specific passed courses saved
  if (db.passed_courses[studentId]) {
    return db.passed_courses[studentId];
  }
  // Default for first demo user 67114640285, empty for newly registered students
  if (studentId === '67114640285') {
    return ['1146101', '1146102', '1146201', '0041001'];
  }
  return [];
}

export async function savePassedCourses(studentId, courseIds) {
  const db = readJsonDb();
  if (!db.passed_courses) db.passed_courses = {};
  db.passed_courses[studentId] = courseIds;
  writeJsonDb(db);
  return courseIds;
}
