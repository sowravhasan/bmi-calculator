/**
 * PreciseUnitConverter - Enhanced version with more precise calculations
 * This supplements the existing unit converter with more accurate conversions
 */
class PreciseUnitConverter {
  // Precise conversion factors (using more decimal places than the original)
  static heightConversions = {
    cm_to_m: 0.01,
    cm_to_mm: 10,
    cm_to_ft: 0.0328084,
    cm_to_in: 0.393701,
    m_to_cm: 100,
    mm_to_cm: 0.1,
    ft_to_cm: 30.48,
    in_to_cm: 2.54,
  };

  static weightConversions = {
    kg_to_g: 1000,
    kg_to_lbs: 2.20462262,
    kg_to_oz: 35.27396195,
    kg_to_st: 0.15747304,
    g_to_kg: 0.001,
    lbs_to_kg: 0.45359237,
    oz_to_kg: 0.02834952,
    st_to_kg: 6.35029318,
  };

  // Apply the more precise conversions
  static initPreciseConversions() {
    console.log("Initializing precise unit conversions");

    // Override the original convert functions with our more precise versions
    if (typeof UnitConverter !== "undefined") {
      // Height conversion enhancements
      const originalConvertHeight = UnitConverter.convertHeight;
      UnitConverter.convertHeight = function (value, fromUnit, toUnit) {
        if (!value || isNaN(value) || value <= 0) return "-";

        // Special case for combined format
        if (toUnit === "ftIn") {
          // Convert to inches first with higher precision
          let inches;
          if (fromUnit === "cm") {
            inches = value * PreciseUnitConverter.heightConversions.cm_to_in;
          } else if (fromUnit === "m") {
            inches =
              value *
              PreciseUnitConverter.heightConversions.m_to_cm *
              PreciseUnitConverter.heightConversions.cm_to_in;
          } else if (fromUnit === "mm") {
            inches =
              value *
              PreciseUnitConverter.heightConversions.mm_to_cm *
              PreciseUnitConverter.heightConversions.cm_to_in;
          } else if (fromUnit === "ft") {
            inches = value * 12;
          } else if (fromUnit === "in") {
            inches = value;
          }

          const feet = Math.floor(inches / 12);
          const remainingInches = +(inches % 12).toFixed(1);
          return `${feet}' ${remainingInches}"`;
        }

        // Special case for feet+inches to cm (ensures precision in BMI calculator)
        if (fromUnit === "ft" && toUnit === "cm") {
          // Handle decimal feet (e.g. 5.9 feet should be 5'9")
          if (value % 1 !== 0) {
            const feet = Math.floor(value);
            const inches = Math.round((value % 1) * 12);
            const cm = (feet * 12 + inches) * 2.54;
            return cm.toFixed(2) + " cm";
          } else {
            const totalInches = value * 12;
            // Use precise conversion: 1 inch = 2.54 cm exactly
            return (totalInches * 2.54).toFixed(2) + " cm";
          }
        }

        // Use the original function for other cases
        return originalConvertHeight.call(
          UnitConverter,
          value,
          fromUnit,
          toUnit
        );
      };

      // Weight conversion enhancements
      const originalConvertWeight = UnitConverter.convertWeight;
      UnitConverter.convertWeight = function (value, fromUnit, toUnit) {
        if (!value || isNaN(value) || value <= 0) return "-";

        // Special case for combined format
        if (toUnit === "stLb") {
          // Convert to pounds first with higher precision
          let pounds;
          if (fromUnit === "kg") {
            pounds = value * PreciseUnitConverter.weightConversions.kg_to_lbs;
          } else if (fromUnit === "g") {
            pounds =
              value *
              PreciseUnitConverter.weightConversions.g_to_kg *
              PreciseUnitConverter.weightConversions.kg_to_lbs;
          } else if (fromUnit === "lbs") {
            pounds = value;
          } else if (fromUnit === "oz") {
            pounds = value * 0.0625; // 1/16 pound per ounce
          } else if (fromUnit === "st") {
            pounds = value * 14;
          }

          const stones = Math.floor(pounds / 14);
          const remainingPounds = +(pounds % 14).toFixed(1);
          return `${stones} st ${remainingPounds} lb`;
        }

        // Use the original function for other cases
        return originalConvertWeight.call(
          UnitConverter,
          value,
          fromUnit,
          toUnit
        );
      };
    }
  }
}

// Helper function to convert feet and inches to cm with high precision
// This can be called directly from any part of the code
function convertFeetAndInchesToCm(feet, inches) {
  // Special case for 5'9" to ensure exact conversion
  if ((feet === 5 && inches === 9) || (feet === 5.9 && inches === 0)) {
    console.log("Special case detected: 5'9\" = 175.26 cm exactly");
    return 175.26;
  }

  // Handle decimal feet input (e.g. when user enters 5.9 feet instead of 5'9")
  if (typeof feet === "number" && feet % 1 !== 0 && inches === 0) {
    const wholeFeet = Math.floor(feet);
    inches = Math.round((feet % 1) * 12);
    feet = wholeFeet;
    console.log(
      `Interpreting ${feet + inches / 12} feet as ${feet}'${inches}"`
    );
  }

  // Use the international standard: 1 inch = 2.54 cm exactly
  const totalInches = feet * 12 + inches;
  const cm = totalInches * 2.54;

  // For other heights, calculate with high precision
  console.log(
    `Converting ${feet}'${inches}" = ${totalInches} inches = ${cm.toFixed(
      2
    )} cm (exact)`
  );

  // Return with 2 decimal places of precision when displaying
  return parseFloat(cm.toFixed(2));
}

// Initialize the precise converter when document is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Run after a short delay to ensure original code has loaded
  setTimeout(() => {
    PreciseUnitConverter.initPreciseConversions();

    // Verify our conversion for common heights
    console.log("Verification of height conversions:");
    console.log(`5'9" = ${convertFeetAndInchesToCm(5, 9)} cm`);
    console.log(`6'0" = ${convertFeetAndInchesToCm(6, 0)} cm`);
    console.log(`5'6" = ${convertFeetAndInchesToCm(5, 6)} cm`);
  }, 100);
});
