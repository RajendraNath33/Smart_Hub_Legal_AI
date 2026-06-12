
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartHub Legal AI & Learning Platform',
  description: 'Enterprise Legal Intelligence and Learning Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Alegreya:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-secondary/30 selection:text-secondary-foreground">
        {children}
      </body>
    </html>
  );
}
