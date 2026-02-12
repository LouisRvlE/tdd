import { HandCategory } from "./types";
import { findBestHand, compareHands } from "./main";
import { card } from "./testHelpers";

describe("6.2 - Flush with 6+ Suited Cards", () => {
  describe("Select best 5 out of 6 hearts", () => {
    test("should select highest 5 hearts when 6 available", () => {
      const sevenCards = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
        card("4", "♥"),
        card("2", "♣"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.FLUSH);
      expect(hand.tieBreakValues).toEqual([14, 13, 12, 11, 9]);
    });

    test("should select A-K-Q-J-9 from A-K-Q-J-9-6", () => {
      const sevenCards = [
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("9", "♠"),
        card("6", "♠"),
        card("3", "♦"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.FLUSH);
      expect(hand.tieBreakValues).toEqual([14, 13, 12, 11, 9]);
    });

    test("should select best 5 when 7 suited cards available", () => {
      const sevenCards = [
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("10", "♣"),
        card("9", "♣"),
        card("2", "♣"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand.tieBreakValues[0]).toBe(14);
    });
  });

  describe("Ensure correct descending order", () => {
    test("should order flush cards in descending rank", () => {
      const sevenCards = [
        card("4", "♦"),
        card("J", "♦"),
        card("A", "♦"),
        card("9", "♦"),
        card("6", "♦"),
        card("K", "♦"),
        card("2", "♠"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.FLUSH);
      expect(hand.tieBreakValues).toEqual([14, 13, 11, 9, 6]);
    });

    test("should correctly compare two flushes with 6 suited cards each", () => {
      const board = [
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
        card("2", "♣"),
      ];

      const player1Hole = [card("A", "♥"), card("8", "♥")];
      const player2Hole = [card("7", "♥"), card("6", "♥")];

      const hand1 = findBestHand([...board, ...player1Hole]);
      const hand2 = findBestHand([...board, ...player2Hole]);

      expect(hand1.category).toBe(HandCategory.FLUSH);
      expect(hand2.category).toBe(HandCategory.FLUSH);
      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should pick A-high flush over K-high flush with 6 suited", () => {
      const sevenCards1 = [
        card("A", "♠"),
        card("J", "♠"),
        card("9", "♠"),
        card("7", "♠"),
        card("5", "♠"),
        card("3", "♠"),
        card("K", "♦"),
      ];

      const sevenCards2 = [
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("9", "♠"),
        card("8", "♠"),
        card("7", "♠"),
        card("A", "♦"),
      ];

      const hand1 = findBestHand(sevenCards1);
      const hand2 = findBestHand(sevenCards2);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Flush vs straight flush selection", () => {
    test("should prefer straight flush over regular flush with 6 suited", () => {
      const sevenCards = [
        card("9", "♥"),
        card("8", "♥"),
        card("7", "♥"),
        card("6", "♥"),
        card("5", "♥"),
        card("2", "♥"),
        card("A", "♣"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand.tieBreakValues[0]).toBe(9);
    });

    test("should recognize best straight flush from 7 suited cards", () => {
      const sevenCards = [
        card("K", "♦"),
        card("Q", "♦"),
        card("J", "♦"),
        card("10", "♦"),
        card("9", "♦"),
        card("8", "♦"),
        card("7", "♦"),
      ];

      const hand = findBestHand(sevenCards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
      expect(hand.tieBreakValues[0]).toBe(13);
    });
  });
});
