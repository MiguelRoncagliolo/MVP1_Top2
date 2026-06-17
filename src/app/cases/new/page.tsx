import { ReviewCaseForm } from "@/components/review-case-form";
import { SetupNotice } from "@/components/setup-notice";
import { Topbar } from "@/components/topbar";
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
        <ReviewCaseForm
          title="Crea un caso y ejecuta el pre-chequeo completo."
          description="Sube un documento de referencia y el certificado del postulante. El sistema comparará identidad, estructura básica y confianza OCR."
          disclaimer="Este resultado es una pre-validación documental y no reemplaza validación oficial."
        />
      </section>
    </main>
  );
}
