// ============================================================
// Sistemi i kartonave & pezullimeve (spec #31 "CARD & SUSPENSION
// SYSTEM"). Rregullat konfigurohen nga Admin Paneli (AppSettings
// .suspensionRules) — NUK jane hard-coded ketu, siç kerkon
// specifikimi ("Mos hard-code rregullat ne frontend").
// ============================================================

import { PlayerStats, AppSettings } from '@/types';

export interface SuspensionRules {
  /** Sa karton te verdhe te akumuluar shkaktojne 1 ndeshje pezullim. */
  yellowThreshold: number;
  /** Sa ndeshje pezullohet lojtari pasi arrin pragun e te verdheve. */
  yellowSuspensionMatches: number;
  /** Sa ndeshje pezullohet lojtari automatikisht per 1 karton te kuq. */
  redSuspensionMatches: number;
}

export const DEFAULT_SUSPENSION_RULES: SuspensionRules = {
  yellowThreshold: 3,
  yellowSuspensionMatches: 1,
  redSuspensionMatches: 1,
};

export function getSuspensionRules(settings?: AppSettings | null): SuspensionRules {
  const configured = (settings as any)?.suspensionRules;
  return {
    yellowThreshold: configured?.yellowThreshold ?? DEFAULT_SUSPENSION_RULES.yellowThreshold,
    yellowSuspensionMatches: configured?.yellowSuspensionMatches ?? DEFAULT_SUSPENSION_RULES.yellowSuspensionMatches,
    redSuspensionMatches: configured?.redSuspensionMatches ?? DEFAULT_SUSPENSION_RULES.redSuspensionMatches,
  };
}

export interface PlayerCardTotals {
  yellowCards: number;
  redCards: number;
}

export function getPlayerCardTotals(stats: PlayerStats[], playerId: string): PlayerCardTotals {
  return stats
    .filter(s => s.playerId === playerId)
    .reduce(
      (acc, s) => ({
        yellowCards: acc.yellowCards + (s.yellowCards || 0),
        redCards: acc.redCards + (s.redCards || 0),
      }),
      { yellowCards: 0, redCards: 0 }
    );
}

export interface SuspensionStatus {
  suspended: boolean;
  matchesRemaining: number;
  reason: string;
}

/**
 * Llogarit statusin e pezullimit per nje lojtar bazuar ne totalin e
 * kartonave dhe rregullat e konfiguruara. Kjo eshte NJE PERAFRIM
 * transparent (bazuar ne akumulim total, jo ne "ndeshje te sherbyera",
 * pasi ky projekt aktualisht nuk ka nje fushe qe shenon ndeshjet e
 * sherbyera per pezullim). Duhet trajtuar si tregues, jo si vendim
 * final zyrtar i Komisionit.
 */
export function getSuspensionStatus(
  stats: PlayerStats[],
  playerId: string,
  rules: SuspensionRules
): SuspensionStatus {
  const { yellowCards, redCards } = getPlayerCardTotals(stats, playerId);

  if (redCards > 0) {
    return {
      suspended: true,
      matchesRemaining: rules.redSuspensionMatches,
      reason: `Karton i kuq (${redCards})`,
    };
  }

  if (rules.yellowThreshold > 0 && yellowCards >= rules.yellowThreshold) {
    const timesOverThreshold = Math.floor(yellowCards / rules.yellowThreshold);
    return {
      suspended: true,
      matchesRemaining: timesOverThreshold * rules.yellowSuspensionMatches,
      reason: `${yellowCards} karton te verdhe (prag: ${rules.yellowThreshold})`,
    };
  }

  return { suspended: false, matchesRemaining: 0, reason: '' };
}
