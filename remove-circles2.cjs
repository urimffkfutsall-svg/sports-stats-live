const fs = require('fs');
const file = 'src/pages/PlayerOfWeekPage.tsx';
let s = fs.readFileSync(file, 'utf8');

function removeBlock(src, marker) {
  const start = src.indexOf(marker);
  if (start === -1) return { src, removed: false };
  let i = start, depth = 0;
  while (i < src.length) {
    if (src.substr(i, 4) === '<div') { depth++; i += 4; }
    else if (src.substr(i, 6) === '</div>') {
      depth--; i += 6;
      if (depth === 0) {
        let j = start;
        while (j > 0 && /\s/.test(src[j-1])) j--;
        return { src: src.substring(0, j) + src.substring(i), removed: true };
      }
    } else i++;
  }
  return { src, removed: false };
}

let n = 0;
const r1 = removeBlock(s, '<div className="absolute -top-3 -left-3 z-10">');
if (r1.removed) { s = r1.src; n++; console.log('OK rrethi gold (lojtari aktual)'); }

const r2 = removeBlock(s, '<div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#2a499a]');
if (r2.removed) { s = r2.src; n++; console.log('OK rrethi blu (lojtaret e meparshem)'); }

if (n) { fs.writeFileSync(file, s); console.log(`\nU ruajten ${n} ndryshime ne ${file}`); }
else console.log('Asnje match.');
