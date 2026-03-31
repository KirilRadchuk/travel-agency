"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { CreateBookingInput, CreateBookingSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function booking(data: CreateBookingInput) {
  const session = await auth();
  const t = await getTranslations("Booking.Errors");

  if (!session?.user.id) {
    return { error: t("session_invalid") };
  }
  const validatedFields = CreateBookingSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: t("unknown_error") };
  }
  const { dateId, tourId } = validatedFields.data;

  try {
    const tourDateRecord = await prisma.tourDate.findUnique({
      where: { id: dateId },
      select: {
        date: true,
      },
    });
    if (!tourDateRecord) {
      return { error: t("unknown_error") };
    }
    await prisma.booking.create({
      data: {
        userId: session.user.id,
        tourId,
        tourDate: tourDateRecord.date,
        status: "PENDING",
      },
    });
    revalidatePath("/bookings");
    return { success: true };
  } catch {
    return { error: t("unknown_error") };
  }
}

export async function cancelBooking(id: string) {
  const session = await auth();
  const t = await getTranslations("Booking.Errors");

  if (!session?.user.id) {
    return { error: t("session_invalid") };
  }
  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking || existingBooking.userId !== session.user.id) {
      return { error: t("unknown_error") };
    }
    await prisma.booking.update({
      where: {
        id,
      },
      data: { status: "CANCELLED" },
    });
    revalidatePath("/bookings");
    return { success: true };
  } catch {
    return { error: t("unknown_error") };
  }
}
