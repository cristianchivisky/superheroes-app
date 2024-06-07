import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer'
import Navbar from '@/app/Navbar'
import { Toaster } from 'react-hot-toast'
import classNames from 'classnames';

const inter = Inter({ subsets: ["latin"] }); // Load Google Font

export const metadata: Metadata = {
  title: "Superheroes App",
  description: "SPA Superheroes Marvel y DC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <title>Superheroes</title>
        <meta name="description" content="SPA Superheroes Marvel y DC" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body className={classNames(inter.className, 'bg-red', 'flex', 'h-screen', 'flex-col', 'justify-between')}>
        <Navbar />
        {/* Toaster para notificaciones en la parte superior central */}
        <Toaster position="top-center" reverseOrder={false} />
        <main className="mb-auto">{children}</main>
        <Footer />
    </body>
    </html>
  );
}
