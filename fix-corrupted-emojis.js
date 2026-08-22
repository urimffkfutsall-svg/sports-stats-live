#!/usr/bin/env node
/**
 * fix-corrupted-emojis.js
 *
 * Skanon rekursivisht "src/" per skedare .ts/.tsx dhe:
 *  1. Zbulon butona Edit/Delete qe kane emoji te korruptuara ne vend te ikonave
 *     (te njohura nga konteksti: onClick={() => handleEdit...} ose te ngjashme
 *      per delete: onClick={() => ...delete... / ...Fshi...})
 *     dhe i zevendeson me ikona nga 'lucide-react' (Pencil / Trash2).
 *  2. Ne fund, heq CDO karakter tjeter te mbetur te korruptuar (U+FFFD "�",
 *     ose sekuenca mojibake si "∩┐╜", "├ó┼ô", etj.) qe s'u trajtua ne hapin 1,
 *     dhe i shenon per rishikim manual (i printon ne konsole, s'i fshin heshtazi
 *     nese jane brenda tekstit qe shfaqet te useri - shiko REPORT ne fund).
 *
 * PERDORIM:
 *   node fix-corrupted-emojis.js
 *
 * Rekomandohet te kesh git commit para se ta ekzekutosh, per te pare diff-in
 * dhe per ta kthyer mbrapa nese diçka del gabim:
 *   git add -A && git commit -m "checkpoint before emoji cleanup"
 *   node fix-corrupted-emojis.js
 *   git diff
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'src');

if (!fs.existsSync(ROOT)) {
  console.error('Nuk gjeta dosjen "src" ne direktorine aktuale. Ekzekutoje nga rrenja e projektit.');
  process.exit(1);
}

// Karakteret / sekuencat qe konsiderohen "korruptuar" (mojibake ose replacement char)
const CORRUPTED_PATTERN = /\uFFFD|∩┐╜|├[^\s]{0,3}|Γ[^\s]{0,3}|┬[^\s]{0,3}/g;

// Gjen te gjithe skedaret .ts/.tsx rekursivisht
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function ensureLucideImport(content, neededIcons) {
  const importRegex = /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"];?/;
  const match = content.match(importRegex);

  if (match) {
    const existing = match[1].split(',').map((s) => s.trim()).filter(Boolean);
    const merged = Array.from(new Set([...existing, ...neededIcons]));
    const newImportLine = `import { ${merged.join(', ')} } from 'lucide-react';`;
    return content.replace(importRegex, newImportLine);
  } else {
    // s'ka import nga lucide-react ende - shtoje ne krye, pas import-eve te para
    const lines = content.split('\n');
    let insertAt = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) insertAt = i + 1;
      else if (insertAt > 0) break;
    }
    const newImportLine = `import { ${neededIcons.join(', ')} } from 'lucide-react';`;
    lines.splice(insertAt, 0, newImportLine);
    return lines.join('\n');
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  const neededIcons = new Set();
  let changedButtons = 0;

  // Rregull 1: buton Edit korruptuar
  // shembull match: onClick={() => handleEdit(p)} ... >CORRUPTED</button>
  content = content.replace(
    /(<button\s+onClick=\{\(\)\s*=>\s*(?:handleEdit|handleEditScorer)\([^)]*\)\}[^>]*>)([^<]*)(<\/button>)/g,
    (full, openTag, inner, closeTag) => {
      if (CORRUPTED_PATTERN.test(inner) || /^[^\w\s]{0,4}[A-Za-z]?\}?$/.test(inner.trim()) === false) {
        // fallback: nese inner s'eshte JSX i pastres (p.sh permban simbole te huaja), zevendesoje
      }
      if (CORRUPTED_PATTERN.test(inner) || /[^\x00-\x7F]/.test(inner)) {
        neededIcons.add('Pencil');
        changedButtons++;
        return `${openTag}<Pencil className="w-4 h-4" />${closeTag}`;
      }
      return full;
    }
  );

  // Rregull 2: buton Delete korruptuar
  content = content.replace(
    /(<button\s+onClick=\{\(\)\s*=>\s*\{?[^}]*(?:delete|Delete|Fshi)[^}]*\}?\}[^>]*>)([^<]*)(<\/button>)/g,
    (full, openTag, inner, closeTag) => {
      if (CORRUPTED_PATTERN.test(inner) || /[^\x00-\x7F]/.test(inner)) {
        neededIcons.add('Trash2');
        changedButtons++;
        return `${openTag}<Trash2 className="w-4 h-4" />${closeTag}`;
      }
      return full;
    }
  );

  if (neededIcons.size > 0) {
    content = ensureLucideImport(content, Array.from(neededIcons));
  }

  // Rregull 3: cdo mbetje tjeter e korruptuar qe s'ishte brenda <button>...</button>
  const leftovers = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (CORRUPTED_PATTERN.test(lines[i])) {
      leftovers.push({ line: i + 1, text: lines[i].trim() });
    }
    CORRUPTED_PATTERN.lastIndex = 0; // reset regex global state
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return { changedButtons, leftovers, changed: content !== original };
}

// --- Ekzekutimi ---
const files = walk(ROOT);
let totalButtonsFixed = 0;
let filesChanged = 0;
const allLeftovers = [];

for (const file of files) {
  const result = processFile(file);
  if (result.changed) {
    filesChanged++;
    totalButtonsFixed += result.changedButtons;
    console.log(`✔ Rregulluar: ${path.relative(process.cwd(), file)} (${result.changedButtons} butona)`);
  }
  if (result.leftovers.length > 0) {
    for (const l of result.leftovers) {
      allLeftovers.push({ file: path.relative(process.cwd(), file), ...l });
    }
  }
}

console.log('\n--- REPORT ---');
console.log(`Skedare te modifikuar: ${filesChanged}`);
console.log(`Butona te rregulluar (Edit/Delete): ${totalButtonsFixed}`);

if (allLeftovers.length > 0) {
  console.log(`\n⚠ U gjeten ${allLeftovers.length} raste te tjera me karaktere te korruptuara qe DUHET te kontrollosh manualisht:`);
  for (const l of allLeftovers) {
    console.log(`  ${l.file}:${l.line}  ->  ${l.text}`);
  }
  console.log('\nKeto NUK u prekur automatikisht sepse s\'ishin brenda nje <button> Edit/Delete te njohur.');
} else {
  console.log('\n✅ S\'u gjet asnje karakter tjeter i korruptuar.');
}

console.log('\nTani kontrollo me: git diff');
console.log('Nese gjithcka duket mire, ruaj dhe bej commit & push.');
