"""Generate favicon and PWA icons from public/logo.webp or public/logo.png.

Usage:
  pip install pillow
  npm run icon

Outputs (Next.js App Router conventions):
  app/favicon.ico
  app/icon.png
  app/apple-icon.png
  public/icon-192.png
  public/icon-512.png
  public/favicon-32.ico
  public/favicon-48.ico
  public/favicon-96.ico
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_CANDIDATES = (
    ROOT / "public" / "logo.webp",
    ROOT / "public" / "logo.png",
)
APP = ROOT / "app"
PUBLIC = ROOT / "public"


def resolve_source() -> Path:
    for path in SOURCE_CANDIDATES:
        if path.exists():
            return path
    candidates = ", ".join(str(path.relative_to(ROOT)) for path in SOURCE_CANDIDATES)
    raise SystemExit(f"Missing source image. Add one of: {candidates}")


def load_source(path: Path) -> Image.Image:
    with Image.open(path) as img:
        return img.convert("RGBA")


def save_png(img: Image.Image, path: Path, size: int) -> None:
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    resized.save(path, format="PNG", optimize=True)


def save_ico(img: Image.Image, path: Path, sizes: tuple[int, ...]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(
        path,
        format="ICO",
        sizes=[(size, size) for size in sizes],
    )


def main() -> None:
    source_path = resolve_source()
    source = load_source(source_path)

    save_ico(source, APP / "favicon.ico", (16, 32, 48, 96))
    save_png(source, APP / "icon.png", 32)
    save_png(source, APP / "apple-icon.png", 180)
    save_png(source, PUBLIC / "icon-192.png", 192)
    save_png(source, PUBLIC / "icon-512.png", 512)

    favicon_sizes = (32, 48, 96)
    generated_public_favicons: list[Path] = []
    for size in favicon_sizes:
        path = PUBLIC / f"favicon-{size}.ico"
        save_ico(source, path, (size,))
        generated_public_favicons.append(path)

    print(f"Source: {source_path.relative_to(ROOT)}")
    print("Generated icons:")
    for path in [
        APP / "favicon.ico",
        APP / "icon.png",
        APP / "apple-icon.png",
        PUBLIC / "icon-192.png",
        PUBLIC / "icon-512.png",
        *generated_public_favicons,
    ]:
        print(f"  {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
