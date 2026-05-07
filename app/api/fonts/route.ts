import { readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const SUPPORTED_EXTENSIONS = new Set([".ttf", ".otf", ".woff", ".woff2"]);

function toFamilyName(fileName: string) {
  return `cy-font-${fileName.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`;
}

export async function GET() {
  try {
    const fontDir = path.join(process.cwd(), "public", "font");
    const entries = await readdir(fontDir, { withFileTypes: true });

    const fonts = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => SUPPORTED_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        packageName: name,
        file: `/font/${name}`,
        family: toFamilyName(name),
      }));

    return NextResponse.json({ fonts });
  } catch {
    return NextResponse.json({ fonts: [] }, { status: 200 });
  }
}
