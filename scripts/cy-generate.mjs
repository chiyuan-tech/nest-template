/**
 * 根据 cy_templeate.json 中所有带 __cyComponentPath 的块（书写顺序）生成 app 下 page.tsx；
 * 生成的 Page 从 @/cy_templeate.json 读数（cyBlockData 去掉 __* / _meta）。
 * 不读写 components/cy/cy-modules.config.json。
 *
 * 特例：根级 `theme` 对象（`"--primary": "oklch(...)"` 等）不参与页面堆叠；执行时写入 `app/globals.css` 的 `.dark { ... }` 中已存在的同名变量。
 *
 *   npm run cy                    → app/page.tsx
 *   npm run cy:preview            → app/preview/page.tsx（package.json 里需有同名脚本指向本文件）
 *   npm run cy:check              → 仅校验
 *   npm run cy:check:preview      → 校验 app/preview/page.tsx
 *   node scripts/cy-generate.mjs --segment foo/bar
 *   npm run cy -- foo             → app/foo/page.tsx（仅 cy 脚本 + 一个路径参数时）
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TEMPLATE_PATH = path.join(ROOT, "cy_templeate.json");
const GLOBALS_CSS_PATH = path.join(ROOT, "app", "globals.css");

/** 非 CY 生成的首页可保留；有该片段才校验 page 内容 */
const CY_PAGE_MARKER = "source: cy_templeate.json";

/** npm 会把当前脚本名放在此变量，例如 cy:landing → segment landing */
function parseNpmLifecycleEvent() {
  const ev = process.env.npm_lifecycle_event;
  if (!ev || typeof ev !== "string") {
    return { check: false, segmentFromLife: undefined };
  }

  if (ev === "cy" || ev === "cy:generate") {
    return { check: false, segmentFromLife: undefined };
  }
  if (ev === "cy:check" || ev === "cy:generate:check") {
    return { check: true, segmentFromLife: undefined };
  }
  if (ev.startsWith("cy:check:")) {
    const rest = ev.slice("cy:check:".length);
    return { check: true, segmentFromLife: rest };
  }
  if (ev.startsWith("cy:") && ev.length > 3) {
    return { check: false, segmentFromLife: ev.slice(3) };
  }
  return { check: false, segmentFromLife: undefined };
}

/** 命令行显式 --segment；未传则返回 undefined */
function parseExplicitSegmentFlag() {
  const i = process.argv.indexOf("--segment");
  if (i === -1) return undefined;
  const v = process.argv[i + 1];
  if (!v || v.startsWith("-")) return "";
  return String(v).replace(/^\/+|\/+$/g, "").replace(/\\/g, "/");
}

/** node …/cy-generate.mjs foo（无 --segment 时的一个尾随路径） */
function parseTrailingSegmentArg() {
  if (process.argv.includes("--segment")) return "";
  const scriptIdx = process.argv.findIndex((a) => /cy-generate\.mjs$/.test(a));
  if (scriptIdx === -1) return "";
  const tail = process.argv.slice(scriptIdx + 1).filter((a) => a !== "--check");
  const positional = tail.filter((a) => !a.startsWith("-"));
  if (positional.length === 1) {
    return String(positional[0]).replace(/^\/+|\/+$/g, "").replace(/\\/g, "/");
  }
  return "";
}

function normalizeSegment(segment) {
  return String(segment).replace(/^\/+|\/+$/g, "").replace(/\\/g, "/");
}

function isSingleNpmScriptToken(segment) {
  return segment.length > 0 && /^[a-zA-Z0-9_-]+$/.test(segment);
}

/** 用于生成文件头与报错提示（含斜杠等时用 node CLI） */
function suggestNpmCyCommand(segment, check) {
  const seg = normalizeSegment(segment);
  if (check) {
    if (!seg) return "npm run cy:check";
    if (isSingleNpmScriptToken(seg)) return `npm run cy:check:${seg}`;
    return `node scripts/cy-generate.mjs --check --segment ${seg}`;
  }
  if (!seg) return "npm run cy";
  if (isSingleNpmScriptToken(seg)) return `npm run cy:${seg}`;
  return `node scripts/cy-generate.mjs --segment ${seg}`;
}

