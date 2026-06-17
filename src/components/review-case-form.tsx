"use client";

import { useActionState } from "react";
import { createReviewCaseAction } from "@/app/actions";
import { CaseSubmitButton } from "@/components/case-submit-button";
import { FormAlert } from "@/components/form-alert";
import {
  initialFormActionState,
  type FormActionState,
} from "@/lib/action-state";

type ReviewCaseFormProps = {
  title: string;
  description: string;
  disclaimer: string;
};

export function ReviewCaseForm({
  title,
  description,
  disclaimer,
}: ReviewCaseFormProps) {
  const [state, formAction] = useActionState<FormActionState, FormData>(
    createReviewCaseAction,
    initialFormActionState,
  );

  return (
    <form action={formAction} className="panel p-6 md:p-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Nuevo caso
        </p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm leading-7 text-muted">{description}</p>
      </div>

      <div className="mt-6">
        <FormAlert state={state} />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">Título del caso</span>
          <input className="input" name="title" required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Tipo de documento</span>
          <input className="input" name="expectedDocumentType" />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Nombre esperado</span>
          <input className="input" name="expectedName" required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">RUT esperado</span>
          <input className="input" name="expectedRut" required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Referencia legítima</span>
          <input
            className="input"
            name="referenceFile"
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Documento a revisar</span>
          <input
            className="input"
            name="submittedFile"
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            required
          />
        </label>
      </div>

      <div className="mt-8 rounded-3xl border border-line bg-white/70 p-4 text-sm leading-7 text-muted">
        {disclaimer}
      </div>

      <CaseSubmitButton />
    </form>
  );
}
