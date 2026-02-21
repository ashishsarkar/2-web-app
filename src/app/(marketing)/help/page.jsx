import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function HelpCentrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Centre</h1>
      <p className="text-gray-600 mb-12">Find answers to commonly asked questions about booking flights and hotels.</p>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking & Reservations</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">How do I search for flights?</h3>
              <p className="text-gray-600 text-sm">Enter your origin and destination airports (e.g. DEL for Delhi, BOM for Mumbai), select your travel date, and click Search. We&apos;ll show you available flights with the best prices.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">Can I modify my booking after confirmation?</h3>
              <p className="text-gray-600 text-sm">Modifications depend on the airline or hotel policy. You can request changes from My Bookings, or contact our support team at support@book.example.com within 24 hours of booking for assistance.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">How do I view my booking confirmation?</h3>
              <p className="text-gray-600 text-sm">After completing your booking, you&apos;ll receive a confirmation page with your booking reference. You can also access all bookings from the My Bookings section when logged in.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancellations & Refunds</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">What is your cancellation policy?</h3>
              <p className="text-gray-600 text-sm">Free cancellation is available up to 24 hours before departure for most flights, and up to 48 hours before check-in for hotels. Beyond that, cancellation fees may apply as per the provider&apos;s terms.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">When will I receive my refund?</h3>
              <p className="text-gray-600 text-sm">Refunds are typically processed within 5–7 business days to your original payment method. For credit or debit card payments, your bank may take an additional 3–5 days to reflect the credit.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment & Billing</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">We accept major credit and debit cards (Visa, Mastercard, RuPay), net banking, UPI, and digital wallets. All transactions are secured with industry-standard encryption.</p>
            </div>
          </div>
        </section>

        <section className="bg-indigo-50 rounded-xl p-8 border border-indigo-100">
          <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 text-sm mb-4">Our support team is available 24/7. Visit our <Link href={ROUTES.CONTACT_US} className="text-indigo-600 font-medium hover:underline">Contact Us</Link> page for more ways to reach us.</p>
        </section>
      </div>
    </div>
  );
}
