// Mock Data conforming to MySQL Schema in spec.md
export const INITIAL_USER = {
  student_id: '67114640285',
  first_name_th: 'ศุภกิจ',
  last_name_th: 'สุขประเสริฐ',
  first_name_en: 'Supakit',
  last_name_en: 'Sukprasert',
  email: 'supakit.s.67@ubu.ac.th',
  faculty: 'คณะวิทยาศาสตร์ (Faculty of Science)',
  department: 'สาขาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล (Computer Science)',
  advisor_name: 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์',
  advisor_email: 'chitapong.k@ubu.ac.th',
  gpa: '3.64',
  credits_completed: 45,
  status: 'กำลังศึกษา (Normal Status)',
  academic_year: '2569',
  semester: 1,
  career_track_id: 1, // Software Developer by default
};

export const CAREER_TRACKS = [
  {
    track_id: 1,
    track_name: 'Software Developer / Full-Stack Engineer',
    description: 'เน้นการออกแบบและพัฒนาระบบเว็บ, โมบายแอปพลิเคชัน และสถาปัตยกรรมซอฟต์แวร์ระดับองค์กร',
    icon_name: 'Code2',
    peer_count: 42,
    badge_color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    skills: ['React / Vue', 'Node.js / Express', 'Database Design', 'System Architecture', 'CI/CD & Docker'],
  },
  {
    track_id: 2,
    track_name: 'Data & Artificial Intelligence (AI)',
    description: 'เน้นการวิเคราะห์ข้อมูลขนาดใหญ่ การสร้างโมเดล Machine Learning และการประยุกต์ใช้ Generative AI',
    icon_name: 'BrainCircuit',
    peer_count: 34,
    badge_color: 'bg-blue-100 text-blue-800 border-blue-300',
    skills: ['Python Data Stack', 'Deep Learning', 'SQL & Big Data', 'Prompt Engineering', 'Data Visualization'],
  },
  {
    track_id: 3,
    track_name: 'Network & Cyber Security Engineer',
    description: 'เน้นการบริหารจัดการระบบเครือข่าย ความปลอดภัยทางไซเบอร์ คลาวด์คอมพิวติ้ง และการป้องกันการบุกรุก',
    icon_name: 'ShieldCheck',
    peer_count: 19,
    badge_color: 'bg-amber-100 text-amber-800 border-amber-300',
    skills: ['Network Protocols (TCP/IP)', 'Ethical Hacking', 'Cloud Infra (AWS/GCP)', 'Firewall & VPN', 'Linux Admin'],
  },
  {
    track_id: 4,
    track_name: 'UI/UX & Digital Product Design',
    description: 'เน้นการออกแบบประสบการณ์ผู้ใช้ (UX), หน้าตากราฟิกส่วนต่อประสาน (UI), Design System และ User Research',
    icon_name: 'Layout',
    peer_count: 23,
    badge_color: 'bg-purple-100 text-purple-800 border-purple-300',
    skills: ['Figma Mastery', 'User Research', 'Design Systems', 'Micro-interactions', 'Design Thinking'],
  },
];

