let activeIndex = -1;

export function getInputValue() {
  return document.getElementById("cityInput").value;
}

export function showResult(html) {
  document.getElementById("result").innerHTML = html;
}

export function showDropdown(locations, onSelect) {
  const dropdown = document.getElementById("dropdown");
  dropdown.innerHTML = "";
  activeIndex = -1;

  locations.forEach((loc, index) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.innerHTML = `${loc.name}, ${loc.admin1 || ""} - ${loc.country}`;

    item.onclick = () => {
      dropdown.classList.add("hidden");
      onSelect(loc);
    };

    dropdown.appendChild(item);
  });

  dropdown.classList.remove("hidden");
}

export function hideDropdown() {
  document.getElementById("dropdown").classList.add("hidden");
  activeIndex = -1;
}

export function handleKeyboardNavigation(e, locations, onSelect) {
  const dropdown = document.getElementById("dropdown");
  const items = dropdown.querySelectorAll(".dropdown-item");

  if (dropdown.classList.contains("hidden") || items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % items.length;
    updateActive(items);
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    updateActive(items);
  }

  if (e.key === "Enter" && activeIndex >= 0) {
    e.preventDefault();
    dropdown.classList.add("hidden");
    onSelect(locations[activeIndex]);
  }

  if (e.key === "Escape") {
    hideDropdown();
  }
}

function updateActive(items) {
  items.forEach((item, i) => {
    item.classList.toggle("active", i === activeIndex);
  });
}