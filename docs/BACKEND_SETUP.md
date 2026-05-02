# 🕌 Lentera Hijaiyah — Dokumentasi Setup Backend

Dokumen ini memandu kamu dari nol untuk menjalankan backend **Lentera Hijaiyah** secara lokal. Backend dibangun di atas **Next.js App Router** (API Routes), **PostgreSQL**, dan **Prisma ORM**, dengan autentikasi berbasis **Custom JWT + Edge Middleware**.

---

## tutorial setup

1. npm install
2. Docker compose up -d db
3. npx prisma generate
4. npm run migrate
5. npm run dev

## masuk prisma studio

npm run db

---

## Konfigurasi Environment Variables

Buat file `.env` di root proyek. Salin template berikut, lalu sesuaikan nilainya:

```bash
# Salin template (dari .env.example jika ada, atau buat manual)
cp .env.example .env
```

Isi `.env` dengan nilai berikut:

Salin output-nya dan tempelkan sebagai nilai `AUTH_SECRET` di `.env`.

## Setup Database dengan Docker

Backend menggunakan **PostgreSQL 15** yang dijalankan via Docker Compose.

### Menjalankan PostgreSQL

```bash
# Jalankan container PostgreSQL di background
docker compose up -d db
```

Verifikasi container berjalan:

```bash
docker compose ps
```

Output yang diharapkan:

```
NAME                    STATUS          PORTS
lenterahijaiyah-db-1    running (healthy)   0.0.0.0:5432->5432/tcp
```

### Konfigurasi Docker Compose

File `docker-compose.yml` di root proyek mendefinisikan dua service:

| Service         | Port   | Deskripsi                             |
| --------------- | ------ | ------------------------------------- |
| `db`            | `5432` | PostgreSQL 15 (database utama)        |
| `prisma-studio` | `5555` | GUI browser untuk database (opsional) |

> **Penting:** Port lokal yang dipakai adalah `5432`. Pastikan tidak ada proses lain yang menempati port ini. Jika konflik, ubah port di `docker-compose.yml` dan update `DATABASE_URL` di `.env` secara bersamaan.

### Menghentikan Database

```bash
# Hentikan container tanpa menghapus data
docker compose stop

# Hentikan DAN hapus container (data tetap aman di volume)
docker compose down

# Hentikan DAN hapus semua data (HATI-HATI: data terhapus permanen!)
docker compose down -v
```

---

## 5. Menjalankan Migrasi Prisma

Setelah database PostgreSQL berjalan, jalankan migrasi untuk membuat semua tabel:

```bash
# Buat dan terapkan migrasi (untuk development)
npm run migrate
```

Perintah ini setara dengan `prisma migrate dev` dan akan:

1. Membaca skema di `prisma/schema.prisma`.
2. Membuat file migrasi baru di `prisma/migrations/` (jika ada perubahan skema).
3. Menerapkan semua migrasi ke database.
4. Men-generate Prisma Client terbaru secara otomatis.

### Tabel yang Akan Dibuat

| Tabel                   | Deskripsi                                              |
| ----------------------- | ------------------------------------------------------ |
| `users`                 | Data akun pengguna (email, password hash, nama, role)  |
| `password_reset_tokens` | Token sementara untuk reset password                   |
| `user_quran_progress`   | Progres baca Al-Quran per user (surah & ayah terakhir) |
| `module_categories`     | Kategori modul pembelajaran                            |
| `modules`               | Konten modul pembelajaran                              |
| `user_module_progress`  | Status penyelesaian modul per user                     |

### Perintah Prisma Lainnya

```bash
# Generate ulang Prisma Client (tanpa migrasi)
npx prisma generate

# Lihat status migrasi
npx prisma migrate status

# Reset database dan jalankan ulang semua migrasi (HAPUS SEMUA DATA!)
npx prisma migrate reset

# Terapkan migrasi ke database production (tanpa membuat migrasi baru)
npx prisma migrate deploy
```

---

## 6. Menjalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`.

### Urutan Startup yang Benar

Ikuti urutan ini setiap kali memulai pengembangan:

```
1. Buka Docker Desktop → pastikan running
2. docker compose up -d db
3. npm run dev
```

---

## 7. Prisma Studio (GUI Database)

Prisma Studio adalah antarmuka browser untuk melihat dan mengedit data database secara visual.

### Opsi 1: Jalankan Langsung (Lokal)

```bash
npm run db
```

Buka browser ke `http://localhost:5555`.

### Opsi 2: Jalankan via Docker

```bash
docker compose up prisma-studio
```

Buka browser ke `http://localhost:5555`.

> Opsi via Docker berguna jika kamu ingin menjalankan Prisma Studio di environment yang terisolasi tanpa perlu Node.js di mesin host.

---

## 8. Arsitektur Backend

### Teknologi Utama

