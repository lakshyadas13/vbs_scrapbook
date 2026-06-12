import type { Metadata } from 'next';
import { Quicksand, Gloria_Hallelujah, Patrick_Hand, Cabin_Sketch } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthWrapper from '@/components/AuthWrapper';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const gloria = Gloria_Hallelujah({
  subsets: ['latin'],
  variable: '--font-gloria',
  weight: ['400'],
  display: 'swap',
});

const patrick = Patrick_Hand({
  subsets: ['latin'],
  variable: '--font-patrick',
  weight: ['400'],
  display: 'swap',
});

const cabinSketch = Cabin_Sketch({
  subsets: ['latin'],
  variable: '--font-cabin-sketch',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "VB's Scrapbook",
  description: 'A cozy, wobbly handwritten scrapbook of love, mood sharing, and couple memories.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Material Symbols Outlined from Google CDN */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${quicksand.variable} ${gloria.variable} ${patrick.variable} ${cabinSketch.variable} font-quicksand text-on-surface bg-background min-h-screen pb-24 md:pb-8`}>
        <AuthWrapper>
          <Navbar />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
