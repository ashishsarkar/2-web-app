import { flightSearchSchema } from './flights';

describe('flightSearchSchema', () => {
  const valid = { origin: 'DEL', destination: 'BOM', departureDate: '2026-03-15' };

  it('accepts a fully valid payload', () => {
    expect(flightSearchSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts payload with optional returnDate', () => {
    const result = flightSearchSchema.safeParse({ ...valid, returnDate: '2026-03-20' });
    expect(result.success).toBe(true);
  });

  it('accepts payload without returnDate', () => {
    const result = flightSearchSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  describe('origin', () => {
    it('rejects empty origin', () => {
      const result = flightSearchSchema.safeParse({ ...valid, origin: '' });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('required');
    });

    it('accepts any non-empty string', () => {
      expect(flightSearchSchema.safeParse({ ...valid, origin: 'Kochi' }).success).toBe(true);
    });
  });

  describe('destination', () => {
    it('rejects empty destination', () => {
      const result = flightSearchSchema.safeParse({ ...valid, destination: '' });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('required');
    });

    it('accepts IATA code', () => {
      expect(flightSearchSchema.safeParse({ ...valid, destination: 'CCU' }).success).toBe(true);
    });
  });

  describe('departureDate', () => {
    it('rejects empty departureDate', () => {
      const result = flightSearchSchema.safeParse({ ...valid, departureDate: '' });
      expect(result.success).toBe(false);
    });

    it('accepts valid date string', () => {
      expect(flightSearchSchema.safeParse({ ...valid, departureDate: '2026-12-01' }).success).toBe(true);
    });
  });

  it('rejects when all required fields are missing', () => {
    const result = flightSearchSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
  });
});
