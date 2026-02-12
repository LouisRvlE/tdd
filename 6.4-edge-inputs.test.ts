import { HandCategory } from "./types";
import { evaluateHand, findBestHand } from "./main";
import { card } from "./testHelpers";

describe("6.4 - Invalid/Edge Inputs", () => {
  describe("Invalid input handling", () => {
    test("should throw error when evaluating hand with less than 5 cards", () => {
      expect(() => {
        evaluateHand([
          card("A", "♣"),
          card("K", "♠"),
          card("Q", "♥"),
          card("J", "♦"),
        ]);
      }).toThrow();
    });

    test("should throw error when evaluating hand with more than 5 cards", () => {
      expect(() => {
        evaluateHand([
          card("A", "♣"),
          card("K", "♠"),
          card("Q", "♥"),
          card("J", "♦"),
          card("10", "♣"),
          card("9", "♠"),
        ]);
      }).toThrow();
    });

    test("should throw error when finding best hand with less than 7 cards", () => {
      expect(() => {
        findBestHand([
          card("A", "♣"),
          card("K", "♠"),
          card("Q", "♥"),
          card("J", "♦"),
          card("10", "♣"),
          card("9", "♠"),
        ]);
      }).toThrow();
    });

    test("should throw error when finding best hand with more than 7 cards", () => {
      expect(() => {
        findBestHand([
          card("A", "♣"),
          card("K", "♠"),
          card("Q", "♥"),
          card("J", "♦"),
          card("10", "♣"),
          card("9", "♠"),
          card("8", "♥"),
          card("7", "♦"),
        ]);
      }).toThrow();
    });
  });

  describe("Consistent behavior with edge cases", () => {
    test("should handle all same rank except one", () => {
      const hand = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("7", "♠"),
        card("2", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.FOUR_OF_A_KIND);
      expect(hand.tieBreakValues[0]).toBe(7);
      expect(hand.tieBreakValues[1]).toBe(2);
    });

    test("should handle lowest possible straight", () => {
      const hand = evaluateHand([
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(5);
    });

    test("should handle lowest possible flush", () => {
      const hand = evaluateHand([
        card("7", "♣"),
        card("5", "♣"),
        card("4", "♣"),
        card("3", "♣"),
        card("2", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.FLUSH);
      expect(hand.tieBreakValues).toEqual([7, 5, 4, 3, 2]);
    });

    test("should handle all different suits in high card", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
      expect(hand.tieBreakValues).toEqual([14, 13, 12, 11, 9]);
    });

    test("should handle minimum two pair", () => {
      const hand = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("2", "♥"),
        card("2", "♠"),
        card("4", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
      expect(hand.tieBreakValues).toEqual([3, 2, 4]);
    });

    test("should handle minimum full house", () => {
      const hand = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("2", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand.tieBreakValues).toEqual([3, 2]);
    });
  });

  describe("Boundary conditions", () => {
    test("should correctly identify near-straight as high card", () => {
      const hand = evaluateHand([
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("4", "♣"),
      ]);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });

    test("should correctly identify near-flush as high card", () => {
      const hand = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♦"),
      ]);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });

    test("should handle exact 7 cards for best hand", () => {
      const sevenCards = [
        card("A", "♣"),
        card("A", "♠"),
        card("K", "♥"),
        card("K", "♦"),
        card("Q", "♣"),
        card("J", "♠"),
        card("9", "♥"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
      expect(hand.tieBreakValues).toEqual([14, 13, 12]);
    });

    test("should handle 7 cards all different ranks", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♠"),
        card("Q", "♥"),
        card("J", "♦"),
        card("9", "♣"),
        card("7", "♠"),
        card("5", "♥"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
      expect(hand.tieBreakValues).toEqual([14, 13, 12, 11, 9]);
    });
  });
});
