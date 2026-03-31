import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ServerResult = {
  success?: boolean;
  message?: string;
  error?: string | Record<string, string[]>;
} | void;

export function handleServerResponse<T extends FieldValues>(
  result: ServerResult,
  form: {
    setError: UseFormReturn<T>["setError"];
    reset?: UseFormReturn<T>["reset"];
  },
  onSuccess?: () => void,
) {
  if (result?.success) {
    if (result.message) {
      toast.success(result.message);
    }
    if (onSuccess) {
      onSuccess();
    } else if (form.reset) {
      form.reset();
    }
    return true;
  }
  if (result?.error) {
    if (typeof result.error === "object" && !Array.isArray(result.error)) {
      const fieldErrors = result.error as Record<string, string[]>;

      Object.keys(fieldErrors).forEach((key) => {
        form.setError(key as Path<T>, {
          type: "server",
          message: fieldErrors[key][0],
        });
      });
    } else if (typeof result.error === "string") {
      toast.error(result.error);
    }
    return false;
  }

  if (result?.message && !result.success) {
    toast.error(result.message);
    return false;
  }

  return false;
}
export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "PENDING":
            return "secondary"; 
        case "CONFIRMED":
            return "default";   
        case "CANCELLED":
            return "destructive"; 
        case "COMPLETED":
            return "outline";
        default:
            return "secondary";
    }
}