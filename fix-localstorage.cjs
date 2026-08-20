const fs = require('fs');
const filePath = 'src/context/DataContext.tsx';
let content = fs.readFileSync(filePath, 'utf8');
const original = content;
let changes = 0;

// 1. Disable persistCache - add early return
const r1 = content.replace(
  'const persistCache = useCallback(async (snapshot: DataState = stateRef.current) => {',
  'const persistCache = useCallback(async (snapshot: DataState = stateRef.current) => {\n    return; // DISABLED: cache too large, data comes from Supabase'
);
if (r1 !== content) { content = r1; changes++; console.log('ok: persistCache disabled'); }

// 2. Force-clear old cache on every startup
const r2 = content.replace(
  /const CACHE_VER = 'v\d+';/,
  "localStorage.removeItem('ffk_cache_v2'); localStorage.removeItem('ffk_futsall_data'); localStorage.removeItem('ffk_futsal_data'); localStorage.removeItem('ffk_cache_ver'); const CACHE_VER = 'disabled';"
);
if (r2 !== content) { content = r2; changes++; console.log('ok: cache clear on startup'); }

if (changes === 0) {
  console.log('WARNING: asnje ndryshim - pattern nuk u gjet, kontroll manual nevojitet');
} else {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('\nGATI! ' + changes + ' rregullime u aplikuan.');
}
