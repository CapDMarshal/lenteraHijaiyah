"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

export default function LearningStoragePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [categoriesRes, modulesRes] = await Promise.all([
        fetch("/api/v1/learning/categories"),
        fetch("/api/v1/learning/modules"),
      ]);

      if (!categoriesRes.ok || !modulesRes.ok) {
        throw new Error("Gagal memuat data storage");
      }

      const categoriesPayload = (await categoriesRes.json()) as {
        categories: Category[];
      };
      const modulesPayload = (await modulesRes.json()) as {
        modules: ModuleItem[];
      };

      setCategories(categoriesPayload.categories ?? []);
      setModules(modulesPayload.modules ?? []);
    } catch (error) {
      console.error("LEARNING_STORAGE_LOAD_ERROR", error);
      setErrorMessage("Gagal memuat data modul dari storage.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredModules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return modules.filter((module) => {
      const matchCategory = categoryId === "all" || module.categoryId === categoryId;
      if (!matchCategory) return false;

      if (!normalizedQuery) return true;
      const haystack = [module.title, module.slug, module.pdfKey, module.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [modules, query, categoryId]);

  return (
    <section className="space-y-8 pb-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
          Storage Gate
        </p>
        <h1 className="text-2xl font-semibold text-stone-900">
          Semua Modul dari Storage
        </h1>
        <p className="text-sm text-stone-600">
          Halaman dummy untuk menarik semua modul dari storage dan melakukan pencarian.
        </p>
      </header>

      <div className="grid gap-4 rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_#9ca3af] md:grid-cols-[1.2fr_0.8fr_140px]">
        <label className="space-y-2">
          <span className="text-xs font-semibold text-stone-600">Cari modul</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul, slug, kategori, atau pdf key"
            className="w-full rounded-lg border-2 border-stone-900 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold text-stone-600">Filter kategori</span>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full rounded-lg border-2 border-stone-900 bg-white px-3 py-2 text-sm"
          >
            <option value="all">Semua kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button type="button" size="sm" onClick={loadData} disabled={loading}>
            {loading ? "Memuat..." : "Refresh"}
          </Button>
        </div>
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      <div className="rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_#9ca3af]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Hasil Modul</h2>
            <p className="text-xs text-stone-500">
              {filteredModules.length} modul ditemukan
            </p>
          </div>
        </div>

        {loading ? <p className="mt-4 text-xs text-stone-500">Memuat data...</p> : null}
        {!loading && filteredModules.length === 0 ? (
          <p className="mt-4 text-xs text-stone-500">Tidak ada modul yang cocok.</p>
        ) : null}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="rounded-xl border-2 border-stone-200 bg-stone-50 p-4"
            >
              <p className="text-xs font-semibold text-stone-500">
                {module.category?.name ?? "Tanpa kategori"}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-900">{module.title}</p>
              <p className="mt-1 text-xs text-stone-500">Slug: {module.slug}</p>
              <p className="mt-2 text-xs text-stone-500">Key: {module.pdfKey}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
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
                <a
                  href={`/modul/${module.slug}`}
                  className="text-xs font-semibold text-stone-700"
                >
                  Baca di aplikasi
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
