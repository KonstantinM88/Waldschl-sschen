import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { slugifyMenuValue } from "@/lib/restaurant-menu";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_UPLOAD_BYTES = 40 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const ACCEPTED_VIDEO_TYPES = new Map([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
  ["video/quicktime", "mov"],
]);

function getUploadFileName(file: File, extension: string) {
  const extensionless = file.name.replace(/\.[^.]+$/, "");
  const baseName = slugifyMenuValue(extensionless);

  return `${Date.now()}-${randomUUID().slice(0, 8)}-${baseName}.${extension}`;
}

async function prepareUploadTarget(file: File, folder: string, extension: string) {
  const safeFolder = slugifyMenuValue(folder);
  const uploadDir = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "public",
    "uploads",
    safeFolder
  );
  const fileName = getUploadFileName(file, extension);

  await mkdir(uploadDir, { recursive: true });

  return {
    outputPath: path.join(uploadDir, fileName),
    publicUrl: `/uploads/${safeFolder}/${fileName}`,
  };
}

function getFfmpegCandidatePaths() {
  const bundledPath =
    process.platform === "win32"
      ? path.join(
          /*turbopackIgnore: true*/ process.cwd(),
          "node_modules",
          "ffmpeg-static",
          "ffmpeg.exe"
        )
      : path.join(
          /*turbopackIgnore: true*/ process.cwd(),
          "node_modules",
          "ffmpeg-static",
          "ffmpeg"
        );
  return [
    process.env.FFMPEG_PATH,
    bundledPath,
  ].filter((candidate): candidate is string => Boolean(candidate));
}

function runFfmpegWithBinary(binaryPath: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const process = spawn(binaryPath, args, {
      windowsHide: true,
    });
    let stderr = "";

    process.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    process.on("error", reject);
    process.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr.trim() || `FFmpeg exited with code ${code}.`));
    });
  });
}

async function runFfmpeg(args: string[]) {
  let lastSpawnError: unknown = null;

  for (const binaryPath of getFfmpegCandidatePaths()) {
    try {
      await runFfmpegWithBinary(binaryPath, args);
      return;
    } catch (error) {
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? (error as { code?: unknown }).code
          : null;

      if (errorCode === "ENOENT") {
        lastSpawnError = error;
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `FFmpeg binary is not available. Run npm install and restart the dev server.${lastSpawnError ? ` ${String(lastSpawnError)}` : ""}`
  );
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

  const { outputPath, publicUrl } = await prepareUploadTarget(file, folder, "webp");
  const inputBuffer = Buffer.from(await file.arrayBuffer());

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

  return publicUrl;
}

export async function saveUploadedVideoFile(file: File | null, folder: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const inputExtension = ACCEPTED_VIDEO_TYPES.get(file.type);

  if (!inputExtension) {
    throw new Error("Unsupported video type.");
  }

  if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
    throw new Error("Video is too large.");
  }

  const { outputPath, publicUrl } = await prepareUploadTarget(file, folder, "webm");
  const tempInputPath = path.join(
    tmpdir(),
    getUploadFileName(file, inputExtension)
  );
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(tempInputPath, inputBuffer);

  try {
    await runFfmpeg([
      "-y",
      "-i",
      tempInputPath,
      "-map",
      "0:v:0",
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "34",
      "-deadline",
      "good",
      "-cpu-used",
      "5",
      "-row-mt",
      "1",
      "-pix_fmt",
      "yuv420p",
      outputPath,
    ]);
  } finally {
    await rm(tempInputPath, { force: true });
  }

  return publicUrl;
}
