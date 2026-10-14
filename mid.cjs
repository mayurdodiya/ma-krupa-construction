
const fs=require('fs');
function walk(d){let o=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=d+'/'+e.name; if(e.isDirectory()) o=o.concat(walk(p)); else o.push(p);} return o;}
const files=walk('src').filter(f=>/\.(json|jsx|js)$/.test(f));
console.log('files',files.length);
const s=fs.readFileSync(files[0],'utf8');
console.log('read ok', files[0], s.length);

