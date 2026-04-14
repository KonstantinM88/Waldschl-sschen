"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export default function AdminPendingFieldset({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <fieldset
      disabled={pending}
      aria-busy={pending}
      className={[
        "min-w-0 border-0 p-0 transition-opacity duration-200",
        pending ? "opacity-80" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </fieldset>
  );
}
