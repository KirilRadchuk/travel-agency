import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const tour = await prisma.tour.findUnique({
      where: { slug },
      include: {
        translations: true,
        dates: {
          orderBy: { date: "asc" },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tour }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tour details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
