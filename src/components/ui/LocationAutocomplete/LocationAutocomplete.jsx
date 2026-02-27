'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchLocations } from '@/lib/api/locations';
import { filterStaticLocations } from '@/lib/constants/locations';

const TYPE_ICONS = { city: '✈', airport: '✈', state: '📍', country: '🌍' };
const TYPE_LABELS = { city: 'Airport', airport: 'Airport', state: 'State', country: 'Country' };

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * LocationAutocomplete
 *
 * Shows results immediately from a static bundled dataset (works with no backend).
 * Silently upgrades to Elasticsearch results when the backend is reachable.
 *
 * Props:
 *  value        {string}   controlled value shown in the input
 *  onChange     {fn}       called with raw text on every keystroke
 *  onSelect     {fn}       called with the full location object on selection
 *  placeholder  {string}
 *  filterType   {string}   optional: 'city' | 'state' | 'country'
 *  id           {string}   for label <-> input association
 *  hasError     {boolean}
 *  disabled     {boolean}
 */
export default function LocationAutocomplete({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Search city or airport…',
  filterType,
  id,
  hasError = false,
  disabled = false,
}) {
  const [inputVal, setInputVal] = useState(value);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(inputVal, 300);

  // Sync controlled value → local input when parent resets the field
  useEffect(() => { setInputVal(value); }, [value]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length === 0) {
      setResults([]);
      setOpen(false);
      return;
    }

    // ── 1. Immediately show static results (zero latency, works offline) ──
    const staticHits = filterStaticLocations(q, { type: filterType, size: 8 });
    if (staticHits.length > 0) {
      setResults(staticHits);
      setOpen(true);
      setActiveIdx(-1);
    }

    // ── 2. Try to upgrade with Elasticsearch results (non-blocking) ──────
    let cancelled = false;
    searchLocations(q, { type: filterType, size: 8 })
      .then(({ results: esHits }) => {
        if (!cancelled && esHits && esHits.length > 0) {
          setResults(esHits);
        }
      })
      .catch(() => { /* ES not available — static results remain */ });

    return () => { cancelled = true; };
  }, [debouncedQuery, filterType]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInputChange = useCallback((e) => {
    const val = e.target.value;
    setInputVal(val);
    onChange?.(val);
    if (!val.trim()) { setResults([]); setOpen(false); }
  }, [onChange]);

  const handleSelect = useCallback((loc) => {
    // For flights use IATA code; for hotels/states use the name
    const display = loc.code && loc.type === 'city'
      ? `${loc.name} (${loc.code})`
      : loc.name;
    setInputVal(display);
    onChange?.(display);
    onSelect?.(loc);
    setOpen(false);
    setResults([]);
    inputRef.current?.blur();
  }, [onChange, onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter')  { e.preventDefault(); if (activeIdx >= 0) handleSelect(results[activeIdx]); }
    else if (e.key === 'Escape') { setOpen(false); }
  }, [open, results, activeIdx, handleSelect]);

  const inputClass = [
    'w-full px-4 py-2 border rounded-lg',
    'bg-white text-gray-900 placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition',
    hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
  ].join(' ');

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={inputVal}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-activedescendant={activeIdx >= 0 ? `${id}-option-${activeIdx}` : undefined}
      />

      {open && results.length > 0 && (
        <ul
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto"
        >
          {results.map((loc, idx) => {
            const isActive = idx === activeIdx;
            return (
              <li
                key={loc.id}
                id={id ? `${id}-option-${idx}` : undefined}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(loc); }}
                onMouseEnter={() => setActiveIdx(idx)}
                className={[
                  'flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none transition-colors',
                  isActive ? 'bg-indigo-50' : 'hover:bg-gray-50',
                ].join(' ')}
              >
                {/* Icon */}
                <span className="text-base w-5 text-center flex-shrink-0 text-gray-500">
                  {TYPE_ICONS[loc.type] || '📍'}
                </span>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">
                      {loc.name}
                    </span>
                    {loc.code && loc.type === 'city' && (
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                        {loc.code}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                    {loc.description
                      ? loc.description
                      : [loc.state, loc.country].filter(Boolean).join(', ')}
                  </p>
                </div>

                {/* Type badge */}
                <span className="text-xs text-gray-300 flex-shrink-0 hidden sm:block">
                  {TYPE_LABELS[loc.type] || loc.type}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
