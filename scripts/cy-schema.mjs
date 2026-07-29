import { z } from "zod";
import manifest from "../components/cy/cy-registry.manifest.json" with { type: "json" };

const moduleEntrySchema = z.object({ __cyComponentPath: z.string().optional(), _meta: z.record(z.unknown()).optional() }).passthrough();
export const cyTemplateSchema = z.record(z.union([z.record(z.string()), moduleEntrySchema]));
const registeredPaths = new Set(Object.values(manifest.modules).map((entry) => entry.componentPath));

export function validateCyTemplate(value) {
  const parsed = cyTemplateSchema.safeParse(value);
  if (!parsed.success) throw new Error("Invalid cy_templeate.json: " + parsed.error.issues.map((issue) => issue.path.join(".") + " " + issue.message).join("; "));
  for (const [key, entry] of Object.entries(parsed.data)) {
    if (key === "theme" || !entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const path = entry.__cyComponentPath;
    if (!path) continue;
    const normalized = String(path).replace(/\.(tsx|ts|jsx|js)$/i, "");
    if (!registeredPaths.has(normalized)) throw new Error(`CY module "${key}" uses unregistered component path: ${path}`);
  }
  return parsed.data;
}

export { manifest };
