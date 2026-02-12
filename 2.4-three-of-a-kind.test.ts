import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("2.4 - Three of a Kind Detection & Tie-Breaks", () => {
  describe("Three of a kind detection", () => {
    test("should detect three Aces", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    test("should detect three 2s", () => {
      const cards: Card[] = [
        card("2", "♣"),
        card("2", "♦"),
        card("2", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    test("should detect three of a kind with various kickers", () => {
      const cards: Card[] = [
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("5", "♠"),
        card("3", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    test("should not misclassify full house as three of a kind", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.THREE_OF_A_KIND);
      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should not misclassify four of a kind as three of a kind", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("9", "♦"),
        card("9", "♥"),
        card("9", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.THREE_OF_A_KIND);
      expect(hand.category).toBe(HandCategory.FOUR_OF_A_KIND);
    });
  });

  describe("Three of a kind comparison - triplet rank", () => {
    test("should recognize A-A-A beats K-K-K", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("A", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 5-5-5 beats 2-2-2", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("2", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 9-9-9 beats 8-8-8", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("9", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Three of a kind comparison - kicker tie-breaks (descending order)", () => {
    test("should compare highest kicker when triplet is equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-A-A-K-Q beats A-A-A-K-J", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should compare second kicker when first kicker is equal", () => {
      const hand1 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("A", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 5-5-5-A-K beats 5-5-5-A-J", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("A", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when triplet and both kickers are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("A", "♥"),
        card("A", "♦"),
        card("K", "♣"),
        card("Q", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should recognize 3-3-3-9-7 loses to 3-3-3-9-8", () => {
      const hand1 = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("3", "♥"),
        card("9", "♠"),
        card("7", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("3", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize 6-6-6-J-8 beats 6-6-6-J-7", () => {
      const hand1 = evaluateHand([
        card("6", "♣"),
        card("6", "♦"),
        card("6", "♥"),
        card("J", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("6", "♣"),
        card("6", "♦"),
        card("6", "♥"),
        card("J", "♠"),
        card("7", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Three of a kind comparison - complex scenarios", () => {
    test("should recognize K-K-K-A-J beats Q-Q-Q-A-K", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("A", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("Q", "♣"),
        card("Q", "♦"),
        card("Q", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 8-8-8-K-Q loses to 8-8-8-K-A", () => {
      const hand1 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });
  });
});
