# Company Planning — Gerçek MVP

Next.js + Supabase tabanlı çalışan vardiya planlama sistemi.

## Kurulum
1. `.env.local.example` dosyasını `.env.local` olarak kopyala.
2. Supabase Project URL ve Publishable Key değerlerini `.env.local` içine koy.
3. `npm install`
4. `npm run dev`

## Admin
Yeni kayıtlar employee olur. Admin hesabını oluşturduktan sonra Supabase SQL Editor'da:
UPDATE public.profiles SET role='admin'
WHERE id=(SELECT id FROM auth.users WHERE email='ADMIN_EMAIL');

## İçerik
- Çalışan kayıt/giriş
- Admin/employee rolü
- Gerçek Supabase database
- Vardiya gönderme
- Admin planning
- Onay/reddet/sil
- Filtreleme
- CSV
- Mobil uyumlu arayüz
