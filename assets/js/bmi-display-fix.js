/**
 * Complete BMI Calculator Fix - Fixes all functionality including BMI display, Health Tips,
 * Ideal Weight Range, Daily Calorie Needs, and BMI Tracker
 */
document.addEventListener("DOMContentLoaded", function () {
  // Wait for all scripts to load but use a longer timeout to ensure we're the last to execute
  setTimeout(function () {
    console.log("Complete BMI Calculator Fix Initialized");

    // Direct fix for the BMI score element and all related displays
    const updateAllDisplays = function () {
      // Get the latest BMI data
      const calculatorInstance = window.bmiCalculator;

      if (calculatorInstance && calculatorInstance.currentResult) {
        // Get the stored BMI value and data
        const storedBMI = calculatorInstance.currentResult.bmi;
        const storedCategory = calculatorInstance.currentResult.category;
        const storedAge = calculatorInstance.currentResult.age;
        const storedGender = calculatorInstance.currentResult.gender;

        // Update the BMI score display directly
        const bmiScoreElement = document.getElementById("bmiScore");
        if (bmiScoreElement && storedBMI) {
          bmiScoreElement.textContent = storedBMI;
          console.log(`BMI directly updated to: ${storedBMI}`);
        }

        // Ensure results card is visible
        const resultsCard = document.getElementById("resultsCard");
        if (resultsCard) {
          resultsCard.classList.remove("hidden");
        }

        // Make sure all related displays are updated
        try {
          if (calculatorInstance) {
            // Get the input values
            const height = document.getElementById("height").value;
            const weight = document.getElementById("weight").value;
            const age = document.getElementById("age").value;
            const gender =
              document.getElementById("genderInput").value || "male";
            const activityLevel =
              document.getElementById("activityLevel").value;

            // If we have all required values, update all displays
            if (height && weight && age && gender) {
              // Calculate all values in metric
              const { heightInCm, weightInKg } =
                calculatorInstance.getMetricValues();

              // Update ideal weight display
              calculatorInstance.displayIdealWeight(heightInCm, gender);
              console.log("Ideal weight display updated");

              // Update calorie needs display
              calculatorInstance.displayCalorieNeeds(
                weightInKg,
                heightInCm,
                parseInt(age),
                gender,
                activityLevel
              );
              console.log("Calorie needs display updated");
            }
          }
        } catch (e) {
          console.error("Error updating displays:", e);
        }
      }
    };

    // Fix all BMI functionality by carefully preserving the original flow
    // but ensuring all calculations and displays work
    if (window.BMICalculator && BMICalculator.prototype) {
      // 1. First fix the calculateBMI method
      const originalCalculateBMI = BMICalculator.prototype.calculateBMI;
      BMICalculator.prototype.calculateBMI = function () {
        console.log("Complete BMI fix - calculateBMI called");

        try {
          // Get the values needed for calculation
          const { heightInCm, weightInKg } = this.getMetricValues();
          const height = heightInCm / 100; // Convert cm to m
          const age = parseInt(document.getElementById("age").value);

          // Get gender from the hidden input field
          const gender = document.getElementById("genderInput").value || "male";
          console.log("Using gender from hidden input:", gender);

          // Calculate BMI with high precision
          const bmi = weightInKg / (height * height);
          const preciseValue = parseFloat(bmi.toFixed(2));
          console.log(
            `Complete BMI calculation: ${weightInKg} kg / (${height} m)² = ${preciseValue}`
          );

          // Determine category and color
          const result = this.getBMICategory(preciseValue);
          console.log("BMI Category:", result.category);

          // Format BMI value with proper precision
          const formattedBMI = preciseValue.toFixed(1);

          // Store result for copying/sharing first, so other functions can use it
          this.currentResult = {
            bmi: formattedBMI,
            category: result.category,
            age,
            gender,
          };

          // Then call displayResults to update the UI
          this.displayResults(bmi, result, age, gender);
          console.log("Results displayed with BMI:", formattedBMI);

          // Make sure all other displays are updated correctly
          this.displayIdealWeight(heightInCm, gender);
          console.log("Ideal weight display updated");

          this.displayCalorieNeeds(
            weightInKg,
            heightInCm,
            age,
            gender,
            this.activityLevel.value
          );
          console.log("Calorie needs display updated");

          // Make sure the results card is visible
          this.resultsCard.classList.remove("hidden");
          this.resultsCard.classList.add("results-enter");

          // Double check that the BMI value is displayed correctly
          const bmiScoreElement = document.getElementById("bmiScore");
          if (bmiScoreElement && bmiScoreElement.textContent !== formattedBMI) {
            bmiScoreElement.textContent = formattedBMI;
            console.log("Forced BMI score update to:", formattedBMI);
          }

          // Schedule another update after a small delay to ensure all displays are updated
          setTimeout(updateAllDisplays, 100);

          // Return the calculated BMI
          return preciseValue;
        } catch (error) {
          console.error("Error in calculateBMI:", error);
          // Try to fall back to original implementation
          return originalCalculateBMI.call(this);
        }
      };

      // 2. Fix the displayResults method to ensure it shows the health tips
      const originalDisplayResults = BMICalculator.prototype.displayResults;
      BMICalculator.prototype.displayResults = function (
        bmi,
        result,
        age,
        gender
      ) {
        console.log("Complete BMI fix - displayResults called");
        try {
          // Call the original first
          originalDisplayResults.call(this, bmi, result, age, gender);

          // Then verify all the elements are updated correctly
          const formattedBMI = parseFloat(bmi).toFixed(1);

          // Update BMI score
          const bmiScoreElement = document.getElementById("bmiScore");
          if (bmiScoreElement) {
            bmiScoreElement.textContent = formattedBMI;
            bmiScoreElement.style.color = this.getColorForCategory(
              result.color
            );
          }

          // Update category
          const bmiCategoryElement = document.getElementById("bmiCategory");
          if (bmiCategoryElement) {
            bmiCategoryElement.textContent = result.category;
            bmiCategoryElement.style.color = this.getColorForCategory(
              result.color
            );
          }

          // Update progress bar
          const progressBar = document.getElementById("bmiProgress");
          if (progressBar) {
            progressBar.className = `h-2 rounded-full transition-all duration-500 bmi-${
              result.color === "blue"
                ? "underweight"
                : result.color === "green"
                ? "normal"
                : result.color === "yellow"
                ? "overweight"
                : "obese"
            }`;
            progressBar.style.width = `${Math.min(result.progressWidth, 100)}%`;
          }

          // Ensure health tips are updated
          const healthTipsElement = document.getElementById("healthTips");
          if (healthTipsElement && result.tips) {
            healthTipsElement.textContent = result.tips;
            console.log("Health tips updated:", result.tips);
          }
        } catch (error) {
          console.error("Error in displayResults:", error);
        }
      };

      // 3. Add a special save BMI functionality
      const originalSaveBMI = BMICalculator.prototype.saveBMI;
      BMICalculator.prototype.saveBMI = function () {
        console.log("Complete BMI fix - saveBMI called");
        try {
          if (this.currentResult) {
            // Make sure we save the current BMI record properly
            this.saveBMIRecord(
              this.currentResult.bmi,
              this.currentResult.category
            );
            this.showNotification("BMI record saved successfully!", "success");
            console.log(
              "BMI record saved:",
              this.currentResult.bmi,
              this.currentResult.category
            );
          } else {
            console.warn("No current BMI result to save");
          }
        } catch (error) {
          console.error("Error in saveBMI:", error);
          // Try to fall back to original implementation if available
          if (typeof originalSaveBMI === "function") {
            originalSaveBMI.call(this);
          }
        }
      };

      console.log("Complete BMI calculation and display methods fixed");
    }

    // Add a special click handler for the calculate button to ensure everything updates
    const calculateBtn = document.getElementById("calculateBtn");
    if (calculateBtn) {
      calculateBtn.addEventListener("click", function () {
        console.log("Calculate button click detected by complete BMI fix");
        // Schedule a comprehensive update after calculation
        setTimeout(updateAllDisplays, 500);
      });
    }

    // Add a special click handler for the save BMI button
    const saveBMIBtn = document.getElementById("saveBMIBtn");
    if (saveBMIBtn) {
      saveBMIBtn.addEventListener("click", function () {
        console.log("Save BMI button click detected");
        // If there's a global BMI calculator instance, use it
        if (window.bmiCalculator) {
          window.bmiCalculator.saveBMI();
        }
      });
    }

    // Schedule multiple checks to ensure everything is updated
    setTimeout(updateAllDisplays, 1000);
    setTimeout(updateAllDisplays, 2000);
    setTimeout(updateAllDisplays, 3000);
  }, 1000); // Wait to ensure all other scripts are loaded
});
