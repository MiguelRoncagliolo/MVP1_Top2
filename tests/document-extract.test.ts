import { describe, expect, it } from "vitest";
import { pickName } from "@/lib/document/extract";

describe("pickName", () => {
  it("prioritizes the labeled name over document headers", () => {
    const result = pickName([
      "CERTIFICADO OS10",
      "Datos del titular",
      "Nombre: Juan Perez Soto",
      "RUT: 12.345.678-5",
      "Curso: Vigilancia Privada OS10",
    ]);

    expect(result).toBe("Juan Perez Soto");
  });

  it("ignores common headers when no labeled name is present", () => {
    const result = pickName([
      "CERTIFICADO ACADEMICO",
      "REVISION INTERNA",
      "Juan Perez Soto",
      "12.345.678-5",
    ]);

    expect(result).toBe("Juan Perez Soto");
  });
});
