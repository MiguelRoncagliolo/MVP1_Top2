"use client";

import { useActionState } from "react";
import { FormAlert } from "@/components/form-alert";
import {
  initialFormActionState,
  type FormActionState,
} from "@/lib/action-state";

type AuthFormProps = {
  title: string;
  description: string;
  action: (
    state: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  submitLabel: string;
};

export function AuthForm({
  title,
  description,
  action,
  submitLabel,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialFormActionState,
  );

  return (
    <form
      action={formAction}
      className="panel w-full max-w-md space-y-5 p-6 md:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Acceso
        </p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm leading-7 text-muted">{description}</p>
      </div>

      <FormAlert state={state} />

      <label className="block space-y-2">
        <span className="text-sm font-medium">Correo</span>
        <input className="input" name="email" type="email" required />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Contraseña</span>
        <input className="input" name="password" type="password" required />
      </label>

      <button className="button-primary w-full" type="submit">
        {pending ? "Procesando..." : submitLabel}
      </button>
    </form>
  );
}
