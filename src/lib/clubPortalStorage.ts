// ============================================================
// Ruajtja e "Protokollit Elektronik" dhe "Document Center".
// ------------------------------------------------------------
// Ndjek TE NJEJTIN pattern qe ky projekt perdor tashme per
// Officials dhe PlayerStats (localStorage ne shfletuesin e
// adminit/klubit) — shiko EditorPanel.tsx / AdminTeamsPlayers.tsx.
//
// E RENDESISHME (shiko komentin ne supabase-db.ts rreth ~52GB
// trafik/muaj qe shkaktoi foto base64 ne dokumentin e vetem
// MongoDB): DOKUMENTET (PDF, licenca, raporte) JANE ME TE MEDHA
// se fotot dhe NUK ruhen kurre si base64 ketu — vetem si LINK
// (url), njesoj si NormativeAct.pdfUrl. Kjo shmang perseritjen e
// te njejtit problem bandwidth-i.
// ============================================================

import { MatchSheet, ClubDocument } from '@/types';

const MATCH_SHEETS_KEY = 'ffk_match_sheets';
const CLUB_DOCUMENTS_KEY = 'ffk_club_documents';

export function loadMatchSheets(): MatchSheet[] {
  try {
    const s = localStorage.getItem(MATCH_SHEETS_KEY);
    if (s) return JSON.parse(s);
  } catch (e) {}
  return [];
}

export function saveMatchSheets(list: MatchSheet[]) {
  try { localStorage.setItem(MATCH_SHEETS_KEY, JSON.stringify(list)); } catch (e) {}
}

export function upsertMatchSheet(sheet: MatchSheet): MatchSheet[] {
  const list = loadMatchSheets();
  const idx = list.findIndex(s => s.matchId === sheet.matchId && s.teamId === sheet.teamId);
  const updated = idx === -1 ? [...list, sheet] : list.map((s, i) => (i === idx ? sheet : s));
  saveMatchSheets(updated);
  return updated;
}

export function getMatchSheet(matchId: string, teamId: string): MatchSheet | undefined {
  return loadMatchSheets().find(s => s.matchId === matchId && s.teamId === teamId);
}

export function loadClubDocuments(): ClubDocument[] {
  try {
    const s = localStorage.getItem(CLUB_DOCUMENTS_KEY);
    if (s) return JSON.parse(s);
  } catch (e) {}
  return [];
}

export function saveClubDocuments(list: ClubDocument[]) {
  try { localStorage.setItem(CLUB_DOCUMENTS_KEY, JSON.stringify(list)); } catch (e) {}
}

export function getDocumentsForTeam(teamId: string): ClubDocument[] {
  return loadClubDocuments()
    .filter(d => d.teamId === teamId || d.teamId === 'all' || d.teamId === '')
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}