| Komponen      | Teknologi                   | Keterangan                           |
| ------------- | --------------------------- | ------------------------------------ |
| Framework     | Next.js 16 App Router       | API Routes sebagai backend REST      |
| Bahasa        | TypeScript                  | Type-safe di seluruh codebase        |
| Database      | PostgreSQL 15               | Dijalankan via Docker                |
| ORM           | Prisma 7                    | Schema-driven, type-safe queries     |
| Driver DB     | `pg` + `@prisma/adapter-pg` | Driver adapter resmi Prisma untuk pg |
| Autentikasi   | Custom JWT (jose)           | HS256, payload minimal `{id, role}`  |
| Hash Password | bcryptjs                    | Untuk credential-based login         |
| Validasi      | Zod                         | Schema validation di semua endpoint  |
| Proteksi Rute | Next.js Edge Middleware     | Berjalan di Edge Runtime             |
| OAuth         | google-auth-library         | Verifikasi token Google di server    |

### Alur Request Backend

```
Client (Browser/Postman)
        │
        ▼
  middleware.ts (Edge Middleware)
  ├── Baca token dari cookie "access_token" ATAU header "Authorization: Bearer"
  ├── Verifikasi JWT dengan AUTH_SECRET
  ├── Jika valid → inject x-user-id & x-user-role ke request headers
  └── Jika invalid & rute private → return 401 Unauthorized
        │
        ▼
  app/api/v1/[...]/route.ts (Route Handler)
  ├── Baca x-user-id dari headers (sudah diinject Middleware)
  ├── Validasi request body dengan Zod
  ├── Jalankan business logic
  └── Query database via Prisma
        │
        ▼
  lib/db/prisma.ts (Prisma Singleton)
        │
        ▼
  PostgreSQL (Docker Container)
```

---

## 9. Endpoint API

Base URL: `http://localhost:3000/api/v1`

### Auth Endpoints (Publik — tidak perlu token)

| Method | Endpoint                | Deskripsi                                |
| ------ | ----------------------- | ---------------------------------------- |
| `POST` | `/auth/register`        | Daftarkan akun baru                      |
| `POST` | `/auth/login`           | Login dengan email & password            |
| `POST` | `/auth/google`          | Login/register dengan Google OAuth token |
| `POST` | `/auth/forgot-password` | Kirim link reset password                |
| `POST` | `/auth/reset-password`  | Reset password dengan token              |

### Auth Endpoints (Private — perlu token)

| Method | Endpoint       | Deskripsi                         |
| ------ | -------------- | --------------------------------- |
| `GET`  | `/auth/me`     | Cek profil user yang sedang login |
| `POST` | `/auth/logout` | Logout (hapus cookie token)       |

### User Endpoints (Private — perlu token)

| Method  | Endpoint         | Deskripsi                                       |
| ------- | ---------------- | ----------------------------------------------- |
| `GET`   | `/user/profile`  | Ambil data profil user                          |
| `PATCH` | `/user/profile`  | Update data profil user                         |
| `PATCH` | `/user/password` | Ganti password (butuh verifikasi password lama) |

### Cara Mengirim Token

**Via Cookie (diset otomatis setelah login dari browser):**

```
Cookie: access_token=<JWT_TOKEN>
```

**Via Authorization Header (untuk Postman / Mobile):**

```
Authorization: Bearer <JWT_TOKEN>
```

### Contoh Request: Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Ahmad Fulan",
  "email": "ahmad@example.com",
  "password": "password123"
}
```

**Response sukses (201):**

```json
{
  "message": "Registrasi berhasil.",
  "user": {
    "id": "uuid...",
    "name": "Ahmad Fulan",
    "email": "ahmad@example.com",
    "role": "user"
  }
}
```

### Contoh Request: Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "ahmad@example.com",
  "password": "password123"
}
```

**Response sukses (200):**

```json
{
  "message": "Login berhasil.",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "uuid...",
    "name": "Ahmad Fulan",
    "email": "ahmad@example.com",
    "role": "user"
  }
}
```

> Cookie `access_token` (Http-Only) akan diset otomatis di response untuk session browser.

---

## 10. Alur Autentikasi

### Login Credential (Email & Password)

```
Client → POST /api/v1/auth/login {email, password}
  → Middleware: rute publik, langsung dilewatkan
  → Route Handler:
      1. Validasi body dengan Zod loginSchema
      2. Cari user di DB berdasarkan email
      3. Bandingkan password dengan bcrypt.compare()
      4. Buat JWT: signJwt({id, role}, "7d")
      5. Set Cookie: access_token (Http-Only, 7 hari)
      6. Return { token, user }
```

### Login Google OAuth

```
Client (Frontend) → Verifikasi dengan @react-oauth/google → Dapatkan idToken
Client → POST /api/v1/auth/google { idToken }
  → Route Handler:
      1. Verifikasi idToken dengan google-auth-library
      2. Ekstrak email & name dari payload Google
      3. Cari atau buat user di database (upsert)
      4. Buat JWT & set cookie
      5. Return { token, user }
```

### Akses Rute Terproteksi

