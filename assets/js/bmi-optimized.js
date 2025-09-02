/**
 * BMI Calculator - Optimized & Consolidated Script
 * SEO & Speed Optimized Version
 */

// BMI Calculator Class
class BMICalculator {
  constructor() {
    this.form = document.getElementById("bmiForm");
    this.heightInput = document.getElementById("height");
    this.weightInput = document.getElementById("weight");
    this.ageInput = document.getElementById("age");
    this.heightUnit = document.getElementById("heightUnit");
    this.weightUnit = document.getElementById("weightUnit");
    this.activityLevel = document.getElementById("activityLevel");
    this.resultsCard = document.getElementById("resultsCard");
    this.errorContainer = null;
    this.currentResult = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupGenderButtons();
    this.setupUnitConverters();
    this.createErrorContainer();
    this.initializeUnitTracking();
    this.toggleFeetInchesInput(); // Initialize the correct height input display
  }

  initializeUnitTracking() {
    // Store initial unit values for conversion tracking
    this.heightUnit.dataset.previousValue = this.heightUnit.value;
    this.weightUnit.dataset.previousValue = this.weightUnit.value;
  }

  setupEventListeners() {
    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.calculateBMI();
    });

    // Reset button
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetForm());
    }

    // Calculate button
    const calculateBtn = document.getElementById("calculateBtn");
    if (calculateBtn) {
      calculateBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.calculateBMI();
      });
    }

    // Height unit change
    this.heightUnit.addEventListener("change", (e) => {
      this.convertHeightUnit(e);
      this.toggleFeetInchesInput();
      this.updateHeightConversion();
    });

    // Weight unit change
    this.weightUnit.addEventListener("change", (e) => {
      this.convertWeightUnit(e);
      this.updateWeightConversion();
    });

    // Live conversions
    this.heightInput.addEventListener("input", () =>
      this.updateHeightConversion()
    );
    this.weightInput.addEventListener("input", () =>
      this.updateWeightConversion()
    );

    // Feet and inches input event listeners
    const feetInput = document.getElementById("feet");
    const inchesInput = document.getElementById("inches");

    if (feetInput) {
      feetInput.addEventListener("input", () => this.updateHeightConversion());
    }

    if (inchesInput) {
      inchesInput.addEventListener("input", () =>
        this.updateHeightConversion()
      );
    }

    // Save BMI
    const saveBMIBtn = document.getElementById("saveBMIBtn");
    if (saveBMIBtn) {
      saveBMIBtn.addEventListener("click", () => this.saveBMI());
    }

    // Copy and Share buttons
    const copyBtn = document.getElementById("copyResultBtn");
    const shareBtn = document.getElementById("shareResultBtn");
    if (copyBtn) copyBtn.addEventListener("click", () => this.copyResult());
    if (shareBtn) shareBtn.addEventListener("click", () => this.shareResult());
  }

  setupGenderButtons() {
    const genderButtons = document.querySelectorAll(".gender-btn");
    const genderInput = document.getElementById("genderInput");

    genderButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove selected from all buttons
        genderButtons.forEach((btn) => btn.classList.remove("selected"));
        // Add selected to clicked button
        button.classList.add("selected");
        // Update hidden input
        genderInput.value = button.dataset.gender;
      });
    });
  }

  setupUnitConverters() {
    // Height converter
    const heightValueFrom = document.getElementById("heightValueFrom");
    const heightUnitFrom = document.getElementById("heightUnitFrom");
    const heightUnitTo = document.getElementById("heightUnitTo");
    const heightResultValue = document.getElementById("heightResultValue");

    if (
      heightValueFrom &&
      heightUnitFrom &&
      heightUnitTo &&
      heightResultValue
    ) {
      [heightValueFrom, heightUnitFrom, heightUnitTo].forEach((el) => {
        el.addEventListener("input", () => this.updateHeightConverter());
        el.addEventListener("change", () => this.updateHeightConverter());
      });
    }

    // Weight converter
    const weightValueFrom = document.getElementById("weightValueFrom");
    const weightUnitFrom = document.getElementById("weightUnitFrom");
    const weightUnitTo = document.getElementById("weightUnitTo");
    const weightResultValue = document.getElementById("weightResultValue");

    if (
      weightValueFrom &&
      weightUnitFrom &&
      weightUnitTo &&
      weightResultValue
    ) {
      [weightValueFrom, weightUnitFrom, weightUnitTo].forEach((el) => {
        el.addEventListener("input", () => this.updateWeightConverter());
        el.addEventListener("change", () => this.updateWeightConverter());
      });
    }
  }

  createErrorContainer() {
    let errorContainer = document.querySelector(".error-container");
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.className =
        "error-container hidden bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4";
      this.form.insertBefore(errorContainer, this.form.firstChild);
    }
    this.errorContainer = errorContainer;
  }

  showError(message) {
    this.errorContainer.textContent = message;
    this.errorContainer.classList.remove("hidden");
    setTimeout(() => this.errorContainer.classList.add("hidden"), 5000);
  }

  validateForm() {
    let heightValid = false;
    let height = 0;

    // Check height based on current unit mode
    if (this.heightUnit.value === "ft") {
      // Validate feet and inches inputs
      const feet = parseFloat(document.getElementById("feet")?.value || "0");
      const inches = parseFloat(
        document.getElementById("inches")?.value || "0"
      );

      if (feet > 0 || inches > 0) {
        // At least one value should be entered
        height = (feet * 12 + inches) * 2.54; // Convert to cm for validation
        if (height >= 50 && height <= 300) {
          // Reasonable height range in cm
          heightValid = true;
        }
      }
    } else {
      // Validate standard height input
      height = parseFloat(this.heightInput.value);
      if (height && height > 0) {
        heightValid = true;
      }
    }

    const weight = parseFloat(this.weightInput.value);
    const age = parseInt(this.ageInput.value);
    const gender = document.getElementById("genderInput").value;

    if (!heightValid || height <= 0) {
      this.showError("Please enter a valid height");
      return false;
    }
    if (!weight || weight <= 0) {
      this.showError("Please enter a valid weight");
      return false;
    }
    if (!age || age < 15 || age > 120) {
      this.showError("Please enter a valid age (15-120 years)");
      return false;
    }
    if (!gender) {
      this.showError("Please select your gender");
      return false;
    }
    return true;
  }

  getMetricValues() {
    let heightInCm, weightInKg;

    // Height conversion
    switch (this.heightUnit.value) {
      case "cm":
        heightInCm = parseFloat(this.heightInput.value) || 0;
        break;
      case "m":
        heightInCm = (parseFloat(this.heightInput.value) || 0) * 100;
        break;
      case "mm":
        heightInCm = (parseFloat(this.heightInput.value) || 0) / 10;
        break;
      case "ft":
        const feet = parseFloat(document.getElementById("feet")?.value || "0");
        const inches = parseFloat(
          document.getElementById("inches")?.value || "0"
        );
        heightInCm = (feet * 12 + inches) * 2.54;
        break;
      case "inches":
        heightInCm = (parseFloat(this.heightInput.value) || 0) * 2.54;
        break;
      default:
        heightInCm = parseFloat(this.heightInput.value) || 0;
    }

    // Weight conversion
    const weightValue = parseFloat(this.weightInput.value);
    switch (this.weightUnit.value) {
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
        weightInKg = weightValue;
    }

    // Validation for infinite values
    if (!isFinite(heightInCm) || heightInCm <= 0) {
      this.showError("Invalid height value");
      return { heightInCm: null, weightInKg: null };
    }
    if (!isFinite(weightInKg) || weightInKg <= 0) {
      this.showError("Invalid weight value");
      return { heightInCm: null, weightInKg: null };
    }

    return { heightInCm, weightInKg };
  }

  calculateBMI() {
    if (!this.validateForm()) return;

    const { heightInCm, weightInKg } = this.getMetricValues();
    if (!heightInCm || !weightInKg) return;

    const height = heightInCm / 100;
    const bmi = weightInKg / (height * height);

    if (!isFinite(bmi) || bmi <= 0 || bmi > 100) {
      this.showError("Unable to calculate BMI. Please check your inputs.");
      return;
    }

    const age = parseInt(this.ageInput.value);
    const gender = document.getElementById("genderInput").value;
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

    this.currentResult = { bmi, result, age, gender, heightInCm, weightInKg };
  }

  getBMICategory(bmi) {
    if (bmi < 18.5) {
      return {
        category: "Underweight",
        color: "#3b82f6",
        tips: "Consider consulting a healthcare provider about healthy weight gain strategies.",
      };
    } else if (bmi < 25) {
      return {
        category: "Normal weight",
        color: "#10b981",
        tips: "Great! Maintain your healthy lifestyle with balanced diet and regular exercise.",
      };
    } else if (bmi < 30) {
      return {
        category: "Overweight",
        color: "#f59e0b",
        tips: "Consider a balanced diet and regular physical activity to reach a healthier weight.",
      };
    } else {
      return {
        category: "Obese",
        color: "#ef4444",
        tips: "Consider consulting a healthcare provider for personalized weight management advice.",
      };
    }
  }

  displayResults(bmi, result, age, gender) {
    document.getElementById("bmiScore").textContent = bmi.toFixed(1);
    document.getElementById("bmiCategory").textContent = result.category;
    document.getElementById("bmiCategory").style.color = result.color;
    document.getElementById("healthTips").textContent = result.tips;

    // Progress bar
    const progress = document.getElementById("bmiProgress");
    const percentage = Math.min((bmi / 40) * 100, 100);
    progress.style.width = percentage + "%";
    progress.style.backgroundColor = result.color;
  }

  displayIdealWeight(heightInCm, gender) {
    const height = heightInCm / 100;

    // Robinson formula
    let idealWeight;
    if (gender === "male") {
      idealWeight = 52 + (1.9 * (heightInCm - 152.4)) / 2.54;
    } else {
      idealWeight = 49 + (1.7 * (heightInCm - 152.4)) / 2.54;
    }

    const minWeight = 18.5 * height * height;
    const maxWeight = 24.9 * height * height;

    const display = document.getElementById("idealWeightDisplay");
    display.innerHTML = `
      <div class="text-center">
        <div class="text-lg font-semibold text-green-600 dark:text-green-400">${idealWeight.toFixed(
          1
        )} kg</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Ideal weight</div>
        <div class="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Healthy range: ${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg
        </div>
      </div>
    `;
  }

  displayCalorieNeeds(weightInKg, heightInCm, age, gender, activityLevel) {
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === "male") {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      lightly: 1.375,
      moderately: 1.55,
      very: 1.725,
      extremely: 1.9,
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    const display = document.getElementById("calorieDisplay");
    display.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-sm">Maintain weight:</span>
          <span class="font-semibold">${Math.round(tdee)} cal/day</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Lose 0.5 kg/week:</span>
          <span class="font-semibold">${Math.round(tdee - 500)} cal/day</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">Gain 0.5 kg/week:</span>
          <span class="font-semibold">${Math.round(tdee + 500)} cal/day</span>
        </div>
      </div>
    `;
  }

  convertHeightUnit(event) {
    const currentValue = parseFloat(this.heightInput.value);
    if (!currentValue || currentValue <= 0) return;

    const oldUnit = event.target.dataset.previousValue || "cm";
    const newUnit = event.target.value;

    // Store current unit for next conversion
    event.target.dataset.previousValue = newUnit;

    // Convert from old unit to cm first
    let valueInCm = currentValue;
    switch (oldUnit) {
      case "m":
        valueInCm = currentValue * 100;
        break;
      case "mm":
        valueInCm = currentValue / 10;
        break;
      case "inches":
        valueInCm = currentValue * 2.54;
        break;
      case "ft":
        // Don't convert from feet mode since it uses separate inputs
        return;
      default: // cm
        valueInCm = currentValue;
    }

    // Convert from cm to new unit
    let newValue = valueInCm;
    switch (newUnit) {
      case "m":
        newValue = valueInCm / 100;
        break;
      case "mm":
        newValue = valueInCm * 10;
        break;
      case "inches":
        newValue = valueInCm / 2.54;
        break;
      case "ft":
        // Converting to feet mode - set feet and inches
        const totalInches = valueInCm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);

        setTimeout(() => {
          document.getElementById("feet").value = feet;
          document.getElementById("inches").value = inches;
        }, 100);
        return;
      default: // cm
        newValue = valueInCm;
    }

    if (newUnit !== "ft") {
      this.heightInput.value = Math.round(newValue * 100) / 100; // Round to 2 decimal places
    }
  }

  convertWeightUnit(event) {
    const currentValue = parseFloat(this.weightInput.value);
    if (!currentValue || currentValue <= 0) return;

    const oldUnit = event.target.dataset.previousValue || "kg";
    const newUnit = event.target.value;

    // Store current unit for next conversion
    event.target.dataset.previousValue = newUnit;

    // Convert from old unit to kg first
    let valueInKg = currentValue;
    switch (oldUnit) {
      case "g":
        valueInKg = currentValue / 1000;
        break;
      case "lbs":
        valueInKg = currentValue * 0.45359237;
        break;
      case "oz":
        valueInKg = currentValue * 0.02834952;
        break;
      case "stones":
        valueInKg = currentValue * 6.35029318;
        break;
      default: // kg
        valueInKg = currentValue;
    }

    // Convert from kg to new unit
    let newValue = valueInKg;
    switch (newUnit) {
      case "g":
        newValue = valueInKg * 1000;
        break;
      case "lbs":
        newValue = valueInKg / 0.45359237;
        break;
      case "oz":
        newValue = valueInKg / 0.02834952;
        break;
      case "stones":
        newValue = valueInKg / 6.35029318;
        break;
      default: // kg
        newValue = valueInKg;
    }

    this.weightInput.value = Math.round(newValue * 100) / 100; // Round to 2 decimal places
  }

  toggleFeetInchesInput() {
    const standardHeightInput = document.getElementById("standardHeightInput");
    const feetInchesInput = document.getElementById("feetInchesInput");
    const heightUnitFeet = document.getElementById("heightUnitFeet");

    if (this.heightUnit.value === "ft") {
      // Show feet/inches input layout, hide standard input
      standardHeightInput?.classList.add("hidden");
      feetInchesInput?.classList.remove("hidden");

      // Sync the unit dropdown in feet layout with main unit
      if (heightUnitFeet) {
        heightUnitFeet.value = "ft";

        // Add event listener to sync back to main dropdown when changed
        heightUnitFeet.addEventListener("change", (e) => {
          this.heightUnit.value = e.target.value;
          this.toggleFeetInchesInput(); // Re-toggle based on new selection
          this.updateHeightConversion();
        });
      }
    } else {
      // Show standard input layout, hide feet/inches input
      standardHeightInput?.classList.remove("hidden");
      feetInchesInput?.classList.add("hidden");
    }
  }

  updateHeightConversion() {
    const conversion = document.getElementById("heightConversion");
    if (!conversion) return;

    let value, unit;

    // Check if we're in feet/inches mode
    if (this.heightUnit.value === "ft") {
      const feetValue = parseFloat(
        document.getElementById("feet")?.value || "0"
      );
      const inchesValue = parseFloat(
        document.getElementById("inches")?.value || "0"
      );

      if (feetValue === 0 && inchesValue === 0) {
        conversion.textContent = "";
        return;
      }

      // Convert feet and inches to cm for conversion display
      const totalInches = feetValue * 12 + inchesValue;
      const valueInCm = totalInches * 2.54;

      let conversions = [];
      conversions.push(`${valueInCm.toFixed(1)} cm`);
      conversions.push(`${(valueInCm / 100).toFixed(2)} m`);
      conversions.push(`${totalInches.toFixed(1)} inches`);

      conversion.textContent = conversions.join(" • ");
      return;
    }

    // Standard height input handling
    if (!this.heightInput.value) {
      conversion.textContent = "";
      return;
    }

    value = parseFloat(this.heightInput.value);
    unit = this.heightUnit.value;

    let conversions = [];
    if (unit === "cm") {
      conversions.push(`${(value / 100).toFixed(2)} m`);
      conversions.push(
        `${Math.floor(value / 30.48)}'${Math.round((value % 30.48) / 2.54)}"`
      );
    } else if (unit === "m") {
      conversions.push(`${(value * 100).toFixed(0)} cm`);
      conversions.push(
        `${Math.floor(value * 3.28084)}'${Math.round(
          ((value * 3.28084) % 1) * 12
        )}"`
      );
    } else if (unit === "mm") {
      conversions.push(`${(value / 10).toFixed(1)} cm`);
      conversions.push(`${(value / 1000).toFixed(3)} m`);
    } else if (unit === "inches") {
      conversions.push(`${(value * 2.54).toFixed(1)} cm`);
      conversions.push(`${Math.floor(value / 12)}'${Math.round(value % 12)}"`);
    }

    conversion.textContent = conversions.join(" • ");
  }

  updateWeightConversion() {
    const conversion = document.getElementById("weightConversion");
    if (!conversion || !this.weightInput.value) return;

    const value = parseFloat(this.weightInput.value);
    const unit = this.weightUnit.value;

    let conversions = [];
    if (unit === "kg") {
      conversions.push(`${(value * 2.20462).toFixed(1)} lbs`);
      conversions.push(
        `${Math.floor(value * 0.157473)} st ${Math.round(
          ((value * 0.157473) % 1) * 14
        )} lbs`
      );
    } else if (unit === "lbs") {
      conversions.push(`${(value * 0.453592).toFixed(1)} kg`);
    }

    conversion.textContent = conversions.join(" • ");
  }

  updateHeightConverter() {
    const valueFrom = document.getElementById("heightValueFrom")?.value;
    const unitFrom = document.getElementById("heightUnitFrom")?.value;
    const unitTo = document.getElementById("heightUnitTo")?.value;
    const resultElement = document.getElementById("heightResultValue");

    if (!valueFrom || !resultElement) return;

    const value = parseFloat(valueFrom);
    let result;

    // Convert to cm first
    let valueInCm;
    switch (unitFrom) {
      case "cm":
        valueInCm = value;
        break;
      case "m":
        valueInCm = value * 100;
        break;
      case "mm":
        valueInCm = value / 10;
        break;
      case "ft":
        valueInCm = value * 30.48;
        break;
      case "in":
        valueInCm = value * 2.54;
        break;
      default:
        valueInCm = value;
    }

    // Convert from cm to target unit
    switch (unitTo) {
      case "cm":
        result = valueInCm.toFixed(2) + " cm";
        break;
      case "m":
        result = (valueInCm / 100).toFixed(3) + " m";
        break;
      case "mm":
        result = (valueInCm * 10).toFixed(0) + " mm";
        break;
      case "ft":
        result = (valueInCm / 30.48).toFixed(2) + " ft";
        break;
      case "in":
        result = (valueInCm / 2.54).toFixed(2) + " in";
        break;
      case "ftIn":
        const feet = Math.floor(valueInCm / 30.48);
        const inches = Math.round((valueInCm % 30.48) / 2.54);
        result = `${feet}' ${inches}"`;
        break;
      default:
        result = valueInCm.toFixed(2) + " cm";
    }

    resultElement.value = result;
  }

  updateWeightConverter() {
    const valueFrom = document.getElementById("weightValueFrom")?.value;
    const unitFrom = document.getElementById("weightUnitFrom")?.value;
    const unitTo = document.getElementById("weightUnitTo")?.value;
    const resultElement = document.getElementById("weightResultValue");

    if (!valueFrom || !resultElement) return;

    const value = parseFloat(valueFrom);
    let result;

    // Convert to kg first
    let valueInKg;
    switch (unitFrom) {
      case "kg":
        valueInKg = value;
        break;
      case "g":
        valueInKg = value / 1000;
        break;
      case "lbs":
        valueInKg = value * 0.453592;
        break;
      case "oz":
        valueInKg = value * 0.0283495;
        break;
      case "st":
        valueInKg = value * 6.35029;
        break;
      default:
        valueInKg = value;
    }

    // Convert from kg to target unit
    switch (unitTo) {
      case "kg":
        result = valueInKg.toFixed(2) + " kg";
        break;
      case "g":
        result = (valueInKg * 1000).toFixed(0) + " g";
        break;
      case "lbs":
        result = (valueInKg * 2.20462).toFixed(2) + " lbs";
        break;
      case "oz":
        result = (valueInKg * 35.274).toFixed(1) + " oz";
        break;
      case "st":
        result = (valueInKg * 0.157473).toFixed(2) + " st";
        break;
      case "stLb":
        const stones = Math.floor(valueInKg * 0.157473);
        const pounds = Math.round(((valueInKg * 0.157473) % 1) * 14);
        result = `${stones} st ${pounds} lbs`;
        break;
      default:
        result = valueInKg.toFixed(2) + " kg";
    }

    resultElement.value = result;
  }

  saveBMI() {
    if (!this.currentResult) return;

    const history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
    const entry = {
      date: new Date().toLocaleDateString(),
      bmi: this.currentResult.bmi.toFixed(1),
      category: this.currentResult.result.category,
      weight: this.currentResult.weightInKg.toFixed(1),
      height: this.currentResult.heightInCm.toFixed(0),
    };

    history.unshift(entry);
    history.splice(10); // Keep only last 10 entries
    localStorage.setItem("bmiHistory", JSON.stringify(history));

    this.displayBMIHistory();
  }

  displayBMIHistory() {
    const history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
    const container = document.getElementById("bmiHistory");

    if (history.length === 0) {
      container.innerHTML =
        '<div class="text-sm text-gray-600 dark:text-gray-400">No BMI records saved yet</div>';
      return;
    }

    container.innerHTML = history
      .map(
        (entry) => `
      <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
        <div>
          <div class="font-medium">${entry.bmi} - ${entry.category}</div>
          <div class="text-xs text-gray-500">${entry.date}</div>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
          ${entry.weight}kg • ${entry.height}cm
        </div>
      </div>
    `
      )
      .join("");
  }

  copyResult() {
    if (!this.currentResult) return;

    const text = `BMI: ${this.currentResult.bmi.toFixed(1)} - ${
      this.currentResult.result.category
    }`;
    navigator.clipboard?.writeText(text).then(() => {
      alert("BMI result copied to clipboard!");
    });
  }

  shareResult() {
    if (!this.currentResult) return;

    const text = `My BMI is ${this.currentResult.bmi.toFixed(1)} (${
      this.currentResult.result.category
    })`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title: "My BMI Result", text, url });
    } else {
      prompt("Share this link:", url);
    }
  }

  resetForm() {
    this.form.reset();
    this.resultsCard.classList.add("hidden");
    this.errorContainer?.classList.add("hidden");

    // Reset displays
    document.getElementById("heightConversion").textContent = "";
    document.getElementById("weightConversion").textContent = "";
    document.getElementById("idealWeightDisplay").innerHTML =
      '<div class="text-sm text-gray-600 dark:text-gray-400">Enter your details to calculate</div>';
    document.getElementById("calorieDisplay").innerHTML =
      '<div class="text-sm text-gray-600 dark:text-gray-400">Calculate BMI to see calorie needs</div>';

    // Reset gender buttons
    document
      .querySelectorAll(".gender-btn")
      .forEach((btn) => btn.classList.remove("selected"));
    document.getElementById("genderInput").value = "";

    // Reset height input layout to standard (non-feet mode)
    const standardHeightInput = document.getElementById("standardHeightInput");
    const feetInchesInput = document.getElementById("feetInchesInput");

    standardHeightInput?.classList.remove("hidden");
    feetInchesInput?.classList.add("hidden");

    // Clear feet and inches inputs
    const feetInput = document.getElementById("feet");
    const inchesInput = document.getElementById("inches");
    if (feetInput) feetInput.value = "";
    if (inchesInput) inchesInput.value = "";

    this.currentResult = null;
  }
}

