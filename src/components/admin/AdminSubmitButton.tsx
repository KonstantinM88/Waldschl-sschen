"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

interface AdminSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  pendingLabel?: string;
}

export default function AdminSubmitButton({
  children,
  className,
  disabled,
  name,
  pendingLabel,
  type = "submit",
  value,
  ...props
}: AdminSubmitButtonProps) {
  const { data, pending } = useFormStatus();
  const isActiveSubmitter =
    pending &&
    (typeof name !== "string" ? true : data?.get(name) === String(value ?? ""));

  return (
    <button
      {...props}
      type={type}
      name={name}
      value={value}
      disabled={disabled || pending}
      aria-busy={pending}
      className={[
        className,
        "disabled:cursor-not-allowed disabled:opacity-70",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {isActiveSubmitter ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin stroke-[2]" />
            {pendingLabel ?? children}
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}
