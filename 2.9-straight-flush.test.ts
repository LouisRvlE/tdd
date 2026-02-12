import { Card, HandCategory } from "./types";
import { evaluateHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("2.9 - Straight Flush Detection", () => {
  describe("Straight flush detection", () => {
    test("should detect Ace-high straight flush (A-K-Q-J-10 of hearts)", () => {
      const cards: Card[] = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("10", "♥"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
    });

    test("should detect 9-8-7-6-5 straight flush (clubs)", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("8", "♣"),
        card("7", "♣"),
        card("6", "♣"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
    });

    test("should detect K-Q-J-10-9 straight flush (diamonds)", () => {
      const cards: Card[] = [
        card("K", "♦"),
        card("Q", "♦"),
        card("J", "♦"),
        card("10", "♦"),
        card("9", "♦"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
    });

    test("should detect wheel straight flush (A-2-3-4-5 of spades)", () => {
      const cards: Card[] = [
        card("A", "♠"),
        card("2", "♠"),
        card("3", "♠"),
        card("4", "♠"),
        card("5", "♠"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
    });
  });

  describe("Straight flush detection - not confused with other patterns", () => {
    test("should not be confused with plain flush", () => {
      const cards: Card[] = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should not be confused with plain straight", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should recognize straight flush beats four of a kind", () => {
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
  });

  describe("Straight flush comparison", () => {
    test("should recognize Ace-high straight flush beats King-high", () => {
      const aceHigh = evaluateHand([
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("10", "♠"),
      ]);

      const kingHigh = evaluateHand([
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
        card("9", "♣"),
      ]);

      expect(compareHands(aceHigh, kingHigh)).toBe(1);
    });

    test("should recognize 9-high beats wheel", () => {
      const nineHigh = evaluateHand([
        card("9", "♦"),
        card("8", "♦"),
        card("7", "♦"),
        card("6", "♦"),
        card("5", "♦"),
      ]);

      const wheel = evaluateHand([
        card("A", "♥"),
        card("2", "♥"),
        card("3", "♥"),
        card("4", "♥"),
        card("5", "♥"),
      ]);

      expect(compareHands(nineHigh, wheel)).toBe(1);
    });

    test("should recognize Ace-high straight flush is highest possible", () => {
      const aceHigh = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
      ]);

      const wheel = evaluateHand([
        card("A", "♠"),
        card("2", "♠"),
        card("3", "♠"),
        card("4", "♠"),
        card("5", "♠"),
      ]);

      expect(compareHands(aceHigh, wheel)).toBe(1);
    });

    test("should recognize tie when straight flushes are identical", () => {
      const hand1 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("10", "♥"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("10", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should recognize Q-J-10-9-8 straight flush beats Q-J-10-9-8 flush", () => {
      const straightFlush = evaluateHand([
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
        card("9", "♣"),
        card("8", "♣"),
      ]);

      const flush = evaluateHand([
        card("Q", "♦"),
        card("J", "♦"),
        card("10", "♦"),
        card("9", "♦"),
        card("7", "♦"),
      ]);

      expect(compareHands(straightFlush, flush)).toBe(1);
    });
  });

  describe("Straight flush comparison - complex scenarios", () => {
    test("should recognize 6-5-4-3-2 straight flush beats wheel", () => {
      const sixHigh = evaluateHand([
        card("6", "♠"),
        card("5", "♠"),
        card("4", "♠"),
        card("3", "♠"),
        card("2", "♠"),
      ]);

      const wheel = evaluateHand([
        card("A", "♣"),
        card("2", "♣"),
        card("3", "♣"),
        card("4", "♣"),
        card("5", "♣"),
      ]);

      expect(compareHands(sixHigh, wheel)).toBe(1);
    });

    test("should recognize Ace-high straight flush beats all others", () => {
      const aceHigh = evaluateHand([
        card("A", "♦"),
        card("K", "♦"),
        card("Q", "♦"),
        card("J", "♦"),
        card("10", "♦"),
      ]);

      const kingHigh = evaluateHand([
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("10", "♠"),
        card("9", "♠"),
      ]);

      expect(compareHands(aceHigh, kingHigh)).toBe(1);
    });

    test("should recognize wheel loses to 6-high", () => {
      const wheel = evaluateHand([
        card("A", "♥"),
        card("2", "♥"),
        card("3", "♥"),
        card("4", "♥"),
        card("5", "♥"),
      ]);

      const sixHigh = evaluateHand([
        card("6", "♦"),
        card("5", "♦"),
        card("4", "♦"),
        card("3", "♦"),
        card("2", "♦"),
      ]);

      expect(compareHands(wheel, sixHigh)).toBe(-1);
    });
  });
});
