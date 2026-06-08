export interface HKOForecastItem {
  forecastDate: string; // e.g. "20260605"
  week: string; // e.g. "Friday"
  forecastWind: string;
  forecastWeather: string;
  forecastMaxtemp: {
    value: number;
    unit: "C" | "F";
  };
  forecastMintemp: {
    value: number;
    unit: "C" | "F";
  };
  forecastMaxrh: {
    value: number;
    unit: "percent";
  };
  forecastMinrh: {
    value: number;
    unit: "percent";
  };
  ForecastIcon: number;
  PSR: "High" | "Medium High" | "Medium" | "Medium Low" | "Low";
}

export interface HKOForecastResponse {
  generalSituation: string;
  weatherForecast: HKOForecastItem[];
  updateTime: string;
}

export interface HKOTemperatureData {
  place: string;
  value: number;
  unit: string;
}

export interface HKOHumidityData {
  unit: string;
  value: number;
}

export interface HKOUvIndexData {
  place: string;
  value: number;
  desc: string;
}

export interface HKORegionalWeatherResponse {
  updateTime: string;
  icon: number[];
  temperature: {
    data: HKOTemperatureData[];
  };
  humidity: {
    data: HKOHumidityData[];
  };
  warningMessage?: string[];
  uvindex?: {
    data: HKOUvIndexData[];
  };
  rainfall?: {
    data: Array<{
      unit: string;
      value: number;
      place: string;
      max?: number;
    }>;
  };
}

export interface WeatherConditionInfo {
  icon: string; // Lucide icon name
  label: string; // e.g. "Sunny", "Overcast", "Heavy Showers"
  bgGradient: string; // Tailwind gradient for backgrounds
  accentColor: string; // Core accent color
}
