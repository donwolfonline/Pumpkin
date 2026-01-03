import type { Metadata } from "next";
import { Suspense } from 'react';
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pumpkin | The All-in-One Operating System for Modern Businesses",
  description: "Manage CRM, scheduling, payments, and automation in one place. Scale your service business with Pumpkin.",
};

import { PumpkinToastProvider } from "@/components/ui/pumpkin-toast";
import { NavigationLoader } from "@/components/ui/magical-loader";
import { NotificationProvider } from "@/components/providers/notification-provider";

import { PumpkinAssistant } from "@/components/pumpkin-assistant";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} antialiased bg-[#051c1c] text-white`}
      >
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        <PumpkinToastProvider>
          <NotificationProvider>
            {children}
            <PumpkinAssistant />
          </NotificationProvider>
        </PumpkinToastProvider>
      </body>
    </html>
  );
}
