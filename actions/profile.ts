"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  ActionResponse,
  BaseProfileSchema,
  getProfileSchema,
} from "@/lib/validators";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import z from "zod";

type profileFields = z.infer<typeof BaseProfileSchema>;

export async function profileUpdate(
  data: profileFields,
): Promise<ActionResponse> {
  const session = await auth();
  const t = await getTranslations("Auth.Errors");
  const s = await getTranslations("Auth.Success");

  if (!session?.user.email) {
    return { error: t("session_invalid") };
  }

  const profileSchema = getProfileSchema((key, val) => t(key, val));
  const validatedFields = profileSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, newPassword, currentPassword } = validatedFields.data;
  const dataToUpdate: { name: string; password?: string } = { name };

  if (currentPassword && newPassword) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser || !dbUser.password) {
      return { error: t("password_change_invalid") };
    }

    const passwordsMatch = await bcrypt.compare(
      currentPassword,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return {
        error: { currentPassword: [t("current_password_invalid")] },
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    dataToUpdate.password = hashedPassword;
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: dataToUpdate,
    });
    revalidatePath("/profile");

    return {
      success: true,
      message: s("success_update_profile"),
    };
  } catch {
    return {
      message: t("unknown_error"),
    };
  }
}
