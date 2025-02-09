import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NetworkProvider } from "@/context/NetworkContext";
import Providers from "./providers";
import { Inter } from 'next/font/google';
import { type ReactNode } from 'react';
import { BaseProvider } from "./Baseprovider";
import '@coinbase/onchainkit/styles.css'; 
import { MobileProvider } from "@/context/MobileContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "W3Chat.io",
  description:
    "Revolutionize your blockchain experience with specialized AI bots",
};

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
       <head>
        <link rel="icon" type="image/svg+xml" href="/fevicon.svg" />
        <title>W3Chat.io | All-in-one Agent</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BaseProvider>
          <Providers>
          <MobileProvider>
            <NetworkProvider>
              {props.children}
            </NetworkProvider>
            </MobileProvider>
          </Providers>
        </BaseProvider>
      </body>
    </html>
  );
}