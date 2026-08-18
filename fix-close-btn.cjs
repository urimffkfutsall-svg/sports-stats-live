const fs = require("fs");
let s = fs.readFileSync("src/components/MatchDetailModal.tsx", "utf8");
// Replace unicode X with simple visible X
s = s.replace(/\\u2715/g, '×');
// Also make the button bigger and more visible
s = s.replace(
  'className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#1E6FF2]/30 transition-all text-gray-400 hover:text-gray-600 text-sm font-bold shadow-sm"',
  'className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all text-gray-500 hover:text-red-500 text-lg font-bold shadow-md"'
);
fs.writeFileSync("src/components/MatchDetailModal.tsx", s, "utf8");
console.log("[OK] X button fixed - bigger and more visible");
