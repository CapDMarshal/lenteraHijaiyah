"use client";

import Link from "next/link";
import { useState } from "react";

import { LinkButton } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // TODO: implement forgot password API call
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="min-h-screen bg-[#F7EDE8]">
      <div className="flex min-h-screen flex-col px-5 py-4 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Kembali ke beranda" className="text-5xl leading-none text-stone-900">
            x
          </Link>

          <LinkButton href="/sign-in" variant="ink" size="nav">
            Masuk
          </LinkButton>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
          <h1 className="text-center text-4xl font-bold tracking-tight text-stone-900 mb-5">Lupa Password</h1>
          
          <p className="text-center text-sm text-stone-600 mb-8 max-w-sm mx-auto">
            Kami akan mengirimkan petunjuk tentang cara mengatur ulang kata sandi anda melalui email.
          </p>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <TextField
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <button
              type="submit"
              className="group inline-flex w-full rounded-[12px] bg-[#d96852] p-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              <span className="inline-flex w-full -translate-x-1 -translate-y-1 items-center justify-center rounded-[12px] bg-black px-8 py-4 text-xl font-medium text-white transition-transform duration-200 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-active:-translate-x-0.5 group-active:-translate-y-0.5">
                {isSubmitting ? "Memproses..." : "KIRIM"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
