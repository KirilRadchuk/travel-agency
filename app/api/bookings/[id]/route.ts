import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking || existingBooking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Booking not found or access denied" },
        { status: 404 },
      );
    }

    if (existingBooking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 },
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
