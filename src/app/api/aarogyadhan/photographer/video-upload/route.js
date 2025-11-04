import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ⛔ Don't use `export const config = { api: { bodyParser: false } }` here

export async function POST(req) {
  try {
    const formData = await req.formData();

    const video1File = formData.get("video1");
    const video2File = formData.get("video2");

    const uploadVideo = async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "video" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      return uploadRes.secure_url;
    };

    const video1 = video1File ? await uploadVideo(video1File) : null;
    const video2 = video2File ? await uploadVideo(video2File) : null;

    return NextResponse.json({ video1, video2 });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
