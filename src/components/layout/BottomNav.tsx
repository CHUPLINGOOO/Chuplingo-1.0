import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, BarChart3, User } from 'lucide-react';
import { useChuplingo } from '../../context/ChuplingoContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { claimedChallengeIds } = useChuplingo();

  const navItems = [
    { label: 'Inicio', path: '/', icon: Home, color: '#F05C54' },
    { label: 'Cursos', path: '/courses', icon: BookOpen, color: '#F05C54' },
    { label: 'Desafíos', path: '/challenges', icon: Trophy, color: '#FF9418' },
    { label: 'Progreso', path: '/progress', icon: BarChart3, color: '#12B7E8' },
    { label: 'Perfil', path: '/profile', icon: User, color: '#7354D9' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-3 py-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] sm:rounded-b-[32px] transition-colors">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = 
            item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);

          const IconComponent = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive ? 'scale-105' : 'opacity-65 hover:opacity-100'
              }`}
              style={{
                color: isActive ? item.color : '#94A3B8'
              }}
            >
              <div 
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'shadow-sm' : ''
                }`}
                style={{
                  backgroundColor: isActive ? `${item.color}18` : 'transparent'
                }}
              >
                <IconComponent className="w-5 h-5 transition-transform" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-black' : 'font-medium'}`}>
                {item.label}
              </span>
              
              {item.label === 'Desafíos' && claimedChallengeIds.length === 0 && (
                <span className="absolute top-1.5 right-3 w-2 h-2 bg-[#FF9418] rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};