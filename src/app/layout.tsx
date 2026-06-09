import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'AAR + UAV Mission Lab',
  description: 'Plataforma Next para simulacao AAR, ontologia operacional e otimizacao UAV com PyThrust.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
