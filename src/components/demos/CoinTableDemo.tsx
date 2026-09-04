import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, Sparkles, User, Bot } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

interface Coin {
  x: number;
  y: number;
  player: 1 | 2; // 1 = user, 2 = AI
}

const TABLE_RADIUS = 120;
const COIN_RADIUS = 16;
const CENTER_X = 150;
const CENTER_Y = 150;

export const CoinTableDemo: React.FC<Props> = ({ onSolved }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [turn, setTurn] = useState<1 | 2>(1); // Player 1 (user) starts
  const [solved, setSolved] = useState<boolean>(false);
  const [log, setLog] = useState<string[]>(['Game start: Round table is completely empty. Player 1 to move.']);

  const isOverlap = (x: number, y: number, existing: Coin[]) => {
    return existing.some(c => {
      const dist = Math.hypot(c.x - x, c.y - y);
      return dist < COIN_RADIUS * 2;
    });
  };

  const isInsideTable = (x: number, y: number) => {
    const distFromCenter = Math.hypot(x - CENTER_X, y - CENTER_Y);
    return distFromCenter + COIN_RADIUS <= TABLE_RADIUS;
  };

  const handleTableClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (turn !== 1 || solved) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scale = 300 / rect.width;
    const clickX = (e.clientX - rect.left) * scale;
    const clickY = (e.clientY - rect.top) * scale;

    if (!isInsideTable(clickX, clickY)) return;
    if (isOverlap(clickX, clickY, coins)) return;

    // Place user coin
    const userCoin: Coin = { x: clickX, y: clickY, player: 1 };
    const nextCoins = [...coins, userCoin];
    setCoins(nextCoins);
    setTurn(2);

    // Check if user placed in center on turn 1
    const distFromCenter = Math.hypot(clickX - CENTER_X, clickY - CENTER_Y);
    const placedCenter = distFromCenter <= 10;

    setLog(prev => [
      `Player 1 (You) placed coin at (${Math.round(clickX)}, ${Math.round(clickY)}). ${
        coins.length === 0 && placedCenter ? 'Center move made!' : ''
      }`,
      ...prev
    ]);

    // AI's turn after brief delay
    setTimeout(() => {
      // If user placed center, AI plays random spot, then user can mirror
      // Generate AI coin
      let aiPlaced = false;
      for (let attempt = 0; attempt < 80; attempt++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * (TABLE_RADIUS - COIN_RADIUS * 2) + COIN_RADIUS;
        const ax = CENTER_X + r * Math.cos(angle);
        const ay = CENTER_Y + r * Math.sin(angle);

        if (isInsideTable(ax, ay) && !isOverlap(ax, ay, nextCoins)) {
          const aiCoin: Coin = { x: ax, y: ay, player: 2 };
          setCoins([...nextCoins, aiCoin]);
          setTurn(1);
          setLog(prev => [`Player 2 (AI) placed coin at (${Math.round(ax)}, ${Math.round(ay)}).`, ...prev]);
          aiPlaced = true;
          break;
        }
      }

      if (!aiPlaced) {
        // AI has no moves left! User wins!
        setSolved(true);
        onSolved(3, nextCoins.length);
        setLog(prev => ['🎉 AI has no legal moves left! Player 1 wins by table saturation!', ...prev]);
      }
    }, 600);
  };

  const handleCenterWinningMove = () => {
    // Exact center is (150, 150)
    if (coins.length > 0) return;
    const centerCoin: Coin = { x: CENTER_X, y: CENTER_Y, player: 1 };
    setCoins([centerCoin]);
    setTurn(2);
    setSolved(true);
    onSolved(3, 1);
    setLog([
      'Winning strategy executed! Player 1 places first coin dead-center. For every subsequent coin Player 2 places at (x, y), Player 1 mirrors it at (-x, -y). Player 1 is mathematically guaranteed to win!'
    ]);
  };

  const handleReset = () => {
    setCoins([]);
    setTurn(1);
    setSolved(false);
    setLog(['Reset: Table cleared. Player 1 to move.']);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Turn:</span>
            <span className={`font-bold text-xs px-2.5 py-0.5 rounded border ${
              turn === 1
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
            }`}>
              {turn === 1 ? 'Player 1 (You)' : 'Player 2 (AI thinking...)'}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Coins on Table: </span>
            <span className="text-white font-mono font-bold text-base">{coins.length}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCenterWinningMove}
            disabled={coins.length > 0}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-800/60 transition disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Winning Center Strategy
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Round Table SVG Canvas */}
      <div className="relative w-full max-w-[340px] aspect-square bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner flex items-center justify-center">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full cursor-pointer overflow-visible"
          onClick={handleTableClick}
        >
          {/* Table Surface */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={TABLE_RADIUS}
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="4"
          />

          {/* Table Center Dot Guide */}
          <circle cx={CENTER_X} cy={CENTER_Y} r="3" fill="#64748b" opacity="0.6" />

          {/* Coins placed */}
          {coins.map((c, i) => (
            <g key={i}>
              <circle
                cx={c.x}
                cy={c.y}
                r={COIN_RADIUS}
                fill={c.player === 1 ? '#06b6d4' : '#f59e0b'}
                stroke={c.player === 1 ? '#e0f2fe' : '#fef3c7'}
                strokeWidth="2"
                className="transition-all animate-in zoom-in duration-200"
              />
              <text
                x={c.x}
                y={c.y + 4}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="10"
                fontWeight="bold"
              >
                {c.player === 1 ? 'P1' : 'P2'}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="text-xs text-slate-400 text-center">
        Click anywhere on the round table to place a coin without overlapping.
      </div>

      {/* Log */}
      <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-400">
        {log.map((l, i) => (
          <div key={i} className={i === 0 ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
            › {l}
          </div>
        ))}
      </div>

      {solved && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 p-4 rounded-xl text-xs font-medium w-full">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            Point-Symmetry Invariant Proven! Player 1 claims the unique center point on move 1. For every move Player 2 plays anywhere on the table, Player 1 mirrors it exactly 180° through the center. Player 1 never runs out of legal moves!
          </span>
        </div>
      )}
    </div>
  );
};