function resolveRunOptions() {
  const life = parseNpmLifecycleEvent();
  const explicitCheck = process.argv.includes("--check");
  const CHECK = explicitCheck || life.check;

  const explicitSeg = parseExplicitSegmentFlag();
  let segment = "";
  if (explicitSeg !== undefined) {
    segment = explicitSeg;
  } else if (life.segmentFromLife !== undefined) {
    segment = life.segmentFromLife;
  } else {
    segment = parseTrailingSegmentArg();
  }

  segment = normalizeSegment(segment);
  if (segment.includes("..")) {
    console.error("[cy-generate] Invalid segment path");
    process.exit(1);
  }

  return { CHECK, segment };
}

const { CHECK, segment } = resolveRunOptions();

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** 与 _meta.generateComponent 脚手架一致：优先 __cyComponentPath 文件名，否则模板顶层 key */
function resolveConfigKey(templateKey, entry) {
  const hint = entry && typeof entry === "object" ? entry.__cyComponentPath : null;
  if (typeof hint === "string" && hint.length > 0) {
    const normalized = hint.split("?")[0].replace(/\\/g, "/");
    const base = path.posix.basename(normalized);
    return base.replace(/\.(tsx?|jsx?)$/i, "");
  }
  return templateKey;
}

function normalizeImportPath(hint) {
  return String(hint).split("?")[0].replace(/\\/g, "/").replace(/\.(tsx|ts|jsx|js)$/i, "");
}

function resolveOutputPageRel(segment) {
  const seg = segment.replace(/\.\./g, "").replace(/^\/+|\/+$/g, "");
  if (!seg) return path.join("app", "page.tsx");
  return path.join("app", ...seg.split("/").filter(Boolean), "page.tsx");
}

/** 同一模块路径合并为一行 import，避免重复 */
function buildModuleImportLines(blocks) {
  const pathToNames = new Map();
  for (const b of blocks) {
    if (!pathToNames.has(b.importSpec)) pathToNames.set(b.importSpec, []);
    const arr = pathToNames.get(b.importSpec);
    if (!arr.includes(b.componentName)) arr.push(b.componentName);
  }
  return [...pathToNames.entries()]
    .map(([p, names]) => `import { ${names.join(", ")} } from "${p}";`)
    .join("\n");
}

function buildMultiBlockPageSource({ blocks, regenerateHint }) {
  const importLines = buildModuleImportLines(blocks);
  const stack = blocks
    .map(
      (b) =>
        `      <${b.componentName} data={cyBlockData(cyTemplate["${b.templateKey}"] as Record<string, unknown>) as never} />`
    )
    .join("\n");
  return `/** Generated by \`${regenerateHint}\` — source: cy_templeate.json. Re-run to refresh. */
${importLines}
import cyTemplate from "@/cy_templeate.json";

function cyBlockData(block: Record<string, unknown> | undefined) {
  if (!block || typeof block !== "object" || Array.isArray(block)) return {};
  const o: Record<string, unknown> = { ...block };
  for (const k of Object.keys(o)) {
    if (k.startsWith("__")) delete o[k];
  }
  if ("_meta" in o) delete o._meta;
  return o;
}

export default function Page() {
  return (
    <>
${stack}
    </>
  );
}
`;
}

