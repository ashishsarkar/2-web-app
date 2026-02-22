'use client';

import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('pwa-prompt-dismissed');
    if (stored) setDismissed(true);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    if (typeof window !== 'undefined') localStorage.setItem('pwa-prompt-dismissed', '1');
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <p className="font-medium text-gray-900 mb-2">Install our app</p>
      <p className="text-sm text-gray-600 mb-3">Add to home screen for quick access and offline use.</p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
        >
          Later
        </button>
      </div>
    </div>
  );
}
