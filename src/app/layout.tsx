import { firebaseConfig } from "@/util/util";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { app } from "./fb";

import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

console.log("Initialized App" + app);

export const metadata: Metadata = {
  title: "Messenger",
  description: "Full Stack Messaging app",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className + "relative overflow-hidden"}>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
