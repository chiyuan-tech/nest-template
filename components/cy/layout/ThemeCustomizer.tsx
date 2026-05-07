"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCyThemeTokenMap } from "@/lib/cy-theme-oklch";

const STORAGE_KEY = "cy_theme_primary";
const DEFAULT_PRIMARY = "#59c13a";
const BLOCKED_COLORS = new Set(["#000000", "#ffffff"]);

function normalizeHex(input: string) {
  const normalized = input.trim().toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(normalized)) return null;
  return normalized;
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex);
  if (!value) return null;
  const r = Number.parseInt(value.slice(1, 3), 16);
  const g = Number.parseInt(value.slice(3, 5), 16);
  const b = Number.parseInt(value.slice(5, 7), 16);
  return { r, g, b };
}

function getContrastColor(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#ffffff";
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.6 ? "#111827" : "#f9fafb";
}

function applyThemeColor(hex: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const textColor = getContrastColor(hex);

  root.style.setProperty("--primary", hex);
  root.style.setProperty("--ring", hex);
  root.style.setProperty("--sidebar-primary", hex);
  root.style.setProperty("--primary-foreground", textColor);
  root.style.setProperty("--sidebar-primary-foreground", textColor);
}

/** 生成可粘贴进 `cy_templeate.json` 根对象的片段（`theme` 为 oklch） */
function buildThemeJsonForTemplate(primaryHex: string) {
  const fg = getContrastColor(primaryHex);
  const tokens = buildCyThemeTokenMap(primaryHex, fg);
  if (!tokens) return null;
  return JSON.stringify({ theme: tokens }, null, 2);
}

export function ThemeCustomizer() {
  const [color, setColor] = useState(DEFAULT_PRIMARY);
  const [copiedTheme, setCopiedTheme] = useState(false);

  useEffect(() => {
    const saved = normalizeHex(localStorage.getItem(STORAGE_KEY) ?? "");
    if (!saved) return;
    setColor(saved);
    applyThemeColor(saved);
  }, []);

  const handleColorChange = (value: string) => {
    const next = normalizeHex(value);
    if (!next) return;
    if (BLOCKED_COLORS.has(next)) return;
    setColor(next);
    applyThemeColor(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const handleReset = () => {
    setColor(DEFAULT_PRIMARY);
    applyThemeColor(DEFAULT_PRIMARY);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCopyThemeOklch = async () => {
    const json = buildThemeJsonForTemplate(color);
    if (!json) return;
    try {
      await navigator.clipboard.writeText(json);
      setCopiedTheme(true);
      window.setTimeout(() => setCopiedTheme(false), 2000);
    } catch {
      setCopiedTheme(false);
    }
  };

  return (
    <div className="fixed left-4 right-4 top-15 z-50 rounded-xl border bg-card/95 shadow-sm backdrop-blur lg:left-6 lg:right-6">
      <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-3 py-3 lg:px-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="cy-theme-color">
            Theme Primary
          </label>
          <input
            id="cy-theme-color"
            type="color"
            value={color}
            onChange={(event) => handleColorChange(event.target.value)}
            className="h-9 w-12 cursor-pointer rounded border border-border bg-background p-1"
          />
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {color}
          </span>
          <Button variant="outline" className="cursor-pointer" onClick={handleReset}>
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer gap-1.5"
            onClick={() => void handleCopyThemeOklch()}
            leftIcon={copiedTheme ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            title='复制 JSON（根级含 "theme"），粘贴到 cy_templeate.json；npm run cy 时会写入 app/globals.css 的 .dark'
          >
            {copiedTheme ? '已复制' : '复制 theme'}
          </Button>
        </div>
      </div>
    </div>
  );
}
