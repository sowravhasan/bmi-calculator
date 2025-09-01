// BMI Calculator JavaScript with Enhanced Features and Full Functionality

class BMICalculator {
  constructor() {
    this.form = document.getElementById("bmiForm");
    this.resultsCard = document.getElementById("resultsCard");
    this.darkModeToggle = document.getElementById("darkModeToggle");
    this.darkModeIcon = document.getElementById("darkModeIcon");

    // Unit conversion elements
    this.heightInput = document.getElementById("height");
    this.heightUnit = document.getElementById("heightUnit");
    this.weightInput = document.getElementById("weight");
    this.weightUnit = document.getElementById("weightUnit");
    this.feetInchesInput = document.getElementById("feetInchesInput");
    this.feetInput = document.getElementById("feet");
    this.inchesInput = document.getElementById("inches");

    // Activity level
    this.activityLevel = document.getElementById("activityLevel");

    // BMI tracking
    this.bmiHistory = this.loadBMIHistory();

    this.initializeApp();
    this.bindEvents();
    this.initializeLucideIcons();
  }

  initializeApp() {
    // Initialize dark mode
    this.initializeDarkMode();

    // Initialize FAQ toggles
    this.initializeFAQ();

    // Add loading states
    this.setupLoadingStates();

    // Initialize unit converters
    this.initializeUnitConverters();

    // Display BMI history
    this.displayBMIHistory();

    // Set initial placeholders
    this.updatePlaceholders();
  }

  initializeUnitConverters() {
    // Height unit converter
    this.heightUnit.addEventListener("change", () => {
      this.toggleFeetInchesInput();
      this.updateHeightConversion();
      this.updatePlaceholders();
    });

    this.heightInput.addEventListener("input", () => {
      this.updateHeightConversion();
      this.updateLiveCalculations();
    });

    if (this.feetInput) {
      this.feetInput.addEventListener("input", () => {
        this.updateHeightFromFeetInches();
        this.updateLiveCalculations();
      });
    }

    if (this.inchesInput) {
      this.inchesInput.addEventListener("input", () => {
        this.updateHeightFromFeetInches();
        this.updateLiveCalculations();
      });
    }

    // Weight unit converter
    this.weightUnit.addEventListener("change", () => {
      this.updateWeightConversion();
      this.updatePlaceholders();
    });

    this.weightInput.addEventListener("input", () => {
      this.updateWeightConversion();
      this.updateLiveCalculations();
    });
  }

  updatePlaceholders() {
    // Update height placeholder based on unit
    const heightPlaceholders = {
      cm: "170",
      m: "1.70",
      mm: "1700",
      ft: "Use feet/inches below",
      inches: "67",
    };

    // Update weight placeholder based on unit
    const weightPlaceholders = {
      kg: "70",
      g: "70000",
      lbs: "154",
      oz: "2469",
      stones: "11",
    };

    this.heightInput.placeholder =
      heightPlaceholders[this.heightUnit.value] || "170";
    this.weightInput.placeholder =
      weightPlaceholders[this.weightUnit.value] || "70";
  }

  toggleFeetInchesInput() {
    if (this.heightUnit.value === "ft") {
      this.feetInchesInput.classList.remove("hidden");
      this.heightInput.style.display = "none";
    } else {
      this.feetInchesInput.classList.add("hidden");
      this.heightInput.style.display = "block";
    }
  }

  updateHeightConversion() {
    const height = parseFloat(this.heightInput.value);
    if (!height) {
      document.getElementById("heightConversion").textContent = "";
      return;
    }

    const unit = this.heightUnit.value;
    let conversions = [];

    switch (unit) {
      case "cm":
        const feet = Math.floor(height / 30.48);
        const inches = Math.round((height / 2.54) % 12);
        const totalInches = Math.round(height / 2.54);
        const meters = (height / 100).toFixed(2);
        conversions.push(
          `${meters}m • ${feet}'${inches}" • ${totalInches} inches`
        );
        break;
      case "m":
        const cm = Math.round(height * 100);
        const feetFromM = Math.floor(cm / 30.48);
        const inchesFromM = Math.round((cm / 2.54) % 12);
        conversions.push(`${cm}cm • ${feetFromM}'${inchesFromM}"`);
        break;
      case "mm":
        const cmFromMm = Math.round(height / 10);
        const mFromMm = (height / 1000).toFixed(2);
        conversions.push(`${cmFromMm}cm • ${mFromMm}m`);
        break;
      case "inches":
        const cmFromInches = Math.round(height * 2.54);
        const feetFromInches = Math.floor(height / 12);
        const remainingInches = Math.round(height % 12);
        conversions.push(
          `${cmFromInches}cm • ${feetFromInches}'${remainingInches}"`
        );
        break;
    }

    document.getElementById("heightConversion").textContent =
      conversions.join("");
  }

