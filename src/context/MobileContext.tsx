'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface MobileContextType {
  isMobile: boolean;
}

const MobileContext = createContext<MobileContextType>({ isMobile: false });

export const MobileProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Using md breakpoint (768px)
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => useContext(MobileContext); 