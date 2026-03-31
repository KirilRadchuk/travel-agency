import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateBookingSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      orderBy: { tourDate: "asc" },
      include: { tour: true },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validatedFields = CreateBookingSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validatedFields.error.format(),
        },
        { status: 400 },
      );
    }

    const { dateId, tourId } = validatedFields.data;

    const tourDateRecord = await prisma.tourDate.findUnique({
      where: { id: dateId },
      select: { date: true },
    });

    if (!tourDateRecord) {
      return NextResponse.json(
        { error: "Tour date not found" },
        { status: 404 },
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        tourId,
        tourDate: tourDateRecord.date,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, data: newBooking },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
