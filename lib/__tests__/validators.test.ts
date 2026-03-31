import { describe, it, expect, vi } from "vitest";
import {
  BaseLoginSchema,
  BaseRegisterSchema,
  CreateBookingSchema,
  getLoginSchema,
  getRegisterSchema,
  BaseProfileSchema,
  getProfileSchema,
} from "../validators";

vi.mock("../constants", () => ({
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 2,
}));

describe("Validators schemas", () => {
  const mockT = (key: string) => `translated_${key}`;

  describe("BaseLoginSchema", () => {
    it("should validate correct data", () => {
      const result = BaseLoginSchema.safeParse({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail on invalid email", () => {
      const result = BaseLoginSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("BaseRegisterSchema", () => {
    it("should fail if name is too short", () => {
      const result = BaseRegisterSchema.safeParse({
        email: "test@example.com",
        name: "A",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("CreateBookingSchema", () => {
    it("should validate correct booking data", () => {
      const result = CreateBookingSchema.safeParse({
        tourId: "tour-1",
        dateId: "date-1",
      });
      expect(result.success).toBe(true);
    });

    it("should fail if required fields are missing", () => {
      const result = CreateBookingSchema.safeParse({ tourId: "", dateId: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("getLoginSchema and getRegisterSchema", () => {
    it("should validate using translated messages", () => {
      const loginSchema = getLoginSchema(mockT);
      const result = loginSchema.safeParse({ email: "wrong", password: "" });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.email?._errors).toContain("translated_email_invalid");
      }
    });

    it("should validate register schema with valid data", () => {
      const registerSchema = getRegisterSchema(mockT);
      const result = registerSchema.safeParse({
        email: "test@example.com",
        name: "Ivan",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("BaseProfileSchema", () => {
    it("should validate when only name is updated", () => {
      const result = BaseProfileSchema.safeParse({ name: "Ivan" });
      expect(result.success).toBe(true);
    });

    it("should fail if new password is the same as current password", () => {
      const result = BaseProfileSchema.safeParse({
        name: "Ivan",
        currentPassword: "oldPassword",
        newPassword: "oldPassword",
        confirmNewPassword: "oldPassword",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "New password must be different from current",
        );
      }
    });

    it("should fail if confirm password does not match new password", () => {
      const result = BaseProfileSchema.safeParse({
        name: "Ivan",
        currentPassword: "oldPassword",
        newPassword: "newPassword123",
        confirmNewPassword: "differentPassword",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match");
      }
    });
  });

  describe("getProfileSchema", () => {
    const profileSchema = getProfileSchema(mockT);

    it("should successfully validate full password change", () => {
      const result = profileSchema.safeParse({
        name: "Ivan",
        currentPassword: "oldPassword",
        newPassword: "newPassword123",
        confirmNewPassword: "newPassword123",
      });
      expect(result.success).toBe(true);
    });

    it("should require currentPassword if newPassword is provided", () => {
      const result = profileSchema.safeParse({
        name: "Ivan",
        newPassword: "newPassword123",
        confirmNewPassword: "newPassword123",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.path.includes("currentPassword"),
          ),
        ).toBe(true);
      }
    });

    it("should fail if new password is too short", () => {
      const result = profileSchema.safeParse({
        name: "Ivan",
        currentPassword: "oldPassword",
        newPassword: "123",
        confirmNewPassword: "123",
      });

      expect(result.success).toBe(false);
    });
  });
});
