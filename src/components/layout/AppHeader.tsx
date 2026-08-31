import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  iconEmoji?: string;
  bgGradient?: string;
  showBack?: boolean;
  fallbackRoute?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  iconEmoji,
  bgGradient = 'from-[#F05C54] to-[#FF7B74]',
  showBack = false,
  fallbackRoute = '/',
  onBack,
  rightAction
}) => {
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onBack) {
      onBack();
      return;
    }

    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackRoute, { replace: true });
    }
  };

  return (
    <header className={`bg-gradient-to-r ${bgGradient} text-white px-5 pt-7 pb-6 rounded-b-[28px] shadow-md relative overflow-hidden select-none`}>
      {/* Subtle decorative background shapes */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-lg pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Volver atrás"
              className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-90 backdrop-blur-sm flex items-center justify-center text-white transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 truncate">
              {iconEmoji && <span className="shrink-0">{iconEmoji}</span>}
              <span className="truncate">{title}</span>
            </h1>
            {subtitle && (
              <p className="text-xs font-medium text-white/90 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightAction && (
          <div className="relative z-10 shrink-0 ml-2">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
};