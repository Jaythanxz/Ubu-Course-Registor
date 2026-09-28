-- =====================================================================
-- UBU Course Registration & Smart Advisory System
-- Database Schema & Mock Seed Data (MySQL 8.x)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS ubu_registration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ubu_registration;

-- 1. ตารางสายอาชีพ (Career Tracks)
DROP TABLE IF EXISTS course_reviews;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS student_assessments;
DROP TABLE IF EXISTS course_prerequisites;
DROP TABLE IF EXISTS course_sections;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS career_tracks;

CREATE TABLE career_tracks (
    track_id INT AUTO_INCREMENT PRIMARY KEY,
    track_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    peer_count INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. ตารางผู้ใช้งาน / นักศึกษา (Users)
CREATE TABLE users (
    student_id VARCHAR(15) PRIMARY KEY,
    first_name_th VARCHAR(100) NOT NULL,
    last_name_th VARCHAR(100) NOT NULL,
    first_name_en VARCHAR(100),
    last_name_en VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    faculty VARCHAR(100),
    department VARCHAR(100),
    advisor_name VARCHAR(150),
    gpa DECIMAL(3, 2) DEFAULT 0.00,
    credits_completed INT DEFAULT 0,
    career_track_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (career_track_id) REFERENCES career_tracks(track_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. ตารางข้อมูลวิชาเรียน (Courses)
CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    course_name_th VARCHAR(150) NOT NULL,
    course_name_en VARCHAR(150) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    workload_score INT DEFAULT 3, -- สเกล 1 (เบา) - 5 (หนักมาก)
    career_track_id INT NULL,
    category ENUM('Core', 'Track Elective', 'Free Elective', 'GenEd') DEFAULT 'Track Elective',
    description TEXT,
    FOREIGN KEY (career_track_id) REFERENCES career_tracks(track_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ตารางวิชาบังคับก่อน (Course Prerequisites)
CREATE TABLE course_prerequisites (
    course_id VARCHAR(10) NOT NULL,
    prerequisite_course_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (course_id, prerequisite_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ตารางตอนเรียน / เวลาเรียน (Course Sections)
CREATE TABLE course_sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(10) NOT NULL,
    section_no VARCHAR(5) NOT NULL,
    day_of_week ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    lecturer VARCHAR(100),
    max_seats INT DEFAULT 40,
    enrolled_seats INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. ตารางผลประเมินสไตล์การเรียนรู้ (Student Assessments)
CREATE TABLE student_assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL,
    work_style VARCHAR(50) NOT NULL,
    preferred_learning VARCHAR(50) NOT NULL,
    interest_domain VARCHAR(100),
    recommended_track_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(student_id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_track_id) REFERENCES career_tracks(track_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. ตารางรีวิวรายวิชา (Course Reviews)
CREATE TABLE course_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(10) NOT NULL,
    student_id VARCHAR(15) NOT NULL,
    student_email VARCHAR(100) NOT NULL,
    rating INT DEFAULT 5,
    project_heavy BOOLEAN DEFAULT FALSE,
    exam_heavy BOOLEAN DEFAULT FALSE,
    homework_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    comment_text TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(student_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. ตารางการลงทะเบียน / แผนตารางเรียน (Enrollments & Planner)
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL,
    section_id INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    semester INT NOT NULL,
    status ENUM('planned', 'enrolled', 'passed', 'failed') DEFAULT 'planned',
    FOREIGN KEY (student_id) REFERENCES users(student_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES course_sections(section_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- 1. Career Tracks
INSERT INTO career_tracks (track_id, track_name, description, icon_name, peer_count) VALUES
(1, 'Software Developer / Full-Stack Engineer', 'เน้นการออกแบบและพัฒนาระบบเว็บ, โมบายแอปพลิเคชัน และสถาปัตยกรรมซอฟต์แวร์ระดับองค์กร', 'Code2', 42),
(2, 'Data & Artificial Intelligence (AI)', 'เน้นการวิเคราะห์ข้อมูลขนาดใหญ่ การสร้างโมเดล Machine Learning และการประยุกต์ใช้ Generative AI', 'BrainCircuit', 34),
(3, 'Network & Cyber Security Engineer', 'เน้นการบริหารจัดการระบบเครือข่าย ความปลอดภัยทางไซเบอร์ คลาวด์คอมพิวติ้ง และการป้องกันการบุกรุก', 'ShieldCheck', 19),
(4, 'UI/UX & Digital Product Design', 'เน้นการออกแบบประสบการณ์ผู้ใช้ (UX), หน้าตากราฟิกส่วนต่อประสาน (UI), Design System และ User Research', 'Layout', 23);

-- 2. Users
INSERT INTO users (student_id, first_name_th, last_name_th, first_name_en, last_name_en, email, password_hash, faculty, department, advisor_name, gpa, credits_completed, career_track_id) VALUES
('67114640285', 'ศุภกิจ', 'สุขประเสริฐ', 'Supakit', 'Sukprasert', 'supakit.s.67@ubu.ac.th', '$2b$10$hashed_password_sample', 'คณะวิทยาศาสตร์ (Faculty of Science)', 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล (Computer Science)', 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์', 3.64, 45, 1);

-- 3. Courses
INSERT INTO courses (course_id, course_name_th, course_name_en, credits, workload_score, career_track_id, category, description) VALUES
('1146101', 'การเขียนโปรแกรมคอมพิวเตอร์พื้นฐาน', 'Fundamentals of Computer Programming', 3, 3, 1, 'Core', 'หลักการออกแบบและพัฒนาอัลกอริทึม การเขียนโปรแกรมโครงสร้าง การจัดการหน่วยความจำ'),
('1146201', 'โครงสร้างข้อมูลและขั้นตอนวิธี', 'Data Structures and Algorithms', 3, 5, 1, 'Core', 'การจัดการข้อมูลเชิงโครงสร้าง แถวลำดับ สแตก คิว ต้นไม้ กราฟ และวิเคราะห์ Big-O'),
('1146311', 'การพัฒนาเว็บแอปพลิเคชันสมัยใหม่', 'Modern Web Application Development', 3, 4, 1, 'Track Elective', 'การพัฒนา Full-stack Web ด้วย React, Node.js, REST API, ระบบ Auth'),
('1146320', 'วิศวกรรมซอฟต์แวร์และการจัดการโปรเจกต์', 'Software Engineering & Project Management', 3, 5, 1, 'Core', 'วงจรการพัฒนา Agile/Scrum การออกแบบ Architecture การทำ Testing และโปรเจกต์กลุ่ม'),
('1146331', 'ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง', 'Artificial Intelligence & Machine Learning', 3, 4, 2, 'Track Elective', 'หลักการ Supervised & Unsupervised Learning, Neural Networks, PyTorch'),
('1146335', 'วิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ', 'Data Science and Business Analytics', 3, 3, 2, 'Track Elective', 'Data Pipeline, Exploratory Data Analysis (EDA), Data Cleaning, Storytelling'),
('1146350', 'เครือข่ายคอมพิวเตอร์และการสื่อสารข้อมูล', 'Computer Networks & Data Communication', 3, 4, 3, 'Core', 'แบบจำลอง OSI 7 Layers, TCP/IP, Routing & Switching, VLANs, Wireshark'),
('1146355', 'ความมั่นคงปลอดภัยสารสนเทศและไซเบอร์', 'Information and Cyber Security', 3, 3, 3, 'Track Elective', 'Cryptography, OWASP Top 10, Penetration Testing เบื้องต้น, กฎหมาย PDPA'),
('1146362', 'การออกแบบส่วนต่อประสานและประสบการณ์ผู้ใช้', 'UI/UX Design and Interaction Systems', 3, 2, 4, 'Track Elective', 'Design Thinking, Wireframing, Hi-Fi Prototyping ด้วย Figma, Usability Testing'),
('0041001', 'ภาษาอังกฤษเพื่อการสื่อสารในงานไอที', 'English for IT Professional Communication', 3, 2, NULL, 'GenEd', 'ทักษะการนำเสนองาน การเขียนเรซูเม่ การเขียนเอกสารทางเทคนิค และการสนทนาในงานไอที');

-- 4. Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES
('1146201', '1146101'),
('1146311', '1146101'),
('1146320', '1146201'),
('1146331', '1146201'),
('1146355', '1146350');

-- 5. Course Sections
INSERT INTO course_sections (section_id, course_id, section_no, day_of_week, start_time, end_time, room, lecturer, max_seats, enrolled_seats) VALUES
(101, '1146201', '01', 'Mon', '09:00:00', '12:00:00', 'SC-402 (Lab CS)', 'ดร.สมชาย ใจดี', 40, 32),
(102, '1146201', '02', 'Wed', '13:00:00', '16:00:00', 'SC-403 (Lab CS)', 'ดร.สมชาย ใจดี', 40, 25),
(201, '1146311', '01', 'Tue', '09:00:00', '12:00:00', 'SC-405 (Digital Studio)', 'อ.วิภาดา ลิขิตพงศ์', 35, 31),
(301, '1146320', '01', 'Wed', '09:00:00', '12:00:00', 'SC-301 (Lecture Hall)', 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์', 50, 44),
(401, '1146331', '01', 'Thu', '09:00:00', '12:00:00', 'SC-408 (AI Lab)', 'รศ.ดร.ประเสริฐ เกียรติ์ขจร', 35, 29),
(501, '1146335', '01', 'Thu', '13:00:00', '16:00:00', 'SC-402 (Lab CS)', 'ดร.กานดา สันติธรรม', 40, 20),
(601, '1146350', '01', 'Mon', '13:00:00', '16:00:00', 'SC-410 (Cisco Network Lab)', 'อ.ทนงศักดิ์ สายตรวจ', 30, 27),
(701, '1146355', '01', 'Fri', '09:00:00', '12:00:00', 'SC-411 (Security Lab)', 'ดร.เอกชัย มหานที', 35, 18),
(801, '1146362', '01', 'Fri', '13:00:00', '16:00:00', 'SC-204 (Creative Space)', 'อ.พิมพ์ใจ งามดี', 45, 38);

-- 6. Course Reviews
INSERT INTO course_reviews (course_id, student_id, student_email, rating, project_heavy, exam_heavy, homework_level, comment_text, likes) VALUES
('1146311', '65114640102', 'sukithale.ku.65@ubu.ac.th', 5, TRUE, FALSE, 'medium', 'อาจารย์สอนดีมาก ได้ทำโปรเจกต์จริงด้วย React และ Node.js แบบจัดเต็ม งานหนักช่วงปลายเทอมแต่คุ้มค่ามาก เอาไปใส่พอร์ตสมัครฝึกงานได้เลย!', 24),
('1146201', '65114640089', 'nattawut.p.65@ubu.ac.th', 4, FALSE, TRUE, 'high', 'เนื้อหาแน่นมาก ข้อสอบเน้นวิเคราะห์ Big-O และเขียนโค้ดแก้โจทย์อัลกอริทึม ต้องฝึกทำโจทย์ LeetCode บ่อยๆ การบ้านมีทุกสัปดาห์ ไม่ควรลงคู่กับวิชาโปรเจกต์หนักตัวอื่น', 38),
('1146320', '64114640012', 'thanatorn.w.64@ubu.ac.th', 4, TRUE, TRUE, 'high', 'วิชาแห่งชีวิตจริง ได้เรียนรู้การทำงานเป็นทีมแบบ Scrum เอกสารเยอะพอๆ กับเขียนโค้ด ใครทำงานเป็นทีมไม่คล่องจะเหนื่อยหน่อย แนะนำจับกลุ่มกับเพื่อนที่ไว้ใจได้', 45),
('1146362', '66114640194', 'ploypailin.t.66@ubu.ac.th', 5, TRUE, FALSE, 'low', 'สนุกมาก! บรรยากาศในห้องชิลล์ อาจารย์เปิดกว้างเรื่องความคิดสร้างสรรค์ ได้ฝึกทำ Figma ขั้นสูงกับ Design System สบายๆ ไม่เครียดข้อสอบ', 19);

-- 7. Enrollments Initial
INSERT INTO enrollments (student_id, section_id, academic_year, semester, status) VALUES
('67114640285', 101, '2569', 1, 'planned'),
('67114640285', 201, '2569', 1, 'planned');
