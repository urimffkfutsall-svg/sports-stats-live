const fs = require("fs");
let kupa = fs.readFileSync("src/pages/KupaPage.tsx", "utf8");

// Remove debug
kupa = kupa.replace(/\s*<div className="text-\[9px\] text-red-400 mt-1 space-y-0\.5">[\s\S]*?<\/div>/g, function(match) {
  if (match.includes("CompID:")) return '';
  return match;
});

// Make cards more compact:

// 1) Reduce min-width of round columns
kupa = kupa.replace(/min-w-\[400px\]/g, 'min-w-[280px]');

// 2) Reduce gap between rounds
kupa = kupa.replace('className="flex gap-8 min-w-max pb-4"', 'className="flex gap-4 min-w-max pb-4"');

// 3) Reduce spacing between ties
kupa = kupa.replace('className="space-y-5">', 'className="space-y-3">');

// 4) Make aggregate header more compact
kupa = kupa.replace(/"px-4 py-3 border-b border-\[#1E6FF2\]\/10"/g, '"px-3 py-2 border-b border-[#1E6FF2]/10"');

// 5) Make team logos smaller in aggregate header
kupa = kupa.replace(/w-7 h-7 rounded-lg bg-white/g, 'w-5 h-5 rounded-md bg-white');

// 6) Make team names smaller in aggregate
kupa = kupa.replace(/text-sm font-bold truncate block/g, 'text-xs font-bold truncate block');

// 7) Make aggregate score smaller
kupa = kupa.replace(/text-xl font-black tabular-nums/g, 'text-base font-black tabular-nums');

// 8) Make legs more compact
kupa = kupa.replace(/"p-3 space-y-2"/g, '"p-2 space-y-1.5"');

// 9) Make LegRow more compact
kupa = kupa.replace(
  'className={`flex items-center justify-between px-3 py-1.5 border-b',
  'className={`flex items-center justify-between px-2.5 py-1 border-b'
);
kupa = kupa.replace('"px-3 py-2.5">', '"px-2.5 py-1.5">');

// 10) Make team logos in legs smaller
kupa = kupa.replace(/w-6 h-6 rounded-md bg-gray-50/g, 'w-5 h-5 rounded-md bg-gray-50');

// 11) Make team names in legs smaller
kupa = kupa.replace(/text-sm font-semibold text-gray-800 truncate/g, 'text-xs font-semibold text-gray-800 truncate');

// 12) Make scores in legs smaller
kupa = kupa.replace(/text-lg font-black tabular-nums/g, 'text-sm font-black tabular-nums');

// 13) Make "Shiko te dhenat" link smaller
kupa = kupa.replace(
  '<div className="mt-2 text-center">',
  '<div className="mt-1 text-center">'
);

// 14) Make round headers smaller
kupa = kupa.replace('className="flex items-center gap-2 mb-5 justify-center"', 'className="flex items-center gap-2 mb-3 justify-center"');
kupa = kupa.replace('className="w-1 h-5 bg-[#1E6FF2] rounded-full"', 'className="w-1 h-4 bg-[#1E6FF2] rounded-full"');

// 15) Reduce section padding
kupa = kupa.replace('className="max-w-7xl mx-auto px-4 py-8"', 'className="max-w-7xl mx-auto px-4 py-5"');

// 16) Reduce rounded on tie cards
kupa = kupa.replace(/rounded-2xl border-2 border-\[#1E6FF2\]\/15/g, 'rounded-xl border border-[#1E6FF2]/15');

// 17) Make "Kalon" badge smaller
kupa = kupa.replace('className="flex justify-center mt-2"', 'className="flex justify-center mt-1"');

// 18) Make wins text smaller
kupa = kupa.replace(/text-\[10px\] text-gray-400">\{tie\.winsA\}/g, 'text-[9px] text-gray-400">{tie.winsA}');
kupa = kupa.replace(/text-\[10px\] text-gray-400">\{tie\.winsB\}/g, 'text-[9px] text-gray-400">{tie.winsB}');

// 19) mb-1.5 on leg rows
kupa = kupa.replace('className="flex items-center justify-between mb-1.5"', 'className="flex items-center justify-between mb-1"');

fs.writeFileSync("src/pages/KupaPage.tsx", kupa, "utf8");
console.log("[OK] KupaPage — compact design, all matches visible without scroll");
