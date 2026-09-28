# 📄 SPECIFICATION DOCUMENT: UBU Course Registration & Advisory System

---

## 1. Project Overview & Objectives
ระบบเว็บแอปพลิเคชันสำหรับลงทะเบียนเรียนและแนะนำแผนการเรียนอัจฉริยะ (**Smart Course Advisory & Registration**) ของมหาวิทยาลัยอุบลราชธานี (UBU) มุ่งเน้นการแก้ปัญหาการลงทะเบียนแบบเดิม โดยนำระบบประเมินตนเอง, แผนผังสายอาชีพ (Career Roadmap), ระบบรีวิวจากรุ่นพี่ และระบบจำลองจัดตารางเรียนที่ป้องกันการลงวิชาชนกันและวิชาหนักเกินไปมาประยุกต์ใช้

---

## 2. Tech Stack Architecture
- **Frontend**: React.js (Vite / Next.js SPA), Tailwind CSS, Lucide React (Icons), React Router
- **Backend / API**: Node.js (Express.js) หรือ Next.js API Routes (RESTful API)
- **Database**: MySQL 8.x
- **ORM / Query Builder**: Prisma หรือ Sequelize หรือ Knex.js
- **Authentication**: JWT (JSON Web Tokens) จัดเก็บใน HttpOnly Cookie / LocalStorage

---

## 3. UI/UX & Design System (Based on Attached Reference)
ยึดโทนสีและการจัดวาง Layout ตามหน้า Mockup ของระบบ:

### 3.1 Color Palette
- **Primary Color**: Deep Teal / Dark Slate Green (`#0A5C5A` หรือ `#064E4D`) — สำหรับ Sidebar, ปุ่มหลัก, ส่วนหัวตาราง
- **Secondary / Accent Color**: Safety Orange (`#F07C00` หรือ `#FF7A00`) — สำหรับปุ่มออกจากระบบ, ไฮไลต์แท็บ/ขั้นตอน (Step Indicator)
- **Background Color**: Off-white / Pure White (`#F8FAFC`, `#FFFFFF`)
- **Card & Border Color**: Soft Mint / Teal Border (`#E6F4F1`, `#D1EAE5`)

### 3.2 Layout Grid
- **Left Sidebar** (คงที่ทุกหน้าหลังล็อกอิน):
  - สีเขียวเข้มพร้อมเมนู: หน้าหลัก, แนะนำจัดตาราง, ตารางเรียน, ผลการเรียน, ข้อมูลส่วนตัว
  - ปุ่มด้านล่างสุด: "ออกจากระบบ" (สีส้มเด่นชัด)
- **Main Content Area**: แสดง Header รหัสนักศึกษา + Avatar ขวาบน และส่วนแสดงผลตามแต่ละโมดูล

---

## 4. Database Schema (MySQL Architecture)

```sql
-- 1. ตารางนักศึกษา / ผู้ใช้งาน
CREATE TABLE users (
    student_id VARCHAR(15) PRIMARY KEY,      -- เช่น 67114640***
    first_name_th VARCHAR(100) NOT NULL,
    last_name_th VARCHAR(100) NOT NULL,
    first_name_en VARCHAR(100),
    last_name_en VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    faculty VARCHAR(100),
    department VARCHAR(100),
    advisor_name VARCHAR(150),
    career_track_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. สายอาชีพ (Career Tracks)
CREATE TABLE career_tracks (
    track_id INT AUTO_INCREMENT PRIMARY KEY,
    track_name VARCHAR(100) NOT NULL,        -- เช่น Network Engineer, Software Developer, Data Scientist
    description TEXT,
    icon_name VARCHAR(50)
);

-- 3. ข้อมูลวิชาเรียน (Courses)
CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,       -- เช่น 1146406
    course_name_th VARCHAR(150) NOT NULL,
    course_name_en VARCHAR(150) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    workload_score INT DEFAULT 3,            -- สเกลความหนักของวิชา 1 (เบา) - 5 (หนักมาก)
    career_track_id INT,
    FOREIGN KEY (career_track_id) REFERENCES career_tracks(track_id)
);

-- 4. วิชาบังคับก่อน (Prerequisites)
CREATE TABLE course_prerequisites (
    course_id VARCHAR(10) NOT NULL,
    prerequisite_course_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (course_id, prerequisite_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(course_id)
);

-- 5. ตอนเรียน / ตารางเวลา (Course Sections)
CREATE TABLE course_sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(10) NOT NULL,
    section_no VARCHAR(5) NOT NULL,
    day_of_week ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    max_seats INT DEFAULT 40,
    enrolled_seats INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- 6. ผลประเมินสไตล์การเรียนรู้ (Learning Style Assessment)
CREATE TABLE student_assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL,
    work_style ENUM('analytical', 'practical', 'individual', 'group') NOT NULL,
    preferred_learning ENUM('online', 'onsite', 'theory', 'lab') NOT NULL,
    interest_domain VARCHAR(100),             -- เช่น AI, Web, Game, Network, Graphic
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(student_id)
);

-- 7. ระบบรีวิวรายวิชา (Course Reviews)
CREATE TABLE course_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(10) NOT NULL,
    student_id VARCHAR(15) NOT NULL,
    project_heavy BOOLEAN DEFAULT FALSE,     -- เน้นทำโปรเจกต์?
    exam_heavy BOOLEAN DEFAULT FALSE,        -- เน้นสอบข้อเขียน?
    homework_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (student_id) REFERENCES users(student_id)
);

-- 8. การลงทะเบียน / ตารางเรียนของนักศึกษา (Enrollments & Planner)
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL,
    section_id INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    semester INT NOT NULL,
    status ENUM('planned', 'enrolled', 'passed', 'failed') DEFAULT 'planned',
    FOREIGN KEY (student_id) REFERENCES users(student_id),
    FOREIGN KEY (section_id) REFERENCES course_sections(section_id)
);
```

