// Simple swap button fix
document.addEventListener("DOMContentLoaded", function () {
  console.log("Swap fix script loaded");

  // Height swap functionality
  const heightSwapBtn = document.getElementById("swapHeightUnitsBtn");
  if (heightSwapBtn) {
    console.log("Height swap button found");
    heightSwapBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Height swap button clicked");

      const fromSelect = document.getElementById("heightUnitFrom");
      const toSelect = document.getElementById("heightUnitTo");

      if (fromSelect && toSelect) {
        const fromValue = fromSelect.value;
        const toValue = toSelect.value;

        console.log("Swapping height units:", fromValue, "to", toValue);

        // Don't swap if either is feet+inches
        if (fromValue === "ftIn" || toValue === "ftIn") {
          console.log("Cannot swap feet+inches format");
          return;
        }

        fromSelect.value = toValue;
        toSelect.value = fromValue;

        // Trigger change events
        fromSelect.dispatchEvent(new Event("change"));
        toSelect.dispatchEvent(new Event("change"));

        console.log("Height units swapped successfully");
      }
    });
  }

  // Weight swap functionality
  const weightSwapBtn = document.getElementById("swapWeightUnitsBtn");
  if (weightSwapBtn) {
    console.log("Weight swap button found");
    weightSwapBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Weight swap button clicked");

      const fromSelect = document.getElementById("weightUnitFrom");
      const toSelect = document.getElementById("weightUnitTo");

      if (fromSelect && toSelect) {
        const fromValue = fromSelect.value;
        const toValue = toSelect.value;

        console.log("Swapping weight units:", fromValue, "to", toValue);

        // Don't swap if either is stones+pounds
        if (fromValue === "stLb" || toValue === "stLb") {
          console.log("Cannot swap stones+pounds format");
          return;
        }

        fromSelect.value = toValue;
        toSelect.value = fromValue;

        // Trigger change events
        fromSelect.dispatchEvent(new Event("change"));
        toSelect.dispatchEvent(new Event("change"));

        console.log("Weight units swapped successfully");
      }
    });
  }

  // Dark mode icon fix
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeIcon = document.getElementById("darkModeIcon");

  if (darkModeToggle && darkModeIcon) {
    console.log("Dark mode toggle found, setting up icon fix");

    // Function to update icon
    function updateDarkModeIcon() {
      const isDark = document.documentElement.classList.contains("dark");
      console.log("Updating dark mode icon, isDark:", isDark);

      // Clear existing content and update icon
      darkModeIcon.innerHTML = "";

      if (isDark) {
        // Show sun icon when in dark mode (to switch to light)
        darkModeIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="m12 2 0 2"/>
            <path d="m12 20 0 2"/>
            <path d="m5 5 1.5 1.5"/>
            <path d="m17.5 17.5 1.5 1.5"/>
            <path d="m2 12 2 0"/>
            <path d="m20 12 2 0"/>
            <path d="m5 19 1.5-1.5"/>
            <path d="m17.5 6.5 1.5-1.5"/>
          </svg>`;
        darkModeIcon.setAttribute("data-lucide", "sun");
      } else {
        // Show moon icon when in light mode (to switch to dark)
        darkModeIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>`;
        darkModeIcon.setAttribute("data-lucide", "moon");
      }
      console.log("Dark mode icon updated to:", isDark ? "sun" : "moon");
    }

    // Update icon on page load
    updateDarkModeIcon();

    // Listen for clicks on dark mode toggle
    darkModeToggle.addEventListener("click", function () {
      console.log("Dark mode toggle clicked");
      // Wait a tiny bit for the dark class to be toggled, then update icon
      setTimeout(updateDarkModeIcon, 10);
    });

    // Also watch for class changes on document element (in case other code toggles it)
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          updateDarkModeIcon();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
});
