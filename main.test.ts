import { Card, Hand, HandCategory, Rank, Suit, RankValue } from "./types";
import { parseCard, rankToValue, evaluateHand, compareHands } from "./main";

function card(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}

describe("2.1 - High Card Detection & Comparison", () => {
  describe("High card detection", () => {
    test("should detect a high card hand (no pairs, straight, or flush)", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });

    test("should not misclassify a pair as high card", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.HIGH_CARD);
      expect(hand.category).toBe(HandCategory.ONE_PAIR);
    });

    test("should not misclassify a straight as high card", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.HIGH_CARD);
      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should not misclassify a flush as high card", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.HIGH_CARD);
      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect high card with low ranks", () => {
      const cards: Card[] = [
        card("7", "♣"),
        card("5", "♦"),
        card("4", "♥"),
        card("3", "♠"),
        card("2", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });
  });

  describe("High card comparison (descending order)", () => {
    test("should recognize A-K-Q-J-9 beats A-K-Q-J-8", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("8", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-K-Q-J-8 loses to A-K-Q-J-9", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize K-Q-J-9-8 beats K-Q-J-9-7", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("9", "♠"),
        card("7", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when all cards are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("9", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should compare second-highest card if highest is equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should compare third card when first two are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("J", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });
  });
});

describe("2.2 - One Pair Detection & Tie-Breaks", () => {
  describe("One pair detection", () => {
    test("should detect a pair of Aces", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.ONE_PAIR);
    });

    test("should detect a pair of 2s", () => {
      const cards: Card[] = [
        card("2", "♣"),
        card("2", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.ONE_PAIR);
    });

    test("should detect a pair with various kickers", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("9", "♦"),
        card("7", "♥"),
        card("5", "♠"),
        card("3", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.ONE_PAIR);
    });

    test("should not misclassify two pair as one pair", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.ONE_PAIR);
      expect(hand.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should not misclassify three of a kind as one pair", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.ONE_PAIR);
      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });
  });

  describe("One pair comparison - pair rank", () => {
    test("should recognize pair of Aces beats pair of Kings", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("A", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize pair of Kings loses to pair of Aces", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("A", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize pair of 5s beats pair of 2s", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("One pair comparison - kicker tie-breaks (descending order)", () => {
    test("should compare highest kicker when pairs are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize pair with A-K-Q kickers beats pair with A-K-J kickers", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should compare second kicker when first kicker is equal", () => {
      const hand1 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("A", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should compare third kicker when first two kickers are equal", () => {
      const hand1 = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when pair and all kickers are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("A", "♥"),
        card("K", "♦"),
        card("Q", "♣"),
        card("J", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should recognize A-A-K-Q-J beats A-A-K-Q-9", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("Q", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("One pair - tie-break with multiple kickers", () => {
    test("should recognize 5-5-A-K-Q beats 5-5-A-K-J", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 5-5-A-J-9 beats 5-5-A-J-8", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("A", "♥"),
        card("J", "♠"),
        card("9", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("A", "♥"),
        card("J", "♠"),
        card("8", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 2-2-7-5-3 loses to 2-2-7-6-4", () => {
      const hand1 = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("7", "♥"),
        card("5", "♠"),
        card("3", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("4", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });
  });
});
