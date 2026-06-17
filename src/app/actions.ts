"use server";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormActionState } from "@/lib/action-state";
import { env, isDatabaseConfigured, isSupabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authSchema, createCaseSchema, validateFile } from "@/lib/validation";

function requireConfiguredRuntime() {
  if (!isSupabaseConfigured() || !isDatabaseConfigured()) {
    throw new Error(
      "Faltan variables de entorno. Configura Supabase y PostgreSQL antes de usar el flujo autenticado.",
    );
  }
}

function getActionErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Revisa los datos ingresados.";
  }

  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return "Tu correo aún no está verificado. Revisa tu bandeja y confirma el email antes de iniciar sesión.";
    }

    return error.message;
  }

  return "Ocurrió un error inesperado. Inténtalo nuevamente.";
}

export async function signUpAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    requireConfiguredRuntime();

    const values = authSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp(values);
    if (error) {
      throw new Error(error.message);
    }

    redirect("/dashboard");
  } catch (error) {
    return { error: getActionErrorMessage(error) };
  }
}

export async function signInAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    requireConfiguredRuntime();

    const values = authSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      throw new Error(error.message);
    }

    redirect("/dashboard");
  } catch (error) {
    return { error: getActionErrorMessage(error) };
  }
}

export async function signOutAction() {
  requireConfiguredRuntime();
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createReviewCaseAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    requireConfiguredRuntime();

    const [{ extractDocumentData }, { compareDocuments }] = await Promise.all([
      import("@/lib/document/extract"),
      import("@/lib/document/compare"),
    ]);
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const values = createCaseSchema.parse({
      title: formData.get("title"),
      expectedName: formData.get("expectedName"),
      expectedRut: formData.get("expectedRut"),
      expectedDocumentType: formData.get("expectedDocumentType") || undefined,
    });

    const referenceFile = formData.get("referenceFile") as File | null;
    const submittedFile = formData.get("submittedFile") as File | null;

    validateFile(referenceFile, "el documento de referencia");
    validateFile(submittedFile, "el documento del postulante");

    const admin = createSupabaseAdminClient();
    const caseId = crypto.randomUUID();

    const reviewCase = await prisma.reviewCase.create({
      data: {
        id: caseId,
        userId: user.id,
        title: values.title,
        expectedName: values.expectedName,
        expectedRut: values.expectedRut,
        expectedDocumentType: values.expectedDocumentType,
        status: "processing",
      },
    });

    const referencePath = `${user.id}/${caseId}/reference-${Date.now()}-${referenceFile!.name}`;
    const submittedPath = `${user.id}/${caseId}/submitted-${Date.now()}-${submittedFile!.name}`;

    const [referenceUpload, submittedUpload] = await Promise.all([
      admin.storage
        .from(env.SUPABASE_STORAGE_BUCKET)
        .upload(referencePath, Buffer.from(await referenceFile!.arrayBuffer()), {
          contentType: referenceFile!.type,
          upsert: false,
        }),
      admin.storage
        .from(env.SUPABASE_STORAGE_BUCKET)
        .upload(submittedPath, Buffer.from(await submittedFile!.arrayBuffer()), {
          contentType: submittedFile!.type,
          upsert: false,
        }),
    ]);

    if (referenceUpload.error || submittedUpload.error) {
      await prisma.reviewCase.update({
        where: { id: reviewCase.id },
        data: { status: "failed" },
      });

      throw new Error(
        referenceUpload.error?.message ?? submittedUpload.error?.message,
      );
    }

    const [referenceExtraction, submittedExtraction] = await Promise.all([
      extractDocumentData(referenceFile!),
      extractDocumentData(submittedFile!),
    ]);

    const comparison = compareDocuments({
      expectedName: values.expectedName,
      expectedRut: values.expectedRut,
      reference: referenceExtraction,
      submitted: submittedExtraction,
    });

    const referenceDocument = await prisma.document.create({
      data: {
        reviewCaseId: reviewCase.id,
        sourceType: "reference",
        storagePath: referencePath,
        fileName: referenceFile!.name,
        mimeType: referenceFile!.type,
        fileSize: Number(referenceFile!.size),
      },
    });

    const submittedDocument = await prisma.document.create({
      data: {
        reviewCaseId: reviewCase.id,
        sourceType: "submitted",
        storagePath: submittedPath,
        fileName: submittedFile!.name,
        mimeType: submittedFile!.type,
        fileSize: Number(submittedFile!.size),
      },
    });

    await prisma.extractedDocumentData.createMany({
      data: [
        {
          reviewCaseId: reviewCase.id,
          documentId: referenceDocument.id,
          sourceType: "reference",
          rawText: referenceExtraction.rawText,
          extractedName: referenceExtraction.extractedName,
          extractedRut: referenceExtraction.extractedRut,
          extractedDates: referenceExtraction.extractedDates,
          extractedDocumentType: referenceExtraction.extractedDocumentType,
          textBlocks: referenceExtraction.textBlocks,
          ocrConfidence: referenceExtraction.ocrConfidence,
        },
        {
          reviewCaseId: reviewCase.id,
          documentId: submittedDocument.id,
          sourceType: "submitted",
          rawText: submittedExtraction.rawText,
          extractedName: submittedExtraction.extractedName,
          extractedRut: submittedExtraction.extractedRut,
          extractedDates: submittedExtraction.extractedDates,
          extractedDocumentType: submittedExtraction.extractedDocumentType,
          textBlocks: submittedExtraction.textBlocks,
          ocrConfidence: submittedExtraction.ocrConfidence,
        },
      ],
    });

    await prisma.documentComparison.create({
      data: {
        reviewCaseId: reviewCase.id,
        identityMatch: comparison.identityMatch,
        rutMatch: comparison.rutMatch,
        referenceLayoutMatch: comparison.referenceLayoutMatch,
        detectedAnomaliesJson: comparison.detectedAnomalies,
        confidenceScore: comparison.confidenceScore,
        summary: comparison.summary,
      },
    });

    await prisma.reviewResult.create({
      data: {
        reviewCaseId: reviewCase.id,
        reviewStatus: comparison.reviewStatus,
        recommendation: comparison.recommendation,
        notes:
          "Este resultado es una pre-validación documental y no reemplaza validación oficial.",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "review_case.created",
        entityType: "review_case",
        entityId: reviewCase.id,
        metadata: {
          title: reviewCase.title,
          reviewStatus: comparison.reviewStatus,
        },
      },
    });

    await prisma.reviewCase.update({
      where: { id: reviewCase.id },
      data: {
        status:
          comparison.reviewStatus === "approvable"
            ? "completed"
            : "needs_attention",
      },
    });

    revalidatePath("/dashboard");
    redirect(`/cases/${reviewCase.id}`);
  } catch (error) {
    return { error: getActionErrorMessage(error) };
  }
}
