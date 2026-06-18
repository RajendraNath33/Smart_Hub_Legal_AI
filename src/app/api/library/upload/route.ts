import { NextResponse } from "next/server";
import { uploadToR2 } from "../../../../lib/r2";
import { supabase } from "../../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const accountId = process.env.R2_ACCOUNT_ID;
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!accountId || !bucketName) {
      return NextResponse.json({ error: "R2 environment is not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const category = formData.get("category");
    const notes = formData.get("notes");
    const extractedText = formData.get("extractedText");
    const extractionStatus = formData.get("extractionStatus");
    const fileName = formData.get("fileName");
    const fileSize = formData.get("fileSize");
    const uploaderUid = formData.get("uploaderUid");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file upload." }, { status: 400 });
    }

    if (!title || !category || !uploaderUid) {
      return NextResponse.json({ error: "Missing required metadata: title, category, or uploaderUid." }, { status: 400 });
    }

    const r2Key = `legal-documents/${Date.now()}-${fileName || file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    await uploadToR2(r2Key, arrayBuffer);

    const r2Url = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(r2Key)}`;

    const { data, error } = await supabase
      .from("legal_documents")
      .insert({
        title: String(title).trim(),
        category: String(category),
        notes: notes ? String(notes).trim() : null,
        file_name: String(fileName || file.name),
        file_url: r2Url,
        r2_key: r2Key,
        extracted_text: extractedText ? String(extractedText) : "",
        upload_date: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: `Failed to save metadata: ${error.message}` }, { status: 500 });
    }

    const documentId = data && data.length > 0 ? data[0].id : null;

    if (!documentId) {
      return NextResponse.json({ error: "Failed to retrieve document ID after insert." }, { status: 500 });
    }

    return NextResponse.json({ documentId, r2Key, r2Url });
  } catch (error: any) {
    console.error("R2 upload route error:", error);
    return NextResponse.json({ error: error?.message || "Failed to upload file to R2." }, { status: 500 });
  }
}
