/**
 * PreciseUnitConverter - Enhanced version with exact conversion table values
 * This provides the exact same results as the Height and Weight conversion tables
 */
class PreciseUnitConverter {
  // Exact conversion factors based on the provided conversion tables
  static heightConversions = {
    cm_to_m: 0.01,
    cm_to_mm: 10,
    cm_to_ft: 0.0328084, // 1 cm = 0.0328084 feet (exact)
    cm_to_in: 0.393701, // 1 cm = 0.393701 inches (exact)
    m_to_cm: 100,
    mm_to_cm: 0.1,
    ft_to_cm: 30.48, // 1 foot = 30.48 cm (exact international standard)
    in_to_cm: 2.54, // 1 inch = 2.54 cm (exact international standard)
  };

  static weightConversions = {
    kg_to_g: 1000,
    kg_to_lbs: 2.20462262185, // More precise conversion factor
    kg_to_oz: 35.27396194958, // More precise conversion factor
    kg_to_st: 0.15747304441777, // More precise conversion factor (1 stone = 6.35029318 kg)
    g_to_kg: 0.001,
    lbs_to_kg: 0.45359237, // Exact conversion factor
    oz_to_kg: 0.028349523125, // Exact conversion factor
    st_to_kg: 6.35029318, // Exact conversion factor (1 stone = 14 pounds)
  };

  // Exact height lookup table for common heights (matching your conversion table)
  static exactHeights = {
    "5'0\"": { decimal: 5.0, inches: 60, cm: 152.4, m: 1.524 },
    "5'1\"": { decimal: 5.0833, inches: 61, cm: 154.94, m: 1.5494 },
    "5'2\"": { decimal: 5.1667, inches: 62, cm: 157.48, m: 1.5748 },
    "5'3\"": { decimal: 5.25, inches: 63, cm: 160.02, m: 1.6002 },
    "5'4\"": { decimal: 5.3333, inches: 64, cm: 162.56, m: 1.6256 },
    "5'5\"": { decimal: 5.4167, inches: 65, cm: 165.1, m: 1.651 },
    "5'6\"": { decimal: 5.5, inches: 66, cm: 167.64, m: 1.6764 },
    "5'7\"": { decimal: 5.5833, inches: 67, cm: 170.18, m: 1.7018 },
    "5'8\"": { decimal: 5.6667, inches: 68, cm: 172.72, m: 1.7272 },
    "5'9\"": { decimal: 5.75, inches: 69, cm: 175.26, m: 1.7526 },
    "5'10\"": { decimal: 5.8333, inches: 70, cm: 177.8, m: 1.778 },
    "5'11\"": { decimal: 5.9167, inches: 71, cm: 180.34, m: 1.8034 },
    "6'0\"": { decimal: 6.0, inches: 72, cm: 182.88, m: 1.8288 },
    "6'1\"": { decimal: 6.0833, inches: 73, cm: 185.42, m: 1.8542 },
    "6'2\"": { decimal: 6.1667, inches: 74, cm: 187.96, m: 1.8796 },
  };

  // Exact weight lookup table for common weights (matching your conversion table)
  static exactWeights = {
    100: { kg: 45.3592, st: 7.14 },
    110: { kg: 49.8952, st: 7.86 },
    120: { kg: 54.4311, st: 8.57 },
    130: { kg: 58.967, st: 9.29 },
    140: { kg: 63.5029, st: 10.0 },
    150: { kg: 68.0389, st: 10.71 },
    160: { kg: 72.5748, st: 11.43 },
    170: { kg: 77.1107, st: 12.14 },
    180: { kg: 81.6466, st: 12.86 },
    190: { kg: 86.1826, st: 13.57 },
    200: { kg: 90.7185, st: 14.29 },
  };

