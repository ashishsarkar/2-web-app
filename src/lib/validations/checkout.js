import { z } from 'zod';

export const checkoutSchema = z.object({
  cardNumber: z
    .string()
    .refine((val) => !val || val.replace(/\s/g, '').length >= 13, 'Card number must be 13-19 digits'),
  expiry: z
    .string()
    .refine((val) => !val || /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(val), 'Use MM/YY format'),
  cvv: z
    .string()
    .refine((val) => !val || /^[0-9]{3,4}$/.test(val), 'CVV must be 3 or 4 digits'),
});
