import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brillz Brain',
  description: 'AI orchestrator dashboard for system operations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
