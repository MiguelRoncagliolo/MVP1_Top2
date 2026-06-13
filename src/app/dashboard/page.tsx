import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/topbar";
import { SetupNotice } from "@/components/setup-notice";
import { StatusPill } from "@/components/status-pill";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/env";

export default async function DashboardPage() {
  const configured = isSupabaseConfigured() && isDatabaseConfigured();
  const user = configured ? await getCurrentUser() : null;

  const cases =
    configured && user
      ? await prisma.reviewCase.findMany({
          where: { userId: user.id },
          include: {
            reviewResult: true,
            comparison: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

  return (
    <main className="pb-16">
      <Topbar email={user?.email} />
      {!configured ? <SetupNotice /> : null}
      <section className="page-shell mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-6 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Historial y trazabilidad de revisiones.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
            Cada caso guarda metadata esperada, extracción OCR, anomalías y
            recomendación. Si no has iniciado sesión aún, usa `/login`.
          </p>
          <div className="mt-6 flex gap-3">
            <Link className="button-primary" href="/cases/new">
              Crear nuevo caso
            </Link>
            <Link className="button-secondary" href="/validation">
              Validación y pruebas
            </Link>
          </div>
        </div>

        <div className="panel p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                Últimos casos
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {cases.length} caso{cases.length === 1 ? "" : "s"} registrado
                {cases.length === 1 ? "" : "s"}
              </h2>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {cases.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line px-4 py-8 text-sm text-muted">
                Aún no hay revisiones guardadas para este usuario.
              </div>
            ) : (
              cases.map((reviewCase) => (
                <Link
                  key={reviewCase.id}
                  href={`/cases/${reviewCase.id}`}
                  className="block rounded-3xl border border-line bg-white/70 p-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold">{reviewCase.title}</p>
                      <p className="text-sm text-muted">
                        {reviewCase.expectedName} · {reviewCase.expectedRut}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusPill value={reviewCase.status} />
                      {reviewCase.reviewResult ? (
                        <StatusPill
                          value={reviewCase.reviewResult.reviewStatus}
                          label={reviewCase.reviewResult.reviewStatus}
                        />
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    {reviewCase.comparison?.summary ?? "Sin comparación aún."}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
                    {formatDate(reviewCase.createdAt)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
