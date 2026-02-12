import { HandCategory } from "./types";
import { findBestHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("5.1 - Multi-Player Comparison", () => {
  describe("2-player scenarios with different hand categories", () => {
    test("should identify winner when one player has higher hand category", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("5", "♠"), card("6", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT);
      expect(hand2.category).toBe(HandCategory.STRAIGHT);

      const comparison = compareHands(hand1, hand2);
      expect(comparison).toBe(0);
    });

    test("should identify winner with flush over straight", () => {
      const board = [
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♦"),
        card("10", "♦"),
      ];

      const player1Hole = [card("9", "♠"), card("8", "♠")];
      const player2Hole = [card("9", "♥"), card("8", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FLUSH);
      expect(hand2.category).toBe(HandCategory.STRAIGHT);

      const comparison = compareHands(hand1, hand2);
      expect(comparison).toBe(1);
    });

    test("should identify winner with pair over high card", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("2", "♠")];
      const player2Hole = [card("J", "♠"), card("7", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.ONE_PAIR);
      expect(hand2.category).toBe(HandCategory.HIGH_CARD);

      const comparison = compareHands(hand1, hand2);
      expect(comparison).toBe(1);
    });

    test("should identify loser correctly when comparing pairs", () => {
      const board = [
        card("A", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("8", "♠"),
        card("7", "♣"),
      ];

      const player1Hole = [card("A", "♦"), card("A", "♠")];
      const player2Hole = [card("K", "♠"), card("K", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      const comparison = compareHands(hand1, hand2);
      expect(comparison).toBe(1);
    });
  });

  describe("Board play scenarios (tie detection)", () => {
    test("should detect tie when both players use only board", () => {
      const board = [
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("4", "♣"), card("5", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      const comparison = compareHands(hand1, hand2);
      expect(comparison).toBe(0);
    });

    test("should detect tie with flush on board", () => {
      const board = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ];

      const player1Hole = [card("2", "♣"), card("2", "♦")];
      const player2Hole = [card("3", "♠"), card("3", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      const comparison = compareHands(hand1, hand2);
      expect(comparison).toBe(0);
    });

    test("should detect tie when both have full house on board", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("7", "♠"),
        card("7", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("5", "♠"), card("6", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      const comparison = compareHands(hand1, hand2);
      expect(comparison).toBe(0);
    });
  });

  describe("3-player scenarios", () => {
    test("should identify single winner among 3 players", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const player1Hole = [card("10", "♦"), card("8", "♦")];
      const player2Hole = [card("2", "♠"), card("2", "♣")];
      const player3Hole = [card("7", "♦"), card("6", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT);
      expect(hand2.category).toBe(HandCategory.ONE_PAIR);
      expect(hand3.category).toBe(HandCategory.HIGH_CARD);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand1, hand3)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });

    test("should identify two-way tie among 3 players", () => {
      const board = [
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("6", "♠"),
      ];

      const player1Hole = [card("2", "♦"), card("2", "♥")];
      const player2Hole = [card("3", "♠"), card("3", "♣")];
      const player3Hole = [card("9", "♦"), card("8", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand1, hand3)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });

    test("should identify three-way tie", () => {
      const board = [
        card("A", "♥"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♠"),
        card("10", "♥"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♠")];
      const player2Hole = [card("4", "♣"), card("5", "♥")];
      const player3Hole = [card("6", "♦"), card("7", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand1, hand3)).toBe(0);
      expect(compareHands(hand2, hand3)).toBe(0);
    });
  });

  describe("Complex multi-player scenarios", () => {
    test("should handle mixed hand categories with 3 players", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("7", "♠"),
        card("2", "♣"),
      ];

      const player1Hole = [card("K", "♠"), card("Q", "♦")];
      const player2Hole = [card("7", "♣"), card("7", "♦")];
      const player3Hole = [card("Q", "♠"), card("J", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(hand1.category).toBe(HandCategory.FOUR_OF_A_KIND);
      expect(hand2.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand3.category).toBe(HandCategory.THREE_OF_A_KIND);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand1, hand3)).toBe(1);
    });

    test("should handle kicker tiebreak with multiple players", () => {
      const board = [
        card("A", "♣"),
        card("A", "♦"),
        card("7", "♥"),
        card("5", "♠"),
        card("3", "♣"),
      ];

      const player1Hole = [card("K", "♠"), card("Q", "♠")];
      const player2Hole = [card("K", "♣"), card("J", "♣")];
      const player3Hole = [card("K", "♦"), card("10", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });

    test("should identify best flush among multiple flush holders", () => {
      const board = [
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("2", "♦"),
        card("3", "♦"),
      ];

      const player1Hole = [card("J", "♠"), card("10", "♠")];
      const player2Hole = [card("J", "♠"), card("9", "♠")];
      const player3Hole = [card("8", "♠"), card("7", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });
  });

  describe("4+ player scenarios", () => {
    test("should identify winner among 4 players", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const player1Hole = [card("10", "♦"), card("8", "♦")];
      const player2Hole = [card("2", "♠"), card("2", "♣")];
      const player3Hole = [card("7", "♦"), card("6", "♣")];
      const player4Hole = [card("3", "♠"), card("4", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);
      const hand4 = findBestHand([...board, ...player4Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand1, hand3)).toBe(1);
      expect(compareHands(hand1, hand4)).toBe(1);
    });

    test("should identify multiple winners among 4 players", () => {
      const board = [
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♠")];
      const player2Hole = [card("4", "♣"), card("5", "♥")];
      const player3Hole = [card("6", "♦"), card("7", "♠")];
      const player4Hole = [card("8", "♣"), card("9", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);
      const hand4 = findBestHand([...board, ...player4Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand1, hand3)).toBe(0);
      expect(compareHands(hand1, hand4)).toBe(0);
    });
  });

  describe("Comparison consistency", () => {
    test("should maintain transitive property in comparisons", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const player1Hole = [card("10", "♦"), card("10", "♠")];
      const player2Hole = [card("8", "♠"), card("8", "♣")];
      const player3Hole = [card("7", "♦"), card("7", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      const comp12 = compareHands(hand1, hand2);
      const comp23 = compareHands(hand2, hand3);
      const comp13 = compareHands(hand1, hand3);

      expect(comp12).toBeGreaterThan(0);
      expect(comp23).toBeGreaterThan(0);
      expect(comp13).toBeGreaterThan(0);
    });

    test("should be deterministic across multiple evaluations", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("5", "♠"), card("6", "♠")];

      const hand1a = findBestHand([...board, ...player1Hole]);
      const hand2a = findBestHand([...board, ...player2Hole]);
      const comp1 = compareHands(hand1a, hand2a);

      const hand1b = findBestHand([...board, ...player1Hole]);
      const hand2b = findBestHand([...board, ...player2Hole]);
      const comp2 = compareHands(hand1b, hand2b);

      expect(comp1).toBe(comp2);
    });
  });

  describe("Edge cases in multi-player scenarios", () => {
    test("should handle full house comparison among 3 players", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("7", "♠"),
        card("2", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("5", "♠"), card("5", "♣")];
      const player3Hole = [card("A", "♦"), card("A", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(hand1.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand2.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand3.category).toBe(HandCategory.FULL_HOUSE);

      expect(compareHands(hand1, hand2)).toBe(-1);
      expect(compareHands(hand2, hand3)).toBe(-1);
    });

    test("should handle wheel straight with multiple players", () => {
      const board = [
        card("A", "♣"),
        card("2", "♦"),
        card("3", "♥"),
        card("4", "♠"),
        card("K", "♣"),
      ];

      const player1Hole = [card("5", "♦"), card("Q", "♦")];
      const player2Hole = [card("6", "♠"), card("J", "♠")];
      const player3Hole = [card("7", "♦"), card("10", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand1, hand3)).toBe(1);
    });
  });
});
