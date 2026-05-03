"use client";

import { useEffect, useRef, useState } from "react";

interface MenuImageUploadPreviewProps {
  alt: string;
  currentImageUrl?: string | null;
  emptyLabel: string;
  fileLabel: string;
  helpText: string;
  name?: string;
}

export default function MenuImageUploadPreview({
  alt,
  currentImageUrl,
  emptyLabel,
  fileLabel,
  helpText,
  name = "imageFile",
}: MenuImageUploadPreviewProps) {
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

  const displayUrl = previewUrl || currentImageUrl || "/restaurant-menu/default.webp";
  const hasSelectedFile = Boolean(previewUrl);

  return (
    <div className="min-w-0 rounded-[1.2rem] border border-[#eadfcf] bg-white p-2.5 sm:rounded-[1.35rem] sm:p-3">
      <div
        aria-label={alt}
        className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] border border-[#eadfcf] bg-[#f3ede2] bg-cover bg-center"
        role="img"
        style={{ backgroundImage: `url("${displayUrl}")` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(18,12,8,0.46)_100%)]" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="truncate rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)] backdrop-blur-md">
            {hasSelectedFile ? fileMeta : emptyLabel}
          </div>
        </div>
      </div>

      <label className="mt-3 block rounded-[1rem] border border-[#eadfcf] bg-[#faf7f1] px-3 py-3">
        <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
          {fileLabel}
        </span>
        <input
          name={name}
          type="file"
          accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
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

            const nextObjectUrl = URL.createObjectURL(file);
            objectUrlRef.current = nextObjectUrl;
            setPreviewUrl(nextObjectUrl);
            setFileMeta(`${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`);
          }}
        />
      </label>

      <p className="mt-3 break-words text-xs font-light leading-relaxed text-[#7a7165]">
        {helpText}
      </p>
    </div>
  );
}
