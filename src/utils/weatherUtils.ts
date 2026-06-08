import React from "react";
import {
  Sun,
  Cloud,
  Cloudy,
  CloudSun,
  CloudSunRain,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  Wind,
  CloudFog,
  ThermometerSnowflake,
  ThermometerSun,
  Droplets,
  Droplet,
  HelpCircle
} from "lucide-react";

/**
 * Formats HKO date string "YYYYMMDD" (e.g. "20260605") into human-friendly objects.
 */
export function formatForecastDate(dateStr: string): { dayMonth: string; weekday: string; fullDate: string } {
  if (!dateStr || dateStr.length !== 8) {
    return { dayMonth: dateStr || "", weekday: "", fullDate: dateStr || "" };
  }
  try {
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    const date = new Date(year, month, day);

    const isToday = new Date().toDateString() === date.toDateString();

    const dayMonth = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const weekday = isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
    const fullDate = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    return { dayMonth, weekday, fullDate };
  } catch (e) {
    return { dayMonth: dateStr, weekday: "", fullDate: dateStr };
  }
}

/**
 * Maps HKO Weather Icon identifiers to modern Lucide components, clear titles, and theme colors.
 */
export interface WeatherVisuals {
  icon: React.ComponentType<any>;
  label: string;
  bgGradient: string;
  darkBgGradient: string;
  colorClass: string;
}

export function getWeatherVisuals(iconId: number): WeatherVisuals {
  // Sunny / Clear
  if (iconId === 50 || iconId === 51) {
    return {
      icon: Sun,
      label: "Sunny & Fine",
      bgGradient: "from-amber-400 to-orange-500",
      darkBgGradient: "from-amber-950/40 via-orange-950/20 to-slate-900/10",
      colorClass: "text-amber-500"
    };
  }

  // Cloudy
  if (iconId === 52) {
    return {
      icon: Cloud,
      label: "Cloudy",
      bgGradient: "from-slate-300 to-slate-500",
      darkBgGradient: "from-slate-800/40 via-slate-900/30 to-slate-950/10",
      colorClass: "text-slate-400"
    };
  }

  // Overcast
  if (iconId === 53 || iconId === 54) {
    return {
      icon: Cloudy,
      label: "Overcast",
      bgGradient: "from-stone-400 to-stone-600",
      darkBgGradient: "from-stone-800/40 via-slate-900/30 to-slate-950/10",
      colorClass: "text-stone-400"
    };
  }

  // Sunny intervals (60, 70, 71)
  if (iconId === 60 || iconId === 70) {
    return {
      icon: CloudSun,
      label: "Sunny Intervals",
      bgGradient: "from-amber-300 via-sky-300 to-sky-400",
      darkBgGradient: "from-amber-900/30 via-slate-900/20 to-slate-950/10",
      colorClass: "text-amber-400"
    };
  }

  // Sunny intervals with showers / light showers
  if (iconId === 61 || iconId === 71 || iconId === 62 || iconId === 72) {
    return {
      icon: CloudSunRain,
      label: "Showers with Sun",
      bgGradient: "from-sky-300 via-sky-400 to-indigo-500",
      darkBgGradient: "from-sky-950/40 via-indigo-950/20 to-slate-900/10",
      colorClass: "text-sky-400"
    };
  }

  // Heavy showers / regular showers (63, 64, 73, 74)
  if (iconId === 63 || iconId === 64 || iconId === 73 || iconId === 74) {
    return {
      icon: CloudRain,
      label: "Showers",
      bgGradient: "from-blue-400 to-indigo-600",
      darkBgGradient: "from-blue-950/40 via-indigo-950/35 to-slate-900/10",
      colorClass: "text-blue-400"
    };
  }

  // Thunderstorms (65, 75, 76, 77)
  if (iconId === 65 || iconId === 75 || iconId === 76 || iconId === 77) {
    return {
      icon: CloudLightning,
      label: "Thunderstorms",
      bgGradient: "from-violet-500 via-indigo-700 to-slate-900",
      darkBgGradient: "from-violet-950/40 via-indigo-950/40 to-slate-950/20",
      colorClass: "text-violet-400"
    };
  }

  // Windy (80, 81, 82)
  if (iconId >= 80 && iconId <= 82) {
    return {
      icon: Wind,
      label: "Windy",
      bgGradient: "from-teal-400 to-teal-700",
      darkBgGradient: "from-teal-950/40 via-teal-900/20 to-slate-950/10",
      colorClass: "text-teal-400"
    };
  }

  // Fog / Mist (83, 84, 85)
  if (iconId >= 83 && iconId <= 85) {
    return {
      icon: CloudFog,
      label: "Mist & Fog",
      bgGradient: "from-teal-100/50 to-slate-400",
      darkBgGradient: "from-slate-800/20 via-slate-900/15 to-slate-950/10",
      colorClass: "text-slate-300"
    };
  }

  // Cold
  if (iconId === 90) {
    return {
      icon: ThermometerSnowflake,
      label: "Cold",
      bgGradient: "from-cyan-300 to-blue-600",
      darkBgGradient: "from-cyan-950/40 via-blue-950/20 to-slate-900/10",
      colorClass: "text-cyan-400"
    };
  }

  // Very Hot
  if (iconId === 91) {
    return {
      icon: ThermometerSun,
      label: "Very Hot",
      bgGradient: "from-orange-500 via-red-500 to-rose-600",
      darkBgGradient: "from-orange-950/40 via-red-950/30 to-slate-900/10",
      colorClass: "text-rose-400"
    };
  }

  // Dry
  if (iconId === 92) {
    return {
      icon: Droplets,
      label: "Dry Air",
      bgGradient: "from-amber-600 to-yellow-600",
      darkBgGradient: "from-amber-950/30 via-slate-900/10 to-slate-950/10",
      colorClass: "text-amber-600"
    };
  }

  // Humid
  if (iconId === 93) {
    return {
      icon: Droplet,
      label: "Humid",
      bgGradient: "from-sky-400 via-teal-300 to-sky-600",
      darkBgGradient: "from-sky-950/40 via-teal-950/20 to-slate-900/10",
      colorClass: "text-teal-400"
    };
  }

  // Fallback defaults
  return {
    icon: HelpCircle,
    label: "Local Weather",
    bgGradient: "from-emerald-400 to-teal-600",
    darkBgGradient: "from-emerald-950/30 via-slate-900/10 to-slate-950/10",
    colorClass: "text-emerald-400"
  };
}

