import { describe, it, expect } from "vitest";
import { getTranslation } from "../get-translation";

describe("getTranslation function", () => {
  it("should return null if entity is null, undefined, or lacks translations", () => {
    expect(getTranslation(null, "uk")).toBeNull();
    expect(getTranslation(undefined, "uk")).toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getTranslation({} as any, "uk")).toBeNull();
  });

  it("should find an exact match for the requested locale", () => {
    const entity = {
      translations: [
        { language: "en", title: "Home" },
        { language: "uk", title: "Головна" },
      ],
    };
    expect(getTranslation(entity, "en")).toEqual({
      language: "en",
      title: "Home",
    });
  });

  it("should return the fallback translation (default locale) if requested locale is missing", () => {
    const entity = {
      translations: [
        { language: "en", title: "Home" },
        { language: "uk", title: "Головна" },
      ],
    };
    expect(getTranslation(entity, "pl")).toEqual({
      language: "uk",
      title: "Головна",
    });
  });

  it("should return the first available translation if neither requested nor fallback locale is found", () => {
    const entity = {
      translations: [
        { language: "es", title: "Inicio" },
        { language: "fr", title: "Accueil" },
      ],
    };
    expect(getTranslation(entity, "de")).toEqual({
      language: "es",
      title: "Inicio",
    });
  });

  it("should return null if the translations array is empty", () => {
    const entity = { translations: [] };
    expect(getTranslation(entity, "uk")).toBeNull();
  });
});
