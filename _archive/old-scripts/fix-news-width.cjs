const fs = require("fs");
let s = fs.readFileSync("src/components/LandingNews.tsx", "utf8");

// 1) Increase height from 260px to 380px
s = s.replace("height: '260px'", "height: '380px'");

// 2) Remove side padding on section to make it full-width
s = s.replace(
  'className="px-4 pt-6 pb-2 bg-[#F1F5F9]"',
  'className="px-4 pt-6 pb-4 bg-[#F1F5F9]"'
);

// 3) Make title bigger
s = s.replace(
  'className="text-xl font-bold text-white leading-tight mb-1"',
  'className="text-2xl md:text-3xl font-black text-white leading-tight mb-2"'
);

// 4) Make description bigger
s = s.replace(
  'className="text-sm text-white/70 line-clamp-2"',
  'className="text-sm md:text-base text-white/70 line-clamp-2"'
);

// 5) More padding on content area
s = s.replace(
  'className="absolute bottom-0 left-0 right-0 p-6"',
  'className="absolute bottom-0 left-0 right-0 p-6 md:p-8"'
);

// 6) Make arrows bigger
s = s.replace(
  /w-9 h-9 rounded-full bg-black\/30/g,
  'w-10 h-10 rounded-full bg-black/30'
);

// 7) Better shadow
s = s.replace(
  'className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg"',
  'className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl"'
);

fs.writeFileSync("src/components/LandingNews.tsx", s, "utf8");
console.log("[OK] LandingNews slideshow — taller (380px), bigger text, better spacing");
