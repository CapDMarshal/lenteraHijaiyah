# Dokumentasi Testing Learning (Phase 3) - Postman

Dokumen ini menjelaskan cara menguji endpoint Learning (PDF Module) menggunakan Postman.

## Persiapan

1. Import koleksi di Postman dari file `docs/postman_collection.json`.
2. Pastikan variable `base_url` sudah sesuai (default: `http://localhost:3000`).
3. Jalankan `Auth > Login` untuk mendapatkan `token`.
4. Isi variable `jwt_token` dengan token dari response login jika tidak menggunakan cookie.

## Variabel Tambahan

- `category_id`: isi dengan ID kategori hasil response `Get Categories`.
- `module_id`: isi dengan ID modul hasil response `Get Modules by Category`.

## Urutan Testing yang Disarankan

1. **Auth > Login**
2. **Learning > Get Categories**
3. **Learning > Get Modules by Category**
4. **Learning > Get Module Detail**
5. **Learning > Get Progress**
6. **Learning > Update Progress**

## Catatan

- Semua endpoint Learning membutuhkan autentikasi. Gunakan cookie atau `Authorization: Bearer {{jwt_token}}`.
- Field `pdfUrl` dibentuk dari `MINIO_PUBLIC_URL` + `MINIO_BUCKET` + `pdfKey`.
