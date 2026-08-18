const fs = require("fs");

// =====================================================
// 1) Add types for NationalTeam
// =====================================================
let types = fs.readFileSync("src/types/index.ts", "utf8");
if (!types.includes("NationalTeamPlayer")) {
  types += `
export interface NationalTeamPlayer {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
  number?: number;
  photo?: string;
  birthDate?: string;
  club?: string;
  goals?: number;
  appearances?: number;
}

export interface NationalTeamMatch {
  id: string;
  opponent: string;
  opponentLogo?: string;
  date?: string;
  time?: string;
  venue?: string;
  type?: string; // 'friendly' | 'qualifier' | 'tournament'
  homeScore?: number;
  awayScore?: number;
  status?: string; // 'planned' | 'finished' | 'live'
  isHome?: boolean;
}

export interface NationalTeamStaff {
  id: string;
  name: string;
  role: string;
  photo?: string;
}
`;
  fs.writeFileSync("src/types/index.ts", types, "utf8");
  console.log("[OK] Types added: NationalTeamPlayer, NationalTeamMatch, NationalTeamStaff");
}

// =====================================================
// 2) Show supabase-db to see where to add
// =====================================================
let db = fs.readFileSync("src/lib/supabase-db.ts", "utf8");
const lines = db.split("\n");
console.log("supabase-db total lines: " + lines.length);
// Last 5 lines
console.log("Last lines:");
lines.slice(-5).forEach((l, i) => console.log(l.trimEnd()));
