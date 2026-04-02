#!/usr/bin/env python3
"""
Remove background from all hi-res and low-res works.
Saves as __{original_name}.webp alongside originals.
Skips files already starting with __ and files in subdirs.
"""
import os
from pathlib import Path
from io import BytesIO
from PIL import Image
from rembg import remove, new_session

DIRS = [
    Path('media/works/hi'),
    Path('media/works/low'),
]
EXTS = {'.webp', '.jpg', '.jpeg'}

session = new_session('birefnet-general')

for d in DIRS:
    files = sorted([
        f for f in d.iterdir()
        if f.is_file() and f.suffix.lower() in EXTS and not f.stem.startswith('__') and not f.stem.startswith('__test')
    ])
    print(f"\n{d} — {len(files)} files\n")

    for i, src in enumerate(files, 1):
        out = d / f'__{src.stem}.webp'

        print(f'  [{i}/{len(files)}] {src.name} → {out.name} ...', end=' ', flush=True)
        with open(src, 'rb') as f:
            data = f.read()
        result = remove(data, session=session)

        img = Image.open(BytesIO(result)).convert('RGBA')
        img.save(out, 'WEBP', quality=90, lossless=False)
        print(f'done ({out.stat().st_size // 1024}KB)')

print('\nAll done.')
