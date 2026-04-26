import { describe, test, expect } from "vitest";
import { equalShare, manualShare, timeShare, calcSettlements } from "./calc";

describe("equalShare", () => {
  test("divides total by people count", () => {
    expect(equalShare(48, 4)).toBe(12);
    expect(equalShare(100, 2)).toBe(50);
  });

  test("returns 0 when there are no people", () => {
    expect(equalShare(48, 0)).toBe(0);
  });
});

describe("manualShare", () => {
  test("applies a percentage", () => {
    expect(manualShare(100, 25)).toBe(25);
    expect(manualShare(100, 50)).toBe(50);
    expect(manualShare(100, 100)).toBe(100);
  });

  test("treats blank or undefined percent as 0", () => {
    expect(manualShare(100, "")).toBe(0);
    expect(manualShare(100, undefined)).toBe(0);
    expect(manualShare(100, null)).toBe(0);
  });

  test("happily computes over-100% (UI surfaces the warning)", () => {
    expect(manualShare(100, 120)).toBe(120);
  });
});

describe("timeShare", () => {
  test("returns 0 when no person-minutes are recorded yet", () => {
    expect(timeShare(48, 90, 0)).toBe(0);
  });

  test("solo player pays the full booking cost regardless of time used", () => {
    // one player only — sum of everyone's minutes is just their own
    expect(timeShare(48, 60, 60)).toBeCloseTo(48);
    expect(timeShare(48, 30, 30)).toBeCloseTo(48);
  });

  test("two players split in proportion to time", () => {
    // total play-time = 90; A 60, B 30 → A pays 2/3, B pays 1/3
    expect(timeShare(60, 60, 90)).toBeCloseTo(40);
    expect(timeShare(60, 30, 90)).toBeCloseTo(20);
  });

  test("regression: shares sum to total even when participants overlap", () => {
    // The bug fix: with bookingDuration as denominator, this summed to £152.
    // The correct denominator is the sum of every person's minutes (here, 285).
    const total = 48;
    const players = [
      { minutes: 90 },
      { minutes: 90 },
      { minutes: 60 },
      { minutes: 45 },
    ];
    const totalMins = players.reduce((s, p) => s + p.minutes, 0);
    const sum = players.reduce(
      (s, p) => s + timeShare(total, p.minutes, totalMins),
      0,
    );
    expect(sum).toBeCloseTo(48, 5);
  });
});

describe("calcSettlements", () => {
  test("returns no transfers when everyone is balanced", () => {
    const people = [{ name: "A" }, { name: "B" }];
    expect(calcSettlements(people, () => 0)).toEqual([]);
  });

  test("one debtor, one creditor → one transfer", () => {
    const people = [
      { name: "A", bal: -10 },
      { name: "B", bal:  10 },
    ];
    const transfers = calcSettlements(people, p => p.bal);
    expect(transfers).toHaveLength(1);
    expect(transfers[0]).toEqual({ from: "B", to: "A", amount: 10 });
  });

  test("sample data: 3 debtors all settle with the lone creditor", () => {
    const people = [
      { name: "Alice", bal: -32.84 },
      { name: "Bob",   bal:  15.16 },
      { name: "Cara",  bal:  10.11 },
      { name: "Dom",   bal:   7.58 },
    ];
    const transfers = calcSettlements(people, p => p.bal);
    expect(transfers).toHaveLength(3);
    expect(transfers.every(t => t.to === "Alice")).toBe(true);

    // total transferred ≈ what Alice is owed back (sum of debtor balances)
    const totalTransferred = transfers.reduce((s, t) => s + t.amount, 0);
    expect(totalTransferred).toBeCloseTo(32.85, 1);
  });

  test("minimises transactions: 2 debtors + 1 creditor = 2 transfers (not 3)", () => {
    const people = [
      { name: "A", bal: -30 },
      { name: "B", bal: -20 },
      { name: "C", bal:  50 },
    ];
    const transfers = calcSettlements(people, p => p.bal);
    expect(transfers).toHaveLength(2);
  });

  test("ignores tiny floating-point dust below the 0.005 threshold", () => {
    const people = [
      { name: "A", bal: -0.001 },
      { name: "B", bal:  0.001 },
    ];
    expect(calcSettlements(people, p => p.bal)).toEqual([]);
  });

  test("matches the largest debt to the largest credit first", () => {
    const people = [
      { name: "Big",    bal: -100 },
      { name: "Small",  bal:  -10 },
      { name: "Whale",  bal:   80 },
      { name: "Minnow", bal:   30 },
    ];
    const transfers = calcSettlements(people, p => p.bal);
    // greedy: Big ↔ Whale (£80) first, then Big's remaining £20 → Minnow,
    // then Small's £10 → Minnow's remaining £10
    expect(transfers).toHaveLength(3);
    expect(transfers[0]).toMatchObject({ from: "Whale",  to: "Big",   amount: 80 });
    expect(transfers[1]).toMatchObject({ from: "Minnow", to: "Big",   amount: 20 });
    expect(transfers[2]).toMatchObject({ from: "Minnow", to: "Small", amount: 10 });
  });
});
