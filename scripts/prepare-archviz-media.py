"""Create uncropped web derivatives. Originals remain byte-for-byte unchanged."""
from pathlib import Path
from PIL import Image
from shutil import copyfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('D:/claude max/archviz-template/deliverables')
assets = [
    ('reference-realism-20261029-r02/FINAL_RENDERS/sunset_2026-10-29_22-17-44_IST.png', 'marina-terrace', 'cover', 'original.png', (3840,2160)),
    ('palm-realism-20261021/final-crystal-wide-2560.png', 'palm-jumeirah', 'cover', 'original.png', (2560,1046)),
]
for file, folder, stem, original, size in assets:
    src = SOURCE / file
    dest = ROOT / 'public/projects/archviz' / folder
    dest.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as image:
        assert image.size == size, (file, image.size)
        rgb = image.convert('RGB')
        for width in [800,1600,size[0]]:
            path = dest / (f'{stem}.webp' if width == size[0] else f'{stem}-{width}.webp')
            scaled = rgb if width == size[0] else rgb.resize((width, round(size[1]*width/size[0])), Image.Resampling.LANCZOS)
            scaled.save(path, 'WEBP', quality=92, method=6)
            print(path.name, scaled.size, path.stat().st_size)
    copyfile(src, dest / original)
