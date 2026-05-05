import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/auth";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi Zod
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Bandingkan password plaintext dari klien dengan hashed password di DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Generate JWT Token (Minimalist Payload)
    const jwtPayload = { id: user.id, role: user.role };
    const token = await signJwt(jwtPayload, "7d"); // Expires in 7 days

    // Kita mengatur HTTP-Only cookies untuk keamanan (XSS protection)
    // Walaupun JWT tidak menyimpan isi nama/email, response JSON tetap mengembalikan data user
    // untuk keperluan store Frontend pada initial login.
    const response = NextResponse.json(
      {
        message: "Login berhasil",
        token,
      },
      { status: 200 }
    );

    // Set cookie response
    response.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // hanya jalan di https kalau prod
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
