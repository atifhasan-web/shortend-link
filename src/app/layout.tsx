import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Link Alchemist - Shorten Your Links with Magic',
  description: 'Generate short, custom-named links that redirect anywhere you want.',
  openGraph: {
    title: 'Link Alchemist - Shorten Your Links with Magic',
    description: 'The easiest way to shorten, manage, and track your links.',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'Link Alchemist Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link Alchemist - Shorten Your Links with Magic',
    description: 'The easiest way to shorten, manage, and track your links.',
    images: ['/icon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', inter.variable, poppins.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
