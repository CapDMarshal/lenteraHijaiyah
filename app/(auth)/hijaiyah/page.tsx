"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Letter data (Arabic alphabet order) ────────────────────────────────────

const LETTERS = [
  { id: "alif",     label: "alif",     file: "alif.svg" },
  { id: "ba",       label: "ba",       file: "ba.svg" },
  { id: "ta",       label: "ta",       file: "ta.svg" },
  { id: "tsa",      label: "tsa",      file: "tsa.svg" },
  { id: "jim",      label: "jim",      file: "jim.svg" },
  { id: "ha",       label: "ha",       file: "ha.svg" },
  { id: "kha",      label: "kha",      file: "kha.svg" },
  { id: "dal",      label: "dal",      file: "dal.svg" },
  { id: "dzal",     label: "dza",      file: "dzal.svg" },
  { id: "ra",       label: "ra",       file: "ra.svg" },
  { id: "zal",      label: "za",       file: "zal.svg" },
  { id: "sin",      label: "sin",      file: "sin.svg" },
  { id: "syin",     label: "syin",     file: "syin.svg" },
  { id: "shad",     label: "shad",     file: "shad.svg" },
  { id: "dhad",     label: "dhad",     file: "dhad.svg" },
  { id: "tha",      label: "tha",      file: "tha.svg" },
  { id: "zha",      label: "zha",      file: "zha.svg" },
  { id: "ain",      label: "ain",      file: "_ain.svg" },
  { id: "ghain",    label: "ghain",    file: "ghain.svg" },
  { id: "fa",       label: "fa",       file: "fa.svg" },
  { id: "qof",      label: "qof",      file: "qof.svg" },
  { id: "kaf",      label: "kaf",      file: "kaf.svg" },
  { id: "lam",      label: "lam",      file: "lam.svg" },
  { id: "mim",      label: "mim",      file: "mim.svg" },
  { id: "nun",      label: "nun",      file: "nun.svg" },
  { id: "haa",      label: "haa",      file: "haa.svg" },
  { id: "wau",      label: "wau",      file: "wau.svg" },
  { id: "ya",       label: "ya",       file: "ya.svg" },
  { id: "hamzah",   label: "hamzah",   file: "hamzah.svg" },
  { id: "lam-alif", label: "lam alif", file: "lam alif.svg" },
] as const;

type Letter = (typeof LETTERS)[number];

type CheckResult = {
  success: boolean;
  top: string;
  confidence: number;
} | null;

// ─── Eraser icon ─────────────────────────────────────────────────────────────

function EraserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" />
      <path d="M6.0001 17.0001 10 13" />
    </svg>
  );
}

// ─── Result modals ────────────────────────────────────────────────────────────

