type AuthFormProps = {
  title: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function AuthForm({
  title,
  description,
  action,
  submitLabel,
}: AuthFormProps) {
  return (
    <form action={action} className="panel w-full max-w-md space-y-5 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Acceso
        </p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm leading-7 text-muted">{description}</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Correo</span>
        <input className="input" name="email" type="email" required />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Contraseña</span>
        <input className="input" name="password" type="password" required />
      </label>

      <button className="button-primary w-full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
