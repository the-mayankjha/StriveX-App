import React, { useEffect, useRef, useCallback } from 'react';
import type { CSSProperties, ReactNode } from 'react';

function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface ElectricBorderProps {
  children?: ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = '#3B82F6',
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback((x: number): number => {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }, []);

  const noise2D = useCallback(
    (x: number, y: number): number => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;

      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);

      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);

      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [random]
  );

    const octavedNoise = (
      x: number,
      octaves: number,
      lacunarity: number,
      gain: number,
      amplitude: number,
      frequency: number,
      time: number,
      seed: number,
    ): number => {
      let y = 0;
      let amp = amplitude;
      let freq = frequency;

      for (let i = 0; i < octaves; i++) {
        // Add a "jolt" factor based on time and frequency to make it twitchy
        const jolt = Math.sin(time * 20 + x * 5) > 0.95 ? 2.5 : 1;
        y += amp * jolt * noise2D(freq * x + seed * 100, time * freq * 0.5);
        freq *= lacunarity;
        amp *= gain;
      }

      return y;
    };

  const getCornerPoint = useCallback(
    (
      centerX: number,
      centerY: number,
      radius: number,
      startAngle: number,
      arcLength: number,
      progress: number
    ): { x: number; y: number } => {
      const angle = startAngle + progress * arcLength;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    },
    []
  );

  const getRoundedRectPoint = useCallback(
    (t: number, left: number, top: number, width: number, height: number, radius: number): { x: number; y: number } => {
      const straightWidth = width - 2 * radius;
      const straightHeight = height - 2 * radius;
      const cornerArc = (Math.PI * radius) / 2;
      const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
      const distance = t * totalPerimeter;

      let accumulated = 0;

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + radius + progress * straightWidth, y: top };
      }
      accumulated += straightWidth;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left + width, y: top + radius + progress * straightHeight };
      }
      accumulated += straightHeight;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + width - radius - progress * straightWidth, y: top + height };
      }
      accumulated += straightWidth;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left, y: top + height - radius - progress * straightHeight };
      }
      accumulated += straightHeight;

      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
    },
    [getCornerPoint]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const displacement = 8;
    const canvasPadding = 20; // Extra room for lightning jitter

    const updateSize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (width + canvasPadding * 2) * dpr;
      canvas.height = (height + canvasPadding * 2) * dpr;
      canvas.style.width = `${width + canvasPadding * 2}px`;
      canvas.style.height = `${height + canvasPadding * 2}px`;
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let { width, height } = updateSize();

    const drawElectricBorder = (currentTime: number) => {
      if (!canvas || !ctx) return;

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const left = canvasPadding; 
      const top = canvasPadding;
      const borderWidth = width;
      const borderHeight = height;
      const maxRadius = Math.min(borderWidth, borderHeight) / 2;
      const radius = Math.min(borderRadius, maxRadius);

      const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      const sampleCount = Math.floor(approximatePerimeter / 1.5); // Higher detail

      const drawPath = (lineScale: number, opacity: number, thickness: number, noiseOffset: number) => {
        ctx.beginPath();
        ctx.strokeStyle = hexToRgba(color, opacity);
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = thickness * 4;
        ctx.shadowColor = color;

        for (let i = 0; i <= sampleCount; i++) {
          const progress = i / sampleCount;
          const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);

          const xNoise = octavedNoise(
            progress * 12, // Faster, tighter noise
            noiseOffset,
            2.0,
            0.5,
            1.0, 
            24, 
            timeRef.current,
            0
          );
          const yNoise = octavedNoise(
            progress * 12,
            noiseOffset + 10,
            2.0,
            0.5,
            1.0,
            24,
            timeRef.current,
            1
          );

          const displacedX = point.x + xNoise * lineScale;
          const displacedY = point.y + yNoise * lineScale;

          if (i === 0) {
            ctx.moveTo(displacedX, displacedY);
          } else {
            ctx.lineTo(displacedX, displacedY);
          }
        }
        ctx.closePath();
        ctx.stroke();
      };

      // Draw two passes for depth
      drawPath(displacement * 1.0, 0.8, 1.5, 0);
      drawPath(displacement * 0.6, 0.4, 0.8, 100);

      // --- PUNCH-OUT MASKING ---
      // This clears the inner area so lightning doesn't overlap the box content
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      // Draw a rounded rect matching the actual content box
      ctx.roundRect(left, top, borderWidth, borderHeight, radius);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(drawElectricBorder);
    };

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    });
    resizeObserver.observe(container);

    animationRef.current = requestAnimationFrame(drawElectricBorder);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-visible isolate ${className ?? ''}`}
      style={{ '--electric-border-color': color, borderRadius, ...style } as CSSProperties}
    >
      <div className="relative rounded-[inherit] z-10 overflow-visible">{children}</div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
        <canvas ref={canvasRef} className="block" />
      </div>
    </div>
  );
};

export default ElectricBorder;
