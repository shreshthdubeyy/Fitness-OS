'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FitnessInput, UnitSystem } from '@/lib/types';
import { calculateFitnessResults } from '@/lib/calculator';
import {
  loadInputFromStorage,
  saveInputToStorage,
  getActiveProfileId,
  isOnboardedFromStorage,
  setOnboardedToStorage,
} from '@/lib/storage';
import { Header } from '@/components/Header';
import { LandingHero } from '@/components/LandingHero';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { ResultsOverview } from '@/components/ResultsOverview';
import { OpenGymWorkout } from '@/components/OpenGymWorkout';
import { WeightProgressChart } from '@/components/WeightProgressChart';
import { SupplementReferences } from '@/components/SupplementReferences';
import { AIRecommendations } from '@/components/AIRecommendations';
import { MobileBottomNav, MobileTab } from '@/components/MobileBottomNav';

export default function Home() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [activeTab, setActiveTab] = useState<MobileTab>('plan');
  const [activeProfileId, setActiveProfileId] = useState<string>('user-default');

  // Page Flow State: 'landing' | 'onboarding' | 'dashboard'
  const [flowState, setFlowState] = useState<'landing' | 'onboarding' | 'dashboard'>('landing');

  const [input, setInput] = useState<FitnessInput>({
    gender: 'male',
    age: 28,
    heightCm: 175,
    weightKg: 80,
    targetWeightKg: 74,
    activityLevel: 'moderate',
    goal: 'recomp',
    unitSystem: 'metric',
    goalWeeks: 12,
    nutritionRatio: 0.5,
  });

  const loadProfileData = (pid: string) => {
    setActiveProfileId(pid);
    const stored = loadInputFromStorage(pid);
    const onboarded = isOnboardedFromStorage(pid);

    if (stored) {
      setInput(stored);
      if (stored.unitSystem) setUnitSystem(stored.unitSystem);
    }

    if (onboarded) {
      setFlowState('dashboard');
    } else {
      setFlowState('landing');
    }
  };

  useEffect(() => {
    const pid = getActiveProfileId();
    loadProfileData(pid);
  }, []);

  const handleSaveInput = (newInput: FitnessInput) => {
    setInput(newInput);
    saveInputToStorage(activeProfileId, newInput);
  };

  const handleOnboardingComplete = (completedInput: FitnessInput, profileName: string) => {
    handleSaveInput(completedInput);
    setOnboardedToStorage(activeProfileId, true);
    setFlowState('dashboard');
  };

  const results = useMemo(() => {
    return calculateFitnessResults(input);
  }, [input]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Header
        unitSystem={unitSystem}
        onUnitSystemChange={(newUnit) => {
          setUnitSystem(newUnit);
          handleSaveInput({ ...input, unitSystem: newUnit });
        }}
        onProfileChanged={(newPid) => {
          loadProfileData(newPid);
        }}
        input={input}
        onSaveInput={handleSaveInput}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
        {/* STATE 1: LANDING HERO */}
        {flowState === 'landing' && (
          <LandingHero
            onStartOnboarding={() => setFlowState('onboarding')}
            onSkipToApp={() => {
              setOnboardedToStorage(activeProfileId, true);
              setFlowState('dashboard');
            }}
          />
        )}

        {/* STATE 2: ONE-TIME ONBOARDING WIZARD */}
        {flowState === 'onboarding' && (
          <OnboardingWizard
            unitSystem={unitSystem}
            onComplete={handleOnboardingComplete}
            onCancel={() => setFlowState('landing')}
          />
        )}

        {/* STATE 3: CLEAN DASHBOARD (Zero input clutter on main screen!) */}
        {flowState === 'dashboard' && (
          <>
            {/* TAB 1: PLAN (Daily Calorie Budget, Macros, Water) */}
            {activeTab === 'plan' && (
              <ResultsOverview
                results={results}
                input={input}
                unitSystem={unitSystem}
              />
            )}

            {/* TAB 2: OPENGYM WORKOUTS */}
            {activeTab === 'workouts' && <OpenGymWorkout />}

            {/* TAB 3: WEIGHT PROGRESS & LOGS */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <WeightProgressChart
                  results={results}
                  input={input}
                  unitSystem={unitSystem}
                  activeProfileId={activeProfileId}
                />

                <SupplementReferences
                  supplements={results.supplements}
                  weightKg={input.weightKg}
                />
              </div>
            )}

            {/* TAB 4: AI COACH */}
            {activeTab === 'ai' && (
              <AIRecommendations results={results} input={input} />
            )}
          </>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Only shown when in dashboard) */}
      {flowState === 'dashboard' && (
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      )}
    </div>
  );
}
