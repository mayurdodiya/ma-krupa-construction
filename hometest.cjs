const fs=require('fs');
const s=fs.readFileSync('src/pages/Home.jsx','utf8');
console.log('len',s.length);
try {
  const ms=s.match(/\/(images|videos)\/[^\s"'`)]+/g);
  console.log('ms', ms&&ms.length);
} catch(e){console.log('err',e);}