---

## 5. Detailed Feature Specifications

### 5.1 ระบบล็อกอิน & ข้อมูลส่วนตัว (Auth & Profile)
- **Login Page**: โทนสีเขียว มินิมอล พร้อมกราฟิกภูเขาสีเขียวเข้มด้านล่าง ฟอร์มล็อกอินรองรับ username และ password พร้อม Checkbox "Remember me" และปุ่มล็อกอินสีเขียวเข้มขอบมน
- **Profile Page**: แสดงข้อมูลนักศึกษา รูปโปรไฟล์ ข้อมูลอาจารย์ที่ปรึกษา คณะ สาขา เบอร์ติดต่อ และสถานะปัจจุบัน (กำลังศึกษา)

### 5.2 แบบประเมินสไตล์การเรียน (Learning Style & Assessment)
- **Quiz Interface (5 ข้อสั้นๆ)**:
  - ด้านที่สนใจเป็นพิเศษ (Tags เลือกได้: โปรแกรมมิ่ง, Web, UX/UI, เครือข่าย, AI, เกม, ดาต้า, กราฟิก)
  - รูปแบบการเรียน (ทฤษฎี / ลงมือปฏิบัติ / ออนไลน์ / ผสมผสาน)
  - สไตล์การทำงาน (คิดวิเคราะห์เดี่ยว / เน้นลงมือทำเดี่ยว / ทำงานกลุ่มแลกเปลี่ยน)
  - ปัจจัยสำคัญ (เวลาเรียน / เนื้อหา / อาจารย์ผู้สอน)
- **ผลการวิเคราะห์**:
  - สรุปทักษะเด่น (Core Strengths)
  - แนะนำกลุ่มรายวิชาที่ตรงใจ พร้อม Tag บอกเหตุผล เช่น `[ด้านที่สนใจ]`, `[รูปแบบการเรียน]`, `[สิ่งที่ให้ความสำคัญ]`

### 5.3 Roadmap สายอาชีพ & Social Buddy Count
- จัดหมวดหมู่วิชาเลือกตาม Career Tracks (เช่น Network Engineer, Software Developer, Data & AI)
- **Peer Tracking Counter**: แสดง Widget บอกจำนวนเพื่อนที่สนใจสายเดียวกันในรุ่น เช่น:
  > *"มีเพื่อนรุ่นเดียวกัน 34 คน สนใจสาย Data & AI เหมือนคุณ"*  
  ช่วยลดความโดดเดี่ยวและความกังวลในการลงเรียนคนเดียว

### 5.4 บอร์ดรีวิววิชาเลือก (Course Community Review)
- กล่องรีวิวสั้นๆ เน้นกระชับได้ใจความ:
  - **Tags บ่งบอกลักษณะวิชา**: เน้นโปรเจกต์ / เน้นสอบ / เน้นปฏิบัติ / การบ้านเยอะ-น้อย
  - กล่องคอมเมนต์จริงใจจากรุ่นพี่ พร้อมแสดง Email นักศึกษา (เช่น `sukithale.ku.65@ubu.ac.th`)
  - ตัวนับความเห็น และฟังก์ชันแบ่งหน้า Pagination

