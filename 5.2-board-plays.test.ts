import { HandCategory } from "./types";
import { findBestHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("5.2 - Board Plays", () => {
  describe("Both players use only board (ignore hole cards)", () => {
    test("should detect when both players play the board straight flush", () => {
      const board = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("10", "♥"),
      ];

      const player1Hole = [card("2", "♣"), card("3", "♣")];
      const player2Hole = [card("5", "♦"), card("6", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand2.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should detect when both players play the board flush", () => {
      const board = [
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("9", "♠"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("4", "♥"), card("5", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FLUSH);
      expect(hand2.category).toBe(HandCategory.FLUSH);
      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should detect when both players play the board straight", () => {
      const board = [
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("5", "♣"),
      ];

      const player1Hole = [card("A", "♦"), card("K", "♦")];
      const player2Hole = [card("Q", "♠"), card("J", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT);
      expect(hand2.category).toBe(HandCategory.STRAIGHT);
      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should detect when both players play the board wheel", () => {
      const board = [
        card("A", "♣"),
        card("2", "♦"),
        card("3", "♥"),
        card("4", "♠"),
        card("5", "♣"),
      ];

      const player1Hole = [card("K", "♦"), card("Q", "♦")];
      const player2Hole = [card("J", "♠"), card("10", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT);
      expect(hand1.tieBreakValues[0]).toBe(5);
      expect(hand2.category).toBe(HandCategory.STRAIGHT);
      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should detect when both players play the board high card", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("4", "♥"), card("5", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.HIGH_CARD);
      expect(hand2.category).toBe(HandCategory.HIGH_CARD);
      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should detect when both players play the board full house", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("7", "♠"),
        card("7", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("4", "♥"), card("5", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand2.category).toBe(HandCategory.FULL_HOUSE);
      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });

  describe("One player uses board, other doesn't", () => {
    test("should correctly compare when one player improves over board", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("K", "♠"), card("K", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.TWO_PAIR);
      expect(hand2.category).toBe(HandCategory.FOUR_OF_A_KIND);
      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should correctly compare when one player uses one hole card", () => {
      const board = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♣"),
      ];

      const player1Hole = [card("10", "♥"), card("2", "♦")];
      const player2Hole = [card("3", "♠"), card("4", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand2.category).toBe(HandCategory.HIGH_CARD);
      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should correctly compare when board is stronger for one player", () => {
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("9", "♠"), card("8", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT);
      expect(hand2.category).toBe(HandCategory.STRAIGHT);
      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });

  describe("Multiple players all playing board", () => {
    test("should detect 3-way board play tie", () => {
      const board = [
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("4", "♣"), card("5", "♣")];
      const player3Hole = [card("6", "♥"), card("7", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand1, hand3)).toBe(0);
    });

    test("should detect 4-way board play with full house", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("7", "♠"),
        card("7", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("4", "♣"), card("5", "♣")];
      const player3Hole = [card("6", "♥"), card("7", "♥")];
      const player4Hole = [card("8", "♠"), card("9", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);
      const hand4 = findBestHand([...board, ...player4Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand1, hand3)).toBe(0);
      expect(compareHands(hand1, hand4)).toBe(0);
    });
  });

  describe("Board play with only one card needed from hand", () => {
    test("should detect when player uses one hole card in straight", () => {
      const board = [
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("2", "♣"),
      ];

      const player1Hole = [card("5", "♦"), card("K", "♦")];
      const player2Hole = [card("3", "♠"), card("4", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT);
      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should detect when player uses one hole card in flush", () => {
      const board = [
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const player1Hole = [card("10", "♠"), card("2", "♦")];
      const player2Hole = [card("10", "♦"), card("2", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FLUSH);
      expect(hand2.category).toBe(HandCategory.HIGH_CARD);
      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Board play consistency", () => {
    test("should consistently identify same board play result", () => {
      const board = [
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♦")];
      const player2Hole = [card("4", "♣"), card("5", "♣")];

      const hand1a = findBestHand([...board, ...player1Hole]);
      const hand2a = findBestHand([...board, ...player2Hole]);
      const comp1 = compareHands(hand1a, hand2a);

      const hand1b = findBestHand([...board, ...player1Hole]);
      const hand2b = findBestHand([...board, ...player2Hole]);
      const comp2 = compareHands(hand1b, hand2b);

      expect(comp1).toBe(comp2);
      expect(comp1).toBe(0);
    });

    test("should identify board play even with strong hole cards", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("Q", "♣"),
      ];

      const player1Hole = [card("A", "♦"), card("A", "♠")];
      const player2Hole = [card("J", "♦"), card("J", "♠")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });
});
