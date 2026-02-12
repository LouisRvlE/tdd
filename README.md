# Texas Hold'em Poker Hand Evaluator

A Test-Driven Development project that evaluates and compares Texas Hold'em poker hands.

## Project Goal

Given:
- 5 community cards (the board)
- 2 hole cards per player

Determine:
1. Each player's best 5-card poker hand from their 7 available cards
2. Compare all players and identify winner(s) or detect ties
3. The exact 5 cards chosen and the hand category

## Poker Hand Categories (Highest to Lowest)

1. **Straight Flush** — Five cards in sequence, all of same suit
2. **Four of a Kind** — Four cards of same rank
3. **Full House** — Three of a kind + pair
4. **Flush** — Five cards of same suit
5. **Straight** — Five cards in sequence
6. **Three of a Kind** — Three cards of same rank
7. **Two Pair** — Two different pairs
8. **One Pair** — Two cards of same rank
9. **High Card** — No matching pattern

### Special Ace Rules

- **Ace-low straight (the "wheel")**: A-2-3-4-5 is a valid 5-high straight
- **Ace-high straight**: 10-J-Q-K-A is the highest straight
- **No wrap-around**: Q-K-A-2-3 is **invalid**
- Ace ranks high in all other contexts (pairs, high card, etc.)

## Core Rules

- Each player forms their best 5-card hand using any combination of their 2 hole cards and 5 board cards
- Players can use both hole cards, one hole card, or zero hole cards ("board plays")
- **No suit-based tie-breaking**: Suits only matter for detecting flushes
- Ties are possible; multiple players with identical best hands split the pot

## Card Representation

Cards are represented as strings in the format: `<rank><suit>`

### Ranks (in order)
- `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `J`, `Q`, `K`, `A`

### Suits
- `♣` (clubs)
- `♦` (diamonds)
- `♥` (hearts)
- `♠` (spades)

### Examples
- `A♣` = Ace of clubs
- `10♥` = Ten of hearts
- `K♦` = King of diamonds

## Tie-Break Rules (Within Same Category)

### Straight / Straight Flush
Compare the highest card in the straight sequence.
- 5-high straight (wheel): A-2-3-4-5 beats nothing
- 6-high straight: 6-5-4-3-2 beats wheel
- A-high straight: 10-J-Q-K-A is highest possible

### Four of a Kind
1. Compare the rank of the four cards
2. If equal, compare the kicker (remaining single card)

### Full House
1. Compare the rank of the three-of-a-kind
2. If equal, compare the rank of the pair

### Flush
Compare the five flush cards in **descending order** (highest card first, then next highest, etc.)

### Three of a Kind
1. Compare the rank of the triplet
2. If equal, compare the two remaining kickers in descending order

### Two Pair
1. Compare the higher pair's rank
2. Compare the lower pair's rank
3. Compare the kicker

### One Pair
1. Compare the pair's rank
2. Compare the remaining three kickers in descending order

### High Card
Compare all five cards in descending order

## Chosen 5-Card Ordering (for Deterministic Results)

The output must include the exact 5 cards chosen, ordered consistently:

- **Straight/Straight Flush**: High-to-low in sequence order
  - Example: A♣ K♠ Q♥ J♦ 10♣ (for A-high straight)
  - Example: 5♣ 4♠ 3♥ 2♦ A♣ (for wheel, A-low)
  
- **Four of a Kind**: Four cards first (by rank), then kicker
  - Example: 7♣ 7♦ 7♥ 7♠ A♣
  
- **Full House**: Three cards first (by rank), then two cards (pair)
  - Example: K♣ K♦ K♥ 5♠ 5♦
  
- **Flush**: Descending rank order
  - Example: A♥ J♥ 9♥ 6♥ 4♥
  
- **Three of a Kind**: Three cards first (by rank), then two kickers in descending order
  - Example: 9♣ 9♦ 9♥ A♠ K♦
  
- **Two Pair**: Higher pair, lower pair, then kicker
  - Example: K♣ K♦ 5♥ 5♠ A♦
  
- **One Pair**: Pair first (by rank), then three kickers in descending order
  - Example: J♣ J♦ A♠ K♥ 9♣
  
- **High Card**: Descending rank order
  - Example: A♥ K♣ Q♦ J♠ 9♣

## Input Validity Assumptions

**This implementation assumes no duplicate cards.** Each card can appear at most once across all 7 cards (5 board + 2 hole).

If duplicate cards are provided, behavior is undefined. If you need validation, refer to the test suite for expected error handling.

## How to Run

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run with Coverage
```bash
npm run test:coverage
```

### Run Application
```bash
npm start
```

## Examples from the Assignment

### Example A — Ace-Low Straight (Wheel)
```
Board: A♣ 2♦ 3♥ 4♠ 9♦
Player: 5♣ K♦
Best:
  Category: Straight
  Chosen 5: 5♣ 4♠ 3♥ 2♦ A♣ (5-high)
```

### Example B — Ace-High Straight
```
Board: 10♣ J♦ Q♥ K♠ 2♦
Player: A♣ 3♦
Best:
  Category: Straight
  Chosen 5: A♣ K♠ Q♥ J♦ 10♣ (A-high)
```

### Example C — Flush Selection
```
Board: A♥ J♥ 9♥ 4♥ 2♣
Player: 6♥ K♦
Best:
  Category: Flush
  Chosen 5: A♥ J♥ 9♥ 6♥ 4♥ (best 5 of 6 hearts)
```

### Example D — Board Plays (Tie)
```
Board: 5♣ 6♦ 7♥ 8♠ 9♦
Player 1: A♣ A♦
Player 2: K♣ Q♦
Best for both:
  Category: Straight
  Chosen 5: 9♦ 8♠ 7♥ 6♦ 5♣
Result: Tie / Split
```

### Example E — Quads with Kicker
```
Board: 7♣ 7♦ 7♥ 7♠ 2♦
Player 1: A♣ K♣
Player 2: Q♣ J♣
Best:
  Category: Four of a Kind (Sevens)
  Chosen 5 (P1): 7♣ 7♦ 7♥ 7♠ A♣
  Chosen 5 (P2): 7♣ 7♦ 7♥ 7♠ Q♣
Result: Player 1 wins (A kicker beats Q kicker)
```

## Architecture

### Core Interfaces

See `types.ts` for the complete type definitions:

- **Card**: Represents a single card (rank + suit)
- **Hand**: A 5-card poker hand with category and tie-break values
- **EvaluationResult**: Player's best hand + the 5 cards chosen
- **ComparisonResult**: Winner(s) and losers

### Key Functions

- `parseCard(str): Card` — Parse card from string notation
- `evaluateHand(cards: Card[]): Hand` — Evaluate a 5-card hand
- `findBestHand(allCards: Card[]): Hand` — Find best 5-card hand from 7 cards
- `compareHands(hand1: Hand, hand2: Hand): number` — Compare two hands (-1, 0, 1)
- `comparePlayerResults(results: EvaluationResult[]): ComparisonResult` — Find winner(s)

## Testing Strategy (TDD)

Tests are organized by hand category and scenario:

1. **Single hand detection tests** — Verify each category is correctly identified
2. **Tie-break tests** — Verify comparison logic within each category
3. **Best-of-7 tests** — Verify correct hand selection from 7 cards
4. **Multi-player tests** — Verify winner/tie detection
5. **Edge case tests** — Wheel straight, board plays, etc.

## References

- [Wikipedia: List of Poker Hands](https://en.wikipedia.org/wiki/List_of_poker_hands)
- [Texas Hold'em Rules](https://en.wikipedia.org/wiki/Texas_hold_%27em)
