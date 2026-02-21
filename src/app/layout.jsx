import './globals.css';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ChatWidget from '@/components/chatbot/ChatWidget/ChatWidget';

export const metadata = {
  title: 'Book - Flights & Hotels',
  description: 'Book flights and hotels at the best prices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
