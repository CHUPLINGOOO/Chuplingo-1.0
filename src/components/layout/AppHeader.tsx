import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  iconEmoji?: string;
  bgGradient?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  iconEmoji,
  bgGradient = 'from-[#F05C54] to-[#FF7B74]',
  showBack = false,
  onBack,
  rightAction
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`bg-gradient-to-r ${bgGradient} text-white px-5 pt-7 pb-6 rounded-b-[28px] shadow-md relative overflow-hidden`}>
      {/* Subtle decorative background shapes */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-lg pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              aria-label="Volver"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-transform active:scale-90"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              {iconEmoji && <span>{iconEmoji}</span>}
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs font-medium text-white/90 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightAction && (
          <div className="relative z-10">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
};