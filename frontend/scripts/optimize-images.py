"""Generate deterministic WebP variants from trusted legacy reference images.
Run from frontend; --dry-run reports planned outputs without writing files.
"""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "public/legacy/images"
WIDTHS = (120, 240, 480, 960, 1600)


def run(dry_run):
    records = {}
    before = after = 0
    target = SOURCES / "optimized"
    if not dry_run:
        target.mkdir(exist_ok=True)
    for source in sorted(SOURCES.glob("*.jpg")):
        before += source.stat().st_size
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            variants = []
            for width in sorted({min(value, image.width) for value in WIDTHS}):
                height = round(image.height * width / image.width)
                output = target / f"{source.stem}-{width}.webp"
                if not dry_run:
                    image.resize((width, height), Image.Resampling.LANCZOS).save(
                        output, "WEBP", quality=78, method=6, exact=True
                    )
                variants.append(
                    {
                        "src": f"/legacy/images/optimized/{output.name}",
                        "width": width,
                        "height": height,
                    }
                )
            record = {"original": f"/legacy/images/{source.name}", "variants": variants}
            records[source.name] = record
            if not dry_run:
                after += (target / Path(variants[-1]["src"]).name).stat().st_size
    if not dry_run:
        (ROOT / "lib/optimized-images.json").write_text(
            json.dumps(records, indent=2), encoding="utf-8"
        )
        import re

        for file in (ROOT / "public/legacy/css").glob("*.css"):
            content = file.read_text(encoding="utf-8")
            for name, record in records.items():
                optimized = Path(record["variants"][-1]["src"]).name
                content = content.replace(
                    "../images/" + name, "../images/optimized/" + optimized
                )
                content = re.sub(
                    r"../images/optimized/"
                    + re.escape(Path(name).stem)
                    + r"-[0-9]+\.webp",
                    "../images/optimized/" + optimized,
                    content,
                )
            file.write_text(content, encoding="utf-8")
    print(
        json.dumps(
            {
                "dry_run": dry_run,
                "images": len(records),
                "original_bytes": before,
                "largest_variant_bytes": after,
                "reduction_percent": round((1 - after / before) * 100, 1)
                if not dry_run
                else None,
            }
        )
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    run(parser.parse_args().dry_run)
