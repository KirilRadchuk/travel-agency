"use server";

import { signIn } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import {
  ActionResponse,
  BaseLoginSchema,
  BaseRegisterSchema,
  getLoginSchema,
  getRegisterSchema,
} from "@/lib/validators";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";
import z from "zod";

type loginFields = z.infer<typeof BaseLoginSchema>;
type registerFields = z.infer<typeof BaseRegisterSchema>;

export async function login(data: loginFields): Promise<ActionResponse | void> {
  const locale = await getLocale();
  const t = await getTranslations("Auth.Errors");

  const loginSchema = getLoginSchema(t);

  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: t("credentials_error") };
        default:
          return { error: t("unknown_error") };
      }
    }
    throw error;
  }
  redirect({ href: "/", locale: locale });
}

export async function registerUser(
  data: registerFields,
): Promise<ActionResponse | void> {
  const locale = await getLocale();
  const t = await getTranslations("Auth.Errors");

  const registerSchema = getRegisterSchema(t);
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }
  const { email, name, password } = validatedFields.data;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return {
        error: t("email_exist"),
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  } catch {
    return { error: t("unknown_error") };
  }
  
  redirect({ href: "/login", locale: locale });
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}
