import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("3.3 - Cross-Category Hand Comparison", () => {
  describe("Category ranking (higher beats lower)", () => {
    test("STRAIGHT_FLUSH beats FOUR_OF_A_KIND", () => {
      const straightFlush = evaluateHand([
        card("9", "♣"),
        card("8", "♣"),
        card("7", "♣"),
        card("6", "♣"),
        card("5", "♣"),
      ]);

      const fourOfAKind = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(straightFlush, fourOfAKind)).toBe(1);
    });

    test("FOUR_OF_A_KIND beats FULL_HOUSE", () => {
      const fourOfAKind = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("2", "♣"),
      ]);

      const fullHouse = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(fourOfAKind, fullHouse)).toBe(1);
    });

    test("FULL_HOUSE beats FLUSH", () => {
      const fullHouse = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("5", "♣"),
      ]);

      const flush = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ]);

      expect(compareHands(fullHouse, flush)).toBe(1);
    });

    test("FLUSH beats STRAIGHT", () => {
      const flush = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ]);

      const straight = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      expect(compareHands(flush, straight)).toBe(1);
    });

    test("STRAIGHT beats THREE_OF_A_KIND", () => {
      const straight = evaluateHand([
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("5", "♣"),
      ]);

      const threeOfAKind = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(straight, threeOfAKind)).toBe(1);
    });

    test("THREE_OF_A_KIND beats TWO_PAIR", () => {
      const threeOfAKind = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("2", "♠"),
        card("3", "♣"),
      ]);

      const twoPair = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(threeOfAKind, twoPair)).toBe(1);
    });

    test("TWO_PAIR beats ONE_PAIR", () => {
      const twoPair = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("5", "♥"),
        card("5", "♠"),
        card("2", "♣"),
      ]);

      const onePair = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(twoPair, onePair)).toBe(1);
    });

    test("ONE_PAIR beats HIGH_CARD", () => {
      const onePair = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const highCard = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(onePair, highCard)).toBe(1);
    });
  });

  describe("Reversed comparisons", () => {
    test("FOUR_OF_A_KIND loses to STRAIGHT_FLUSH", () => {
      const fourOfAKind = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const straightFlush = evaluateHand([
        card("9", "♣"),
        card("8", "♣"),
        card("7", "♣"),
        card("6", "♣"),
        card("5", "♣"),
      ]);

      expect(compareHands(fourOfAKind, straightFlush)).toBe(-1);
    });

    test("FULL_HOUSE loses to FOUR_OF_A_KIND", () => {
      const fullHouse = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
      ]);

      const fourOfAKind = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("2", "♣"),
      ]);

      expect(compareHands(fullHouse, fourOfAKind)).toBe(-1);
    });

    test("FLUSH loses to FULL_HOUSE", () => {
      const flush = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ]);

      const fullHouse = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("5", "♣"),
      ]);

      expect(compareHands(flush, fullHouse)).toBe(-1);
    });

    test("HIGH_CARD loses to ONE_PAIR", () => {
      const highCard = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      const onePair = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(highCard, onePair)).toBe(-1);
    });
  });

  describe("compareHands return values", () => {
    test("should return 1 when hand1 > hand2", () => {
      const higher = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const lower = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(higher, lower)).toBe(1);
    });

    test("should return -1 when hand1 < hand2", () => {
      const lower = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      const higher = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(lower, higher)).toBe(-1);
    });

    test("should return 0 when hands are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("9", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });

  describe("Complex cross-category scenarios", () => {
    test("should correctly compare low flush vs high pair", () => {
      const lowFlush = evaluateHand([
        card("5", "♣"),
        card("4", "♣"),
        card("3", "♣"),
        card("2", "♣"),
        card("A", "♣"),
      ]);

      const highPair = evaluateHand([
        card("A", "♦"),
        card("A", "♠"),
        card("K", "♥"),
        card("Q", "♣"),
        card("J", "♠"),
      ]);

      expect(compareHands(lowFlush, highPair)).toBe(1);
    });

    test("should correctly compare wheel straight vs high flush", () => {
      const wheel = evaluateHand([
        card("A", "♣"),
        card("2", "♦"),
        card("3", "♥"),
        card("4", "♠"),
        card("5", "♣"),
      ]);

      const flush = evaluateHand([
        card("K", "♦"),
        card("J", "♦"),
        card("9", "♦"),
        card("7", "♦"),
        card("3", "♦"),
      ]);

      expect(compareHands(wheel, flush)).toBe(-1);
    });

    test("should correctly compare low full house vs ace-high straight", () => {
      const lowFullHouse = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("2", "♥"),
        card("3", "♠"),
        card("3", "♣"),
      ]);

      const aceHighStraight = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      expect(compareHands(lowFullHouse, aceHighStraight)).toBe(1);
    });

    test("should correctly compare highest pair vs lowest three of a kind", () => {
      const aaKingQueenJack = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      const twoTwoThreeK = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("2", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(aaKingQueenJack, twoTwoThreeK)).toBe(-1);
    });
  });

  describe("Comparison consistency across same categories", () => {
    test("should work consistently for pairs", () => {
      const aces = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      const kings = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("A", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(aces, kings)).toBe(1);
      expect(compareHands(kings, aces)).toBe(-1);
    });

    test("should work consistently for straights", () => {
      const aceHigh = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      const nineHigh = evaluateHand([
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("5", "♣"),
      ]);

      expect(compareHands(aceHigh, nineHigh)).toBe(1);
      expect(compareHands(nineHigh, aceHigh)).toBe(-1);
    });

    test("should work consistently for flushes", () => {
      const higher = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
      ]);

      const lower = evaluateHand([
        card("9", "♦"),
        card("8", "♦"),
        card("7", "♦"),
        card("6", "♦"),
        card("5", "♦"),
      ]);

      expect(compareHands(higher, lower)).toBe(1);
      expect(compareHands(lower, higher)).toBe(-1);
    });
  });
});
