import { describe, expect, it } from "vitest";
import { compareDocuments } from "@/lib/document/compare";

const reference = {
  rawText: "CERTIFICADO OS10\nJUAN PEREZ\n12.345.678-5",
  extractedName: "JUAN PEREZ",
  extractedRut: "12.345.678-5",
  extractedDates: ["01/01/2026"],
  extractedDocumentType: "Certificado OS10",
  textBlocks: ["CERTIFICADO OS10", "JUAN PEREZ", "12.345.678-5"],
  ocrConfidence: 0.88,
};

describe("compareDocuments", () => {
  it("marks a clean document as approvable", () => {
    const result = compareDocuments({
      expectedName: "Juan Perez",
      expectedRut: "12.345.678-5",
      reference,
      submitted: reference,
    });

    expect(result.identityMatch).toBe(true);
    expect(result.rutMatch).toBe(true);
    expect(result.referenceLayoutMatch).toBe(true);
    expect(result.reviewStatus).toBe("approvable");
  });

  it("raises anomalies when identity does not match", () => {
    const result = compareDocuments({
      expectedName: "Maria Soto",
      expectedRut: "12.345.678-5",
      reference,
      submitted: {
        ...reference,
        extractedName: "Pedro Rojas",
        extractedRut: "11.111.111-1",
        ocrConfidence: 0.9,
      },
    });

    expect(result.identityMatch).toBe(false);
    expect(result.rutMatch).toBe(false);
    expect(result.reviewStatus).toBe("reject");
    expect(result.detectedAnomalies.length).toBeGreaterThan(1);
  });

  it("gives a higher confidence score to a full match than to a mismatched document", () => {
    const matching = compareDocuments({
      expectedName: "Juan Perez",
      expectedRut: "12.345.678-5",
      reference,
      submitted: reference,
    });

    const mismatched = compareDocuments({
      expectedName: "Juan Perez",
      expectedRut: "12.345.678-5",
      reference,
      submitted: {
        ...reference,
        extractedName: "Certificado OS10",
        extractedRut: "12.345.678-0",
        textBlocks: ["OTRO FORMATO", "RUT 12.345.678-0"],
      },
    });

    expect(matching.confidenceScore).toBeGreaterThan(mismatched.confidenceScore);
  });

  it("sends a format mismatch with matching identity to manual review and explains why", () => {
    const result = compareDocuments({
      expectedName: "Juan Perez",
      expectedRut: "12.345.678-5",
      reference: {
        ...reference,
        rawText:
          "CERTIFICADO OS10\nNombre: Juan Perez\nRUT: 12.345.678-5\nCurso: OS10\nFecha: 01/01/2026\nInstitucion: Demo",
        textBlocks: [
          "CERTIFICADO OS10",
          "Nombre: Juan Perez",
          "RUT: 12.345.678-5",
          "Curso: OS10",
          "Fecha: 01/01/2026",
          "Institucion: Demo",
        ],
      },
      submitted: {
        ...reference,
        rawText: "Nombre: Juan Perez\nRUT: 12.345.678-5\nDocumento simple",
        textBlocks: ["Nombre: Juan Perez", "RUT: 12.345.678-5", "Documento simple"],
      },
    });

    expect(result.identityMatch).toBe(true);
    expect(result.rutMatch).toBe(true);
    expect(result.referenceLayoutMatch).toBe(false);
    expect(result.reviewStatus).toBe("manual_review");
    expect(
      result.detectedAnomalies.some((item) => item.includes("Faltan senales del formato")),
    ).toBe(true);
  });
});
