import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { notificationService } from "@/api/notificationService.js";
import { useAuth } from "./AuthContext.jsx";
import { SOCKET_URL, USE_MOCKS } from "@/config/env.js";
import { io as ioClient } from "socket.io-client";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [activitySignal, setActivitySignal] = useState(0);
  const socketRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!user || loading) return;
    try {
      const res = await notificationService.list();
      setItems(res.data);
      setUnread(res.unreadCount ?? res.data.filter((n) => !n.read).length);
    } catch (err) {
      console.warn('Failed to load notifications', err.message || err);
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && user) {
      refresh();
    }
  }, [user, loading, refresh]);

  // realtime socket subscription
  useEffect(() => {
    if (loading || !user || USE_MOCKS) return;
    const token = localStorage.getItem('civiceye_token');
    if (!token) return;
    const socket = ioClient(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;
    socket.on('connect', () => {
      // connected
    });
    socket.on('notification:new', (n) => {
      setItems((arr) => [n, ...arr]);
      setUnread((c) => c + (n.read ? 0 : 1));
    });
    socket.on('activity:new', () => {
      setActivitySignal((value) => value + 1);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, loading]);

  const markRead = useCallback(async (id) => {
    await notificationService.markRead(id);
    setItems((arr) => arr.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnread((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead();
    setItems((arr) => arr.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }, []);

  return (
    <NotificationContext.Provider value={{ items, unread, refresh, markRead, markAllRead, activitySignal }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
