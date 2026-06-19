import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout berhasil" },
      { status: 200 }
    );

    // Hapus token auth dari cookie browser
    response.cookies.delete("access_token");

    return response;
  } catch (error) {
    console.error("LOGOUT_ERROR", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
