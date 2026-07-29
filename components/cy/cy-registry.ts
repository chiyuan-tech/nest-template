import manifest from "@/components/cy/cy-registry.manifest.json";

export type CyModuleId = keyof typeof manifest.modules;
export type CyRegisteredModule = (typeof manifest.modules)[CyModuleId];

/** Single source of truth for modules allowed in generated CY pages. */
export const cyModuleRegistry = manifest.modules as Record<CyModuleId, CyRegisteredModule>;

export function getCyModule(id: string): CyRegisteredModule | null {
  return Object.prototype.hasOwnProperty.call(cyModuleRegistry, id)
    ? cyModuleRegistry[id as CyModuleId]
    : null;
}