export const COURSES = [
  {
    course_id: '1146101',
    course_name_th: 'การเขียนโปรแกรมคอมพิวเตอร์พื้นฐาน',
    course_name_en: 'Fundamentals of Computer Programming',
    credits: 3,
    workload_score: 3,
    career_track_id: 1,
    category: 'วิชาบังคับ (Core)',
    description: 'หลักการออกแบบและพัฒนาอัลกอริทึม การเขียนโปรแกรมโครงสร้าง การจัดการหน่วยความจำ และการแก้โจทย์ปัญหาเชิงคำนวณ',
  },
  {
    course_id: '1146201',
    course_name_th: 'โครงสร้างข้อมูลและขั้นตอนวิธี',
    course_name_en: 'Data Structures and Algorithms',
    credits: 3,
    workload_score: 5, // Heavy
    career_track_id: 1,
    category: 'วิชาบังคับ (Core)',
    description: 'การจัดการข้อมูลเชิงโครงสร้าง แถวลำดับ สแตก คิว ต้นไม้ กราฟ และการวิเคราะห์ความซับซ้อนของขั้นตอนวิธี Big-O',
  },
  {
    course_id: '1146311',
    course_name_th: 'การพัฒนาเว็บแอปพลิเคชันสมัยใหม่',
    course_name_en: 'Modern Web Application Development',
    credits: 3,
    workload_score: 4, // Heavy
    career_track_id: 1,
    category: 'วิชาเลือกสาย (Track Elective)',
    description: 'การพัฒนา Full-stack Web ด้วย React, Node.js, REST API, ระบบ Authentication และการทดสอบระบบซอฟต์แวร์',
  },
  {
    course_id: '1146320',
    course_name_th: 'วิศวกรรมซอฟต์แวร์และการจัดการโปรเจกต์',
    course_name_en: 'Software Engineering & Project Management',
    credits: 3,
    workload_score: 5, // Heavy
    career_track_id: 1,
    category: 'วิชาบังคับ (Core)',
    description: 'วงจรการพัฒนาซอฟต์แวร์ Agile/Scrum การออกแบบ Architecture การทำ Testing และการทำ Term Project กลุ่มใหญ่',
  },
  {
    course_id: '1146331',
    course_name_th: 'ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง',
    course_name_en: 'Artificial Intelligence & Machine Learning',
    credits: 3,
    workload_score: 4, // Heavy
    career_track_id: 2,
    category: 'วิชาเลือกสาย (Track Elective)',
    description: 'หลักการ Supervised & Unsupervised Learning, Neural Networks, Scikit-learn, PyTorch และการประยุกต์ใช้โมเดลในงานจริง',
  },
  {
    course_id: '1146335',
    course_name_th: 'วิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ',
    course_name_en: 'Data Science and Business Analytics',
    credits: 3,
    workload_score: 3,
    career_track_id: 2,
    category: 'วิชาเลือกสาย (Track Elective)',
    description: 'กระบวนการ Data Pipeline, Exploratory Data Analysis (EDA), การทำ Data Cleaning และการเล่าเรื่องด้วยข้อมูล (Data Storytelling)',
  },
  {
    course_id: '1146350',
    course_name_th: 'เครือข่ายคอมพิวเตอร์และการสื่อสารข้อมูล',
    course_name_en: 'Computer Networks & Data Communication',
    credits: 3,
    workload_score: 4, // Heavy
    career_track_id: 3,
    category: 'วิชาบังคับ (Core)',
    description: 'แบบจำลอง OSI 7 Layers, TCP/IP, Routing & Switching, VLANs, Wireshark packet analysis และแล็บคอนฟิกอุปกรณ์เครือข่าย',
  },
  {
    course_id: '1146355',
    course_name_th: 'ความมั่นคงปลอดภัยสารสนเทศและไซเบอร์',
    course_name_en: 'Information and Cyber Security',
    credits: 3,
    workload_score: 3,
    career_track_id: 3,
    category: 'วิชาเลือกสาย (Track Elective)',
    description: 'Cryptography, การโจมตีเว็บ (OWASP Top 10), การทำ Penetration Testing เบื้องต้น และกฎหมาย PDPA',
  },
  {
    course_id: '1146362',
    course_name_th: 'การออกแบบส่วนต่อประสานและประสบการณ์ผู้ใช้',
    course_name_en: 'UI/UX Design and Interaction Systems',
    credits: 3,
    workload_score: 2, // Light-Medium
    career_track_id: 4,
    category: 'วิชาเลือกสาย (Track Elective)',
    description: 'กระบวนการคิดเชิงออกแบบ (Design Thinking), Wireframing, Hi-Fi Prototyping ด้วย Figma และการทำ Usability Testing',
  },
  {
    course_id: '0041001',
    course_name_th: 'ภาษาอังกฤษเพื่อการสื่อสารในงานไอที',
    course_name_en: 'English for IT Professional Communication',
    credits: 3,
    workload_score: 2,
    career_track_id: null,
    category: 'วิชาศึกษาทั่วไป (GenEd)',
    description: 'ทักษะการนำเสนองาน การเขียนเรซูเม่ การเขียนเอกสารทางเทคนิค และการสนทนาภาษาอังกฤษในสายงานเทคโนโลยี',
  },
];

