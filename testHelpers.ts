import { Card, Rank, Suit } from "./types";

export function card(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}
