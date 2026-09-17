import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ 
  children, 
  className = '',
  hasBottomNav = true 
}) => {
  return (
    <div className="min-h-screen bg-[#E5E9F2] dark:bg-slate-950 flex justify-center items-start selection:bg-[#F05C54] selection:text-white font-sans antialiased transition-colors">
      {/* Phone container wrapper */}
      <main 
        className={`w-full max-w-[430px] min-h-screen bg-[#F7F8FC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col relative transition-colors duration-200 sm:my-4 sm:rounded-[48px] sm:min-h-[calc(100vh-32px)] sm:border-[8px] sm:border-slate-800 dark:sm:border-slate-800/50 overflow-hidden ${
          hasBottomNav ? 'pb-24' : 'pb-6'
        } ${className}`}
      >
        {/* Notch simulation for sm screens */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50 pointer-events-none" />

        {children}
      </main>
    </div>
  );
};