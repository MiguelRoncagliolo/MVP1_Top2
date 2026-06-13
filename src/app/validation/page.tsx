import { Topbar } from "@/components/topbar";

const destructiveCases = [
  "Falta documento del postulante.",
  "Archivo no soportado.",
  "Escaneo ilegible o con baja calidad.",
  "Nombre no coincide con lo esperado.",
  "RUT no coincide con lo esperado.",
  "La estructura del documento difiere de la referencia.",
];

export default function ValidationPage() {
  return (
    <main className="pb-16">
      <Topbar />
      <section className="page-shell mt-8 grid gap-6 md:grid-cols-2">
        <div className="panel p-6 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Validación
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Script de demo y validación con cliente o profesor.
          </h1>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-muted">
            <li className="rounded-2xl border border-line bg-white/70 px-4 py-3">
              Registrar usuario e iniciar sesión.
            </li>
            <li className="rounded-2xl border border-line bg-white/70 px-4 py-3">
              Crear caso con nombre y RUT esperados.
            </li>
            <li className="rounded-2xl border border-line bg-white/70 px-4 py-3">
              Subir referencia y documento a revisar.
            </li>
            <li className="rounded-2xl border border-line bg-white/70 px-4 py-3">
              Ver resultado persistido y explicar alcance no oficial.
            </li>
          </ol>
        </div>
        <div className="panel p-6 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Pruebas destructivas
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
            {destructiveCases.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-line bg-white/70 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-7 text-muted">
            El sistema debe responder con error claro, baja confianza o revisión
            manual. Nunca debe simular validación oficial ni inventar certeza.
          </p>
        </div>
      </section>
    </main>
  );
}
