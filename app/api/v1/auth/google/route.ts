import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { signJwt } from "@/lib/auth/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

// Meminjam CLIENT_ID Anda dari Environment Variable.
// Pastikan GOOGLE_CLIENT_ID sudah dimasukkan ke file .env !!
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json(
        { message: "Token kredensial Google tidak ditemukan" },
        { status: 400 }
      );
    }

    // 1. Verifikasi Token Google ke server resmi Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json(
        { message: "Payload token Google tidak valid" },
        { status: 400 }
      );
    }

    const { email, name, picture } = payload;

    // 2. Cek apakah pengguna sudah pernah Mendaftar/Login sebelumnya
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Jika belum terdaftar, buat profil user secara otomatis
    if (!user) {
      // Jika Google tidak mengirimkan nama, gunakan bagian depan email (sebelum @)
      const finalName = name || email.split("@")[0];

      // Karena Schema Prisma Anda mewajibkan ada 'password',
      // kita berikan password random (hash UUID acak yang tak mungkin tertebak/login manual).
      const randomPasswordBytes = crypto.randomUUID();
      const hashedRandomPassword = await bcrypt.hash(randomPasswordBytes, 10);

      user = await prisma.user.create({
        data: {
          email,
          name: finalName,
          password: hashedRandomPassword,
          role: "USER",
        },
      });
    }

    // 4. Generate JWT Murni milik Aplikasi Lentera Hijaiyah
    const jwtPayload = { id: user.id, role: user.role };
    const token = await signJwt(jwtPayload, "7d"); // Masa berlaku 7 Hari

    // Keluarkan Response + Buat Session Cookie (Sama persis dengan Auth Login Biasa)
    const response = NextResponse.json(
      {
        message: "Login via Google berhasil",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Tempelkan Custom Token kita ke dalam Set-Cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("GOOGLE_OAUTH_ERROR", error);
    return NextResponse.json(
      { message: "Verifikasi Google OAuth Gagal atau terjadi masalah server." },
      { status: 500 }
    );
  }
}
