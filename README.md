# Lentera Hijaiyah

Web aplikasi pembelajaran Hijaiyah berbasis Next.js App Router, dengan fokus pada:
- Alur autentikasi pengguna
- Pembelajaran modul + quiz
- Pembaca Al-Quran digital (Surah/Juz)
- Canvas huruf Hijaiyah dengan validasi berbasis AI-rule

## Current Status

- Project plan sudah disusun di PROJECT_PLAN.md.
- Phase 0 (Foundation) sudah selesai.
- Implementasi engineering lanjutan sementara diprioritaskan setelah finalisasi desain Figma.

## Product Scope

Public area:
- Landing page
- About us
- Sign in
- Sign up
- Forgot password

Authenticated area:
- Dashboard
- Pembelajaran Modul (teori -> quiz -> skor)
- Al-Quran Digital (pilih Surah/Juz -> baca)
- Canvas Huruf Hijaiyah (pilih huruf -> menulis -> validasi)
- Profile (lihat/edit profile, ganti password, logout)

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Auth: Auth.js (NextAuth)
- Database: PostgreSQL
- ORM: Prisma
- Data Quran: External API
- AI (MVP): Deterministic stroke similarity scoring untuk canvas Hijaiyah

## Project Structure (Target)

```txt
app/
	(public)/
	(auth)/
	api/
components/
lib/
	auth/
	db/
	quran/
	learning/
	hijaiyah/
	validation/
prisma/
```

Referensi detail route dan modul ada di PROJECT_PLAN.md.

## Delivery Plan (Backend / Frontend / AI)

Ringkasan fase:
- Phase 0: Foundation (completed)
- Phase 1: Auth Foundation
- Phase 1a: Account Management
- Phase 2: Quran Reader
- Phase 3: Learning Module
- Phase 4: Hijaiyah Canvas MVP
- Phase 5: Dashboard Orchestration
- Phase 6: Testing and Hardening
- Phase 7: Release Readiness

Setiap fase sudah dipecah ke:
- Backend Tasks
- Frontend Tasks
- AI Tasks

Lihat rincian lengkap di PROJECT_PLAN.md.

## Local Development Setup

## 1) Install dependencies

```bash
bun install
```

## 2) Configure environment variables

Salin dari .env.example ke .env.local lalu isi nilainya.

Minimal environment untuk roadmap saat ini:
- NEXT_PUBLIC_APP_URL
- DATABASE_URL
- AUTH_SECRET

## 3) Run development server

```bash
bun run dev
```

App akan berjalan di:
- http://localhost:3000

## 4) Build for production

```bash
bun run build
bun run start
```

## 5) Lint

```bash
bun run lint
```

## Documentation References

- Main plan: PROJECT_PLAN.md
- Agent/workflow rules: AGENTS.md
- Additional instructions alias: CLAUDE.md

## Notes

- UI font utama saat ini menggunakan Montserrat Alternates dari Google Fonts.
- Desain publik sedang disesuaikan mengikuti Figma sebelum lanjut ke Phase 1.
