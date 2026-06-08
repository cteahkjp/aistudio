import { HKOForecastResponse, HKORegionalWeatherResponse } from "../types";

export const FALLBACK_FORECAST: HKOForecastResponse = {
  generalSituation: "A southerly airstream now brings hot and humid conditions to the coast of Guangdong. Locally, some isolated showers are expected during the afternoon. Meanwhile, a trough of low pressure is developing over inland central Southern China, which is projected to move southwards and trigger active convective thunderstorms in coastal regions during the upcoming week.",
  updateTime: "2026-06-04T12:00:00+08:00",
  weatherForecast: [
    {
      forecastDate: "20260605",
      week: "Friday",
      forecastWind: "South to southwesterly wind 3 to 4, occasionally reaching 5 in offshore areas.",
      forecastWeather: "Mainly cloudy with warm intervals. A couple of isolated morning showers. Humid conditions persistent in low-lying zones.",
      forecastMaxtemp: { value: 32, unit: "C" },
      forecastMintemp: { value: 28, unit: "C" },
      forecastMaxrh: { value: 95, unit: "percent" },
      forecastMinrh: { value: 80, unit: "percent" },
      ForecastIcon: 60,
      PSR: "Low"
    },
    {
      forecastDate: "20260606",
      week: "Saturday",
      forecastWind: "Southwesterly wind 4, gusty near rain clouds.",
      forecastWeather: "Cloudy with sunny clusters. Showers will trigger gradually during the afternoon, with isolated thunderstorms in northern districts.",
      forecastMaxtemp: { value: 31, unit: "C" },
      forecastMintemp: { value: 27, unit: "C" },
      forecastMaxrh: { value: 95, unit: "percent" },
      forecastMinrh: { value: 75, unit: "percent" },
      ForecastIcon: 61,
      PSR: "Medium"
    },
    {
      forecastDate: "20260607",
      week: "Sunday",
      forecastWind: "Southwesterly wind 3 to 4, occasionally 5, at first.",
      forecastWeather: "Mainly cloudy with a few showers and local squally thunderstorms. Heavy convective showers developing at times.",
      forecastMaxtemp: { value: 30, unit: "C" },
      forecastMintemp: { value: 26, unit: "C" },
      forecastMaxrh: { value: 95, unit: "percent" },
      forecastMinrh: { value: 80, unit: "percent" },
      ForecastIcon: 65,
      PSR: "High"
    },
    {
      forecastDate: "20260608",
      week: "Monday",
      forecastWind: "South to southwesterly wind 4. Strong winds initially near offshore islands.",
      forecastWeather: "Cloudy with frequent showers. Thunderstorms in several parts of Kowloon and New Territories with high rain indicators.",
      forecastMaxtemp: { value: 29, unit: "C" },
      forecastMintemp: { value: 25, unit: "C" },
      forecastMaxrh: { value: 98, unit: "percent" },
      forecastMinrh: { value: 85, unit: "percent" },
      ForecastIcon: 64,
      PSR: "High"
    },
    {
      forecastDate: "20260609",
      week: "Tuesday",
      forecastWind: "Westerly wind 3 to 4, light to moderate gusts during showers.",
      forecastWeather: "Overcast with heavy squally showers and persistent active lightning. Low visibility in rain areas.",
      forecastMaxtemp: { value: 28, unit: "C" },
      forecastMintemp: { value: 25, unit: "C" },
      forecastMaxrh: { value: 98, unit: "percent" },
      forecastMinrh: { value: 88, unit: "percent" },
      ForecastIcon: 76,
      PSR: "High"
    },
    {
      forecastDate: "20260610",
      week: "Wednesday",
      forecastWind: "Southeasterly wind 3 to 4, easing gradually.",
      forecastWeather: "Showers gradually easing. Expect sunny intervals and cloudy patches. Local damp breeze initially.",
      forecastMaxtemp: { value: 30, unit: "C" },
      forecastMintemp: { value: 26, unit: "C" },
      forecastMaxrh: { value: 92, unit: "percent" },
      forecastMinrh: { value: 78, unit: "percent" },
      ForecastIcon: 61,
      PSR: "Medium Low"
    },
    {
      forecastDate: "20260611",
      week: "Thursday",
      forecastWind: "East to southeasterly wind 2 to 3.",
      forecastWeather: "Sunny periods with hazy clouds. A minor morning shower is possible. Hot in urban areas during midday.",
      forecastMaxtemp: { value: 32, unit: "C" },
      forecastMintemp: { value: 27, unit: "C" },
      forecastMaxrh: { value: 90, unit: "percent" },
      forecastMinrh: { value: 75, unit: "percent" },
      ForecastIcon: 60,
      PSR: "Low"
    },
    {
      forecastDate: "20260612",
      week: "Friday",
      forecastWind: "Light, variable winds.",
      forecastWeather: "Mainly fine, very hot and clear blue sky. Dry air initially under regional land breeze flow.",
      forecastMaxtemp: { value: 33, unit: "C" },
      forecastMintemp: { value: 28, unit: "C" },
      forecastMaxrh: { value: 85, unit: "percent" },
      forecastMinrh: { value: 65, unit: "percent" },
      ForecastIcon: 50,
      PSR: "Low"
    },
    {
      forecastDate: "20260613",
      week: "Saturday",
      forecastWind: "South to southeasterly 3 to 4.",
      forecastWeather: "Fine and hot. Clear skies initially before minor cloud build-up. Warm sea breeze in the afternoon.",
      forecastMaxtemp: { value: 32, unit: "C" },
      forecastMintemp: { value: 28, unit: "C" },
      forecastMaxrh: { value: 88, unit: "percent" },
      forecastMinrh: { value: 70, unit: "percent" },
      ForecastIcon: 51,
      PSR: "Low"
    }
  ]
};

