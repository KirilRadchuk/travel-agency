import z from "zod";
import { MIN_PASSWORD_LENGTH, MIN_NAME_LENGTH } from "./constants";

export const BaseLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

export const BaseRegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

export type ActionResponse = {
  success?: boolean;
  message?: string;
  error?: string | Record<string, string[]>;
};

export const CreateBookingSchema = z.object({
  tourId: z.string().min(1, "Tour ID is required"),
  dateId: z.string().min(1, "Date ID is required"), 
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export type TourBookingFormProps = {
  tourId: string;
  dates: { id: string; date: Date }[];
  price: number;
};

export const getLoginSchema = (
  t: (key: string, values?: Record<string, string | number>) => string,
) =>
  z.object({
    email: z.string().email({ message: t("email_invalid") }),
    password: z
      .string()
      .min(1, { message: t("password_required") })
      .min(MIN_PASSWORD_LENGTH, {
        message: t("password_min", { min: MIN_PASSWORD_LENGTH }),
      }),
  });

export const getRegisterSchema = (
  t: (key: string, values?: Record<string, string | number>) => string,
) =>
  z.object({
    email: z.string().email({ message: t("email_invalid") }),
    name: z
      .string()
      .min(1, { message: t("name_required") })
      .min(MIN_NAME_LENGTH, {
        message: t("name_min", { min: MIN_NAME_LENGTH }),
      }),
    password: z
      .string()
      .min(1, { message: t("password_required") })
      .min(MIN_PASSWORD_LENGTH, {
        message: t("password_min", { min: MIN_PASSWORD_LENGTH }),
      }),
  });

export const BaseProfileSchema = z
  .object({
    name: z.string().min(MIN_NAME_LENGTH),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
    confirmNewPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.newPassword) return true;
      return data.newPassword !== data.currentPassword;
    },
    {
      message: "New password must be different from current",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) =>
      !data.confirmNewPassword || data.newPassword === data.confirmNewPassword,
    {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    },
  );

export const getProfileSchema = (
  t: (key: string, values?: Record<string, string | number>) => string,
) =>
  z
    .object({
      name: z
        .string()
        .min(1, { message: t("name_required") })
        .min(MIN_NAME_LENGTH, {
          message: t("name_min", { min: MIN_NAME_LENGTH }),
        }),
      currentPassword: z.string().optional(),
      newPassword: z.string().optional(),
      confirmNewPassword: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!data.newPassword) return true;
        return data.newPassword.length >= MIN_PASSWORD_LENGTH;
      },
      {
        message: t("password_min", { min: MIN_PASSWORD_LENGTH }),
        path: ["newPassword"],
      },
    )
    .refine(
      (data) => {
        if (!data.newPassword) return true;
        return !!data.currentPassword;
      },
      {
        message: t("password_required"),
        path: ["currentPassword"],
      },
    )
    .refine(
      (data) => {
        if (!data.newPassword) return true;
        return data.newPassword !== data.currentPassword;
      },
      {
        message: t("password_must_be_different"),
        path: ["newPassword"],
      },
    )
    .refine(
      (data) => {
        if (!data.newPassword) return true;
        return data.newPassword === data.confirmNewPassword;
      },
      {
        message: t("passwords_must_match"),
        path: ["confirmNewPassword"],
      },
    );
