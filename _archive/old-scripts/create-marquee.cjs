const fs = require("fs");

// 1) Create TeamMarquee component
const marquee = `import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';

const TeamMarquee: React.FC = () => {
  const { teams } = useData();

  const allTeams = (teams || []).filter((t: any) => t.logo);
  if (allTeams.length === 0) return null;

  // Double the array for seamless loop
  const doubled = [...allTeams, ...allTeams];

  return (
    <div className="bg-white border-t border-b border-gray-100 py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <h3 className="text-center text-sm font-black uppercase tracking-[0.2em] text-gray-400">Skuadrat</h3>
      </div>
      <div className="relative">
        <div className="flex animate-marquee gap-12 items-center" style={${String.fromCharCode(123)} width: 'max-content' ${String.fromCharCode(125)}}>
          {doubled.map((t: any, i: number) => (
            <Link
              key={t.id + '-' + i}
              to={'/skuadra/' + t.id}
              className="flex-shrink-0 group"
              title={t.name}
            >
              <img
                src={t.logo}
                alt={t.name}
                className="h-14 w-14 object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMarquee;
`;

fs.writeFileSync("src/components/TeamMarquee.tsx", marquee, "utf8");
console.log("[OK] TeamMarquee component created");

// 2) Add CSS animation to index.css
let css = fs.readFileSync("src/index.css", "utf8");
if (!css.includes("@keyframes marquee")) {
  css += `
/* Team Marquee Animation */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
`;
  fs.writeFileSync("src/index.css", css, "utf8");
  console.log("[OK] Marquee CSS animation added");
}

console.log("[DONE] TeamMarquee ready!");
