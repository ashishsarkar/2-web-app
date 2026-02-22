import { act, renderHook } from '@testing-library/react';
import { useCurrencyStore } from './currencyStore';

// Reset store state before each test
const getState = () => useCurrencyStore.getState();
beforeEach(() => {
  act(() => {
    getState().setCurrency('INR');
  });
});

describe('currencyStore', () => {
  it('has default INR currency', () => {
    const { result } = renderHook(() => useCurrencyStore());
    expect(result.current.currency).toBe('INR');
  });

  it('setCurrency updates currency', () => {
    const { result } = renderHook(() => useCurrencyStore());
    act(() => {
      result.current.setCurrency('USD');
    });
    expect(result.current.currency).toBe('USD');
  });

  describe('format', () => {
    it('formats INR with rupee symbol', () => {
      act(() => getState().setCurrency('INR'));
      const formatted = getState().format(5000);
      expect(formatted).toMatch(/₹/);
      expect(formatted).toContain('5,000');
    });

    it('formats USD with dollar symbol', () => {
      act(() => getState().setCurrency('USD'));
      const formatted = getState().format(10000); // 10000 INR ≈ 120 USD
      expect(formatted).toMatch(/\$/);
    });

    it('rounds amount', () => {
      act(() => getState().setCurrency('INR'));
      const formatted = getState().format(5000.7);
      expect(formatted).toContain('5,001');
    });
  });

  describe('convert', () => {
    it('returns same amount for INR', () => {
      act(() => getState().setCurrency('INR'));
      expect(getState().convert(1000)).toBe(1000);
    });

    it('converts INR to USD', () => {
      act(() => getState().setCurrency('USD'));
      const converted = getState().convert(1000); // 1000 * 0.012 = 12
      expect(converted).toBe(12);
    });
  });
});