  updateHeightFromFeetInches() {
    const feet = parseFloat(this.feetInput.value) || 0;
    const inches = parseFloat(this.inchesInput.value) || 0;

    if (feet || inches) {
      const totalInches = feet * 12 + inches;
      const cm = Math.round(totalInches * 2.54);
      this.heightInput.value = cm;
      document.getElementById(
        "heightConversion"
      ).textContent = `${cm}cm • ${totalInches} inches`;
    }
  }

  updateWeightConversion() {
    const weight = parseFloat(this.weightInput.value);
    if (!weight) {
      document.getElementById("weightConversion").textContent = "";
      return;
    }

    const unit = this.weightUnit.value;
    let conversions = [];

    switch (unit) {
      case "kg":
        const lbs = Math.round(weight * 2.205 * 10) / 10;
        const stones = Math.floor(weight * 0.157);
        const remainingLbs = Math.round((weight * 0.157 - stones) * 14);
        const grams = Math.round(weight * 1000);
        conversions.push(
          `${lbs}lbs • ${stones}st ${remainingLbs}lbs • ${grams}g`
        );
        break;
      case "g":
        const kgFromG = Math.round((weight / 1000) * 10) / 10;
        const lbsFromG = Math.round((weight / 453.592) * 10) / 10;
        conversions.push(`${kgFromG}kg • ${lbsFromG}lbs`);
        break;
      case "lbs":
        const kgFromLbs = Math.round(weight * 0.453592 * 10) / 10;
        const stonesFromLbs = Math.floor(weight / 14);
        const remainingLbsFromLbs = Math.round(weight % 14);
        conversions.push(
          `${kgFromLbs}kg • ${stonesFromLbs}st ${remainingLbsFromLbs}lbs`
        );
        break;
      case "oz":
        const kgFromOz = Math.round(weight * 0.0283495 * 10) / 10;
        const lbsFromOz = Math.round((weight / 16) * 10) / 10;
        conversions.push(`${kgFromOz}kg • ${lbsFromOz}lbs`);
        break;
      case "stones":
        const kgFromStones = Math.round(weight * 6.35029 * 10) / 10;
        const lbsFromStones = Math.round(weight * 14);
        conversions.push(`${kgFromStones}kg • ${lbsFromStones}lbs`);
        break;
    }

    document.getElementById("weightConversion").textContent =
      conversions.join("");
  }

  // Convert all inputs to metric for calculations
  getMetricValues() {
    let heightInCm, weightInKg;

    // Height conversion
    switch (this.heightUnit.value) {
      case "cm":
        heightInCm = parseFloat(this.heightInput.value);
        break;
      case "m":
        heightInCm = parseFloat(this.heightInput.value) * 100;
        break;
      case "mm":
        heightInCm = parseFloat(this.heightInput.value) / 10;
        break;
      case "ft":
        const feet = parseFloat(this.feetInput.value) || 0;
        const inches = parseFloat(this.inchesInput.value) || 0;
        heightInCm = (feet * 12 + inches) * 2.54;
        break;
      case "inches":
        heightInCm = parseFloat(this.heightInput.value) * 2.54;
        break;
    }

    // Weight conversion
    switch (this.weightUnit.value) {
      case "kg":
        weightInKg = parseFloat(this.weightInput.value);
        break;
      case "g":
        weightInKg = parseFloat(this.weightInput.value) / 1000;
        break;
      case "lbs":
        weightInKg = parseFloat(this.weightInput.value) * 0.453592;
        break;
      case "oz":
        weightInKg = parseFloat(this.weightInput.value) * 0.0283495;
        break;
      case "stones":
        weightInKg = parseFloat(this.weightInput.value) * 6.35029;
        break;
    }

    return { heightInCm, weightInKg };
  }

