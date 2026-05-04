import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { moduleCreateSchema } from "@/lib/validation/learning";
import { getMinioPublicUrl } from "@/lib/storage/minio";

const ensureAdmin = (req: Request) => {
  const role = req.headers.get("x-user-role");
  return role === "ADMIN";
};

export async function POST(req: Request) {
  try {
    if (!ensureAdmin(req)) {
      return NextResponse.json(
        { message: "Forbidden. Hanya admin yang diizinkan." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validationResult = moduleCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, content, pdfKey, categoryId } = validationResult.data;

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

    const module = await prisma.module.create({
      data: {
        title,
        content,
        pdfKey,
        categoryId,
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
        message: "Modul berhasil dibuat",
        module: {
          ...module,
          pdfUrl: getMinioPublicUrl(module.pdfKey),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_MODULE_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
