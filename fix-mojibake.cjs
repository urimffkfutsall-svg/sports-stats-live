const fs = require('fs');
const path = require('path');

function walk(dir, exts, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, files);
    else if (exts.includes(path.extname(entry.name))) files.push(full);
  }
  return files;
}

function looksMojibake(str) {
  return /Ã.|â€|â—|â˜|âš|â†|â‰|â”|Â·|├|┬|Γ|╣|╗|Þ/.test(str);
}

function fixOnce(str) {
  const buf = Buffer.from(str, 'latin1');
  return buf.toString('utf8');
}

const files = walk(path.join(__dirname, 'src'), ['.ts', '.tsx']);
let changedCount = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  if (!looksMojibake(original)) continue;

  let current = original;
  for (let i = 0; i < 4; i++) {
    if (!looksMojibake(current)) break;
    const next = fixOnce(current);
    if (next === current) break;
    current = next;
  }

  if (current !== original && !looksMojibake(current)) {
    fs.writeFileSync(file, current, 'utf8');
    changedCount++;
    console.log('Fixed:', path.relative(__dirname, file));
  } else if (looksMojibake(current)) {
    console.log('COULD NOT FULLY FIX:', path.relative(__dirname, file));
  }
}

console.log('\nTotal files fixed:', changedCount);
