export const SEED_CAREER_TRACKS = [
  {
    track_id: 1,
    track_name: 'Software Developer / Full-Stack Engineer',
    description: 'เน้นการออกแบบและพัฒนาระบบเว็บ, โมบายแอปพลิเคชัน และสถาปัตยกรรมซอฟต์แวร์ระดับองค์กร',
    icon_name: 'Code2',
    peer_count: 42
  },
  {
    track_id: 2,
    track_name: 'Data & Artificial Intelligence (AI)',
    description: 'เน้นการวิเคราะห์ข้อมูลขนาดใหญ่ การสร้างโมเดล Machine Learning และการประยุกต์ใช้ Generative AI',
    icon_name: 'BrainCircuit',
    peer_count: 34
  },
  {
    track_id: 3,
    track_name: 'Network & Cyber Security Engineer',
    description: 'เน้นการบริหารจัดการระบบเครือข่าย ความปลอดภัยทางไซเบอร์ คลาวด์คอมพิวติ้ง และการป้องกันการบุกรุก',
    icon_name: 'ShieldCheck',
    peer_count: 19
  },
  {
    track_id: 4,
    track_name: 'UI/UX & Digital Product Design',
    description: 'เน้นการออกแบบประสบการณ์ผู้ใช้ (UX), หน้าตากราฟิกส่วนต่อประสาน (UI), Design System และ User Research',
    icon_name: 'Layout',
    peer_count: 23
  }
];

export const SEED_COURSES = [
  {
    course_id: '1146101',
    course_name_th: 'การเขียนโปรแกรมคอมพิวเตอร์พื้นฐาน',
    course_name_en: 'Fundamentals of Computer Programming',
    credits: 3,
    workload_score: 3,
    career_track_id: 1,
    category: 'Core (วิชาแกนบังคับ)',
    description: 'หลักการออกแบบและพัฒนาอัลกอริทึม การเขียนโปรแกรมโครงสร้าง การจัดการหน่วยความจำ และการแก้โจทย์ปัญหาเชิงคำนวณ'
  },
  {
    course_id: '0041001',
    course_name_th: 'ภาษาอังกฤษเพื่อการสื่อสารในงานไอที',
    course_name_en: 'English for IT Professional Communication',
    credits: 3,
    workload_score: 2,
    career_track_id: null,
    category: 'GenEd (ศึกษาทั่วไป)',
    description: 'ทักษะการนำเสนองาน การเขียนเรซูเม่ การเขียนเอกสารทางเทคนิค และการสนทนาภาษาอังกฤษ'
  },
  {
    course_id: '1146201',
    course_name_th: 'โครงสร้างข้อมูลและขั้นตอนวิธี',
    course_name_en: 'Data Structures and Algorithms',
    credits: 3,
    workload_score: 4,
    career_track_id: 1,
    category: 'Core (วิชาแกนบังคับ)',
    description: 'การวิเคราะห์ขั้นตอนวิธี โครงสร้างเชิงเส้น ต้นไม้ กราฟ และการค้นหา/เรียงลำดับข้อมูล'
  },
  {
    course_id: '1146311',
    course_name_th: 'การพัฒนาเว็บแอปพลิเคชันขั้นสูง',
    course_name_en: 'Advanced Web Application Development',
    credits: 3,
    workload_score: 4,
    career_track_id: 1,
    category: 'Track Elective (วิชาเลือกตามสาย)',
    description: 'การสร้าง RESTful API และ Frontend ด้วย React, Next.js, Node.js และการเชื่อมต่อฐานข้อมูล'
  },
  {
    course_id: '1146320',
    course_name_th: 'วิศวกรรมซอฟต์แวร์และสถาปัตยกรรม',
    course_name_en: 'Software Engineering & Architecture',
    credits: 3,
    workload_score: 3,
    career_track_id: 1,
    category: 'Core (วิชาแกนบังคับ)',
    description: 'กระบวนการพัฒนาซอฟต์แวร์ Agile/Scrum, Design Patterns และ Clean Architecture'
  },
  {
    course_id: '1146331',
    course_name_th: 'ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง',
    course_name_en: 'Artificial Intelligence & Machine Learning',
    credits: 3,
    workload_score: 5,
    career_track_id: 2,
    category: 'Track Elective (วิชาเลือกตามสาย)',
    description: 'ทฤษฎี AI, Supervised/Unsupervised Learning, Neural Networks และการประยุกต์ใช้งานจริง'
  },
  {
    course_id: '1146335',
    course_name_th: 'วิทยาการข้อมูลและการวิเคราะห์เชิงลึก',
    course_name_en: 'Data Science & Advanced Analytics',
    credits: 3,
    workload_score: 4,
    career_track_id: 2,
    category: 'Track Elective (วิชาเลือกตามสาย)',
    description: 'กระบวนการสกัด ทำความสะอาด แปลงข้อมูล และสร้างแบบจำลองทางสถิติเพื่อตอบโจทย์ธุรกิจ'
  },
  {
    course_id: '1146341',
    course_name_th: 'ความมั่นคงทางไซเบอร์และการทดสอบเจาะระบบ',
    course_name_en: 'Cybersecurity & Penetration Testing',
    credits: 3,
    workload_score: 4,
    career_track_id: 3,
    category: 'Track Elective (วิชาเลือกตามสาย)',
    description: 'หลักการความปลอดภัยสารสนเทศ การประเมินช่องโหว่ จริยธรรมการเจาะระบบ และการรับมือภัยคุกคาม'
  },
  {
    course_id: '1146351',
    course_name_th: 'การออกแบบประสบการณ์ผู้ใช้และส่วนติดต่อกราฟิก',
    course_name_en: 'User Experience & UI Design',
    credits: 3,
    workload_score: 2,
    career_track_id: 4,
    category: 'Track Elective (วิชาเลือกตามสาย)',
    description: 'หลักการออกแบบ User-Centered Design, Wireframing, Prototyping ด้วย Figma และ Usability Testing'
  },
  {
    course_id: '1146401',
    course_name_th: 'การเขียนโปรแกรมเชิงวัตถุ',
    course_name_en: 'Object-Oriented Programming',
    credits: 3,
    workload_score: 3,
    career_track_id: 1,
    category: 'Core (วิชาแกนบังคับ)',
    description: 'แนวคิดคลาส อ็อบเจกต์ โพลีมอร์ฟิซึม การสืบทอดคุณสมบัติ และการห่อหุ้ม'
  }
];

