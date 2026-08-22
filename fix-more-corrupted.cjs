#!/usr/bin/env node
/**
 * fix-more-corrupted.cjs
 *
 * Rregullon 5 raste specifike te karaktereve te korruptuara qe u gjeten
 * jashte butonave Edit/Delete (shigjeta navigimi, buton kthimi, buton
 * mbyllje lightbox, emoji televizori). Perdor zevendesim SIPAS NUMRIT TE
 * RRESHTIT (jo perputhje teksti) - kjo eshte e sigurt sepse s'varet nga
 * paraqitja vizuale e karaktereve te korruptuara, qe ndryshon ne ekrane
 * te ndryshme (â¬¹ vs Ã¯Â¿Â½ jane e njejta gje, thjesht te renderuara
 * ndryshe).
 *
 * PERPARA SE TA EKZEKUTOSH: sigurohu qe s'ke ndryshime te paangazhuara
 * (git status i paster), qe te mund ta kthesh mbrapa lehte nese diçka
 * del gabim.
 *
 * PERDORIM:
 *   node fix-more-corrupted.cjs
 */

const fs = require('fs');
const path = require('path');

function ensureImport(lines, importLine) {
  // shto importin e ri menjehere pas rreshtit te pare "import ..."
  const alreadyThere = lines.some((l) => l.includes(importLine));
  if (alreadyThere) return lines;
  let insertAt = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) insertAt = i + 1;
    else if (insertAt > 0) break;
  }
  lines.splice(insertAt, 0, importLine);
  return lines;
}

function applyFix(relPath, checks, importLine) {
  const filePath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`✗ Skedari s'ekziston: ${relPath} - anashkaluar.`);
    return false;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');

  // Verifiko qe cdo rresht i pritur permban nje "gjurmë" te njohur (jo
  // vetem numrin e rreshtit) - mbrojtje nese numrat e rreshtave kane ndryshuar.
  for (const check of checks) {
    const idx = check.lineNumber - 1;
    if (idx < 0 || idx >= lines.length || !lines[idx].includes(check.mustContain)) {
      console.log(`✗ ${relPath}:${check.lineNumber} - rreshti s'permban "${check.mustContain}" siç pritej. ANASHKALUAR gjithe skedari per siguri.`);
      return false;
    }
  }

  // Te gjitha kontrollet kaluan - apliko zevendesimet
  for (const check of checks) {
    lines[check.lineNumber - 1] = check.newLine;
  }

  if (importLine) {
    lines = ensureImport(lines, importLine);
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`✔ Rregulluar: ${relPath} (${checks.length} rreshta)`);
  return true;
}

// --- CompetitionPage.tsx: shigjetat e navigimit te javes ---
applyFix(
  'src/pages/CompetitionPage.tsx',
  [
    {
      lineNumber: 314,
      mustContain: 'weekIdx > 0 && setSelectedWeek(weeks[weekIdx - 1])',
      newLine: '                  <button onClick={() => weekIdx > 0 && setSelectedWeek(weeks[weekIdx - 1])} disabled={weekIdx <= 0} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>',
    },
    {
      lineNumber: 319,
      mustContain: 'weekIdx < weeks.length - 1 && setSelectedWeek(weeks[weekIdx + 1])',
      newLine: '                  <button onClick={() => weekIdx < weeks.length - 1 && setSelectedWeek(weeks[weekIdx + 1])} disabled={weekIdx >= weeks.length - 1} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>',
    },
  ],
  "import { ChevronLeft, ChevronRight } from 'lucide-react';"
);

// --- NewsDetailPage.tsx: buton kthimi + buton mbyllje lightbox ---
applyFix(
  'src/pages/NewsDetailPage.tsx',
  [
    {
      lineNumber: 50,
      mustContain: 'Kthehu',
      newLine: '          <ArrowLeft className="w-4 h-4" /> Kthehu',
    },
    {
      lineNumber: 147,
      mustContain: '',
      newLine: '              <X className="w-5 h-5" />',
    },
  ],
  "import { ArrowLeft, X } from 'lucide-react';"
);

// --- LiveStreamsPage.tsx: emoji televizori ---
applyFix(
  'src/pages/LiveStreamsPage.tsx',
  [
    {
      lineNumber: 81,
      mustContain: 'text-3xl',
      newLine: '              <span className="text-3xl"><Tv className="w-8 h-8 mx-auto text-gray-500" /></span>',
    },
  ],
  "import { Tv } from 'lucide-react';"
);

console.log('\nTani kontrollo me: git --no-pager diff');
console.log('Pastaj: npm run build');
