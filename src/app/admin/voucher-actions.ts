"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-dashboard";
import { resolveAdminReturnTo, withAdminNotice } from "@/lib/admin-feedback";
import { prisma } from "@/lib/prisma";

const voucherBaseSchema = z.object({
  amount: z.coerce.number().positive(),
  buyerEmail: z.string().trim().email(),
  buyerName: z.string().trim().min(1),
  code: z.string().trim().optional(),
  isRedeemed: z.boolean().default(false),
  message: z.string().trim().optional(),
  recipient: z.string().trim().optional(),
});

const createVoucherSchema = voucherBaseSchema;

const updateVoucherSchema = voucherBaseSchema.extend({
  id: z.string().min(1),
});

const deleteVoucherSchema = z.object({
  id: z.string().min(1),
});

const bulkVoucherStateSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  state: z.enum(["open", "redeemed"]),
});

function generateVoucherCode() {
  return `WALD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function normalizeVoucherPayload(parsed: z.infer<typeof voucherBaseSchema>) {
  const isRedeemed = parsed.isRedeemed;

  return {
    amount: parsed.amount,
    buyerEmail: parsed.buyerEmail,
    buyerName: parsed.buyerName,
    code: parsed.code?.trim() || generateVoucherCode(),
    isRedeemed,
    message: parsed.message?.trim() || null,
    recipient: parsed.recipient?.trim() || null,
    redeemedAt: isRedeemed ? new Date() : null,
  };
}

export async function createVoucherAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/vouchers");

  const parsed = createVoucherSchema.parse({
    amount: formData.get("amount"),
    buyerEmail: formData.get("buyerEmail"),
    buyerName: formData.get("buyerName"),
    code: formData.get("code"),
    isRedeemed: formData.get("isRedeemed") === "on",
    message: formData.get("message"),
    recipient: formData.get("recipient"),
  });

  await prisma.giftVoucher.create({
    data: normalizeVoucherPayload(parsed),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/vouchers");

  redirect(withAdminNotice(returnTo, "created"));
}

export async function updateVoucherAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/vouchers");

  const parsed = updateVoucherSchema.parse({
    id: formData.get("id"),
    amount: formData.get("amount"),
    buyerEmail: formData.get("buyerEmail"),
    buyerName: formData.get("buyerName"),
    code: formData.get("code"),
    isRedeemed: formData.get("isRedeemed") === "on",
    message: formData.get("message"),
    recipient: formData.get("recipient"),
  });

  const existingVoucher = await prisma.giftVoucher.findUniqueOrThrow({
    where: {
      id: parsed.id,
    },
  });

  const normalized = normalizeVoucherPayload(parsed);

  await prisma.giftVoucher.update({
    where: {
      id: parsed.id,
    },
    data: {
      ...normalized,
      redeemedAt:
        normalized.isRedeemed
          ? existingVoucher.redeemedAt ?? normalized.redeemedAt
          : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/vouchers");
  revalidatePath(`/admin/vouchers/${parsed.id}`);

  redirect(withAdminNotice(returnTo, "saved"));
}

export async function deleteVoucherAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/vouchers");

  const parsed = deleteVoucherSchema.parse({
    id: formData.get("id"),
  });

  await prisma.giftVoucher.delete({
    where: {
      id: parsed.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/vouchers");

  redirect(withAdminNotice(returnTo, "deleted"));
}

export async function bulkUpdateVoucherStateAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/vouchers");

  const ids = formData
    .getAll("ids")
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  if (!ids.length) {
    redirect(withAdminNotice(returnTo, "selection-required", "warning"));
  }

  const parsed = bulkVoucherStateSchema.parse({
    ids,
    state: formData.get("state"),
  });

  if (parsed.state === "redeemed") {
    await prisma.giftVoucher.updateMany({
      where: {
        id: {
          in: parsed.ids,
        },
        isRedeemed: false,
      },
      data: {
        isRedeemed: true,
        redeemedAt: new Date(),
      },
    });
  } else {
    await prisma.giftVoucher.updateMany({
      where: {
        id: {
          in: parsed.ids,
        },
      },
      data: {
        isRedeemed: false,
        redeemedAt: null,
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/vouchers");

  redirect(withAdminNotice(returnTo, "bulk-updated"));
}
