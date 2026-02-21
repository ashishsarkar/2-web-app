import { z } from 'zod';

export const checkoutSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .refine((val) => val.replace(/\s/g, '').length >= 13, 'Card number must be 13-19 digits'),
  expiry: z
    .string()
    .min(1, 'Expiry date is required')
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Use MM/YY format'),
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .regex(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),
});