  calculateIdealWeight(heightInCm, gender) {
    const heightInM = heightInCm / 100;

    // BMI-based ideal weight range (BMI 18.5-24.9)
    const minIdeal = Math.round(18.5 * heightInM * heightInM * 10) / 10;
    const maxIdeal = Math.round(24.9 * heightInM * heightInM * 10) / 10;

    // Robinson Formula
    let robinson;
    if (gender === "male") {
      robinson = Math.round((52 + 1.9 * (heightInCm / 2.54 - 60)) * 10) / 10;
    } else {
      robinson = Math.round((49 + 1.7 * (heightInCm / 2.54 - 60)) * 10) / 10;
    }

    // Devine Formula
    let devine;
    if (gender === "male") {
      devine = Math.round((50 + 2.3 * (heightInCm / 2.54 - 60)) * 10) / 10;
    } else {
      devine = Math.round((45.5 + 2.3 * (heightInCm / 2.54 - 60)) * 10) / 10;
    }

    // Miller Formula
    let miller;
    if (gender === "male") {
      miller = Math.round((56.2 + 1.41 * (heightInCm / 2.54 - 60)) * 10) / 10;
    } else {
      miller = Math.round((53.1 + 1.36 * (heightInCm / 2.54 - 60)) * 10) / 10;
    }

    // Hamwi Formula
    let hamwi;
    if (gender === "male") {
      hamwi = Math.round((48 + 2.7 * (heightInCm / 2.54 - 60)) * 10) / 10;
    } else {
      hamwi = Math.round((45.5 + 2.2 * (heightInCm / 2.54 - 60)) * 10) / 10;
    }

    return {
      bmiRange: `${minIdeal} - ${maxIdeal} kg`,
      robinson: `${robinson} kg`,
      devine: `${devine} kg`,
      miller: `${miller} kg`,
      hamwi: `${hamwi} kg`,
      minIdeal,
      maxIdeal,
    };
  }

  calculateCalorieNeeds(weightInKg, heightInCm, age, gender, activityLevel) {
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === "male") {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly: 1.375,
      moderately: 1.55,
      very: 1.725,
      extremely: 1.9,
    };

    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

