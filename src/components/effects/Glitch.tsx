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
        duration: 400,
        iterations: 1,
      },
      shake: {
        velocity: 16,
        amplitudeX: 0.45,
      },
      slice: {
        count: 7,
        velocity: 17,
        minHeight: 0.13,
      },
      ...options,
    };

    const glitch = useGlitch(defaultOptions);

    useImperativeHandle(ref, () => ({
      startGlitch: glitch.startGlitch,
      stopGlitch: glitch.stopGlitch,
    }));

    return (
      <div ref={glitch.ref} className={className} style={style}>
        {children}
      </div>
    );
  }
);

Glitch.displayName = 'Glitch';
