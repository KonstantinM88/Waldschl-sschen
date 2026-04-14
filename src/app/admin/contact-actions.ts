"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-dashboard";
import { resolveAdminReturnTo, withAdminNotice } from "@/lib/admin-feedback";
import { prisma } from "@/lib/prisma";

const contactReadStateSchema = z.object({
  id: z.string().min(1),
  readState: z.enum(["read", "unread"]),
});

const bulkContactReadStateSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  readState: z.enum(["read", "unread"]),
});

export async function setContactReadStateAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/contacts");

  const parsed = contactReadStateSchema.parse({
    id: formData.get("id"),
    readState: formData.get("readState"),
  });

  await prisma.contactSubmission.update({
    where: {
      id: parsed.id,
    },
    data: {
      readAt: parsed.readState === "read" ? new Date() : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${parsed.id}`);

  redirect(withAdminNotice(returnTo, "status-updated"));
}

export async function bulkSetContactReadStateAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/contacts");

  const ids = formData
    .getAll("ids")
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  if (!ids.length) {
    redirect(withAdminNotice(returnTo, "selection-required", "warning"));
  }

  const parsed = bulkContactReadStateSchema.parse({
    ids,
    readState: formData.get("readState"),
  });

  await prisma.contactSubmission.updateMany({
    where: {
      id: {
        in: parsed.ids,
      },
    },
    data: {
      readAt: parsed.readState === "read" ? new Date() : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contacts");

  redirect(withAdminNotice(returnTo, "bulk-updated"));
}
