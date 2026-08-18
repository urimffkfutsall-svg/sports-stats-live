const fs = require("fs");
const path = require("path");

function fixFile(filePath) {
  let s = fs.readFileSync(filePath, "utf8");
  const orig = s;

  // Fix UTF-8 mojibake (double-encoded UTF-8)
  s = s.replace(/Ã«/g, 'ë');
  s = s.replace(/Ã§/g, 'ç');
  s = s.replace(/Ã«/g, 'ë');
  s = s.replace(/Ã¨/g, 'è');
  s = s.replace(/Ã©/g, 'é');
  s = s.replace(/Ã¼/g, 'ü');
  s = s.replace(/Ã¶/g, 'ö');
  s = s.replace(/Ã¤/g, 'ä');
  s = s.replace(/Ã\u00AB/g, 'ë');
  
  // Fix broken em-dash and other symbols
  s = s.replace(/â€"/g, '—');
  s = s.replace(/â€"/g, '–');
  s = s.replace(/â€˜/g, "'");
  s = s.replace(/â€™/g, "'");
  s = s.replace(/â€œ/g, '"');
  s = s.replace(/â€\u009D/g, '"');
  s = s.replace(/â€º/g, '›');
  s = s.replace(/â€¹/g, '‹');

  // Fix escaped unicode sequences showing as literal text
  s = s.replace(/\\u2022/g, '\u2022');
  s = s.replace(/\\u203A/g, '\u203A');
  s = s.replace(/\\u2190/g, '\u2190');
  s = s.replace(/\\u00D7/g, '\u00D7');
  s = s.replace(/\\u2715/g, '\u2715');

  if (s !== orig) {
    fs.writeFileSync(filePath, s, "utf8");
    return true;
  }
  return false;
}

// Scan all TSX files
const dirs = ['src/components', 'src/pages', 'src/pages/admin'];
let fixed = 0;

dirs.forEach(dir => {
  try {
    fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).forEach(f => {
      const fp = dir + '/' + f;
      if (fixFile(fp)) {
        console.log("[FIXED] " + fp);
        fixed++;
      }
    });
  } catch {}
});

console.log("\nTotal files fixed: " + fixed);

// Also add Java badge to LandingMatches MatchRow if missing
let lm = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// Check if week is shown in match rows
if (!lm.includes('Java {match.week}')) {
  // Find the compact info section at bottom of MatchRow where date shows
  // Look for the date display in the top bar
  const datePattern = '{match.date && (\n              <span className="flex items-center gap-1 text-white/90 text-[11px] font-medium">';
  
  // Try adding week to the top bar area
  if (lm.includes('{formatDate(match.date)}')) {
    // Add week badge after the date/time section in the top bar
    lm = lm.replace(
      /\{match\.venue && \(/,
      '{match.week && (<span className="flex items-center gap-1 text-white/90 text-[11px] font-semibold"><span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Java {match.week}</span></span>)}\n            {match.venue && ('
    );
    
    fs.writeFileSync("src/components/LandingMatches.tsx", lm, "utf8");
    console.log("\n[OK] Added Java badge to LandingMatches MatchRow");
  }
}

// Verify fixes
console.log("\n=== Verification ===");
['src/components/LandingMatches.tsx', 'src/pages/AdminPage.tsx', 'src/pages/admin/AdminMatches.tsx'].forEach(f => {
  const content = fs.readFileSync(f, "utf8");
  const badChars = (content.match(/[Ã¤Ã¶Ã¼Ã«Ã§â€]/g) || []).length;
  const badEscapes = (content.match(/\\u[0-9A-Fa-f]{4}/g) || []).length;
  console.log(f + ": bad chars=" + badChars + ", bad escapes=" + badEscapes);
});
