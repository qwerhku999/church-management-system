import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: {
    default: "MinistryFlow",
    template: "%s | MinistryFlow",
  },
  description: "Modern Church Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--text)] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}