import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{ categoryId: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { categoryId } = await context.params;

    const category = await prisma.moduleCategory.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Kategori tidak ditemukan." },
        { status: 404 }
      );
    }

    const modules = await prisma.module.findMany({
      where: { categoryId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        content: true,
        pdfKey: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const data = modules.map((module) => ({
      id: module.id,
      title: module.title,
      content: module.content,
      pdfKey: module.pdfKey,
      pdfUrl: module.pdfKey,
      categoryId: module.categoryId,
      createdAt: module.createdAt,
      updatedAt: module.updatedAt,
    }));

    return NextResponse.json(
      {
        message: "Berhasil mengambil modul",
        category,
        modules: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_CATEGORY_MODULES_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
