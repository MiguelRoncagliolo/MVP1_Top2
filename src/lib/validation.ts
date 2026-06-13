import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export const createCaseSchema = z.object({
  title: z.string().min(3, "Ingresa un título descriptivo.").max(120),
  expectedName: z.string().min(3, "Ingresa el nombre esperado.").max(120),
  expectedRut: z.string().min(7, "Ingresa el RUT esperado.").max(20),
  expectedDocumentType: z.string().max(80).optional(),
});

export const supportedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function validateFile(file: File | null, label: string) {
  if (!file || file.size === 0) {
    throw new Error(`Falta ${label}.`);
  }

  if (!supportedMimeTypes.includes(file.type as (typeof supportedMimeTypes)[number])) {
    throw new Error(`${label}: formato no soportado.`);
  }
}
