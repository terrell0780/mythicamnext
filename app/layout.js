import "./globals.css";
import Navbar from "./components/Navbar";
import { SkipLink } from "./components/SkipLink";

export const metadata = {
  title: "MythicAmnex — AI-Powered Platform",
  description: "MythicAmnex helps you automate, analyze, and grow with AI-powered tools. Start free today.",
  keywords: "SaaS automation, autonomous growth, AI scaling, revenue orchestration, Sentinel AI",
  robots: "index, follow",
  alternates: {
    canonical: 'https://mythicamnex.vercel.app',
  },
  openGraph: {
    title: "MythicAmnex — AI-Powered Platform",
    description: "MythicAmnex helps you automate, analyze, and grow with AI-powered tools. Start free today.",
    url: 'https://mythicamnex.vercel.app',
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#4f46e5',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`min-h-screen selection:bg-blue-500/30 bg-surface-950 text-white`} suppressHydrationWarning>
        <SkipLink />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
