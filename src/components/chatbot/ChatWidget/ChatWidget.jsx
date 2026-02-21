'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your booking assistant. How can I help you today?", time: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    setMessages((m) => [...m, { role: 'user', text, time: new Date().toISOString() }]);
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', text: data.message || 'Sorry, I could not understand.', time: new Date().toISOString() }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Something went wrong. Please try again.', time: new Date().toISOString() }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          className="absolute bottom-14 right-0 w-96 max-w-[calc(100vw-3rem)] h-[480px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Chat widget"
        >
          <div className="flex items-center justify-between p-4 bg-indigo-600 text-white">
            <h3 className="font-semibold">Booking Assistant</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-indigo-500 rounded"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-2 ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(msg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-xl px-4 py-2">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="p-4 border-t border-gray-200 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center text-2xl"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        💬
      </button>
    </div>
  );
}
