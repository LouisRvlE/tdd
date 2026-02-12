import { Card, HandCategory } from "./types";
import { evaluateHand } from "./main";
import { card } from "./testHelpers";

describe("3.2 - Hand Detection for All Categories", () => {
  describe("All 9 categories detected correctly", () => {
    test("should detect STRAIGHT_FLUSH", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand.category).toBe(8);
    });

    test("should detect FOUR_OF_A_KIND", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.FOUR_OF_A_KIND);
      expect(hand.category).toBe(7);
    });

    test("should detect FULL_HOUSE", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand.category).toBe(6);
    });

    test("should detect FLUSH", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.FLUSH);
      expect(hand.category).toBe(5);
    });

    test("should detect STRAIGHT", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(4);
    });

    test("should detect THREE_OF_A_KIND", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
      expect(hand.category).toBe(3);
    });

    test("should detect TWO_PAIR", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
      expect(hand.category).toBe(2);
    });

    test("should detect ONE_PAIR", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.ONE_PAIR);
      expect(hand.category).toBe(1);
    });

    test("should detect HIGH_CARD", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
      expect(hand.category).toBe(0);
    });
  });

  describe("Category hierarchy validation", () => {
    test("STRAIGHT_FLUSH should rank higher than FOUR_OF_A_KIND", () => {
      expect(HandCategory.STRAIGHT_FLUSH).toBeGreaterThan(
        HandCategory.FOUR_OF_A_KIND,
      );
    });

    test("FOUR_OF_A_KIND should rank higher than FULL_HOUSE", () => {
      expect(HandCategory.FOUR_OF_A_KIND).toBeGreaterThan(
        HandCategory.FULL_HOUSE,
      );
    });

    test("FULL_HOUSE should rank higher than FLUSH", () => {
      expect(HandCategory.FULL_HOUSE).toBeGreaterThan(HandCategory.FLUSH);
    });

    test("FLUSH should rank higher than STRAIGHT", () => {
      expect(HandCategory.FLUSH).toBeGreaterThan(HandCategory.STRAIGHT);
    });

    test("STRAIGHT should rank higher than THREE_OF_A_KIND", () => {
      expect(HandCategory.STRAIGHT).toBeGreaterThan(
        HandCategory.THREE_OF_A_KIND,
      );
    });

    test("THREE_OF_A_KIND should rank higher than TWO_PAIR", () => {
      expect(HandCategory.THREE_OF_A_KIND).toBeGreaterThan(
        HandCategory.TWO_PAIR,
      );
    });

    test("TWO_PAIR should rank higher than ONE_PAIR", () => {
      expect(HandCategory.TWO_PAIR).toBeGreaterThan(HandCategory.ONE_PAIR);
    });

    test("ONE_PAIR should rank higher than HIGH_CARD", () => {
      expect(HandCategory.ONE_PAIR).toBeGreaterThan(HandCategory.HIGH_CARD);
    });
  });

  describe("Hand interface contract", () => {
    test("should return Hand with category, tieBreakValues, and cards", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      expect(hand).toHaveProperty("category");
      expect(hand).toHaveProperty("tieBreakValues");
      expect(hand).toHaveProperty("cards");
    });

    test("should include all 5 evaluated cards", () => {
      const cards = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.cards).toHaveLength(5);
      expect(hand.cards).toEqual(cards);
    });

    test("tieBreakValues should be array of RankValues", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(Array.isArray(hand.tieBreakValues)).toBe(true);
      expect(hand.tieBreakValues.length).toBeGreaterThan(0);
      hand.tieBreakValues.forEach((val) => {
        expect(typeof val).toBe("number");
        expect(val).toBeGreaterThanOrEqual(2);
        expect(val).toBeLessThanOrEqual(14);
      });
    });

    test("straight flush should have 1 tieBreakValue", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
      ]);

      expect(hand.tieBreakValues).toHaveLength(1);
    });

    test("four of a kind should have 2 tieBreakValues", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      expect(hand.tieBreakValues).toHaveLength(2);
    });

    test("full house should have 2 tieBreakValues", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
      ]);

      expect(hand.tieBreakValues).toHaveLength(2);
    });

    test("flush should have 5 tieBreakValues", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ]);

      expect(hand.tieBreakValues).toHaveLength(5);
    });

    test("high card should have 5 tieBreakValues", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(hand.tieBreakValues).toHaveLength(5);
    });
  });

  describe("Pattern detection helper functions work", () => {
    test("should extract correct tieBreakValues for pair", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      expect(hand.tieBreakValues[0]).toBe(14);
      expect(hand.tieBreakValues).toContain(13);
      expect(hand.tieBreakValues).toContain(12);
      expect(hand.tieBreakValues).toContain(11);
    });

    test("should extract correct tieBreakValues for two pair", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(hand.tieBreakValues[0]).toBe(14);
      expect(hand.tieBreakValues[1]).toBe(13);
      expect(hand.tieBreakValues[2]).toBe(12);
    });

    test("should extract correct tieBreakValues for three of a kind", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(hand.tieBreakValues[0]).toBe(14);
      expect(hand.tieBreakValues[1]).toBe(13);
      expect(hand.tieBreakValues[2]).toBe(12);
    });

    test("should handle wheel straight correctly", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("2", "♦"),
        card("3", "♥"),
        card("4", "♠"),
        card("5", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(5);
    });

    test("should handle Ace-high straight correctly", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(14);
    });
  });
});
