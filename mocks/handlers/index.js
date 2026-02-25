import { flightHandlers } from './flights.js';
import { hotelHandlers } from './hotels.js';
import { bookingHandlers } from './booking.js';
import { confirmationHandlers } from './confirmations.js';
import { userHandlers } from './user.js';
import { chatHandlers } from './chat.js';
import { walletHandlers } from './wallet.js';
import { promoHandlers } from './promo.js';

export const handlers = [
  ...flightHandlers,
  ...hotelHandlers,
  ...bookingHandlers,
  ...confirmationHandlers,
  ...userHandlers,
  ...chatHandlers,
  ...walletHandlers,
  ...promoHandlers,
];
