import { z } from 'zod';

export const hotelSearchSchema = z
  .object({
    location: z.string().min(1, 'Location is required'),
    checkIn: z.string().min(1, 'Check-in date is required'),
    checkOut: z.string().min(1, 'Check-out date is required'),
  })
  .refine((data) => !data.checkIn || !data.checkOut || data.checkOut > data.checkIn, {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  });
