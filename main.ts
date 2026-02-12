import { Card, Hand, HandCategory, Rank, RankValue } from "./types";

export function rankToValue(rank: Rank): RankValue {
  switch (rank) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 11;
    default:
      return parseInt(rank) as RankValue;
  }
}

export function parseCard(cardStr: string): Card {
  const suit = cardStr.slice(-1) as any;
  const rank = cardStr.slice(0, -1) as Rank;

  return { rank, suit };
}

function isFlush(cards: Card[]): boolean {
  const suit = cards[0].suit;
  return cards.every((card) => card.suit === suit);
}

function isStraight(cards: Card[]): boolean {
  const values = cards.map((c) => rankToValue(c.rank)).sort((a, b) => a - b);

  const isConsecutive = values.every(
    (val, i) => i === 0 || val === values[i - 1] + 1,
  );
  if (isConsecutive) return true;

  if (
    values[0] === 2 &&
    values[1] === 3 &&
    values[2] === 4 &&
    values[3] === 5 &&
    values[4] === 14
  ) {
    return true;
  }

  return false;
}

function getStraightHigh(cards: Card[]): RankValue {
  const values = cards.map((c) => rankToValue(c.rank)).sort((a, b) => a - b);

  if (
    values[0] === 2 &&
    values[1] === 3 &&
    values[2] === 4 &&
    values[3] === 5 &&
    values[4] === 14
  ) {
    return 5;
  }

  return Math.max(...values) as RankValue;
}

function getRankCounts(cards: Card[]): [Rank, number][] {
  const counts = new Map<Rank, number>();

  for (const card of cards) {
    counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
  }

  return Array.from(counts.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return rankToValue(b[0]) - rankToValue(a[0]);
  });
}

export function evaluateHand(cards: Card[]): Hand {
  if (cards.length !== 5) {
    throw new Error("Hand must contain exactly 5 cards");
  }

  const isFlushHand = isFlush(cards);
  const isStraightHand = isStraight(cards);
  const rankCounts = getRankCounts(cards);

  const counts = rankCounts.map(([, count]) => count);

  let category: HandCategory;
  let tieBreakValues: RankValue[];

  if (isStraightHand && isFlushHand) {
    category = HandCategory.STRAIGHT_FLUSH;
    tieBreakValues = [getStraightHigh(cards)];
  } else if (counts[0] === 4) {
    category = HandCategory.FOUR_OF_A_KIND;
    tieBreakValues = [
      rankToValue(rankCounts[0][0]),
      rankToValue(rankCounts[1][0]),
    ];
  } else if (counts[0] === 3 && counts[1] === 2) {
    category = HandCategory.FULL_HOUSE;
    tieBreakValues = [
      rankToValue(rankCounts[0][0]),
      rankToValue(rankCounts[1][0]),
    ];
  } else if (isFlushHand) {
    category = HandCategory.FLUSH;
    tieBreakValues = rankCounts.map(([rank]) => rankToValue(rank));
  } else if (isStraightHand) {
    category = HandCategory.STRAIGHT;
    tieBreakValues = [getStraightHigh(cards)];
  } else if (counts[0] === 3) {
    category = HandCategory.THREE_OF_A_KIND;
    tieBreakValues = [
      rankToValue(rankCounts[0][0]),
      rankToValue(rankCounts[1][0]),
      rankToValue(rankCounts[2][0]),
    ];
  } else if (counts[0] === 2 && counts[1] === 2) {
    category = HandCategory.TWO_PAIR;
    tieBreakValues = [
      rankToValue(rankCounts[0][0]),
      rankToValue(rankCounts[1][0]),
      rankToValue(rankCounts[2][0]),
    ];
  } else if (counts[0] === 2) {
    category = HandCategory.ONE_PAIR;
    tieBreakValues = [
      rankToValue(rankCounts[0][0]),
      rankToValue(rankCounts[1][0]),
      rankToValue(rankCounts[2][0]),
      rankToValue(rankCounts[3][0]),
    ];
  } else {
    category = HandCategory.HIGH_CARD;
    tieBreakValues = rankCounts.map(([rank]) => rankToValue(rank));
  }

  return {
    category,
    tieBreakValues,
    cards,
  };
}

export function compareHands(hand1: Hand, hand2: Hand): number {
  if (hand1.category !== hand2.category) {
    return hand1.category > hand2.category ? 1 : -1;
  }

  for (let i = 0; i < hand1.tieBreakValues.length; i++) {
    const val1 = hand1.tieBreakValues[i];
    const val2 = hand2.tieBreakValues[i];

    if (val1 !== val2) {
      return val1 > val2 ? 1 : -1;
    }
  }

  return 0;
}

function generateCombinations(cards: Card[], size: number): Card[][] {
  if (size === 0) return [[]];
  if (cards.length === 0) return [];

  const [first, ...rest] = cards;
  const combosWith = generateCombinations(rest, size - 1).map((combo) => [
    first,
    ...combo,
  ]);
  const combosWithout = generateCombinations(rest, size);

  return [...combosWith, ...combosWithout];
}

export function findBestHand(sevenCards: Card[]): Hand {
  if (sevenCards.length !== 7) {
    throw new Error("Must provide exactly 7 cards");
  }

  const combinations = generateCombinations(sevenCards, 5);

  let bestHand = evaluateHand(combinations[0]);

  for (let i = 1; i < combinations.length; i++) {
    const currentHand = evaluateHand(combinations[i]);
    if (compareHands(currentHand, bestHand) > 0) {
      bestHand = currentHand;
    }
  }

  return bestHand;
}

const main = () => {
  console.log("Texas Hold'em Poker Hand Evaluator");
};

main();
