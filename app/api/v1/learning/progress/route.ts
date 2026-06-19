import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { progressUpdateSchema } from "@/lib/validation/learning";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const progress = await prisma.userModuleProgress.findMany({
      where: { userId },
      select: {
        id: true,
        moduleId: true,
        isCompleted: true,
        completedAt: true,
        module: {
          select: {
            id: true,
            title: true,
            pdfKey: true,
            categoryId: true,
          },
        },
      },
    });

    const data = progress.map((item) => ({
      id: item.id,
      moduleId: item.moduleId,
      isCompleted: item.isCompleted,
      completedAt: item.completedAt,
      module: item.module
        ? {
            id: item.module.id,
            title: item.module.title,
            pdfKey: item.module.pdfKey,
            pdfUrl: item.module.pdfKey,
            categoryId: item.module.categoryId,
          }
        : null,
    }));

    return NextResponse.json(
      { message: "Berhasil mengambil progress", progress: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_PROGRESS_ERROR", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validationResult = progressUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { moduleId, isCompleted } = validationResult.data;

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true },
    });

    if (!module) {
      return NextResponse.json(
        { message: "Module not found." },
        { status: 404 }
      );
    }

    const existing = await prisma.userModuleProgress.findFirst({
      where: { userId, moduleId },
      select: { id: true },
    });

    const completedAt = isCompleted ? new Date() : null;

    const progress = existing
      ? await prisma.userModuleProgress.update({
          where: { id: existing.id },
          data: {
            isCompleted,
            completedAt,
          },
        })
      : await prisma.userModuleProgress.create({
          data: {
            userId,
            moduleId,
            isCompleted,
            completedAt,
          },
        });

    return NextResponse.json(
      { message: "Progress berhasil diperbarui", progress },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE_PROGRESS_ERROR", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
