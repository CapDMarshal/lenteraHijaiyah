import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    // 1. Ambil User ID yang sebelumnya telah disisipkan oleh Middleware ke dalam Headers
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    // 2. Query ke Database dengan mem-filter hanya data yang boleh diekspos (tanpa password)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 3. Handle jika tiba-tiba akun dihapus dari DB tapi token masih ada
    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // 4. Return data User
    return NextResponse.json(
      { message: "Berhasil mengambil data pengguna", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_ME_ERROR", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
