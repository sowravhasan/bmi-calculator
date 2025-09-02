/**
 * BMI Calculation Fix
 * Prevents "Infinity" values when calculating BMI multiple times
 */
document.addEventListener("DOMContentLoaded", function () {
  // Wait for all scripts to load
  setTimeout(function () {
    // Check if BMICalculator exists
    if (window.BMICalculator && BMICalculator.prototype) {
      console.log("Applying BMI calculation fixes...");

      // Fix for getMetricValues method to prevent division by zero
      const originalGetMetricValues = BMICalculator.prototype.getMetricValues;
      BMICalculator.prototype.getMetricValues = function () {
        // Call the original function
        const result = originalGetMetricValues.call(this);
        let { heightInCm, weightInKg } = result;

        // Validate height and weight
        if (!heightInCm || isNaN(heightInCm) || heightInCm <= 0) {
          console.warn("Invalid height detected:", heightInCm);
          // Get fresh value from input
          const heightValue = parseFloat(this.heightInput.value);
          if (!isNaN(heightValue) && heightValue > 0) {
            heightInCm = heightValue;
          } else {
            // Show error to user
            this.showError("Please enter a valid height");
            // Use a safe default to prevent Infinity
            heightInCm = 170;
          }
        }

        if (!weightInKg || isNaN(weightInKg) || weightInKg <= 0) {
          console.warn("Invalid weight detected:", weightInKg);
          // Get fresh value from input
          const weightValue = parseFloat(this.weightInput.value);
          if (!isNaN(weightValue) && weightValue > 0) {
            weightInKg = weightValue;
          } else {
            // Show error to user
            this.showError("Please enter a valid weight");
            // Use a safe default to prevent NaN
            weightInKg = 70;
          }
        }

        console.log(
          `Validated metric values: height=${heightInCm}cm, weight=${weightInKg}kg`
        );
        return { heightInCm, weightInKg };
      };

      // Fix for calculateBMI method
      const originalCalculateBMI = BMICalculator.prototype.calculateBMI;
      BMICalculator.prototype.calculateBMI = function () {
        try {
          if (this.validateForm()) {
            // Call original calculateBMI
            originalCalculateBMI.call(this);
          }
        } catch (error) {
          console.error("Error in BMI calculation:", error);
          this.showError(
            "There was an error calculating your BMI. Please check your inputs."
          );
        }
      };

      // Fix for form reset
      const calculateBtn = document.getElementById("calculateBtn");
      if (calculateBtn) {
        calculateBtn.addEventListener("click", function () {
          // Reset any previous errors
          if (window.bmiCalculator) {
            if (window.bmiCalculator.errorContainer) {
              window.bmiCalculator.errorContainer.classList.add("hidden");
            }
          }
        });
      }

      console.log("BMI calculation fixes applied successfully");
    }
  }, 800); // Give other scripts time to load
});
