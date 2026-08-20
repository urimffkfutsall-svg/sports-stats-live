const fs = require('fs');
const c = fs.readFileSync('src/context/DataContext.tsx', 'utf8');
const lines = c.split('\n');
let lastImport = -1;
lines.forEach((l, i) => { if (/^import\b/.test(l)) lastImport = i; });
const interceptor = `
// CACHE DISABLED: blloko shkrimet e localStorage per cache te madh
if (typeof window !== 'undefined') {
  const _ls = window.localStorage.setItem.bind(window.localStorage);
  (window.localStorage as any).setItem = (k: string, v: string) => {
    if (k === 'ffk_cache_v2' || k === 'ffk_futsall_data' || k === 'ffk_futsal_data') return;
    _ls(k, v);
  };
  ['ffk_cache_v2', 'ffk_futsall_data', 'ffk_futsal_data'].forEach(k => window.localStorage.removeItem(k));
}
`;
lines.splice(lastImport + 1, 0, interceptor);
fs.writeFileSync('src/context/DataContext.tsx', lines.join('\n'), 'utf8');
console.log('GATI: Interceptori u shtua pastër!');
