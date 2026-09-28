"""Generate a transparent iris accent without rewriting either portrait."""

from hashlib import sha256
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[1]
source = root / 'public/assets/ricko-portrait-menu.webp'
expected = '33966a7156fdd8dfa97dd35b43fabace8427a56706cc7ff505b4f24816e93977'
if sha256(source.read_bytes()).hexdigest() != expected:
    raise SystemExit('Dashboard portrait changed; recalibrate the iris mask first.')

portrait = Image.open(source).convert('RGBA')
luminance = ImageOps.grayscale(portrait)
scale = 8
mask_size = (portrait.width * scale, portrait.height * scale)
iris = Image.new('L', mask_size)
draw = ImageDraw.Draw(iris)
draw.ellipse(tuple(round(value * scale) for value in (290.5, 458.5, 314, 481)), fill=255)

# The upper lid covers the iris; the pupil and outer rim stay photographic.
opening = Image.new('L', mask_size)
ImageDraw.Draw(opening).polygon([
    (round(x * scale), round(y * scale)) for x, y in [
        (289, 472), (294, 469), (300, 468), (307, 468.5),
        (312, 470), (315, 473), (315, 484), (289, 484),
    ]
], fill=255)
iris = ImageChops.multiply(iris, opening)
ImageDraw.Draw(iris).ellipse(
    tuple(round(value * scale) for value in (298, 465.5, 308, 476.5)), fill=0,
)
iris = iris.resize(portrait.size, Image.Resampling.LANCZOS)
accent = Image.new('RGBA', portrait.size)
left, top, right, bottom = iris.getbbox()
for y in range(top, bottom):
    for x in range(left, right):
        alpha = iris.getpixel((x, y))
        if alpha < 8:
            continue
        light = luminance.getpixel((x, y))
        # Source luminance carries the iris texture and existing reflections.
        color = (round(8 + light * 0.22), round(87 + light * 1.25), min(255, round(185 + light)))
        accent.putpixel((x, y), (*color, round(alpha * 0.96)))

target = root / 'public/assets/ricko-iris-menu.png'
accent.save(target, optimize=True)
print(f'{target.name}: {accent.size}, visible bounds {accent.getbbox()}, {target.stat().st_size} bytes')
