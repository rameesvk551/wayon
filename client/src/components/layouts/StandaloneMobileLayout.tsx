import type { ReactNode } from 'react';
import AppHeader from '../AppHeader';

interface StandaloneMobileLayoutProps {
  children: ReactNode;
}

const StandaloneMobileLayout = ({ children }: StandaloneMobileLayoutProps) => {
  return (
    <div className="mobile-app-container standalone-mobile-layout">
      <AppHeader />
      <main className="mobile-content standalone-mobile-content">{children}</main>
    </div>
  );
};

export default StandaloneMobileLayout;
