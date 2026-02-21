import { flightHandlers } from './flights.js';
import { hotelHandlers } from './hotels.js';
import { bookingHandlers } from './booking.js';
import { userHandlers } from './user.js';
import { chatHandlers } from './chat.js';

export const handlers = [
  ...flightHandlers,
  ...hotelHandlers,
  ...bookingHandlers,
  ...userHandlers,
  ...chatHandlers,
];
