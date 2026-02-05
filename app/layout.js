import "./globals.css";
import Navbar from "./components/Navbar";
import PromotionOverlay from "./components/PromotionOverlay";

export const metadata = {
  title: "Digital Portfolio | SaaS & Venture Growth",
  description: "Interactive showcase of high-performance SaaS platforms, data architectures, and revenue optimization systems.",
  openGraph: {
    title: "MythiCorCam | System Intelligence Redefined",
    description: "Orchestrate your revenue, growth, and engagement with the world's first autonomous SaaS scaling engine.",
    url: 'https://mythicorcam.intelligence',
    siteName: 'MythiCorCam',
    images: [
      {
        url: '/assets/slide1.png',
        width: 1200,
        height: 630,
        alt: 'MythiCorCam Intelligence Dashboard',
      },
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MythiCorCam | System Intelligence Redefined',
    description: 'The autonomous growth engine for modern SaaS.',
    images: ['/assets/slide1.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`min-h-screen selection:bg-blue-500/30 bg-surface-950 text-white`}>
        <Navbar />
        {children}
        <PromotionOverlay />
      </body>
    </html>
  );
}
