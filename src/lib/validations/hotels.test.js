import { hotelSearchSchema } from './hotels';

describe('hotelSearchSchema', () => {
  const valid = { location: 'Mumbai', checkIn: '2026-03-15', checkOut: '2026-03-18' };

  it('accepts a fully valid payload', () => {
    expect(hotelSearchSchema.safeParse(valid).success).toBe(true);
  });

  describe('location', () => {
    it('rejects empty location', () => {
      const result = hotelSearchSchema.safeParse({ ...valid, location: '' });
      expect(result.success).toBe(false);
    });

    it('accepts any non-empty city name', () => {
      expect(hotelSearchSchema.safeParse({ ...valid, location: 'Bengaluru' }).success).toBe(true);
    });
  });

  describe('checkIn', () => {
    it('rejects empty checkIn', () => {
      const result = hotelSearchSchema.safeParse({ ...valid, checkIn: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('checkOut', () => {
    it('rejects empty checkOut', () => {
      const result = hotelSearchSchema.safeParse({ ...valid, checkOut: '' });
      expect(result.success).toBe(false);
    });

    it('rejects checkOut before checkIn', () => {
      const result = hotelSearchSchema.safeParse({
        ...valid,
        checkIn: '2026-03-18',
        checkOut: '2026-03-15',
      });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/after/i);
    });

    it('rejects checkOut equal to checkIn', () => {
      const result = hotelSearchSchema.safeParse({
        ...valid,
        checkIn: '2026-03-15',
        checkOut: '2026-03-15',
      });
      expect(result.success).toBe(false);
    });

    it('accepts checkOut one day after checkIn', () => {
      const result = hotelSearchSchema.safeParse({
        ...valid,
        checkIn: '2026-03-15',
        checkOut: '2026-03-16',
      });
      expect(result.success).toBe(true);
    });
  });

  it('rejects empty object', () => {
    const result = hotelSearchSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
  });
});
