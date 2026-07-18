"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";

type ToastContextType = { toast: (msg: string) => void };

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((m: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMsg(m);
    timer.current = setTimeout(() => setMsg(""), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {msg && (
        <div className="toast" role="status">
          {msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}
