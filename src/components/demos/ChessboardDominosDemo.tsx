import React, { useState } from 'react';
import { RotateCcw, Award, CheckCircle2, RotateCw, HelpCircle } from 'lucide-react';

interface Props {
  onSolved: (stars: number, moves: number) => void;
}

export const ChessboardDominosDemo: React.FC<Props> = ({ onSolved }) => {
  // 8x8 grid: true = covered by a domino
  const [board, setBoard] = useState<boolean[][]>(() =>
    Array.from({ length: 8 }, () => Array(8).fill(false))
  );
  const [orientation, setOrientation] = useState<'H' | 'V'>('H'); // 2x1 Horizontal or 1x2 Vertical
  const [dominosPlaced, setDominosPlaced] = useState<number>(0);
  const [showProof, setShowProof] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Removed corners: Top-Left (0, 0) and Bottom-Right (7, 7)
  const isRemoved = (r: number, c: number) => {
    return (r === 0 && c === 0) || (r === 7 && c === 7);
  };

  const isDarkSquare = (r: number, c: number) => {
    return (r + c) % 2 === 1;
  };

  const handleCellClick = (r: number, c: number) => {
    if (showProof || solved) return;
    if (isRemoved(r, c)) return;

    const r2 = orientation === 'V' ? r + 1 : r;
    const c2 = orientation === 'H' ? c + 1 : c;

    // Boundary and removal check
    if (r2 >= 8 || c2 >= 8 || isRemoved(r2, c2)) {
      setFeedback('Cannot place domino outside board or onto removed corners.');
      return;
    }

    // Check if both cells are currently empty
    if (!board[r][c] && !board[r2][c2]) {
      // Place domino
      const nextBoard = board.map(row => [...row]);
      nextBoard[r][c] = true;
      nextBoard[r2][c2] = true;
      setBoard(nextBoard);
      setDominosPlaced(prev => prev + 1);
      setFeedback(null);
    } else if (board[r][c] && board[r2][c2]) {
      // Remove domino
      const nextBoard = board.map(row => [...row]);
      nextBoard[r][c] = false;
      nextBoard[r2][c2] = false;
      setBoard(nextBoard);
      setDominosPlaced(prev => Math.max(0, prev - 1));
      setFeedback(null);
    }
  };

  const handleDeclareImpossible = () => {
    setShowProof(true);
    setSolved(true);
    onSolved(3, dominosPlaced);
  };

  const handleReset = () => {
    setBoard(Array.from({ length: 8 }, () => Array(8).fill(false)));
    setDominosPlaced(0);
    setShowProof(false);
    setSolved(false);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 px-6 text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Dominos Placed: </span>
            <span className="text-cyan-400 font-mono font-bold text-base">{dominosPlaced}</span>
            <span className="text-slate-500 text-xs ml-1">/ 31</span>
          </div>
          <div>
            <span className="text-slate-400">Orientation: </span>
            <button
              onClick={() => setOrientation(orientation === 'H' ? 'V' : 'H')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 ml-1 hover:bg-cyan-900"
            >
              <RotateCw className="w-3 h-3" />
              {orientation === 'H' ? 'Horizontal (2×1)' : 'Vertical (1×2)'}
            </button>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Board
        </button>
      </div>

      {/* Chessboard Grid */}
      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-8 gap-1 bg-slate-900 p-2 rounded-xl">
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => {
              const removed = isRemoved(r, c);
              const dark = isDarkSquare(r, c);
              const covered = board[r][c];

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  disabled={removed || showProof}
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded flex items-center justify-center text-xs font-bold transition-all relative ${
                    removed
                      ? 'bg-rose-950/60 border border-rose-800 text-rose-500 cursor-not-allowed'
                      : covered
                      ? 'bg-cyan-500 text-slate-950 shadow-md border border-cyan-300'
                      : dark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                      : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                  }`}
                >
                  {removed && '❌'}
                  {covered && '🁢'}
                </button>
              );
            })
          )}
        </div>
      </div>

      {feedback && (
        <div className="text-xs text-amber-400 bg-amber-950/50 border border-amber-800/60 px-3 py-1.5 rounded-lg">
          {feedback}
        </div>
      )}

      {/* Educational Proof & Solution Button */}
      {!showProof ? (
        <div className="flex flex-col items-center gap-3 w-full p-4 bg-slate-900/70 border border-slate-800 rounded-xl text-center">
          <p className="text-xs text-slate-300">
            Try covering the board with 31 dominos, or conclude whether it is mathematically possible.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeclareImpossible}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Conclude: It is IMPOSSIBLE (Show Proof)
            </button>
          </div>
        </div>
      ) : (
        /* Proof Unfolded */
        <div className="flex flex-col gap-3 w-full bg-slate-900 border border-emerald-800/80 rounded-2xl p-5 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Mathematical Color Parity Proof (Gomory's Theorem)</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Board Square Count:</span>
              <div className="mt-1 font-mono text-slate-200">
                • Light Squares: <strong className="text-amber-300">30</strong> (2 removed!)
                <br />
                • Dark Squares: <strong className="text-cyan-300">32</strong>
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Domino Requirement:</span>
              <div className="mt-1 font-mono text-slate-200">
                • Each 2×1 domino covers <strong>1 Light + 1 Dark</strong>
                <br />
                • 31 dominos require <strong>31 Light + 31 Dark</strong>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Because opposite corners on an 8×8 board always have the <em>same</em> color (both are light), removing them leaves an uneven count of 30 light and 32 dark squares. Since any domino must cover exactly one square of each color, covering 32 dark squares requires at least 32 dominos. Thus, a tiling is strictly impossible!
          </p>
        </div>
      )}
    </div>
  );
};
