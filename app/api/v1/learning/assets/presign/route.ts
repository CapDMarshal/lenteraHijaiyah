import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/config/env";
import { getMinioPublicUrl } from "@/lib/storage/minio";
import { buildLearningPdfKey, getMinioClient } from "@/lib/storage/minioClient";
import { modulePresignSchema } from "@/lib/validation/learning";

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
    const validationResult = modulePresignSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fileName, contentType, folder } = validationResult.data;

    if (contentType !== "application/pdf") {
      return NextResponse.json(
        { message: "Hanya file PDF yang diizinkan" },
        { status: 400 }
      );
    }

    const key = buildLearningPdfKey(fileName, folder);
    const client = getMinioClient();

    const command = new PutObjectCommand({
      Bucket: env.minioBucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 10 });

    return NextResponse.json(
      {
        message: "Presign berhasil dibuat",
        uploadUrl,
        key,
        pdfUrl: getMinioPublicUrl(key),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PRESIGN_UPLOAD_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
