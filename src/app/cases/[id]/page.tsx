import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/topbar";
import { StatusPill } from "@/components/status-pill";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/env";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const configured = isSupabaseConfigured() && isDatabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  const { id } = await params;

  const reviewCase =
    configured && user
      ? await prisma.reviewCase.findFirst({
          where: { id, userId: user.id },
          include: {
            documents: true,
            extractedData: true,
            comparison: true,
            reviewResult: true,
          },
        })
      : null;

  if (!reviewCase && configured) {
    notFound();
  }

  return (
    <main className="pb-16">
      <Topbar email={user?.email} />
      <section className="page-shell mt-8 grid gap-6">
        <div className="panel p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                Detalle de caso
              </p>
              <h1 className="mt-3 text-3xl font-semibold">
                {reviewCase?.title ?? "Caso no disponible"}
              </h1>
              <p className="mt-2 text-sm text-muted">
                {reviewCase?.expectedName ?? "Pendiente"} ·{" "}
                {reviewCase?.expectedRut ?? "Pendiente"}
              </p>
            </div>
            <div className="flex gap-3">
              {reviewCase ? <StatusPill value={reviewCase.status} /> : null}
              {reviewCase?.reviewResult ? (
                <StatusPill value={reviewCase.reviewResult.reviewStatus} />
              ) : null}
            </div>
          </div>
        </div>

        {reviewCase ? (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="panel p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                  Resumen
                </p>
                <p className="mt-4 text-sm leading-7 text-muted">
                  {reviewCase.comparison?.summary}
                </p>
                <p className="mt-4 text-sm font-semibold">
                  {reviewCase.reviewResult?.recommendation}
                </p>
              </div>
              <div className="panel p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                  Score de confianza
                </p>
                <p className="mt-4 text-4xl font-semibold">
                  {Math.round((reviewCase.comparison?.confidenceScore ?? 0) * 100)}%
                </p>
                <p className="mt-2 text-sm text-muted">
                  Basado en OCR, coincidencia de identidad y consistencia de
                  referencia.
                </p>
              </div>
              <div className="panel p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                  Trazabilidad
                </p>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Creado el {formatDate(reviewCase.createdAt)}.
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Última actualización {formatDate(reviewCase.updatedAt)}.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="panel p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                  Anomalías
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
                  {(reviewCase.comparison?.detectedAnomaliesJson as string[] | undefined)
                    ?.length ? (
                    (reviewCase.comparison?.detectedAnomaliesJson as string[]).map(
                      (anomaly) => (
                        <li
                          key={anomaly}
                          className="rounded-2xl border border-line bg-white/70 px-4 py-3"
                        >
                          {anomaly}
                        </li>
                      ),
                    )
                  ) : (
                    <li className="rounded-2xl border border-line bg-white/70 px-4 py-3">
                      No se detectaron anomalías relevantes.
                    </li>
                  )}
                </ul>
              </div>
              <div className="panel p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                  Extracción
                </p>
                <div className="mt-4 space-y-4 text-sm text-muted">
                  {reviewCase.extractedData.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-line bg-white/70 p-4"
                    >
                      <p className="font-semibold text-foreground">
                        {item.sourceType === "reference"
                          ? "Documento de referencia"
                          : "Documento revisado"}
                      </p>
                      <p className="mt-2">Nombre detectado: {item.extractedName ?? "-"}</p>
                      <p>RUT detectado: {item.extractedRut ?? "-"}</p>
                      <p>
                        Confianza OCR: {Math.round(item.ocrConfidence * 100)}%
                      </p>
                      <p className="mt-2 line-clamp-4 text-xs leading-6">
                        {item.rawText || "Sin texto extraído."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="panel p-6 text-sm text-muted">
            Configura el entorno para consultar detalles persistidos.
          </div>
        )}
      </section>
    </main>
  );
}
