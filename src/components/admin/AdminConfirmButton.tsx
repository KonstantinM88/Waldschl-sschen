"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

interface AdminConfirmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  confirmMessage: string;
  pendingLabel?: string;
}

export default function AdminConfirmButton({
  children,
  className,
  confirmMessage,
  disabled,
  onClick,
  pendingLabel,
  type = "submit",
  ...props
}: AdminConfirmButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || pending}
      aria-busy={pending}
      className={[
        className,
        "disabled:cursor-not-allowed disabled:opacity-70",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={(event) => {
        if (pending) {
          event.preventDefault();
          return;
        }

        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {pending ? (
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
