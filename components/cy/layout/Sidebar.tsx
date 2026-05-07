"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { cyRegistry } from "@/components/cy/registry";

export function CySidebar() {
  const pathname = usePathname();
  const menuContent = (
    <>
      <p className="mb-4 text-sm font-semibold text-muted-foreground">CY Components</p>
      <nav className="space-y-4">
        {cyRegistry.map((category) => (
          <div key={category.slug} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {category.label}
            </p>
            <div className="space-y-1">
              {category.demos.map((demo) => {
                const href = `/cy/${category.slug}/${demo.slug}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={demo.slug}
                    href={href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {demo.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      <aside className="w-full rounded-xl border bg-card p-4 lg:hidden">{menuContent}</aside>
      <div className="hidden w-72 shrink-0 lg:block" aria-hidden />
      <aside className="hidden w-72 rounded-xl border bg-card p-4 lg:fixed lg:left-6 lg:top-40 lg:block lg:max-h-[calc(100vh-11rem)] lg:overflow-auto">
        {menuContent}
      </aside>
    </>
  );
}
