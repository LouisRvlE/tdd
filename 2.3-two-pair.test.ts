import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("2.3 - Two Pair Detection & Tie-Breaks", () => {
  describe("Two pair detection", () => {
    test("should detect two pairs (Aces and Kings)", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should detect two pairs (low ranks)", () => {
      const cards: Card[] = [
        card("5", "♣"),
        card("5", "♦"),
        card("3", "♥"),
        card("3", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should detect two pairs with various kicker", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("9", "♦"),
        card("7", "♥"),
        card("7", "♠"),
        card("2", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should not misclassify full house as two pair", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.TWO_PAIR);
      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should not misclassify three of a kind as two pair", () => {
      const cards: Card[] = [
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.TWO_PAIR);
      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });
  });

  describe("Two pair comparison - higher pair rank", () => {
    test("should recognize A-A-K-K-Q beats A-A-J-J-K", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("J", "♥"),
        card("J", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize K-K-Q-Q-A beats K-K-J-J-A", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("Q", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("J", "♥"),
        card("J", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Two pair comparison - lower pair rank (when higher pair equal)", () => {
    test("should recognize A-A-K-K-Q beats A-A-K-K-J when higher pair equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 9-9-5-5-A beats 9-9-4-4-K", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("5", "♥"),
        card("5", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("4", "♥"),
        card("4", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Two pair comparison - kicker (when both pairs equal)", () => {
    test("should recognize A-A-K-K-Q beats A-A-K-K-J", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-A-K-K-9 beats A-A-K-K-8", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("9", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("8", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when both pairs and kicker are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("A", "♥"),
        card("K", "♦"),
        card("K", "♣"),
        card("Q", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should recognize 5-5-3-3-A beats 5-5-3-3-K", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("3", "♥"),
        card("3", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("3", "♥"),
        card("3", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Two pair comparison - complex scenarios", () => {
    test("should recognize K-K-Q-Q-A beats J-J-9-9-A", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("Q", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("J", "♣"),
        card("J", "♦"),
        card("9", "♥"),
        card("9", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 7-7-6-6-K beats 7-7-6-6-Q", () => {
      const hand1 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("6", "♥"),
        card("6", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("6", "♥"),
        card("6", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });
});
