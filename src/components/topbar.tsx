import Link from "next/link";
import { signOutAction } from "@/app/actions";

type TopbarProps = {
  email?: string;
};

export function Topbar({ email }: TopbarProps) {
  return (
    <header className="page-shell pt-6">
      <div className="panel flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold">
            OS10 Document Pre-Check MVP
          </Link>
          <p className="text-sm text-muted">
            Pre-chequeo documental para priorizar revisión humana.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="button-secondary" href="/dashboard">
            Dashboard
          </Link>
          <Link className="button-secondary" href="/cases/new">
            Nuevo caso
          </Link>
          {email ? <span className="badge bg-white/70">{email}</span> : null}
          {email ? (
            <form action={signOutAction}>
              <button className="button-primary" type="submit">
                Cerrar sesión
              </button>
            </form>
          ) : (
            <Link className="button-primary" href="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