    return {
      bmr: Math.round(bmr),
      tdee: tdee,
      weightLoss: Math.round(tdee - 500), // 500 cal deficit
      weightGain: Math.round(tdee + 500), // 500 cal surplus
    };
  }

  displayIdealWeight(heightInCm, gender) {
    const idealWeight = this.calculateIdealWeight(heightInCm, gender);

    const display = document.getElementById("idealWeightDisplay");
    display.innerHTML = `
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Healthy BMI Range:</span>
                    <span class="font-medium">${idealWeight.bmiRange}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Robinson Formula:</span>
                    <span class="font-medium">${idealWeight.robinson}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Devine Formula:</span>
                    <span class="font-medium">${idealWeight.devine}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Miller Formula:</span>
                    <span class="font-medium">${idealWeight.miller}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Hamwi Formula:</span>
                    <span class="font-medium">${idealWeight.hamwi}</span>
                </div>
            </div>
        `;
  }

  displayCalorieNeeds(weightInKg, heightInCm, age, gender, activityLevel) {
    const calories = this.calculateCalorieNeeds(
      weightInKg,
      heightInCm,
      age,
      gender,
      activityLevel
    );

    const display = document.getElementById("calorieDisplay");
    display.innerHTML = `
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">BMR (Base):</span>
                    <span class="font-medium">${calories.bmr} cal/day</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Maintenance:</span>
                    <span class="font-medium">${calories.tdee} cal/day</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Weight Loss:</span>
                    <span class="font-medium text-red-600 dark:text-red-400">${calories.weightLoss} cal/day</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Weight Gain:</span>
                    <span class="font-medium text-green-600 dark:text-green-400">${calories.weightGain} cal/day</span>
                </div>
            </div>
        `;
  }

  loadBMIHistory() {
    const history = localStorage.getItem("bmiHistory");
    return history ? JSON.parse(history) : [];
  }

  saveBMIRecord(bmi, category, date = new Date()) {
    const record = {
      bmi: parseFloat(bmi),
      category,
      date: date.toISOString().split("T")[0],
      timestamp: date.getTime(),
    };

    this.bmiHistory.unshift(record);
    this.bmiHistory = this.bmiHistory.slice(0, 10);

    localStorage.setItem("bmiHistory", JSON.stringify(this.bmiHistory));
    this.displayBMIHistory();
  }

  displayBMIHistory() {
    const container = document.getElementById("bmiHistory");

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

  initializeDarkMode() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      this.updateDarkModeIcon(true);
    } else {
      document.documentElement.classList.remove("dark");
      this.updateDarkModeIcon(false);
    }
  }

  updateDarkModeIcon(isDark) {
    if (isDark) {
      this.darkModeIcon.setAttribute("data-lucide", "sun");
    } else {
      this.darkModeIcon.setAttribute("data-lucide", "moon");
    }
    // Re-initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  initializeFAQ() {
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach((question) => {
      question.addEventListener("click", (e) => {
        e.preventDefault();
        const answer = question.nextElementSibling;
        const icon = question.querySelector("i");

        // Close other open FAQs
        faqQuestions.forEach((otherQuestion) => {
          if (otherQuestion !== question) {
            const otherAnswer = otherQuestion.nextElementSibling;
            const otherIcon = otherQuestion.querySelector("i");
            if (otherAnswer) {
              otherAnswer.classList.add("hidden");
              otherQuestion.classList.remove("active");
              if (otherIcon) {
                otherIcon.style.transform = "rotate(0deg)";
              }
            }
          }
        });

        // Toggle current FAQ
        if (answer && answer.classList.contains("hidden")) {
          answer.classList.remove("hidden");
          question.classList.add("active");
          if (icon) {
            icon.style.transform = "rotate(180deg)";
          }
        } else if (answer) {
          answer.classList.add("hidden");
          question.classList.remove("active");
          if (icon) {
            icon.style.transform = "rotate(0deg)";
          }
        }
      });
    });
  }

  setupLoadingStates() {
    this.calculateBtn = document.getElementById("calculateBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.copyResultBtn = document.getElementById("copyResultBtn");
    this.shareResultBtn = document.getElementById("shareResultBtn");
    this.saveBMIBtn = document.getElementById("saveBMIBtn");
  }

  bindEvents() {
    // Form submission
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));

    // Reset button
    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.resetForm());
    }

    // Dark mode toggle
    if (this.darkModeToggle) {
      this.darkModeToggle.addEventListener("click", () =>
        this.toggleDarkMode()
      );
    }

    // Result buttons
    if (this.copyResultBtn) {
      this.copyResultBtn.addEventListener("click", () => this.copyResult());
    }
    if (this.shareResultBtn) {
      this.shareResultBtn.addEventListener("click", () => this.shareResult());
    }
    if (this.saveBMIBtn) {
      this.saveBMIBtn.addEventListener("click", () => this.saveBMI());
    }

    // Real-time input validation and calculations
    const inputs = this.form.querySelectorAll("input, select");
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.validateInput(input);
        this.updateLiveCalculations();
      });
      input.addEventListener("change", () => {
        this.updateLiveCalculations();
      });
    });
  }

  updateLiveCalculations() {
    if (this.isFormValid()) {
      const { heightInCm, weightInKg } = this.getMetricValues();
      const age = parseInt(document.getElementById("age").value);
      const gender = document.querySelector(
        'input[name="gender"]:checked'
      )?.value;
      const activityLevel = this.activityLevel.value;

      if (heightInCm && weightInKg && age && gender) {
        // Update ideal weight
        this.displayIdealWeight(heightInCm, gender);

        // Update calorie needs
        this.displayCalorieNeeds(
          weightInKg,
          heightInCm,
          age,
          gender,
          activityLevel
        );
      }
    }
  }

  isFormValid() {
    const { heightInCm, weightInKg } = this.getMetricValues();
    const age = parseInt(document.getElementById("age").value);
    const gender = document.querySelector('input[name="gender"]:checked');

    return (
      heightInCm &&
      weightInKg &&
      age &&
      gender &&
      heightInCm >= 50 &&
      heightInCm <= 300 &&
      weightInKg >= 9 &&
      weightInKg <= 227 &&
      age >= 15 &&
      age <= 120
    );
  }

  saveBMI() {
    if (this.currentResult) {
      this.saveBMIRecord(this.currentResult.bmi, this.currentResult.category);
      this.showNotification("BMI record saved successfully!", "success");
    }
  }

  initializeLucideIcons() {
    // Initialize Lucide icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.showLoading(this.calculateBtn);

    // Simulate calculation delay for better UX
    setTimeout(() => {
      this.calculateBMI();
      this.hideLoading(this.calculateBtn);
    }, 500);
  }

  validateForm() {
    const { heightInCm, weightInKg } = this.getMetricValues();
    const age = parseInt(document.getElementById("age").value);
    const gender = document.querySelector('input[name="gender"]:checked');

    if (!heightInCm || heightInCm < 50 || heightInCm > 300) {
      this.showError("Please enter a valid height (50-300 cm equivalent)");
      return false;
    }

    if (!weightInKg || weightInKg < 9 || weightInKg > 227) {
      this.showError("Please enter a valid weight (9-227 kg equivalent)");
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

  validateInput(input) {
    const value = parseFloat(input.value);

    input.classList.remove("border-red-500", "border-green-500");

    if (input.value && input.type === "number") {
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);

      if (isNaN(value) || (min && value < min) || (max && value > max)) {
        input.classList.add("border-red-500");
      } else {
        input.classList.add("border-green-500");
      }
    }
  }

  calculateBMI() {
    const { heightInCm, weightInKg } = this.getMetricValues();
    const height = heightInCm / 100; // Convert cm to m
    const age = parseInt(document.getElementById("age").value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const activityLevel = this.activityLevel.value;

    // Calculate BMI
    const bmi = weightInKg / (height * height);

    // Determine category and color
    const result = this.getBMICategory(bmi);

    // Display results
    this.displayResults(bmi, result, age, gender);

    // Update ideal weight and calorie displays
    this.displayIdealWeight(heightInCm, gender);
    this.displayCalorieNeeds(
      weightInKg,
      heightInCm,
      age,
      gender,
      activityLevel
    );
  }

  getBMICategory(bmi) {
    if (bmi < 18.5) {
      return {
        category: "Underweight",
        color: "blue",
        progressWidth: (bmi / 18.5) * 25,
        tips: "Consider consulting a healthcare provider about healthy weight gain strategies. Focus on nutrient-dense foods, strength training, and regular meals.",
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        category: "Normal Weight",
        color: "green",
        progressWidth: 25 + ((bmi - 18.5) / 6.5) * 25,
        tips: "Great job maintaining a healthy weight! Continue with regular exercise, balanced nutrition, and stay hydrated for optimal health.",
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        category: "Overweight",
        color: "yellow",
        progressWidth: 50 + ((bmi - 25) / 5) * 25,
        tips: "Consider gradual lifestyle changes including portion control, regular physical activity, and consulting a nutritionist for personalized advice.",
      };
    } else {
      return {
        category: "Obese",
        color: "red",
        progressWidth: 75 + Math.min(((bmi - 30) / 10) * 25, 25),
        tips: "Consult with a healthcare provider for a comprehensive weight management plan. Focus on sustainable lifestyle changes and professional guidance.",
      };
    }
  }

  displayResults(bmi, result, age, gender) {
    // Show results card with animation
    this.resultsCard.classList.remove("hidden");
    this.resultsCard.classList.add("results-enter");

    // Update BMI score
    document.getElementById("bmiScore").textContent = bmi.toFixed(1);
    document.getElementById("bmiScore").style.color = this.getColorForCategory(
      result.color
    );

    // Update category
    document.getElementById("bmiCategory").textContent = result.category;
    document.getElementById("bmiCategory").style.color =
      this.getColorForCategory(result.color);

    // Update progress bar
    const progressBar = document.getElementById("bmiProgress");
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

    // Update health tips
    document.getElementById("healthTips").textContent = result.tips;

    // Store result for copying/sharing
    this.currentResult = {
      bmi: bmi.toFixed(1),
      category: result.category,
      age,
      gender,
    };

    // Scroll to results
    this.resultsCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  getColorForCategory(colorName) {
    const colors = {
      blue: "#3b82f6",
      green: "#10b981",
      yellow: "#f59e0b",
      red: "#ef4444",
    };
    return colors[colorName] || "#6b7280";
  }

  resetForm() {
    this.form.reset();
    this.resultsCard.classList.add("hidden");

    // Reset input border colors
    const inputs = this.form.querySelectorAll("input");
    inputs.forEach((input) => {
      input.classList.remove("border-red-500", "border-green-500");
    });

    // Clear conversion displays
    document.getElementById("heightConversion").textContent = "";
    document.getElementById("weightConversion").textContent = "";

    // Reset placeholders
    this.updatePlaceholders();

    // Reset ideal weight and calorie displays
    document.getElementById("idealWeightDisplay").innerHTML =
      '<div class="text-sm text-gray-600 dark:text-gray-400">Enter your details to calculate</div>';
    document.getElementById("calorieDisplay").innerHTML =
      '<div class="text-sm text-gray-600 dark:text-gray-400">Calculate BMI to see calorie needs</div>';

    // Focus first input
    document.getElementById("height").focus();
  }

  toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    this.updateDarkModeIcon(isDark);
  }

  async copyResult() {
    if (!this.currentResult) return;

    const text = `My BMI Result:\nBMI: ${this.currentResult.bmi}\nCategory: ${this.currentResult.category}\nCalculated with Free BMI Calculator`;

    try {
      await navigator.clipboard.writeText(text);
      this.showNotification("Result copied to clipboard!", "success");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      this.showNotification("Result copied to clipboard!", "success");
    }
  }

  shareResult() {
    if (!this.currentResult) return;

    const text = `I just checked my BMI: ${this.currentResult.bmi} (${this.currentResult.category}) using this free BMI calculator!`;
    const url = window.location.href;

    if (navigator.share) {
      // Use native share API if available
      navigator.share({
        title: "BMI Calculator Result",
        text: text,
        url: url,
      });
    } else {
      // Fallback to social media links
      this.showShareModal(text, url);
    }
  }

  showShareModal(text, url) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
                <h3 class="text-lg font-semibold mb-4">Share Your Result</h3>
                <div class="space-y-3">
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      text
                    )}&url=${encodeURIComponent(url)}" 
                       target="_blank" 
                       class="flex items-center space-x-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <span class="text-blue-600 dark:text-blue-400">🐦</span>
                        <span>Share on Twitter</span>
                    </a>
                    <a href="https://wa.me/?text=${encodeURIComponent(
                      text + " " + url
                    )}" 
                       target="_blank"
                       class="flex items-center space-x-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                        <span class="text-green-600 dark:text-green-400">📱</span>
                        <span>Share on WhatsApp</span>
                    </a>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  showLoading(button) {
    if (button) {
      button.classList.add("loading");
      button.disabled = true;
    }
  }

  hideLoading(button) {
    if (button) {
      button.classList.remove("loading");
      button.disabled = false;
    }
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BMICalculator();

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K to focus height input
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("height").focus();
    }

    // Ctrl/Cmd + Enter to calculate
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      const calculateBtn = document.getElementById("calculateBtn");
      if (calculateBtn) calculateBtn.click();
    }

    // Ctrl/Cmd + R to reset (prevent page reload)
    if ((e.ctrlKey || e.metaKey) && e.key === "r") {
      e.preventDefault();
      const resetBtn = document.getElementById("resetBtn");
      if (resetBtn) resetBtn.click();
    }

    // Ctrl/Cmd + D to toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault();
      const darkModeToggle = document.getElementById("darkModeToggle");
      if (darkModeToggle) darkModeToggle.click();
    }
  });

  // Service Worker registration (for PWA functionality)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("assets/js/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Form persistence (save form data in localStorage)
