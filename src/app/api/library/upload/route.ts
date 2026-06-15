import { NextResponse } from "next/server";
import { uploadToR2 } from "../../../../lib/r2";

export async function POST(request: Request) {
  try {
    const accountId = process.env.R2_ACCOUNT_ID;
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!accountId || !bucketName) {
      return NextResponse.json({ error: "R2 environment is not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file upload." }, { status: 400 });
    }

    const fileName = file.name;
    const r2Key = `legal-documents/${Date.now()}-${fileName}`;
    const arrayBuffer = await file.arrayBuffer();

    await uploadToR2(r2Key, arrayBuffer);

    const r2Url = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(r2Key)}`;

    return NextResponse.json({ r2Key, r2Url });
  } catch (error: any) {
    console.error("R2 upload route error:", error);
    return NextResponse.json({ error: error?.message || "Failed to upload file to R2." }, { status: 500 });
  }
}
