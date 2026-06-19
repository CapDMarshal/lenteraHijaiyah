"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ModulePdfReader } from "@/components/modul/ModulePdfReader";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
  description?: string | null;
  modulesCount?: number;
};

type ModuleItem = {
  id: string;
  title: string;
  slug: string;
  pdfKey: string;
  pdfUrl: string;
  categoryId: string;
  category?: { name: string } | null;
};

type PresignPayload = {
  uploadUrl: string;
  key: string;
  pdfUrl: string;
};

export default function LearningAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [meError, setMeError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [folder, setFolder] = useState("modul");

  const [file, setFile] = useState<File | null>(null);
  const [pdfKey, setPdfKey] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId) ?? null,
    [categories, categoryId],
  );

  const isAdmin = role === "ADMIN";

  const loadMe = useCallback(async () => {
    setMeError(null);
    try {
      const res = await fetch("/api/v1/auth/me");
      if (!res.ok) {
        throw new Error("Gagal memuat profil");
      }
      const payload = (await res.json()) as { user: { role: string } };
      setRole(payload.user?.role ?? null);
    } catch (error) {
      console.error("LEARNING_ADMIN_ME_ERROR", error);
      setMeError("Gagal memuat role pengguna.");
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setListError(null);

    try {
      const [categoriesRes, modulesRes] = await Promise.all([
        fetch("/api/v1/learning/categories"),
        fetch("/api/v1/learning/modules"),
      ]);

      if (!categoriesRes.ok || !modulesRes.ok) {
        throw new Error("Gagal memuat data modul");
      }

      const categoriesPayload = (await categoriesRes.json()) as {
        categories: Category[];
      };
      const modulesPayload = (await modulesRes.json()) as {
        modules: ModuleItem[];
      };

      setCategories(categoriesPayload.categories ?? []);
      setModules(modulesPayload.modules ?? []);
      setCategoryId((prev) => prev || categoriesPayload.categories?.[0]?.id || "");
    } catch (error) {
      console.error("LEARNING_ADMIN_LOAD_ERROR", error);
      setListError("Gagal memuat data admin modul.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
    loadData();
  }, [loadData, loadMe]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setFile(null);
    setPdfKey("");
    setPdfUrl("");
    setUploadError(null);
    setSaveError(null);
    setSaveMessage(null);
  };

  const handleUpload = async () => {
    setUploadError(null);
    setSaveMessage(null);

    if (!file) {
      setUploadError("Pilih file PDF terlebih dahulu.");
      return;
    }

    if (file.type !== "application/pdf") {
      setUploadError("Hanya file PDF yang diizinkan.");
      return;
    }

    setIsUploading(true);
    try {
      const presignRes = await fetch("/api/v1/learning/assets/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          folder,
        }),
      });

      if (!presignRes.ok) {
        const payload = await presignRes.json().catch(() => null);
        throw new Error(payload?.message || "Gagal membuat presign URL");
      }

      const presignPayload = (await presignRes.json()) as PresignPayload;

      const uploadRes = await fetch(presignPayload.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload ke storage gagal");
      }

      setPdfKey(presignPayload.key);
      setPdfUrl(presignPayload.pdfUrl);
      setSaveMessage("Upload berhasil, siap disimpan.");
    } catch (error) {
      console.error("LEARNING_ADMIN_UPLOAD_ERROR", error);
      setUploadError("Upload PDF gagal. Coba ulangi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveModule = async () => {
    setSaveError(null);
    setSaveMessage(null);

    if (!title || !content || !categoryId || !pdfKey) {
      setSaveError("Judul, konten, kategori, dan PDF wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/learning/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          content,
          pdfKey,
          categoryId,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "Gagal menyimpan modul");
      }

      setSaveMessage("Modul berhasil disimpan.");
      resetForm();
      await loadData();
    } catch (error) {
      console.error("LEARNING_ADMIN_SAVE_ERROR", error);
      setSaveError("Menyimpan modul gagal. Periksa form.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-8 pb-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
          Admin Area
        </p>
        <h1 className="text-2xl font-semibold text-stone-900">Kelola Modul Pembelajaran</h1>
        <p className="text-sm text-stone-600">
          Admin untuk upload PDF ke MinIO dan menyimpan metadata modul.
        </p>
      </header>

      {meError ? <p className="text-xs text-red-600">{meError}</p> : null}
      {!isAdmin ? (
        <div className="rounded-2xl border-2 border-stone-900 bg-amber-50 p-4 text-sm text-stone-700 shadow-[4px_4px_0_#9ca3af]">
          Akses admin dibutuhkan untuk mengelola modul. Silakan login sebagai admin.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_#9ca3af]">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-stone-900">Form Modul Baru</h2>
            <p className="text-xs text-stone-500">Lengkapi data, upload PDF, lalu simpan.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold text-stone-600">Judul Modul</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Fiqih Dasar"
                className="w-full rounded-lg border-2 border-stone-900 bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold text-stone-600">Slug (opsional)</span>
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="fiqih-dasar"
                className="w-full rounded-lg border-2 border-stone-900 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-semibold text-stone-600">Kategori</span>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="w-full rounded-lg border-2 border-stone-900 bg-white px-3 py-2 text-sm"
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {selectedCategory?.description ? (
              <p className="text-xs text-stone-500">{selectedCategory.description}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold text-stone-600">Konten Ringkas</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              placeholder="Isi ringkas modul"
              className="w-full rounded-lg border-2 border-stone-900 bg-white px-3 py-2 text-sm"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-[1fr_160px]">
            <label className="space-y-2">
              <span className="text-xs font-semibold text-stone-600">Folder MinIO</span>
              <input
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                placeholder="modul"
                className="w-full rounded-lg border-2 border-stone-900 bg-white px-3 py-2 text-sm"
              />
            </label>
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-600">File PDF</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="w-full text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="ink"
              size="sm"
              onClick={handleUpload}
              disabled={!isAdmin || isUploading}
            >
              {isUploading ? "Mengunggah..." : "Upload PDF"}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveModule}
              disabled={!isAdmin || isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan Modul"}
            </Button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border-2 border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600"
            >
              Reset
            </button>
          </div>

          {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
          {saveError ? <p className="text-xs text-red-600">{saveError}</p> : null}
          {saveMessage ? <p className="text-xs text-emerald-600">{saveMessage}</p> : null}

          {pdfKey ? (
            <div className="rounded-xl border-2 border-stone-900 bg-stone-50 p-4 text-xs">
              <p className="font-semibold text-stone-800">PDF tersimpan</p>
              <p className="mt-1 text-stone-600">Key: {pdfKey}</p>
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex text-xs font-semibold text-[#d14a35]"
                >
                  Buka file PDF
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-4 rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_#9ca3af]">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-stone-900">Preview PDF</h2>
            <p className="text-xs text-stone-500">Gunakan untuk memastikan file yang diupload.</p>
          </div>
          {pdfUrl ? (
            <div className="rounded-2xl border-2 border-stone-900 bg-stone-100 shadow-[4px_4px_0_#9ca3af]">
              <ModulePdfReader pdfUrl={pdfUrl} title={title || "Preview Modul"} />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500">
              Upload PDF untuk melihat pratinjau.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_#9ca3af]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Daftar Modul Tersimpan</h2>
            <p className="text-xs text-stone-500">Ambil link PDF dari storage untuk uji coba.</p>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="rounded-lg border-2 border-stone-900 bg-white px-3 py-1.5 text-xs font-semibold"
          >
            Refresh
          </button>
        </div>

        {loading ? <p className="text-xs text-stone-500">Memuat data...</p> : null}
        {listError ? <p className="text-xs text-red-600">{listError}</p> : null}

        {!loading && modules.length === 0 ? (
          <p className="text-xs text-stone-500">Belum ada modul tersimpan.</p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {modules.map((module) => (
            <div
              key={module.id}
              className="rounded-xl border-2 border-stone-200 bg-stone-50 p-4"
            >
              <p className="text-xs font-semibold text-stone-500">
                {module.category?.name ?? "Tanpa kategori"}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-900">{module.title}</p>
              <p className="mt-1 text-xs text-stone-500">Slug: {module.slug}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full border border-stone-300 px-2 py-1">
                  {module.pdfKey}
                </span>
                {module.pdfUrl ? (
                  <a
                    href={module.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#d14a35]"
                  >
                    Buka PDF
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
