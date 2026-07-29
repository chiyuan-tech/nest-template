import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/** Stable shell for every generated CY SaaS homepage; content modules render only inside main. */
export function CySaasPageShell({ children }: { children: ReactNode }) {
  return <><Navbar /><main id="main-content">{children}</main><Footer /></>;
}
