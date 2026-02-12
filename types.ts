/**
 * Core type definitions for Texas Hold'em Poker Hand Evaluator
 */

/**
 * Represents a single card
 */
export interface Card {
  rank: Rank;
  suit: Suit;
}

/**
 * Card rank (2-14, where 14 = Ace)
 * Used for numerical comparison
 */
export type RankValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

/**
 * Card rank as string
 */
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

/**
 * Card suit symbol
 */
export type Suit = "♣" | "♦" | "♥" | "♠";

/**
 * Poker hand categories, ordered highest to lowest
 */
export enum HandCategory {
  STRAIGHT_FLUSH = 8,
  FOUR_OF_A_KIND = 7,
  FULL_HOUSE = 6,
  FLUSH = 5,
  STRAIGHT = 4,
  THREE_OF_A_KIND = 3,
  TWO_PAIR = 2,
  ONE_PAIR = 1,
  HIGH_CARD = 0,
}

/**
 * Represents a ranked 5-card poker hand
 */
export interface Hand {
  category: HandCategory;
  /**
   * Tie-break values specific to the category
   * Used for comparing two hands of the same category
   * Array of RankValues in importance order
   */
  tieBreakValues: RankValue[];
  /**
   * The 5 cards that make up this hand
   */
  cards: Card[];
}

/**
 * Result of evaluating a player's best hand
 */
export interface EvaluationResult {
  /**
   * Player identifier
   */
  playerId: string | number;
  /**
   * The player's best 5-card hand
   */
  bestHand: Hand;
  /**
   * The best 5 cards, ordered according to the ordering convention
   */
  chosen5: Card[];
}

/**
 * Result of comparing multiple players
 */
export interface ComparisonResult {
  /**
   * Player ID(s) of the winner(s)
   */
  winners: (string | number)[];
  /**
   * All player evaluations, sorted by ranking
   */
  rankings: EvaluationResult[];
  /**
   * Whether there is a tie for first place
   */
  isTie: boolean;
}

/**
 * Helper function signatures (to be implemented)
 */

/**
 * Parse a card from string notation (e.g., "A♣", "10♥", "K♦")
 */
export type ParseCard = (cardStr: string) => Card;

/**
 * Convert rank string to numeric value
 */
export type RankToValue = (rank: Rank) => RankValue;

/**
 * Evaluate a single 5-card hand
 */
export type EvaluateHand = (cards: Card[]) => Hand;

/**
 * Find the best 5-card hand from 7 cards (2 hole + 5 board)
 */
export type FindBestHand = (allCards: Card[]) => Hand;

/**
 * Get the chosen 5 cards in the correct order for the hand category
 */
export type OrderChosen5 = (hand: Hand) => Card[];

/**
 * Compare two hands
 * Returns: -1 if hand1 < hand2, 0 if equal, 1 if hand1 > hand2
 */
export type CompareHands = (hand1: Hand, hand2: Hand) => number;

/**
 * Find winner(s) among multiple players' evaluation results
 */
export type ComparePlayerResults = (
  results: EvaluationResult[],
) => ComparisonResult;
