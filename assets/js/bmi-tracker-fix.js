/**
 * BMI Tracker Fix - Ensures the BMI Tracker functionality works correctly
 */
document.addEventListener("DOMContentLoaded", function () {
  // Wait for the main BMI calculator to be loaded
  setTimeout(function () {
    console.log("BMI Tracker Fix Initialized");

    // Fix BMI history display function if needed
    if (window.BMICalculator && BMICalculator.prototype) {
      // Enhance the saveBMI function to make sure it works
      BMICalculator.prototype.saveBMI = function () {
        console.log("Enhanced saveBMI called");

        // Make sure we have a current result
        if (this.currentResult) {
          const bmi = this.currentResult.bmi;
          const category = this.currentResult.category;

          console.log(`Saving BMI record: ${bmi} (${category})`);

          // Save the BMI record
          this.saveBMIRecord(bmi, category);

          // Update the display immediately
          this.displayBMIHistory();

          // Show confirmation
          this.showNotification("BMI record saved successfully!", "success");
        } else {
          // If no result, calculate one
          console.warn("No current result, attempting to calculate");
          const height = parseFloat(document.getElementById("height").value);
          const weight = parseFloat(document.getElementById("weight").value);

          if (height && weight) {
            // Calculate BMI directly
            const heightInM = height / 100;
            const bmiValue = weight / (heightInM * heightInM);
            const formattedBMI = bmiValue.toFixed(1);

            // Determine category
            const result = this.getBMICategory(bmiValue);

            // Save record
            this.saveBMIRecord(formattedBMI, result.category);

            // Update the display
            this.displayBMIHistory();

            // Show confirmation
            this.showNotification("BMI record saved successfully!", "success");
          } else {
            this.showNotification("Please calculate your BMI first", "error");
          }
        }
      };

      // Enhance the displayBMIHistory function to make sure it works
      const originalDisplayBMIHistory =
        BMICalculator.prototype.displayBMIHistory;
      BMICalculator.prototype.displayBMIHistory = function () {
        console.log("Enhanced displayBMIHistory called");

        // Try to use the original function first
        try {
          originalDisplayBMIHistory.call(this);
        } catch (e) {
          console.error("Error in original displayBMIHistory:", e);

          // Fallback implementation
          const container = document.getElementById("bmiHistory");

          if (container) {
            // Make sure bmiHistory is loaded
            if (!this.bmiHistory) {
              this.bmiHistory = this.loadBMIHistory();
            }

            if (this.bmiHistory.length === 0) {
              container.innerHTML =
                '<div class="text-sm text-gray-600 dark:text-gray-400">No BMI records saved yet</div>';
              return;
            }

            const historyHTML = this.bmiHistory
              .map(
                (record) => `
                                    <div class="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                        <div>
                                            <span class="font-medium">${record.bmi}</span>
                                            <span class="text-gray-600 dark:text-gray-400 ml-1">(${record.category})</span>
                                        </div>
                                        <span class="text-xs text-gray-500 dark:text-gray-500">${record.date}</span>
                                    </div>
                                `
              )
              .join("");

            container.innerHTML = historyHTML;
          }
        }
      };
    }

    // Make sure the save BMI button works
    const saveBMIBtn = document.getElementById("saveBMIBtn");
    if (saveBMIBtn) {
      saveBMIBtn.addEventListener("click", function () {
        console.log("Save BMI button clicked (from tracker fix)");
        if (window.bmiCalculator) {
          window.bmiCalculator.saveBMI();
        } else if (window.BMICalculator) {
          // Try to create a new instance if none exists
          const tempCalculator = new BMICalculator();
          tempCalculator.saveBMI();
        }
      });
    }
  }, 1500); // Wait for all other scripts to load
});
