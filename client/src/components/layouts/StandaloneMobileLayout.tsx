import type { ReactNode } from 'react';

interface StandaloneMobileLayoutProps {
  children: ReactNode;
}

const StandaloneMobileLayout = ({ children }: StandaloneMobileLayoutProps) => {
  return (
    <div className="mobile-app-container standalone-mobile-layout">
      <main className="mobile-content standalone-mobile-content">{children}</main>
    </div>
  );
};

export default StandaloneMobileLayout;