### 5.5 ระบบจำลองจัดตารางเรียนอัจฉริยะ (Smart Course Planner)
- **Prerequisite Validation**: ตรวจสอบประวัติการเรียน หากยังไม่ผ่านวิชาตัวต่อ ระบบจะบล็อกไม่ให้กดเพิ่มรายวิชา พร้อมขึ้นกล่องแจ้งเตือน
- **Workload Balance Warning (ป้องกันวิชาหนักชนกัน)**:
  - ระบบคำนวณคะแนน Workload รวมในเทอม หากมีวิชาหนัก (Workload 4–5 ดาว เช่น มีโปรเจกต์ใหญ่ + สอบโหด) ติดกันเกิน 3 ตัวในเทอมเดียวกัน ระบบจะแจ้งเตือน:
    > ⚠️ *"คำเตือน: คุณมีวิชาที่เน้นโปรเจกต์/ภาระงานสูง 3 วิชาในเทอมนี้ อาจเสี่ยงต่อการจัดสรรเวลา"*
- **Time Clash Detection**: ตรวจสอบเวลาเรียนและเวลาสอบไม่ให้ชนกัน พร้อมแสดงผล Preview ลงในตารางแบบสัปดาห์ (จันทร์-ศุกร์ พักกลางวัน 12:00-13:00) ตาม UI ใน Mockup

---

## 6. Frontend Component Tree (React)

```text
src/
├── assets/
│   └── images/ (logo, mountains_bg.svg, profile_placeholder.png)
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx            # เมนูด้านซ้ายสีเขียวเข้ม พร้อมปุ่ม Logout สีส้ม
│   │   ├── Header.jsx             # แสดงรหัสนักศึกษา + Avatar ด้านบน
│   │   └── MainLayout.jsx
│   ├── schedule/
│   │   ├── TimetableGrid.jsx      # ตารางเรียน จันทร์-ศุกร์ + ช่องพักกลางวัน
│   │   └── ScheduleBlock.jsx      # บล็อกรายวิชาสีเขียวพาสเทล
│   ├── assessment/
│   │   ├── QuestionStep.jsx       # แบบสอบถาม Step 1/5
│   │   └── RecommendationCard.jsx # การ์ดวิชาที่ตรงใจพร้อม Tag
│   ├── review/
│   │   ├── ReviewModal.jsx
│   │   └── ReviewCommentList.jsx  # ลิสต์ความคิดเห็นของรุ่นพี่
│   └── planner/
│       ├── PrerequisiteAlert.jsx  # แจ้งเตือนวิชาบังคับก่อน
│       └── WorkloadMeter.jsx      # มิเตอร์ตรวจวัดความหนักของวิชา
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx          # หน้าหลัก ข่าวสาร เมนูด่วน
│   ├── TimetablePage.jsx          # หน้าตารางเรียน
│   ├── RegistrationStepPage.jsx   # ขั้นตอน 1-2-3-4 เลือกรายวิชา
│   ├── AssessmentPage.jsx         # หน้าทำแบบสอบถาม
│   ├── RecommendationPage.jsx     # สรุปผลวิชาแนะนำ
│   └── ProfilePage.jsx            # ข้อมูลส่วนตัวนักศึกษา
├── services/
│   ├── api.js                     # Axios instance
│   ├── courseService.js
│   └── assessmentService.js
└── App.jsx
```

---

## 7. Next Steps & Development Roadmap

- **Phase 1: Database & Seed Data** — นำ MySQL Script ไปสร้างตาราง พร้อมใส่ Mock ข้อมูลรายวิชาของ UBU
- **Phase 2: Authentication & Layout** — ทำหน้าล็อกอินและ Sidebar ตามสไตล์รูปภาพ
- **Phase 3: Assessment & Recommendation Logic** — ทำระบบแบบสอบถามและสูตรจับคู่วิชา
- **Phase 4: Course Planner & Validation Rule** — สร้างตาราง Timetable และเขียนฟังก์ชันเช็ก Prerequisite + Time Clash + Workload Limit
- **Phase 5: Reviews & Social Peer Tracking** — พัฒนาระบบรีวิวและเคาน์เตอร์นับจำนวนเพื่อนสายเดียวกัน
