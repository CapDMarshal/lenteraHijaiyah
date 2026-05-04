# 📝 Backend Changes — Module Progress Pipeline

> **Konteks:** Dokumen ini menjelaskan perubahan backend yang dilakukan oleh tim frontend karena adanya ketidakcocokan antara sistem modul lokal (slug-based) dan database (UUID-based). Dibuat agar backend dev tidak kebingungan saat melihat kode baru.

---

## Latar Belakang Masalah

Sebelum perubahan ini, ada **dua sistem modul yang tidak terhubung**:

| Lapisan | Identifier | Sumber Data |
|---|---|---|
| Halaman frontend (`/modul`, `/modul/[slug]`) | `slug` string | `data/modul.ts` (statis lokal) |
| Tabel DB (`modules`) | `id` UUID | PostgreSQL via Prisma |
| Progress API (`POST /api/v1/learning/progress`) | `moduleId` UUID | Butuh UUID dari DB |

Akibatnya, tombol **"Tandai selesai dibaca"** di halaman `/modul/[slug]` tidak bisa memanggil API karena tidak tahu `moduleId` (UUID) dari modul yang sedang dibuka. Data `UserModuleProgress` selalu kosong, sehingga dashboard "Aktivitas Belajar" tidak menampilkan data apapun.

---

## Ringkasan Perubahan

### 1. Schema Prisma — Tambah field `slug` ke `Module`

**File:** `prisma/schema.prisma`

```diff
 model Module {
   id         String   @id @default(uuid())
+  slug       String   @unique
   title      String
   content    String   @db.Text
   pdfKey     String
   categoryId String
   ...
 }
```

**Kenapa:** `slug` menjadi jembatan antara URL frontend (`/modul/fikih-kelas-8`) dan UUID di database. Tanpa field ini, frontend tidak bisa mencari modul yang sedang dibuka di DB.

**Cara apply ke DB:**
```bash
# Karena dev server aktif, gunakan db push (bukan migrate dev)
npx prisma db push --accept-data-loss
npx prisma generate
```

> [!NOTE]
> Untuk environment production atau jika ingin migration history, buat migration SQL manual:
> ```sql
> ALTER TABLE "modules" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';
> CREATE UNIQUE INDEX "modules_slug_key" ON "modules"("slug");
> ```
> Lalu update semua baris slug sebelum menghapus `DEFAULT ''`.

---

### 2. Seed Script — Isi DB dari File PDF Nyata

**File baru:** `prisma/seed.ts`
**File diubah:** `prisma.config.ts`, `package.json`

Seed script ini mengisi tabel `module_categories` dan `modules` berdasarkan file PDF yang ada di `public/pdf/modul/`.

**Cara jalankan:**
```bash
bun prisma/seed.ts
```

**Data yang di-seed:**

| Kategori | Modul | Slug | pdfKey |
|---|---|---|---|
| Aqidah Akhlak | Akidah Akhlak MTs Kelas VII | `akidah-akhlak-kelas-7` | `pdf/modul/aqidah akhlak/AKIDAH AKHLAK MTS KELAS VII.pdf` |
| Bahasa Arab | Bahasa Arab Kelas VII | `bahasa-arab-kelas-7` | `pdf/modul/bahasa arab/BAHASA ARAB KELAS VII.pdf` |
| Bahasa Arab | Bahasa Arab Kelas VIII | `bahasa-arab-kelas-8` | `pdf/modul/bahasa arab/BAHASA ARAB KELAS VIII.pdf` |
| Bahasa Arab | Bahasa Arab Kelas IX | `bahasa-arab-kelas-9` | `pdf/modul/bahasa arab/BAHASA ARAB KELAS IX.pdf` |
| Fiqih | Fikih Kelas VIII | `fikih-kelas-8` | `pdf/modul/fiqih/FIKIH KELAS VIII.pdf` |
| Pendidikan Agama Islam | PAI Kelas VIII | `pai-kelas-8` | `pdf/modul/pendidikan agama islam/PAI KELAS VIII.pdf` |
| Sejarah Kebudayaan Islam | SKI Kelas VIII | `ski-kelas-8` | `pdf/modul/sejarah kebudayaan islam/SEJARAH KEBUDAYAAN ISLAM KELAS VIII.pdf` |