function posixRel(abs) {
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

/**
 * 将 cy_templeate.json 根级 `theme`（`{ "--primary": "oklch(...)", ... }`）写入 app/globals.css 的 `.dark { ... }`。
 * 仅替换已存在的 `--*` 行；不写 __cyComponentPath、不参与 page 堆叠。
 */
function collectThemeCssVars(theme) {
  if (!theme || typeof theme !== "object" || Array.isArray(theme)) return null;
  const vars = {};
  for (const [k, v] of Object.entries(theme)) {
    if (typeof k === "string" && k.startsWith("--") && typeof v === "string" && v.trim().length > 0) {
      vars[k] = v.trim().replace(/;+$/g, "");
    }
  }
  return Object.keys(vars).length > 0 ? vars : null;
}

function patchGlobalsDarkFromTheme(css, vars) {
  const marker = ".dark {";
  const start = css.indexOf(marker);
  if (start === -1) return { css, ok: false };

  const openBrace = css.indexOf("{", start);
  let depth = 1;
  let i = openBrace + 1;
  while (i < css.length && depth > 0) {
    const ch = css[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") depth -= 1;
    i += 1;
  }
  if (depth !== 0) return { css, ok: false };

  const endBrace = i - 1;
  const body = css.slice(openBrace + 1, endBrace);
  const lines = body.split("\n");
  const nextLines = lines.map((line) => {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*/);
    if (!m) return line;
    const key = m[1];
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      const indent = line.match(/^(\s*)/)?.[1] ?? "  ";
      return `${indent}${key}: ${vars[key]};`;
    }
    return line;
  });
  const newBody = nextLines.join("\n");
  const nextCss = css.slice(0, openBrace + 1) + newBody + css.slice(endBrace);
  return { css: nextCss, ok: true };
}

function applyThemeFromTemplateToGlobals(theme) {
  const vars = collectThemeCssVars(theme);
  if (!vars) return;

  if (!fs.existsSync(GLOBALS_CSS_PATH)) {
    console.warn(`[cy-generate] Missing ${path.relative(ROOT, GLOBALS_CSS_PATH)}; skip theme.`);
    return;
  }

  const raw = fs.readFileSync(GLOBALS_CSS_PATH, "utf8");
  const { css: next, ok } = patchGlobalsDarkFromTheme(raw, vars);
  if (!ok) {
    console.warn("[cy-generate] Could not find .dark { ... } in globals.css; skip theme.");
    return;
  }
  if (next === raw) {
    console.log("[cy-generate] theme: no changes to .dark (values already match or keys missing).");
    return;
  }
  fs.writeFileSync(GLOBALS_CSS_PATH, next, "utf8");
  console.log(`[cy-generate] Updated .dark in ${path.relative(ROOT, GLOBALS_CSS_PATH)} from cy_templeate.json "theme".`);
}

/** 与 JSON 书写顺序一致；仅包含有 __cyComponentPath 的块 */
function listTemplateBlocksForPage(template) {
  const keys = Object.keys(template).filter((k) => !k.startsWith("_")).filter((k) => {
    const v = template[k];
    return v !== null && typeof v === "object" && !Array.isArray(v);
  });

  const blocks = [];
  for (const templateKey of keys) {
    if (templateKey === "theme") continue;
    const raw = template[templateKey];
    const hint = raw && typeof raw === "object" ? raw.__cyComponentPath : null;
    if (typeof hint !== "string" || !hint.length) {
      console.warn(`[cy-generate] Missing __cyComponentPath on "${templateKey}"; omitted from app page.`);
      continue;
    }
    blocks.push({
      templateKey,
      componentName: templateKey,
      importSpec: normalizeImportPath(hint),
    });
  }
  if (blocks.length > 1) {
    console.log(
      `[cy-generate] App page stacks ${blocks.length} blocks: ${blocks.map((b) => b.componentName).join(", ")}`
    );
  }
  return blocks;
}

