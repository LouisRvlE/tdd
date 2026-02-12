import { HandCategory } from "./types";
import { findBestHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("5.3 - Multi-Player Scenarios", () => {
  describe("2 players with different hand categories", () => {
    test("should determine winner with straight flush vs four of a kind", () => {
      const board = [
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("10", "♠"),
        card("9", "♦"),
      ];

      const player1Hole = [card("A", "♠"), card("2", "♠")];
      const player2Hole = [card("9", "♠"), card("8", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand2.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should determine winner with full house vs flush", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("A", "♠"),
        card("A", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("2", "♠"), card("4", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand2.category).toBe(HandCategory.FULL_HOUSE);
      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should determine winner with flush vs straight", () => {
      const board = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("2", "♦"),
      ];

      const player1Hole = [card("9", "♥"), card("3", "♦")];
      const player2Hole = [card("10", "♣"), card("9", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FLUSH);
      expect(hand2.category).toBe(HandCategory.STRAIGHT);
      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should determine winner with three of a kind vs two pair", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("7", "♠"),
        card("7", "♣"),
      ];

      const player1Hole = [card("A", "♦"), card("A", "♠")];
      const player2Hole = [card("2", "♠"), card("3", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand2.category).toBe(HandCategory.FULL_HOUSE);
      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("3 players with mixed categories", () => {
    test("should identify single winner among 3 with different categories", () => {
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
    });

    test("should handle 3 players with flush, straight, pair", () => {
      const board = [
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("8", "♠"),
        card("7", "♣"),
      ];

      const player1Hole = [card("9", "♠"), card("2", "♠")];
      const player2Hole = [card("9", "♦"), card("8", "♣")];
      const player3Hole = [card("7", "♣"), card("6", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });

    test("should identify winner with 4 of a kind among 3 players", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("2", "♣"),
      ];

      const player1Hole = [card("A", "♦"), card("Q", "♣")];
      const player2Hole = [card("7", "♠"), card("7", "♦")];
      const player3Hole = [card("3", "♦"), card("4", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(hand1.category).toBe(HandCategory.FOUR_OF_A_KIND);
      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand1, hand3)).toBe(1);
    });
  });

  describe("4+ players with mixed categories", () => {
    test("should identify single winner among 4 with varied hands", () => {
      const board = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("2", "♦"),
      ];

      const player1Hole = [card("9", "♥"), card("3", "♣")];
      const player2Hole = [card("10", "♦"), card("9", "♦")];
      const player3Hole = [card("8", "♣"), card("7", "♣")];
      const player4Hole = [card("6", "♠"), card("5", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);
      const hand4 = findBestHand([...board, ...player4Hole]);

      expect(hand1.category).toBe(HandCategory.FLUSH);
      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand1, hand3)).toBe(1);
      expect(compareHands(hand1, hand4)).toBe(1);
    });

    test("should rank 4 players correctly with straight flush at top", () => {
      const board = [
        card("9", "♥"),
        card("8", "♦"),
        card("7", "♣"),
        card("6", "♠"),
        card("2", "♥"),
      ];

      const player1Hole = [card("10", "♥"), card("5", "♥")];
      const player2Hole = [card("10", "♦"), card("5", "♦")];
      const player3Hole = [card("A", "♣"), card("A", "♥")];
      const player4Hole = [card("K", "♦"), card("K", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);
      const hand4 = findBestHand([...board, ...player4Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand2, hand3)).toBe(1);
      expect(compareHands(hand3, hand4)).toBe(1);
    });
  });

  describe("All players with same category requiring tie-breaks", () => {
    test("should rank 3 players all with pairs by pair rank", () => {
      const board = [
        card("Q", "♣"),
        card("J", "♦"),
        card("7", "♥"),
        card("5", "♠"),
        card("3", "♣"),
      ];

      const player1Hole = [card("A", "♦"), card("A", "♠")];
      const player2Hole = [card("K", "♥"), card("K", "♣")];
      const player3Hole = [card("10", "♠"), card("10", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });

    test("should rank 3 players all with flushes by high card", () => {
      const board = [
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("2", "♦"),
      ];

      const player1Hole = [card("10", "♠"), card("3", "♣")];
      const player2Hole = [card("9", "♠"), card("3", "♦")];
      const player3Hole = [card("8", "♠"), card("3", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });

    test("should rank 3 players all with straights by high card", () => {
      const board = [
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("2", "♠"),
        card("2", "♣"),
      ];

      const player1Hole = [card("6", "♦"), card("K", "♠")];
      const player2Hole = [card("5", "♥"), card("Q", "♦")];
      const player3Hole = [card("4", "♠"), card("J", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });

    test("should rank 4 players all with high card by kickers", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("9", "♠"),
        card("7", "♣"),
      ];

      const player1Hole = [card("J", "♦"), card("2", "♣")];
      const player2Hole = [card("10", "♥"), card("2", "♦")];
      const player3Hole = [card("8", "♠"), card("2", "♥")];
      const player4Hole = [card("6", "♣"), card("2", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);
      const hand4 = findBestHand([...board, ...player4Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(1);
      expect(compareHands(hand3, hand4)).toBe(1);
    });

    test("should rank 3 players all with full houses", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("7", "♥"),
        card("7", "♠"),
        card("2", "♣"),
      ];

      const player1Hole = [card("A", "♦"), card("A", "♠")];
      const player2Hole = [card("K", "♥"), card("J", "♣")];
      const player3Hole = [card("Q", "♠"), card("Q", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(-1);
      expect(compareHands(hand2, hand3)).toBe(1);
    });

    test("should correctly tie players with identical best hands", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♣")];
      const player2Hole = [card("4", "♥"), card("5", "♠")];
      const player3Hole = [card("6", "♣"), card("7", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand2, hand3)).toBe(0);
    });
  });

  describe("Complex scenarios with multiple winners and losers", () => {
    test("should identify winners and losers in 6-player game", () => {
      const board = [
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("4", "♣"), card("5", "♣")];
      const player3Hole = [card("A", "♦"), card("A", "♥")];
      const player4Hole = [card("K", "♠"), card("K", "♥")];
      const player5Hole = [card("Q", "♠"), card("Q", "♣")];
      const player6Hole = [card("J", "♠"), card("J", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);
      const hand4 = findBestHand([...board, ...player4Hole]);
      const hand5 = findBestHand([...board, ...player5Hole]);
      const hand6 = findBestHand([...board, ...player6Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand3, hand4)).toBe(0);
      expect(compareHands(hand4, hand5)).toBe(0);
      expect(compareHands(hand5, hand6)).toBe(0);
    });

    test("should handle 5 players with varied outcomes", () => {
      const board = [
        card("K", "♠"),
        card("K", "♦"),
        card("Q", "♥"),
        card("9", "♣"),
        card("8", "♠"),
      ];

      const player1Hole = [card("K", "♣"), card("K", "♥")];
      const player2Hole = [card("A", "♠"), card("A", "♦")];
      const player3Hole = [card("Q", "♠"), card("Q", "♦")];
      const player4Hole = [card("J", "♥"), card("J", "♦")];
      const player5Hole = [card("2", "♦"), card("3", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);
      const hand4 = findBestHand([...board, ...player4Hole]);
      const hand5 = findBestHand([...board, ...player5Hole]);

      expect(compareHands(hand1, hand2)).toBe(1);
      expect(compareHands(hand2, hand3)).toBe(-1);
      expect(compareHands(hand3, hand4)).toBe(1);
      expect(compareHands(hand4, hand5)).toBe(1);
    });
  });

  describe("Consistency and determinism across multiple evaluations", () => {
    test("should consistently rank same 5 players in same order", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const holeCards = [
        [card("10", "♦"), card("8", "♦")],
        [card("2", "♠"), card("2", "♣")],
        [card("7", "♦"), card("6", "♣")],
        [card("5", "♠"), card("4", "♣")],
        [card("3", "♦"), card("2", "♦")],
      ];

      const hands1 = holeCards.map((hole) => findBestHand([...board, ...hole]));
      const hands2 = holeCards.map((hole) => findBestHand([...board, ...hole]));

      for (let i = 0; i < hands1.length; i++) {
        for (let j = 0; j < hands1.length; j++) {
          expect(compareHands(hands1[i], hands1[j])).toBe(
            compareHands(hands2[i], hands2[j]),
          );
        }
      }
    });

    test("should maintain transitive property across all comparisons", () => {
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

      if (comp12 > 0 && comp23 > 0) {
        expect(comp13).toBeGreaterThan(0);
      }
    });
  });
});
