import { Outlet, Link, useLocation } from 'react-router-dom';
import { Dumbbell, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '../utils/cn';
import { useWorkout } from '../hooks/useWorkout';
import { ProfilePopup } from './ProfilePopup';

export function Layout() {
  const location = useLocation();
  const { playerStats, isSoloLevelingMode, setIsSoloLevelingMode } = useWorkout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Dumbbell, label: 'Quest' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/guild', icon: Users, label: 'Guild' },
  ];

  return (
    <div className="min-h-screen bg-background text-text font-sans pb-24">
      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto max-w-md h-16 px-5 flex items-center justify-between">
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="relative group outline-none"
          >
            <div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden bg-surfaceHighlight group-active:scale-95 transition-transform">
              {playerStats.avatarUrl ? (
                <img src={playerStats.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                  LVL {playerStats.level}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-background flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black tracking-tighter text-white">
              Strive<span className="text-red-500">X</span>
            </h1>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1.5">
              Level Up Your Fitness
            </span>
          </div>

          <motion.button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1 rounded-xl text-white outline-none active:scale-90 transition-transform"
            whileTap={{ scale: 0.9 }}
          >
            <motion.span 
              animate={isMenuOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-current rounded-full"
            />
            <motion.span 
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-[2px] bg-current rounded-full"
            />
            <motion.span 
              animate={isMenuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-current rounded-full"
            />
          </motion.button>
        </div>

        {/* Hamburger Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="fixed top-20 right-5 w-64 bg-surface border border-white/10 rounded-2xl shadow-2xl z-50 p-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm font-bold text-white">Solo Leveling Mode</span>
                    <button 
                      onClick={() => setIsSoloLevelingMode(!isSoloLevelingMode)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        isSoloLevelingMode ? "bg-primary" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        animate={{ x: isSoloLevelingMode ? 26 : 2 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                  
                  <div className="h-[1px] bg-white/5 mx-2" />
                  
                  <div className="px-2 pb-2">
                    <p className="text-[10px] text-text-muted leading-relaxed">
                      {isSoloLevelingMode 
                        ? "Solo Leveling system aesthetics and daily quest info popups are currently enabled." 
                        : "Normal fitness tracking theme is active. System popups are disabled."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>


      <main className="container mx-auto px-5 pt-20 pb-6 max-w-md">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-white/5 z-50 pb-safe">
        <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-20 h-full transition-all duration-300",
                  isActive ? "text-white" : "text-text-muted hover:text-white/70"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn(
                  "text-[10px] mt-1.5 font-bold transition-opacity",
                  isActive ? "opacity-100" : "opacity-80"
                )}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <ProfilePopup 
        stats={playerStats}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
