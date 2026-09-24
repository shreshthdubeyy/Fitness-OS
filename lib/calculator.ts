import {
  FitnessInput,
  FitnessResults,
  ActivityLevel,
  Goal,
  GoalEngineMetrics,
  SupplementReferences,
  BodyWeightHeuristics,
} from './types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export const PROTEIN_RATES: Record<Goal, number> = {
  lose: 1.8,
  maintain: 1.5,
  gain: 2.0,
  recomp: 2.2,
};

/**
 * Calculates BMI (kg / m²)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * Returns category based on standard BMI thresholds
 */
export function getBMICategory(
  bmi: number
): 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese' {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25.0) return 'Normal weight';
  if (bmi < 30.0) return 'Overweight';
  return 'Obese';
}

/**
 * Calculates BMR (Resting Calories) using Mifflin-St Jeor Equation
 * Male = 10W + 6.25H - 5A + 5
 * Female = 10W + 6.25H - 5A - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return Math.round(bmr);
}

/**
 * Calculates TDEE (Daily Energy Burn)
 */
export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates Ideal Weight Range based on healthy BMI (18.5 - 24.9)
 */
export function calculateIdealWeight(heightCm: number): {
  minKg: number;
  maxKg: number;
} {
  if (heightCm <= 0) return { minKg: 0, maxKg: 0 };
  const heightM = heightCm / 100;
  const heightSq = heightM * heightM;
  return {
    minKg: Number((18.5 * heightSq).toFixed(1)),
    maxKg: Number((24.9 * heightSq).toFixed(1)),
  };
}

/**
 * Calculates Goal Engine metrics with STRICT DIRECTIONAL LOGIC
 * If currentWeight > targetWeight -> Deficit (Weight Loss / Recomp)
 * If targetWeight > currentWeight -> Surplus (Weight Gain / Muscle Building)
 */
export function calculateGoalEngine(input: FitnessInput, tdee: number): GoalEngineMetrics {
  const { weightKg, targetWeightKg, goalWeeks = 12, nutritionRatio = 0.5, gender } = input;

  const validWeeks = Math.max(1, goalWeeks);
  const isLoss = weightKg > targetWeightKg;
  const weightToLoseKg = isLoss ? Number((weightKg - targetWeightKg).toFixed(1)) : 0;
  
  // 1 kg body fat ≈ 7,700 kcal
  const totalDeficitKcal = Math.round(weightToLoseKg * 7700);
  const weeklyDeficitKcal = Math.round(totalDeficitKcal / validWeeks);
  const dailyDeficitKcal = Math.round(weeklyDeficitKcal / 7);

  // Nutrition vs Activity ratio split
  const nutritionDeficitKcal = Math.round(dailyDeficitKcal * nutritionRatio);
  const activityDeficitKcal = Math.round(dailyDeficitKcal * (1 - nutritionRatio));

  const weeklyLossKg = Number((weightToLoseKg / validWeeks).toFixed(2));
  const weeklyLossPercent = weightKg > 0 ? Number(((weeklyLossKg / weightKg) * 100).toFixed(2)) : 0;

  const isAggressive = weeklyLossPercent > 1.0;

  // Calorie floor validation
  const minCalorieFloor = gender === 'male' ? 1500 : 1200;
  const rawTargetCalories = tdee - dailyDeficitKcal;

  let safetyWarning: string | null = null;
  if (isAggressive) {
    const recommendedWeeks = Math.ceil(weightToLoseKg / (weightKg * 0.0075));
    safetyWarning = `Your selected timeline requires losing ${weeklyLossPercent}% of body weight per week. To protect muscle and metabolism, extend your timeline to ~${recommendedWeeks} weeks.`;
  } else if (rawTargetCalories < minCalorieFloor && isLoss) {
    safetyWarning = `Daily calorie target falls below the safe minimum (${minCalorieFloor} kcal/day). Increase exercise activity or extend your timeline to avoid metabolic slowing.`;
  }

  const suggestedSteps = activityDeficitKcal > 350
    ? '10,000–12,000 steps + 45 min workout'
    : activityDeficitKcal > 200
    ? '8,000–10,000 steps + 30 min workout'
    : '6,000–8,000 steps / 20 min active walk';

  return {
    weightToLoseKg,
    totalDeficitKcal,
    weeklyDeficitKcal,
    dailyDeficitKcal,
    nutritionDeficitKcal,
    activityDeficitKcal,
    weeklyLossKg,
    weeklyLossPercent,
    isAggressive,
    safetyWarning,
    suggestedSteps,
  };
}

/**
 * Calculates Supplement References
 */
export function calculateSupplements(weightKg: number): SupplementReferences {
  if (weightKg <= 0) {
    return { creatineGrams: 0, caffeineMg: 0, omega3MgMin: 0, omega3MgMax: 0 };
  }
  return {
    creatineGrams: Number((weightKg * 0.03).toFixed(1)),
    caffeineMg: Math.round(weightKg * 3),
    omega3MgMin: Math.round(weightKg * 20),
    omega3MgMax: Math.round(weightKg * 30),
  };
}

