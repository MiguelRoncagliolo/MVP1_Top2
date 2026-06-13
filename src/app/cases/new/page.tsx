import { createReviewCaseAction } from "@/app/actions";
import { Topbar } from "@/components/topbar";
import { SetupNotice } from "@/components/setup-notice";
import { getCurrentUser } from "@/lib/auth";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/env";

export default async function NewCasePage() {
  const configured = isSupabaseConfigured() && isDatabaseConfigured();
  const user = configured ? await getCurrentUser() : null;

  return (
    <main className="pb-16">
      <Topbar email={user?.email} />
      {!configured ? <SetupNotice /> : null}
      <section className="page-shell mt-8">
        <form action={createReviewCaseAction} className="panel p-6 md:p-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
              Nuevo caso
            </p>
            <h1 className="text-3xl font-semibold">
              Crea un caso y ejecuta el pre-chequeo completo.
            </h1>
            <p className="text-sm leading-7 text-muted">
              Sube un documento de referencia y el certificado del postulante.
              El sistema comparará identidad, estructura básica y confianza OCR.
            </p>
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
            Este resultado es una pre-validación documental y no reemplaza
            validación oficial.
          </div>

          <button className="button-primary mt-6" type="submit">
            Procesar caso
          </button>
        </form>
      </section>
    </main>
  );
}
