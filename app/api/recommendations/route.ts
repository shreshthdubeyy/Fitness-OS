import { NextRequest, NextResponse } from 'next/server';
import { Recommendation, RecommendationRequestBody } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequestBody = await request.json();

    const { age, gender, bmi, goal, calories, protein, carbs, fat, activity } = body;

    // Validate required fields
    if (
      age === undefined ||
      !gender ||
      bmi === undefined ||
      !goal ||
      calories === undefined ||
      protein === undefined ||
      carbs === undefined ||
      fat === undefined ||
      !activity
    ) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are an expert sports nutritionist and elite fitness coach.
Generate EXACTLY FIVE personalized, actionable, evidence-based recommendations for a client with the following profile:
- Age: ${age}
- Gender: ${gender}
- BMI: ${bmi}
- Goal: ${goal} (lose weight / maintain / gain muscle / recomp)
- Daily Calorie Target: ${calories} kcal
- Protein: ${protein}g
- Carbs: ${carbs}g
- Fat: ${fat}g
- Activity Level: ${activity}

Return ONLY a valid JSON object matching this exact schema:
{
  "recommendations": [
    {
      "id": "rec-1",
      "category": "Nutrition" | "Workout" | "Hydration" | "Recovery" | "Mindset",
      "title": "Short title",
      "description": "2-3 sentence personalized explanation",
      "actionableTip": "Concrete step client can do today"
    }
  ]
}
Ensure there are EXACTLY 5 recommendation objects in the array. Do not include markdown formatting or extra text outside JSON.`;

        const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            response_format: { type: 'json_object' },
          }),
        });

        if (openAiResponse.ok) {
          const aiData = await openAiResponse.json();
          const content = aiData.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed.recommendations) && parsed.recommendations.length === 5) {
              return NextResponse.json(parsed);
            }
          }
        }
      } catch (err) {
        console.warn('OpenAI API call failed, using rule-based fallback:', err);
      }
    }

    // Fallback: Smart tailored rule-based recommendations (exactly 5)
    const fallbackRecommendations = generateFallbackRecommendations(body);
    return NextResponse.json({ recommendations: fallbackRecommendations });

  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

function generateFallbackRecommendations(data: RecommendationRequestBody): Recommendation[] {
  const { goal, protein, calories, activity, bmi } = data;

  const recs: Recommendation[] = [];

  // 1. Protein Timing Strategy
  recs.push({
    id: 'rec-1',
    category: 'Nutrition',
    title: 'Distribute Protein Evenly Across Meals',
    description: `To hit your target of ${protein}g protein daily, split it into 3-4 distinct meals containing roughly ${Math.round(protein / 4)}g each.`,
    actionableTip: `Consume 30-40g of high-quality protein within 2 hours after your main workout session to optimize muscle protein synthesis.`,
  });

  // 2. Goal-based Caloric Management
  if (goal === 'lose') {
    recs.push({
      id: 'rec-2',
      category: 'Nutrition',
      title: 'Prioritize Volume & Satiety Foods',
      description: `Your caloric target of ${calories} kcal is designed for steady fat loss. Focus on high-volume, low-calorie foods like leafy greens, berries, and lean meats.`,
      actionableTip: `Fill half of your dinner plate with non-starchy vegetables to stay full without exceeding calorie limits.`,
    });
  } else if (goal === 'gain') {
    recs.push({
      id: 'rec-2',
      category: 'Nutrition',
      title: 'Leverage Nutrient-Dense Energy Sources',
      description: `Reaching ${calories} kcal requires dense calories. Incorporate healthy fats like avocados, nuts, peanut butter, and olive oil to meet energy targets easily.`,
      actionableTip: `Add a pre-bed casein or liquid smoothie shake with oats and nut butter for easy extra calories.`,
    });
  } else {
    recs.push({
      id: 'rec-2',
      category: 'Nutrition',
      title: 'Fuel Workouts with Strategic Carbohydrates',
      description: `With a target of ${calories} kcal, timing your carbohydrates around your training window optimizes glycogen replenishment and performance.`,
      actionableTip: `Eat a fast-digesting carb (e.g. banana or rice cakes) 45 minutes prior to training.`,
    });
  }

  // 3. Activity & Training Customization
  if (activity === 'sedentary' || activity === 'light') {
    recs.push({
      id: 'rec-3',
      category: 'Workout',
      title: 'Incorporate 8,000+ Daily Steps (NEAT)',
      description: `Non-exercise activity thermogenesis (NEAT) accounts for a significant portion of daily energy burn.`,
      actionableTip: `Take 10-minute walking breaks after lunch and dinner to boost your daily step count without high fatigue.`,
    });
  } else {
    recs.push({
      id: 'rec-3',
      category: 'Workout',
      title: 'Progressive Overload Strength Training',
      description: `Your active lifestyle benefits most from structured resistance training 3-5 days per week to support muscle maintenance and metabolic health.`,
      actionableTip: `Log your main compound lifts and aim to increase weight or reps slightly each week.`,
    });
  }

  // 4. Hydration Protocol
  recs.push({
    id: 'rec-4',
    category: 'Hydration',
    title: 'Optimal Electrolyte & Fluid Balance',
    description: `Adequate hydration directly impacts energy levels, digestive efficiency, and gym performance.`,
    actionableTip: `Drink 500ml of fresh water immediately upon waking, before drinking coffee or tea.`,
  });

  // 5. Recovery & Sleep Optimization
  recs.push({
    id: 'rec-5',
    category: 'Recovery',
    title: 'Sleep Architecture & Cortisol Control',
    description: `High-quality sleep (7.5-9 hours) regulates ghrelin and leptin (hunger hormones) while preserving lean tissue mass during training.`,
    actionableTip: `Maintain a consistent sleep window and discontinue screen exposure 45 minutes before sleep.`,
  });

  return recs;
}
