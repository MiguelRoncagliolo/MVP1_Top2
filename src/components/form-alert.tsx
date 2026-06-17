import type { FormActionState } from "@/lib/action-state";

type FormAlertProps = {
  state: FormActionState;
};

export function FormAlert({ state }: FormAlertProps) {
  if (!state.error) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="rounded-2xl border border-[color:var(--danger)] bg-[color:color-mix(in_srgb,var(--danger)_8%,white)] px-4 py-3 text-sm leading-6 text-[color:var(--danger)]"
      role="alert"
    >
      {state.error}
    </div>
  );
}
