import { Outlet, Link, useLocation } from 'react-router-dom';
import { Dumbbell, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { cn } from '../utils/cn';
import { useWorkout } from '../hooks/useWorkout';
import { ProfilePopup } from './ProfilePopup';
import { SideNavBar } from './SideNavBar';
import { SystemMenu } from './SystemMenu';

export function Layout() {
  const location = useLocation();
  const { 
    playerStats, 
    isSliderOpen,
    sliderTab,
    openSlider,
    closeSlider,
    isSoloLevelingMode
  } = useWorkout();
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
          <motion.button 
            onClick={() => {
              const audio = new Audio('/assets/audio/slide.wav');
              audio.volume = 0.5;
              audio.play().catch(e => console.log('Audio play blocked:', e));
              setIsProfileOpen(true);
            }}
            className="relative group outline-none"
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden bg-surfaceHighlight transition-transform">
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
          </motion.button>

          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black tracking-tighter text-white">
              Strive<span className="text-red-500">X</span>
            </h1>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1.5">
              Level Up Your Fitness
            </span>
          </div>

          <motion.button 
            onClick={() => {
              const audio = new Audio('/assets/audio/slide.wav');
              audio.volume = 0.5;
              audio.play().catch(e => console.log('Audio play blocked:', e));
              isSliderOpen ? closeSlider() : openSlider('quest');
            }}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl text-white outline-none z-50 relative"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div 
              animate={isSliderOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-[2px] bg-current rounded-full origin-center" 
            />
            <motion.div 
              animate={isSliderOpen ? { width: 0, opacity: 0 } : { width: 16, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="h-[2px] bg-current rounded-full self-end mr-2" 
            />
            <motion.div 
              animate={isSliderOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-[2px] bg-current rounded-full origin-center" 
            />
          </motion.button>
        </div>

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
      
      <SideNavBar 
        isOpen={isSliderOpen && !isSoloLevelingMode}
        onClose={closeSlider}
        initialTab={sliderTab}
      />

      <SystemMenu
        isOpen={isSliderOpen && isSoloLevelingMode}
        onClose={closeSlider}
        initialTab={sliderTab}
      />
    </div>
  );
}
