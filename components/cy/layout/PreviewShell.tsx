import type { ReactNode } from "react";

interface PreviewShellProps {
  categoryLabel: string;
  demoTitle: string;
  description: string;
  children: ReactNode;
}

export function PreviewShell({
  categoryLabel,
  demoTitle,
  description,
  children,
}: PreviewShellProps) {
  return (
    <section className="w-full space-y-4">
      <header className="rounded-xl border bg-card p-5">
        <p className="text-sm text-muted-foreground">{categoryLabel}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{demoTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="min-h-[420px] rounded-xl border bg-muted/20 p-4 md:p-6">{children}</div>
    </section>
  );
}
