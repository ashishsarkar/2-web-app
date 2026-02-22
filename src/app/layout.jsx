import './globals.css';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ChatWidget from '@/components/chatbot/ChatWidget/ChatWidget';
import PWAInstallPrompt from '@/components/shared/PWAInstallPrompt';
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration';

export const metadata = {
  title: 'Book - Flights & Hotels',
  description: 'Book flights and hotels at the best prices',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Flight & Hotel Booking',
  description: 'Book flights and hotels at the best prices. Search, compare, and book in minutes.',
  url: 'https://booking.example.com',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <PWAInstallPrompt />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
