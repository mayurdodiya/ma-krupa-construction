const fs=require('fs');
function walk(d){let o=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=d+'/'+e.name; if(e.isDirectory()) o=o.concat(walk(p)); else o.push(p);} return o;}
const files=walk('src').filter(f=>/\.(json|jsx|js)$/.test(f));
let refs=[];
for(const f of files){
  const s=fs.readFileSync(f,'utf8');
  console.log('FILE', f, s.length);
  const ms=s.match(/\/(images|videos)\/[^\s"'`)]+/g);
  if(ms) { console.log('matches', ms.length, 'in', f); refs.push(...ms);}
}
console.log('DONE raw', refs.length);
