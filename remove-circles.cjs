const fs=require('fs'),path=require('path');
function walk(d,out=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f),s=fs.statSync(p);if(s.isDirectory())walk(p,out);else if(/\.(jsx?|tsx?)$/.test(f))out.push(p);}return out;}
const files=walk('src').filter(p=>{const t=fs.readFileSync(p,'utf8');return /Lojtari\s*i\s*Jav|Fitueset\s*e\s*meparshem|JAVA\s*\d+/i.test(t);});
console.log('Skedaret e gjetur:',files);
let total=0;
for(const f of files){
  let s=fs.readFileSync(f,'utf8');const b=s;
  // Fshi badge rrumbullak (gold/yellow/black/blue) absolute mbi foton
  s=s.replace(/<div\b[^>]*className=["'`][^"'`]*\brounded-full\b[^"'`]*\babsolute\b[^"'`]*["'`][^>]*>[\s\S]*?<\/div>/g,'');
  s=s.replace(/<span\b[^>]*className=["'`][^"'`]*\brounded-full\b[^"'`]*\b(?:bg-yellow|bg-amber|bg-gold|bg-black|bg-slate-9|bg-blue-9|bg-zinc-9|bg-neutral-9)[^"'`]*["'`][^>]*>[\s\S]*?<\/span>/g,'');
  s=s.replace(/<(?:div|span)\b[^>]*data-(?:badge|dot|indicator)=[^>]*\/?>(?:[\s\S]*?<\/(?:div|span)>)?/g,'');
  if(s!==b){fs.writeFileSync(f,s);console.log('✅ U ndryshua:',f);total++;}
}
console.log(total?`Total: ${total} skedare te ndryshuar.`:'⚠️ Asnje match. Me trego skedarin e sakte.');