export const SEED_SECTIONS = [
  { section_id: 1011, course_id: '1146101', section_no: '01', day_of_week: 'Tue', start_time: '13:00', end_time: '16:00', room: 'SC-402', lecturer: 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์', max_seats: 45, enrolled_seats: 38 },
  { section_id: 1012, course_id: '1146101', section_no: '02', day_of_week: 'Thu', start_time: '13:00', end_time: '16:00', room: 'SC-403', lecturer: 'อ.วิภาดา ลิขิตพงศ์', max_seats: 45, enrolled_seats: 26 },
  { section_id: 1001, course_id: '0041001', section_no: '01', day_of_week: 'Fri', start_time: '09:00', end_time: '12:00', room: 'LA-201', lecturer: 'Ajarn David Miller', max_seats: 50, enrolled_seats: 34 },
  { section_id: 101, course_id: '1146201', section_no: '01', day_of_week: 'Mon', start_time: '09:00', end_time: '12:00', room: 'SC-304', lecturer: 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์', max_seats: 40, enrolled_seats: 38 },
  { section_id: 102, course_id: '1146201', section_no: '02', day_of_week: 'Wed', start_time: '13:00', end_time: '16:00', room: 'SC-304', lecturer: 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์', max_seats: 40, enrolled_seats: 25 },
  { section_id: 201, course_id: '1146311', section_no: '01', day_of_week: 'Tue', start_time: '09:00', end_time: '12:00', room: 'LAB-IT2', lecturer: 'ดร.กิตติศักดิ์ ศรีมงคล', max_seats: 35, enrolled_seats: 34 },
  { section_id: 301, course_id: '1146320', section_no: '01', day_of_week: 'Wed', start_time: '09:00', end_time: '12:00', room: 'SC-201', lecturer: 'อ.พรทิพย์ สุวรรณฉัตร', max_seats: 50, enrolled_seats: 42 },
  { section_id: 401, course_id: '1146331', section_no: '01', day_of_week: 'Thu', start_time: '13:00', end_time: '16:00', room: 'AI-LAB', lecturer: 'รศ.ดร.วิโรจน์ แสงสุริยา', max_seats: 30, enrolled_seats: 29 },
  { section_id: 501, course_id: '1146335', section_no: '01', day_of_week: 'Fri', start_time: '09:00', end_time: '12:00', room: 'LAB-DATA', lecturer: 'ดร.สมชาย ใจดี', max_seats: 35, enrolled_seats: 22 },
  { section_id: 601, course_id: '1146341', section_no: '01', day_of_week: 'Fri', start_time: '13:00', end_time: '16:00', room: 'SEC-LAB', lecturer: 'อ.อนันต์ สันติภาพ', max_seats: 30, enrolled_seats: 18 },
  { section_id: 701, course_id: '1146351', section_no: '01', day_of_week: 'Mon', start_time: '13:00', end_time: '16:00', room: 'DESIGN-STUDIO', lecturer: 'อ.อรทัย วิจิตรศิลป์', max_seats: 40, enrolled_seats: 35 }
];

export const SEED_PREREQUISITES = [
  { course_id: '1146311', prerequisite_course_id: '1146201' },
  { course_id: '1146331', prerequisite_course_id: '1146201' },
  { course_id: '1146335', prerequisite_course_id: '1146201' }
];

export const SEED_USERS = [
  {
    student_id: '67114640285',
    first_name_th: 'ศุภกิจ',
    last_name_th: 'สุขประเสริฐ',
    first_name_en: 'Supakit',
    last_name_en: 'Sukprasert',
    email: 'supakit.s.67@ubu.ac.th',
    password: 'password123',
    faculty: 'คณะวิทยาศาสตร์ (Faculty of Science)',
    department: 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล (Computer Science)',
    advisor_name: 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์',
    gpa: 3.64,
    credits_completed: 45,
    career_track_id: 1
  },
  {
    student_id: '67122420128',
    first_name_th: 'นักศึกษา',
    last_name_th: '67122420128',
    first_name_en: 'Student',
    last_name_en: '67122420128',
    email: '67122420128@ubu.ac.th',
    password: 'password123',
    faculty: 'คณะวิทยาศาสตร์ (Faculty of Science)',
    department: 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล',
    advisor_name: 'ยังไม่ระบุอาจารย์ที่ปรึกษา',
    gpa: 3.5,
    credits_completed: 0,
    career_track_id: 1
  },
  {
    student_id: '67114640999',
    first_name_th: 'กิตติศักดิ์',
    last_name_th: 'ใจดี',
    first_name_en: 'Kittisak',
    last_name_en: 'Jaidee',
    email: 'kittisak.j.67@ubu.ac.th',
    password: 'password123',
    faculty: 'คณะวิทยาศาสตร์',
    department: 'สาขาวิทยาการคอมพิวเตอร์',
    advisor_name: 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์',
    gpa: 3.5,
    credits_completed: 0,
    career_track_id: 1
  },
  {
    student_id: '67114640888',
    first_name_th: 'สมคิด',
    last_name_th: 'เรียนดี',
    first_name_en: 'Somkid',
    last_name_en: 'Reandee',
    email: '67114640888@ubu.ac.th',
    password: 'password123',
    faculty: 'คณะวิศวกรรมศาสตร์ (Faculty of Engineering)',
    department: 'วิศวกรรมคอมพิวเตอร์',
    advisor_name: 'รศ.ดร.อาจารย์ ที่ปรึกษา',
    gpa: 3.5,
    credits_completed: 0,
    career_track_id: 1
  }
];

export const SEED_REVIEWS = [
  {
    review_id: 1,
    course_id: '1146201',
    course_name_th: 'โครงสร้างข้อมูลและขั้นตอนวิธี',
    student_id: '66114640102',
    student_email: 'senior.cs66@ubu.ac.th',
    rating: 5,
    project_heavy: false,
    exam_heavy: true,
    homework_level: 'high',
    comment_text: 'อาจารย์ชิตพงษ์สอนละเอียดมาก มีแบบฝึกหัดโจทย์โค้ดให้ทำสัปดาห์ละข้อ แนะนำให้ทบทวนเรื่อง Pointer กับ Recursion ให้แม่นก่อนสอบมิดเทอมครับ',
    likes: 18,
    created_at: '2026-08-15'
  },
  {
    review_id: 2,
    course_id: '1146311',
    course_name_th: 'การพัฒนาเว็บแอปพลิเคชันขั้นสูง',
    student_id: '66114640199',
    student_email: 'webdev.pro66@ubu.ac.th',
    rating: 5,
    project_heavy: true,
    exam_heavy: false,
    homework_level: 'medium',
    comment_text: 'วิชานี้สนุกมาก เน้นทำโปรเจกต์จริง ได้ทำระบบตั้งแต่ Frontend React จนถึง Deploy ขึ้น Cloud ใครชอบเขียนโค้ดแนะนำเลยครับ ได้พอร์ตส่งสมัครงานแน่นอน',
    likes: 24,
    created_at: '2026-08-20'
  }
];
