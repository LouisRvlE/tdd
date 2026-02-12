import { HandCategory } from "./types";
import { evaluateHand, compareHands, findBestHand } from "./main";
import { card } from "./testHelpers";

describe("6.1 - Ace Edge Cases", () => {
  describe("Ace-low straight (wheel)", () => {
    test("should recognize A-2-3-4-5 as valid straight", () => {
      const hand = evaluateHand([
        card("5", "♣"),
        card("4", "♠"),
        card("3", "♥"),
        card("2", "♦"),
        card("A", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(5);
    });

    test("should recognize wheel from 7 cards", () => {
      const sevenCards = [
        card("A", "♣"),
        card("2", "♦"),
        card("3", "♥"),
        card("4", "♠"),
        card("5", "♣"),
        card("K", "♦"),
        card("9", "♦"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(5);
    });

    test("should recognize wheel beats nothing", () => {
      const wheel = evaluateHand([
        card("5", "♣"),
        card("4", "♠"),
        card("3", "♥"),
        card("2", "♦"),
        card("A", "♣"),
      ]);

      const highCard = evaluateHand([
        card("K", "♣"),
        card("Q", "♠"),
        card("J", "♥"),
        card("9", "♦"),
        card("7", "♣"),
      ]);

      expect(compareHands(wheel, highCard)).toBe(1);
    });

    test("should recognize wheel loses to six-high straight", () => {
      const wheel = evaluateHand([
        card("5", "♣"),
        card("4", "♠"),
        card("3", "♥"),
        card("2", "♦"),
        card("A", "♣"),
      ]);

      const sixHigh = evaluateHand([
        card("6", "♣"),
        card("5", "♠"),
        card("4", "♥"),
        card("3", "♦"),
        card("2", "♣"),
      ]);

      expect(compareHands(wheel, sixHigh)).toBe(-1);
    });
  });

  describe("Ace-high straight", () => {
    test("should recognize 10-J-Q-K-A as valid straight", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♠"),
        card("Q", "♥"),
        card("J", "♦"),
        card("10", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(14);
    });

    test("should recognize ace-high straight from 7 cards", () => {
      const sevenCards = [
        card("10", "♣"),
        card("J", "♦"),
        card("Q", "♥"),
        card("K", "♠"),
        card("A", "♣"),
        card("3", "♦"),
        card("2", "♦"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(14);
    });

    test("should recognize ace-high straight beats king-high", () => {
      const aceHigh = evaluateHand([
        card("A", "♣"),
        card("K", "♠"),
        card("Q", "♥"),
        card("J", "♦"),
        card("10", "♣"),
      ]);

      const kingHigh = evaluateHand([
        card("K", "♣"),
        card("Q", "♠"),
        card("J", "♥"),
        card("10", "♦"),
        card("9", "♣"),
      ]);

      expect(compareHands(aceHigh, kingHigh)).toBe(1);
    });

    test("should recognize ace-high straight beats wheel", () => {
      const aceHigh = evaluateHand([
        card("A", "♣"),
        card("K", "♠"),
        card("Q", "♥"),
        card("J", "♦"),
        card("10", "♣"),
      ]);

      const wheel = evaluateHand([
        card("5", "♣"),
        card("4", "♠"),
        card("3", "♥"),
        card("2", "♦"),
        card("A", "♦"),
      ]);

      expect(compareHands(aceHigh, wheel)).toBe(1);
    });
  });

  describe("Ace in high card comparison", () => {
    test("should treat ace as highest card in high card hand", () => {
      const aceHigh = evaluateHand([
        card("A", "♣"),
        card("K", "♠"),
        card("Q", "♥"),
        card("J", "♦"),
        card("8", "♣"),
      ]);

      const kingHigh = evaluateHand([
        card("K", "♦"),
        card("Q", "♣"),
        card("J", "♠"),
        card("9", "♥"),
        card("7", "♦"),
      ]);

      expect(aceHigh.category).toBe(HandCategory.HIGH_CARD);
      expect(kingHigh.category).toBe(HandCategory.HIGH_CARD);
      expect(compareHands(aceHigh, kingHigh)).toBe(1);
    });

    test("should compare aces in kicker position", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♠"),
        card("A", "♥"),
        card("Q", "♦"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♥"),
        card("10", "♦"),
      ]);

      expect(hand1.category).toBe(HandCategory.ONE_PAIR);
      expect(hand2.category).toBe(HandCategory.ONE_PAIR);
      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Ace in pair/flush/other categories", () => {
    test("should recognize pair of aces", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♠"),
        card("K", "♥"),
        card("Q", "♦"),
        card("J", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.ONE_PAIR);
      expect(hand.tieBreakValues[0]).toBe(14);
    });

    test("should recognize aces in flush", () => {
      const hand = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      expect(hand.category).toBe(HandCategory.FLUSH);
      expect(hand.tieBreakValues[0]).toBe(14);
    });

    test("should recognize three aces", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♠"),
        card("A", "♥"),
        card("K", "♦"),
        card("Q", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
      expect(hand.tieBreakValues[0]).toBe(14);
    });

    test("should recognize four aces", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("A", "♠"),
        card("A", "♥"),
        card("A", "♦"),
        card("K", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.FOUR_OF_A_KIND);
      expect(hand.tieBreakValues[0]).toBe(14);
    });
  });

  describe("No wraparound straights", () => {
    test("should not recognize Q-K-A-2-3 as straight", () => {
      const hand = evaluateHand([
        card("Q", "♣"),
        card("K", "♠"),
        card("A", "♥"),
        card("2", "♦"),
        card("3", "♣"),
      ]);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });

    test("should not recognize K-A-2-3-4 as straight", () => {
      const hand = evaluateHand([
        card("K", "♣"),
        card("A", "♠"),
        card("2", "♥"),
        card("3", "♦"),
        card("4", "♣"),
      ]);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });

    test("should not recognize J-Q-K-A-2 as straight", () => {
      const hand = evaluateHand([
        card("J", "♣"),
        card("Q", "♠"),
        card("K", "♥"),
        card("A", "♦"),
        card("2", "♣"),
      ]);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });
  });
});