export const FALLBACK_CURRENT: HKORegionalWeatherResponse = {
  updateTime: "2026-06-04T19:00:00+08:00",
  icon: [60],
  temperature: {
    data: [
      { place: "Hong Kong Observatory", value: 29, unit: "C" },
      { place: "King's Park", value: 28, unit: "C" },
      { place: "Tsim Sha Tsui", value: 30, unit: "C" },
      { place: "Wong Tai Sin", value: 29, unit: "C" },
      { place: "Sha Tin", value: 28, unit: "C" },
      { place: "Tuen Mun", value: 28, unit: "C" },
      { place: "Tseung Kwan O", value: 29, unit: "C" },
      { place: "Sai Kung", value: 28, unit: "C" },
      { place: "Tai Po", value: 28, unit: "C" },
      { place: "Central & Western", value: 30, unit: "C" },
      { place: "Happy Valley", value: 30, unit: "C" },
      { place: "Shau Kei Wan", value: 29, unit: "C" },
      { place: "Kowloon City", value: 29, unit: "C" },
      { place: "Lantau Island", value: 27, unit: "C" },
      { place: "Chek Lap Kok", value: 30, unit: "C" },
      { place: "Tsing Yi", value: 29, unit: "C" },
      { place: "Sheung Shui", value: 29, unit: "C" },
      { place: "Yuen Long", value: 28, unit: "C" },
      { place: "Stanley", value: 28, unit: "C" },
      { place: "Kwun Tong", value: 29, unit: "C" },
      { place: "Shenzhen", value: 29, unit: "C" }
    ]
  },
  humidity: {
    data: [{ unit: "percent", value: 84 }]
  },
  warningMessage: [
    "The Thunderstorm Warning was issued at 3:15 p.m. by the Hong Kong Observatory and is now in force. Isolated thunderstorms are expected over sections of New Territories North."
  ],
  uvindex: {
    data: [{ place: "King's Park", value: 1.2, desc: "Low" }]
  }
};
