import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("2.7 - Full House Detection & Tie-Breaks", () => {
  describe("Full house detection", () => {
    test("should detect full house (K-K-K-5-5)", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should detect full house (A-A-A-2-2)", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("2", "♠"),
        card("2", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should detect full house (9-9-9-3-3)", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("9", "♦"),
        card("9", "♥"),
        card("3", "♠"),
        card("3", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should not misclassify three of a kind as full house", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("3", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.FULL_HOUSE);
      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    test("should not misclassify two pair as full house", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("5", "♥"),
        card("5", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.FULL_HOUSE);
      expect(hand.category).toBe(HandCategory.TWO_PAIR);
    });
  });

  describe("Full house comparison - triplet rank", () => {
    test("should recognize A-A-A-K-K beats K-K-K-A-A", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("A", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize K-K-K-Q-Q beats Q-Q-Q-A-A", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("Q", "♣"),
        card("Q", "♦"),
        card("Q", "♥"),
        card("A", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 5-5-5-2-2 beats 4-4-4-A-A", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("2", "♠"),
        card("2", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("4", "♣"),
        card("4", "♦"),
        card("4", "♥"),
        card("A", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Full house comparison - pair rank (when triplet equal)", () => {
    test("should recognize K-K-K-A-A beats K-K-K-Q-Q", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("A", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 9-9-9-8-8 beats 9-9-9-7-7", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("9", "♥"),
        card("8", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("9", "♥"),
        card("7", "♠"),
        card("7", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 5-5-5-3-3 beats 5-5-5-2-2", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("3", "♠"),
        card("3", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("2", "♠"),
        card("2", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Full house comparison - tie scenarios", () => {
    test("should recognize tie when triplet and pair ranks are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("A", "♥"),
        card("A", "♦"),
        card("K", "♦"),
        card("K", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should recognize tie: 7-7-7-4-4 vs 7-7-7-4-4 (different suits)", () => {
      const hand1 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("4", "♠"),
        card("4", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("7", "♠"),
        card("7", "♥"),
        card("7", "♦"),
        card("4", "♦"),
        card("4", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });

  describe("Full house comparison - complex scenarios", () => {
    test("should recognize Q-Q-Q-J-J loses to K-K-K-2-2", () => {
      const hand1 = evaluateHand([
        card("Q", "♣"),
        card("Q", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("2", "♠"),
        card("2", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize 6-6-6-9-9 beats 6-6-6-8-8", () => {
      const hand1 = evaluateHand([
        card("6", "♣"),
        card("6", "♦"),
        card("6", "♥"),
        card("9", "♠"),
        card("9", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("6", "♣"),
        card("6", "♦"),
        card("6", "♥"),
        card("8", "♠"),
        card("8", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });
});
