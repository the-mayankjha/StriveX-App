import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
  stats: {
    label: string;
    value: number;
    max: number;
  }[];
  isSoloMode?: boolean;
}

export function RadarChart({ stats, isSoloMode = false }: RadarChartProps) {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35;
  const numStats = stats.length;

  // Calculate coordinates for each stat point
  const points = useMemo(() => {
    return stats.map((stat, i) => {
      const angle = (Math.PI * 2 * i) / numStats - Math.PI / 2;
      const r = (stat.value / stat.max) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        angle
      };
    });
  }, [stats, radius, center, numStats]);

  // Path for the data area
  const dataPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  // Background webs
  const webs = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
    return stats.map((_, i) => {
      const angle = (Math.PI * 2 * i) / numStats - Math.PI / 2;
      const r = scale * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ') + ' Z';
  });

  return (
    <div className="relative w-full aspect-square flex items-center justify-center p-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Radial Lines */}
        {stats.map((_, i) => {
          const angle = (Math.PI * 2 * i) / numStats - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={isSoloMode ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.1)"}
              strokeWidth="1"
            />
          );
        })}

        {/* Background Webs */}
        {webs.map((path, i) => (
          <path
            key={`web-${i}`}
            d={path}
            fill="none"
            stroke={isSoloMode ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.05)"}
            strokeWidth="1"
          />
        ))}

        {/* Data Area */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={dataPath}
          fill={isSoloMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)"}
          stroke="#3B82F6"
          strokeWidth={isSoloMode ? "2" : "1.5"}
          strokeLinejoin="round"
          className={isSoloMode ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <motion.circle
            key={`point-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            cx={p.x}
            cy={p.y}
            r={isSoloMode ? "3" : "2.5"}
            fill="#3B82F6"
            className={isSoloMode ? "drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]" : ""}
          />
        ))}

        {/* Labels */}
        {stats.map((stat, i) => {
          const angle = (Math.PI * 2 * i) / numStats - Math.PI / 2;
          const r = radius + 25;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              className={isSoloMode 
                ? "fill-primary text-[10px] font-black italic tracking-tighter" 
                : "fill-text-muted text-[8px] font-bold uppercase tracking-widest"}
              style={{ dominantBaseline: 'middle' }}
            >
              {stat.label}
            </text>
          );
        })}

        {/* Center Ornament for Solo Mode */}
        {isSoloMode && (
          <g transform={`translate(${center - 10}, ${center - 10})`} className="opacity-40">
            <path
              d="M10 0 L20 10 L10 20 L0 10 Z"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="0.5"
            />
            <circle cx="10" cy="10" r="1.5" fill="#3B82F6" />
          </g>
        )}
      </svg>
    </div>
  );
}
