import { NextResponse } from 'next/server';

const MOCK_RESPONSES = {
  default: "I'm your booking assistant. I can help you search flights, search hotels, check booking status, or answer FAQs. How can I help you today?",
  search_flights: "I can help you search flights. Try using the search form on our homepage or go to /flights/search to find flights.",
  search_hotels: "I can help you find hotels. Use the search form on our homepage or visit /hotels/search to explore options.",
  booking_status: "To check your booking status, go to My Bookings from the menu. You can also enter your booking ID if you have it.",
  faq: "Here are some FAQs: 1) Cancellation: Free up to 24hrs before departure. 2) Refunds: Processed within 5-7 business days. 3) Support: 24/7 via chat.",
};

export async function POST(request) {
  const body = await request.json();
  const message = (body.message || '').toLowerCase();

  let reply = MOCK_RESPONSES.default;
  if (message.includes('flight') || message.includes('search flight')) reply = MOCK_RESPONSES.search_flights;
  else if (message.includes('hotel') || message.includes('search hotel')) reply = MOCK_RESPONSES.search_hotels;
  else if (message.includes('booking') || message.includes('status')) reply = MOCK_RESPONSES.booking_status;
  else if (message.includes('faq') || message.includes('cancel') || message.includes('refund')) reply = MOCK_RESPONSES.faq;

  return NextResponse.json({ message: reply });
}
