import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { BaseProfileSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const validatedFields = BaseProfileSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, newPassword, currentPassword } = validatedFields.data;
    const dataToUpdate: { name: string; password?: string } = { name };

    if (currentPassword && newPassword) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!dbUser || !dbUser.password) {
        return NextResponse.json(
          {
            error:
              "Unable to change password (user not found or login via social network)",
          },
          { status: 400 },
        );
      }

      const passwordsMatch = await bcrypt.compare(
        currentPassword,
        dbUser.password,
      );

      if (!passwordsMatch) {
        return NextResponse.json(
          { error: "Invalid current password" },
          { status: 400 },
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile successfully updated",
        data: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
