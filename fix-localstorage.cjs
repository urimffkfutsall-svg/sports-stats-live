const fs = require('fs');
const filePath = 'src/context/DataContext.tsx';
let content = fs.readFileSync(filePath, 'utf8');
let count = 0;

// 1. Disable persistCache - add early return
const MARKER = 'const persistCache = useCallback(async (snapshot: DataState = stateRef.current) => {';
if (content.includes(MARKER)) {
  content = content.replace(MARKER, MARKER + '\n    return; // DISABLED - Supabase is source of truth');
  count++; console.log('ok 1: persistCache disabled');
}

// 2. Force reads to return null -> always fetch from Supabase
const reads = [
  ["localStorage.getItem('ffk_futsall_data') || localStorage.getItem('ffk_cache_v2')", 'null'],
  ["localStorage.getItem('ffk_futsall_data')", 'null'],
  ["localStorage.getItem('ffk_cache_v2')", 'null'],
];
for (const [from, to] of reads) {
  if (content.includes(from)) {
    content = content.split(from).join(to);
    count++; console.log('ok 2:', from.slice(0,40));
  }
}

// 3. Bump cache version to clear all browsers
const ver = content.match(/const CACHE_VER = '(v\d+)'/);
if (ver) {
  content = content.replace("const CACHE_VER = '" + ver[1] + "'", "const CACHE_VER = 'no-cache'");
  count++; console.log('ok 3: CACHE_VER -> no-cache');
}

if (count === 0) { console.log('WARNING: asnje ndryshim!'); }
else { fs.writeFileSync(filePath, content, 'utf8'); console.log('\nGATI! ' + count + ' ndryshime.'); }
