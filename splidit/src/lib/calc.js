// ════════════════════════════════════════════════════════════════
//  SplidIt — pure math
//
//  Pure, side-effect-free splitting and settlement helpers. Kept
//  here (rather than inline in App.jsx) so they can be unit-tested
//  in isolation — no React, no DOM, no animation library.
// ════════════════════════════════════════════════════════════════

/** Equal split: each person owes total ÷ count. */
export const equalShare = (total, count) =>
  count > 0 ? total / count : 0;

/** Custom %: each person owes total × (percent / 100). */
export const manualShare = (total, percent) =>
  (total * (Number(percent) || 0)) / 100;

/**
 * Time-based: each person owes a slice of the total cost in
 * proportion to *their share of the total play-time*. The booking
 * duration is NOT the denominator — multiple players can overlap,
 * so dividing by the session length over-counts.
 *
 *   share = total × (minutes ÷ Σ everyone's minutes)
 */
export const timeShare = (total, minutes, totalPersonMinutes) =>
  totalPersonMinutes > 0
    ? (total * (Number(minutes) || 0)) / totalPersonMinutes
    : 0;

/**
 * Greedy minimum-transactions settlement.
 *
 * For each iteration, match the largest remaining debtor to the
 * largest remaining creditor and settle the overlap. Continues
 * until everyone is square. Produces ≤ N−1 transfers for N people,
 * the theoretical lower bound when no constraints prefer specific
 * pairings.
 *
 * @param people       Array of person-shaped objects (only used for `name`).
 * @param getOwes      Function mapping a person → number; positive means
 *                     they owe, negative means they're owed money back.
 * @returns Array of `{ from, to, amount }` transfer objects.
 */
export function calcSettlements(people, getOwes) {
  const debtors = people
    .map(p => ({ name: p.name, bal: getOwes(p) }))
    .filter(p => p.bal > 0.005)
    .map(p => ({ ...p }))
    .sort((a, b) => b.bal - a.bal);
  const creditors = people
    .map(p => ({ name: p.name, bal: -getOwes(p) }))
    .filter(p => p.bal > 0.005)
    .map(p => ({ ...p }))
    .sort((a, b) => b.bal - a.bal);

  const result = [];
  let ci = 0, di = 0;
  while (di < debtors.length && ci < creditors.length) {
    const amt = Math.min(debtors[di].bal, creditors[ci].bal);
    if (amt > 0.005) {
      result.push({ from: debtors[di].name, to: creditors[ci].name, amount: amt });
    }
    debtors[di].bal   -= amt;
    creditors[ci].bal -= amt;
    if (debtors[di].bal   < 0.005) di++;
    if (creditors[ci].bal < 0.005) ci++;
  }
  return result;
}
