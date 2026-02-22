'use client';

import { useMemo } from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = [1, 2, 3, 4, 5, 6];

export default function SeatMap({ selectedSeat, onSelectSeat }) {
  const blockedSeats = useMemo(
    () => new Set(['A2', 'B4', 'C1', 'D5', 'E3', 'F2']),
    []
  );

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Select your seat</h3>
      <div className="flex justify-center mb-2">
        <div className="w-48 h-6 bg-indigo-100 rounded text-center text-xs font-medium text-indigo-800">
          Front
        </div>
      </div>
      <div className="space-y-2">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-6 text-sm font-medium text-gray-600">{row}</span>
            <div className="flex gap-1">
              {COLS.slice(0, 3).map((col) => {
                const seatId = `${row}${col}`;
                const blocked = blockedSeats.has(seatId);
                return (
                  <button
                    key={seatId}
                    type="button"
                    disabled={blocked}
                    onClick={() => !blocked && onSelectSeat(seatId)}
                    className={`w-9 h-9 rounded text-sm font-medium transition ${
                      selectedSeat === seatId
                        ? 'bg-indigo-600 text-white'
                        : blocked
                          ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                    aria-label={`Seat ${seatId}`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
            <span className="w-4 text-gray-400">|</span>
            <div className="flex gap-1">
              {COLS.slice(3).map((col) => {
                const seatId = `${row}${col}`;
                const blocked = blockedSeats.has(seatId);
                return (
                  <button
                    key={seatId}
                    type="button"
                    disabled={blocked}
                    onClick={() => !blocked && onSelectSeat(seatId)}
                    className={`w-9 h-9 rounded text-sm font-medium transition ${
                      selectedSeat === seatId
                        ? 'bg-indigo-600 text-white'
                        : blocked
                          ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                    aria-label={`Seat ${seatId}`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-3 gap-6 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-indigo-600" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-gray-300" /> Unavailable
        </span>
      </div>
    </div>
  );
}
