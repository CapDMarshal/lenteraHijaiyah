import { NextResponse } from "next/server";

const ROBOFLOW_API_URL =
  "https://serverless.roboflow.com/infer/workflows/zay-nav/hijaiyah-workflow";

type RoboflowResponse = {
  outputs: {
    model_output: {
      top: string;
      confidence: number;
      predictions: { class: string; class_id: number; confidence: number }[];
    };
  }[];
  profiler_trace: unknown[];
};

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as { imageBase64?: string; expectedClass?: string };
    const { imageBase64, expectedClass } = body;

    if (!imageBase64 || !expectedClass) {
      return NextResponse.json(
        { message: "imageBase64 dan expectedClass wajib diisi." },
        { status: 400 },
      );
    }

    const apiKey = process.env.ROBOFLOW_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Roboflow API key tidak dikonfigurasi." },
        { status: 500 },
      );
    }

    // Strip the data URI prefix (data:image/png;base64,...)
    const base64Value = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const roboflowRes = await fetch(ROBOFLOW_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        inputs: {
          image: {
            type: "base64",
            value: base64Value,
          },
        },
      }),
    });

    if (!roboflowRes.ok) {
      const errText = await roboflowRes.text();
      console.error("ROBOFLOW_ERROR", roboflowRes.status, errText);
      return NextResponse.json(
        { message: "Gagal menghubungi Roboflow.", status: roboflowRes.status, detail: errText },
        { status: 502 },
      );
    }

    const raw = (await roboflowRes.json()) as RoboflowResponse;
    const modelOutput = raw?.outputs?.[0]?.model_output;

    if (!modelOutput) {
      console.error("ROBOFLOW_UNEXPECTED", JSON.stringify(raw));
      return NextResponse.json(
        { message: "Response Roboflow tidak valid." },
        { status: 502 },
      );
    }

    const top = modelOutput.top;
    const confidence = modelOutput.confidence;
    const success = top === expectedClass;

    return NextResponse.json({ success, top, confidence }, { status: 200 });
  } catch (error) {
    console.error("HIJAIYAH_CHECK_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server." },
      { status: 500 },
    );
  }
}
