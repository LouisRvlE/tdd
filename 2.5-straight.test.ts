import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("2.5 - Straight Detection (All Types)", () => {
  describe("Straight detection - regular straights", () => {
    test("should detect A-K-Q-J-10 straight", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should detect 9-8-7-6-5 straight", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should detect K-Q-J-10-9 straight", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should detect 5-4-3-2-A as wheel (Ace-low straight)", () => {
      const cards: Card[] = [
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });
  });

  describe("Straight detection - Ace-high vs Ace-low", () => {
    test("should detect Ace-high straight (10-J-Q-K-A)", () => {
      const cards: Card[] = [
        card("10", "♣"),
        card("J", "♦"),
        card("Q", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should recognize Ace-high straight is highest", () => {
      const aceHigh = evaluateHand([
        card("10", "♣"),
        card("J", "♦"),
        card("Q", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ]);

      const wheel = evaluateHand([
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(aceHigh, wheel)).toBe(1);
    });
  });

  describe("Straight detection - not confused with other patterns", () => {
    test("should not misclassify as straight when pair exists", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("J", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.ONE_PAIR);
    });

    test("should not misclassify as straight when flush exists", () => {
      const cards: Card[] = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect straight flush over flush", () => {
      const cards: Card[] = [
        card("10", "♣"),
        card("J", "♣"),
        card("Q", "♣"),
        card("K", "♣"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
    });
  });

  describe("Straight comparison", () => {
    test("should recognize A-K-Q-J-10 beats K-Q-J-10-9", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 9-8-7-6-5 beats wheel (5-4-3-2-A)", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("5", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize wheel (A-2-3-4-5) beats nothing", () => {
      const wheel = evaluateHand([
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ]);

      const sixHigh = evaluateHand([
        card("6", "♣"),
        card("5", "♦"),
        card("4", "♥"),
        card("3", "♠"),
        card("2", "♣"),
      ]);

      expect(compareHands(wheel, sixHigh)).toBe(-1);
    });

    test("should recognize tie when straights are identical", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });

  describe("Invalid straights", () => {
    test("should not detect Q-K-A-2-3 as straight (no wraparound)", () => {
      const cards: Card[] = [
        card("Q", "♣"),
        card("K", "♦"),
        card("A", "♥"),
        card("2", "♠"),
        card("3", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });
  });
});
