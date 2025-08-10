import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NAIH Travel Agent (Beta)',
  description: 'AI-powered trip planner for Nigeria Aviation Innovation Hub'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-navy">
        {children}
      </body>
    </html>
  );
}
