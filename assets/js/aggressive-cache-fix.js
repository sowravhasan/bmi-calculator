/**
 * Simple BMI Calculation Fix
 * Prevents "Infinity" values while keeping user-friendly browser caching
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("Loading simple BMI fix...");

  setTimeout(function () {
    if (window.BMICalculator && BMICalculator.prototype) {
      // Simple fix for getMetricValues - just prevent division by zero
      const originalGetMetricValues = BMICalculator.prototype.getMetricValues;
      BMICalculator.prototype.getMetricValues = function () {
        const result = originalGetMetricValues.call(this);
        let { heightInCm, weightInKg } = result;

        // Simple validation - just ensure we have valid numbers
        if (!heightInCm || isNaN(heightInCm) || heightInCm <= 0) {
          console.warn("Invalid height, using fresh input");
          const heightElement = document.getElementById("height");
          const heightUnit = document.getElementById("heightUnit").value;
          if (heightElement && heightElement.value) {
            const value = parseFloat(heightElement.value);
            if (value > 0) {
              heightInCm = heightUnit === "cm" ? value : value * 100; // Simple conversion
            }
          }
        }

        if (!weightInKg || isNaN(weightInKg) || weightInKg <= 0) {
          console.warn("Invalid weight, using fresh input");
          const weightElement = document.getElementById("weight");
          const weightUnit = document.getElementById("weightUnit").value;
          if (weightElement && weightElement.value) {
            const value = parseFloat(weightElement.value);
            if (value > 0) {
              weightInKg = weightUnit === "kg" ? value : value * 0.453592; // Simple conversion
            }
          }
        }

        return { heightInCm, weightInKg };
      };

      // Simple fix for calculateBMI - just validate the result
      const originalCalculateBMI = BMICalculator.prototype.calculateBMI;
      BMICalculator.prototype.calculateBMI = function () {
        try {
          const { heightInCm, weightInKg } = this.getMetricValues();

          // Simple validation before calculation
          if (
            !heightInCm ||
            !weightInKg ||
            heightInCm <= 0 ||
            weightInKg <= 0
          ) {
            this.showError("Please enter valid height and weight values");
            return;
          }

          const height = heightInCm / 100;
          const bmi = weightInKg / (height * height);

          // Simple check for valid BMI result
          if (!isFinite(bmi) || bmi <= 0 || bmi > 100) {
            this.showError(
              "Unable to calculate BMI. Please check your inputs."
            );
            return;
          }

          // Continue with normal calculation
          const age = parseInt(document.getElementById("age").value);
          const gender = document.getElementById("genderInput").value || "male";
          const activityLevel = this.activityLevel.value;

          const result = this.getBMICategory(bmi);
          this.displayResults(bmi, result, age, gender);
          this.displayIdealWeight(heightInCm, gender);
          this.displayCalorieNeeds(
            weightInKg,
            heightInCm,
            age,
            gender,
            activityLevel
          );
          this.resultsCard.classList.remove("hidden");
        } catch (error) {
          console.error("BMI calculation error:", error);
          this.showError("Please check your inputs and try again.");
        }
      };

      console.log("Simple BMI fix applied");
    }
  }, 800);
});
