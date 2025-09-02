/**
 * Comprehensive Fix for "Infinity" BMI Issue
 * Prevents division by zero and handles cached data properly
 */
document.addEventListener("DOMContentLoaded", function () {
  // Wait for all scripts to load before applying fixes
  setTimeout(function () {
    console.log("Applying Infinity BMI fix...");

    if (window.BMICalculator && BMICalculator.prototype) {
      // 1. Fix getMetricValues to prevent invalid values
      const originalGetMetricValues = BMICalculator.prototype.getMetricValues;
      BMICalculator.prototype.getMetricValues = function () {
        console.log("Enhanced getMetricValues called");

        try {
          let heightInCm, weightInKg;

          // Get fresh values directly from form elements
          const heightInput = document.getElementById("height");
          const weightInput = document.getElementById("weight");
          const heightUnit = document.getElementById("heightUnit");
          const weightUnit = document.getElementById("weightUnit");

          if (!heightInput || !weightInput || !heightUnit || !weightUnit) {
            throw new Error("Required form elements not found");
          }

          const heightValue = parseFloat(heightInput.value);
          const weightValue = parseFloat(weightInput.value);

          // Validate raw input values first
          if (!heightValue || isNaN(heightValue) || heightValue <= 0) {
            this.showError("Please enter a valid height value");
            return { heightInCm: null, weightInKg: null };
          }

          if (!weightValue || isNaN(weightValue) || weightValue <= 0) {
            this.showError("Please enter a valid weight value");
            return { heightInCm: null, weightInKg: null };
          }

          // Convert height to cm with validation
          switch (heightUnit.value) {
            case "cm":
              heightInCm = heightValue;
              break;
            case "m":
              heightInCm = heightValue * 100;
              break;
            case "mm":
              heightInCm = heightValue / 10;
              break;
            case "ft":
              const feetInput = document.getElementById("feet");
              const inchesInput = document.getElementById("inches");
              if (feetInput && inchesInput) {
                const feet = parseFloat(feetInput.value) || 0;
                const inches = parseFloat(inchesInput.value) || 0;
                heightInCm = (feet * 12 + inches) * 2.54;
              } else {
                // Fallback: treat as decimal feet
                heightInCm = heightValue * 30.48;
              }
              break;
            case "inches":
              heightInCm = heightValue * 2.54;
              break;
            default:
              heightInCm = heightValue; // Default to cm
          }

          // Convert weight to kg with validation
          switch (weightUnit.value) {
            case "kg":
              weightInKg = weightValue;
              break;
            case "g":
              weightInKg = weightValue / 1000;
              break;
            case "lbs":
              weightInKg = weightValue * 0.45359237;
              break;
            case "oz":
              weightInKg = weightValue * 0.02834952;
              break;
            case "stones":
              weightInKg = weightValue * 6.35029318;
              break;
            default:
              weightInKg = weightValue; // Default to kg
          }

          // Final validation of converted values
          if (
            !heightInCm ||
            isNaN(heightInCm) ||
            heightInCm <= 0 ||
            heightInCm > 300
          ) {
            this.showError("Invalid height detected. Please check your input.");
            return { heightInCm: null, weightInKg: null };
          }

          if (
            !weightInKg ||
            isNaN(weightInKg) ||
            weightInKg <= 0 ||
            weightInKg > 500
          ) {
            this.showError("Invalid weight detected. Please check your input.");
            return { heightInCm: null, weightInKg: null };
          }

          console.log(
            `Valid metric values: ${weightInKg} kg, ${heightInCm} cm`
          );
          return { heightInCm, weightInKg };
        } catch (error) {
          console.error("Error in getMetricValues:", error);
          this.showError("Error processing your input. Please try again.");
          return { heightInCm: null, weightInKg: null };
        }
      };

      // 2. Fix calculateBMI to handle invalid values
      const originalCalculateBMI = BMICalculator.prototype.calculateBMI;
      BMICalculator.prototype.calculateBMI = function () {
        console.log("Enhanced calculateBMI called");

        try {
          // Validate form first
          if (!this.validateForm()) {
            console.log("Form validation failed");
            return;
          }

          // Get metric values with enhanced validation
          const { heightInCm, weightInKg } = this.getMetricValues();

          // Check if values are valid
          if (!heightInCm || !weightInKg) {
            console.error("Invalid metric values received");
            return;
          }

          const height = heightInCm / 100; // Convert cm to m

          // Additional safety check for height
          if (height <= 0 || isNaN(height)) {
            this.showError("Invalid height value. Please check your input.");
            return;
          }

          const age = parseInt(document.getElementById("age").value);
          const gender = document.getElementById("genderInput").value || "male";
          const activityLevel = this.activityLevel.value;

          // Calculate BMI with safety checks
          const bmi = weightInKg / (height * height);

          // Validate BMI result
          if (!bmi || isNaN(bmi) || !isFinite(bmi)) {
            this.showError(
              "Unable to calculate BMI. Please check your inputs."
            );
            console.error("Invalid BMI calculated:", bmi);
            return;
          }

          console.log(
            `BMI calculation: ${weightInKg} kg / (${height} m)² = ${bmi}`
          );

          // Continue with original calculation if BMI is valid
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
          console.error("Error in calculateBMI:", error);
          this.showError(
            "An error occurred while calculating BMI. Please try again."
          );
        }
      };

      // 3. Enhanced form reset to clear all cached data
      const originalResetForm = BMICalculator.prototype.resetForm;
      BMICalculator.prototype.resetForm = function () {
        console.log("Enhanced resetForm called");

        // Call original reset
        if (originalResetForm) {
          originalResetForm.call(this);
        }

        // Additional cleanup
        const inputs = ["height", "weight", "age", "feet", "inches"];
        inputs.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            element.value = "";
            element.classList.remove("border-red-500", "border-green-500");
          }
        });

        // Reset selects
        const selects = ["heightUnit", "weightUnit", "activityLevel"];
        selects.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            element.selectedIndex = 0;
          }
        });

        // Clear gender selection
        const genderInput = document.getElementById("genderInput");
        if (genderInput) {
          genderInput.value = "";
        }

        // Reset gender buttons
        const genderButtons = document.querySelectorAll(".gender-btn");
        genderButtons.forEach((btn) => {
          btn.classList.remove("selected");
        });

        // Clear any error messages
        if (this.errorContainer) {
          this.errorContainer.classList.add("hidden");
        }

        // Force clear conversion displays
        setTimeout(() => {
          const heightConversion = document.getElementById("heightConversion");
          const weightConversion = document.getElementById("weightConversion");
          if (heightConversion) heightConversion.textContent = "";
          if (weightConversion) weightConversion.textContent = "";
        }, 100);

        console.log("Form reset completed with cache clearing");
      };

      // 4. Add event listener to calculate button for additional safety
      const calculateBtn = document.getElementById("calculateBtn");
      if (calculateBtn) {
        calculateBtn.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            console.log("Calculate button clicked - running safety checks");

            // Clear any previous error states
            const errorContainer = document.querySelector(".error-container");
            if (errorContainer) {
              errorContainer.classList.add("hidden");
            }

            // Verify all inputs have values before proceeding
            const height = document.getElementById("height").value;
            const weight = document.getElementById("weight").value;
            const age = document.getElementById("age").value;

            if (!height || !weight || !age) {
              alert("Please fill in all required fields");
              return;
            }

            // Force refresh of input values to prevent cached issues
            setTimeout(() => {
              if (window.bmiCalculator) {
                window.bmiCalculator.calculateBMI();
              }
            }, 50);
          },
          true
        ); // Use capture phase
      }

      console.log("Infinity BMI fix applied successfully");
    } else {
      console.warn("BMICalculator not found, retrying in 1 second...");
      setTimeout(arguments.callee, 1000);
    }
  }, 1200);
});
