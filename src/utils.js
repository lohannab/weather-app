export function getWeatherDescription(code) {
  const map = {
    0: "Céu limpo",
    1: "Principalmente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina densa",
    51: "Garoa leve",
    53: "Garoa moderada",
    55: "Garoa intensa",
    61: "Chuva leve",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve leve",
    73: "Neve moderada",
    75: "Neve forte",
    80: "Pancadas de chuva",
    81: "Chuva com trovoada",
    95: "Tempestade",
    96: "Tempestade com granizo",
    99: "Tempestade severa"
  };
  return map[code] || "Clima desconhecido";
}

export function getWeatherEmoji(code) {
  if (code === 0)                   return "☀️";
  if (code === 1)                   return "🌤️";
  if (code === 2)                   return "⛅";
  if (code === 3)                   return "☁️";
  if ([45, 48].includes(code))      return "🌫️";
  if ([51, 53, 55].includes(code))  return "🌦️";
  if (code === 61)                   return "🌧️";
  if (code === 63)                   return "🌧️";
  if (code === 65)                   return "⛈️";
  if ([71, 73, 75].includes(code))  return "❄️";
  if ([80, 81].includes(code))      return "🌩️";
  if ([95, 96, 99].includes(code))  return "⛈️";
  return "🌡️";
}

export function getCategory(code) {
  if (code === 0)                          return "sunny";
  if ([1, 2, 3].includes(code))            return "cloudy";
  if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) return "rainy";
  if ([71, 73, 75].includes(code))         return "snowy";
  if ([95, 96, 99].includes(code))         return "stormy";
  return "cloudy";
}

/**
 * Thermal sensation (Australian BOM formula simplified)
 * Works for temps > 10°C with wind
 */
export function getFeelsLike(tempC, windKmh, humidity) {
  // Wind Chill (cold) — temp < 10
  if (tempC <= 10 && windKmh > 4.8) {
    const wc = 13.12 + 0.6215 * tempC
      - 11.37 * Math.pow(windKmh, 0.16)
      + 0.3965 * tempC * Math.pow(windKmh, 0.16);
    return Math.round(wc);
  }
  // Heat Index (hot + humid) — temp > 27
  if (tempC >= 27 && humidity >= 40) {
    const hi = -8.78469475556
      + 1.61139411 * tempC
      + 2.3385248 * humidity
      - 0.14611605 * tempC * humidity
      - 0.012308094 * tempC * tempC
      - 0.016424828 * humidity * humidity
      + 0.002211732 * tempC * tempC * humidity
      + 0.00072546 * tempC * humidity * humidity
      - 0.000003582 * tempC * tempC * humidity * humidity;
    return Math.round(hi);
  }
  return null; // same as actual
}

function formatDay(date) {
  return new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "short"
  }).replace(".", "").toUpperCase();
}

function formatDate(date) {
  return new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  });
}

function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr + "T12:00:00");
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}

export function formatWeather(data, location, fromCache = false, cacheTime = null) {
  const current = data.current_weather;
  const daily   = data.daily;

  const desc     = getWeatherDescription(current.weathercode);
  const emoji    = getWeatherEmoji(current.weathercode);
  const category = getCategory(current.weathercode);

  // Wind & humidity from current if available, else daily[0]
  const windSpeed  = current.windspeed ?? (daily.windspeed_10m_max ? daily.windspeed_10m_max[0] : null);
  const humidity   = data.hourly?.relativehumidity_2m?.[0] ?? null;

  const feelsLike = getFeelsLike(current.temperature, windSpeed ?? 0, humidity ?? 60);

  // Stats row
  const windHtml = windSpeed != null ? `
    <div class="stat-item">
      <span class="stat-icon wind-icon">💨</span>
      <div class="stat-content">
        <div class="stat-value">${Math.round(windSpeed)} km/h</div>
        <div class="stat-label">Vento</div>
      </div>
    </div>` : "";

  const humidHtml = humidity != null ? `
    <div class="stat-item">
      <span class="stat-icon humidity-icon">💧</span>
      <div class="stat-content">
        <div class="stat-value">${humidity}%</div>
        <div class="stat-label">Umidade</div>
      </div>
    </div>` : "";

  // 7-day forecast
  const forecast = daily.time.slice(0, 7).map((d, i) => {
    const code = daily.weathercode ? daily.weathercode[i] : current.weathercode;
    const fcEmoji = getWeatherEmoji(code);
    const todayClass = isToday(d) ? " today" : "";
    return `
      <div class="forecast-item${todayClass}">
        <div class="fc-day">${isToday(d) ? "HOJE" : formatDay(d)}</div>
        <div class="fc-date">${formatDate(d)}</div>
        <span class="fc-emoji">${fcEmoji}</span>
        <div class="fc-max">${Math.round(daily.temperature_2m_max[i])}°</div>
        <div class="fc-min">${Math.round(daily.temperature_2m_min[i])}°</div>
      </div>
    `;
  }).join("");

  // Cache badge
  let cacheBadge = "";
  if (fromCache && cacheTime) {
    const diff = Math.round((Date.now() - cacheTime) / 60000);
    const label = diff < 1 ? "agora mesmo" : `há ${diff} min`;
    cacheBadge = `
      <div class="cache-badge">
        <span class="cache-dot"></span>
        cache · atualizado ${label}
      </div>`;
  }

  return {
    html: `
      <div class="weather-inner">
        <span class="weather-emoji">${emoji}</span>

        <div class="weather-top">
          <div class="weather-left">
            <div class="city-name">${location.name}</div>
            <div class="country">${location.admin1 ? location.admin1 + ", " : ""}${location.country}</div>
          </div>
          <div class="temperature-wrap">
            <div class="temperature">${Math.round(current.temperature)}°</div>
            ${feelsLike != null
              ? `<div class="feels-like">sensação ${feelsLike}°C</div>`
              : ""}
          </div>
        </div>

        <div class="condition">${desc}</div>

        ${(windHtml || humidHtml) ? `
          <div class="stats-row">
            ${windHtml}
            ${humidHtml}
          </div>` : ""}

        <div class="divider"></div>
        <div class="forecast-label">Próximos 7 dias</div>
        <div class="forecast">${forecast}</div>

        ${cacheBadge}
      </div>
    `,
    category
  };
}
