// Dark mode icon fix only
(function () {
  "use strict";

  function fixDarkModeIcon() {
    const toggle = document.getElementById("darkModeToggle");
    const icon = document.getElementById("darkModeIcon");

    if (!toggle || !icon) return;

    function updateIcon() {
      const isDark = document.documentElement.classList.contains("dark");

      if (isDark) {
        // Dark mode = show sun icon
        icon.setAttribute("data-lucide", "sun");
        icon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;"><circle cx="12" cy="12" r="4"/><path d="m12 2 0 2"/><path d="m12 20 0 2"/><path d="m5 5 1.5 1.5"/><path d="m17.5 17.5 1.5 1.5"/><path d="m2 12 2 0"/><path d="m20 12 2 0"/><path d="m5 19 1.5-1.5"/><path d="m17.5 6.5 1.5-1.5"/></svg>';
      } else {
        // Light mode = show moon icon
        icon.setAttribute("data-lucide", "moon");
        icon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
      }
    }

    // Initial update
    updateIcon();

    // Update on click
    toggle.addEventListener("click", function () {
      setTimeout(updateIcon, 50);
    });
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixDarkModeIcon);
  } else {
    fixDarkModeIcon();
  }
})();
