"""ROG v9 web pipeline: solid-silhouette matte from the SevRender3 MRQ frames.

Why a new matte: the v8 luma-key (smoothstep lo3/hi14) made every dark shaded
part of the reaper (hood interior, cloak folds, legs) semi-transparent, and the
keep-largest-blob step dropped disconnected pieces (chain tips, mace spikes).
On the light site that reads as "parts of Sevarog missing".

Matte recipe (per frame, 2560x1440 RGB on pure black):
  core   = luma >= 10                      (bright, unambiguous body pixels)
  bridge = dilate(core, 45px) -> CC -> keep the largest (merges chains/tips
           with the body before selection, so they survive)
  env    = dilate(core_kept, 9px)          (4px margin for the dark rim)
  body   = (luma >= 1) & env               (bloom halo beyond the rim excluded)
  solid  = closing(core_kept, 13px) & body (dark interior folds fully opaque;
           real see-through gaps stay luma 0 => transparent)
  rim    = body & ~solid -> alpha ramp (luma-1)/9
  alpha  = blur(max(solid, rim), 0.7px)    (anti-aliased edge)

Grading happens on the crop with transparent pixels inpainted first, so the
unsharp masks never pull black fringes into the edge.
Outputs three tiers (same 200 frames, per-frame baked H-centering):
  out/rog-hi (h1200) / out/rog (h880) / out/rog-sm (h540)
"""
import os, sys, time, json
import numpy as np, cv2
from PIL import Image, ImageEnhance, ImageFilter

SRC = r"D:\claude max\mrvayn\SevRender3"
OUT = r"D:\claude max\.rogwork\out"
RAW_N, N_OUT = 720, 200
IDX = [round(i * (RAW_N - 1) / (N_OUT - 1)) for i in range(N_OUT)]
TIERS = {"rog-hi": (1200, 84, 1.0, 55), "rog": (880, 82, 0.8, 55), "rog-sm": (540, 80, 0.6, 45)}
PAD_X, PAD_TOP, PAD_BOT = 28, 34, 22

def log(*a):
    print(time.strftime("%H:%M:%S"), *a, flush=True)

def ell(d):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (d, d))

def luma(rgb):
    return 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]

def matte(rgb):
    L = luma(rgb.astype(np.float32))
    core = (L >= 10).astype(np.uint8)
    bridged = cv2.dilate(core, ell(45))
    n, lab, st, _ = cv2.connectedComponentsWithStats(bridged, connectivity=8)
    big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    core_kept = core & (lab == big).astype(np.uint8)
    env = cv2.dilate(core_kept, ell(9)).astype(bool)
    body = (L >= 1) & env
    solid = cv2.morphologyEx(core_kept, cv2.MORPH_CLOSE, ell(13)).astype(bool) & body
    rim = body & ~solid
    a = np.zeros(L.shape, np.float32)
    a[solid] = 1.0
    a[rim] = np.clip((L[rim] - 1.0) / 9.0, 0.0, 1.0)
    # drop isolated specks (rain dots that slipped inside the envelope)
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats((a > 0.05).astype(np.uint8), connectivity=8)
    if n2 > 1:
        tiny = np.where(st2[:, cv2.CC_STAT_AREA] < 24)[0]
        tiny = tiny[tiny > 0]
        if len(tiny):
            a[np.isin(lab2, tiny)] = 0.0
    a = cv2.GaussianBlur(a, (0, 0), 0.7)
    return np.clip(a, 0, 1)

def load(i):
    im = Image.open(os.path.join(SRC, f"f_{i:04d}.png")).convert("RGB")
    return np.array(im)

def save_retry(img, path, **kw):
    for k in range(12):
        try:
            img.save(path, **kw); return
        except OSError:
            time.sleep(0.5)
    img.save(path, **kw)

def stats_pass():
    log("pass 1: matte stats")
    rows = []
    for k, i in enumerate(IDX):
        a = matte(load(i))
        m = a > 0.3
        ys, xs = np.where(m)
        w = a.sum(axis=0); cx = float((w * np.arange(a.shape[1])).sum() / max(w.sum(), 1e-6))
        rows.append({"i": i, "cx": cx, "x0": int(xs.min()), "x1": int(xs.max()), "y0": int(ys.min()), "y1": int(ys.max())})
        if k % 25 == 0: log(f"  {k}/{N_OUT} frame {i} cx={cx:.1f} bbox=({xs.min()},{ys.min()})-({xs.max()},{ys.max()})")
    return rows

