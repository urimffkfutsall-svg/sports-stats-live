const fs = require("fs");
let s = fs.readFileSync("src/pages/admin/AdminMatches.tsx", "utf8");

// Check if old code was removed and new code added
const hasCupRound = s.includes("cupRoundNames");
const hasIsCupComp = s.includes("isCupComp");
const hasSelectedIsCup = s.includes("selectedIsCup");

// Count occurrences - should be exactly 1 of each declaration
const cupCount = (s.match(/const cupRoundNames/g) || []).length;
const isCupCount = (s.match(/const isCupComp/g) || []).length;

console.log("cupRoundNames declarations: " + cupCount);
console.log("isCupComp declarations: " + isCupCount);
console.log("Has selectedIsCup: " + hasSelectedIsCup);

// Check position relative to form
const formIdx = s.indexOf("const [form,");
const cupIdx = s.indexOf("const cupRoundNames");
const filteredIdx = s.indexOf("const filteredMatches");

console.log("\nPositions:");
console.log("  form declared at: " + formIdx);
console.log("  cupRoundNames at: " + cupIdx);
console.log("  filteredMatches at: " + filteredIdx);
console.log("  Cup code after form: " + (cupIdx > formIdx));

// Check for errors
if (cupCount > 1) console.log("\n[WARN] Duplicate cupRoundNames!");
if (cupIdx < formIdx && cupIdx > -1) console.log("\n[WARN] cupRoundNames still before form!");
