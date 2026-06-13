export function SetupNotice() {
  return (
    <div className="panel page-shell mt-8 p-6 md:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
        Configuración requerida
      </p>
      <h2 className="mt-3 text-2xl font-semibold">
        Falta conectar Supabase y PostgreSQL para usar el flujo autenticado.
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
        Define `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
        `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`. Luego
        ejecuta las migraciones Prisma y crea el bucket indicado en
        `SUPABASE_STORAGE_BUCKET`.
      </p>
    </div>
  );
}
