import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


parser = argparse.ArgumentParser()
parser.add_argument('--portrait', required=True)
parser.add_argument('--portrait-only', action='store_true')
arguments = parser.parse_args()
root = Path(__file__).resolve().parents[1]
output = root / 'public' / 'assets'
output.mkdir(parents=True, exist_ok=True)
portrait = ImageOps.exif_transpose(Image.open(arguments.portrait)).convert('RGBA')
portrait.info.clear()
pixels = portrait.load()
width, height = portrait.size
visited = set()
queue = deque()
for horizontal in range(width):
    queue.extend([(horizontal, 0), (horizontal, height - 1)])
for vertical in range(height):
    queue.extend([(0, vertical), (width - 1, vertical)])
while queue:
    horizontal, vertical = queue.popleft()
    if (horizontal, vertical) in visited:
        continue
    visited.add((horizontal, vertical))
    red, green, blue, alpha = pixels[horizontal, vertical]
    if blue > 85 and blue > red * 1.45 and blue > green * 1.2:
        pixels[horizontal, vertical] = (red, green, blue, 0)
        for offset_x, offset_y in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            next_x, next_y = horizontal + offset_x, vertical + offset_y
            if 0 <= next_x < width and 0 <= next_y < height:
                queue.append((next_x, next_y))
portrait.save(output / 'ricko-portrait.webp', quality=94, method=6)
if arguments.portrait_only:
    print(f'Generated uncropped portrait: {width} x {height}.')
    raise SystemExit(0)


def font(size, bold=False):
    name = 'arialbd.ttf' if bold else 'arial.ttf'
    return ImageFont.truetype(str(Path('C:/Windows/Fonts') / name), size)


def label(draw, position, value, size=22, fill='#14202a', bold=False):
    draw.text(position, value, font=font(size, bold), fill=fill)


def node(draw, bounds, title, subtitle, accent='#1556ee'):
    draw.rounded_rectangle(bounds, radius=5, fill='#ffffff', outline='#c9d6df', width=2)
    left, top, right, bottom = bounds
    draw.rectangle((left, top, left + 6, bottom), fill=accent)
    label(draw, (left + 20, top + 19), title, 25, bold=True)
    label(draw, (left + 20, top + 53), subtitle, 17, '#526473')


