# Dokumentasi Authentication (Phase 1)

Direktori ini berisi seluruh pekerjaan yang sudah diselesaikan pada `Phase 1 - Auth Foundation`.
Kami beralih dari menggunakan _NextAuth_ menjadi **Custom JWT + Edge Middleware** untuk mengakomodasi arsitektur REST API murni, sehingga bisa dikonsumsi oleh client manapun (Posman, Frontend Web, Mobile) dengan kontrol penuh.

## Fitur yang Telah Diimplementasikan:

1. **Prisma Setup**: Singleton Prisma Client `lib/db/prisma.ts`.
2. **JWT Utilities (`lib/auth/jwt.ts`)**: Fungsi `signJwt` dan `verifyJwt` menggunakan modul `jose` yang ramah environment Edge/Next.js Middleware. Payload di-setting _minimalist_ (hanya memuat `id` dan `role`).
3. **Endpoint Register (`POST /api/v1/auth/register`)**: Menerima pendaftaran pengguna, memilah _schema_ dengan Zod, dan hashing password dengan bcryptjs.
4. **Endpoint Login (`POST /api/v1/auth/login`)**: Autentikasi email & validasi password bcrypt. Membalas dengan _JSON Token_ sekaligus _Set-Cookie: auth_token_ (Http-Only).
5. **Endpoint Google OAuth (`POST /api/v1/auth/google`)**: Pola _Token-Verification_ dari library `@react-oauth/google` di Frontend. Memverifikasi dengan `google-auth-library` Node.js tanpa perlu `Client Secret` maupun _redirect callback_.
6. **Edge Middleware (`middleware.ts`)**: Jantung proteksi aplikasi, memvalidasi JWT dari `cookies` maupun `authorization header`, mendepak _user_ tidak login dari Dashboard dan menyuntikkan ID/Role profil (`x-user-id`) ke backend HTTP headers secara aman untuk rute API selanjutnya.
7. **Endpoint Me (`GET /api/v1/auth/me`)**: Menerima permintaan _cek status profile_. Tidak perlu bongkar token dua kali, langsung mengonsumsi header `x-user-id` hasil suntikan Middleware.
8. **Endpoint Logout (`POST /api/v1/auth/logout`)**: Melakukan reset hard-cookie pada _response middleware_ (menghapus cookie `auth_token`).
9. **Endpoint Forgot Password (`POST /api/v1/auth/forgot-password`)**: Menerbitkan token reset dan mengirim email reset password via SMTP Brevo.
10. **Endpoint Reset Password (`POST /api/v1/auth/reset-password`)**: Memvalidasi token reset, memperbarui password, dan menghapus token reset.

## Lokasi Dokumentasi Penunjang:

Terdapat dua file penting tambahan yang telah digenerate pada direktori `docs/`:

### 1. `postman_collection.json`

- **Cara Penggunaan**: Buka aplikasi Postman -> Klik tombol **"Import"** di kiri atas -> Pilih file lokal `docs/postman_collection.json`.
- Lengkap beserta setup Variable `base_url` lokal di `http://localhost:3000`.

### 2. `swagger.yaml` (OpenAPI 3.0)

- **Cara Penggunaan**: Copy seluruh isi file `docs/swagger.yaml` dan _Paste_ di editor online seperti [editor.swagger.io](https://editor.swagger.io) atau hubungkan di _project documentation tooling_ Anda.
- Terstruktur rapi beserta deskripsi status balasan (`200 OK`, `400 Bad Request`, `401 Unauthorized`) dan schema JSON-nya.

## Catatan SMTP Brevo (Forgot Password)

Endpoint forgot password menggunakan SMTP Brevo. Pastikan environment berikut tersedia:

- `BREVO_SMTP_HOST`
- `BREVO_SMTP_PORT`
- `BREVO_SMTP_USER`
- `BREVO_SMTP_PASSWORD`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
