import "./globals.css";
import { Inter } from 'next/font/google';
import Navbar from "./components/Navbar";
import { SkipLink } from "./components/SkipLink";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: "MythicAmnex — AI-Powered Platform",
  description: "MythicAmnex helps you automate, analyze, and grow with AI-powered tools. Start free today.",
  keywords: "SaaS automation, autonomous growth, AI scaling, revenue orchestration, Sentinel AI",
  robots: "index, follow",
  alternates: {
    canonical: 'https://zevanto.shop',
  },
  openGraph: {
    title: "MythicAmnex — AI-Powered Platform",
    description: "MythicAmnex helps you automate, analyze, and grow with AI-powered tools. Start free today.",
    url: 'https://zevanto.shop',
    siteName: 'MythicAmnex',
    images: [
      {
        url: '/assets/slide1.png',
        width: 1200,
        height: 630,
        alt: 'MythicAmnex Intelligence Dashboard',
      },
    ],
    locale: 'en_US',
    type: "website",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MythicAmnex',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MythicAmnex — AI-Powered Platform',
    description: 'MythicAmnex helps you automate, analyze, and grow with AI-powered tools. Start free today.',
    images: ['/assets/slide1.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <body className={`min-h-screen bg-surface-950 text-white antialiased`} suppressHydrationWarning>
        <SkipLink />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
