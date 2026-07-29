import type { ReactNode } from "react";
import { CySidebar } from "@/components/cy/layout/Sidebar";
import { ThemeCustomizer } from "@/components/cy/layout/ThemeCustomizer";

export default function CyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full px-4 pb-6 pt-24 lg:px-6">
      <ThemeCustomizer />
      <div className="flex flex-col gap-6 lg:flex-row">
        <CySidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