class FormPersistence {
  static save() {
    const formData = {
      height: document.getElementById("height").value,
      weight: document.getElementById("weight").value,
      age: document.getElementById("age").value,
      gender: document.querySelector('input[name="gender"]:checked')?.value,
      heightUnit: document.getElementById("heightUnit").value,
      weightUnit: document.getElementById("weightUnit").value,
      activityLevel: document.getElementById("activityLevel").value,
    };
    localStorage.setItem("bmiFormData", JSON.stringify(formData));
  }

  static restore() {
    const savedData = localStorage.getItem("bmiFormData");
    if (savedData) {
      try {
        const formData = JSON.parse(savedData);

        if (formData.height)
          document.getElementById("height").value = formData.height;
        if (formData.weight)
          document.getElementById("weight").value = formData.weight;
        if (formData.age) document.getElementById("age").value = formData.age;
        if (formData.heightUnit)
          document.getElementById("heightUnit").value = formData.heightUnit;
        if (formData.weightUnit)
          document.getElementById("weightUnit").value = formData.weightUnit;
        if (formData.activityLevel)
          document.getElementById("activityLevel").value =
            formData.activityLevel;
        if (formData.gender) {
          const genderRadio = document.querySelector(
            `input[name="gender"][value="${formData.gender}"]`
          );
          if (genderRadio) genderRadio.checked = true;
        }
      } catch (e) {
        console.log("Error restoring form data:", e);
      }
    }
  }

