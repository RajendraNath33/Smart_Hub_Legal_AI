import { NextResponse } from "next/server";
import { uploadToR2 } from "../../../../lib/r2";
import { db } from "../../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

    const docRef = await addDoc(collection(db, "legal_documents"), {
      title: String(title).trim(),
      category: String(category),
      notes: notes ? String(notes).trim() : null,
      fileName: String(fileName || file.name),
      fileSize: fileSize ? parseInt(String(fileSize), 10) : file.size,
      r2Key,
      r2Url,
      fileUrl: r2Url,
      extractedText: extractedText ? String(extractedText) : "",
      extractionStatus: String(extractionStatus) || "pending",
      uploaderUid: String(uploaderUid),
      vectorEmbedding: null,
      embeddingStatus: "pending",
      uploadedAt: serverTimestamp(),
      uploadDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ documentId: docRef.id, r2Key, r2Url });
  } catch (error: any) {
    console.error("R2 upload route error:", error);
    return NextResponse.json({ error: error?.message || "Failed to upload file to R2." }, { status: 500 });
  }
}
