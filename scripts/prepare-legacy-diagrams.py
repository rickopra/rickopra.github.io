"""Generate public process diagrams without reproducing private network layouts."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

output = Path(__file__).resolve().parents[1] / 'public' / 'assets'
font_path = Path('C:/Windows/Fonts')

def font(size, bold=False):
    return ImageFont.truetype(str(font_path / ('arialbd.ttf' if bold else 'arial.ttf')), size)

for name, title, subtitle, steps, note, accent in [
    ('noc', 'NOC / ALERTS & TUNNEL AUTOMATION', 'A defined response to a changing link.',
     [('CHECK', 'Netwatch / link state'), ('NOTIFY', 'Telegram / status / latency'), ('SWITCH', 'L2TP endpoint / checks')],
     'PROCESS RECONSTRUCTION / NO LIVE ENDPOINTS OR CREDENTIALS', '#075e82'),
    ('ftth', 'FTTH / SURVEY TO DISTRIBUTION', 'Plan the route before the first cable.',
     [('SURVEY', 'Field / drone documentation'), ('MAP', 'Google Earth Pro / routes'), ('PLAN', 'Junction box / ODC / ODP')],
     'PROCESS RECONSTRUCTION / NO ACTUAL ROUTES OR COORDINATES', '#216842'),
]:
    image = Image.new('RGB', (1100, 650), '#edf4f7')
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 1100, 13), fill=accent)
    draw.text((48, 43), title, font=font(23, True), fill=accent)
    draw.text((48, 100), subtitle, font=font(35, True), fill='#17283c')
    draw.line((130, 340, 980, 340), fill=accent, width=4)
    for index, (label, detail) in enumerate(steps):
        x = 48 + index * 344
        draw.rectangle((x, 230, x + 316, 424), fill='#ffffff', outline='#a8c1ca', width=2)
        draw.text((x + 21, 252), f'0{index + 1}', font=font(20), fill=accent)
        draw.text((x + 21, 295), label, font=font(31, True), fill='#17283c')
        draw.text((x + 21, 366), detail, font=font(18), fill='#33485b')
    draw.text((48, 575), note, font=font(17), fill='#33485b')
    image.save(output / f'{name}.webp', quality=92, method=6)