/**
 * Calculates Body-Weight Reference Heuristics
 */
export function calculateHeuristics(weightKg: number): BodyWeightHeuristics {
  if (weightKg <= 0) {
    return {
      maintenanceKcal: 0,
      fatLossMinKcal: 0,
      fatLossMaxKcal: 0,
      muscleGainMinKcal: 0,
      muscleGainMaxKcal: 0,
    };
  }
  return {
    maintenanceKcal: Math.round(weightKg * 30),
    fatLossMinKcal: Math.round(weightKg * 22),
    fatLossMaxKcal: Math.round(weightKg * 25),
    muscleGainMinKcal: Math.round(weightKg * 35),
    muscleGainMaxKcal: Math.round(weightKg * 40),
  };
}

/**
 * Calculates complete fitness results with CRITICAL DIRECTIONAL LOGIC FIX
 * - If currentWeight > targetWeight: ALWAYS DEFICIT (Weight Loss / Recomp)
 * - If targetWeight > currentWeight: SURPLUS (Muscle Gain)
 * - If targetWeight === currentWeight: MAINTENANCE
 */
export function calculateFitnessResults(input: FitnessInput): FitnessResults {
  const { gender, age, heightCm, weightKg, targetWeightKg, activityLevel, goal, goalWeeks = 12 } = input;

  const bmi = calculateBMI(weightKg, heightCm);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  const goalEngine = calculateGoalEngine(input, tdee);
  const supplements = calculateSupplements(weightKg);
  const heuristics = calculateHeuristics(weightKg);

  let targetCalories = tdee;
  let calorieDiff = 0;
  let weeklyChangeKg = 0;

  // DIRECTIONAL GOAL LOGIC:
  if (weightKg > targetWeightKg) {
    // Weight Loss / Recomp: Primary need is a Caloric Deficit
    targetCalories = Math.max(gender === 'male' ? 1500 : 1200, tdee - goalEngine.dailyDeficitKcal);
    calorieDiff = targetCalories - tdee;
    weeklyChangeKg = -goalEngine.weeklyLossKg;
  } else if (targetWeightKg > weightKg) {
    // Weight Gain / Lean Muscle Building: Needs a Caloric Surplus
    calorieDiff = Math.round(tdee * 0.15); // 15% surplus (~0.375kg/week)
    targetCalories = tdee + calorieDiff;
    weeklyChangeKg = 0.375;
  } else {
    // Maintenance
    targetCalories = tdee;
    calorieDiff = 0;
    weeklyChangeKg = 0;
  }

  // Protein rate calculation (Keep high at 2.0 - 2.2 g/kg if user wants muscle building or recomp)
  let proteinRate = PROTEIN_RATES[goal];
  if (goal === 'recomp' || goal === 'gain') {
    proteinRate = 2.2; // High protein to build/preserve muscle during weight loss or gain
  }

  const proteinGrams = Math.round(weightKg * proteinRate);
  const proteinCalories = proteinGrams * 4;

  // Fat calculation (25% of target calories)
  const fatCalories = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs calculation (Remaining calories)
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbCalories = Math.round(remainingCalories);
  const carbGrams = Math.round(carbCalories / 4);

  // Water intake (35-40 ml/kg)
  const waterMlMin = Math.round(weightKg * 35);
  const waterMlMax = Math.round(weightKg * 40);
  const waterLitersAvg = Number(((waterMlMin + waterMlMax) / 2000).toFixed(2));

  // Ideal weight range
  const idealWeight = calculateIdealWeight(heightCm);

  // Goal timeline
  const weightDiff = Math.abs(weightKg - targetWeightKg);
  let timelineWeeks: number | null = null;

  if (weightKg > targetWeightKg) {
    timelineWeeks = goalWeeks;
  } else if (targetWeightKg > weightKg) {
    timelineWeeks = Math.ceil(weightDiff / 0.375);
  } else {
    timelineWeeks = null;
  }

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    targetCalories,
    calorieDiff,
    proteinGrams,
    proteinCalories,
    fatGrams,
    fatCalories,
    carbGrams,
    carbCalories,
    waterMlMin,
    waterMlMax,
    waterLitersAvg,
    idealWeightMinKg: idealWeight.minKg,
    idealWeightMaxKg: idealWeight.maxKg,
    timelineWeeks,
    weeklyChangeKg,
    goalEngine,
    supplements,
    heuristics,
  };
}

// Unit conversion helpers
export function lbsToKg(lbs: number): number {
  return Number((lbs / 2.20462).toFixed(1));
}

export function kgToLbs(kg: number): number {
  return Number((kg * 2.20462).toFixed(1));
}

export function ftInToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}