// Dark mode functionality
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const darkModeIcon = document.getElementById("darkModeIcon");

  const isDark =
    localStorage.getItem("darkMode") === "true" ||
    (!localStorage.getItem("darkMode") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    document.documentElement.classList.add("dark");
    darkModeIcon.setAttribute("data-lucide", "sun");
    darkModeToggle.setAttribute("aria-pressed", "true");
  } else {
    darkModeIcon.setAttribute("data-lucide", "moon");
    darkModeToggle.setAttribute("aria-pressed", "false");
  }

  darkModeToggle?.addEventListener("click", () => {
    // Add changing animation class
    darkModeIcon.classList.add("changing");

    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark);
    darkModeIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    darkModeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    lucide.createIcons();

    // Remove animation class after animation completes
    setTimeout(() => {
      darkModeIcon.classList.remove("changing");
    }, 600);
  });
}

// FAQ functionality
function initFAQ() {
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector("[data-lucide]");

      answer.classList.toggle("hidden");
      icon.style.transform = answer.classList.contains("hidden")
        ? "rotate(0deg)"
        : "rotate(180deg)";
    });
  });
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  // Initialize BMI Calculator
  window.bmiCalculator = new BMICalculator();

  // Initialize dark mode
  initDarkMode();

  // Initialize FAQ
  initFAQ();

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Display BMI history
  window.bmiCalculator.displayBMIHistory();

  console.log("BMI Calculator optimized and ready!");
});
