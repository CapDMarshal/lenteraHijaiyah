import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth/jwt";

// Daftar endpoint API publik (tidak perlu token)
const publicApiRoutes = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
];

// Daftar halaman frontend auth (jika sudah login, redirect ke dashboard)
const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

// Daftar halaman frontend publik
const publicRoutes = ["/", "/about"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Ambil token dari Cookies (Browser) ATAU Authorization Header (Postman/Mobile)
  let token = req.cookies.get("auth_token")?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // 2. Verifikasi keabsahan JWT (jika token ada)
  const payload = token ? await verifyJwt<{ id: string; role: string }>(token) : null;
  const isAuthenticated = !!payload;

  // LOGIKA VALIDASI UNTUK API ENDPOINTS (BE)
  if (pathname.startsWith("/api/")) {
    const isPublicApi = publicApiRoutes.some((route) => pathname.startsWith(route));

    // Jika API adalah publik, izinkan akses
    if (isPublicApi) {
      return NextResponse.next();
    }

    // Jika API diakses tanpa token valid (hanya endpoint butuh login yang sampai sini)
    if (!isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    // BEST PRACTICE:
    // Jika token valid, teruskan { id, role } ke Headers.
    // Tujuannya agar Endpoint API selanjutnya tidak perlu repot-repot memverifikasi JWT lagi.
    // Endpoint tinggal memanggil req.headers.get("x-user-id") !!
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.id);
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // ==========================================
  // LOGIKA VALIDASI UNTUK FRONTEND PAGES (FE)
  // ==========================================
  // Abaikan request untuk public assets & file _next (agar load cepat)
  if (pathname.startsWith("/_next") || pathname.match(/\.(.*)$/)) {
    return NextResponse.next();
  }

  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicPage = publicRoutes.includes(pathname);

  // Jika pengunjung belum login, MENCEGAH masuk ke area seperti /dashboard, /profile, dll
  if (!isAuthenticated && !isPublicPage && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Jika user SUDAH login, tapi coba masuk lagi halaman /sign-in, langsung lempar ke /dashboard
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Konfigurasi agar Middleware dijalankan di seluruh rute kecuali Next.js internals/static images
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
