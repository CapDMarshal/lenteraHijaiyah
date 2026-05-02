"use client";

import Link from "next/link";
import { useState } from "react";

import { LinkButton } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1.5 12C3.7 7.8 7.5 5.5 12 5.5C16.5 5.5 20.3 7.8 22.5 12C20.3 16.2 16.5 18.5 12 18.5C7.5 18.5 3.7 16.2 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6 6.3C11.1 6.2 11.5 6.2 12 6.2C16.2 6.2 19.7 8.4 21.8 12C20.9 13.6 19.7 14.9 18.3 15.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1 14.3C13.5 14.9 12.8 15.2 12 15.2C10.2 15.2 8.8 13.8 8.8 12C8.8 11.2 9.1 10.5 9.7 9.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 8.2C4.5 9.2 3 10.5 2.2 12C4.3 15.6 7.8 17.8 12 17.8C13.4 17.8 14.7 17.5 15.9 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="h-full bg-[#f4efeb]">
      <div className="flex h-full flex-col px-5 py-4 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Kembali ke beranda" className="text-5xl leading-none text-stone-900">
            x
          </Link>

          <LinkButton href="/sign-up" variant="ink" size="nav">
            Daftar Sekarang
          </LinkButton>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
          <h1 className="text-center text-5xl font-bold tracking-tight text-stone-900 mb-5  ">MASUK</h1>

          <form className="mt-8 space-y-8" action="#" method="post">
            <TextField type="email" name="email" autoComplete="email" placeholder="Email" />

            <TextField
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              endAdornment={
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="inline-flex items-center text-stone-700 transition-colors hover:text-stone-900"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            <Link href="/forgot-password" className="block text-sm font-semibold text-[#d14a35] hover:underline">
              Lupa password?
            </Link>

            <button
              type="submit"
              className="group inline-flex w-full rounded-[12px] bg-[#d96852] p-0 focus-visible:outline-none"
            >
              <span className="inline-flex w-full -translate-x-1 -translate-y-1 items-center justify-center rounded-[12px] bg-black px-8 py-4 text-xl font-medium text-white transition-transform duration-200 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-active:-translate-x-0.5 group-active:-translate-y-0.5">
                MASUK
              </span>
            </button>
          </form>

          <p className="mx-auto mt-8 max-w-md text-center text-xs font-medium leading-relaxed text-slate-500">
            Dengan masuk ke Lentera Hijaiyah, Anda menyetujui <Link href="/terms" className="text-[#d14a35] hover:underline">
              Syarat dan Ketentuan
            </Link> serta <Link href="/privacy" className="text-[#d14a35] hover:underline">
              Kebijakan Privasi
            </Link> kami.
          </p>
        </div>
      </div>
    </section>
  );
}
