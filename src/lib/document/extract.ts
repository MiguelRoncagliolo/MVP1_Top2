import { normalizeText } from "@/lib/utils";
import { ExtractedDocumentData } from "@/lib/document/types";

const rutRegex = /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/g;
const dateRegex = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g;

function pickName(lines: string[]) {
  const candidates = lines
    .map((line) => line.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, " ").trim())
    .filter((line) => line.split(/\s+/).length >= 2 && line.length > 8);

  return candidates[0] ?? null;
}

function pickDocumentType(text: string) {
  const normalized = normalizeText(text);
  if (normalized.includes("os10")) {
    return "Certificado OS10";
  }
  if (normalized.includes("curso")) {
    return "Certificado de curso";
  }
  return null;
}

export async function extractDocumentData(file: File): Promise<ExtractedDocumentData> {
  const bytes = Buffer.from(await file.arrayBuffer());
  let rawText = "";
  let confidence = 0;

  if (file.type === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: bytes });
    const parsed = await parser.getText();
    await parser.destroy();
    rawText = parsed.text ?? "";
    confidence = rawText.trim() ? 0.82 : 0.2;
  } else {
    const [{ createWorker }, { createRequire }] = await Promise.all([
      import("tesseract.js"),
      import("node:module"),
    ]);
    const require = createRequire(import.meta.url);
    const workerPath = require.resolve("tesseract.js/src/worker-script/node/index.js");
    const worker = await createWorker("spa", 1, { workerPath });
    const result = await worker.recognize(bytes);
    await worker.terminate();
    rawText = result.data.text ?? "";
    confidence = (result.data.confidence ?? 0) / 100;
  }

  const textBlocks = rawText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const extractedRut = rawText.match(rutRegex)?.[0] ?? null;
  const extractedDates = Array.from(new Set(rawText.match(dateRegex) ?? []));

  return {
    rawText,
    extractedName: pickName(textBlocks),
    extractedRut,
    extractedDates,
    extractedDocumentType: pickDocumentType(rawText),
    textBlocks,
    ocrConfidence: Number(confidence.toFixed(2)),
  };
}
