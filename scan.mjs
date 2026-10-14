console.log('start');
const fs = require('fs');
const path = require('path');
function walk(d){let o=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) o=o.concat(walk(p)); else o.push(p);} return o;}
console.log('walking');
const files = walk('src').filter(f=>/\.(json|jsx|js)$/.test(f));
console.log('files', files.length);
const refs = [];
for(const f of files){
  console.log('reading', f);
  const s = fs.readFileSync(f,'utf8');
  const ms = s.match(/\/(images|videos)\/[^\s"'`)]+/g);
  if(ms) for(const m of ms) refs.push(m);
}
console.log('refs raw', refs.length);
