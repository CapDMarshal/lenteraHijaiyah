import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { moduleCreateSchema } from "@/lib/validation/learning";

const ensureAdmin = (req: Request) => {
  const role = req.headers.get("x-user-role");
  return role === "ADMIN";
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

    const modules = await prisma.module.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        categoryId: true,
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({ modules }, { status: 200 });
  } catch (error) {
    console.error("GET_MODULES_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 },
    );
  }
}

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

    const { title, slug: rawSlug, content, pdfKey, categoryId } = validationResult.data;
    const slug = rawSlug ?? title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

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
        slug,
        title,
        content,
        pdfKey,
        categoryId,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        pdfKey: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Lazily resolve minio URL — safe to fail if env not configured
    let pdfUrl = pdfKey;
    try {
      const { getMinioPublicUrl } = await import("@/lib/storage/minio");
      pdfUrl = getMinioPublicUrl(pdfKey);
    } catch {
      // MinIO not configured, fall back to raw key
    }

    return NextResponse.json(
      {
        message: "Modul berhasil dibuat",
        module: { ...module, pdfUrl },
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
