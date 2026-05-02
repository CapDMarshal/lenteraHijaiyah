import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { profileUpdateSchema } from "@/lib/validation/user";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. ID Pengguna tidak ditemukan." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Berhasil mengambil profil", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_PROFILE_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. ID Pengguna tidak ditemukan." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validationResult = profileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email } = validationResult.data;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    if (email && email !== currentUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingEmail) {
        return NextResponse.json(
          { message: "Email sudah terdaftar" },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "Profil berhasil diperbarui", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
