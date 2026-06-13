import { ComparisonResult, ExtractedDocumentData } from "@/lib/document/types";
import { normalizeText } from "@/lib/utils";

function normalizeRut(value: string | null | undefined) {
  if (!value) return null;
  return value.replace(/[.\s]/g, "").toUpperCase();
}

function lineSimilarity(a: string[], b: string[]) {
  if (a.length === 0 || b.length === 0) {
    return 0;
  }

  const setA = new Set(a.map(normalizeText));
  const setB = new Set(b.map(normalizeText));
  const overlap = [...setA].filter((line) => setB.has(line)).length;
  return overlap / Math.max(setA.size, setB.size, 1);
}

function getMissingReferenceSignals(reference: ExtractedDocumentData, submitted: ExtractedDocumentData) {
  const referenceText = normalizeText(reference.rawText);
  const submittedText = normalizeText(submitted.rawText);
  const signals = [
    "nombre:",
    "rut:",
    "curso:",
    "fecha",
    "institucion",
    "codigo verificacion",
  ];

  return signals.filter(
    (signal) => referenceText.includes(signal) && !submittedText.includes(signal),
  );
}

function computeConfidenceScore(params: {
  identityMatch: boolean;
  rutMatch: boolean;
  referenceLayoutScore: number;
  submittedOcrConfidence: number;
  anomalyCount: number;
}) {
  const {
    identityMatch,
    rutMatch,
    referenceLayoutScore,
    submittedOcrConfidence,
    anomalyCount,
  } = params;

  const signalScore =
    (identityMatch ? 0.35 : 0) +
    (rutMatch ? 0.35 : 0) +
    Math.min(Math.max(referenceLayoutScore, 0), 1) * 0.2 +
    Math.min(Math.max(submittedOcrConfidence, 0), 1) * 0.1;

  const anomalyPenalty = Math.min(anomalyCount * 0.08, 0.24);
  return Number(Math.max(0, Math.min(1, signalScore - anomalyPenalty)).toFixed(2));
}

export function compareDocuments(params: {
  expectedName: string;
  expectedRut: string;
  reference: ExtractedDocumentData;
  submitted: ExtractedDocumentData;
}) {
  const { expectedName, expectedRut, reference, submitted } = params;

  const normalizedExpectedName = normalizeText(expectedName);
  const normalizedSubmittedName = normalizeText(submitted.extractedName ?? "");
  const identityMatch =
    normalizedSubmittedName.length > 0 &&
    (normalizedSubmittedName.includes(normalizedExpectedName) ||
      normalizedExpectedName.includes(normalizedSubmittedName));

  const rutMatch =
    normalizeRut(expectedRut) !== null &&
    normalizeRut(expectedRut) === normalizeRut(submitted.extractedRut);

  const referenceLayoutScore = lineSimilarity(
    reference.textBlocks.slice(0, 12),
    submitted.textBlocks.slice(0, 12),
  );
  const referenceLayoutMatch = referenceLayoutScore >= 0.35;

  const anomalies: string[] = [];
  if (!identityMatch) anomalies.push("El nombre detectado no coincide con el esperado.");
  if (!rutMatch) anomalies.push("El RUT detectado no coincide con el esperado.");
  if (!referenceLayoutMatch) {
    anomalies.push("La estructura textual difiere de la referencia cargada.");

    const missingSignals = getMissingReferenceSignals(reference, submitted);
    if (missingSignals.length > 0) {
      anomalies.push(
        `Faltan senales del formato de referencia en el documento revisado: ${missingSignals.join(", ")}.`,
      );
    }

    if (
      reference.extractedDocumentType &&
      submitted.extractedDocumentType &&
      reference.extractedDocumentType !== submitted.extractedDocumentType
    ) {
      anomalies.push(
        `El tipo de documento detectado difiere de la referencia: ${submitted.extractedDocumentType} vs ${reference.extractedDocumentType}.`,
      );
    }

    const sharedDates = submitted.extractedDates.filter((date) =>
      reference.extractedDates.includes(date),
    );
    if (reference.extractedDates.length > 0 && sharedDates.length === 0) {
      anomalies.push("Las fechas detectadas no coinciden con las presentes en la referencia.");
    }
  }
  if (submitted.ocrConfidence < 0.55) {
    anomalies.push("La confianza del OCR es baja; se recomienda revisión manual.");
  }
  if (!submitted.rawText.trim()) {
    anomalies.push("No se logró extraer texto útil del documento enviado.");
  }

  const confidenceScore = computeConfidenceScore({
    identityMatch,
    rutMatch,
    referenceLayoutScore,
    submittedOcrConfidence: submitted.ocrConfidence,
    anomalyCount: anomalies.length,
  });

  let reviewStatus: ComparisonResult["reviewStatus"] = "manual_review";
  if (identityMatch && rutMatch && referenceLayoutMatch && submitted.ocrConfidence >= 0.75) {
    reviewStatus = "approvable";
  } else if (!identityMatch || !rutMatch) {
    reviewStatus = submitted.ocrConfidence < 0.55 ? "manual_review" : "reject";
  } else if (!referenceLayoutMatch) {
    reviewStatus = "manual_review";
  }

  const recommendationMap: Record<ComparisonResult["reviewStatus"], string> = {
    approvable: "Aprobable para siguiente revisión humana.",
    observe: "Observar diferencias de formato antes de continuar.",
    reject: "Rechazar preliminarmente o escalar por inconsistencia de identidad.",
    manual_review:
      "Requiere revisión manual por diferencias de formato, baja certeza o extracción incompleta.",
  };

  const summary = [
    identityMatch ? "Identidad consistente." : "Identidad inconsistente.",
    rutMatch ? "RUT consistente." : "RUT inconsistente.",
    referenceLayoutMatch
      ? "Formato similar a la referencia."
      : "Formato distinto a la referencia.",
  ].join(" ");

  return {
    identityMatch,
    rutMatch,
    referenceLayoutMatch,
    extractedName: submitted.extractedName,
    extractedRut: submitted.extractedRut,
    detectedAnomalies: anomalies,
    reviewStatus,
    confidenceScore,
    summary,
    recommendation: recommendationMap[reviewStatus],
  } satisfies ComparisonResult;
}
