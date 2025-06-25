'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/context/WebSocketContext';

interface LoadingStateProps {
  children: React.ReactNode;
}

export default function LoadingState({ children }: LoadingStateProps) {
  const { status } = useSession();
  const { connectionError, isLoading, isConnected } = useWebSocket();
  const router = useRouter();
  const [showServerError, setShowServerError] = useState(false);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [showConnectionError, setShowConnectionError] = useState(false);

  // Minimum loading time of 2 seconds to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTime(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Debounce connection error display
  useEffect(() => {
    if (connectionError && !isConnected) {
      const timer = setTimeout(() => {
        setShowConnectionError(true);
      }, 1000); // Wait 1 second before showing error

      return () => clearTimeout(timer);
    } else {
      setShowConnectionError(false);
    }
  }, [connectionError, isConnected]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((status === 'loading' || isLoading) && !connectionError && !isConnected) {
        setShowServerError(true);
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [status, isLoading, connectionError, isConnected]);

  // Show loading state for minimum time or until everything is ready
  if (minLoadingTime || status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (showServerError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Server Connection Issue</h2>
          <p className="text-gray-300 mb-6">
            We&apos;re experiencing some server issues. Our team is working on it.
          </p>
          <div className="space-y-4">
            <a
              href="https://discord.gg/your-discord-link"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Contact us on Discord
            </a>
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showConnectionError && !isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Connection Error</h2>
          <p className="text-gray-300 mb-6">{connectionError}</p>
          <div className="space-y-4">
            <a
              href="https://discord.gg/your-discord-link"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Contact us on Discord
            </a>
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 