import os, re, json

root = r'D:\Mayur\Client\maa-krupa\test website\maa-rkupa'
refs = set()
for dp, dn, fn in os.walk(os.path.join(root, 'src')):
    for f in fn:
        if f.endswith(('.json', '.jsx', '.js')):
            p = os.path.join(dp, f)
            with open(p, encoding='utf-8') as fh:
                s = fh.read()
            for m in re.findall(r'/(?:images|videos)/[^\s"\'`)]+', s):
                refs.add(m[:-1] if m.endswith((',', ';')) else m)
# clean trailing punctuation
clean = set()
for r in refs:
    clean.add(r.rstrip(' ,;'))
missing = []
for r in sorted(clean):
    full = os.path.join(root, 'public', r.lstrip('/').replace('/', os.sep))
    if not os.path.exists(full):
        missing.append(r)
print('total refs', len(clean))
print('missing', len(missing))
for m in missing:
    print(m)
