import { getCoordinates, getWeather } from "./src/api.js";
import { showResult, showDropdown, hideDropdown, getInputValue, handleKeyboardNavigation } from "./src/dom.js";
import { formatWeather } from "./src/utils.js";

const input  = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");

// cache stores { html, category, time }
const cache = {};
let currentLocations = [];

function updateBackground(category) {
  document.body.className = `bg-${category}`;
}

function updateUI(html, category) {
  const card = document.querySelector(".weather-card");
  card.className = `weather-card category-${category}`;
  updateBackground(category);
  showResult(html);
}

async function selectLocation(selected) {
  const key = `${selected.latitude}-${selected.longitude}`;

  if (cache[key]) {
    const { html, category } = formatWeather(
      cache[key].data,
      selected,
      true,
      cache[key].time
    );
    return updateUI(html, category);
  }

  const data = await getWeather(selected.latitude, selected.longitude);
  cache[key] = { data, time: Date.now() };

  const result = formatWeather(data, selected, false, null);
  updateUI(result.html, result.category);
}

/* INPUT */
input.addEventListener("input", async () => {
  const city = input.value.trim();

  if (city.length < 3) {
    hideDropdown();
    return;
  }

  try {
    const locations = await getCoordinates(city);
    currentLocations = locations;
    showDropdown(locations, selectLocation);
  } catch {
    hideDropdown();
  }
});

/* TECLADO */
input.addEventListener("keydown", (e) => {
  handleKeyboardNavigation(e, currentLocations, selectLocation);
});

/* BOTÃO */
button.onclick = async () => {
  const city = getInputValue();
  if (!city) return;

  try {
    const locations = await getCoordinates(city);
    if (!locations.length) return;
    await selectLocation(locations[0]);
  } catch (err) {
    console.error(err);
  }
};

/* Clique fora */
document.addEventListener("click", (e) => {
  if (!document.querySelector(".search-box").contains(e.target)) {
    hideDropdown();
  }
});
