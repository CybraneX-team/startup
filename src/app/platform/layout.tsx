import { ReactNode } from 'react';
import './globals.css';
// Import the platform CSS directly to ensure it's loaded
import './components/platform.css';

interface PlatformLayoutProps {
  children: ReactNode;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  return (
    <div className="platform-layout">
      {children}
    </div>
  );
} 