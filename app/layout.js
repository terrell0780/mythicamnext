import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "EliteAniCore | Autonomous Growth Engine",
  description: "The autonomous SaaS scaling engine. Orchestrate revenue, growth, and engagement.",
  keywords: "SaaS automation, autonomous growth, AI scaling, revenue orchestration, Sentinel AI",
  robots: "index, follow",
  alternates: {
    canonical: 'https://eliteanicore.intelligence',
  },
  openGraph: {
    title: "EliteAniCore | System Intelligence Redefined",
    description: "Orchestrate your revenue, growth, and engagement with the world's first autonomous SaaS scaling engine.",
    url: 'https://eliteanicore.intelligence',
    siteName: 'EliteAniCore',
    images: [
      {
        url: '/assets/slide1.png',
        width: 1200,
        height: 630,
        alt: 'EliteAniCore Intelligence Dashboard',
      },
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EliteAniCore | System Intelligence Redefined',
    description: 'The autonomous growth engine for modern SaaS.',
    images: ['/assets/slide1.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`min-h-screen selection:bg-blue-500/30 bg-surface-950 text-white`} suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
