"use client";

import { useFormStatus } from "react-dom";

export function CaseSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="mt-6 space-y-3">
      <button
        className="button-primary w-full md:w-auto disabled:cursor-wait disabled:opacity-70"
        type="submit"
        disabled={pending}
      >
        {pending ? "Procesando postulacion..." : "Procesar caso"}
      </button>
      <p aria-live="polite" className="text-sm text-muted">
        {pending
          ? "Estamos extrayendo y comparando los documentos. Esto puede tardar unos segundos."
          : "Sube los documentos y envia el caso para iniciar el analisis."}
      </p>
    </div>
  );
}
