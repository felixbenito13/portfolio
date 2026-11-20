"""Builds the double logo carousel of the home page ("Worked with." section).

Run from the project root:  python3 tools/logo-marquee.py
It rewrites the markup between <!-- logo-marquee:start --> and <!-- logo-marquee:end -->
in index.html. Logos whose file is not in assets/ yet are skipped and listed.

Each logo gets a width that gives every brand about the same visual area, so wide
wordmarks and compact symbols look balanced. Logo files must have a transparent background.
"""
import math, os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROW_1 = [('Audi', 'client-logo-audi.svg'), ('Coca-Cola', 'client-logo-coca-cola.png'), ('Radix', 'client-logo-radix'),
         ('Saraiva', 'client-logo-saraiva.png'), ('PharosGraph', 'client-logo-pharosgraph'), ('Algar', 'client-logo-algar.png')]
ROW_2 = [('Kraft Heinz', 'client-logo-kraft-heinz.png'), ('CI&T', 'client-logo-ciandt'), ('RHI Magnesita', 'client-logo-rhi-magnesita.png'),
         ('The SF Team', 'client-logo-sf-team'), ('Ourofino', 'client-logo-ourofino.png'), ('Ice Kiss', 'client-logo-ice-kiss.png')]

CARD_W, CARD_H, GAP = 320, 176, 16          # desktop card, used for the size maths
MAX_W, MAX_H = 0.55 * CARD_W, 64            # brief: 55% of the card, 64 px tall
AREA = 7200                                 # target visual area in px² at desktop size
MIN_TRACK = 2400                            # each half of the track must cover the widest screen


def find(name):
    """Accept a name with or without extension (svg, png, webp)."""
    if os.path.splitext(name)[1]:
        return name if os.path.exists(os.path.join(ROOT, 'assets', name)) else None
    for ext in ('.svg', '.png', '.webp'):
        if os.path.exists(os.path.join(ROOT, 'assets', name + ext)):
            return name + ext
    return None


def size_of(fname):
    path = os.path.join(ROOT, 'assets', fname)
    if fname.endswith('.svg'):
        head = open(path, encoding='utf-8').read(2000)
        vb = re.search(r'viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"', head)
        w, h = (float(vb.group(1)), float(vb.group(2))) if vb else (1000, 350)
        scale = 1000 / w
        return 1000, round(h * scale)
    im = Image.open(path)
    return im.size


def logo_box(fname):
    w, h = size_of(fname)
    r = w / h
    lw = min(MAX_W, math.sqrt(AREA * r))
    if lw / r > MAX_H:
        lw = MAX_H * r
    return w, h, round(100 * lw / CARD_W, 1)


def row_html(items, cls):
    n = len(items)
    reps = max(1, math.ceil(MIN_TRACK / (n * (CARD_W + GAP))))
    half = items * reps
    out = ['      <div class="lm-row %s">' % cls, '        <ul class="lm-track" role="list">']
    for copy, seq in enumerate((half, half)):
        for i, (name, fname, w, h, pct) in enumerate(seq):
            original = copy == 0 and i < n
            li = '<li class="lm-card"%s>' % ('' if original else ' aria-hidden="true" data-dup')
            alt = name if original else ''
            out.append('          %s<img src="assets/%s" alt="%s" width="%d" height="%d" loading="lazy" decoding="async" style="--w: %s%%" /></li>'
                       % (li, fname, alt.replace('&', '&amp;'), w, h, pct))
    out += ['        </ul>', '      </div>']
    return out


def main():
    missing, rows = [], []
    for row in (ROW_1, ROW_2):
        ok = []
        for name, f in row:
            fname = find(f)
            if not fname:
                missing.append(name)
                continue
            w, h, pct = logo_box(fname)
            ok.append((name, fname, w, h, pct))
        rows.append(ok)
    block = ['<!-- logo-marquee:start -->',
             '    <div class="logo-marquee" data-r="logo-marquee">']
    block += row_html(rows[0], 'lm-left') + row_html(rows[1], 'lm-right')
    block += ['    </div>', '    <!-- logo-marquee:end -->']
    html = '\n'.join(block)
    for f in sys.argv[1:] or ['index.html']:
        p = os.path.join(ROOT, f)
        s = open(p, encoding='utf-8').read()
        s2, k = re.subn(r'<!-- logo-marquee:start -->.*?<!-- logo-marquee:end -->', html, s, flags=re.S)
        if not k:
            print('no markers in', f)
            continue
        open(p, 'w', encoding='utf-8').write(s2)
        print('updated', f)
    for r in rows:
        print('  ', ', '.join('%s %s%%' % (x[0], x[4]) for x in r))
    if missing:
        print('missing logo files:', ', '.join(missing))


main()
