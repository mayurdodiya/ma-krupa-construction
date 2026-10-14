import json, os
root=r'D:\Mayur\Client\maa-krupa\test website\maa-rkupa'
data=json.load(open(os.path.join(root,'src/data/businesses.json'),encoding='utf-8'))
bad=[]
for b in data:
    if b.get('cover'):
        if not os.path.exists(os.path.join(root,'public',b['cover'].lstrip('/'))): bad.append(('cover',b['id'],b['cover']))
    for p in b.get('products',[]):
        for k in ('image','video'):
            v=p.get(k)
            if v and not os.path.exists(os.path.join(root,'public',v.lstrip('/'))):
                bad.append((k,p['id'],v))
print('business asset issues:',len(bad))
for x in bad: print(x)
