import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'sleepy' | 'curious';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ChuplingoMascot: React.FC<MascotProps> = ({ 
  mood = 'happy', 
  size = 'md',
  className = '' 
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56'
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full drop-shadow-md transition-transform hover:scale-105 duration-300"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft back glow circle */}
        <circle cx="100" cy="105" r="75" fill="#FFF3E0" />

        {/* Tail Feathers */}
        <path d="M50 140 C35 155, 30 175, 45 185 C60 175, 65 155, 55 140 Z" fill="#12B7E8" />
        <path d="M60 145 C48 165, 45 185, 62 192 C75 180, 75 160, 68 145 Z" fill="#67C66A" />

        {/* Main Body */}
        <path 
          d="M100 45 C65 45, 55 85, 60 130 C65 165, 95 175, 125 175 C155 175, 160 140, 155 100 C150 60, 135 45, 100 45 Z" 
          fill="#F05C54" 
        />

        {/* Belly Patch (Yellow/Coral gradient look) */}
        <path 
          d="M105 90 C85 90, 80 115, 85 145 C90 168, 115 172, 130 165 C145 155, 145 125, 140 105 C135 90, 120 90, 105 90 Z" 
          fill="#FFD166" 
        />

        {/* Tropical Crest / Head feathers */}
        <path d="M105 45 C115 20, 135 15, 140 30 C130 38, 120 44, 105 45 Z" fill="#FF9418" />
        <path d="M95 47 C100 25, 115 18, 120 32 C112 40, 105 45, 95 47 Z" fill="#67C66A" />
        <path d="M85 50 C80 32, 92 25, 100 36 C95 42, 90 48, 85 50 Z" fill="#12B7E8" />

        {/* Wing */}
        <path 
          d="M60 100 C50 115, 52 145, 75 155 C85 150, 88 130, 82 110 C78 95, 68 95, 60 100 Z" 
          fill="#43A047" 
        />
        {/* Wing accent feather */}
        <path 
          d="M58 112 C52 125, 55 145, 70 152 C75 142, 75 125, 70 115 Z" 
          fill="#12B7E8" 
        />

        {/* Eyes & Cheeks */}
        {/* Eye White */}
        <circle cx="126" cy="78" r="16" fill="#FFFFFF" stroke="#183153" strokeWidth="2.5" />
        
        {/* Pupil based on mood */}
        {mood === 'happy' || mood === 'celebrating' ? (
          <>
            <circle cx="129" cy="78" r="8.5" fill="#183153" />
            <circle cx="132" cy="74" r="3.5" fill="#FFFFFF" />
            <circle cx="127" cy="81" r="1.5" fill="#FFFFFF" />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="133" cy="72" r="7.5" fill="#183153" />
            <circle cx="135" cy="70" r="2.5" fill="#FFFFFF" />
          </>
        ) : (
          <>
            <path d="M118 78 Q126 72 134 78" stroke="#183153" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Cute blush cheek */}
        <ellipse cx="112" cy="94" rx="7" ry="4.5" fill="#FF8A80" opacity="0.8" />

        {/* Curved Friendly Beak */}
        <path 
          d="M138 74 C165 78, 175 92, 160 115 C150 108, 142 98, 138 88 Z" 
          fill="#FF9418" 
          stroke="#D97706" 
          strokeWidth="2" 
        />
        <path 
          d="M140 88 C155 94, 155 105, 143 108 Z" 
          fill="#F5C62D" 
        />

        {/* Feet / Paws */}
        <ellipse cx="98" cy="177" rx="8" ry="4.5" fill="#FF9418" />
        <ellipse cx="120" cy="177" rx="8" ry="4.5" fill="#FF9418" />

        {/* Celebrating Sparkles or Thinking Bubble */}
        {mood === 'celebrating' && (
          <>
            <path d="M165 40 L168 50 L178 53 L168 56 L165 66 L162 56 L152 53 L162 50 Z" fill="#F5C62D" />
            <path d="M40 60 L42 66 L48 68 L42 70 L40 76 L38 70 L32 68 L38 66 Z" fill="#FF9418" />
            <circle cx="160" cy="80" r="3" fill="#12B7E8" />
          </>
        )}

        {mood === 'thinking' && (
          <>
            <circle cx="165" cy="45" r="4" fill="#7354D9" opacity="0.6" />
            <circle cx="175" cy="35" r="6" fill="#7354D9" opacity="0.8" />
            <text x="171" y="38" fontSize="9" fontWeight="bold" fill="#FFF">?</text>
          </>
        )}
      </svg>
    </div>
  );
};