#!/usr/bin/env python3
"""
extend_photo.py — extend a portrait artwork photo horizontally to square (or custom ratio).

Usage:
  python scripts/extend_photo.py <input> [--ratio 4:3] [--fill auto|solid|mirror] [--out <path>]

Strategies:
  solid  — fill extended areas with the background color sampled from corners
  mirror — mirror-flip edge strips into the extensions, blend at the seam
  auto   — choose based on corner pixel variance (default)
"""

import argparse
import sys
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter


def sample_corners(img, size=10):
    """Return flat array of all corner pixels (size x size per corner)."""
    w, h = img.size
    arr = np.array(img.convert('RGB'), dtype=np.float32)
    corners = [
        arr[:size, :size],
        arr[:size, w - size:],
        arr[h - size:, :size],
        arr[h - size:, w - size:],
    ]
    return np.concatenate([c.reshape(-1, 3) for c in corners])


def detect_fill(img):
    pixels = sample_corners(img)
    std = pixels.std(axis=0).max()
    return 'solid' if std < 12 else 'mirror'


def mean_color(img):
    pixels = sample_corners(img)
    return tuple(int(round(v)) for v in pixels.mean(axis=0))


def blend_seam(base, overlay, blend_px, direction='left'):
    """Blend overlay into base over `blend_px` pixels at the seam edge."""
    arr_b = np.array(base, dtype=np.float32)
    arr_o = np.array(overlay, dtype=np.float32)
    h, w = arr_b.shape[:2]
    blend_px = min(blend_px, w)

    # Alpha ramp: 0 (keep base) → 1 (use overlay) across blend_px columns
    ramp = np.linspace(0, 1, blend_px, dtype=np.float32)
    if direction == 'right':
        ramp = ramp[::-1]

    mask = np.zeros((h, w, 1), dtype=np.float32)
    if direction == 'left':
        mask[:, :blend_px, 0] = ramp
    else:
        mask[:, w - blend_px:, 0] = ramp

    result = arr_b * (1 - mask) + arr_o * mask
    return Image.fromarray(result.clip(0, 255).astype(np.uint8))


def extend(img, pad_left, pad_right, fill, blend_px=80):
    w, h = img.size
    new_w = w + pad_left + pad_right
    out = Image.new('RGB', (new_w, h))

    if fill == 'solid':
        color = mean_color(img)
        out.paste(Image.new('RGB', (new_w, h), color), (0, 0))
        out.paste(img, (pad_left, 0))

    elif fill == 'mirror':
        arr = np.array(img.convert('RGB'))

        # Left extension: take left strip, flip horizontally
        left_strip_w = min(pad_left + blend_px, w)
        left_strip = arr[:, :left_strip_w, :]
        left_flipped = left_strip[:, ::-1, :]

        # Right extension: take right strip, flip horizontally
        right_strip_w = min(pad_right + blend_px, w)
        right_strip = arr[:, w - right_strip_w:, :]
        right_flipped = right_strip[:, ::-1, :]

        # Paste base canvas with the original centered
        out.paste(img, (pad_left, 0))

        # Build left fill tile (may need to repeat if pad is wider than the strip)
        if pad_left > 0:
            left_fill_w = pad_left + blend_px
            left_tile = Image.fromarray(
                left_flipped[:, left_flipped.shape[1] - left_fill_w:, :]
                if left_flipped.shape[1] >= left_fill_w
                else np.hstack([np.tile(left_flipped[:, :1, :], (1, left_fill_w - left_flipped.shape[1], 1)), left_flipped])
            )
            # Blend the seam (rightmost blend_px of left_tile meets original)
            blended_left = blend_seam(
                out.crop((0, 0, pad_left + blend_px, h)),
                left_tile,
                blend_px,
                direction='right',
            )
            out.paste(blended_left, (0, 0))

        if pad_right > 0:
            right_fill_w = pad_right + blend_px
            right_tile = Image.fromarray(
                right_flipped[:, :right_fill_w, :]
                if right_flipped.shape[1] >= right_fill_w
                else np.hstack([right_flipped, np.tile(right_flipped[:, -1:, :], (1, right_fill_w - right_flipped.shape[1], 1))])
            )
            x0 = pad_left + w - blend_px
            blended_right = blend_seam(
                out.crop((x0, 0, x0 + right_fill_w, h)),
                right_tile,
                blend_px,
                direction='left',
            )
            out.paste(blended_right, (x0, 0))

    return out


def main():
    ap = argparse.ArgumentParser(description='Extend portrait photo to square/landscape by adding background.')
    ap.add_argument('input', help='Source image (JPEG, WebP, PNG, HEIC…)')
    ap.add_argument('--ratio', default='1:1', help='Target aspect ratio W:H (default 1:1)')
    ap.add_argument('--fill', default='auto', choices=['auto', 'solid', 'mirror'])
    ap.add_argument('--out', default=None, help='Output path (default: <stem>_sq<ext> in same dir)')
    args = ap.parse_args()

    src = Path(args.input)
    if not src.exists():
        print(f'Error: {src} not found', file=sys.stderr)
        sys.exit(1)

    rw, rh = (int(x) for x in args.ratio.split(':'))
    target_ratio = rw / rh

    img = Image.open(src).convert('RGB')
    w, h = img.size

    target_w = round(h * target_ratio)
    if w >= target_w:
        print(f'{src.name}: already {w}x{h}, no extension needed for {args.ratio} target.')
        sys.exit(0)

    fill = args.fill if args.fill != 'auto' else detect_fill(img)
    print(f'{src.name}: {w}x{h} → {target_w}x{h} ({fill} fill)')

    total_pad = target_w - w
    pad_left = total_pad // 2
    pad_right = total_pad - pad_left

    result = extend(img, pad_left, pad_right, fill)

    if args.out:
        out_path = Path(args.out)
    else:
        out_path = src.with_name(src.stem + '_sq' + src.suffix)

    # Preserve WebP or fall back to source format
    fmt = 'WEBP' if out_path.suffix.lower() in ('.webp',) else None
    save_kwargs = {'quality': 92, 'method': 6} if fmt == 'WEBP' else {'quality': 92}
    result.save(out_path, format=fmt, **save_kwargs)
    print(f'Saved → {out_path}')


if __name__ == '__main__':
    main()
