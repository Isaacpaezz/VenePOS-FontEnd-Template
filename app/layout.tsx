
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen font-sans text-slate-900 antialiased">
      {children}
    </div>
  );
}
