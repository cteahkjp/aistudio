import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HKOForecastResponse, HKORegionalWeatherResponse } from "./types";
import { FALLBACK_CURRENT, FALLBACK_FORECAST } from "./utils/fallbackData";

// Components
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import ForecastSection from "./components/ForecastSection";
import WeatherChart from "./components/WeatherChart";
import WarningTicker from "./components/WarningTicker";

// Icons
import {
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  Globe,
  WifiOff,
  CloudSun,
  FlameKindling,
  Umbrella,
  CloudLightning
} from "lucide-react";

export default function App() {
  const [currentWeather, setCurrentWeather] = useState<HKORegionalWeatherResponse | null>(null);
  const [forecastResponse, setForecastResponse] = useState<HKOForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);

  // Core API Fetch Functions
  const fetchWeatherData = async () => {
    try {
      setRefreshSpin(true);
      setError(null);

      // Fetch from the real-time HKO API
      const [currentRes, forecastRes] = await Promise.all([
        fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en"),
        fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en")
      ]);

      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error("HTTP connection failed. Fallback payload loaded.");
      }

      const currentJson: HKORegionalWeatherResponse = await currentRes.json();
      const forecastJson: HKOForecastResponse = await forecastRes.json();

      // Ensure that structure is solid before setting
      if (currentJson?.temperature?.data && forecastJson?.weatherForecast) {
        setCurrentWeather(currentJson);
        setForecastResponse(forecastJson);
        setIsLive(true);
      } else {
        throw new Error("Mismatched data shape. Activating local cache fallback.");
      }
    } catch (err: any) {
      console.warn("Retrieved CORS obstruction or network failure. Loading offline certified cache:", err);
      // Fallback gracefully to stable simulated local cache
      setCurrentWeather(FALLBACK_CURRENT);
      setForecastResponse(FALLBACK_FORECAST);
      setIsLive(false);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshSpin(false), 600);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1020] via-[#020617] to-[#04081c] text-white font-sans antialiased pb-12 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Upper Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-lg shadow-indigo-505/20 border border-white/10">
              <CloudSun className="w-5 h-5 font-extrabold" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-black tracking-wider uppercase text-white leading-tight">
                Hong Kong Meteorology
              </span>
              <span className="text-[10px] font-mono font-black text-blue-400 tracking-wider uppercase">
                Observed Observational Grid
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator Dot */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest uppercase border ${
                isLive
                  ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                  : "bg-blue-500/15 border-blue-500/20 text-blue-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-blue-400"}`} />
              {isLive ? "Live Feedback Feed" : "Simulated Offline Feed"}
            </span>

            {/* Refresh Button */}
            <button
              onClick={fetchWeatherData}
              disabled={loading}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-350 hover:text-white transition-all cursor-pointer shadow-md disabled:opacity-40"
              title="Refresh Meteorological Feed"
              id="refresh-feed-button"
            >
              <RefreshCw className={`w-4 h-4 ${refreshSpin ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Scaffold */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {loading ? (
          /* Loading Skeleton Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse" id="loading-fallback-skeleton">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="h-60 bg-slate-900 border border-slate-800 rounded-[32px]" />
              <div className="h-72 bg-slate-900 border border-slate-800 rounded-[32px]" />
            </div>
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="h-56 bg-slate-900 border border-slate-800 rounded-[32px]" />
              <div className="h-96 bg-slate-900 border border-slate-800 rounded-[32px]" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Observator Feed Warnings & Local Microclimates */}
            <div className="lg:col-span-4 flex flex-col gap-6 font-semibold">
              
              {/* Warnings Center */}
              <WarningTicker warnings={currentWeather?.warningMessage} />

              {/* Current Metrics and Live Area Temperatures List */}
              {currentWeather && <CurrentWeatherCard currentWeather={currentWeather} />}

              {/* Useful Weather Tips Panel for Travelers / Locals */}
              <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-xl">
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-orange-400">
                  TRAVEL ADVISORIES
                </span>
                <h4 className="font-display text-lg font-black text-white mt-0.5 mb-4 flex items-center gap-2">
                  Observatory Safety Guides
                </h4>
                <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-400">
                  {forecastResponse?.generalSituation.toLowerCase().includes("shower") ||
                  forecastResponse?.generalSituation.toLowerCase().includes("rain") ? (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-3">
                      <Umbrella className="w-5 h-5 text-blue-450 shrink-0 mt-0.5 animate-bounce" />
                      <span className="font-semibold text-slate-350">
                        <b className="text-white">Precipitation Precaution</b>: High rain chances or localized convective squalls are expected. Keep pocket or bag weather protection shelters ready.
                      </span>
                    </div>
                  ) : (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-3">
                      <CloudSun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                      <span className="font-semibold text-slate-350">
                        <b className="text-white">UV Safety Index</b>: Solar readings are rising. Protect yourself from radiant sun exposures or use standard skincare shield factors when walking outside.
                      </span>
                    </div>
                  )}

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-3">
                    <CloudLightning className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-350">
                      <b className="text-white">Microclimatic Fluctuations</b>: Urban Heat Island effects can cause temp differences up to 3°C compared to rural New Territories gaps. Set dress accordingly.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Weekly Wave Curves & Day-by-Day Forecast Item Cards */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Regional synoptic situation paragraph */}
              {forecastResponse && (
                <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-xl">
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-violet-400">
                    METEOROLOGICAL SCENE
                  </span>
                  <h4 className="font-display text-lg font-black text-white mt-0.5 mb-3 font-semibold">
                    General Regional Synoptic Outlook
                  </h4>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-bold">
                    {forecastResponse.generalSituation}
                  </p>
                </div>
              )}

              {/* Temperature waveform chart */}
              {forecastResponse && (
                <WeatherChart forecast={forecastResponse.weatherForecast} />
              )}

              {/* Day-by-Day forecasts cards */}
              {forecastResponse && (
                <ForecastSection forecasts={forecastResponse.weatherForecast} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Small Humble Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 border-t border-slate-900 pt-6 text-center">
        <p className="text-[10px] font-mono text-slate-550 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Globe className="w-3 h-3 text-slate-550" /> Sourced from Hong Kong Observatory Open Data Feed • Standard ISO Meteorological Standards Apply
        </p>
      </footer>
    </div>
  );
}
