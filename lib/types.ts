export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very_active'
  | 'extra_active';

export type Goal = 'lose' | 'maintain' | 'gain' | 'recomp';

export type UnitSystem = 'metric' | 'imperial';

export interface FitnessInput {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  unitSystem: UnitSystem;
  goalWeeks: number; // e.g. 4, 8, 12, 16, 24 weeks
  nutritionRatio: number; // e.g. 0.5 for 50:50, 0.65 for 65:35 split
}

export interface GoalEngineMetrics {
  weightToLoseKg: number;
  totalDeficitKcal: number;
  weeklyDeficitKcal: number;
  dailyDeficitKcal: number;
  nutritionDeficitKcal: number;
  activityDeficitKcal: number;
  weeklyLossKg: number;
  weeklyLossPercent: number;
  isAggressive: boolean;
  safetyWarning: string | null;
  suggestedSteps: string;
}

export interface SupplementReferences {
  creatineGrams: number;
  caffeineMg: number;
  omega3MgMin: number;
  omega3MgMax: number;
}

export interface BodyWeightHeuristics {
  maintenanceKcal: number;
  fatLossMinKcal: number;
  fatLossMaxKcal: number;
  muscleGainMinKcal: number;
  muscleGainMaxKcal: number;
}

export interface FitnessResults {
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  bmr: number;
  tdee: number;
  targetCalories: number;
  calorieDiff: number;
  proteinGrams: number;
  proteinCalories: number;
  fatGrams: number;
  fatCalories: number;
  carbGrams: number;
  carbCalories: number;
  waterMlMin: number;
  waterMlMax: number;
  waterLitersAvg: number;
  idealWeightMinKg: number;
  idealWeightMaxKg: number;
  timelineWeeks: number | null;
  weeklyChangeKg: number;
  goalEngine: GoalEngineMetrics;
  supplements: SupplementReferences;
  heuristics: BodyWeightHeuristics;
}

export interface Recommendation {
  id: string;
  category: 'Nutrition' | 'Workout' | 'Hydration' | 'Recovery' | 'Mindset';
  title: string;
  description: string;
  actionableTip: string;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export interface RecommendationRequestBody {
  age: number;
  gender: Gender;
  bmi: number;
  goal: Goal;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  activity: ActivityLevel;
}
