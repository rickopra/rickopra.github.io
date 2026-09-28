"""Curate local archive photos with automated redaction; manual privacy review is still required."""
import argparse
import json
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument('pdf', type=Path)
parser.add_argument('--preview', action='store_true')
parser.add_argument('--photos', type=Path, nargs='*', default=[])
parser.add_argument('--extract', action='store_true')
parser.add_argument('--publish', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
local = root / '.local' / 'archive-review'
local.mkdir(parents=True, exist_ok=True)

if args.preview:
    with pymupdf.open(args.pdf) as document:
        for start in range(0, len(document), 12):
            sheet = Image.new('RGB', (1200, 1280), '#d8e0e8')
            draw = ImageDraw.Draw(sheet)
            for index, page_number in enumerate(range(start, min(start + 12, len(document)))):
                page = document[page_number]
                pixmap = page.get_pixmap(matrix=pymupdf.Matrix(0.55, 0.55), alpha=False)
                image = Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)
                image.thumbnail((284, 388))
                x, y = (index % 4) * 300, (index // 4) * 426
                sheet.paste(image, (x, y + 24))
                draw.text((x + 8, y + 6), f'PAGE {page_number + 1}', fill='black')
            sheet.save(local / f'pages-{start + 1:02}.png')
    for index, path in enumerate(args.photos):
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source).convert('RGB')
            print(f'Photo {index + 1}: {image.size}')
            image.thumbnail((800, 1000))
            image.save(local / f'portrait-{index + 1}.png')

if args.extract:
    # Embedded photographs only. Router screenshots and geolocated maps stay private.
    with pymupdf.open(args.pdf) as document:
        for page_number in [6, 9, 15, 26, 45, 46, 47, 48, 49, 50, 51, 54, 55, 56, 57, 58, 59, 60, 61]:
            for index, entry in enumerate(document[page_number - 1].get_image_info(xrefs=True)):
                pixmap = pymupdf.Pixmap(document, entry['xref'])
                image = Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)
                image.thumbnail((1280, 1280))
                image.save(local / f'page-{page_number:02}-{index + 1}.png')

if args.publish:
    sys.path.insert(0, str(root / '.local' / 'curation-tools'))
    import cv2
    import numpy as np
    from rapidocr_onnxruntime import RapidOCR

    ocr = RapidOCR()
    faces = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    output = root / 'public' / 'assets' / 'evidence'
    output.mkdir(parents=True, exist_ok=True)
    selected = {
        'lan-equipment-1': 'page-06-1', 'lan-equipment-2': 'page-06-2',
        'wireless-field-1': 'page-47-1', 'wireless-field-2': 'page-48-1',
        'fiber-field-1': 'page-55-1', 'fiber-field-2': 'page-57-1',
        'fiber-field-3': 'page-61-1',
    }
    report = {}
    for name, source in selected.items():
        image = Image.open(local / f'{source}.png').convert('RGB')
        pixels = np.array(image)
        blocks, _ = ocr(pixels)
        draw = ImageDraw.Draw(image)
        redactions = []
        for box, value, confidence in blocks or []:
            left, top = np.min(box, axis=0)
            right, bottom = np.max(box, axis=0)
            region = (max(0, int(left) - 6), max(0, int(top) - 5), min(image.width, int(right) + 6), min(image.height, int(bottom) + 5))
            draw.rectangle(region, fill='#17202a')
            redactions.append({'region': region, 'text': value})
        gray = cv2.cvtColor(pixels, cv2.COLOR_RGB2GRAY)
        for x, y, width, height in faces.detectMultiScale(gray, scaleFactor=1.08, minNeighbors=3, minSize=(22, 22)):
            draw.rectangle((int(x), int(y), int(x + width), int(y + height)), fill='#17202a')
        image.info.clear()
        image.save(output / f'{name}.webp', quality=85, method=6, exif=b'', xmp=b'')
        report[name] = redactions
        print(f'{name}: {image.size}, {len(redactions)} text regions redacted')
    (local / 'redaction-review.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