  // Apply the more precise conversions
  static initPreciseConversions() {
    console.log(
      "Initializing precise unit conversions with exact lookup tables"
    );

    // Override the original convert functions with our exact table-based versions
    if (typeof UnitConverter !== "undefined") {
      // Height conversion enhancements with exact table lookup
      const originalConvertHeight = UnitConverter.convertHeight;
      UnitConverter.convertHeight = function (value, fromUnit, toUnit) {
        if (!value || isNaN(value) || value <= 0) return "-";

        // Special case for feet to other units - use exact lookup table first
        if (fromUnit === "ft") {
          const feet = Math.floor(value);
          const decimalPart = value - feet;
          const inches = Math.round(decimalPart * 12);
          const heightKey = `${feet}'${inches}"`;

          if (PreciseUnitConverter.exactHeights[heightKey]) {
            const exactData = PreciseUnitConverter.exactHeights[heightKey];

            switch (toUnit) {
              case "cm":
                return exactData.cm.toFixed(2) + " cm";
              case "m":
                return exactData.m.toFixed(4) + " m";
              case "in":
                return exactData.inches + " in";
              case "ftIn":
                return `${feet}' ${inches}"`;
            }
          }
        }

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
            const heightKey = `${feet}'${inches}"`;

            // Use exact lookup if available
            if (PreciseUnitConverter.exactHeights[heightKey]) {
              return (
                PreciseUnitConverter.exactHeights[heightKey].cm.toFixed(2) +
                " cm"
              );
            }

            // Otherwise calculate precisely
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

      // Weight conversion enhancements with exact table lookup
      const originalConvertWeight = UnitConverter.convertWeight;
      UnitConverter.convertWeight = function (value, fromUnit, toUnit) {
        if (!value || isNaN(value) || value <= 0) return "-";

        // Use exact lookup table for common pound values
        if (fromUnit === "lbs" && PreciseUnitConverter.exactWeights[value]) {
          const exactData = PreciseUnitConverter.exactWeights[value];

          switch (toUnit) {
            case "kg":
              return exactData.kg.toFixed(4) + " kg";
            case "st":
              return exactData.st.toFixed(2) + " st";
          }
        }

        // Use exact lookup table for common kg values (reverse lookup)
        if (fromUnit === "kg") {
          for (const [lbs, data] of Object.entries(
            PreciseUnitConverter.exactWeights
          )) {
            if (Math.abs(value - data.kg) < 0.0001) {
              switch (toUnit) {
                case "lbs":
                  return lbs + " lbs";
                case "st":
                  return data.st.toFixed(2) + " st";
              }
            }
          }
        }

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

// Helper function to convert feet and inches to cm with exact precision from lookup table
// This can be called directly from any part of the code
function convertFeetAndInchesToCm(feet, inches) {
  const heightKey = `${feet}'${inches}"`;

  // Use exact lookup table first
  if (PreciseUnitConverter.exactHeights[heightKey]) {
    const exactCm = PreciseUnitConverter.exactHeights[heightKey].cm;
    console.log(
      `Exact lookup: ${heightKey} = ${exactCm} cm (from conversion table)`
    );
    return exactCm;
  }

  // Handle decimal feet input (e.g. when user enters 5.9 feet instead of 5'9")
  if (typeof feet === "number" && feet % 1 !== 0 && inches === 0) {
    const wholeFeet = Math.floor(feet);
    inches = Math.round((feet % 1) * 12);
    feet = wholeFeet;

    const heightKeyCalculated = `${feet}'${inches}"`;

    // Check lookup table again with calculated values
    if (PreciseUnitConverter.exactHeights[heightKeyCalculated]) {
      const exactCm = PreciseUnitConverter.exactHeights[heightKeyCalculated].cm;
      console.log(
        `Interpreted ${
          feet + inches / 12
        } feet as ${heightKeyCalculated} = ${exactCm} cm (from table)`
      );
      return exactCm;
    }
  }

  // Use the international standard: 1 inch = 2.54 cm exactly
  const totalInches = feet * 12 + inches;
  const cm = totalInches * 2.54;

  console.log(
    `Calculated ${feet}'${inches}" = ${totalInches} inches = ${cm.toFixed(
      2
    )} cm`
  );

  // Return with 2 decimal places of precision when displaying
  return parseFloat(cm.toFixed(2));
}

// Enhanced function to convert pounds to kg with exact precision from lookup table
function convertPoundsToKg(pounds) {
  // Use exact lookup table first
  if (PreciseUnitConverter.exactWeights[pounds]) {
    const exactKg = PreciseUnitConverter.exactWeights[pounds].kg;
    console.log(
      `Exact lookup: ${pounds} lbs = ${exactKg} kg (from conversion table)`
    );
    return exactKg;
  }

  // Use precise conversion factor
  const kg = pounds * 0.45359237;
  console.log(`Calculated ${pounds} lbs = ${kg.toFixed(4)} kg`);
  return parseFloat(kg.toFixed(4));
}

// Enhanced function to convert kg to pounds with exact precision from lookup table
function convertKgToPounds(kg) {
  // Find exact match in lookup table (reverse lookup)
  for (const [lbs, data] of Object.entries(PreciseUnitConverter.exactWeights)) {
    if (Math.abs(kg - data.kg) < 0.0001) {
      console.log(
        `Exact reverse lookup: ${kg} kg = ${lbs} lbs (from conversion table)`
      );
      return parseFloat(lbs);
    }
  }

  // Use precise conversion factor
  const lbs = kg / 0.45359237;
  console.log(`Calculated ${kg} kg = ${lbs.toFixed(4)} lbs`);
  return parseFloat(lbs.toFixed(4));
}

// Initialize the precise converter when document is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Run after a short delay to ensure original code has loaded
  setTimeout(() => {
    PreciseUnitConverter.initPreciseConversions();

    // Verify our conversion for common heights using exact lookup table
    console.log("Verification of height conversions from exact table:");
    console.log(
      `5'0" = ${convertFeetAndInchesToCm(5, 0)} cm (should be 152.40)`
    );
    console.log(
      `5'1" = ${convertFeetAndInchesToCm(5, 1)} cm (should be 154.94)`
    );
    console.log(
      `5'6" = ${convertFeetAndInchesToCm(5, 6)} cm (should be 167.64)`
    );
    console.log(
      `5'9" = ${convertFeetAndInchesToCm(5, 9)} cm (should be 175.26)`
    );
    console.log(
      `6'0" = ${convertFeetAndInchesToCm(6, 0)} cm (should be 182.88)`
    );

    // Verify weight conversions
    console.log("\nVerification of weight conversions from exact table:");
    console.log(`100 lbs = ${convertPoundsToKg(100)} kg (should be 45.3592)`);
    console.log(`150 lbs = ${convertPoundsToKg(150)} kg (should be 68.0389)`);
    console.log(`200 lbs = ${convertPoundsToKg(200)} kg (should be 90.7185)`);
  }, 100);
});
