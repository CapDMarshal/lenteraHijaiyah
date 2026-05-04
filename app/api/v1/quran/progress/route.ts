import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

type ProgressPayload = {
  surahNumber: number;
  ayahNumber: number;
};

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. ID Pengguna tidak ditemukan." },
        { status: 401 },
      );
    }

    const progress = await prisma.userQuranProgress.findUnique({
      where: { userId },
      select: {
        surahNumber: true,
        ayahNumber: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error("GET_QURAN_PROGRESS_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. ID Pengguna tidak ditemukan." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as Partial<ProgressPayload>;
    const surahNumber = Number(body.surahNumber);
    const ayahNumber = Number(body.ayahNumber);

    if (!Number.isInteger(surahNumber) || !Number.isInteger(ayahNumber)) {
      return NextResponse.json(
        { message: "Data tidak valid" },
        { status: 400 },
      );
    }

    const progress = await prisma.userQuranProgress.upsert({
      where: { userId },
      update: { surahNumber, ayahNumber },
      create: { userId, surahNumber, ayahNumber },
      select: {
        surahNumber: true,
        ayahNumber: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error("UPDATE_QURAN_PROGRESS_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 },
    );
  }
}
