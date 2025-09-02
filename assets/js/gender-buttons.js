// Add additional event handler for gender button clicks
document.addEventListener("DOMContentLoaded", function () {
  const genderMaleBtn = document.getElementById("genderMaleBtn");
  const genderFemaleBtn = document.getElementById("genderFemaleBtn");
  const genderInput = document.getElementById("genderInput");

  // Function to handle gender button clicks
  function handleGenderButtonClick(gender) {
    // Update the hidden input value
    genderInput.value = gender;

    // Update button styling with smoother transition
    if (gender === "male") {
      // Remove selected class from female button
      genderFemaleBtn.classList.remove("selected");

      // Reset female button styles
      genderFemaleBtn.style.backgroundColor = "";
      genderFemaleBtn.style.color = "";

      // Explicitly set text color for the deselected female button in both light and dark modes
      const femaleIcon = genderFemaleBtn.querySelector("i");
      const femaleText = genderFemaleBtn.querySelector("span");

      if (femaleIcon) femaleIcon.style.color = "";
      if (femaleText) femaleText.style.color = "";

      // Add selected class to male button
      genderMaleBtn.classList.add("selected");

      // Apply inline style with a slight delay to ensure smooth transition
      setTimeout(() => {
        genderMaleBtn.style.backgroundColor = "rgba(5, 150, 105, 0.95)";
        genderMaleBtn.style.color = "#ffffff";

        // Also ensure child elements transition smoothly
        const maleIcon = genderMaleBtn.querySelector("i");
        const maleText = genderMaleBtn.querySelector("span");

        if (maleIcon) maleIcon.style.color = "#ffffff";
        if (maleText) maleText.style.color = "#ffffff";
      }, 10);
    } else {
      // Remove selected class from male button
      genderMaleBtn.classList.remove("selected");

      // Reset male button styles
      genderMaleBtn.style.backgroundColor = "";
      genderMaleBtn.style.color = "";

      // Explicitly set text color for the deselected male button in both light and dark modes
      const maleIcon = genderMaleBtn.querySelector("i");
      const maleText = genderMaleBtn.querySelector("span");

      if (maleIcon) maleIcon.style.color = "";
      if (maleText) maleText.style.color = "";

      // Add selected class to female button
      genderFemaleBtn.classList.add("selected");

      // Apply inline style with a slight delay to ensure smooth transition
      setTimeout(() => {
        genderFemaleBtn.style.backgroundColor = "rgba(5, 150, 105, 0.95)";
        genderFemaleBtn.style.color = "#ffffff";

        // Also ensure child elements transition smoothly
        const femaleIcon = genderFemaleBtn.querySelector("i");
        const femaleText = genderFemaleBtn.querySelector("span");

        if (femaleIcon) femaleIcon.style.color = "#ffffff";
        if (femaleText) femaleText.style.color = "#ffffff";
      }, 10);
    }

    // Trigger change event for live calculations
    const event = new Event("change");
    genderInput.dispatchEvent(event);

    // Console log for debugging
    console.log("Gender selected:", gender);
    console.log(
      "Male button has 'selected' class:",
      genderMaleBtn.classList.contains("selected")
    );
    console.log(
      "Female button has 'selected' class:",
      genderFemaleBtn.classList.contains("selected")
    );

    // Log the computed styles to confirm the background is applied
    console.log(
      "Male button background:",
      window.getComputedStyle(genderMaleBtn).backgroundColor
    );
    console.log(
      "Female button background:",
      window.getComputedStyle(genderFemaleBtn).backgroundColor
    );
  }

  // Add click event listeners to gender buttons
  if (genderMaleBtn) {
    genderMaleBtn.addEventListener("click", function () {
      handleGenderButtonClick("male");
    });
  }

  if (genderFemaleBtn) {
    genderFemaleBtn.addEventListener("click", function () {
      handleGenderButtonClick("female");
    });
  }
});
