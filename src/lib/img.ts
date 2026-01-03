"use server";
import sharp from "sharp";
import { db } from "./db";
import { auth } from "@/auth";
import { dbUpdateImgUsingId } from "@/app/actions/data";

export async function uploadImg(
  signedUrl: string,
  fileData: ArrayBuffer,
  file: File
) {
  const session = await auth();
  if (!session?.user) return false;

  // Upload ORIGINAL file (no sharp, no resize, no compression)
  const uploadRes = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type, // IMPORTANT
    },
    body: fileData, // ORIGINAL BYTES
  });

  if (!uploadRes.ok) {
    console.error("Upload failed");
    return false;
  }

  // Remove query params → actual file URL
  const fileUrl = signedUrl.split("?")[0];

  // Update DB
  await dbUpdateImgUsingId(session.user.id, {
    image: fileUrl,
  });

  console.log("Image uploaded in original quality");
  return true;
}


export async function deleteImg(signedUrl: string) {
  const session = await auth();
  if (!session?.user) return false;

  const res = await fetch(signedUrl, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error("Delete failed");
    return false;
  }

  await dbUpdateImgUsingId(session.user.id, {
    image: null,
  });

  console.log("Image deleted");
  return true;
}