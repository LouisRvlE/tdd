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

describe("2.3 - Two Pair Detection & Tie-Breaks", () => {
  describe("Two pair detection", () => {
    test("should detect two pairs (Aces and Kings)", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should detect two pairs (low ranks)", () => {
      const cards: Card[] = [
        card("5", "♣"),
        card("5", "♦"),
        card("3", "♥"),
        card("3", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should detect two pairs with various kicker", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("9", "♦"),
        card("7", "♥"),
        card("7", "♠"),
        card("2", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.TWO_PAIR);
    });

    test("should not misclassify full house as two pair", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.TWO_PAIR);
      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should not misclassify three of a kind as two pair", () => {
      const cards: Card[] = [
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("Q", "♠"),
        card("J", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.TWO_PAIR);
      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });
  });

  describe("Two pair comparison - higher pair rank", () => {
    test("should recognize A-A-K-K-Q beats A-A-J-J-K", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("J", "♥"),
        card("J", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize K-K-Q-Q-A beats K-K-J-J-A", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("Q", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("J", "♥"),
        card("J", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Two pair comparison - lower pair rank (when higher pair equal)", () => {
    test("should recognize A-A-K-K-Q beats A-A-K-K-J when higher pair equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 9-9-5-5-A beats 9-9-4-4-K", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("5", "♥"),
        card("5", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("4", "♥"),
        card("4", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Two pair comparison - kicker (when both pairs equal)", () => {
    test("should recognize A-A-K-K-Q beats A-A-K-K-J", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-A-K-K-9 beats A-A-K-K-8", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("9", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("8", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when both pairs and kicker are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("K", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("A", "♥"),
        card("K", "♦"),
        card("K", "♣"),
        card("Q", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should recognize 5-5-3-3-A beats 5-5-3-3-K", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("3", "♥"),
        card("3", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("3", "♥"),
        card("3", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Two pair comparison - complex scenarios", () => {
    test("should recognize K-K-Q-Q-A beats J-J-9-9-A", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("Q", "♠"),
        card("A", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("J", "♣"),
        card("J", "♦"),
        card("9", "♥"),
        card("9", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 7-7-6-6-K beats 7-7-6-6-Q", () => {
      const hand1 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("6", "♥"),
        card("6", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("6", "♥"),
        card("6", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });
});

describe("2.4 - Three of a Kind Detection & Tie-Breaks", () => {
  describe("Three of a kind detection", () => {
    test("should detect three Aces", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    test("should detect three 2s", () => {
      const cards: Card[] = [
        card("2", "♣"),
        card("2", "♦"),
        card("2", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    test("should detect three of a kind with various kickers", () => {
      const cards: Card[] = [
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("5", "♠"),
        card("3", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.THREE_OF_A_KIND);
    });

    test("should not misclassify full house as three of a kind", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("5", "♠"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.THREE_OF_A_KIND);
      expect(hand.category).toBe(HandCategory.FULL_HOUSE);
    });

    test("should not misclassify four of a kind as three of a kind", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("9", "♦"),
        card("9", "♥"),
        card("9", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.THREE_OF_A_KIND);
      expect(hand.category).toBe(HandCategory.FOUR_OF_A_KIND);
    });
  });

  describe("Three of a kind comparison - triplet rank", () => {
    test("should recognize A-A-A beats K-K-K", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("A", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 5-5-5 beats 2-2-2", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("2", "♣"),
        card("2", "♦"),
        card("2", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 9-9-9 beats 8-8-8", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("9", "♦"),
        card("9", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Three of a kind comparison - kicker tie-breaks (descending order)", () => {
    test("should compare highest kicker when triplet is equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-A-A-K-Q beats A-A-A-K-J", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
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
        card("7", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("7", "♣"),
        card("7", "♦"),
        card("7", "♥"),
        card("A", "♠"),
        card("Q", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 5-5-5-A-K beats 5-5-5-A-J", () => {
      const hand1 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("5", "♦"),
        card("5", "♥"),
        card("A", "♠"),
        card("J", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when triplet and both kickers are equal", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("A", "♦"),
        card("A", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("A", "♥"),
        card("A", "♦"),
        card("K", "♣"),
        card("Q", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should recognize 3-3-3-9-7 loses to 3-3-3-9-8", () => {
      const hand1 = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("3", "♥"),
        card("9", "♠"),
        card("7", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("3", "♣"),
        card("3", "♦"),
        card("3", "♥"),
        card("9", "♠"),
        card("8", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize 6-6-6-J-8 beats 6-6-6-J-7", () => {
      const hand1 = evaluateHand([
        card("6", "♣"),
        card("6", "♦"),
        card("6", "♥"),
        card("J", "♠"),
        card("8", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("6", "♣"),
        card("6", "♦"),
        card("6", "♥"),
        card("J", "♠"),
        card("7", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Three of a kind comparison - complex scenarios", () => {
    test("should recognize K-K-K-A-J beats Q-Q-Q-A-K", () => {
      const hand1 = evaluateHand([
        card("K", "♣"),
        card("K", "♦"),
        card("K", "♥"),
        card("A", "♠"),
        card("J", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("Q", "♣"),
        card("Q", "♦"),
        card("Q", "♥"),
        card("A", "♠"),
        card("K", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 8-8-8-K-Q loses to 8-8-8-K-A", () => {
      const hand1 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("K", "♠"),
        card("Q", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("8", "♣"),
        card("8", "♦"),
        card("8", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });
  });
});

describe("2.5 - Straight Detection (All Types)", () => {
  describe("Straight detection - regular straights", () => {
    test("should detect A-K-Q-J-10 straight", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should detect 9-8-7-6-5 straight", () => {
      const cards: Card[] = [
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("5", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should detect K-Q-J-10-9 straight", () => {
      const cards: Card[] = [
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should detect 5-4-3-2-A as wheel (Ace-low straight)", () => {
      const cards: Card[] = [
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });
  });

  describe("Straight detection - Ace-high vs Ace-low", () => {
    test("should detect Ace-high straight (10-J-Q-K-A)", () => {
      const cards: Card[] = [
        card("10", "♣"),
        card("J", "♦"),
        card("Q", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT);
    });

    test("should recognize Ace-high straight is highest", () => {
      const aceHigh = evaluateHand([
        card("10", "♣"),
        card("J", "♦"),
        card("Q", "♥"),
        card("K", "♠"),
        card("A", "♣"),
      ]);

      const wheel = evaluateHand([
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(aceHigh, wheel)).toBe(1);
    });
  });

  describe("Straight detection - not confused with other patterns", () => {
    test("should not misclassify as straight when pair exists", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("J", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.ONE_PAIR);
    });

    test("should not misclassify as straight when flush exists", () => {
      const cards: Card[] = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect straight flush over flush", () => {
      const cards: Card[] = [
        card("10", "♣"),
        card("J", "♣"),
        card("Q", "♣"),
        card("K", "♣"),
        card("A", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.STRAIGHT_FLUSH);
    });
  });

  describe("Straight comparison", () => {
    test("should recognize A-K-Q-J-10 beats K-Q-J-10-9", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize 9-8-7-6-5 beats wheel (5-4-3-2-A)", () => {
      const hand1 = evaluateHand([
        card("9", "♣"),
        card("8", "♦"),
        card("7", "♥"),
        card("6", "♠"),
        card("5", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize wheel (A-2-3-4-5) beats nothing", () => {
      const wheel = evaluateHand([
        card("5", "♣"),
        card("4", "♦"),
        card("3", "♥"),
        card("2", "♠"),
        card("A", "♣"),
      ]);

      const sixHigh = evaluateHand([
        card("6", "♣"),
        card("5", "♦"),
        card("4", "♥"),
        card("3", "♠"),
        card("2", "♣"),
      ]);

      expect(compareHands(wheel, sixHigh)).toBe(-1);
    });

    test("should recognize tie when straights are identical", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♥"),
        card("J", "♠"),
        card("10", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♠"),
        card("K", "♣"),
        card("Q", "♦"),
        card("J", "♥"),
        card("10", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });
  });

  describe("Invalid straights", () => {
    test("should not detect Q-K-A-2-3 as straight (no wraparound)", () => {
      const cards: Card[] = [
        card("Q", "♣"),
        card("K", "♦"),
        card("A", "♥"),
        card("2", "♠"),
        card("3", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.STRAIGHT);
      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });
  });
});

describe("2.6 - Flush Detection & Comparison", () => {
  describe("Flush detection", () => {
    test("should detect flush (5 hearts)", () => {
      const cards: Card[] = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect flush (5 clubs)", () => {
      const cards: Card[] = [
        card("A", "♣"),
        card("10", "♣"),
        card("8", "♣"),
        card("5", "♣"),
        card("2", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect flush (5 diamonds)", () => {
      const cards: Card[] = [
        card("K", "♦"),
        card("J", "♦"),
        card("9", "♦"),
        card("7", "♦"),
        card("3", "♦"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should detect flush (5 spades)", () => {
      const cards: Card[] = [
        card("Q", "♠"),
        card("10", "♠"),
        card("8", "♠"),
        card("6", "♠"),
        card("4", "♠"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).toBe(HandCategory.FLUSH);
    });

    test("should not misclassify as flush when only 4 cards match suit", () => {
      const cards: Card[] = [
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♣"),
      ];

      const hand = evaluateHand(cards);

      expect(hand.category).not.toBe(HandCategory.FLUSH);
      expect(hand.category).toBe(HandCategory.HIGH_CARD);
    });
  });

  describe("Flush comparison - descending rank order", () => {
    test("should recognize A-K-Q-J-9 flush beats A-K-Q-J-8 flush", () => {
      const hand1 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("8", "♥"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-K-Q-J-10 flush beats K-Q-J-10-9 flush", () => {
      const hand1 = evaluateHand([
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("10", "♠"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("10", "♥"),
        card("9", "♥"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize tie when flush cards are identical", () => {
      const hand1 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("K", "♣"),
        card("Q", "♣"),
        card("J", "♣"),
        card("9", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(0);
    });

    test("should compare second highest when first is equal", () => {
      const hand1 = evaluateHand([
        card("A", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
        card("8", "♥"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("J", "♥"),
        card("9", "♥"),
        card("8", "♥"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });

    test("should recognize A-K-Q-10-9 beats A-K-Q-10-8", () => {
      const hand1 = evaluateHand([
        card("A", "♦"),
        card("K", "♦"),
        card("Q", "♦"),
        card("10", "♦"),
        card("9", "♦"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♦"),
        card("K", "♦"),
        card("Q", "♦"),
        card("10", "♦"),
        card("8", "♦"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize A-J-9-7-5 beats A-J-9-7-4", () => {
      const hand1 = evaluateHand([
        card("A", "♣"),
        card("J", "♣"),
        card("9", "♣"),
        card("7", "♣"),
        card("5", "♣"),
      ]);

      const hand2 = evaluateHand([
        card("A", "♣"),
        card("J", "♣"),
        card("9", "♣"),
        card("7", "♣"),
        card("4", "♣"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });
  });

  describe("Flush vs other patterns", () => {
    test("should recognize flush beats straight", () => {
      const flush = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      const straight = evaluateHand([
        card("A", "♣"),
        card("K", "♦"),
        card("Q", "♠"),
        card("J", "♥"),
        card("10", "♣"),
      ]);

      expect(compareHands(flush, straight)).toBe(1);
    });

    test("should recognize straight flush beats flush", () => {
      const straightFlush = evaluateHand([
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("10", "♠"),
      ]);

      const flush = evaluateHand([
        card("A", "♥"),
        card("K", "♥"),
        card("Q", "♥"),
        card("J", "♥"),
        card("9", "♥"),
      ]);

      expect(compareHands(straightFlush, flush)).toBe(1);
    });
  });

  describe("Complex flush scenarios", () => {
    test("should recognize K-J-9-7-5 flush beats K-J-9-7-4 flush", () => {
      const hand1 = evaluateHand([
        card("K", "♠"),
        card("J", "♠"),
        card("9", "♠"),
        card("7", "♠"),
        card("5", "♠"),
      ]);

      const hand2 = evaluateHand([
        card("K", "♠"),
        card("J", "♠"),
        card("9", "♠"),
        card("7", "♠"),
        card("4", "♠"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(1);
    });

    test("should recognize Q-10-8-6-2 loses to Q-10-8-6-3", () => {
      const hand1 = evaluateHand([
        card("Q", "♦"),
        card("10", "♦"),
        card("8", "♦"),
        card("6", "♦"),
        card("2", "♦"),
      ]);

      const hand2 = evaluateHand([
        card("Q", "♦"),
        card("10", "♦"),
        card("8", "♦"),
        card("6", "♦"),
        card("3", "♦"),
      ]);

      expect(compareHands(hand1, hand2)).toBe(-1);
    });
  });
});
