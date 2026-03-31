import { describe, it, expect, vi, beforeEach } from "vitest";
import { cn, handleServerResponse, getStatusVariant } from "../utils";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("utils file", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("cn function", () => {
    it("should merge tailwind classes correctly", () => {
      expect(cn("p-4 text-center", "p-2")).toBe("text-center p-2");
      expect(cn("bg-red-500", { "text-white": true })).toBe(
        "bg-red-500 text-white",
      );
    });
  });

  describe("getStatusVariant function", () => {
    it("should return correct variant for specific statuses", () => {
      expect(getStatusVariant("PENDING")).toBe("secondary");
      expect(getStatusVariant("CONFIRMED")).toBe("default");
      expect(getStatusVariant("CANCELLED")).toBe("destructive");
      expect(getStatusVariant("COMPLETED")).toBe("outline");
    });

    it('should return "secondary" as default fallback for unknown statuses', () => {
      expect(getStatusVariant("UNKNOWN_STATUS")).toBe("secondary");
      expect(getStatusVariant("")).toBe("secondary");
    });
  });

  describe("handleServerResponse function", () => {
    const mockForm = {
      setError: vi.fn(),
      reset: vi.fn(),
    };

    it("should handle success and call toast with form reset", () => {
      const result = { success: true, message: "Updated successfully" };

      const returnValue = handleServerResponse(result, mockForm);

      expect(returnValue).toBe(true);
      expect(toast.success).toHaveBeenCalledWith("Updated successfully");
      expect(mockForm.reset).toHaveBeenCalled();
    });

    it("should handle success and call onSuccess callback instead of form reset", () => {
      const result = { success: true };
      const onSuccessMock = vi.fn();

      const returnValue = handleServerResponse(result, mockForm, onSuccessMock);

      expect(returnValue).toBe(true);
      expect(onSuccessMock).toHaveBeenCalled();
      expect(mockForm.reset).not.toHaveBeenCalled();
    });

    it("should handle string error and call toast.error", () => {
      const result = { error: "Something went wrong" };

      const returnValue = handleServerResponse(result, mockForm);

      expect(returnValue).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });

    it("should handle field validation errors and call form.setError", () => {
      const result = {
        error: {
          email: ["Invalid email"],
          password: ["Too short"],
        },
      };

      const returnValue = handleServerResponse(result, mockForm);

      expect(returnValue).toBe(false);
      expect(mockForm.setError).toHaveBeenCalledWith("email", {
        type: "server",
        message: "Invalid email",
      });
      expect(mockForm.setError).toHaveBeenCalledWith("password", {
        type: "server",
        message: "Too short",
      });
    });

    it("should handle missing success flag but with message", () => {
      const result = { success: false, message: "Action failed" };

      const returnValue = handleServerResponse(result, mockForm);

      expect(returnValue).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Action failed");
    });

    it("should return false for empty or undefined result", () => {
      expect(handleServerResponse(undefined, mockForm)).toBe(false);
      expect(handleServerResponse({}, mockForm)).toBe(false);
    });
  });
});
