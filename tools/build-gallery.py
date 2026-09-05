#!/usr/bin/env python3
"""
Prepara la galería: optimiza las imágenes y genera el manifiesto.

    python tools/build-gallery.py

Qué hace, para cada archivo que dejes en images/arte/:

  1. Genera dos WebP en images/arte/web/
       <slug>.webp        versión grande, para el visor
       <slug>-thumb.webp  miniatura, para la rejilla
  2. Limpia el nombre de Midjourney y lo convierte en título
  3. Escribe assets/gallery.js, que es lo que lee la página

Los originales se quedan donde están; el script no los toca. Solo hace falta
desplegar images/arte/web/ y assets/gallery.js.

Requiere Pillow:  python -m pip install Pillow
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Falta Pillow. Instálalo con:  python -m pip install Pillow")

HERE = Path(__file__).resolve().parent
ART = HERE.parent / "images" / "arte"
OUT_DIR = ART / "web"
MANIFEST = HERE.parent / "assets" / "gallery.js"

EXT = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".bmp", ".tiff"}

FULL_MAX = 1800   # lado mayor de la versión grande
FULL_Q = 82
THUMB_MAX = 800   # lado mayor de la miniatura
THUMB_Q = 78

# Prefijos de usuario que Midjourney antepone al nombre del archivo.
# Añade el tuyo aquí si cambia.
USER_PREFIXES = ("Pmzz",)

UUID_RE = re.compile(
    r"_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:_\d+)?$",
    re.IGNORECASE,
)
ORDER_RE = re.compile(r"^\d+\s*[-_.]\s*")


def title_from_name(stem: str) -> str:
    """`naruto_--sref_4154608028_--hd_<uuid>_2` → `Naruto`"""
    name = UUID_RE.sub("", stem)          # fuera el uuid del trabajo
    name = name.split("--")[0]            # fuera los parámetros (--sref, --v, --hd…)

    for prefix in USER_PREFIXES:          # fuera tu nombre de usuario
        if name.lower().startswith(prefix.lower() + "_"):
            name = name[len(prefix) + 1:]
    name = re.sub(r"^u\d{4,}_", "", name)  # usuarios anónimos: u3911372171_

    name = ORDER_RE.sub("", name)          # fuera el prefijo numérico de orden
    name = re.sub(r"[_\-]+", " ", name)
    name = re.sub(r"\s+", " ", name).strip(" .-_")

    if not name:
        return stem
    return name[0].upper() + name[1:]


def slugify(text: str) -> str:
    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_text).strip("-").lower()
    return slug or "imagen"


def save_variant(img: Image.Image, dest: Path, max_side: int, quality: int) -> None:
    copy = img.copy()
    copy.thumbnail((max_side, max_side), Image.LANCZOS)
    copy.save(dest, "WEBP", quality=quality, method=6)


def write_manifest(items: list) -> None:
    """Se escribe como script, no como JSON: un <script> clásico funciona
    también al abrir el HTML con doble clic (file://), donde fetch() está
    bloqueado por CORS."""
    body = json.dumps(items, indent=2, ensure_ascii=False)
    MANIFEST.parent.mkdir(exist_ok=True)
    MANIFEST.write_text(
        "/* Generado por tools/build-gallery.py — no editar a mano */\n"
        "window.GALLERY = " + body + ";\n",
        encoding="utf-8",
    )


def existing_titles() -> dict:
    """Títulos del manifiesto actual, para no perderlos al reconstruir."""
    if not MANIFEST.is_file():
        return {}
    try:
        raw = MANIFEST.read_text(encoding="utf-8")
        data = json.loads(raw[raw.index("["):raw.rindex("]") + 1])
        return {i["src"]: i["title"] for i in data if "src" in i and "title" in i}
    except Exception:
        return {}


def manifest_from_web() -> list:
    """Reconstruye la lista a partir de images/arte/web/, sin tocar nada.
    Se usa cuando ya no están los originales."""
    if not OUT_DIR.is_dir():
        return []

    known = existing_titles()
    items = []

    for full in sorted(OUT_DIR.glob("*.webp"), key=lambda p: p.name.lower()):
        if full.name.endswith("-thumb.webp"):
            continue
        thumb = OUT_DIR / f"{full.stem}-thumb.webp"
        src = f"images/arte/web/{full.name}"
        items.append({
            "src": src,
            "thumb": f"images/arte/web/{thumb.name}" if thumb.is_file() else src,
            # Si el título ya existía se conserva; si no, se deduce del nombre
            "title": known.get(src) or title_from_name(full.stem),
        })

    return items


def build_avatar() -> None:
    """images/perfil.* → images/avatar.webp

    Se muestra a 58 px, así que 320 px sobra incluso en pantallas 4x.
    El original no se toca."""
    images = HERE.parent / "images"
    dest = images / "avatar.webp"

    # Acepta varios nombres para no depender de acertar con uno concreto
    candidates = [
        images / f"{stem}{ext}"
        for stem in ("perfil", "avatar", "foto", "profile")
        for ext in (".png", ".jpg", ".jpeg", ".webp")
    ]
    source = next(
        (p for p in candidates if p.is_file() and p.resolve() != dest.resolve()),
        None,
    )
    if source is None:
        print("Sin foto de perfil (images/perfil.png, avatar.jpg…). Se usará el monograma.\n")
        return
    with Image.open(source) as img:
        save_variant(img.convert("RGB"), dest, 320, 88)

    print(f"Avatar: {source.name}  {source.stat().st_size / 1e6:.1f} MB  →  "
          f"{dest.name}  {dest.stat().st_size / 1e3:.0f} KB\n")


def load_font(size: int, bold: bool = False):
    """Fuente del sistema para la tarjeta social. Si no hay ninguna,
    se usa la de Pillow y la tarjeta sale igual, solo que más sosa."""
    candidates = (
        ["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf"] if bold
        else ["segoeui.ttf", "arial.ttf", "calibri.ttf"]
    ) + ["consola.ttf"]
    for name in candidates:
        path = Path("C:/Windows/Fonts") / name
        if path.is_file():
            try:
                return ImageFont.truetype(str(path), size)
            except Exception:
                continue
    return ImageFont.load_default()


def build_og() -> None:
    """Tarjeta 1200x630 para WhatsApp, LinkedIn, Twitter y compañía.
    Es lo que se ve al pegar el enlace en cualquier sitio."""
    images = HERE.parent / "images"
    W, H = 1200, 630
    card = Image.new("RGB", (W, H), "#0b0b0b")
    draw = ImageDraw.Draw(card)

    # Franja inferior con una de las piezas de la galería, si hay
    art = sorted((OUT_DIR).glob("*.webp")) if OUT_DIR.is_dir() else []
    art = [p for p in art if not p.name.endswith("-thumb.webp")]
    if art:
        with Image.open(art[0]) as strip:
            strip = strip.convert("RGB")
            ratio = W / strip.width
            strip = strip.resize((W, int(strip.height * ratio)), Image.LANCZOS)
            # Del centro: los bordes de una imagen suelen ser lo más plano
            bh = min(150, strip.height)
            top = max(0, (strip.height - bh) // 2)
            band = strip.crop((0, top, W, top + bh))
            card.paste(band, (0, H - band.height))
            # Degradado para que el texto no compita con la imagen
            veil = Image.new("L", (1, band.height))
            for y in range(band.height):
                veil.putpixel((0, y), int(235 - 235 * (y / band.height) ** 0.7))
            mask = veil.resize((W, band.height))
            card.paste(Image.new("RGB", (W, band.height), "#0b0b0b"), (0, H - band.height), mask)

    # Avatar redondeado
    avatar = images / "avatar.webp"
    if avatar.is_file():
        with Image.open(avatar) as face:
            face = face.convert("RGB").resize((150, 150), Image.LANCZOS)
            mask = Image.new("L", (150, 150), 0)
            ImageDraw.Draw(mask).rounded_rectangle([0, 0, 149, 149], radius=34, fill=255)
            card.paste(face, (80, 96), mask)

    draw.text((80, 292), "Pedro Jesús Muñoz Cifuentes", font=load_font(58, True), fill="#f4f4f4")
    draw.text((80, 372), "Software Engineer · Backend Java & Spring", font=load_font(30), fill="#a9a9a9")
    draw.text((80, 420), "Cádiz, España", font=load_font(26), fill="#6b6b6b")

    dest = images / "og.jpg"
    card.save(dest, "JPEG", quality=88, optimize=True)
    print(f"Tarjeta social: {dest.name}  {dest.stat().st_size / 1e3:.0f} KB\n")


def main() -> None:
    build_avatar()
    build_og()

    if not ART.is_dir():
        sys.exit(f"No existe {ART}. Créala y deja dentro tus imágenes.")

    OUT_DIR.mkdir(exist_ok=True)

    sources = sorted(
        (p for p in ART.iterdir()
         if p.is_file() and p.suffix.lower() in EXT and not p.name.startswith(("_", "."))),
        key=lambda p: p.name.lower(),
    )

    if not sources:
        # Sin originales pero con imágenes ya optimizadas: se reconstruye el
        # manifiesto desde web/ en lugar de vaciarlo. Si no, ejecutar el
        # script tras borrar los originales te borraría la galería.
        recovered = manifest_from_web()
        write_manifest(recovered)
        if recovered:
            print(f"Sin originales en {ART.name}/, pero hay {len(recovered)} imagen(es) ya "
                  f"optimizadas en web/. Manifiesto reconstruido sin tocarlas.")
        else:
            print("Carpeta vacía. La galería mostrará huecos.")
        return

    items, used_slugs, saved_before, saved_after = [], set(), 0, 0

    for src in sources:
        title = title_from_name(src.stem)

        slug = slugify(title)
        n = 2
        while slug in used_slugs:            # dos prompts iguales no deben pisarse
            slug, n = f"{slugify(title)}-{n}", n + 1
        used_slugs.add(slug)

        try:
            with Image.open(src) as img:
                img = img.convert("RGB")
                full = OUT_DIR / f"{slug}.webp"
                thumb = OUT_DIR / f"{slug}-thumb.webp"
                save_variant(img, full, FULL_MAX, FULL_Q)
                save_variant(img, thumb, THUMB_MAX, THUMB_Q)
        except Exception as err:
            print(f"  !! {src.name}: {err}")
            continue

        saved_before += src.stat().st_size
        saved_after += full.stat().st_size + thumb.stat().st_size

        items.append({
            "src": f"images/arte/web/{full.name}",
            "thumb": f"images/arte/web/{thumb.name}",
            "title": title,
        })
        print(f"  · {title}")
        print(f"      {src.stat().st_size / 1e6:.1f} MB  →  "
              f"{full.stat().st_size / 1e6:.2f} MB + {thumb.stat().st_size / 1e6:.2f} MB")

    write_manifest(items)

    print(f"\nassets/gallery.js escrito con {len(items)} imagen(es).")
    if saved_before:
        print(f"Peso servido: {saved_before / 1e6:.1f} MB  →  {saved_after / 1e6:.1f} MB "
              f"({100 - saved_after / saved_before * 100:.0f}% menos)")


if __name__ == "__main__":
    main()
