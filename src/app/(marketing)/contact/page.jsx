export default function ContactUsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-12">Get in touch with our customer support team. We&apos;re here to help with your bookings and enquiries.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
          <p className="text-gray-600 text-sm mb-4">For booking assistance, modifications, and general enquiries.</p>
          <p className="text-indigo-600 font-medium">support@book.example.com</p>
          <p className="text-gray-600 text-sm mt-1">Mon–Sun, 24/7</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-gray-600 text-sm mb-4">Speak directly with a support agent.</p>
          <p className="text-indigo-600 font-medium">+91 1800 123 4567</p>
          <p className="text-gray-600 text-sm mt-1">Toll-free, 9 AM – 9 PM IST</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Corporate Enquiries</h3>
          <p className="text-gray-600 text-sm mb-4">For business travel, partnerships, and B2B solutions.</p>
          <p className="text-indigo-600 font-medium">business@book.example.com</p>
          <p className="text-gray-600 text-sm mt-1">Mon–Fri, 10 AM – 6 PM IST</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Registered Office</h3>
          <p className="text-gray-600 text-sm mb-4">Book Travel Services Pvt. Ltd.</p>
          <p className="text-gray-600 text-sm">123 MG Road, Block A</p>
          <p className="text-gray-600 text-sm">Bengaluru, Karnataka 560001</p>
          <p className="text-gray-600 text-sm">India</p>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
        <p className="text-gray-600 text-sm">We aim to respond to all enquiries within 24 hours. For urgent booking-related issues, please call our toll-free number for immediate assistance.</p>
      </div>
    </div>
  );
}
