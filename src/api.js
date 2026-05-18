export async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results) throw new Error("Cidade não encontrada");

  const seen = new Set();
  return data.results.filter(loc => {
    const key = `${loc.name}-${loc.admin1}-${loc.country}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getWeather(lat, lon) {
  // Include hourly humidity (first hour), daily weathercode and wind, current weather
  const url = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max` +
    `&hourly=relativehumidity_2m` +
    `&forecast_days=7` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar clima");

  const data = await res.json();

  // Keep only the first hourly value (current hour) for humidity
  if (data.hourly?.relativehumidity_2m) {
    const now = new Date();
    const hours = data.hourly.time ?? [];
    // Find closest hour index
    let idx = 0;
    let minDiff = Infinity;
    hours.forEach((t, i) => {
      const diff = Math.abs(new Date(t) - now);
      if (diff < minDiff) { minDiff = diff; idx = i; }
    });
    data.hourly.relativehumidity_2m = [data.hourly.relativehumidity_2m[idx]];
  }

  return data;
}
