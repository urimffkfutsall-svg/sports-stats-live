const fs = require("fs");

// New aggregate logic function
const newLogic = `  const getSeriesScore = (seriesId) => {
    const matches = allMatches.filter(m => m.seriesId === seriesId && m.status === 'finished').sort((a, b) => (a.matchNumber || 1) - (b.matchNumber || 1));
    const series = allSeries.find(s => s.id === seriesId);
    if (!series) return { t1Wins: 0, t2Wins: 0, t1Agg: 0, t2Agg: 0, decided: false, winnerId: null, needsGame3: false };
    
    let t1Agg = 0, t2Agg = 0;
    matches.forEach(m => {
      const hs = m.homeScore ?? 0, as_ = m.awayScore ?? 0;
      if (m.homeTeamId === series.team1Id) { t1Agg += hs; t2Agg += as_; }
      else { t2Agg += hs; t1Agg += as_; }
    });

    // After 2 matches check aggregate
    const game1 = matches.find(m => m.matchNumber === 1);
    const game2 = matches.find(m => m.matchNumber === 2);
    const game3 = matches.find(m => m.matchNumber === 3);
    
    let decided = false, winnerId = null, needsGame3 = false;
    
    if (game1 && game2 && !game3) {
      // Two matches played - check aggregate
      if (t1Agg > t2Agg) { decided = true; winnerId = series.team1Id; }
      else if (t2Agg > t1Agg) { decided = true; winnerId = series.team2Id; }
      else { needsGame3 = true; } // Aggregate tied, need game 3
    } else if (game3) {
      // Game 3 played - winner of game 3 goes through
      const g3hs = game3.homeScore ?? 0, g3as = game3.awayScore ?? 0;
      // Recalculate full aggregate with all 3 games
      if (t1Agg > t2Agg) { decided = true; winnerId = series.team1Id; }
      else if (t2Agg > t1Agg) { decided = true; winnerId = series.team2Id; }
    }

    return { t1Wins: 0, t2Wins: 0, t1Agg, t2Agg, decided, winnerId, needsGame3, matchesPlayed: matches.length };
  };`;

// 1) Update PlayoffPage
let pp = fs.readFileSync("src/pages/PlayoffPage.tsx", "utf8");

// Replace old getSeriesScore
pp = pp.replace(/  const getSeriesScore = \(seriesId\) => \{[\s\S]*?return \{ t1Wins[\s\S]*?\};[\s]*\};/m, newLogic);

// Update display: change t1Wins/t2Wins to t1Agg/t2Agg
pp = pp.replace(/score\.t1Wins > score\.t2Wins \? "text-green-600"/g, 'score.t1Agg > score.t2Agg ? "text-green-600"');
pp = pp.replace(/score\.t2Wins > score\.t1Wins \? "text-green-600"/g, 'score.t2Agg > score.t1Agg ? "text-green-600"');
pp = pp.replace(/score\.t1Wins/g, 'score.t1Agg');
pp = pp.replace(/score\.t2Wins/g, 'score.t2Agg');

// Update the subtitle text
pp = pp.replace(
  "Dy fitore per te kaluar",
  "Golaverazhi vendos"
);
pp = pp.replace(
  '<p className="text-[10px] text-gray-400 mt-1">Golaverazhi vendos</p>',
  '<p className="text-[10px] text-gray-400 mt-1">{score.needsGame3 ? "Barazim - Ndeshja 3 vendimtare" : "Golaverazhi"}</p>'
);

// Update "Kalon" text
pp = pp.replace(
  "Dy fitore per te kaluar</p>",
  "Golaverazhi vendos</p>"
);

fs.writeFileSync("src/pages/PlayoffPage.tsx", pp, "utf8");
console.log("[OK] PlayoffPage updated with aggregate logic");

// 2) Update AdminPlayoff
let ap = fs.readFileSync("src/pages/admin/AdminPlayoff.tsx", "utf8");

// Replace old getSeriesScore in admin
const adminNewLogic = newLogic.replace('(seriesId)', '(seriesId: string)');
ap = ap.replace(/  const getSeriesScore = \(seriesId: string\) => \{[\s\S]*?return \{ t1Wins[\s\S]*?\};[\s]*\};/m, adminNewLogic);

// Update admin display
ap = ap.replace(/score\.t1Wins > score\.t2Wins \? "text-green-600"/g, 'score.t1Agg > score.t2Agg ? "text-green-600"');
ap = ap.replace(/score\.t2Wins > score\.t1Wins \? "text-green-600"/g, 'score.t2Agg > score.t1Agg ? "text-green-600"');
ap = ap.replace(/score\.t1Wins/g, 'score.t1Agg');
ap = ap.replace(/score\.t2Wins/g, 'score.t2Agg');

fs.writeFileSync("src/pages/admin/AdminPlayoff.tsx", ap, "utf8");
console.log("[OK] AdminPlayoff updated with aggregate logic");

// Verify
const ppFinal = fs.readFileSync("src/pages/PlayoffPage.tsx", "utf8");
console.log("Has t1Agg: " + ppFinal.includes("t1Agg"));
console.log("Has needsGame3: " + ppFinal.includes("needsGame3"));
console.log("Has Golaverazhi: " + ppFinal.includes("Golaverazhi"));
