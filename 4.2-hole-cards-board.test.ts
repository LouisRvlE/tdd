import { Card, HandCategory } from "./types";
import { evaluateHand, findBestHand } from "./main";
import { card } from "./testHelpers";

describe("4.2 - Hole Cards + Board Scenarios", () => {
  describe("Player hole cards + 5 community cards", () => {
    test("should find best hand when player cards complete a flush", () => {
      const holeCards = [card("A", "♣"), card("K", "♣")];
      const board = [
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
        card("2", "♦"),
        card("3", "♦"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FLUSH);
      expect(best.cards.every((c) => c.suit === "♣")).toBe(true);
    });

    test("should find best hand when player has pair that makes two pair with board", () => {
      const holeCards = [card("A", "♣"), card("A", "♦")];
      const board = [
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
        card("J", "♦"),
        card("9", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should find best hand when board plays (player cards ignored)", () => {
      const holeCards = [card("2", "♣"), card("3", "♦")];
      const board = [
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
        card("J", "♦"),
        card("10", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should find flush over lower straight when flush completes on board", () => {
      const holeCards = [card("A", "♣"), card("2", "♣")];
      const board = [
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♦"),
        card("10", "♦"),
        card("9", "♣"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FLUSH);
    });

    test("should find full house when player has pair and board has three of a kind", () => {
      const holeCards = [card("K", "♣"), card("K", "♦")];
      const board = [
        card("K", "♥"),
        card("Q", "♠"),
        card("Q", "♣"),
        card("J", "♦"),
        card("10", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FULL_HOUSE);
      expect(best.tieBreakValues[0]).toBe(13);
    });

    test("should find four of a kind when all of player's pair and 2 on board match", () => {
      const holeCards = [card("A", "♣"), card("A", "♦")];
      const board = [
        card("A", "♥"),
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FOUR_OF_A_KIND);
    });

    test("should find straight flush with player contribution", () => {
      const holeCards = [card("9", "♠"), card("8", "♠")];
      const board = [
        card("J", "♠"),
        card("Q", "♠"),
        card("10", "♠"),
        card("2", "♦"),
        card("3", "♦"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT_FLUSH);
    });

    test("should find best hand when wheel straight is available on board", () => {
      const holeCards = [card("A", "♣"), card("K", "♦")];
      const board = [
        card("2", "♥"),
        card("3", "♠"),
        card("4", "♣"),
        card("5", "♦"),
        card("J", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      expect(best.tieBreakValues[0]).toBe(5);
    });

    test("should prioritize ace-high straight over wheel straight", () => {
      const holeCards = [card("A", "♣"), card("K", "♦")];
      const board = [
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      expect(best.tieBreakValues[0]).toBe(14);
    });
  });

  describe("Multiple hole card choices to best hand selection", () => {
    test("should use only best 5 when board has stronger cards", () => {
      const holeCards = [card("2", "♥"), card("3", "♥")];
      const board = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♠"),
        card("J", "♣"),
        card("10", "♦"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      const boardHand = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♠"),
        card("J", "♣"),
        card("10", "♦"),
      ]);
      expect(best.category).toBe(boardHand.category);
    });

    test("should select best flush when multiple flush options exist", () => {
      const holeCards = [card("A", "♠"), card("K", "♠")];
      const board = [
        card("Q", "♠"),
        card("J", "♠"),
        card("9", "♠"),
        card("2", "♣"),
        card("3", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FLUSH);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should select best pair when board offers multiple pair options", () => {
      const holeCards = [card("A", "♣"), card("A", "♦")];
      const board = [
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.TWO_PAIR);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should find three of a kind when triple available on board", () => {
      const holeCards = [card("2", "♣"), card("3", "♦")];
      const board = [
        card("A", "♥"),
        card("A", "♠"),
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.THREE_OF_A_KIND);
      expect(best.tieBreakValues[0]).toBe(14);
    });
  });

  describe("Edge cases with 7-card hand selection", () => {
    test("should handle all pairs scenario correctly", () => {
      const holeCards = [card("K", "♣"), card("K", "♦")];
      const board = [
        card("Q", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
        card("J", "♦"),
        card("10", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.TWO_PAIR);
      expect(best.cards.length).toBe(5);
    });

    test("should find best hand when kicker matters in high card", () => {
      const holeCards = [card("A", "♣"), card("K", "♦")];
      const board = [
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.HIGH_CARD);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should choose highest flush when 6 suited cards available", () => {
      const holeCards = [card("A", "♦"), card("K", "♦")];
      const board = [
        card("Q", "♦"),
        card("J", "♦"),
        card("9", "♦"),
        card("2", "♣"),
        card("3", "♣"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.FLUSH);
      expect(best.tieBreakValues[0]).toBe(14);
    });

    test("should find best kicker in pair when multiple options exist", () => {
      const holeCards = [card("A", "♣"), card("A", "♦")];
      const board = [
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
        card("9", "♦"),
        card("8", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.ONE_PAIR);
      expect(best.tieBreakValues[0]).toBe(14);
      expect(best.tieBreakValues[1]).toBe(13);
      expect(best.tieBreakValues[2]).toBe(12);
    });

    test("should not confuse straight with multiple middle cards", () => {
      const holeCards = [card("9", "♣"), card("8", "♦")];
      const board = [
        card("7", "♥"),
        card("6", "♠"),
        card("5", "♣"),
        card("K", "♦"),
        card("A", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.category).toBe(HandCategory.STRAIGHT);
      expect(best.tieBreakValues[0]).toBe(9);
    });
  });

  describe("Return structure validation", () => {
    test("should return hand object with required properties", () => {
      const holeCards = [card("A", "♣"), card("K", "♦")];
      const board = [
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best).toHaveProperty("category");
      expect(best).toHaveProperty("tieBreakValues");
      expect(best).toHaveProperty("cards");
    });

    test("should return exactly 5 cards in best hand", () => {
      const holeCards = [card("A", "♣"), card("K", "♦")];
      const board = [
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(best.cards.length).toBe(5);
    });

    test("should return valid tieBreakValues array", () => {
      const holeCards = [card("A", "♣"), card("K", "♦")];
      const board = [
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best = findBestHand(sevenCards);

      expect(Array.isArray(best.tieBreakValues)).toBe(true);
      expect(best.tieBreakValues.length).toBeGreaterThan(0);
      expect(best.tieBreakValues.every((v) => v >= 2 && v <= 14)).toBe(true);
    });
  });

  describe("Consistency across multiple evaluations", () => {
    test("should return same best hand on repeated calls", () => {
      const holeCards = [card("A", "♣"), card("K", "♦")];
      const board = [
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
        card("2", "♦"),
        card("3", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best1 = findBestHand(sevenCards);
      const best2 = findBestHand(sevenCards);

      expect(best1.category).toBe(best2.category);
      expect(best1.tieBreakValues).toEqual(best2.tieBreakValues);
    });

    test("should pick same cards consistently on repeated calls", () => {
      const holeCards = [card("K", "♣"), card("K", "♦")];
      const board = [
        card("Q", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
        card("J", "♦"),
        card("10", "♥"),
      ];

      const sevenCards = [...holeCards, ...board];
      const best1 = findBestHand(sevenCards);
      const best2 = findBestHand(sevenCards);

      expect(best1.cards).toEqual(best2.cards);
    });
  });
});
