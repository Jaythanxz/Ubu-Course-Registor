# 🚀 คำแนะนำการนำระบบขึ้น Render (Deploy to Render.com)

ระบบ **UBU Course Registration & Advisory System** ได้รับการตั้งค่าแบบ **Full-Stack Production-Ready** สามารถ Deploy บน [Render.com](https://render.com) ได้ทันทีใน 1-2 นาที รองรับทั้งระบบสมาชิก (Sign Up / Sign In), ฐานข้อมูล (Database), และหน้าเว็บ Single Page Application

---

## 🌟 จุดเด่นของระบบบน Render
1. **Single-Service Architecture:** รันทั้ง Backend Express API และ Frontend React SPA ใน Web Service เดียวกัน ไม่ติดปัญหา CORS และประหยัดโควตา Free Tier ของ Render
2. **Universal Database Compatibility:**
   - **โหมดพร้อมใช้งานทันที (Zero-Config):** หากยังไม่ได้ผูก Database ระบบจะใช้ตัวจัดเก็บข้อมูลแบบ Persistent Store (`server/data/db.json`) อัตโนมัติ ทำให้รันได้ทันทีโดยไม่ล่ม
   - **โหมดเชื่อมต่อ PostgreSQL:** หากผูกกับ Render PostgreSQL หรือ Supabase เพียงระบุ `DATABASE_URL` ระบบจะสร้างตารางและ Seed ข้อมูลให้อัตโนมัติ
   - **โหมดเชื่อมต่อ MySQL:** รองรับ Aiven, Railway, PlanetScale หรือ MySQL ใดๆ ผ่าน `MYSQL_URL`

---

## 🛠️ วิธีที่ 1: Deploy ผ่าน Web Service (แนะนำ ง่ายที่สุดใน 2 นาที)

1. **อัปโหลดโค้ดขึ้น GitHub / GitLab**
   ```bash
   git init
   git add .
   git commit -m "feat: complete ubu registration system with sign up and database"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

2. **เปิดหน้าแดชบอร์ด Render**
   - ไปที่ [dashboard.render.com](https://dashboard.render.com)
   - กดปุ่ม **New +** แล้วเลือก **Web Service**
   - เชื่อมต่อกับ Repository GitHub ของคุณ

3. **ตั้งค่า Build & Start Command ดังนี้:**
   | หัวข้อ | ค่าที่ต้องกรอก |
   |---|---|
   | **Name** | `ubu-registration` (หรือชื่อตามต้องการ) |
   | **Region** | `Singapore (Southeast Asia)` |
   | **Branch** | `main` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `node server/index.js` |
   | **Instance Type** | `Free` |

4. **ตั้งค่า Environment Variables (แถบ Advanced หรือ Environment):**
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `ubu_registration_secret_key_2026` (หรือสุ่มคีย์ตามต้องการ)
   - *(ตัวเลือกเสริม)* `DATABASE_URL` = *(URL PostgreSQL ของ Render หากต้องการ)*

5. **กดปุ่ม "Deploy Web Service"**
   - Render จะดาวน์โหลด dependencies, รัน `vite build`, และสั่ง `node server/index.js`
   - เมื่อขึ้นสถานะ **Live** คุณจะได้รับ URL เช่น `https://ubu-registration.onrender.com` ใช้งานได้ทันที!

---

## 🗄️ วิธีที่ 2: เพิ่ม Render PostgreSQL Database (ทางเลือกเสริม)

1. ในแดชบอร์ด Render กด **New +** -> **PostgreSQL**
2. ตั้งชื่อ Database Name: `ubu_registration`
3. เลือก Region เดียวกัน (`Singapore`)
4. กด **Create Database**
5. คัดลอก **Internal Database URL** แล้วนำไปวางใน Environment Variables ของ Web Service ภายใต้ชื่อ `DATABASE_URL`
6. สั่ง Redeploy ระบบจะรัน Table Schema และ Seed ข้อมูลวิชาเริ่มต้นให้อัตโนมัติ 100%!

---

## 🧪 การทดสอบฟีเจอร์หลัง Deploy
- **หน้าสมัครสมาชิก (Sign Up):** `https://<YOUR-APP>.onrender.com/register`
- **หน้าเข้าสู่ระบบ (Sign In):** `https://<YOUR-APP>.onrender.com/login`
  - บัญชีเริ่มต้นสำหรับทดสอบ:
    - รหัสนักศึกษา: `67114640285`
    - รหัสผ่าน: `password123`
- **Health Check Endpoint:** `https://<YOUR-APP>.onrender.com/api/health`
