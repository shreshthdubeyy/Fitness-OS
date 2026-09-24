'use client';

import React, { useState } from 'react';
import { Recommendation, FitnessResults, FitnessInput } from '@/lib/types';
import {
  Sparkles,
  RefreshCw,
  Utensils,
  Dumbbell,
  Droplets,
  Moon,
  Brain,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AIRecommendationsProps {
  results: FitnessResults;
  input: FitnessInput;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  results,
  input,
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: input.age,
          gender: input.gender,
          bmi: results.bmi,
          goal: input.goal,
          calories: results.targetCalories,
          protein: results.proteinGrams,
          carbs: results.carbGrams,
          fat: results.fatGrams,
          activity: input.activityLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      if (Array.isArray(data.recommendations) && data.recommendations.length === 5) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error('Invalid format returned from API');
      }
    } catch (err) {
      console.error(err);
      setError('Could not generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nutrition':
        return <Utensils className="w-4 h-4 text-emerald-600" />;
      case 'Workout':
        return <Dumbbell className="w-4 h-4 text-blue-600" />;
      case 'Hydration':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'Recovery':
        return <Moon className="w-4 h-4 text-indigo-600" />;
      case 'Mindset':
        return <Brain className="w-4 h-4 text-purple-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
    }
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Nutrition':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Workout':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Hydration':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Recovery':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Mindset':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-[12px] border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">AI Coach Recommendations</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized advice tailored specifically to your metrics and target goal
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRecommendations}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Profile...
            </>
          ) : recommendations.length > 0 ? (
            <>
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate Advice
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> Generate 5 Custom Recommendations
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton State */}
      {loading && (
        <div className="space-y-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-[12px] border border-slate-100 bg-slate-50/50 animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-slate-200 rounded-md" />
                <div className="h-4 w-20 bg-slate-200 rounded-full" />
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-md" />
              <div className="h-3 w-3/4 bg-slate-200 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Initial Empty State */}
      {!loading && recommendations.length === 0 && !error && (
        <div className="text-center py-10 px-4 bg-slate-50/60 rounded-[12px] border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-semibold text-slate-800">Ready for Personalized Actionable Guidance?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click the button above to generate 5 targeted fitness, nutrition, hydration, and recovery recommendations based on your current metrics.
            </p>
          </div>
        </div>
      )}

      {/* Recommendation Cards List */}
      {!loading && recommendations.length === 5 && (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={rec.id || index}
              className="p-5 rounded-[12px] border border-slate-200 hover:border-blue-200 bg-white shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getCategoryBadgeStyle(rec.category)}`}>
                  {rec.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {rec.description}
              </p>

              {rec.actionableTip && (
                <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-800 font-medium">
                    <span className="font-semibold text-slate-900">Action Item: </span>
                    {rec.actionableTip}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