// Prerequisites: course_id requires prerequisite_course_id
export const COURSE_PREREQUISITES = [
  { course_id: '1146201', prerequisite_course_id: '1146101' }, // Data Structure requires Fund. Prog
  { course_id: '1146311', prerequisite_course_id: '1146101' }, // Web Dev requires Fund. Prog
  { course_id: '1146320', prerequisite_course_id: '1146201' }, // Software Eng requires Data Structure
  { course_id: '1146331', prerequisite_course_id: '1146201' }, // AI requires Data Structure
  { course_id: '1146355', prerequisite_course_id: '1146350' }, // Cyber Sec requires Computer Networks
];

// Passed courses of current student
export const STUDENT_PASSED_COURSES = ['1146101', '0041001']; // has passed Fund Prog and English

export const COURSE_SECTIONS = [
  // 1146101 - Fundamentals of Computer Programming (Tue 13:00 - 16:00 & Thu 13:00 - 16:00)
  {
    section_id: 1011,
    course_id: '1146101',
    section_no: '01',
    day_of_week: 'Tue',
    start_time: '13:00',
    end_time: '16:00',
    room: 'SC-402 (Lab CS)',
    lecturer: 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์',
    max_seats: 45,
    enrolled_seats: 38,
  },
  {
    section_id: 1012,
    course_id: '1146101',
    section_no: '02',
    day_of_week: 'Thu',
    start_time: '13:00',
    end_time: '16:00',
    room: 'SC-403 (Lab CS)',
    lecturer: 'อ.วิภาดา ลิขิตพงศ์',
    max_seats: 45,
    enrolled_seats: 26,
  },

  // 0041001 - English for IT Professional Communication (Fri 09:00 - 12:00)
  {
    section_id: 1001,
    course_id: '0041001',
    section_no: '01',
    day_of_week: 'Fri',
    start_time: '09:00',
    end_time: '12:00',
    room: 'LA-201 (Language Lab)',
    lecturer: 'Ajarn David Miller',
    max_seats: 50,
    enrolled_seats: 34,
  },

  // 1146201 - Data Structures (Mon 09:00 - 12:00)
  {
    section_id: 101,
    course_id: '1146201',
    section_no: '01',
    day_of_week: 'Mon',
    start_time: '09:00',
    end_time: '12:00',
    room: 'SC-402 (Lab CS)',
    lecturer: 'ดร.สมชาย ใจดี',
    max_seats: 40,
    enrolled_seats: 32,
  },
  {
    section_id: 102,
    course_id: '1146201',
    section_no: '02',
    day_of_week: 'Wed',
    start_time: '13:00',
    end_time: '16:00',
    room: 'SC-403 (Lab CS)',
    lecturer: 'ดร.สมชาย ใจดี',
    max_seats: 40,
    enrolled_seats: 25,
  },

  // 1146311 - Modern Web App (Tue 09:00 - 12:00)
  {
    section_id: 201,
    course_id: '1146311',
    section_no: '01',
    day_of_week: 'Tue',
    start_time: '09:00',
    end_time: '12:00',
    room: 'SC-405 (Digital Studio)',
    lecturer: 'อ.วิภาดา ลิขิตพงศ์',
    max_seats: 35,
    enrolled_seats: 31,
  },

  // 1146320 - Software Eng (Wed 09:00 - 12:00)
  {
    section_id: 301,
    course_id: '1146320',
    section_no: '01',
    day_of_week: 'Wed',
    start_time: '09:00',
    end_time: '12:00',
    room: 'SC-301 (Lecture Hall)',
    lecturer: 'ผศ.ดร.ชิตพงษ์ กิตติพาณิชย์',
    max_seats: 50,
    enrolled_seats: 44,
  },

  // 1146331 - AI & Machine Learning (Thu 09:00 - 12:00)
  {
    section_id: 401,
    course_id: '1146331',
    section_no: '01',
    day_of_week: 'Thu',
    start_time: '09:00',
    end_time: '12:00',
    room: 'SC-408 (AI Lab)',
    lecturer: 'รศ.ดร.ประเสริฐ เกียรติ์ขจร',
    max_seats: 35,
    enrolled_seats: 29,
  },

  // 1146335 - Data Science & Analytics (Thu 13:00 - 16:00)
  {
    section_id: 501,
    course_id: '1146335',
    section_no: '01',
    day_of_week: 'Thu',
    start_time: '13:00',
    end_time: '16:00',
    room: 'SC-402 (Lab CS)',
    lecturer: 'ดร.กานดา สันติธรรม',
    max_seats: 40,
    enrolled_seats: 20,
  },

  // 1146350 - Computer Networks (Mon 13:00 - 16:00)
  {
    section_id: 601,
    course_id: '1146350',
    section_no: '01',
    day_of_week: 'Mon',
    start_time: '13:00',
    end_time: '16:00',
    room: 'SC-410 (Cisco Network Lab)',
    lecturer: 'อ.ทนงศักดิ์ สายตรวจ',
    max_seats: 30,
    enrolled_seats: 27,
  },

  // 1146355 - Cyber Security (Fri 09:00 - 12:00)
  {
    section_id: 701,
    course_id: '1146355',
    section_no: '01',
    day_of_week: 'Fri',
    start_time: '09:00',
    end_time: '12:00',
    room: 'SC-411 (Security Lab)',
    lecturer: 'ดร.เอกชัย มหานที',
    max_seats: 35,
    enrolled_seats: 18,
  },

  // 1146362 - UI/UX Design (Fri 13:00 - 16:00)
  {
    section_id: 801,
    course_id: '1146362',
    section_no: '01',
    day_of_week: 'Fri',
    start_time: '13:00',
    end_time: '16:00',
    room: 'SC-204 (Creative Space)',
    lecturer: 'อ.พิมพ์ใจ งามดี',
    max_seats: 45,
    enrolled_seats: 38,
  },

  // Conflict test section: (Tue 09:00 - 12:00, overlaps with 1146311)
  {
    section_id: 901,
    course_id: '1146335',
    section_no: '02',
    day_of_week: 'Tue',
    start_time: '09:00',
    end_time: '12:00',
    room: 'SC-401',
    lecturer: 'ดร.กานดา สันติธรรม',
    max_seats: 40,
    enrolled_seats: 12,
  },
];