  static clear() {
    localStorage.removeItem("bmiFormData");
  }
}

// Auto-save form data
document.addEventListener("DOMContentLoaded", () => {
  FormPersistence.restore();

  const inputs = document.querySelectorAll("#bmiForm input, #bmiForm select");
  inputs.forEach((input) => {
    input.addEventListener("input", FormPersistence.save);
    input.addEventListener("change", FormPersistence.save);
  });
});

// Unit Converter Class
class UnitConverter {
  // Precise height conversion factors (to centimeters)
  static heightFactors = {
    cm: 1,
    m: 100,
    mm: 0.1,
    ft: 30.48,
    in: 2.54,
    ftIn: "special", // Special handling for combined feet+inches format
  };

  // Precise weight conversion factors (to kilograms)
  static weightFactors = {
    kg: 1,
    g: 0.001,
    lbs: 0.453592,
    oz: 0.0283495,
    st: 6.35029,
    stLb: "special", // Special handling for combined stones+pounds format
  };

  // Convert height with precise calculations
  static convertHeight(value, fromUnit, toUnit) {
    if (!value || isNaN(value) || value <= 0) return "-";

    // Convert to cm first (our base unit)
    let valueInCm;
    if (fromUnit === "cm") {
      valueInCm = value;
    } else if (fromUnit === "m") {
      valueInCm = value * 100;
    } else if (fromUnit === "mm") {
      valueInCm = value * 0.1;
    } else if (fromUnit === "ft") {
      valueInCm = value * 30.48;
    } else if (fromUnit === "in") {
      valueInCm = value * 2.54;
    }

    // Convert from cm to target unit with better formatting
    if (toUnit === "cm") {
      // Format differently based on the value
      return valueInCm < 10
        ? valueInCm.toFixed(2) + " cm"
        : valueInCm < 100
        ? valueInCm.toFixed(1) + " cm"
        : Math.round(valueInCm) + " cm";
    } else if (toUnit === "m") {
      return (valueInCm / 100).toFixed(3) + " m";
    } else if (toUnit === "mm") {
      return Math.round(valueInCm * 10) + " mm";
    } else if (toUnit === "ft") {
      return (valueInCm / 30.48).toFixed(2) + " ft";
    } else if (toUnit === "in") {
      return (valueInCm / 2.54).toFixed(1) + " in";
    } else if (toUnit === "ftIn") {
      const inches = valueInCm / 2.54;
      const feet = Math.floor(inches / 12);
      const remainingInches = +(inches % 12).toFixed(1);
      return `${feet}' ${remainingInches}"`;
    }

    return "-";
  }

