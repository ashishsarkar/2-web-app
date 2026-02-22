import { checkoutSchema } from './checkout';

describe('checkoutSchema', () => {
  const validBase = { cardNumber: '4242424242424242', expiry: '12/28', cvv: '123' };

  describe('cardNumber', () => {
    it('accepts valid 16-digit card number', () => {
      const result = checkoutSchema.safeParse(validBase);
      expect(result.success).toBe(true);
    });

    it('accepts card with spaces', () => {
      const result = checkoutSchema.safeParse({ ...validBase, cardNumber: '4242 4242 4242 4242' });
      expect(result.success).toBe(true);
    });

    it('rejects card number shorter than 13 digits', () => {
      const result = checkoutSchema.safeParse({ ...validBase, cardNumber: '424242424242' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('13-19 digits');
      }
    });

    it('allows empty string (optional)', () => {
      const result = checkoutSchema.safeParse({ ...validBase, cardNumber: '' });
      expect(result.success).toBe(true);
    });
  });

  describe('expiry', () => {
    it('accepts valid MM/YY format', () => {
      const result = checkoutSchema.safeParse(validBase);
      expect(result.success).toBe(true);
    });

    it('accepts MMYY without slash', () => {
      const result = checkoutSchema.safeParse({ ...validBase, expiry: '1228' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid month (00)', () => {
      const result = checkoutSchema.safeParse({ ...validBase, expiry: '00/28' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid month (13)', () => {
      const result = checkoutSchema.safeParse({ ...validBase, expiry: '13/28' });
      expect(result.success).toBe(false);
    });

    it('rejects non-date format', () => {
      const result = checkoutSchema.safeParse({ ...validBase, expiry: 'invalid' });
      expect(result.success).toBe(false);
    });
  });

  describe('cvv', () => {
    it('accepts 3-digit CVV', () => {
      const result = checkoutSchema.safeParse(validBase);
      expect(result.success).toBe(true);
    });

    it('accepts 4-digit CVV', () => {
      const result = checkoutSchema.safeParse({ ...validBase, cvv: '1234' });
      expect(result.success).toBe(true);
    });

    it('rejects 2-digit CVV', () => {
      const result = checkoutSchema.safeParse({ ...validBase, cvv: '12' });
      expect(result.success).toBe(false);
    });

    it('rejects non-numeric CVV', () => {
      const result = checkoutSchema.safeParse({ ...validBase, cvv: '12a' });
      expect(result.success).toBe(false);
    });
  });

  it('accepts fully valid payload', () => {
    const result = checkoutSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validBase);
    }
  });
});