export const INITIAL_REVIEWS = [
  {
    review_id: 1,
    course_id: '1146311',
    course_name_th: 'การพัฒนาเว็บแอปพลิเคชันสมัยใหม่',
    student_id: '65114640102',
    student_email: 'sukithale.ku.65@ubu.ac.th',
    rating: 5,
    project_heavy: true,
    exam_heavy: false,
    homework_level: 'medium',
    comment_text: 'อาจารย์สอนดีมาก ได้ทำโปรเจกต์จริงด้วย React และ Node.js แบบจัดเต็ม งานหนักช่วงปลายเทอมแต่คุ้มค่ามาก เอาไปใส่พอร์ตสมัครฝึกงานได้เลย!',
    created_at: '2026-03-15',
    likes: 24,
  },
  {
    review_id: 2,
    course_id: '1146201',
    course_name_th: 'โครงสร้างข้อมูลและขั้นตอนวิธี',
    student_id: '65114640089',
    student_email: 'nattawut.p.65@ubu.ac.th',
    rating: 4,
    project_heavy: false,
    exam_heavy: true,
    homework_level: 'high',
    comment_text: 'เนื้อหาแน่นมาก ข้อสอบเน้นวิเคราะห์ Big-O และเขียนโค้ดแก้โจทย์อัลกอริทึม ต้องฝึกทำโจทย์ LeetCode บ่อยๆ การบ้านมีทุกสัปดาห์ ไม่ควรลงคู่กับวิชาโปรเจกต์หนักตัวอื่น',
    created_at: '2026-02-28',
    likes: 38,
  },
  {
    review_id: 3,
    course_id: '1146320',
    course_name_th: 'วิศวกรรมซอฟต์แวร์และการจัดการโปรเจกต์',
    student_id: '64114640012',
    student_email: 'thanatorn.w.64@ubu.ac.th',
    rating: 4,
    project_heavy: true,
    exam_heavy: true,
    homework_level: 'high',
    comment_text: 'วิชาแห่งชีวิตจริง ได้เรียนรู้การทำงานเป็นทีมแบบ Scrum เอกสารเยอะพอๆ กับเขียนโค้ด ใครทำงานเป็นทีมไม่คล่องจะเหนื่อยหน่อย แนะนำจับกลุ่มกับเพื่อนที่ไว้ใจได้',
    created_at: '2026-01-20',
    likes: 45,
  },
  {
    review_id: 4,
    course_id: '1146362',
    course_name_th: 'การออกแบบส่วนต่อประสานและประสบการณ์ผู้ใช้',
    student_id: '66114640194',
    student_email: 'ploypailin.t.66@ubu.ac.th',
    rating: 5,
    project_heavy: true,
    exam_heavy: false,
    homework_level: 'low',
    comment_text: 'สนุกมาก! บรรยากาศในห้องชิลล์ อาจารย์เปิดกว้างเรื่องความคิดสร้างสรรค์ ได้ฝึกทำ Figma ขั้นสูงกับ Design System สบายๆ ไม่เครียดข้อสอบ',
    created_at: '2026-03-02',
    likes: 19,
  },
  {
    review_id: 5,
    course_id: '1146331',
    course_name_th: 'ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง',
    student_id: '65114640221',
    student_email: 'anucha.k.65@ubu.ac.th',
    rating: 5,
    project_heavy: true,
    exam_heavy: true,
    homework_level: 'high',
    comment_text: 'คณิตศาสตร์แคลคูลัสและพีชคณิตเชิงเส้นต้องแม่น ถ้าเข้าใจพื้นฐานจะสนุกมาก ได้เล่นโมเดลคอมพิวเตอร์วิทัศน์กับ NLP งานเดี่ยวผสมงานกลุ่มช่วงท้าย',
    created_at: '2026-03-10',
    likes: 31,
  },
];

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    title: 'ด้านของเทคโนโลยีที่คุณมีความสนใจเป็นพิเศษ',
    subtitle: 'เลือกแท็กที่ตรงกับความชอบของคุณ (เลือกได้หลายข้อ)',
    type: 'multiselect',
    options: [
      { id: 'web', label: 'Web & Full-stack Dev', icon: 'Globe' },
      { id: 'mobile', label: 'Mobile Apps', icon: 'Smartphone' },
      { id: 'ai', label: 'AI & Data Science', icon: 'Brain' },
      { id: 'network', label: 'เครือข่าย & คลาวด์ (Cloud/Network)', icon: 'Server' },
      { id: 'security', label: 'Cyber Security & Hacking', icon: 'Shield' },
      { id: 'uxui', label: 'UX/UI & Product Design', icon: 'Palette' },
      { id: 'game', label: 'เกม & กราฟิกคอมพิวเตอร์', icon: 'Gamepad2' },
      { id: 'embedded', label: 'IoT & ระบบสมองกลฝังตัว', icon: 'Cpu' },
    ],
  },
  {
    id: 2,
    title: 'รูปแบบการเรียนรู้ที่คุณรู้สึกว่าได้ผลดีที่สุดสำหรับคุณ',
    subtitle: 'เลือก 1 รูปแบบที่สอดคล้องกับธรรมชาติของคุณ',
    type: 'singleselect',
    options: [
      { id: 'lab', title: 'เน้นลงมือปฏิบัติจริง (Hands-on / Coding Lab)', desc: 'ชอบนั่งโค้ด แก้บั๊ก ลองทำจริงแล้วเข้าใจเร็วที่สุด' },
      { id: 'theory', title: 'เน้นทำความเข้าใจเชิงทฤษฎี (Deep Conceptual Theory)', desc: 'ชอบเข้าใจที่มา อัลกอริทึม และสูตรคณิตศาสตร์เบื้องหลัง' },
      { id: 'hybrid', title: 'แบบผสมผสานทฤษฎีและเวิร์กช็อป (Blended Workshop)', desc: 'ฟังบรรยายให้เห็นภาพกว้าง แล้วนำไปฝึกประยุกต์ทำแบบฝึกหัด' },
      { id: 'online', title: 'ศึกษาค้นคว้าด้วยตนเอง (Self-Paced / Online)', desc: 'ชอบดูคลิป อ่านเอกสารภาษาอังกฤษ และทำความเข้าใจตามจังหวะตนเอง' },
    ],
  },
  {
    id: 3,
    title: 'สไตล์การทำงานและการแก้ปัญหาที่คุณถนัดที่สุด',
    subtitle: 'เลือก 1 สไตล์ที่คุณรู้สึกสบายใจและมีสมาธิมากที่สุด',
    type: 'singleselect',
    options: [
      { id: 'individual_analytical', title: 'คิดวิเคราะห์เชิงลึกคนเดียว (Solo Problem Solver)', desc: 'ชอบโฟกัสกับปัญหาซับซ้อน ค่อยๆ แกะโค้ดอย่างเงียบสงบ' },
      { id: 'individual_practical', title: 'เน้นสร้างสรรค์ชิ้นงานเดี่ยวอย่างรวดเร็ว (Solo Maker)', desc: 'ชอบทำโปรดักต์จากไอเดียสู่ของจริงด้วยตนเองทุกขั้นตอน' },
      { id: 'group_collaborative', title: 'ทำงานกลุ่มแลกเปลี่ยนไอเดีย (Collaborative Teamwork)', desc: 'ชอบระดมความคิด แบ่งงาน วางแผนระบบ และสลับกันรีวิวโค้ด' },
      { id: 'group_leadership', title: 'ประสานงานและบริหารจัดการ (Product & Project Lead)', desc: 'ชอบบริหารเวลา ออกแบบสถาปัตยกรรม และสื่อสารเชื่อมโยงทีม' },
    ],
  },
  {
    id: 4,
    title: 'ปัจจัยที่สำคัญที่สุดที่คุณใช้ตัดสินใจเลือกวิชาเรียน',
    subtitle: 'อะไรคือสิ่งที่คุณให้คุณค่าสูงสุดในภาคการศึกษานี้?',
    type: 'singleselect',
    options: [
      { id: 'career_value', title: 'ตรงสายงานและเป็นที่ต้องการของตลาดแรงงานสูง', desc: 'ต้องการทักษะที่ใช้หางานหรือสมัครฝึกงานได้ทันที' },
      { id: 'workload_balance', title: 'ภาระงานสมดุล ไม่ชนกันจนเหนื่อยล้าเกินไป', desc: 'ต้องการเวลาพักผ่อน ทบทวนเนื้อหา และทำกิจกรรมอื่น' },
      { id: 'lecturer_style', title: 'สไตล์การสอนและฟีดแบ็กของอาจารย์ผู้สอน', desc: 'ชอบอาจารย์ที่ใส่ใจ ให้คำแนะนำเชิงลึก และเปิดโอกาสซักถาม' },
      { id: 'friends', title: 'มีเพื่อนในกลุ่มหรือสายเดียวกันลงเรียนด้วย', desc: 'อบอุ่นใจ มีเพื่อนคอยปรึกษา แลกเปลี่ยนโน้ต และช่วยกันติว' },
    ],
  },
  {
    id: 5,
    title: 'เป้าหมายระยะสั้นในภาคการศึกษานี้',
    subtitle: 'คุณอยากให้ผลลัพธ์การเรียนในเทอมนี้ตอบโจทย์เรื่องใดมากที่สุด?',
    type: 'singleselect',
    options: [
      { id: 'portfolio', title: 'สร้างผลงานระดับโปรดักชันลง Portfolio / GitHub', desc: 'อยากได้โปรเจกต์เด่นๆ ที่มีผู้ใช้จริงหรือโค้ดคุณภาพสูง' },
      { id: 'gpa', title: 'รักษาหรือเพิ่มระดับคะแนนเฉลี่ย (GPA Booster)', desc: 'อยากเก็บเกรดสวยๆ วางแผนรายวิชาให้มีสัดส่วนคะแนนที่บริหารได้' },
      { id: 'explore', title: 'ค้นหาตัวเองและทดลองทักษะใหม่ๆ ที่ไม่เคยทำ', desc: 'อยากเปิดรับมุมมองใหม่เพื่อตัดสินใจเลือกสายอาชีพในอนาคต' },
      { id: 'deep_specialist', title: 'ก้าวสู่ความเชี่ยวชาญเฉพาะทาง (Specialist)', desc: 'เจาะลึกเฉพาะสาขาที่รักให้เก่งเป็นพิเศษจนโดดเด่น' },
    ],
  },
];