  // Convert weight with precise calculations
  static convertWeight(value, fromUnit, toUnit) {
    if (!value || isNaN(value) || value <= 0) return "-";

    // Convert to kg first (our base unit)
    let valueInKg;
    if (fromUnit === "kg") {
      valueInKg = value;
    } else if (fromUnit === "g") {
      valueInKg = value * 0.001;
    } else if (fromUnit === "lbs") {
      valueInKg = value * 0.453592;
    } else if (fromUnit === "oz") {
      valueInKg = value * 0.0283495;
    } else if (fromUnit === "st") {
      valueInKg = value * 6.35029;
    }

    // Convert from kg to target unit with better formatting
    if (toUnit === "kg") {
      // Format differently based on the value
      return valueInKg < 1
        ? valueInKg.toFixed(3) + " kg"
        : valueInKg < 10
        ? valueInKg.toFixed(2) + " kg"
        : valueInKg < 100
        ? valueInKg.toFixed(1) + " kg"
        : Math.round(valueInKg) + " kg";
    } else if (toUnit === "g") {
      const grams = valueInKg * 1000;
      return grams < 10
        ? grams.toFixed(2) + " g"
        : grams < 100
        ? grams.toFixed(1) + " g"
        : Math.round(grams) + " g";
    } else if (toUnit === "lbs") {
      const lbs = valueInKg / 0.453592;
      return lbs < 10
        ? lbs.toFixed(2) + " lbs"
        : lbs < 100
        ? lbs.toFixed(1) + " lbs"
        : Math.round(lbs) + " lbs";
    } else if (toUnit === "oz") {
      return (valueInKg / 0.0283495).toFixed(1) + " oz";
    } else if (toUnit === "st") {
      return (valueInKg / 6.35029).toFixed(2) + " st";
    } else if (toUnit === "stLb") {
      const totalPounds = valueInKg / 0.453592;
      const stones = Math.floor(totalPounds / 14);
      const pounds = +(totalPounds % 14).toFixed(1);
      return `${stones} st ${pounds} lb`;
    }

    return "-";
  }

  // Update the height conversion result
  static updateHeightResult() {
    const value = parseFloat(document.getElementById("heightValueFrom").value);
    const fromUnit = document.getElementById("heightUnitFrom").value;
    const toUnit = document.getElementById("heightUnitTo").value;
    const resultElement = document.getElementById("heightResultValue");

    if (!value || isNaN(value) || value <= 0) {
      resultElement.value = "-";
      return;
    }

    const result = this.convertHeight(value, fromUnit, toUnit);
    resultElement.value = result;

    // Add a subtle animation to highlight the change
    resultElement.classList.add("pulse-animation");
    setTimeout(() => {
      resultElement.classList.remove("pulse-animation");
    }, 500);
  }

