import { Category, PuzzleMeta } from '../types';

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'logical', label: 'Logical', icon: '🧠' },
  { id: 'math', label: 'Math & Analytical', icon: '📐' },
  { id: 'arrangement', label: 'Arrangement', icon: '🎯' },
  { id: 'spatial', label: 'Shape & Spatial', icon: '🔷' },
];

export const PUZZLES: PuzzleMeta[] = [
  // 🧠 Logical
  {
    id: 'water-jug',
    number: 1,
    name: 'Water Jug Problem',
    category: 'logical',
    companies: ['Microsoft', 'Google', 'Goldman Sachs'],
    difficulty: 'Medium',
    icon: '💧',
    problemStatement:
      'You are given an empty 4-liter jug and an empty 9-liter jug with an unlimited water supply. Neither jug has markings. How can you measure exactly 6 liters of water?',
    hints: [
      'Think about mathematical greatest common divisors and linear combinations: 9x + 4y = 6.',
      'Try repeatedly filling the 9L jug and pouring it into the 4L jug, emptying the 4L jug whenever it fills up.',
      'Pattern: Fill 9L → Pour to 4L (leaving 5L in 9L) → Empty 4L → Pour to 4L (leaving 1L in 9L) → Empty 4L → Pour 1L into 4L → Fill 9L → Pour into 4L (which takes 3L, leaving exactly 6L in the 9L jug!).'
    ],
    explanation:
      'By filling the 9L jug and repeatedly pouring into the 4L jug, we calculate remainders: 9 - 4 - 4 = 1L. We transfer that 1L into the 4L jug (leaving 3L space). Then we fill the 9L jug again and pour into the 4L jug until full (3L poured). The 9L jug now holds exactly 9 - 3 = 6 Liters!',
    interviewTip:
      'In interviews, interviewers use this to test state-space graph search (BFS) and the Extended Euclidean algorithm (Bézout’s identity: ax + by = target is solvable iff target is a multiple of gcd(a, b)).'
  },
  {
    id: 'bulbs-switches',
    number: 2,
    name: '3 Bulbs and 3 Switches',
    category: 'logical',
    companies: ['MakeMyTrip', 'Qualcomm', 'Amazon'],
    difficulty: 'Medium',
    icon: '💡',
    problemStatement:
      'In room A there are three switches (1, 2, 3) connected to three light bulbs in room B. You cannot see room B from room A. You may manipulate the switches as much as you like, but you can only enter room B ONCE. How do you identify which switch controls which bulb?',
    hints: [
      'Incandescent light bulbs produce two observable physical phenomena when powered: light and something else.',
      'Heat! Light bulbs get hot when left on for several minutes.',
      'Turn Switch 1 ON for 5-10 minutes, then turn it OFF. Turn Switch 2 ON and leave it ON. Keep Switch 3 OFF. Walk into the room!'
    ],
    explanation:
      'When you enter room B: The bulb that is currently ON corresponds to Switch 2. The bulb that is OFF but warm to the touch corresponds to Switch 1. The bulb that is OFF and cold corresponds to Switch 3!',
    interviewTip:
      'This puzzle tests your ability to think outside digital binary constraints (0 or 1) by utilizing physical properties (state = {ON, OFF-Warm, OFF-Cold}) to encode 3 states.'
  },
  {
    id: 'prisoners-hats',
    number: 14,
    name: '100 Prisoners & Hats',
    category: 'logical',
    companies: ['Google', 'Microsoft', 'Palantir'],
    difficulty: 'Hard',
    icon: '🎩',
    problemStatement:
      '100 prisoners stand in a single line facing forward. Each wears either a Red or Black hat. Each prisoner can see all hats in front of them, but cannot see their own hat or hats behind them. Starting from the back, each must announce their hat color. They can agree on a strategy beforehand. What strategy guarantees at least 99 prisoners survive?',
    hints: [
      'The very first prisoner at the back has no information about their own hat, but has complete information about the parity of all 99 hats in front.',
      'Use modulo arithmetic (parity): Assign 0 to Black and 1 to Red.',
      'The first prisoner announces "Red" if the sum of red hats in front is even, or "Black" if odd. Every next prisoner computes their own hat based on the remaining parity!'
    ],
    explanation:
      'The back prisoner sacrifices (50% chance of survival) by communicating the parity (even/odd) of Red hats ahead. Every subsequent prisoner counts the red hats ahead and remembers the parity of hats already called behind them. Their own hat color is simply the delta in parity!',
    interviewTip:
      'Parity bit / XOR error-detection coding: This directly mirrors parity checks and Hamming codes in distributed systems and telecommunications.'
  },
  {
    id: 'camel-banana',
    number: 16,
    name: 'Camel & Banana',
    category: 'logical',
    companies: ['Amazon', 'Flipkart'],
    difficulty: 'Hard',
    icon: '🐪',
    problemStatement:
      'You have 3,000 bananas at point A and want to transport them across 1,000 km of desert to point B. A camel can carry a maximum of 1,000 bananas at once and eats 1 banana for every 1 km walked. What is the maximum number of bananas you can deliver to point B?',
    hints: [
      'If you try to take 1,000 bananas directly all 1,000 km, the camel will eat all 1,000 and you will have 0!',
      'You must make intermediate checkpoints and transport bananas in relays. When transporting 3,000 bananas, the camel needs 5 trips (3 forward, 2 back) per km, consuming 5 bananas per km.',
      'Move bananas until inventory drops to 2,000 (after 1,000/5 = 200 km). Then with 2,000 bananas, it takes 3 trips (2 forward, 1 back), consuming 3 bananas/km. After 1,000/3 ≈ 333 km (at km 533), 1,000 bananas remain. Then just 1 forward trip!'
    ],
    explanation:
      'At start (3000 bananas): 5 trips per km = 5 bananas/km. At km 200, 2000 bananas remain (1000 consumed). Next phase: 2000 bananas take 3 trips = 3 bananas/km. In 333.3 km (at km 533.3), 1000 bananas remain. From km 533.3, 1 trip over remaining 466.7 km burns 467 bananas. Result: 1000 - 467 = 533 bananas delivered!',
    interviewTip:
      'Dynamic inventory management and piecewise linear optimization: Interviewers look for how you break a continuous problem into optimal discrete transition states.'
  },
  {
    id: 'heaven-hell',
    number: 15,
    name: 'Heaven & Hell',
    category: 'logical',
    companies: ['Amazon', 'Infosys', 'Bloomberg'],
    difficulty: 'Easy',
    icon: '⚖️',
    problemStatement:
      'You stand before two doors: one leads to Heaven (eternal bliss) and the other to Hell. Guarding the doors are two guards. One ALWAYS tells the truth, and the other ALWAYS lies. You do not know which is which. You can ask ONE guard ONE question. What question reveals the door to Heaven?',
    hints: [
      'You need a question where Truth × Lie and Lie × Truth produce the identical response (double negation / involution).',
      'Ask one guard about what the other guard would say.',
      'Ask: "If I were to ask the other guard which door leads to Heaven, what would he point to?"'
    ],
    explanation:
      'Both guards will inevitably point to the door to HELL! The Truth-teller accurately reports the Liar\'s false answer (Hell). The Liar falsely reports the Truth-teller\'s true answer (Hell). Therefore, simply choose the OTHER door!',
    interviewTip:
      'Boolean algebra: T AND NOT(T) = False; NOT(T AND T) = False. When composing an inverting function with an identity function, the output is consistently inverted regardless of order.'
  },
  {
    id: 'mislabeled-jars',
    number: 13,
    name: 'Mislabeled Jars',
    category: 'logical',
    companies: ['Google', 'Microsoft', 'Apple'],
    difficulty: 'Easy',
    icon: '🏺',
    problemStatement:
      'You have 3 jars with fruit: one contains only Apples, one contains only Oranges, and one contains both Apples & Oranges. ALL THREE jars are currently labeled INCORRECTLY. You may draw exactly ONE fruit from ONE jar without looking inside. How can you correctly label all three jars?',
    hints: [
      'The crucial constraint is that EVERY label is 100% FALSE.',
      'Which label gives you the most definitive information if drawn from?',
      'Pick a fruit from the jar labeled "Apples & Oranges"!'
    ],
    explanation:
      'Since the "Apples & Oranges" jar is definitely mislabeled, it cannot be mixed—it must be purely Apples or purely Oranges! If you pick an Apple, that jar is 100% Apples. Then the jar labeled "Oranges" cannot be Oranges (mislabeled) and cannot be Apples (already found), so it must be Apples & Oranges. The final jar labeled "Apples" must be Oranges!',
    interviewTip:
      'Elimination by constraint satisfaction: Focus on the node with the highest degree of constraint (the "Mixed" label, which cannot be mixed).'
  },

  // 📐 Math & Analytical
  {
    id: 'monty-hall',
    number: 3,
    name: 'Monty Hall Problem',
    category: 'math',
    companies: ['VMware', 'Meta', 'Netflix'],
    difficulty: 'Medium',
    icon: '🚪',
    problemStatement:
      'You are on a game show with 3 closed doors. Behind one is a luxury sports car; behind the other two are goats. You pick Door 1. The host (who knows what is behind each door) opens Door 3, revealing a goat, and asks: "Do you want to switch to Door 2?" Should you switch, stay, or does it not matter?',
    hints: [
      'When you initially chose Door 1, what was the exact probability you picked the car?',
      'Your initial door has a 1/3 probability of having the car. The remaining two doors collectively had a 2/3 probability.',
      'The host opening a goat door transfers all that 2/3 probability to the single remaining unopened door! Switching doubles your odds from 33.3% to 66.7%!'
    ],
    explanation:
      'Initial pick: 1/3 chance car, 2/3 chance goat. If you initially picked a goat (which happens 66.7% of the time), Monty is forced to reveal the other goat, meaning the remaining door MUST contain the car! Therefore, switching wins whenever your initial pick was wrong (2/3).',
    interviewTip:
      'Conditional probability & Bayesian updating: P(Car in Door 2 | Host opened Door 3) = (1 * 1/3) / (1/2) = 2/3.'
  },
  {
    id: 'eggs-floors',
    number: 4,
    name: '2 Eggs & 100 Floors',
    category: 'math',
    companies: ['Google', 'Microsoft', 'Uber'],
    difficulty: 'Hard',
    icon: '🥚',
    problemStatement:
      'You are given 2 identical eggs and access to a 100-story building. An egg may break on any floor or survive even a drop from the 100th floor. If an egg survives, it can be dropped again. If it breaks, it is destroyed. What is the minimum number of drops needed in the worst case to determine the critical threshold floor?',
    hints: [
      'If you drop every 10 floors (10, 20, 30...) and Egg 1 breaks at 100, you need 10 + 9 = 19 drops worst case.',
      'To keep the worst-case drop count constant, each successive step for Egg 1 should decrease by 1 to offset the extra drop used.',
      'Set up the equation: x + (x - 1) + (x - 2) + ... + 1 >= 100. The sum of first x integers is x(x + 1)/2 >= 100. Solve for x!'
    ],
    explanation:
      'Solving x(x + 1)/2 >= 100 gives x = 14 (14 * 15 / 2 = 105). Drop Egg 1 from floors: 14, 27 (14+13), 39 (27+12), 50 (39+11), 60, 69, 77, 84, 90, 95, 99, 100. If it breaks at floor 14, test 1 to 13 linearly with Egg 2 (max 1 + 13 = 14 drops). At every stage, total worst-case drops is exactly 14!',
    interviewTip:
      'Dynamic Programming & Triangular Numbers: This is a classic interview problem testing minimax strategy and balancing search tree branching.'
  },
  {
    id: 'torch-bridge',
    number: 5,
    name: 'Torch & Bridge',
    category: 'math',
    companies: ['Google', 'Microsoft', 'Adobe'],
    difficulty: 'Medium',
    icon: '🔦',
    problemStatement:
      'Four people need to cross a narrow, rickety suspension bridge at night. They have one flashlight (torch) which must be carried on every crossing. The bridge can only hold at most two people at a time. The individuals cross in 1, 2, 5, and 10 minutes respectively. When two people cross, they must walk at the pace of the slower person. Can they all cross in 17 minutes?',
    hints: [
      'If Person 1 guides everyone back and forth (1&10 cross, 1 returns, 1&5 cross, 1 returns...), total time = 10 + 1 + 5 + 1 + 2 = 19 minutes (too slow).',
      'Notice that the 5-min and 10-min people are the slowest. How can they cross together so their penalties don\'t sum up?',
      'Let 1 & 2 cross first (2m). 1 returns with torch (1m). Then 5 & 10 cross together (10m)! 2 returns with torch (2m). Finally 1 & 2 cross again (2m). 2 + 1 + 10 + 2 + 2 = 17m!'
    ],
    explanation:
      'Optimal strategy: Step 1: (1, 2) cross → 2 min (Total: 2). Step 2: (1) returns → 1 min (Total: 3). Step 3: (5, 10) cross together → 10 min (Total: 13). Step 4: (2) returns with torch → 2 min (Total: 15). Step 5: (1, 2) cross together → 2 min (Total: 17 min)!',
    interviewTip:
      'Greedy algorithms trap: A naive greedy approach (sending the fastest person back and forth) yields 19 minutes. The optimal solution pairs the two slowest candidates to eliminate the 5-minute penalty.'
  },
  {
    id: 'marbles-jars',
    number: 9,
    name: '50 Red & 50 Blue Marbles',
    category: 'math',
    companies: ['Google', 'Microsoft', 'Twitter'],
    difficulty: 'Medium',
    icon: '🔴',
    problemStatement:
      'You are given 50 Red marbles, 50 Blue marbles, and two identical empty jars. You must place all 100 marbles into the two jars in any distribution (each jar must contain at least 1 marble). A blindfolded person then selects one jar at random (50/50 chance) and draws one marble. How should you distribute the marbles to maximize the chance of picking a Red marble?',
    hints: [
      'The formula is P(Red) = 0.5 * (RedA / TotalA) + 0.5 * (RedB / TotalB).',
      'Can you make the probability of drawing Red from one jar equal to 100%?',
      'Put exactly 1 Red marble in Jar A! Put the remaining 49 Red marbles and all 50 Blue marbles in Jar B.'
    ],
    explanation:
      'Jar A: 1 Red, 0 Blue → P(Red|Jar A) = 1/1 = 1.0 (100%). Jar B: 49 Red, 50 Blue → P(Red|Jar B) = 49/99 ≈ 0.4949. Total probability = 0.5 * (1) + 0.5 * (49/99) = 0.5 + 0.24747 = 74.74% chance!',
    interviewTip:
      'Probability maximization: By dedicating one whole branch to a certainty (P = 1.0), you maximize the weighted average over asymmetric allocations.'
  },
  {
    id: 'poison-rat',
    number: 17,
    name: 'Poison & Rat (Binary Bottles)',
    category: 'math',
    companies: ['Amazon', 'Goldman Sachs', 'Meta'],
    difficulty: 'Hard',
    icon: '🧪',
    problemStatement:
      'You have 8 bottles of expensive wine, exactly one of which is poisoned with a tasteless, odorless lethal toxin. You have 3 laboratory test rats. A rat dies within 24 hours if it drinks even a drop of the poisoned wine. How can you identify the exact poisoned bottle in a single 24-hour testing cycle?',
    hints: [
      'Notice that 2^3 = 8. Think in binary base 2!',
      'Number the bottles 0 to 7 (or 000 to 111 in 3-bit binary).',
      'Assign Rat 0 to the least significant bit, Rat 1 to bit 1, Rat 2 to bit 2. Rat i drinks from all bottles whose binary representation has a 1 in position i!'
    ],
    explanation:
      'Bottles: 0 (000), 1 (001), 2 (010), 3 (011), 4 (100), 5 (101), 6 (110), 7 (111). Rat 0 drinks from {1, 3, 5, 7}. Rat 1 drinks from {2, 3, 6, 7}. Rat 2 drinks from {4, 5, 6, 7}. If Rats 0 and 2 die, the poison bottle is binary 101 = Bottle 5! This scales to 1,000 bottles with ceil(log2(1000)) = 10 rats.',
    interviewTip:
      'Information theory & binary encoding: Each rat represents 1 bit of information (Alive = 0, Dead = 1). With N rats, you can distinguish 2^N possible outcomes.'
  },
  {
    id: 'snail-wall',
    number: 12,
    name: 'Snail & Wall',
    category: 'math',
    companies: ['TCS', 'Infosys', 'Wipro'],
    difficulty: 'Easy',
    icon: '🐌',
    problemStatement:
      'A snail is at the bottom of a 20-meter deep well. Each day, the snail climbs up 5 meters during daylight. Each night, as it sleeps, it slides back down 4 meters. On which day will the snail finally reach the top and escape the well?',
    hints: [
      'Do not just calculate net progress (5 - 4 = 1m/day) and conclude 20 days! The snail escapes during the day before it slides down.',
      'On what meter mark can a 5-meter climb take the snail over the 20-meter ledge in a single day?',
      'At 15 meters, a 5-meter climb reaches 20 meters immediately. How many full day/night cycles are needed to reach 15 meters?'
    ],
    explanation:
      'Net climb per 24 hours is 1 meter (5m - 4m). At the end of Day 15 (after night slip), the snail is at 15 meters. On the morning of Day 16, it climbs 5 meters: 15m + 5m = 20 meters! It reaches the rim and crawls out immediately, never slipping down again. Answer: 16 days!',
    interviewTip:
      'Boundary conditions & off-by-one errors: Interviewers use this to verify whether you check termination criteria before running update steps in loops.'
  },

  // 🎯 Arrangement
  {
    id: 'balls-lines',
    number: 11,
    name: '10 Balls in 5 Lines',
    category: 'arrangement',
    companies: ['Publicis Sapient', 'Deloitte', 'Cognizant'],
    difficulty: 'Hard',
    icon: '⚪',
    problemStatement:
      'You are given 10 identical balls. How can you arrange all 10 balls into 5 straight lines such that each line contains exactly 4 balls?',
    hints: [
      '5 lines with 4 balls each would normally require 5 × 4 = 20 balls if they didn\'t intersect.',
      'Since you only have 10 balls, each ball must belong to multiple lines simultaneously (20 / 10 = 2 lines per ball).',
      'What symmetrical 5-pointed geometric figure has 5 straight intersecting lines and 10 vertex/intersection points? A 5-pointed star (Pentagram)!'
    ],
    explanation:
      'Draw a standard 5-pointed star (pentagram). A pentagram consists of 5 continuous straight lines. It has 5 outer vertex points and 5 inner intersection points, making 10 vertices in total. Along each of the 5 straight lines, there are exactly 4 points (2 outer tips + 2 inner intersections)!',
    interviewTip:
      'Projective geometry & duality: This tests your ability to translate intersection constraints (incidence matrices) into geometric graph topologies.'
  },
  {
    id: 'dice-calendar',
    number: 10,
    name: 'Days of Month with 2 Dice',
    category: 'arrangement',
    companies: ['Microsoft', 'Amazon', 'Morgan Stanley'],
    difficulty: 'Medium',
    icon: '🎲',
    problemStatement:
      'You need to create a desktop calendar using two 6-sided wooden cubes (dice) to display every day of the month from 01 to 31. On each face of each cube, you can paint one digit (0–9). Which 6 digits must be placed on Cube 1, and which 6 digits on Cube 2?',
    hints: [
      'Dates 11 and 22 require the digits 1 and 2 to be on BOTH cubes. What about 01, 02... 09? 0 must also be on BOTH cubes!',
      'So far: Cube 1 needs {0, 1, 2}, and Cube 2 needs {0, 1, 2}. That leaves 3 faces on Cube 1 and 3 faces on Cube 2 (6 faces total for digits 3, 4, 5, 6, 7, 8, 9 — which is 7 digits!).',
      'Clever physical trick: The digit 6 turned upside-down serves as the digit 9!'
    ],
    explanation:
      'We need {0, 1, 2} on both cubes for dates 01-09, 11, and 22. Remaining digits to represent are {3, 4, 5, 6, 7, 8} (since 6 doubles as 9 when inverted). That gives exactly 6 remaining digits! Distribute them: Cube 1: {0, 1, 2, 3, 4, 5}. Cube 2: {0, 1, 2, 6, 7, 8}. All 31 dates are expressible!',
    interviewTip:
      'Resource limitation & rotational symmetry: Identifying that a 6 can be inverted into a 9 reduces 7 required digits down to 6 available cube faces.'
  },
  {
    id: 'matchstick-squares',
    number: 18,
    name: 'Matchstick Puzzle',
    category: 'arrangement',
    companies: ['Apple', 'Meta', 'Epic Systems'],
    difficulty: 'Medium',
    icon: '🥢',
    problemStatement:
      'You are given 12 matchsticks arranged to form a grid of 4 small adjacent squares (a 2×2 square grid has 12 matchsticks). How can you remove or reposition exactly 2 matchsticks so that exactly 2 squares of different sizes remain?',
    hints: [
      'The original 2×2 grid has four 1×1 squares and one large 2×2 square (5 squares total).',
      'We want only 2 squares remaining, and they can be different dimensions (e.g. one 2×2 square and one 1×1 square).',
      'Remove 2 internal matching cross sticks inside one corner so that the giant 2×2 outer perimeter is intact and only one 1×1 square remains inside!'
    ],
    explanation:
      'By removing two interior matchsticks from one corner, the inner divider collapses. The remaining figure forms 1 large 2×2 square that encloses the entire outer boundary, plus 1 intact 1×1 small square in the opposing corner, giving exactly 2 squares total!',
    interviewTip:
      'Reframing scale constraints: Most candidates only search for identical 1x1 squares. Interviewers look for people who realize squares can exist at multiple scales.'
  },
  {
    id: 'round-table-coins',
    number: 19,
    name: 'Round Table Coin Game',
    category: 'arrangement',
    companies: ['Goldman Sachs', 'Morgan Stanley', 'Two Sigma'],
    difficulty: 'Medium',
    icon: '🪙',
    problemStatement:
      'Two players take turns placing identical circular coins flat on a round table. Coins cannot overlap and must not hang over the edge. The player who cannot place a coin loses. Assuming both players play optimally, which player has a guaranteed winning strategy: Player 1 (first move) or Player 2? What is the strategy?',
    hints: [
      'Consider the rotational and point symmetry of a circle.',
      'A circle has a unique central point.',
      'Player 1 places their first coin dead-center on the table. After that, whatever move Player 2 makes, Player 1 mirrors it symmetrically across the center point!'
    ],
    explanation:
      'Player 1 always wins! Strategy: 1) Place the first coin exactly in the center of the circular table. 2) For every subsequent coin Player 2 places at position (x, y), Player 1 places their coin at the point-symmetric position (-x, -y) opposite the center. Because the table is circular, any valid empty spot chosen by Player 2 is guaranteed to have a mirror empty spot for Player 1!',
    interviewTip:
      'Game theory & invariant symmetry: By establishing symmetry on turn 1, Player 1 maintains a winning invariant (if Player 2 has a move, Player 1 is guaranteed a valid response).'
  },

  // 🔷 Shape & Spatial
  {
    id: 'ants-triangle',
    number: 6,
    name: '3 Ants on a Triangle',
    category: 'spatial',
    companies: ['Intuit', 'ZS Associates', 'Amazon'],
    difficulty: 'Easy',
    icon: '🐜',
    problemStatement:
      'Three ants are sitting at the three vertices of an equilateral triangle. Each ant randomly and independently chooses a direction to walk along an edge (clockwise or counter-clockwise) with equal probability (50% each). What is the probability that none of the ants collide with each other?',
    hints: [
      'Each ant has 2 choices: Clockwise (C) or Counter-Clockwise (CCW).',
      'With 3 independent ants, how many total possible direction combinations are there? 2 × 2 × 2 = 8.',
      'Which combinations result in ZERO collisions? Only when ALL ants walk clockwise (C, C, C) or ALL ants walk counter-clockwise (CCW, CCW, CCW).'
    ],
    explanation:
      'Total outcomes: 2^3 = 8 equally likely outcomes. Collision-free outcomes: Only 2 configurations (all clockwise or all counter-clockwise). Therefore, Probability = 2 / 8 = 1/4 = 25% (or 0.25).',
    interviewTip:
      'Combinatorics generalization: For an n-sided polygon with n ants, the probability of no collision is 2 / (2^n) = 1 / 2^(n - 1).'
  },
  {
    id: 'chessboard-dominos',
    number: 7,
    name: 'Chessboard & Dominos',
    category: 'spatial',
    companies: ['Google', 'Palantir', 'Jane Street'],
    difficulty: 'Medium',
    icon: '♟️',
    problemStatement:
      'An 8×8 chessboard has 64 squares. We remove two diagonally opposite corner squares, leaving 62 squares. You have 31 domino tiles, each of size 2×1 (which covers exactly 2 squares). Can you cover all 62 remaining squares on the board with these 31 dominos without overlaps or overhangs?',
    hints: [
      'Think about the colors of the squares on a chessboard (alternating black and white).',
      'What colors do any single 2×1 domino always cover on a standard chessboard?',
      'Diagonally opposite corners on a chessboard ALWAYS share the exact same color!'
    ],
    explanation:
      'It is IMPOSSIBLE! A standard chessboard has 32 white and 32 black squares. Diagonally opposite corners are both the same color (say, both white). Removing them leaves 32 black squares and only 30 white squares. However, every 2×1 domino must cover exactly ONE black and ONE white square. 31 dominos must cover 31 black and 31 white squares, which is mathematically impossible!',
    interviewTip:
      'Coloring invariants & bipartite matching: Whenever a grid tiling problem seems stubborn, check parity or graph bipartiteness!'
  },
  {
    id: 'cake-cuts',
    number: 8,
    name: '3 Cuts for 8 Cake Pieces',
    category: 'spatial',
    companies: ['Adobe', 'Cognizant', 'Accenture'],
    difficulty: 'Medium',
    icon: '🎂',
    problemStatement:
      'You have a round cylindrical birthday cake. How can you cut the cake into 8 equal-sized pieces with exactly 3 straight knife cuts?',
    hints: [
      'If you make 3 radial vertical cuts from the center or across the top face, you only get at most 6 or 7 pieces.',
      'A cake is a 3-dimensional cylinder, not a 2D circle!',
      'Make 2 vertical cuts forming an "X" on the top (giving 4 quarters), then make 1 horizontal cut across the side through the middle of the cake!'
    ],
    explanation:
      'Cut 1: Vertical cut down the center (2 pieces). Cut 2: Vertical cut perpendicular to Cut 1 (4 quadrant pieces). Cut 3: Slice horizontally right through the equator/middle of the cake! Each of the 4 quadrants is sliced into a top and bottom layer, yielding 4 × 2 = 8 equal pieces!',
    interviewTip:
      'Spatial dimensionality: Escaping 2D flat thinking into 3D Euclidean space (Euler characteristics of plane partitions: max pieces with n cuts is (n^3 + 5n + 6)/6 for 3D).'
  },
  {
    id: 'nine-dots',
    number: 20,
    name: '9 Dots Puzzle',
    category: 'spatial',
    companies: ['Apple', 'IDEO', 'Disney'],
    difficulty: 'Medium',
    icon: '✏️',
    problemStatement:
      'Nine dots are arranged in a 3×3 square grid. Connect all nine dots using exactly 4 continuous straight line segments without lifting your pencil or retracing any part of a line.',
    hints: [
      'Why is this puzzle historically famous as the origin of the phrase "think outside the box"?',
      'The instructions never say your lines must stay within the boundary of the 3×3 grid!',
      'Extend your lines beyond the outermost dots to create diagonal return angles that sweep through 3 dots in one pass!'
    ],
    explanation:
      'Start at a corner (e.g. bottom-left). Line 1: Go up through 3 dots and continue 1 unit past the top-left dot. Line 2: Cut diagonally down through the top-center and middle-right dots, extending 1 unit past the bottom-right. Line 3: Go horizontally left through the bottom 3 dots. Line 4: Cut diagonally up through the center dot to hit the top-right dot! All 9 dots connected in 4 continuous lines!',
    interviewTip:
      'Unconstrained assumption busting: The artificial boundary of the 3x3 square exists only in psychological perception, not in the problem rules.'
  },
  {
    id: 'river-crossing',
    number: 21,
    name: 'River Crossing (Wolf, Goat & Cabbage)',
    category: 'logical',
    companies: ['Google', 'Amazon', 'Microsoft'],
    difficulty: 'Medium',
    icon: '🛶',
    problemStatement:
      'A farmer needs to transport a wolf, a goat, and a head of cabbage across a river in a small rowboat. The boat is only big enough to carry the farmer and at most ONE of the three items at a time. If left unattended together without the farmer, the wolf will eat the goat, and the goat will eat the cabbage. How can the farmer transport all three safely to the opposite bank in the fewest crossings?',
    hints: [
      'Which item can be left alone safely with the wolf? The cabbage! And which item cannot be left alone with either? The goat!',
      'The goat must be taken across first, leaving the wolf and cabbage safely on the starting bank.',
      'On crossing 3, after taking the cabbage (or wolf) across, the farmer MUST take the goat back in the boat to the starting bank!'
    ],
    explanation:
      'Optimal 7-step sequence:\n1. Farmer takes Goat across (Left: Wolf, Cabbage | Right: Goat).\n2. Farmer returns alone (Left: Farmer, Wolf, Cabbage | Right: Goat).\n3. Farmer takes Cabbage across (Left: Wolf | Right: Goat, Cabbage).\n4. Farmer brings Goat back! (Left: Farmer, Wolf, Goat | Right: Cabbage).\n5. Farmer takes Wolf across (Left: Goat | Right: Wolf, Cabbage).\n6. Farmer returns alone (Left: Farmer, Goat | Right: Wolf, Cabbage).\n7. Farmer takes Goat across! All 3 safe on the right bank!',
    interviewTip:
      'State-space graph search & Backtracking: Each safe state can be represented as a node in a graph. The key breakthrough is recognizing that optimal paths may require reversing an earlier action (taking the goat back) to maintain invariance.'
  },
  {
    id: 'balance-scale',
    number: 22,
    name: 'Counterfeit Coin & Balance Scale',
    category: 'math',
    companies: ['Goldman Sachs', 'Microsoft', 'Palantir'],
    difficulty: 'Hard',
    icon: '⚖️',
    problemStatement:
      'You are given 9 coins that look identical, but exactly one is counterfeit and is slightly HEAVIER than the other 8 genuine coins of equal weight. You have a two-pan balance scale with no weights. What is the minimum number of weighings required to guarantee finding the counterfeit coin?',
    hints: [
      'A balance scale has 3 possible outcomes for each weighing: Left pan tilts down, Right pan tilts down, or Both pans stay balanced.',
      'Because each weighing yields 3 outcomes, each weighing can divide the search space by a factor of 3 (base 3 / ternary search).',
      'Split the 9 coins into 3 groups of 3 coins: A = {1, 2, 3}, B = {4, 5, 6}, C = {7, 8, 9}. Weigh A against B!'
    ],
    explanation:
      'Exactly 2 weighings are guaranteed!\n\nWeighing 1: Weigh {1, 2, 3} vs {4, 5, 6}.\n• If Left tilts down, fake coin is in {1, 2, 3}.\n• If Right tilts down, fake coin is in {4, 5, 6}.\n• If Balanced, fake coin is in {7, 8, 9}.\n\nWeighing 2: Take the 3 suspect coins (say {1, 2, 3}). Weigh Coin 1 vs Coin 2.\n• If Left tilts down, Coin 1 is fake.\n• If Right tilts down, Coin 2 is fake.\n• If Balanced, Coin 3 is fake!\n\nIn information theory: 3^k >= N. With k = 2 weighings, 3^2 = 9 outcomes, which matches 9 coins perfectly.',
    interviewTip:
      'Ternary Search & Decision Trees: Rather than binary splitting (halving), interviewers expect you to realize a pan scale has 3 states (<, =, >), making ternary division optimal.'
  },
  {
    id: 'burning-ropes',
    number: 23,
    name: 'Burning Ropes (Measure 45 Min)',
    category: 'logical',
    companies: ['Google', 'Bloomberg', 'Apple'],
    difficulty: 'Medium',
    icon: '🔥',
    problemStatement:
      'You are given two ropes of varying lengths and thicknesses. Each rope takes exactly 60 minutes to burn completely from one end to the other, but neither burns at a uniform rate (e.g. 90% of a rope might burn in the first 10 minutes). You have a lighter but no clock or stopwatch. How can you measure exactly 45 minutes?',
    hints: [
      'If you light a rope from BOTH ends simultaneously, it will burn out in exactly half the time (30 minutes), regardless of uneven thickness!',
      'Notice that 45 minutes = 30 minutes + 15 minutes.',
      'How can you get 15 minutes out of the second rope? By having it already burned for 30 minutes, leaving 30 minutes worth of fuel, and then lighting its other end!'
    ],
    explanation:
      'Step 1: Light Rope 1 from BOTH ends (A and B). At the exact same moment, light Rope 2 from ONE end (C).\n\nStep 2: Rope 1 burns from both ends and extinguishes completely in exactly 30 minutes! At that instant, exactly 30 minutes have elapsed, and Rope 2 has exactly 30 minutes of burn time remaining.\n\nStep 3: The moment Rope 1 burns out, immediately light the OTHER end of Rope 2 (D)!\n\nStep 4: Since Rope 2 is now burning from both ends, its remaining 30 minutes of fuel burns in 15 minutes. When Rope 2 completely extinguishes, exactly 30 + 15 = 45 minutes have elapsed!',
    interviewTip:
      'Boundary invariants & Non-uniform integration: Even when the density function is unknown, lighting both ends doubles the instantaneous burn rate ∫(v1 + v2) dt = L, halving total duration unconditionally.'
  },
  {
    id: 'tower-of-hanoi',
    number: 24,
    name: 'Tower of Hanoi',
    category: 'arrangement',
    companies: ['Microsoft', 'Amazon', 'Cisco'],
    difficulty: 'Medium',
    icon: '🗼',
    problemStatement:
      'You have 3 rods (A, B, C) and n disks of different sizes stacked on Rod A in order of decreasing size (smallest on top). You must move the entire stack to Rod C following two rules: 1) You can move only one disk at a time. 2) No larger disk may ever be placed on top of a smaller disk. What is the minimum number of moves required for n disks?',
    hints: [
      'Think recursively: To move n disks from A to C, what must you first do with the top (n - 1) disks?',
      'Move top (n - 1) disks from A to B. Move largest disk from A to C. Move top (n - 1) disks from B to C.',
      'Recurrence relation: T(n) = 2T(n - 1) + 1. For n = 1: 1. For n = 2: 3. For n = 3: 7. What is the closed formula?'
    ],
    explanation:
      'The minimum number of moves is 2^n - 1.\n\nFor 3 disks: 2^3 - 1 = 7 moves.\nFor 4 disks: 2^4 - 1 = 15 moves.\n\nRecursive Strategy:\n1. Move top (n-1) disks from Source (A) to Auxiliary (B) using Target (C) as buffer: T(n-1) moves.\n2. Move largest disk n from Source (A) to Target (C): 1 move.\n3. Move (n-1) disks from Auxiliary (B) to Target (C) using Source (A) as buffer: T(n-1) moves.\nTotal: T(n) = 2T(n-1) + 1 = 2^n - 1.',
    interviewTip:
      'Divide and Conquer & Master Theorem: Hanoi is the foundational benchmark for understanding recursive call stacks, exponential time complexity O(2^n), and inductive proofs.'
  },
  {
    id: 'hundred-doors',
    number: 25,
    name: 'The 100 Doors Problem',
    category: 'math',
    companies: ['Amazon', 'Microsoft', 'Infosys'],
    difficulty: 'Easy',
    icon: '🚪',
    problemStatement:
      'There are 100 closed doors in a hallway, numbered 1 to 100. On the 1st pass, you visit every door (1, 2, 3...) and toggle its state (closed becomes open). On the 2nd pass, you visit every 2nd door (2, 4, 6...) and toggle it. On the 3rd pass, you visit every 3rd door (3, 6, 9...), and so on, until on the 100th pass you visit only door 100. After all 100 passes, which doors remain OPEN?',
    hints: [
      'Door k is toggled on pass p if and only if p is a divisor/factor of k.',
      'If a door is toggled an EVEN number of times, it ends up CLOSED. If toggled an ODD number of times, it ends up OPEN.',
      'Which integers have an ODD number of factors? Factors always come in pairs (a × b = k), EXCEPT when a = b!'
    ],
    explanation:
      'Only the PERFECT SQUARES remain open: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 (exactly 10 doors)!\n\nMathematical Proof:\nA door is toggled once for every positive factor it has. Most numbers have factors that come in distinct pairs (e.g., 12 has pairs 1×12, 2×6, 3×4 = 6 factors, an even number, leaving door 12 CLOSED).\n\nHowever, a perfect square k has a factor pair where both factors are identical (e.g., 16 has 1×16, 2×8, and 4×4). The repeated factor 4 is counted only once, giving 16 an ODD number of divisors (1, 2, 4, 8, 16 = 5 factors). Because it is toggled an odd number of times, it finishes OPEN!',
    interviewTip:
      'Number theory & Factor parity: Instead of running an O(n^2) nested loop simulation, this problem tests whether you can reduce the algorithm to O(1) by recognizing factor pairing and perfect squares.'
  }
];
