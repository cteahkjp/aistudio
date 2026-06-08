import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HKOForecastItem } from "../types";
import {
  formatForecastDate,
  getWeatherVisuals,
  getPSRDetails
} from "../utils/weatherUtils";
import {
  ChevronDown,
  Wind,
  Droplet,
  CloudRain,
  CalendarDays
} from "lucide-react";

interface ForecastSectionProps {
  forecasts: HKOForecastItem[];
}

export default function ForecastSection({ forecasts }: ForecastSectionProps) {
  // Toggle to restrict to 7 days as requested, or allow showing all 9 days
  const [showAllNineDays, setShowAllNineDays] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!forecasts || forecasts.length === 0) return null;

  // Primary slice config (7 days default as requested)
  const displayItems = showAllNineDays ? forecasts : forecasts.slice(0, 7);

  const handleCardClick = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col gap-6" id="forecast-section-root">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
            <CalendarDays className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-blue-400">
              WEEKLY OUTLOOK
            </span>
            <h3 className="font-display text-2xl font-black text-white mt-0.5">
              {showAllNineDays ? "9-Day Weather Outlook" : "7-Day Weather Forecast"}
            </h3>
          </div>
        </div>

        {/* Dense Toggle */}
        <button
          id="nine-day-toggle"
          onClick={() => {
            setShowAllNineDays(!showAllNineDays);
            setExpandedIndex(null);
          }}
          className="relative inline-flex items-center gap-2 px-4 py-2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-xs font-black uppercase tracking-wider text-white transition-all shadow-md cursor-pointer"
        >
          <span className="relative z-10">
            {showAllNineDays ? "Limit to 7 Days" : "Extend to 9 Days"}
          </span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse z-10" />
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-4" id="forecast-grid">
        <AnimatePresence initial={false}>
          {displayItems.map((item, index) => {
            const { dayMonth, weekday, fullDate } = formatForecastDate(item.forecastDate);
            const visuals = getWeatherVisuals(item.ForecastIcon);
            const psrMeta = getPSRDetails(item.PSR);
            const isExpanded = expandedIndex === index;
            const IconComponent = visuals.icon;

            return (
              <motion.div
                key={item.forecastDate}
                layout="position"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`group border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isExpanded
                    ? "bg-slate-900 border-white/20 rounded-[28px] sm:rounded-[32px] shadow-2xl"
                    : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 rounded-[24px] sm:rounded-[28px] shadow-lg"
                }`}
                onClick={() => handleCardClick(index)}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 gap-4">
                  <div className="flex items-center gap-4">
                    {/* Date / Day Indicator */}
                    <div className="flex flex-col items-center justify-center bg-white/10 border border-white/15 rounded-2xl w-14 h-14 shrink-0 shadow-inner group-hover:bg-white/15 transition-colors">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">
                        {weekday}
                      </span>
                      <span className="text-base font-display font-black text-white leading-tight">
                        {dayMonth.split(" ")[1]}
                      </span>
                      <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                        {dayMonth.split(" ")[0]}
                      </span>
                    </div>

                    {/* Condition Icon */}
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${visuals.colorClass}`}>
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-display font-black text-white">
                          {visuals.label}
                        </span>
                        <span className="text-xs text-slate-450 line-clamp-1 max-w-[285px] sm:max-w-md font-medium">
                          {item.forecastWeather.split(".")[0]}.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Temperature range and right side controls */}
                  <div className="flex items-center justify-between sm:justify-start gap-4 sm:ml-auto w-full sm:w-auto border-t sm:border-t-0 pt-3.5 sm:pt-0 border-slate-800">
                    {/* PSR Rain Chance */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${psrMeta.bg}`}>
                      <CloudRain className="w-3.5 h-3.5 animate-pulse" />
                      <span>{psrMeta.percent} Rain</span>
                    </div>

                    {/* Temp Range Gauge */}
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold font-mono text-slate-450">{item.forecastMintemp.value}°</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700/20">
                        <div
                          className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-orange-400"
                          style={{
                            left: `${Math.max(0, ((item.forecastMintemp.value - 10) / 25) * 100)}%`,
                            right: `${Math.max(0, (1 - (item.forecastMaxtemp.value - 10) / 25) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-sm sm:text-base font-black font-display text-white">{item.forecastMaxtemp.value}°C</span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Animated Accordion Area */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-6 md:px-6 border-t border-slate-800 pt-5 bg-black/10 grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Verbatim Description */}
                        <div className="md:col-span-6 flex flex-col gap-2.5">
                          <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#fcd34d]">
                            Met Observation Record
                          </span>
                          <p className="text-xs sm:text-sm text-slate-350 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-850 font-semibold">
                            {item.forecastWeather}
                          </p>
                        </div>

                        {/* Detailed Metrics */}
                        <div className="md:col-span-6 flex flex-col gap-4">
                          <span className="text-[10px] uppercase font-mono font-black tracking-widest text-blue-400">
                            Forecast Indexes
                          </span>

                          <div className="grid grid-cols-2 gap-3">
                            {/* Humidity */}
                            <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-2xl flex items-center gap-3">
                              <div className="p-2.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-xl">
                                <Droplet className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-mono font-black tracking-wider text-slate-500">Humidity Range</span>
                                <span className="text-xs sm:text-sm font-black text-white font-mono mt-0.5">
                                  {item.forecastMinrh.value}% - {item.forecastMaxrh.value}%
                                </span>
                              </div>
                            </div>

                            {/* Rain probability */}
                            <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-2xl flex items-center gap-3">
                              <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                                <CloudRain className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-mono font-black tracking-wider text-slate-500">Signif. Rain</span>
                                <span className="text-xs sm:text-sm font-black text-white mt-0.5">
                                  {item.PSR}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Wind */}
                          <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-2xl flex items-start gap-3">
                            <div className="p-2.5 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-xl shrink-0 mt-0.5">
                              <Wind className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-mono font-black tracking-wider text-slate-400">Wind & Strength rating</span>
                              <span className="text-xs font-bold text-slate-300 mt-1 leading-relaxed">
                                {item.forecastWind}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
