import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getMinioPublicUrl } from "@/lib/storage/minio";

type RouteContext = {
  params: { moduleId: string };
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { moduleId } = context.params;

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: {
        id: true,
        title: true,
        content: true,
        pdfKey: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!module) {
      return NextResponse.json(
        { message: "Modul tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Berhasil mengambil modul",
        module: {
          id: module.id,
          title: module.title,
          content: module.content,
          pdfKey: module.pdfKey,
          pdfUrl: getMinioPublicUrl(module.pdfKey),
          categoryId: module.categoryId,
          category: module.category,
          createdAt: module.createdAt,
          updatedAt: module.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_MODULE_DETAIL_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
