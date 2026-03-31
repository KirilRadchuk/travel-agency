import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        translations: true,
        dates: {
          orderBy: { date: "asc" },
        },
      },
    });

    return NextResponse.json(
      { success: true, count: tours.length, data: tours },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch tours list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