def smooth(v, k=7):
    v = np.asarray(v, np.float32)
    ker = np.exp(-0.5 * (np.arange(k) - k // 2) ** 2 / (k / 4) ** 2); ker /= ker.sum()
    pad = np.pad(v, (k // 2, k // 2), mode="edge")
    return np.convolve(pad, ker, mode="valid")

def grade(rgb, alpha):
    """Grade the crop; inpaint transparent pixels first so filters never see black."""
    a8 = (alpha * 255).astype(np.uint8)
    hole = (a8 < 40).astype(np.uint8)
    ring = cv2.dilate((a8 >= 40).astype(np.uint8), ell(21)) & hole
    filled = rgb.copy()
    filled[hole.astype(bool)] = 0
    if ring.any():
        filled = cv2.inpaint(filled, ring * 255, 3, cv2.INPAINT_TELEA)
    im = Image.fromarray(filled)
    im = ImageEnhance.Contrast(im).enhance(1.12)
    im = ImageEnhance.Color(im).enhance(1.18)
    im = im.filter(ImageFilter.UnsharpMask(radius=5, percent=35, threshold=2))
    return np.array(im)

def main():
    for t in TIERS: os.makedirs(os.path.join(OUT, t), exist_ok=True)
    rows = stats_pass()
    cx = smooth([r["cx"] for r in rows], 7)
    # 98th percentile: the fully extended lunge (2 frames) may lose its far tip,
    # which sits under the canvas edge-fade anyway; sizing on it would shrink him everywhere.
    left = np.percentile([r["cx"] - r["x0"] for r in rows], 98); right = np.percentile([r["x1"] - r["cx"] for r in rows], 98)
    HW = int(max(left, right, 540) + PAD_X)
    Y0 = max(0, min(r["y0"] for r in rows) - PAD_TOP); Y1 = min(1440, max(r["y1"] for r in rows) + PAD_BOT)
    log(f"crop: half-width {HW} (w {2*HW}) y {Y0}-{Y1} (h {Y1-Y0}) aspect {2*HW/(Y1-Y0):.3f}")
    json.dump({"rows": rows, "cx_smooth": [float(v) for v in cx], "HW": HW, "Y0": Y0, "Y1": Y1}, open(os.path.join(OUT, "stats.json"), "w"))
    log("pass 2: render tiers")
    for k, i in enumerate(IDX):
        rgb = load(i); a = matte(rgb)
        c = int(round(cx[k])); x0, x1 = c - HW, c + HW
        # pad if the window leaves the frame
        px0, px1 = max(0, -x0), max(0, x1 - rgb.shape[1])
        crop = np.zeros((Y1 - Y0, 2 * HW, 3), np.uint8); ca = np.zeros((Y1 - Y0, 2 * HW), np.float32)
        sx0, sx1 = max(0, x0), min(rgb.shape[1], x1)
        crop[:, px0:px0 + (sx1 - sx0)] = rgb[Y0:Y1, sx0:sx1]; ca[:, px0:px0 + (sx1 - sx0)] = a[Y0:Y1, sx0:sx1]
        g = grade(crop, ca)
        rgba = Image.fromarray(np.dstack([g, (ca * 255).astype(np.uint8)]), "RGBA")
        for tier, (h, q, er, ep) in TIERS.items():
            w = int(round(2 * HW * h / (Y1 - Y0)))
            im = rgba.resize((w, h), Image.LANCZOS)
            rgb_t = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=er, percent=ep, threshold=3))
            im = Image.merge("RGBA", (*rgb_t.split(), im.split()[3]))
            save_retry(im, os.path.join(OUT, tier, f"f_{k:03d}.webp"), format="WEBP", quality=q, method=4)
        if k % 20 == 0: log(f"  {k}/{N_OUT} done (raw {i})")
    log("DONE")

if __name__ == "__main__":
    main()
