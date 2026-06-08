import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HKORegionalWeatherResponse } from "../types";
import { getWeatherVisuals } from "../utils/weatherUtils";
import {
  Search,
  MapPin,
  Droplet,
  Sun,
  Clock,
  Compass,
  AlertTriangle,
  FlameKindling
} from "lucide-react";

interface CurrentWeatherCardProps {
  currentWeather: HKORegionalWeatherResponse;
}

export default function CurrentWeatherCard({ currentWeather }: CurrentWeatherCardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!currentWeather) return null;

  // Primary reading - HK Observatory is typically the benchmark
  const regionalTemps = currentWeather.temperature.data || [];
  const hkoObservation = regionalTemps.find((t) => t.place.includes("Hong Kong Observatory")) || regionalTemps[0];
  const hkoTemp = hkoObservation ? hkoObservation.value : 25;

  const humidityObj = currentWeather.humidity.data?.[0];
  const humidityValue = humidityObj ? humidityObj.value : 75;

  // Weather Icon
  const mainIconId = currentWeather.icon?.[0] || 50;
  const visuals = getWeatherVisuals(mainIconId);
  const IconComponent = visuals.icon;

  // Format Update Time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    } catch (e) {
      return isoString;
    }
  };

  // UV Index
  const uvData = currentWeather.uvindex?.data?.[0];

  // List of other districts sorted alphabetically, excluding the reference HKO place to save duplicate card clutter
  const filteredPlaces = regionalTemps
    .filter((t) => t.place !== "Hong Kong Observatory")
    .filter((t) => t.place.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.place.localeCompare(b.place));

  return (
    <div className="w-full flex flex-col gap-6" id="current-weather-root">
      {/* Hero Atmosphere Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-[36px] sm:rounded-[48px] p-6 sm:p-10 text-white shadow-2xl shadow-indigo-500/25">
        {/* Glow effect */}
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-mono font-black uppercase tracking-widest text-[#fcd34d] bg-white/15 border border-white/25 px-3 py-1 rounded-full backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-amber-300 animate-bounce" /> Live Observatory Feed
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Hong Kong
            </h2>
            <p className="text-xs text-white/80 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/50" />
              Observed data updated at <b className="text-white font-bold">{formatTime(currentWeather.updateTime)}</b>
            </p>

            <div className="flex items-baseline gap-1 mt-6">
              <span className="text-[85px] sm:text-[110px] md:text-[124px] font-black leading-none tracking-tighter">
                {hkoTemp}°
              </span>
              <span className="text-2xl font-black text-white/75">C</span>
            </div>
            
            <div className="text-2xl font-bold mt-2 flex items-center gap-2.5 flex-wrap">
              <span>{visuals.label}</span>
              <span className="text-[10px] uppercase font-mono font-black tracking-wider text-white bg-white/15 border border-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                HKO Main Station
              </span>
            </div>
          </div>

          <div className="bg-white/15 p-6 sm:p-8 rounded-full shadow-inner border border-white/10 shrink-0 self-end sm:self-center">
            <IconComponent className="w-20 h-20 sm:w-28 sm:h-28 text-white" />
          </div>
        </div>

        {/* Global Key Metrics Row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-white/20 pt-8 mt-8 relative z-10">
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 mb-1.5 md:mb-2">Humidity</p>
            <p className="text-lg md:text-2xl font-black text-white">
              {humidityValue}% <span className="text-xs font-semibold text-emerald-300">High</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 mb-1.5 md:mb-2">UV Index</p>
            {uvData ? (
              <p className="text-lg md:text-2xl font-black text-white">
                {uvData.value} <span className="text-xs font-bold text-amber-300">{uvData.desc}</span>
              </p>
            ) : (
              <p className="text-lg md:text-2xl font-black text-white">0 <span className="text-xs font-normal text-white/65">Low</span></p>
            )}
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 mb-1.5 md:mb-2">Wind Feed</p>
            <p className="text-lg md:text-2xl font-black text-white truncate">3-4 <span className="text-xs font-normal text-white/65">E/SE</span></p>
          </div>
        </div>
      </div>

      {/* Regional Microclimates Panel */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-[32px] p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-blue-400">
              HK OBSERVATORY REGISTER
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-black text-white mt-1">
              Regional Microclimates
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search local station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <AnimatePresence>
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((station) => (
                <motion.div
                  key={station.place}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-2.5 rounded-2xl flex justify-between items-center transition-colors group cursor-default"
                >
                  <span className="text-xs text-slate-300 font-semibold group-hover:text-slate-100 transition-colors truncate">
                    {station.place}
                  </span>
                  <span className="text-xs font-black font-mono text-white bg-white/10 border border-white/10 px-2 py-0.5 rounded-lg min-w-[34px] text-center shrink-0 ml-2">
                    {station.value}°
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center flex flex-col items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-slate-600" />
                <span className="text-xs text-slate-400">Match not found. Try searching another district in Hong Kong.</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
