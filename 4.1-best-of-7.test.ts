import { Card, HandCategory } from "./types";
import { evaluateHand, findBestHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("4.1 - Best-of-7 Selection", () => {
  describe("Combination generation (21 combinations from 7 cards)", () => {
    test("should find best hand when one combination is clearly superior", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♦"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(best.cards.length).toBe(5);
    });

    test("should find best hand from high card hand when no pairs available", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.HIGH_CARD);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should select one pair over high card when available", () => {
      const sevenCards = [
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.ONE_PAIR);
      expect(best.tieBreakValues[0]).toBe(13);
    });

    test("should select two pair when available over one pair", () => {
      const sevenCards = [
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
        card("J", "♦"),
        card("9", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should select three of a kind over two pair", () => {
      const sevenCards = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
        card("J", "♦"),
        card("9", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.THREE_OF_A_KIND);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should select straight over three of a kind", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("A", "♦"),
        card("A", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should select flush over straight", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
        card("10", "♦"),
        card("8", "♦"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FLUSH);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should select full house over flush", () => {
      const sevenCards = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("Q", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should select four of a kind over full house", () => {
      const sevenCards = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FOUR_OF_A_KIND);
    });

    test("should select straight flush over four of a kind", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
        card("9", "♦"),
        card("8", "♦"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT_FLUSH);
    });
  });

  describe("Tie-breaking within same category", () => {
    test("should select higher pair when multiple one-pair options exist", () => {
      const sevenCards = [
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
        card("J", "♦"),
        card("9", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.TWO_PAIR);
      expect(best.cards.some((c) => c.rank === "A")).toBe(true);
      expect(best.cards.some((c) => c.rank === "K")).toBe(true);
    });

    test("should select highest flush when multiple flush options exist", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
        card("8", "♣"),
        card("2", "♦"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FLUSH);
      expect(best.tieBreakValues[0]).toBe(14);
      const flushCards = best.cards.filter((c) => c.suit === "♣");
      expect(flushCards.length).toBe(5);
    });

    test("should select best three of a kind when four of a kind not possible", () => {
      const sevenCards = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("Q", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FULL_HOUSE);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should select highest straight when wheel and higher straight possible", () => {
      const sevenCards = [
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      expect(best.tieBreakValues[0]).toBe(5);
    });
  });

  describe("Complex scenarios with overlapping hand types", () => {
    test("should prioritize full house over one pair when both exist", () => {
      const sevenCards = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should find best hand when board has flush over player pair", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
        card("10", "♦"),
        card("10", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FLUSH);
      expect(best.cards.every((c) => c.suit === "♣")).toBe(true);
    });

    test("should choose ace-high straight over ace-low wheel", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("5", "♦"),
        card("4", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should handle 7-card hand with duplicate ranks correctly", () => {
      const sevenCards = [
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
        card("J", "♦"),
        card("10", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should find best hand when board play is only option", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      expect(best.cards.length).toBe(5);
    });
  });

  describe("Return value structure", () => {
    test("should return hand with category, tieBreakValues, and cards", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best).toHaveProperty("category");
      expect(best).toHaveProperty("tieBreakValues");
      expect(best).toHaveProperty("cards");
      expect(Array.isArray(best.tieBreakValues)).toBe(true);
      expect(Array.isArray(best.cards)).toBe(true);
      expect(best.cards.length).toBe(5);
    });

    test("should return exactly 5 cards", () => {
      const sevenCards = [
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("9", "♦"),
        card("8", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.cards.length).toBe(5);
    });
  });

  describe("Deterministic selection for ties", () => {
    test("should return same result on multiple calls for same 7 cards", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♥"),
      ];

      const best1 = findBestHand(sevenCards);
      const best2 = findBestHand(sevenCards);

      expect(best1.category).toBe(best2.category);
      expect(best1.tieBreakValues).toEqual(best2.tieBreakValues);
    });

    test("should handle multiple equally strong pairs consistently", () => {
      const sevenCards = [
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
        card("J", "♦"),
        card("10", "♥"),
      ];

      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.TWO_PAIR);
      expect(best.cards.length).toBe(5);
    });
  });
});
