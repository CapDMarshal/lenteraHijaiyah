import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/config/env";
import { getMinioClient } from "@/lib/storage/minioClient";
import { moduleDeleteSchema } from "@/lib/validation/learning";

const ensureAdmin = (req: Request) => {
  const role = req.headers.get("x-user-role");
  return role === "ADMIN";
};

export async function DELETE(req: Request) {
  try {
    if (!ensureAdmin(req)) {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validationResult = moduleDeleteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { key } = validationResult.data;

    const client = getMinioClient();
    const command = new DeleteObjectCommand({
      Bucket: env.minioBucket,
      Key: key,
    });

    await client.send(command);

    return NextResponse.json(
      { message: "File berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE_ASSET_ERROR", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
