import { HandCategory } from "./types";
import { findBestHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("6.3 - Examples from consign.md", () => {
  describe("Example A - Wheel (A-2-3-4-5 straight)", () => {
    test("should find wheel from board and player cards", () => {
      const board = [
        card("A", "♣"),
        card("2", "♦"),
        card("3", "♥"),
        card("4", "♠"),
        card("9", "♦"),
      ];

      const playerHole = [card("5", "♣"), card("K", "♦")];

      const hand = findBestHand([...board, ...playerHole]);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(5);
    });
  });

  describe("Example B - Ace-high straight", () => {
    test("should find ace-high straight from board and player cards", () => {
      const board = [
        card("10", "♣"),
        card("J", "♦"),
        card("Q", "♥"),
        card("K", "♠"),
        card("2", "♦"),
      ];

      const playerHole = [card("A", "♣"), card("3", "♦")];

      const hand = findBestHand([...board, ...playerHole]);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
      expect(hand.tieBreakValues[0]).toBe(14);
    });
  });

  describe("Example C - Flush with more than 5 suited cards available", () => {
    test("should select best five hearts A-J-9-6-4", () => {
      const board = [
        card("A", "♥"),
        card("J", "♥"),
        card("9", "♥"),
        card("4", "♥"),
        card("2", "♣"),
      ];

      const playerHole = [card("6", "♥"), card("K", "♦")];

      const hand = findBestHand([...board, ...playerHole]);

      expect(hand.category).toBe(HandCategory.FLUSH);
      expect(hand.tieBreakValues).toEqual([14, 11, 9, 6, 4]);
    });
  });

  describe("Example D - Board plays (tie)", () => {
    test("should result in tie when both players use only board", () => {
      const board = [
        card("5", "♣"),
        card("6", "♦"),
        card("7", "♥"),
        card("8", "♠"),
        card("9", "♦"),
      ];

      const player1Hole = [card("A", "♣"), card("A", "♦")];
      const player2Hole = [card("K", "♣"), card("Q", "♦")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT);
      expect(hand2.category).toBe(HandCategory.STRAIGHT);
      expect(compareHands(hand1, hand2)).toBe(0);
      expect(hand1.tieBreakValues[0]).toBe(9);
      expect(hand2.tieBreakValues[0]).toBe(9);
    });
  });

  describe("Example E - Quads on board, kicker decides", () => {
    test("should give player with ace kicker the win", () => {
      const board = [
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("7", "♠"),
        card("2", "♦"),
      ];

      const player1Hole = [card("A", "♣"), card("K", "♣")];
      const player2Hole = [card("Q", "♣"), card("J", "♣")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FOUR_OF_A_KIND);
      expect(hand2.category).toBe(HandCategory.FOUR_OF_A_KIND);
      expect(hand1.tieBreakValues[0]).toBe(7);
      expect(hand2.tieBreakValues[0]).toBe(7);
      expect(hand1.tieBreakValues[1]).toBe(14);
      expect(hand2.tieBreakValues[1]).toBe(12);
      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Additional integration scenarios", () => {
    test("should handle straight flush board with player pairs", () => {
      const board = [
        card("9", "♥"),
        card("8", "♥"),
        card("7", "♥"),
        card("6", "♥"),
        card("5", "♥"),
      ];

      const player1Hole = [card("A", "♣"), card("A", "♦")];
      const player2Hole = [card("K", "♠"), card("K", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand2.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should handle full house vs trips scenario", () => {
      const board = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ];

      const player1Hole = [card("9", "♣"), card("9", "♦")];
      const player2Hole = [card("8", "♦"), card("7", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand2.category).toBe(HandCategory.FULL_HOUSE);
      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should handle complex multi-way tie scenario", () => {
      const board = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("K", "♣"),
      ];

      const player1Hole = [card("2", "♦"), card("3", "♥")];
      const player2Hole = [card("4", "♠"), card("5", "♣")];
      const player3Hole = [card("6", "♦"), card("7", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);
      const hand3 = findBestHand([...board, ...player3Hole]);

      expect(hand1.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand2.category).toBe(HandCategory.FULL_HOUSE);
      expect(hand3.category).toBe(HandCategory.FULL_HOUSE);
      expect(compareHands(hand1, hand2)).toBe(0);
      expect(compareHands(hand2, hand3)).toBe(0);
      expect(compareHands(hand1, hand3)).toBe(0);
    });
  });
});