> [!IMPORTANT]
> Seed menggunakan `upsert` by `slug` untuk modul — aman dijalankan berulang kali tanpa duplikasi.
> Untuk kategori digunakan `findFirst` + `create` karena `name` tidak `@unique` di schema. Jika backend ingin menjamin uniqueness, pertimbangkan untuk menambahkan `@@unique([name])` ke `ModuleCategory`.

**Perubahan konfigurasi seed:**

`prisma.config.ts`:
```diff
-  seed: "node prisma/seed.js",
+  seed: "bun prisma/seed.ts",
```

`package.json` — duplikat key `prisma` juga dihapus:
```diff
-  "prisma": { "seed": "node prisma/seed.js" },
-  "prisma": { "seed": "node prisma/seed.js" },
+  "prisma": { "seed": "bun prisma/seed.ts" },
```

---

### 3. API Baru — `GET /api/v1/learning/modules`

**File diubah:** `app/api/v1/learning/modules/route.ts`

Menambahkan handler `GET` (sebelumnya hanya ada `POST` yang khusus admin).

**Siapa yang bisa akses:** Semua user yang sudah login (cukup punya `x-user-id` di header — diinject oleh middleware).

**Response:**
```json
{
  "modules": [
    {
      "id": "uuid-xxx",
      "slug": "fikih-kelas-8",
      "title": "Fikih Kelas VIII",
      "categoryId": "uuid-yyy",
      "category": { "name": "Fiqih" }
    }
  ]
}
```

**Dipakai oleh:** Halaman `/modul/[slug]` untuk resolve `slug → moduleId` sebelum memanggil `POST /api/v1/learning/progress`.

---

## Alur Lengkap Setelah Perubahan

```
User buka /modul/fikih-kelas-8
  │
  ├─ [on mount] GET /api/v1/learning/modules
  │    → cari module dengan slug === "fikih-kelas-8"
  │    → simpan moduleId (UUID) ke state
  │
  ├─ [on mount] GET /api/v1/learning/progress
  │    → cek apakah moduleId ini sudah isCompleted = true
  │    → jika ya, tampilkan tombol ✅ Sudah selesai dibaca
  │
  └─ [on click "Tandai selesai dibaca"]
       POST /api/v1/learning/progress
       body: { moduleId: "uuid-xxx", isCompleted: true }
       → UserModuleProgress di-create/update
       → tombol berubah jadi ✅ Sudah selesai dibaca

User buka /dashboard
  │
  ├─ Prisma: UserModuleProgress.findFirst({ isCompleted: false }) → "Sedang dipelajari"
  ├─ Prisma: UserModuleProgress.findFirst({ isCompleted: true, orderBy: completedAt desc }) → "Terakhir diselesaikan"
  ├─ Prisma: UserModuleProgress.count({ isCompleted: true }) + Module.count() → progress bar
  └─ Link ke /modul/{module.slug} (bukan UUID)
```

---

## File yang Berubah

| File | Tipe | Keterangan |
|---|---|---|
| `prisma/schema.prisma` | Modified | Tambah `slug String @unique` ke `Module` |
| `prisma/seed.ts` | **New** | Seed 5 kategori + 7 modul dari file PDF nyata |
| `prisma.config.ts` | Modified | Seed command → `bun prisma/seed.ts` |
| `package.json` | Modified | Hapus duplikat key `prisma`, update seed command |
| `data/modul.ts` | Modified | 12 placeholder → 7 modul nyata + kategori SKI baru |
| `app/api/v1/learning/modules/route.ts` | Modified | Tambah handler `GET` (list semua modul) |
| `app/(auth)/modul/[slug]/page.tsx` | Modified | Tombol "Tandai selesai dibaca" sekarang memanggil API |
| `app/(auth)/dashboard/page.tsx` | Modified | Query pilih `slug`, link ke `/modul/{slug}` |
| `lib/config/env.ts` | Modified | MinIO env vars dibuat optional (tidak wajib ada) |
| `app/api/v1/learning/modules/route.ts` | Modified | Import minio dijadikan lazy `dynamic import()` di POST |
| `app/api/v1/learning/progress/route.ts` | Modified | Import minio dihapus, `pdfUrl` fallback ke `pdfKey` |

---

## Hal yang Perlu Diperhatikan Backend

> [!WARNING]
> **`pdfKey` di DB saat ini berisi path lokal** (`pdf/modul/fiqih/FIKIH KELAS VIII.pdf`), bukan MinIO object key. Ini sengaja untuk development. Jika backend ingin mengintegrasikan MinIO, update kolom `pdfKey` di semua modul ke MinIO key yang sesuai setelah upload.

