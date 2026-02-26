import React, { forwardRef, useImperativeHandle } from 'react';
import { useGlitch } from 'react-powerglitch';

export interface GlitchHandle {
  startGlitch: () => void;
  stopGlitch: () => void;
}

interface GlitchProps {
  children: React.ReactNode;
  playMode?: 'always' | 'hover' | 'click' | 'manual';
  className?: string;
  style?: React.CSSProperties;
  options?: any;
}

export const Glitch = forwardRef<GlitchHandle, GlitchProps>(
  ({ children, playMode = 'always', className, style, options }, ref) => {
    const defaultOptions = {
      playMode,
      createContainers: true,
      hideOverflow: false,
      timing: {
        duration: 350,
        iterations: 1,
      },
      shake: {
        velocity: 10,
        amplitudeX: 0.15,
        amplitudeY: 0.05,
      },
      slice: {
        count: 3, // Drastically reduced for PWA performance
        velocity: 8,
        minHeight: 0.05,
        maxHeight: 0.15,
      },
      ...options,
    };

    const glitch = useGlitch(defaultOptions);

    useImperativeHandle(ref, () => ({
      startGlitch: glitch.startGlitch,
      stopGlitch: glitch.stopGlitch,
    }));

    return (
      <div 
        ref={glitch.ref} 
        className={className} 
        style={{ ...style, transform: 'translateZ(0)', willChange: 'transform' }} // Hardware acceleration hint
      >
        {children}
      </div>
    );
  }
);

Glitch.displayName = 'Glitch';
