# Brillz Brain

Brillz Brain เป็นโครงสร้างพื้นฐานสำหรับระบบ AI dashboard ที่รวมการจัดการคู่มือระบบ สื่อสารกับ OpenAI และเชื่อมต่อข้อมูลจาก Supabase

## การติดตั้ง

```bash
npm install
cp .env.example .env.local
npm run dev
```

## โครงสร้างโปรเจกต์

- `app/` — หน้าเว็บและ route API
- `components/` — ส่วนประกอบ UI ที่นำกลับมาใช้ซ้ำได้
- `lib/` — ตัวช่วยเชื่อมต่อ OpenAI, Supabase และฟังก์ชันกลาง
- `modules/` — ระบบย่อยของ Brillz
- `supabase/` — schema, migration และ RLS
- `tests/` — ทดสอบ API และความปลอดภัย

## ตัวแปรสภาพแวดล้อม

```env
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Scripts

```bash
npm run dev
npm run build
npm run test
```