for project in ['infrastructure', 'atlas', 'operations', 'governance']:
    background = {'infrastructure': '#071f2d', 'atlas': '#daf2ef', 'operations': '#f8e0dc', 'governance': '#e6ecf9'}[project]
    image = Image.new('RGB', (1100, 650), background)
    draw = ImageDraw.Draw(image)
    if project == 'infrastructure':
        label(draw, (48, 36), 'MULTI-SITE INFRASTRUCTURE', 20, '#b0dada', True)
        label(draw, (48, 76), '7 sites. One connected environment.', 31, '#ffffff', True)
        points = [(550, 270), (210, 245), (855, 230), (195, 475), (465, 500), (745, 480), (945, 435)]
        for start, end in [(0, 1), (0, 2), (0, 3), (0, 4), (0, 5), (0, 6), (1, 3), (2, 6), (4, 5)]:
            draw.line([points[start], points[end]], fill='#236678', width=3)
        for index, (horizontal, vertical) in enumerate(points):
            draw.rounded_rectangle((horizontal - 48, vertical - 35, horizontal + 48, vertical + 35), radius=5, fill='#113e4c', outline='#74ede1', width=2)
            for offset in [0, 12, 24]:
                draw.line((horizontal - 25, vertical - 15 + offset, horizontal + 25, vertical - 15 + offset), fill='#b8ffff', width=3)
            label(draw, (horizontal - 28, vertical + 46), f'SITE {index + 1:02}', 15, '#c5e8e9')
        label(draw, (48, 590), 'BGP  /  SEGMENTATION  /  OBSERVABILITY', 18, '#92c3c9')
    elif project == 'atlas':
        label(draw, (48, 36), 'ATLAS / ASSET LIFECYCLE', 20, '#38675e', True)
        label(draw, (48, 81), 'Every asset has a story.', 40, '#163a33', True)
        draw.line((190, 283, 890, 283), fill='#63a99a', width=4)
        node(draw, (60, 232, 325, 332), '01  REGISTER', 'Inventory & catalog', '#218477')
        node(draw, (418, 232, 683, 332), '02  ASSIGN', 'People & ownership', '#218477')
        node(draw, (775, 232, 1040, 332), '03  HANDOVER', 'Records & traceability', '#218477')
        draw.line((550, 333, 550, 415), fill='#63a99a', width=3)
        node(draw, (260, 415, 840, 515), 'A connected operational record', 'Procurement / allocation / lifecycle history', '#218477')
        label(draw, (48, 590), 'NEXT.JS  /  FASTIFY  /  POSTGRESQL  /  DOCKER', 18, '#38675e')
    elif project == 'operations':
        label(draw, (48, 36), 'SHIFT + CHECKLIST', 20, '#945048', True)
        label(draw, (48, 81), 'Continuity, across every shift.', 40, '#522f2a', True)
        for index, (title, subtitle) in enumerate([('HANDOVER', 'Context captured'), ('ACCEPT', 'Ownership confirmed'), ('FOLLOW UP', 'Work stays visible')]):
            left = 60 + index * 358
            node(draw, (left, 230, left + 265, 332), title, subtitle, '#c75c4e')
            if index < 2:
                draw.line((left + 270, 280, left + 344, 280), fill='#bc7f74', width=4)
        for index, period in enumerate(['DAILY', 'WEEKLY', 'MONTHLY', '90 DAYS']):
            left = 60 + index * 260
            draw.rounded_rectangle((left, 418, left + 220, 495), radius=4, outline='#c6968d', width=2)
            label(draw, (left + 30, 443), period, 22, '#7b4037', True)
        label(draw, (48, 590), 'CLEAR OWNERSHIP  /  RECURRING CONTROLS', 18, '#945048')
    else:
        label(draw, (48, 36), 'GOVERNANCE / EVIDENCE CHAIN', 20, '#48608c', True)
        label(draw, (48, 81), 'From requirement to review.', 40, '#243553', True)
        draw.line((550, 240, 550, 535), fill='#98a9cb', width=3)
        for index, (title, subtitle) in enumerate([('REQUIREMENT', 'PCI DSS / ISO 27001'), ('WORKING CONTROL', 'Technical implementation & documentation'), ('REVIEWABLE EVIDENCE', 'Audit support / corrective action / validation')]):
            top = 194 + index * 127
            node(draw, (225, top, 875, top + 94), title, subtitle, '#5b78bc')
        label(draw, (48, 590), 'OPERATIONAL RISK OWNER  /  INTERNAL AUDIT SUPPORT', 18, '#48608c')
    image.save(output / f'{project}.webp', quality=90, method=6)

social = Image.new('RGB', (1200, 630), '#1552ee')
draw = ImageDraw.Draw(social)
draw.polygon([(720, 0), (1200, 0), (1200, 630), (520, 630)], fill='#052a98')
label(draw, (65, 65), 'IT OPERATIONS / INFRASTRUCTURE / GOVERNANCE', 21, '#adf7f4', True)
label(draw, (55, 170), 'RICKO', 114, '#ffffff', True)
label(draw, (55, 293), 'PRAYUDHA', 90, '#ffffff', True)
label(draw, (65, 518), '500+ USERS   /   7 SITES   /   24/7 OPERATIONS', 21, '#ffffff')
portrait_social = ImageOps.contain(portrait, (460, 710), Image.Resampling.LANCZOS)
social.paste(portrait_social, (760, 42), portrait_social)
social.save(output / 'social-preview.jpg', quality=92)
print('Generated portrait, four illustrative case-study visuals, and social preview. Logo assets are maintained by npm run logo.')
