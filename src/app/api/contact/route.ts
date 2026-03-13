import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  subject: z.string().min(1).max(100),
  message: z.string().min(1).max(5000),
  locale: z.enum(["de", "en"]).optional().default("de"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const submission = await prisma.contactSubmission.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone ?? null,
        subject: validated.subject,
        message: validated.message,
        locale: validated.locale,
      },
    });

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
