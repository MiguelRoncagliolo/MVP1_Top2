import Link from "next/link";

const highlights = [
  "Compara nombre y RUT esperado con lo detectado en el documento.",
  "Contrasta el documento revisado contra una referencia legítima.",
  "Marca anomalías y deriva a revisión manual cuando la confianza cae.",
];

const steps = [
  "Inicia sesión y crea un caso.",
  "Sube una referencia y el certificado a revisar.",
  "Obtén un resumen con coincidencias, inconsistencias y recomendación.",
];

export default function HomePage() {
  return (
    <main className="pb-16">
      <section className="page-shell pt-8 md:pt-12">
        <div className="panel grid-faint overflow-hidden px-6 py-8 md:px-10 md:py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-6">
              <span className="badge bg-white/70">
                OS10 pre-check MVP
              </span>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl leading-tight font-semibold md:text-6xl">
                  Reduce el tiempo de revisión manual de certificados OS10
                  con comparación automática de identidad y consistencia documental.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted">
                  Diseñado para operaciones, reclutamiento y backoffice que hoy
                  dependen de una revisión visual lenta y repetitiva antes de la
                  validación final.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="button-primary" href="/login">
                  Ingresar al MVP
                </Link>
                <Link className="button-secondary" href="/dashboard">
                  Ver dashboard
                </Link>
              </div>
              <p className="max-w-2xl text-sm text-muted">
                Este resultado es una pre-validación documental y no reemplaza
                validación oficial.
              </p>
            </div>

            <div className="panel w-full max-w-md bg-[#fff7ef] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">
                Flujo principal
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-muted">
                {steps.map((step, index) => (
                  <li
                    key={step}
                    className="rounded-2xl border border-line bg-white/70 px-4 py-3"
                  >
                    <span className="mr-3 font-mono text-accent">
                      0{index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-8 grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="panel p-6 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Dolor operativo
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            La revisión manual consume tiempo y genera errores evitables.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            El MVP prioriza qué casos merecen atención humana temprana. No
            certifica autenticidad legal: ordena señales de coincidencia,
            consistencia y anomalía para acelerar el primer filtro documental.
          </p>
        </div>

        <div className="panel p-6 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Qué entrega
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-line bg-white/70 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
