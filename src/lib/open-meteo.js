import { config } from '../config.js';
import { HttpError } from './http-error.js';

// This is the only file that calls fetch or knows Open-Meteo's URLs.
// The exact requests are on the assignment page.

// TODO (you): write a helper that fetches a URL and returns the parsed JSON.
//   - Pass signal: AbortSignal.timeout(config.upstreamTimeoutMs) to fetch.
//   - fetch resolves for every HTTP status, so check res.ok yourself.
//   - Turn every failure into an HttpError: 504 when the timeout fired
//     (err.name is 'TimeoutError'), 502 for a network failure, a status that
//     isn't ok, or a body that isn't JSON.
async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(config.upstreamTimeoutMs),
    });

    if (!res.ok) {
      throw new HttpError(502, 'Upsteam service error');
    }
    return await res.json();
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }

    if (
      err instanceof SyntaxError ||
      err instanceof TypeError
    ) {
      throw new HttpError(502, 'Invalid response from upstream service.');
    }

    throw new HttpError(502, 'Upsteam service error');
  }
}

// TODO (you): look up a city with the geocoding API and return
// { name, region, country, latitude, longitude, timezone } for the first result.
// Throw a 404 HttpError when there are no results.
export async function geocodeCity(name) {
  const url = new URL(`${config.geocodingUrl}/search`);

  url.searchParams.set('name', name);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const data = await fetchJson(url);

  if (!data.results || data.results.length === 0) {
  throw new HttpError(404, 'City not found.');
}
const city = data.results[0];

return {
  name: city.name,
  region: city.admin1 ?? null,
  country: city.country,
  latitude: city.latitude,
  longitude: city.longitude,
  timezone: city.timezone,
};
}

// TODO (you): get the current weather and a 3-day daily forecast from the
// forecast API and return the parsed response.
export async function getForecast(latitude, longitude) {
  throw new Error('getForecast is not written yet');
}
