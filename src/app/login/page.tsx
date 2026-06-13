import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SetupNotice } from "@/components/setup-notice";
import { signInAction, signUpAction } from "@/app/actions";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/env";

export default function LoginPage() {
  const configured = isSupabaseConfigured() && isDatabaseConfigured();

  return (
    <main className="page-shell flex flex-1 flex-col gap-6 py-10 md:py-16">
      {!configured ? <SetupNotice /> : null}
      <div className="grid gap-6 md:grid-cols-2">
        <AuthForm
          title="Iniciar sesión"
          description="Accede al dashboard y ejecuta el flujo completo de revisión."
          action={signInAction}
          submitLabel="Entrar"
        />
        <AuthForm
          title="Crear cuenta"
          description="Registro simple por correo para demo multiusuario con Supabase Auth."
          action={signUpAction}
          submitLabel="Crear cuenta"
        />
      </div>
      <Link className="text-sm text-muted underline underline-offset-4" href="/">
        Volver al inicio
      </Link>
    </main>
  );
}
