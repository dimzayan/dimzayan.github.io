#!/usr/bin/env python3
"""
White-balance correct artwork photos.
Saves:
  - resized webp previews  → media/works/previews/
  - full-size corrected    → media/works/corrected/
Samples the brightest corner (most likely background/white) and scales
each channel so that reference point becomes white.
"""

import os
import numpy as np
from PIL import Image, ImageOps

WORKS_DIR     = '/Users/dz/Atelier/dimzayan.github.io/media/works'
PREVIEWS_DIR  = '/Users/dz/Atelier/dimzayan.github.io/media/works/previews'
CORRECTED_DIR = '/Users/dz/Atelier/dimzayan.github.io/media/works/corrected'
MAX_SIZE      = 1200
QUALITY_PREV  = 82
QUALITY_FULL  = 92
SAMPLE_PX     = 40   # corner sample size in pixels
MAX_SCALE     = 2.2  # cap per-channel boost to avoid extreme blowout

def brightest_corner(arr, s=SAMPLE_PX):
    h, w = arr.shape[:2]
    corners = [
        arr[:s,    :s   ],   # top-left
        arr[:s,    w-s: ],   # top-right
        arr[h-s:,  :s   ],   # bottom-left
        arr[h-s:,  w-s: ],   # bottom-right
    ]
    return max(corners, key=lambda c: np.mean(c))

def white_balance(arr, ref_rgb):
    ref = np.array(ref_rgb, dtype=float)
    scale = 255.0 / np.clip(ref, 1, 255)
    scale = np.clip(scale, 1.0, MAX_SCALE)
    out = arr.astype(float) * scale
    return np.clip(out, 0, 255).astype(np.uint8)

os.makedirs(PREVIEWS_DIR,  exist_ok=True)
os.makedirs(CORRECTED_DIR, exist_ok=True)

exts = ('.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG')
files = sorted(f for f in os.listdir(WORKS_DIR)
               if f.endswith(exts) and os.path.isfile(os.path.join(WORKS_DIR, f)))

for fname in files:
    src  = os.path.join(WORKS_DIR, fname)
    name = os.path.splitext(fname)[0]

    img = Image.open(src).convert('RGB')
    img = ImageOps.exif_transpose(img)

    arr    = np.array(img)
    corner = brightest_corner(arr)
    ref    = np.mean(corner, axis=(0, 1))

    corrected = white_balance(arr, ref)
    out_img   = Image.fromarray(corrected)

    # Full-size corrected
    out_img.save(os.path.join(CORRECTED_DIR, name + '.webp'), 'webp', quality=QUALITY_FULL)

    # Resized preview
    preview = out_img.copy()
    preview.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    preview.save(os.path.join(PREVIEWS_DIR, name + '.webp'), 'webp', quality=QUALITY_PREV)

    print(f'{fname:25s}  ref RGB: ({ref[0]:.0f}, {ref[1]:.0f}, {ref[2]:.0f})')

print('\nDone.')
