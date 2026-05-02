-- Dummy data untuk pengujian fungsi login/register
-- Catatan:
-- 1) Password sudah di-hash menggunakan bcrypt (cost 10)
-- 2) Jalankan setelah table users dibuat
-- 3) Script ini idempotent untuk email yang sama (upsert by email)

INSERT INTO users (id, email, password, name, role, created_at, updated_at)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'student.demo@lentera.dev',
    '$2b$10$slj6t3GIbxL052JB1cLHq.xNhyZ4ufqmSfBXObx1BFyqE7rpPKDZO',
    'Demo Student',
    'USER',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'guru.demo@lentera.dev',
    '$2b$10$HLGPGdqi0ewxh7Fjl9sWluM7XC5a7vHdpzzMlfml6BVchC9aC.ONy',
    'Demo Guru',
    'USER',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'admin.demo@lentera.dev',
    '$2b$10$zzqkWnqXv.wyuxCP3D6iTu3bQPjq67kOR5lStKkN63fXOee3Ta3Oi',
    'Demo Admin',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT (email)
DO UPDATE SET
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = CURRENT_TIMESTAMP;

-- Kredensial plaintext untuk testing endpoint login:
-- 1) student.demo@lentera.dev / Password123!
-- 2) guru.demo@lentera.dev / BelajarHijaiyah1!
-- 3) admin.demo@lentera.dev / AdminSecure123!

-- Payload contoh untuk endpoint register:
-- {
--   "name": "User Baru",
--   "email": "baru.user@lentera.dev",
--   "password": "PasswordBaru123!"
-- }