  // Update the weight conversion result
  static updateWeightResult() {
    const value = parseFloat(document.getElementById("weightValueFrom").value);
    const fromUnit = document.getElementById("weightUnitFrom").value;
    const toUnit = document.getElementById("weightUnitTo").value;
    const resultElement = document.getElementById("weightResultValue");

    if (!value || isNaN(value) || value <= 0) {
      resultElement.value = "-";
      return;
    }

    const result = this.convertWeight(value, fromUnit, toUnit);
    resultElement.value = result;

    // Add a subtle animation to highlight the change
    resultElement.classList.add("pulse-animation");
    setTimeout(() => {
      resultElement.classList.remove("pulse-animation");
    }, 500);
  }

  // Swap height units
  static swapHeightUnits() {
    const fromUnitSelect = document.getElementById("heightUnitFrom");
    const toUnitSelect = document.getElementById("heightUnitTo");

    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    // Don't swap if either unit is a special combined format
    if (fromUnit === "ftIn" || toUnit === "ftIn") {
      return;
    }

    fromUnitSelect.value = toUnit;
    toUnitSelect.value = fromUnit;

    this.updateHeightResult();
  }

  // Swap weight units
  static swapWeightUnits() {
    const fromUnitSelect = document.getElementById("weightUnitFrom");
    const toUnitSelect = document.getElementById("weightUnitTo");

    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    // Don't swap if either unit is a special combined format
    if (fromUnit === "stLb" || toUnit === "stLb") {
      return;
    }

    fromUnitSelect.value = toUnit;
    toUnitSelect.value = fromUnit;

    this.updateWeightResult();
  }

  // Initialize the converters
  static initConverters() {
    // Height converter elements
    const heightValueFrom = document.getElementById("heightValueFrom");
    const heightUnitFrom = document.getElementById("heightUnitFrom");
    const heightUnitTo = document.getElementById("heightUnitTo");
    const heightResultValue = document.getElementById("heightResultValue");
    const swapHeightUnitsBtn = document.getElementById("swapHeightUnitsBtn");

    // Weight converter elements
    const weightValueFrom = document.getElementById("weightValueFrom");
    const weightUnitFrom = document.getElementById("weightUnitFrom");
    const weightUnitTo = document.getElementById("weightUnitTo");
    const weightResultValue = document.getElementById("weightResultValue");
    const swapWeightUnitsBtn = document.getElementById("swapWeightUnitsBtn");

    // Height swap button
    if (swapHeightUnitsBtn) {
      swapHeightUnitsBtn.addEventListener("click", () => {
        this.swapHeightUnits();
      });
    }

    // Real-time height conversion
    [heightValueFrom, heightUnitFrom, heightUnitTo].forEach((el) => {
      if (el) {
        el.addEventListener("input", () => {
          this.updateHeightResult();
        });

        // Also update on change for better user experience
        el.addEventListener("change", () => {
          this.updateHeightResult();
        });
      }
    });

    // Weight swap button
    if (swapWeightUnitsBtn) {
      swapWeightUnitsBtn.addEventListener("click", () => {
        this.swapWeightUnits();
      });
    }

    // Real-time weight conversion
    [weightValueFrom, weightUnitFrom, weightUnitTo].forEach((el) => {
      if (el) {
        el.addEventListener("input", () => {
          this.updateWeightResult();
        });

        // Also update on change for better user experience
        el.addEventListener("change", () => {
          this.updateWeightResult();
        });
      }
    });

    // Clear values and just show placeholder text
    if (heightValueFrom && heightResultValue) {
      heightValueFrom.value = "";
      heightResultValue.value = "";
    }

    if (weightValueFrom && weightResultValue) {
      weightValueFrom.value = "";
      weightResultValue.value = "";
    }
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  FormPersistence.restore();

  const inputs = document.querySelectorAll("#bmiForm input, #bmiForm select");
  inputs.forEach((input) => {
    input.addEventListener("input", FormPersistence.save);
    input.addEventListener("change", FormPersistence.save);
  });

  // Initialize unit converters
  UnitConverter.initConverters();
});

// Export for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BMICalculator, FormPersistence, UnitConverter };
}
