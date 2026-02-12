import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("2.6 - Flush Detection & Comparison", () => {
  describe("Flush detection", () => {
    test("should detect flush (5 hearts)", () => {
      const cards: Card[] = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect flush (5 clubs)", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("10", "♣"),
        card("8", "♣"),
        card("5", "♣"),
        card("2", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect flush (5 diamonds)", () => {
      const cards: Card[] = [
        card("K", "♦"),
        card("J", "♦"),
        card("9", "♦"),
        card("7", "♦"),
        card("3", "♦"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect flush (5 spades)", () => {
      const cards: Card[] = [
        card("Q", "♠"),
        card("10", "♠"),
        card("8", "♠"),
        card("6", "♠"),
        card("4", "♠"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should not misclassify as flush when only 4 cards match suit", () => {
      const cards: Card[] = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.FLUSH);
      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });
  });

  describe("Flush comparison - descending rank order", () => {
    test("should recognize A-K-Q-J-9 flush beats A-K-Q-J-8 flush", () => {
      const hand1 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("8", "♥"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-K-Q-J-10 flush beats K-Q-J-10-9 flush", () => {
      const hand1 = evaluateHand([
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("10", "♠"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("10", "♥"),
        card("9", "♥"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when flush cards are identical", () => {
      const hand1 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should compare second highest when first is equal", () => {
      const hand1 = evaluateHand([
        card("A", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
        card("8", "♥"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("J", "♥"),
        card("9", "♥"),
        card("8", "♥"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize A-K-Q-10-9 beats A-K-Q-10-8", () => {
      const hand1 = evaluateHand([
        card("A", "♦"),
        card("K", "♦"),
        card("Q", "♦"),
        card("10", "♦"),
        card("9", "♦"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♦"),
        card("K", "♦"),
        card("Q", "♦"),
        card("10", "♦"),
        card("8", "♦"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-J-9-7-5 beats A-J-9-7-4", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("J", "♣"),
        card("9", "♣"),
        card("7", "♣"),
        card("5", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("J", "♣"),
        card("9", "♣"),
        card("7", "♣"),
        card("4", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Flush vs other patterns", () => {
    test("should recognize flush beats straight", () => {
      const flush = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      const straight = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♠"),
        card("J", "♥"),
        card("10", "♣"),
      ]);

      expect(compareHands(flush, straight)).toBe(1);
    });

    test("should recognize straight flush beats flush", () => {
      const straightFlush = evaluateHand([
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("10", "♠"),
      ]);

      const flush = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      expect(compareHands(straightFlush, flush)).toBe(1);
    });
  });

  describe("Complex flush scenarios", () => {
    test("should recognize K-J-9-7-5 flush beats K-J-9-7-4 flush", () => {
      const hand1 = evaluateHand([
        card("K", "♠"),
        card("J", "♠"),
        card("9", "♠"),
        card("7", "♠"),
        card("5", "♠"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♠"),
        card("J", "♠"),
        card("9", "♠"),
        card("7", "♠"),
        card("4", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize Q-10-8-6-2 loses to Q-10-8-6-3", () => {
      const hand1 = evaluateHand([
        card("Q", "♦"),
        card("10", "♦"),
        card("8", "♦"),
        card("6", "♦"),
        card("2", "♦"),
      ]);

      const hand2 = evaluateHand([
        card("Q", "♦"),
        card("10", "♦"),
        card("8", "♦"),
        card("6", "♦"),
        card("3", "♦"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });
  });
});
