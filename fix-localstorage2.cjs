const fs = require('fs');
const filePath = 'src/context/DataContext.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find insertion point after last import
const lines = content.split('\n');
let lastImportIdx = 0;
lines.forEach((l, i) => { if (l.startsWith('import ')) lastImportIdx = i; });

const interceptor = `
// CACHE DISABLED - intercept all localStorage writes for large keys
if (typeof window !== 'undefined') {
  const _origSet = window.localStorage.setItem.bind(window.localStorage);
  (window.localStorage as any).setItem = (key: string, value: string) => {
    if (key === 'ffk_cache_v2' || key === 'ffk_futsall_data' || key === 'ffk_futsal_data') return;
    _origSet(key, value);
  };
  window.localStorage.removeItem('ffk_cache_v2');
  window.localStorage.removeItem('ffk_futsall_data');
  window.localStorage.removeItem('ffk_futsal_data');
}
`;

lines.splice(lastImportIdx + 1, 0, interceptor);
fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('GATI! Interceptor i shtuar pas importeve.');