```
Client → GET /api/v1/user/profile
  Header: Authorization: Bearer <JWT_TOKEN>
  → Middleware:
      1. Baca token dari header
      2. verifyJwt(token) → { id, role }
      3. Inject x-user-id & x-user-role ke headers
  → Route Handler:
      1. Baca req.headers.get("x-user-id")
      2. Query DB: prisma.user.findUnique({ where: { id } })
      3. Return data profil
```

---

## 11. Struktur File Backend

```
lenteraHijaiyah/
├── .env                          # Environment variables (jangan di-commit!)
├── docker-compose.yml            # Konfigurasi PostgreSQL & Prisma Studio
├── Dockerfile.prisma             # Dockerfile untuk container Prisma Studio
├── prisma.config.ts              # Konfigurasi Prisma CLI
├── middleware.ts                 # Edge Middleware (auth guard & token injection)
│
├── prisma/
│   ├── schema.prisma             # Definisi skema database (models & relasi)
│   └── migrations/               # File migrasi SQL yang di-generate Prisma
│       └── 20260420132942_init/
│
├── lib/
│   ├── db/
│   │   └── prisma.ts             # Singleton Prisma Client (pg adapter)
│   ├── auth/
│   │   └── jwt.ts                # Utilitas signJwt() & verifyJwt()
│   ├── validation/
│   │   └── auth.ts               # Zod schemas: registerSchema, loginSchema
│   └── config/
│       └── env.ts                # Validasi & ekspor environment variables
│
└── app/
    └── api/
        └── v1/
            ├── auth/
            │   ├── register/route.ts
            │   ├── login/route.ts
            │   ├── logout/route.ts
            │   ├── me/route.ts
            │   ├── google/route.ts
            │   ├── forgot-password/route.ts
            │   └── reset-password/route.ts
            └── user/
                ├── profile/route.ts
                └── password/route.ts
```

---

## 12. Troubleshooting

### ❌ Error: `Can't reach database server at localhost:5432`

**Penyebab:** Container PostgreSQL belum berjalan atau port konflik.

**Solusi:**

```bash
# Cek apakah Docker Desktop berjalan, lalu:
docker compose up -d db
docker compose ps  # Pastikan status "running"
```

---

### ❌ Error: `Missing required environment variable: DATABASE_URL`

**Penyebab:** File `.env` tidak ada atau variabel tidak diisi.

**Solusi:**

1. Pastikan file `.env` ada di root proyek (sama level dengan `package.json`).
2. Pastikan nilai `DATABASE_URL` sudah diisi dengan benar.
3. Restart dev server setelah mengubah `.env`.

---

### ❌ Error: `Missing AUTH_SECRET environment variable`

**Penyebab:** `AUTH_SECRET` kosong atau tidak diset.

**Solusi:**

```bash
# Generate secret baru
openssl rand -base64 32
# Salin output ke .env sebagai nilai AUTH_SECRET
```

---

### ❌ Error: `P1001: Can't reach database server` saat migrate

**Penyebab:** Database belum siap menerima koneksi (baru saja distart).

**Solusi:**

```bash
# Tunggu beberapa detik, lalu coba lagi
docker compose up -d db
# Tunggu ~5 detik
npm run migrate
```

---

### ❌ Port 5432 sudah dipakai

**Penyebab:** Ada proses lain (biasanya PostgreSQL lokal) yang menempati port 5432.

**Solusi:** Edit `docker-compose.yml`, ubah port mapping di service `db`:

```yaml
ports:
  - "5433:5432" # Ubah 5432 menjadi 5433 (atau port lain yang bebas)
```

Lalu update juga `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5433/lentera_hijaiyah?schema=public"
```

---

### ❌ `prisma generate` gagal / Prisma Client tidak ter-generate

**Solusi:**

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install

# Atau generate ulang secara manual
npx prisma generate
```

---

## Referensi Cepat (Cheatsheet)

```bash
# === SETUP PERTAMA KALI ===
npm install                    # Install dependensi
docker compose up -d db        # Jalankan PostgreSQL
npm run migrate                # Buat tabel database
npm run dev                    # Jalankan dev server

# === PENGGUNAAN SEHARI-HARI ===
docker compose up -d db        # Nyalakan database
npm run dev                    # Jalankan server
npm run db                     # Buka Prisma Studio (GUI)
docker compose stop            # Matikan database

# === DATABASE MANAGEMENT ===
npm run migrate                # Buat & apply migrasi baru
npx prisma generate            # Regenerate Prisma Client
npx prisma migrate status      # Cek status migrasi
npx prisma migrate reset       # RESET database (hapus semua data!)

# === DEBUGGING ===
docker compose logs db         # Lihat log PostgreSQL
docker compose ps              # Cek status container
```

---

_Dokumen ini dibuat berdasarkan implementasi Phase 1 & Phase 1a. Perbarui dokumen ini saat ada endpoint atau konfigurasi baru yang ditambahkan._