function ResultModal({
  success,
  letter,
  onClose,
  onRetry,
}: {
  success: boolean;
  letter: Letter;
  onClose: () => void;
  onRetry: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg items-center gap-6 rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[6px_6px_0_#1c1917]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cat illustration */}
        <div className="w-36 shrink-0">
          <Image
            src={success ? "/images/cat-true.png" : "/images/cat-false.png"}
            alt={success ? "Kucing senang" : "Kucing sedih"}
            width={144}
            height={144}
            className="h-36 w-36 object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <p className="text-xl font-bold leading-snug text-stone-900">
            {success ? "Yeayy tulisanmu tepat!" : "Yahh tulisanmu belum sesuai!"}
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            {success ? (
              <>
                Tulisan udah mirip banget sama huruf{" "}
                <span className="font-semibold text-[#d14a35]">{letter.label}</span>
                . ayo tuliskan lagi huruf yang sama atau coba huruf lainnya!!
              </>
            ) : (
              <>
                Tulisan kamu masih belum mirip dengan{" "}
                <span className="font-semibold text-[#d14a35]">{letter.label}</span>
                . ayo tuliskan lagi huruf yang sama atau coba huruf lainnya!!
              </>
            )}
          </p>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-stone-900 bg-white py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="flex-1 rounded-xl border-2 border-stone-900 bg-black py-2.5 text-sm font-semibold text-white shadow-[3px_3px_0_#d14a35] transition-colors hover:bg-stone-900"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Drawing canvas ───────────────────────────────────────────────────────────

function DrawingCanvas({
  canvasRef,
  onClear,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClear: () => void;
}) {
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !lastPos.current) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1c1917";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-stone-900 bg-white shadow-[6px_6px_0_#1c1917]">
      <button
        type="button"
        onClick={onClear}
        title="Hapus kanvas"
        className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-lg border-2 border-stone-900 bg-white text-stone-700 shadow-[2px_2px_0_#9ca3af] hover:bg-stone-50 transition-colors"
      >
        <EraserIcon />
      </button>
      <canvas
        ref={canvasRef}
        width={600}
        height={440}
        className="h-full w-full cursor-crosshair touch-none"
        style={{ display: "block" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HijaiyahPage() {
  const [selected, setSelected] = useState<Letter>(LETTERS[0]);
  const [result, setResult] = useState<CheckResult>(null);
  const [isChecking, setIsChecking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleSelect = (letter: Letter) => {
    setSelected(letter);
    setResult(null);
    handleClear();
  };

  const handleCheck = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isChecking) return;

    setIsChecking(true);
    try {
      const imageBase64 = canvas.toDataURL("image/png");
      const expectedClass = selected.file.replace(".svg", "");

      const res = await fetch("/api/v1/hijaiyah/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, expectedClass }),
      });

      if (!res.ok) throw new Error("API error");
      const data = (await res.json()) as CheckResult;
      setResult(data);
    } catch (err) {
      console.error("CHECK_ERROR", err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClose = () => setResult(null);

  const handleRetry = () => {
    setResult(null);
    handleClear();
  };

  return (
    <>
      <section className="space-y-8 pb-12">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Canvas <span className="text-[#d14a35]">Hijaiyah</span>
          </h1>
          <p className="text-sm text-slate-600">
            Pilih huruf hijaiyah yang ingin dipelajari, lalu tuliskan di kanvas samping
          </p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Letter picker */}
          <div className="w-full rounded-2xl border-2 border-stone-900 bg-white p-4 shadow-[6px_6px_0_#d96852] lg:w-[560px] lg:shrink-0">
            <div className="max-h-[400px] overflow-y-auto pr-1">
              <div className="grid grid-cols-5 gap-2">
                {LETTERS.map((letter) => {
                  const isActive = selected.id === letter.id;
                  return (
                    <button
                      key={letter.id}
                      type="button"
                      onClick={() => handleSelect(letter)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 transition-all duration-150 ${
                        isActive
                          ? "border-[#d14a35] bg-[#d14a35] shadow-[3px_3px_0_#9b2c16]"
                          : "border-stone-900 bg-white hover:border-[#d14a35] hover:shadow-[3px_3px_0_#d96852]"
                      }`}
                    >
                      <div className="flex h-12 w-full items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/aset-hijaiyah/${encodeURIComponent(letter.file)}`}
                          alt={letter.label}
                          className={`h-10 w-10 object-contain ${isActive ? "brightness-0 invert" : ""}`}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-semibold capitalize leading-none ${
                          isActive ? "text-white" : "text-stone-700"
                        }`}
                      >
                        {letter.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Canvas + button */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-[436px]">
              <DrawingCanvas canvasRef={canvasRef} onClear={handleClear} />
            </div>

            <button
              type="button"
              onClick={handleCheck}
              disabled={isChecking}
              className="w-full rounded-xl border-2 border-stone-900 bg-black py-4 text-sm font-bold text-white shadow-[4px_4px_0_#d14a35] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
            >
              {isChecking ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Memeriksa...
                </span>
              ) : (
                "Periksa Tulisan"
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Result modal */}
      {result && (
        <ResultModal
          success={result.success}
          letter={selected}
          onClose={handleClose}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
