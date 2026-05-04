import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { resetPasswordSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { message: "Token reset tidak valid atau sudah digunakan" },
        { status: 400 }
      );
    }

    if (tokenRecord.expiresAt.getTime() < Date.now()) {
      await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });
      return NextResponse.json(
        { message: "Token reset sudah kedaluwarsa" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.deleteMany({ where: { userId: tokenRecord.userId } }),
    ]);

    return NextResponse.json(
      { message: "Password berhasil diperbarui" },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
