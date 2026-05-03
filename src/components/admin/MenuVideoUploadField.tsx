"use client";

import { useEffect, useRef, useState } from "react";
import { Film } from "lucide-react";

interface MenuVideoUploadFieldProps {
  currentVideoUrl?: string | null;
  emptyLabel: string;
  fileLabel: string;
  helpText: string;
  maxFileSizeText: string;
  name?: string;
}

const MAX_VIDEO_UPLOAD_BYTES = 40 * 1024 * 1024;

export default function MenuVideoUploadField({
  currentVideoUrl,
  emptyLabel,
  fileLabel,
  helpText,
  maxFileSizeText,
  name = "videoFile",
}: MenuVideoUploadFieldProps) {
  const objectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const displayUrl = previewUrl || currentVideoUrl || null;
  const hasSelectedFile = Boolean(previewUrl);

  return (
    <div className="min-w-0 rounded-[1.2rem] border border-[#eadfcf] bg-white p-2.5 sm:rounded-[1.35rem] sm:p-3">
      <div className="relative aspect-video overflow-hidden rounded-[1.1rem] border border-[#eadfcf] bg-[#211a14]">
        {displayUrl ? (
          <video
            src={displayUrl}
            className="h-full w-full object-cover"
            controls
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_30%,rgba(216,189,132,0.2),transparent_38%),#211a14] px-4 text-center text-[#f2d49b]">
            <Film className="h-8 w-8 stroke-[1.5]" />
            <span className="text-xs font-medium uppercase tracking-[0.14em]">
              {emptyLabel}
            </span>
          </div>
        )}
        {displayUrl ? (
          <div className="pointer-events-none absolute bottom-3 left-3 right-3">
            <div className="truncate rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)] backdrop-blur-md">
              {hasSelectedFile ? fileMeta : emptyLabel}
            </div>
          </div>
        ) : null}
      </div>

      <label className="mt-3 block rounded-[1rem] border border-[#eadfcf] bg-[#faf7f1] px-3 py-3">
        <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
          {fileLabel}
        </span>
        <input
          name={name}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mov"
          className="mt-2 block w-full min-w-0 overflow-hidden text-xs text-[#201b17] file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-2 file:text-[0.58rem] file:font-medium file:uppercase file:tracking-[0.12em] file:text-[#7b6140] sm:text-sm sm:file:mr-4 sm:file:px-4 sm:file:text-[0.62rem] sm:file:tracking-[0.14em]"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0] ?? null;

            if (objectUrlRef.current) {
              URL.revokeObjectURL(objectUrlRef.current);
              objectUrlRef.current = null;
            }

            if (!file) {
              setPreviewUrl(null);
              setFileMeta(null);
              return;
            }

            if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
              event.currentTarget.value = "";
              setPreviewUrl(null);
              setFileMeta(maxFileSizeText);
              return;
            }

            const nextObjectUrl = URL.createObjectURL(file);
            objectUrlRef.current = nextObjectUrl;
            setPreviewUrl(nextObjectUrl);
            setFileMeta(`${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`);
          }}
        />
      </label>

      <p className="mt-3 break-words text-xs font-light leading-relaxed text-[#7a7165]">
        {helpText}
      </p>
    </div>
  );
}
