"use client";

import { Toaster, toast as hotToast } from "react-hot-toast";
import type { ReactNode } from "react";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 3200,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.45)",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#0f172a" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#0f172a" } },
        }}
      />
    </>
  );
}

export const toast = hotToast;