/**
 * Maps probability of significant rain (PSR) string into colors and percent labels.
 */
export function getPSRDetails(psr: string): { bg: string; text: string; percent: string } {
  const norm = (psr || "").toLowerCase().trim();
  if (norm.includes("high")) {
    return { bg: "bg-blue-500/15 text-blue-400", text: "text-blue-400", percent: "≥ 70%" };
  }
  if (norm.includes("medium high")) {
    return { bg: "bg-indigo-500/15 text-indigo-400", text: "text-indigo-400", percent: "~55%" };
  }
  if (norm.includes("medium low")) {
    return { bg: "bg-amber-500/15 text-amber-500", text: "text-amber-500", percent: "~35%" };
  }
  if (norm.includes("medium")) {
    return { bg: "bg-amber-500/15 text-amber-500", text: "text-amber-500", percent: "~45%" };
  }
  return { bg: "bg-slate-500/15 text-slate-400", text: "text-slate-400", percent: "≤ 20%" };
}

/**
 * Translates rain warning, gale, or extreme messages into color labels.
 */
export function getWarningMeta(warning: string): { bg: string; border: string; text: string; glow: string } {
  const norm = warning.toLowerCase();
  
  if (norm.includes("typhoon") || norm.includes("strong wind signal") || norm.includes("gale or storm")) {
    return {
      bg: "bg-red-950/35 border-red-500/40",
      border: "border-red-500/50",
      text: "text-red-400",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]"
    };
  }
  if (norm.includes("rainstorm") || norm.includes("black") || norm.includes("red") || norm.includes("thunderstorm")) {
    return {
      bg: "bg-violet-950/35 border-violet-500/40",
      border: "border-violet-500/50",
      text: "text-violet-400",
      glow: "shadow-[0_0_15px_rgba(139,92,246,0.15)]"
    };
  }
  if (norm.includes("very hot") || norm.includes("cold warning")) {
    return {
      bg: "bg-orange-950/35 border-orange-500/40",
      border: "border-orange-500/50",
      text: "text-orange-400",
      glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]"
    };
  }
  
  return {
    bg: "bg-amber-950/35 border-amber-500/40",
    border: "border-amber-500/50",
    text: "text-amber-400",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]"
  };
}