> [!NOTE]
> **Tidak ada migration file** untuk perubahan `slug` ini — digunakan `prisma db push` karena dev server aktif. Jika ingin migration history yang proper, buat migration SQL secara manual dan jalankan `prisma migrate resolve`.

> [!TIP]
> Seed bisa dijalankan ulang kapan saja tanpa duplikasi karena menggunakan `upsert` by `slug`. Aman untuk reset environment.

---

## Mengembalikan MinIO ke Mode Wajib (Revert)

Saat ini MinIO env vars dibuat **optional** karena environment frontend tidak memiliki konfigurasi MinIO. Saat backend siap mengintegrasikan MinIO kembali, lakukan langkah berikut:

### 1. Restore `lib/config/env.ts`

Kembalikan semua `getOptionalEnv` ke `getRequiredEnv` untuk MinIO:

```diff
- minioEndpoint: getOptionalEnv("MINIO_ENDPOINT"),
- minioRegion: getOptionalEnv("MINIO_REGION", "us-east-1"),
- minioAccessKey: getOptionalEnv("MINIO_ACCESS_KEY"),
- minioSecretKey: getOptionalEnv("MINIO_SECRET_KEY"),
- minioBucket: getOptionalEnv("MINIO_BUCKET"),
- minioPublicUrl: getOptionalEnv("MINIO_PUBLIC_URL"),
+ minioEndpoint: getRequiredEnv("MINIO_ENDPOINT"),
+ minioRegion: getRequiredEnv("MINIO_REGION"),
+ minioAccessKey: getRequiredEnv("MINIO_ACCESS_KEY"),
+ minioSecretKey: getRequiredEnv("MINIO_SECRET_KEY"),
+ minioBucket: getRequiredEnv("MINIO_BUCKET"),
+ minioPublicUrl: getRequiredEnv("MINIO_PUBLIC_URL"),
```

Hapus juga fungsi `getOptionalEnv` jika tidak dipakai di tempat lain.

### 2. Restore `app/api/v1/learning/modules/route.ts`

Kembalikan import minio ke top-level dan hapus lazy import di POST:

```diff
+import { getMinioPublicUrl } from "@/lib/storage/minio";
 
 // ... di dalam POST handler:
-    let pdfUrl = pdfKey;
-    try {
-      const { getMinioPublicUrl } = await import("@/lib/storage/minio");
-      pdfUrl = getMinioPublicUrl(pdfKey);
-    } catch {
-      // MinIO not configured, fall back to raw key
-    }
-    return NextResponse.json({ module: { ...module, pdfUrl } });
+    return NextResponse.json({ module: { ...module, pdfUrl: getMinioPublicUrl(module.pdfKey) } });
```

### 3. Restore `app/api/v1/learning/progress/route.ts`

Kembalikan import minio ke top-level dan `pdfUrl` ke `getMinioPublicUrl`:

```diff
+import { getMinioPublicUrl } from "@/lib/storage/minio";
 
 // ... di dalam GET handler:
-            pdfUrl: item.module.pdfKey,
+            pdfUrl: getMinioPublicUrl(item.module.pdfKey),
```

### 4. Isi `.env` dengan nilai MinIO yang benar

```env
MINIO_ENDPOINT=https://your-minio-server.com
MINIO_REGION=us-east-1
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=your-bucket-name
MINIO_PUBLIC_URL=https://your-minio-public-url.com
MINIO_SSL_VERIFY=true
```

### 5. Update kolom `pdfKey` di DB

Saat ini `pdfKey` di tabel `modules` berisi path lokal (`pdf/modul/fiqih/FIKIH KELAS VIII.pdf`). Setelah upload file ke MinIO, update setiap baris dengan MinIO object key yang sesuai:

```sql
-- Contoh update manual via Prisma Studio atau psql
UPDATE modules SET "pdfKey" = 'modul/fiqih/FIKIH KELAS VIII.pdf' WHERE slug = 'fikih-kelas-8';
```

Atau buat endpoint admin khusus untuk update `pdfKey` per modul.

> [!CAUTION]
> Jangan restore ke `getRequiredEnv` sebelum semua MinIO env vars sudah diisi di `.env`. Server akan crash saat startup jika ada satu saja yang kosong.
