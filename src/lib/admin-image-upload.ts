import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { slugifyMenuValue } from "@/lib/restaurant-menu";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function getUploadFileName(file: File) {
  const extensionless = file.name.replace(/\.[^.]+$/, "");
  const baseName = slugifyMenuValue(extensionless);

  return `${Date.now()}-${randomUUID().slice(0, 8)}-${baseName}.webp`;
}

export async function saveUploadedImageAsWebp(
  file: File | null,
  folder: string
) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported image type.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large.");
  }

  const safeFolder = slugifyMenuValue(folder);
  const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
  const fileName = getUploadFileName(file);
  const outputPath = path.join(uploadDir, fileName);
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDir, { recursive: true });

  await sharp(inputBuffer)
    .rotate()
    .resize({
      fit: "inside",
      height: 1200,
      width: 1600,
      withoutEnlargement: true,
    })
    .webp({
      effort: 5,
      quality: 84,
    })
    .toFile(outputPath);

  return `/uploads/${safeFolder}/${fileName}`;
}
