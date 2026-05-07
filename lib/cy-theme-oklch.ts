import { converter, parse } from "culori";

const toOklch = converter("oklch");

/** 与 `app/globals.css` 手写风格一致：避免 `formatCss` 输出双精度长串 */
function roundCss(n: number, decimals: number) {
  const p = 10 ** decimals;
  return Math.round(n * p) / p;
}

/**
 * 将任意 culori 可解析颜色转为 `oklch(L C H)` 字符串（L/C/H 各舍入到固定小数位）。
 */
export function colorToOklchCss(input: string): string | null {
  const c = parse(input.trim());
  if (!c) return null;
  const o = toOklch(c);
  if (!o || o.mode !== "oklch") return null;
  const l = roundCss(o.l, 3);
  const chroma = roundCss(o.c, 3);
  const hRaw = typeof o.h === "number" && !Number.isNaN(o.h) ? o.h : 0;
  const h = roundCss(hRaw, 3);
  return `oklch(${l} ${chroma} ${h})`;
}

/** 与 ThemeCustomizer 写入的变量一致，值均为 oklch() 字符串 */
export function buildCyThemeTokenMap(primaryHex: string, foregroundHex: string) {
  const primaryOklch = colorToOklchCss(primaryHex);
  const fgOklch = colorToOklchCss(foregroundHex);
  if (!primaryOklch || !fgOklch) return null;
  return {
    "--primary": primaryOklch,
    "--ring": primaryOklch,
    "--sidebar-primary": primaryOklch,
    "--sidebar-ring": primaryOklch,
    "--primary-foreground": fgOklch,
    "--sidebar-primary-foreground": fgOklch,
  } as Record<string, string>;
}
