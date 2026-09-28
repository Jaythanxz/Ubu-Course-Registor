# 🎓 UBU Course Registration & Smart Advisory System
> ระบบเว็บแอปพลิเคชันสำหรับลงทะเบียนเรียนและแนะนำแผนการเรียนอัจฉริยะ มหาวิทยาลัยอุบลราชธานี

---

## 🌟 ฟีเจอร์เด่นของระบบ (Key Features)

1. **ระบบล็อกอิน & ตรวจสอบสิทธิ์ (Auth & Profile)**
   - โทนสีมินิมอล Deep Teal (`#0A5C5A`), Safety Orange (`#F07C00`) และภาพกราฟิกภูเขาสีเขียวเข้มด้านล่าง
   - หน้าข้อมูลส่วนตัวนักศึกษา อาจารย์ที่ปรึกษา ผลการเรียน และสถานะวิชาบังคับก่อน
2. **ระบบประเมินสไตล์การเรียนรู้ (5-Step Assessment)**
   - แบบสอบถาม 5 ข้อ วิเคราะห์ด้านที่สนใจ, รูปแบบการเรียน (Lab/Theory), สไตล์การทำงานเดี่ยว/กลุ่ม
   - คำนวณ Core Strengths พร้อมแนะนำกลุ่มวิชาที่ตรงใจ
3. **Roadmap สายอาชีพ & Social Buddy Count**
   - แผนผังแยกสายอาชีพ (Full-Stack, Data & AI, Cyber Security, UI/UX)
   - Widget นับเพื่อนร่วมรุ่นที่สนใจสายเดียวกัน (*"มีเพื่อนรุ่นเดียวกัน 34 คน สนใจสาย Data & AI เหมือนคุณ"*)
4. **ระบบจำลองจัดตารางเรียนอัจฉริยะ (Smart Course Planner)**
   - **ตารางเรียนประจำสัปดาห์ (Weekly Timetable Grid)**: จันทร์ - ศุกร์ พร้อมช่องพักกลางวัน (12:00 - 13:00 น.)
   - **Prerequisite Validation**: ตรวจสอบวิชาบังคับก่อน หากยังไม่ผ่านจะบล็อกและแจ้งเตือนทันที
   - **Time Clash Detection**: ตรวจสอบเวลาเรียนและแจ้งเตือนทันทีหากเวลาตรงกัน
   - **Workload Balance Warning**: คำนวณความหนัก หากมีวิชาหนัก (4–5 ดาว) ตั้งแต่ 3 วิชาขึ้นไป จะขึ้นกล่องเตือนความเสี่ยง
5. **ชุมชนรีวิววิชาเลือก (Course Community Review)**
   - รีวิวสั้นกระชับจากรุ่นพี่ พร้อมแสดงอีเมลนักศึกษา UBU
   - ป้ายกำกับ: เน้นโปรเจกต์, เน้นสอบข้อเขียน, ปริมาณการบ้าน
   - ฟังก์ชันตัวกรอง (Filter), ตัวนับความเห็น, การแบ่งหน้า (Pagination) และแบบฟอร์มส่งรีวิวใหม่

---

## 🛠️ วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. รันระบบ Frontend
```bash
# ติดตั้ง dependencies (หากยังไม่ได้ติดตั้ง)
npm install

# เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev
```
เข้าใช้งานผ่านเบราว์เซอร์ที่: **`http://localhost:5173/`**

### 2. บัญชีทดสอบเข้าสู่ระบบ (Demo Account)
- **รหัสนักศึกษา**: `67114640285`
- **รหัสผ่าน**: `password123` (หรือค่าใดก็ได้ในระบบจำลอง)

### 3. โครงสร้างฐานข้อมูล MySQL
- ไฟล์สคริปต์ SQL ครบชุดสำหรับ MySQL 8.x อยู่ที่ [database.sql](file:///d:/Resigter/database.sql)
- สามารถนำเข้าใน phpMyAdmin หรือ MySQL Workbench ได้ทันที

---

## 📁 โครงสร้างไฟล์โปรเจกต์ (Project Structure)
```text
src/
├── components/
│   ├── layout/ (Sidebar.jsx, Header.jsx, MainLayout.jsx)
│   ├── schedule/ (TimetableGrid.jsx, ScheduleBlock.jsx)
│   ├── planner/ (WorkloadMeter.jsx, PrerequisiteAlert.jsx)
│   ├── assessment/ (QuestionStep.jsx, RecommendationCard.jsx)
│   └── review/ (ReviewModal.jsx, ReviewCommentList.jsx)
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── TimetablePage.jsx
│   ├── AssessmentPage.jsx
│   ├── RecommendationPage.jsx
│   ├── ReviewsPage.jsx
│   └── ProfilePage.jsx
├── context/
│   └── AppContext.jsx (Central State, Validation Logic, Enrollments)
├── data/
│   └── mockData.js (Courses, Sections, Tracks, Reviews dataset)
├── spec.md (System Specification Document)
└── database.sql (MySQL 8.x DDL & Seed Script)
```
