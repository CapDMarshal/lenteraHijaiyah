import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const categories = await prisma.moduleCategory.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { modules: true },
        },
      },
    });

    const data = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      modulesCount: category._count.modules,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    return NextResponse.json(
      { message: "Berhasil mengambil kategori", categories: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_CATEGORIES_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
