(function () {
  const storageKey = "dexholdem-layout";
  const layouts = new Set(["academic", "wide", "mobile"]);
  let currentLayout = "academic";

  try {
    const storedLayout = window.localStorage.getItem(storageKey);
    if (layouts.has(storedLayout)) currentLayout = storedLayout;
  } catch {
    currentLayout = "academic";
  }

  function applyLayout(layout) {
    currentLayout = layouts.has(layout) ? layout : "academic";
    document.body.classList.toggle("layout-wide", currentLayout === "wide");
    document.body.classList.toggle("layout-mobile", currentLayout === "mobile");
    document.querySelectorAll("[data-layout-option]").forEach((button) => {
      const isActive = button.dataset.layoutOption === currentLayout;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    try {
      window.localStorage.setItem(storageKey, currentLayout);
    } catch {
      // Layout choice is still applied for the current page when storage is unavailable.
    }
  }

  function createLayoutToggle() {
    const header = document.querySelector(".site-header");
    if (!header || header.querySelector(".layout-toggle")) return;

    const control = document.createElement("div");
    control.className = "layout-toggle";
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", "Page width");

    [
      ["academic", "Academic"],
      ["wide", "Wide 80%"],
      ["mobile", "Mobile"],
    ].forEach(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.layoutOption = value;
      button.addEventListener("click", () => applyLayout(value));
      control.append(button);
    });

    header.append(control);
    applyLayout(currentLayout);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createLayoutToggle);
  } else {
    createLayoutToggle();
  }
})();
