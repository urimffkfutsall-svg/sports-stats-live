const fs = require("fs");
let s = fs.readFileSync("src/components/LandingMatches.tsx", "utf8");

// 1) Replace the tabs array definition — simplify, remove icon/activeColor/activeBg/activeShadow
s = s.replace(
  /const tabs:.*?\];/s,
  `const tabs: { key: TabType; label: string }[] = [
    { key: 'live', label: 'Live' },
    { key: 'finished', label: 'Te luajtura' },
    { key: 'upcoming', label: 'Te ardhshme' },
  ];`
);

// 2) Replace the entire tab buttons section
const oldTabSection = /\{\/\* Professional square tabs \*\/\}[\s\S]*?<\/div>\s*\n/;
const newTabSection = `{/* Tab buttons */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {tabs.map(t => {
            const isActive = activeTab === t.key;
            const isLiveTab = t.key === 'live';
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={\`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 \${
                  isActive
                    ? t.key === 'live'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                      : 'bg-[#0A1E3C] text-white shadow-lg'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }\`}
              >
                {isLiveTab && liveCount > 0 && (
                  <span className={\`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-black \${
                    isActive ? 'bg-white text-red-500' : 'bg-red-500 text-white'
                  }\`}>
                    {liveCount}
                  </span>
                )}
                {t.label}
                {isLiveTab && liveCount > 0 && isActive && (
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
`;

s = s.replace(oldTabSection, newTabSection);

fs.writeFileSync("src/components/LandingMatches.tsx", s, "utf8");
console.log("[OK] LandingMatches.tsx — tab buttons updated to match CompetitionPage style");
