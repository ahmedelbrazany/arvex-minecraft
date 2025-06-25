'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface WebSocketContextType {
  isConnected: boolean;
  socket: WebSocket | null;
  messages: string[];
  sendMessage: (message: string) => void;
  connectionError: string | null;
  isLoading: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldCloseSocket, setShouldCloseSocket] = useState(false);
  const { data: session } = useSession();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;
  const reconnectInterval = 5000;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);
  const isReconnecting = useRef(false);
  const wasConnected = useRef(false);

  const connectWebSocket = useCallback(async () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setIsLoading(false);
      return;
    }

    if (isReconnecting.current) return;
    if (!session?.accessToken || !session?.user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const isNetworkAvailable = await checkNetworkStatus();
      if (!isNetworkAvailable) {
        setConnectionError('No internet connection');
        setIsLoading(false);
        return;
      }

      console.log(localStorage.getItem("accountToken"));
      console.log(session.accessToken);

      if (!localStorage.getItem("accountToken")) {
        const response = await fetch('https://host.storiza.store/api/v1/account/google', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (!response.ok) {
          handleLogout();
          return;
        }

        const data = await response.json();
        localStorage.setItem('authToken', session.accessToken);
        localStorage.setItem('userEmail', session.user.email);
        localStorage.setItem('accountToken', data.token);
      }

      isReconnecting.current = true;

      const panelResponse = await fetch(`https://host.storiza.store/api/v1/minecraftpanel/${window.location.href.split("/")[4]}/panel`, {
        headers: {
          "authorization": localStorage.getItem("accountToken") || ""
        }
      });

      const panel = await panelResponse.json();
      if (typeof panel !== "object") return;

      if (panel?.errorCode === 101) {
        localStorage.removeItem('accountToken');
      }

      const wsURL = (location.protocol.endsWith("s:") ? "wss://" : "wss://") + "host.storiza.store" + "/?data=" + panel?.data;
      socketRef.current = new WebSocket(wsURL);

      timeoutRef.current = setTimeout(() => {
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
          setConnectionError('Server is not responding');
          setIsLoading(false);
          isReconnecting.current = false;
          socketRef.current?.close();
        }
      }, 5000);

      socketRef.current.onopen = () => {
        console.log('WebSocket connected!');
        socketRef.current?.send(JSON.stringify({}));
        setIsConnected(true);
        wasConnected.current = true;
        setConnectionError(null);
        setIsLoading(false);
        reconnectAttempts.current = 0;
        isReconnecting.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        pingInterval.current = setInterval(() => {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send('ping');
          }
        }, 30000);
      };

      socketRef.current.onmessage = (event) => {
        if (event.data === 'unauth') {
          handleLogout();
          return;
        }
        if (event.data === 'pong') return;

        setMessages((prev) => [...prev, event.data]);
      };

      socketRef.current.onclose = (event) => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsLoading(false);
        isReconnecting.current = false;
        if (pingInterval.current) clearInterval(pingInterval.current);

        if (!event.wasClean) {
          setConnectionError('Connection lost');
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            setTimeout(connectWebSocket, reconnectInterval);
          } else {
            setConnectionError('Max reconnection attempts reached');
          }
        } else {
          setConnectionError('Connection closed cleanly');
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsLoading(false);
        isReconnecting.current = false;
        setShouldCloseSocket(true);
        setConnectionError('WebSocket error occurred');
      };
    } catch (error) {
      console.error('Authentication error:', error);
      setConnectionError('Authentication failed');
      setIsLoading(false);
      isReconnecting.current = false;
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    connectWebSocket();

    return () => {
      if (shouldCloseSocket) {
      socketRef.current?.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pingInterval.current) clearInterval(pingInterval.current);
      }
    };
  }, [connectWebSocket, session]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wasConnected.current) {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
          connectWebSocket();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectWebSocket]);

  const checkNetworkStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      await fetch('https://www.google.com/favicon.ico', {
        signal: controller.signal,
        cache: 'no-store',
        mode: 'no-cors'
      });
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accountToken');
    window.location.href = '/api/auth/signout';
  };

  const sendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, socket: socketRef.current, messages, sendMessage, connectionError, isLoading }}>
      {children}
    </WebSocketContext.Provider>
  );
};
  