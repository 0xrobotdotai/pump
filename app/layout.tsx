import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import { Inter } from "next/font/google";
import { LayoutProvider } from "@/components/layout-provider";


const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Robot Pump | The First Meme Fair Launch Platform on IoTeX.",
  description: "The First Meme Fair Launch Platform on IoTeX: earn,meme culture,instantly tradable without having to seed liquidity.",
  keywords: "IoTex, ROBA, Pump Fun, IOTX, ROBA",
  viewport: {
    userScalable: false,
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    width: 'device-width',
  },
  icons: {
    icon: "favicon.ico",
  },
  
  alternates: {
    canonical: 'https://pump.0xrobot.ai/'
  },

  openGraph: {
    title: 'Robot Pump | The First Meme Fair Launch Platform on IoTeX.',
    description: 'The First Meme Fair Launch Platform on IoTeX: earn,meme culture,instantly tradable without having to seed liquidity.',
    type: 'website',
    siteName: 'Robot Pump',
    images: [
      {
        url: '/imgs/twitter-share.png',
        width: 1200,
        height: 630,
        alt: 'Robot Pump',
      },
    ],
  },

  twitter: {
    title: 'Robot Pump | The First Meme Fair Launch Platform on IoTeX.',
    description: 'The First Meme Fair Launch Platform on IoTeX: earn,meme culture,instantly tradable without having to seed liquidity.',
    card: 'summary_large_image',
    creator: '@0xrobot_ai',
    images: []
  },

};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head />
      <body className={clsx("min-h-screen antialiased")}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen bg-background">
            <Navbar />
            <div className="flex-1 pb-20 w-full lg:max-w-[1200px] px-4 lg:px-8 mx-auto">{children}</div>
            <LayoutProvider />
          </div>
        </Providers>
        <Toaster
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              border: "1px #333 solid",
              fontSize: 14,
            },
            success: {
              style: {},
            },
            error: {
              style: {
                
              },
            },
          }}
        />
      </body>
    </html>
  );
}
