import { config } from '../config.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';

// TODO (you): create one cache for the whole app, with a time to live of
// config.cacheTtlSeconds.

const cache = new Map();

let hits = 0;
let misses = 0;

// TODO (you): return the weather summary for one city, in the shape shown on
// the assignment page. Check the cache first. On a miss, geocode the city, get
// the forecast, build the summary, store it, and return it with cached: false.
// On a hit, return the stored summary with cached: true.
export async function getCityWeather(city) {
  const key = city.trim().toLowerCase();

  const cachedData = cache.get(key);
  if (cachedData && cachedData.expiresAt > Date.now()) {
    hits++;
    return { ...cachedData.weather, cached: true };
  }
  misses++;
  
}

const location = await geocodeCity(city);
const forecast = await getForecast(location.latitude, location.longitude);

const weather = {
  location: {
    name: location.name,
    region: location.region,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  },
  current: {
    temperature: forecast.current.temperature_2m,
    weatherCode: forecast.current.weather_code,
    time: forecast.current.time,
    feelsLike: forecast.current.feels_like,
    humidity: forecast.current.humidity_2m,
    wind: forecast.current.wind_speed_10m,
    conditions: describeWeatherCode(forecast.current.weather_code),
},
};
// TODO (you): return the cache statistics for GET /api/cache/stats.
export function getCacheStats() {
  throw new Error('getCacheStats is not written yet');
}