function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`[cy-generate] Missing template: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  const template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, "utf8"));

  for (const templateKey of Object.keys(template)) {
    if (templateKey.startsWith("_") || templateKey === "theme") continue;
    const entry = template[templateKey];
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) continue;

    const meta = entry._meta || {};
    const targetKey = meta.targetKey || resolveConfigKey(templateKey, entry);

    if (!CHECK && meta.generateComponent) {
      writeTemplateScaffold(meta, targetKey, templateKey);
    }
  }

  /** 根级 `theme`：仅更新 globals.css 的 `.dark`，不生成组件 */
  if (!CHECK && Object.prototype.hasOwnProperty.call(template, "theme")) {
    applyThemeFromTemplateToGlobals(template.theme);
  }

  const blocks = listTemplateBlocksForPage(template);
  let pageRel = null;
  let pageExpectedSource = null;

  if (blocks.length > 0) {
    const absPage = path.join(ROOT, resolveOutputPageRel(segment));
    pageRel = posixRel(absPage);
    pageExpectedSource = buildMultiBlockPageSource({
      blocks,
      regenerateHint: suggestNpmCyCommand(segment, false),
    });

    if (!CHECK) {
      ensureDir(path.dirname(absPage));
      fs.writeFileSync(absPage, pageExpectedSource, "utf8");
      console.log(`[cy-generate] App page: ${pageRel}`);
    }
  } else if (
    Object.keys(template).some(
      (k) => !k.startsWith("_") && template[k] && typeof template[k] === "object" && !Array.isArray(template[k])
    )
  ) {
    console.warn(
      "[cy-generate] No __cyComponentPath on any template block; skip app page. Add paths from Demo copy."
    );
  }

  if (CHECK) {
    if (pageRel && pageExpectedSource) {
      const absPage = path.join(ROOT, pageRel.split("/").join(path.sep));
      const fixPage = suggestNpmCyCommand(segment, false);
      if (!fs.existsSync(absPage)) {
        console.error(`[cy-generate:check] Missing app page: ${pageRel}. Run: ${fixPage}`);
        process.exit(1);
      }
      const norm = (s) => s.replace(/\r\n/g, "\n");
      const diskPage = norm(fs.readFileSync(absPage, "utf8"));
      if (!diskPage.includes(CY_PAGE_MARKER)) {
        console.warn(
          `[cy-generate:check] Skip ${pageRel} content compare (file is not CY-generated; missing marker).`
        );
      } else if (diskPage !== norm(pageExpectedSource)) {
        console.error(`[cy-generate:check] App page out of sync: ${pageRel}. Run: ${fixPage}`);
        process.exit(1);
      }
    }

    console.log("[cy-generate:check] OK.");
    process.exit(0);
  }
}

function writeTemplateScaffold(meta, targetKey, templateKey) {
  const gc = meta.generateComponent;
  if (!gc || !gc.relativePath || !gc.exportName) return false;
  const absPath = path.join(ROOT, gc.relativePath.replace(/^\//, ""));
  if (fs.existsSync(absPath)) return false;

  ensureDir(path.dirname(absPath));
  const preset = gc.preset || "none";

  let body = "";
  if (preset === "wrapper-collapsible-faq") {
    body = `"use client";

/** Generated by cy-generate — edit as needed. */
import { FaqCase1 } from "@/components/cy/FAQ/faq_case1";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import type { FaqCase1Data } from "@/components/cy/FAQ/types";

export function ${gc.exportName}() {
  const data = cyModulesConfig.${targetKey} as FaqCase1Data;
  return <FaqCase1 data={data} />;
}
`;
  } else if (preset === "wrapper-image-hero-case1") {
    body = `"use client";

/** Generated by cy-generate — edit as needed. */
import { ImageHeroCase1 } from "@/components/cy/HeroSection/image/imageHero_case1";
import cyModulesConfig from "@/components/cy/cy-modules.config.json";
import type { ImageHeroData } from "@/components/cy/HeroSection/image/types";

export function ${gc.exportName}() {
  const data = cyModulesConfig.${targetKey} as ImageHeroData;
  return <ImageHeroCase1 data={data} />;
}
`;
  } else if (preset === "none" || preset === "skip") {
    return false;
  } else {
    console.warn(
      `[cy-generate] Unknown generateComponent.preset "${preset}" for ${templateKey}; skipping scaffold.`
    );
    return false;
  }

  fs.writeFileSync(absPath, body, "utf8");
  console.log(`[cy-generate] Scaffold: ${path.relative(ROOT, absPath)}`);
  return true;
}

main();
