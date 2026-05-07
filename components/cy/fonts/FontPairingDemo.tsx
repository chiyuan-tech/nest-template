"use client";

import { useEffect, useState } from "react";

interface FontPackage {
  packageName: string;
  file: string;
  family: string;
}

const tailwindFontClassMap: Record<string, string> = {
  "gravellademoregular-0vkb9.otf": "font-cy-gravellademo",
  "babynelista-yy7x3.otf": "font-cy-babynelista",
  "mardigras-7oyal.otf": "font-cy-mardigras",
  "oatewcute-bldz3.otf": "font-cy-oatewcute",
  "yowink-vgxwz.ttf": "font-cy-yowink",
  "bronsuldemo-dr3wk.ttf": "font-cy-bronsuldemo",
};

export function FontPairingDemo() {
  const [fonts, setFonts] = useState<FontPackage[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadFontList() {
      const response = await fetch("/api/fonts", { cache: "no-store" });
      const data = (await response.json()) as { fonts?: FontPackage[] };
      const nextFonts = data.fonts ?? [];
      if (ignore) return;
      setFonts(nextFonts);
    }

    loadFontList().catch(() => {
      if (!ignore) {
        setFonts([]);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  function buildReferenceCode(item: FontPackage) {
    const fontClass = tailwindFontClassMap[item.packageName] ?? "font-sans";
    return [
      `/* app/globals.css -> @font-face + @theme inline */`,
      `/* --font token: ${fontClass.replace("font-", "--font-")} */`,
      "",
      `<p className="${fontClass}">CY Font Preview</p>`,
    ].join("\n");
  }

  return (
    <section className="space-y-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">fonts / Font Packages</p>
        <h2 className="text-3xl font-semibold tracking-tight">Font package preview</h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          字体通过 Tailwind 全局配置管理，组件只使用 Tailwind 字体类。
        </p>
      </div>

      {fonts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {fonts.map((item) => (
            <article key={item.file} className="rounded-lg border bg-background p-5">
              <p className="text-xs text-muted-foreground">Package</p>
              <p className="mt-1 text-sm font-medium text-foreground">{item.packageName}</p>
              <p
                className={`mt-4 text-4xl text-foreground ${tailwindFontClassMap[item.packageName] ?? "font-sans"
                  }`}
              >
                CY Font Preview
              </p>
              {!tailwindFontClassMap[item.packageName] ? (
                <p className="mt-2 text-xs text-amber-600">
                  此字体尚未在 Tailwind 字体配置中注册，当前使用默认字体。
                </p>
              ) : null}

              <pre className="mt-4 overflow-auto rounded-md bg-muted/30 p-3 text-xs">
                <code>{buildReferenceCode(item)}</code>
              </pre>
            </article>
          ))}
        </div>
      ) : (
        <article className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          No font files found in public/font.
        </article>
      )}
    </section>
  );
}
