"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type Thumbnail = {
  page: number;
  dataUrl: string;
};

type ModulePdfReaderProps = {
  pdfUrl: string;
  title: string;
};

export function ModulePdfReader({ pdfUrl, title }: ModulePdfReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const renderPage = useCallback(
    async (pageNumber: number, pdfInstance = pdfDoc) => {
      if (!pdfInstance || !canvasRef.current) {
        return;
      }

      const page = await pdfInstance.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const containerWidth = containerRef.current?.clientWidth ?? viewport.width;
      const scale = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (error) {
          console.error("PDF_RENDER_CANCEL_ERROR", error);
        }
      }

      renderTaskRef.current = page.render({ canvasContext: context, viewport: scaledViewport });
      await renderTaskRef.current.promise;
    },
    [pdfDoc],
  );

  useEffect(() => {
    let isMounted = true;

    const loadPdf = async () => {
      setPdfError(null);
      setPdfDoc(null);
      setThumbnails([]);

      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        if (!isMounted) {
          return;
        }

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);

        const nextThumbnails: Thumbnail[] = [];
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) {
            continue;
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          nextThumbnails.push({ page: pageNumber, dataUrl: canvas.toDataURL() });
        }

        if (isMounted) {
          setThumbnails(nextThumbnails);
        }
      } catch (error: any) {
        if (!isMounted) {
          return;
        }

        if (error?.name === "MissingPDFException") {
          setPdfError("PDF not available");
          return;
        }

        console.error("PDF_LOAD_ERROR", error);
        setPdfError("PDF not available");
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc) {
      return;
    }

    renderPage(currentPage).catch((error) => {
      console.error("PDF_RENDER_ERROR", error);
    });
  }, [currentPage, pdfDoc, renderPage]);

  useEffect(() => {
    if (!pdfDoc) {
      return;
    }

    const handleResize = () => {
      renderPage(currentPage).catch((error) => {
        console.error("PDF_RESIZE_ERROR", error);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentPage, pdfDoc, renderPage]);

  const pageLabel = useMemo(() => {
    if (!numPages) {
      return "Memuat halaman...";
    }

    return `Halaman ${currentPage} / ${numPages}`;
  }, [currentPage, numPages]);

  return (
    <div className="grid max-h-[720px] gap-4 p-3 lg:grid-cols-[220px_1fr]">
      <div className="flex max-h-[520px] flex-col rounded-xl border-2 border-stone-900 bg-white p-3">
        <p className="text-xs font-semibold text-stone-900">Daftar Halaman</p>
        <p className="mt-1 text-[11px] text-slate-500">{pageLabel}</p>
        <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
          {thumbnails.length === 0 ? (
            <div className="h-24 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50" />
          ) : (
            thumbnails.map((thumb) => (
              <button
                key={thumb.page}
                type="button"
                onClick={() => setCurrentPage(thumb.page)}
                className={`w-full overflow-hidden rounded-lg border-2 transition-colors ${
                  thumb.page === currentPage
                    ? "border-[#d14a35]"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <img src={thumb.dataUrl} alt={`Halaman ${thumb.page}`} className="w-full" />
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex max-h-[520px] flex-col rounded-xl border-2 border-stone-900 bg-white">
        <div className="border-b border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700">
          {title}
        </div>
        <div ref={containerRef} className="flex flex-1 items-start justify-center overflow-auto p-3">
          {pdfError ? (
            <div className="rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-8 text-sm font-semibold text-stone-600">
              PDF not available
            </div>
          ) : (
            <canvas ref={canvasRef} className="max-w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
