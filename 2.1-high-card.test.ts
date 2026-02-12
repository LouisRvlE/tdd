import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("2.1 - High Card Detection & Comparison", () => {
  describe("High card detection", () => {
    test("should detect a high card hand (no pairs, straight, or flush)", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });

    test("should not misclassify a pair as high card", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.HIGH_CARD);
      expect(hand.category).toBe(HandCategory.ONE_PAIR);
    });

    test("should not misclassify a straight as high card", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.HIGH_CARD);
      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should not misclassify a flush as high card", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.HIGH_CARD);
      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect high card with low ranks", () => {
      const cards: Card[] = [
        card("7", "♣"),
        card("5", "♦"),
        card("4", "♥"),
        card("3", "♠"),
        card("2", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });
  });

  describe("High card comparison (descending order)", () => {
    test("should recognize A-K-Q-J-9 beats A-K-Q-J-8", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("8", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-K-Q-J-8 loses to A-K-Q-J-9", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize K-Q-J-9-8 beats K-Q-J-9-7", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("9", "♠"),
        card("7", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when all cards are equal", () => {
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

    test("should compare second-highest card if highest is equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should compare third card when first two are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("J", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });
  });
});
