import React, { useState } from "react";
import { motion } from "motion/react";
import { HKOForecastItem } from "../types";
import { formatForecastDate } from "../utils/weatherUtils";

interface WeatherChartProps {
  forecast: HKOForecastItem[];
}

export default function WeatherChart({ forecast }: WeatherChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!forecast || forecast.length === 0) return null;

  // Gather max/min temperatures to scale Y axis
  const tempsMax = forecast.map((f) => f.forecastMaxtemp.value);
  const tempsMin = forecast.map((f) => f.forecastMintemp.value);

  const absoluteMax = Math.max(...tempsMax);
  const absoluteMin = Math.min(...tempsMin);

  // Pad the chart scale
  const yMax = absoluteMax + 2;
  const yMin = absoluteMin - 2;
  const range = yMax - yMin || 1;

  // Chart viewport bounds
  const width = 600;
  const height = 180;
  const paddingX = 45;
  const paddingY = 25;

  const getX = (index: number) => {
    const step = (width - paddingX * 2) / (forecast.length - 1);
    return paddingX + index * step;
  };

  const getY = (temp: number) => {
    const chartHeight = height - paddingY * 2;
    // Lower Y represents higher temperature in SVG coords
    const fraction = (temp - yMin) / range;
    return height - paddingY - fraction * chartHeight;
  };

  // Convert points to SVG Bezier Curve or Polyline
  const highPoints = forecast.map((f, i) => ({ x: getX(i), y: getY(f.forecastMaxtemp.value), temp: f.forecastMaxtemp.value }));
  const lowPoints = forecast.map((f, i) => ({ x: getX(i), y: getY(f.forecastMintemp.value), temp: f.forecastMintemp.value }));

  // Helper to generate smooth SVG path from coordinates (cubic bezier curve)
  const getCurvePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Control points for smooth bezier curve
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const highPath = getCurvePath(highPoints);
  const lowPath = getCurvePath(lowPoints);

  // Generate paths for filled gradients
  const highFillPath = highPoints.length > 0
    ? `${highPath} L ${highPoints[highPoints.length - 1].x} ${height - paddingY} L ${highPoints[0].x} ${height - paddingY} Z`
    : "";

  const lowFillPath = lowPoints.length > 0
    ? `${lowPath} L ${lowPoints[lowPoints.length - 1].x} ${height - paddingY} L ${lowPoints[0].x} ${height - paddingY} Z`
    : "";

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-blue-400">
            TEMPERATURE RADAR
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5 flex flex-wrap items-center gap-2">
            7-Day Temperature Wave
            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
              Sourced in Real-time
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Visualizing daytime peaks (High) and nocturnal cooling (Low) across the upcoming week
          </p>
        </div>
        <div className="flex gap-4 items-center text-xs self-start md:self-center shrink-0">
          <div className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider text-[10px]">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
            Max (Daytime)
          </div>
          <div className="flex items-center gap-1.5 text-sky-400 font-bold uppercase tracking-wider text-[10px]">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
            Min (Nighttime)
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[21/9] min-h-[160px] max-h-[220px]">
        {/* SVG Render */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none overflow-visible"
          id="weather-trend-svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="highStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="lowStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.5, 1].map((pct, idx) => {
            const h = height - paddingY * 2;
            const y = paddingY + pct * h;
            const tempVal = Math.round(yMax - pct * range);
            return (
              <g key={idx} className="opacity-40">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.75"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 12}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {tempVal}°C
                </text>
              </g>
            );
          })}

          {/* Filled areas (drawn under lines) */}
          <path d={highFillPath} fill="url(#highGrad)" />
          <path d={lowFillPath} fill="url(#lowGrad)" />

          {/* Interactive column hover overlays */}
          {forecast.map((_, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                <rect
                  x={x - (width - paddingX * 2) / (forecast.length - 1) / 2}
                  y={10}
                  width={(width - paddingX * 2) / (forecast.length - 1)}
                  height={height - 20}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY - 5}
                    x2={x}
                    y2={height - paddingY + 5}
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    className="pointer-events-none"
                  />
                )}
              </g>
            );
          })}

          {/* Lines */}
          <path
            d={highPath}
            fill="none"
            stroke="url(#highStroke)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="pointer-events-none"
          />
          <path
            d={lowPath}
            fill="none"
            stroke="url(#lowStroke)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="pointer-events-none"
          />

          {/* Temperature nodes & values - HIGH (peak) */}
          {highPoints.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={`high-pt-${i}`} className="pointer-events-none">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#1e293b"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />
                {/* Node Label */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  fill="#f1f5f9"
                  fontSize={isHovered ? "12" : "10"}
                  fontWeight={isHovered ? "bold" : "600"}
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  className="transition-all duration-150"
                >
                  {pt.temp}°
                </text>
              </g>
            );
          })}

          {/* Temperature nodes & values - LOW (midnight) */}
          {lowPoints.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={`low-pt-${i}`} className="pointer-events-none">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#1e293b"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />
                {/* Node Label */}
                <text
                  x={pt.x}
                  y={pt.y + 16}
                  fill="#cbd5e1"
                  fontSize={isHovered ? "12" : "10"}
                  fontWeight={isHovered ? "bold" : "600"}
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  className="transition-all duration-150"
                >
                  {pt.temp}°
                </text>
              </g>
            );
          })}

          {/* Temporal axis labels (Weekdays) */}
          {forecast.map((f, i) => {
            const x = getX(i);
            const { weekday, dayMonth } = formatForecastDate(f.forecastDate);
            const isHovered = hoveredIndex === i;
            return (
              <g key={i} className="pointer-events-none">
                <text
                  x={x}
                  y={height - 2}
                  fill={isHovered ? "#38bdf8" : "#94a3b8"}
                  fontSize="10"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  fontWeight={isHovered ? "600" : "400"}
                  className="transition-all duration-150"
                >
                  {weekday}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {hoveredIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 py-2 px-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl flex flex-wrap justify-between items-center gap-2 text-xs"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-200">
              {formatForecastDate(forecast[hoveredIndex].forecastDate).fullDate}:
            </span>
            <span className="text-slate-300 font-mono italic">
              "{forecast[hoveredIndex].forecastWeather.slice(0, 52)}
              {forecast[hoveredIndex].forecastWeather.length > 52 ? "..." : ""}"
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Humidity:{" "}
              <b className="font-mono text-slate-200">
                {forecast[hoveredIndex].forecastMinrh.value}% - {forecast[hoveredIndex].forecastMaxrh.value}%
              </b>
            </span>
            <span className="text-slate-400">
              Rain Chance:{" "}
              <b className="text-blue-400">{forecast[hoveredIndex].PSR}</b>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
