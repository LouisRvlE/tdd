import { Card, Rank, Suit } from "./types";
import { parseCard, rankToValue } from "./main";

describe("3.1 - Card Parsing & Representation", () => {
  describe("Card parsing from string notation", () => {
    test("should parse Ace of clubs", () => {
      const card = parseCard("A♣");
      expect(card.rank).toBe("A");
      expect(card.suit).toBe("♣");
    });

    test("should parse 2 of diamonds", () => {
      const card = parseCard("2♦");
      expect(card.rank).toBe("2");
      expect(card.suit).toBe("♦");
    });

    test("should parse King of hearts", () => {
      const card = parseCard("K♥");
      expect(card.rank).toBe("K");
      expect(card.suit).toBe("♥");
    });

    test("should parse 10 of spades", () => {
      const card = parseCard("10♠");
      expect(card.rank).toBe("10");
      expect(card.suit).toBe("♠");
    });

    test("should parse Queen of diamonds", () => {
      const card = parseCard("Q♦");
      expect(card.rank).toBe("Q");
      expect(card.suit).toBe("♦");
    });

    test("should parse Jack of clubs", () => {
      const card = parseCard("J♣");
      expect(card.rank).toBe("J");
      expect(card.suit).toBe("♣");
    });

    test("should parse all face cards", () => {
      const jack = parseCard("J♥");
      const queen = parseCard("Q♠");
      const king = parseCard("K♦");
      const ace = parseCard("A♣");

      expect(jack.rank).toBe("J");
      expect(queen.rank).toBe("Q");
      expect(king.rank).toBe("K");
      expect(ace.rank).toBe("A");
    });

    test("should parse all numbered cards", () => {
      const two = parseCard("2♣");
      const five = parseCard("5♦");
      const nine = parseCard("9♥");
      const ten = parseCard("10♠");

      expect(two.rank).toBe("2");
      expect(five.rank).toBe("5");
      expect(nine.rank).toBe("9");
      expect(ten.rank).toBe("10");
    });

    test("should parse all suits", () => {
      const clubs = parseCard("A♣");
      const diamonds = parseCard("K♦");
      const hearts = parseCard("Q♥");
      const spades = parseCard("J♠");

      expect(clubs.suit).toBe("♣");
      expect(diamonds.suit).toBe("♦");
      expect(hearts.suit).toBe("♥");
      expect(spades.suit).toBe("♠");
    });
  });

  describe("Rank to numeric value conversion", () => {
    test("should convert A to 14", () => {
      expect(rankToValue("A")).toBe(14);
    });

    test("should convert K to 13", () => {
      expect(rankToValue("K")).toBe(13);
    });

    test("should convert Q to 12", () => {
      expect(rankToValue("Q")).toBe(12);
    });

    test("should convert J to 11", () => {
      expect(rankToValue("J")).toBe(11);
    });

    test("should convert numeric ranks correctly", () => {
      expect(rankToValue("10")).toBe(10);
      expect(rankToValue("9")).toBe(9);
      expect(rankToValue("8")).toBe(8);
      expect(rankToValue("7")).toBe(7);
      expect(rankToValue("6")).toBe(6);
      expect(rankToValue("5")).toBe(5);
      expect(rankToValue("4")).toBe(4);
      expect(rankToValue("3")).toBe(3);
      expect(rankToValue("2")).toBe(2);
    });

    test("should rank Ace highest", () => {
      expect(rankToValue("A")).toBeGreaterThan(rankToValue("K"));
    });

    test("should rank 2 lowest", () => {
      expect(rankToValue("2")).toBeLessThan(rankToValue("3"));
    });
  });

  describe("Card type contract", () => {
    test("should return Card interface with rank and suit", () => {
      const card = parseCard("A♣");

      expect(card).toHaveProperty("rank");
      expect(card).toHaveProperty("suit");
      expect(Object.keys(card).length).toBe(2);
    });

    test("should create consistent card objects", () => {
      const card1 = parseCard("K♦");
      const card2 = parseCard("K♦");

      expect(card1.rank).toBe(card2.rank);
      expect(card1.suit).toBe(card2.suit);
    });

    test("should distinguish cards by rank", () => {
      const aceClubs = parseCard("A♣");
      const kingClubs = parseCard("K♣");

      expect(aceClubs.rank).not.toBe(kingClubs.rank);
      expect(aceClubs.suit).toBe(kingClubs.suit);
    });

    test("should distinguish cards by suit", () => {
      const aceClubs = parseCard("A♣");
      const aceDiamonds = parseCard("A♦");

      expect(aceClubs.rank).toBe(aceDiamonds.rank);
      expect(aceClubs.suit).not.toBe(aceDiamonds.suit);
    });
  });
});
