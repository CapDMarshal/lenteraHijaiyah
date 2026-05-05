import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { moduleUpdateSchema } from "@/lib/validation/learning";

type RouteContext = {
  params: Promise<{ moduleId: string }>;
};

const ensureAdmin = (req: Request) => {
  const role = req.headers.get("x-user-role");
  return role === "ADMIN";
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { moduleId } = await context.params;

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
          pdfUrl: module.pdfKey,
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

export async function PUT(req: Request, context: RouteContext) {
  try {
    if (!ensureAdmin(req)) {
      return NextResponse.json(
        { message: "Forbidden. Hanya admin yang diizinkan." },
        { status: 403 }
      );
    }

    const { moduleId } = await context.params;
    const body = await req.json();
    const validationResult = moduleUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true },
    });

    if (!module) {
      return NextResponse.json(
        { message: "Modul tidak ditemukan." },
        { status: 404 }
      );
    }

    const { title, content, pdfKey, categoryId } = validationResult.data;

    if (categoryId) {
      const category = await prisma.moduleCategory.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { message: "Kategori tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    const updated = await prisma.module.update({
      where: { id: moduleId },
      data: {
        ...(title ? { title } : {}),
        ...(content ? { content } : {}),
        ...(pdfKey ? { pdfKey } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
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

    return NextResponse.json(
      {
        message: "Modul berhasil diperbarui",
        module: {
          ...updated,
          pdfUrl: updated.pdfKey,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE_MODULE_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    if (!ensureAdmin(req)) {
      return NextResponse.json(
        { message: "Forbidden. Hanya admin yang diizinkan." },
        { status: 403 }
      );
    }

    const { moduleId } = await context.params;

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true },
    });

    if (!module) {
      return NextResponse.json(
        { message: "Modul tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.module.delete({
      where: { id: moduleId },
    });

    return NextResponse.json(
      { message: "Modul berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE_MODULE_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
