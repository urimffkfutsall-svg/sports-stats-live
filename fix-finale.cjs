const fs = require("fs");
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");

// Remove debug lines
kupa = kupa.replace(/\s*<p className="text-\[10px\] text-gray-300 mt-0\.5">Debug:.*?<\/p>/g, '');

fs.writeFileSync("src/pages/KupaPage.tsx", kupa, "utf8");
console.log("[OK] Debug removed from KupaPage");

// Now check AdminMatches - the cup legs submit might not work because
// when legs are enabled, the normal score fields are hidden but the form
// validation might require them. Let me check.
let admin = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// The issue: when cup legs are used, the main form's homeScore/awayScore are empty
// but matchData still uses them. The leg submit should override them.
// Also: the submit logic checks selectedIsCup && (cupLegs.leg1.enabled || ...)
// but for FINAL (single match), user might not use legs UI - they just add a single match.
// Fix: allow normal single match submit even for cup when no legs are enabled

// Check current submit logic
const submitHas = admin.includes("} else if (selectedIsCup && (cupLegs.leg1.enabled");
console.log("Has cup legs submit logic: " + submitHas);

// The logic already falls through to normal addMatch when no legs enabled:
// else if (selectedIsCup && legs enabled) -> create legs
// else -> addMatch(matchData) <- this handles single cup match (final)

// The problem might be that the score inputs are hidden for cup!
// Fix: show normal score inputs for cup FINAL (week=4) or when no legs checked
const hideScore = admin.includes('!selectedIsCup && (<div>');
console.log("Scores hidden for cup: " + hideScore);

if (hideScore) {
  // Change condition: show scores when it's cup final OR when no legs enabled
  admin = admin.replace(
    '{form.status !== "planned" && !selectedIsCup && (<div>\n                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Shtëpi</label>',
    '{form.status !== "planned" && (!selectedIsCup || form.week === 4) && (<div>\n                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Shtëpi</label>'
  );
  admin = admin.replace(
    '{form.status !== "planned" && !selectedIsCup && (<div>\n                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Jashtë</label>',
    '{form.status !== "planned" && (!selectedIsCup || form.week === 4) && (<div>\n                <label className="block text-xs font-medium text-gray-600 mb-1">Rezultati Jashtë</label>'
  );
  console.log("[OK] Score inputs now visible for cup final (week=4)");
}

// Also hide the cup legs UI for finale since it's a single match
if (!admin.includes("form.week !== 4")) {
  admin = admin.replace(
    '{selectedIsCup && !editId && (',
    '{selectedIsCup && !editId && form.week !== 4 && ('
  );
  console.log("[OK] Cup legs UI hidden for Finale (single match)");
}

fs.writeFileSync("src/pages/admin/AdminMatches.tsx", admin, "utf8");
console.log("\n[DONE] Fixes applied:");
console.log("  - Finale shows normal score inputs (single match)");
console.log("  - Cup legs UI only for rounds 1-3");
console.log("  - Debug removed from KupaPage");
