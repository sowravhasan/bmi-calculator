/* Mobile Touch and Interaction Fixes */

// Enhanced mobile responsiveness fixes
document.addEventListener("DOMContentLoaded", function () {
  // Fix for iOS zoom on input focus
  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    // Ensure font-size is at least 16px to prevent zoom
    const computedStyle = window.getComputedStyle(input);
    const fontSize = parseFloat(computedStyle.fontSize);
    if (fontSize < 16) {
      input.style.fontSize = "16px";
    }
  });

  // Improve touch targets on mobile
  if (window.innerWidth <= 768) {
    const touchTargets = document.querySelectorAll(
      "button, .faq-question, .gender-btn"
    );
    touchTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.height < 44) {
        target.style.minHeight = "44px";
        target.style.display = "flex";
        target.style.alignItems = "center";
        target.style.justifyContent = "center";
      }
    });
  }

  // Optimize grid layouts for mobile
  function optimizeMobileLayout() {
    if (window.innerWidth <= 768) {
      // Force single column layout on mobile for specific grids
      const grids = document.querySelectorAll(
        ".grid.lg\\:grid-cols-3, .grid.md\\:grid-cols-2"
      );
      grids.forEach((grid) => {
        grid.style.gridTemplateColumns = "1fr";
      });

      // Optimize form grid layouts
      const formGrids = document.querySelectorAll(
        ".sm\\:grid-cols-3, .sm\\:grid-cols-2"
      );
      formGrids.forEach((grid) => {
        if (window.innerWidth <= 640) {
          grid.style.gridTemplateColumns = "1fr";
        }
      });
    }
  }

  // Run on load and resize
  optimizeMobileLayout();
  window.addEventListener("resize", optimizeMobileLayout);

  // Improve mobile form interactions
  const form = document.getElementById("bmiForm");
  if (form && window.innerWidth <= 768) {
    // Add smooth scrolling to form sections on mobile
    const formInputs = form.querySelectorAll("input, select");
    formInputs.forEach((input) => {
      input.addEventListener("focus", function () {
        setTimeout(() => {
          this.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 300);
      });
    });
  }

  // Enhanced unit converter mobile behavior
  const heightValueFrom = document.getElementById("heightValueFrom");
  const weightValueFrom = document.getElementById("weightValueFrom");

  if (heightValueFrom && window.innerWidth <= 768) {
    heightValueFrom.addEventListener("input", function () {
      // Auto-trigger conversion on mobile after 1 second of no typing
      clearTimeout(this.conversionTimeout);
      this.conversionTimeout = setTimeout(() => {
        if (
          typeof UnitConverter !== "undefined" &&
          UnitConverter.updateHeightResult
        ) {
          UnitConverter.updateHeightResult();
        }
      }, 1000);
    });
  }

  if (weightValueFrom && window.innerWidth <= 768) {
    weightValueFrom.addEventListener("input", function () {
      clearTimeout(this.conversionTimeout);
      this.conversionTimeout = setTimeout(() => {
        if (
          typeof UnitConverter !== "undefined" &&
          UnitConverter.updateWeightResult
        ) {
          UnitConverter.updateWeightResult();
        }
      }, 1000);
    });
  }

  // Optimize results display for mobile
  const resultsCard = document.getElementById("resultsCard");
  if (resultsCard) {
    const originalShowResults = function (results) {
      if (window.innerWidth <= 768) {
        // Scroll to results on mobile
        resultsCard.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // Hook into BMI calculation result display
    const calculateBtn = document.getElementById("calculateBtn");
    if (calculateBtn) {
      calculateBtn.addEventListener("click", function () {
        setTimeout(() => {
          if (
            !resultsCard.classList.contains("hidden") &&
            window.innerWidth <= 768
          ) {
            resultsCard.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 500);
      });
    }
  }

  // Improve FAQ interactions on mobile
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        // Add slight delay for mobile to feel more responsive
        setTimeout(() => {
          this.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    });
  });

  // Mobile-specific viewport height adjustment
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setViewportHeight();
  window.addEventListener("resize", setViewportHeight);

  // Prevent horizontal scroll on mobile
  function preventHorizontalScroll() {
    if (window.innerWidth <= 768) {
      document.body.style.overflowX = "hidden";

      // Check for elements that might cause horizontal scroll
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          el.style.maxWidth = "100%";
          el.style.boxSizing = "border-box";
        }
      });
    }
  }

  preventHorizontalScroll();
  window.addEventListener("resize", preventHorizontalScroll);

  // Mobile performance optimization
  if (window.innerWidth <= 768) {
    // Reduce animation intensity on mobile
    const style = document.createElement("style");
    style.textContent = `
            @media (max-width: 768px) {
                * {
                    transition-duration: 0.2s !important;
                    animation-duration: 0.2s !important;
                }
                
                .hover\\:shadow-lg:hover {
                    box-shadow: none !important;
                }
                
                .transform:hover {
                    transform: none !important;
                }
            }
        `;
    document.head.appendChild(style);
  }
});

// Mobile-specific utility functions
window.MobileUtils = {
  isMobile: () => window.innerWidth <= 768,

  optimizeElement: (element) => {
    if (window.innerWidth <= 768) {
      element.style.padding = "0.75rem";
      element.style.margin = "0.5rem";
      element.style.fontSize = "0.9rem";
    }
  },

  scrollToElement: (element, offset = 0) => {
    if (window.innerWidth <= 768) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  },
};
