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
        className={`w-full max-w-[430px] min-h-screen bg-[#F7F8FC] dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col relative transition-colors duration-200 sm:my-3 sm:rounded-[36px] sm:min-h-[calc(100vh-24px)] sm:border-[5px] sm:border-[#1E293B]/10 dark:sm:border-slate-800 overflow-hidden ${
          hasBottomNav ? 'pb-24' : 'pb-6'
        } ${className}`}
      >
        {children}
      </main>
    </div>
  );
};