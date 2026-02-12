import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("2.8 - Four of a Kind Detection & Tie-Breaks", () => {
  describe("Four of a kind detection", () => {
    test("should detect four Aces", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FOUR_OF_A_KIND);
    });

    test("should detect four 2s", () => {
      const cards: Card[] = [
        card("2", "♣"),
        card("2", "♦"),
        card("2", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FOUR_OF_A_KIND);
    });

    test("should detect four 7s with various kicker", () => {
      const cards: Card[] = [
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("7", "♠"),
        card("3", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FOUR_OF_A_KIND);
    });

    test("should not misclassify three of a kind as four of a kind", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.FOUR_OF_A_KIND);
      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    test("should not misclassify full house as four of a kind", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.FOUR_OF_A_KIND);
      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
    });
  });

  describe("Four of a kind comparison - quad rank", () => {
    test("should recognize A-A-A-A-K beats K-K-K-K-A", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 9-9-9-9-A beats 8-8-8-8-K", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("9", "♥"),
        card("9", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("8", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 5-5-5-5-3 beats 4-4-4-4-A", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("5", "♠"),
        card("3", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("4", "♣"),
        card("4", "♦"),
        card("4", "♥"),
        card("4", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Four of a kind comparison - kicker (when quads equal)", () => {
    test("should recognize A-A-A-A-K beats A-A-A-A-Q", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 7-7-7-7-A beats 7-7-7-7-K", () => {
      const hand1 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("7", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("7", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 3-3-3-3-J beats 3-3-3-3-9", () => {
      const hand1 = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("3", "♥"),
        card("3", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("3", "♥"),
        card("3", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Four of a kind comparison - tie scenarios", () => {
    test("should recognize tie when quads and kicker are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("A", "♥"),
        card("A", "♦"),
        card("A", "♣"),
        card("K", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should recognize tie: 6-6-6-6-2 vs 6-6-6-6-2 (different suits)", () => {
      const hand1 = evaluateHand([
        card("6", "♣"),
        card("6", "♦"),
        card("6", "♥"),
        card("6", "♠"),
        card("2", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("6", "♠"),
        card("6", "♥"),
        card("6", "♦"),
        card("6", "♣"),
        card("2", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });

  describe("Four of a kind comparison - complex scenarios", () => {
    test("should recognize Q-Q-Q-Q-J loses to K-K-K-K-2", () => {
      const hand1 = evaluateHand([
        card("Q", "♣"),
        card("Q", "♦"),
        card("Q", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("2", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize 8-8-8-8-5 loses to 8-8-8-8-6", () => {
      const hand1 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("8", "♠"),
        card("5", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("8", "♠"),
        card("6", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });
  });
});
