import { z } from 'zod';

export const flightSearchSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  departureDate: z.string().min(1, 'Departure date is required'),
  returnDate: z.string().optional(),
});
