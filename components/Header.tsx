'use client';

import React, { useState, useEffect } from 'react';
import { UnitSystem, FitnessInput } from '@/lib/types';
import { UserProfile, getProfilesList, getActiveProfileId } from '@/lib/storage';
import { UserProfileModal } from './UserProfileModal';
import { EditProfileModal } from './EditProfileModal';
import { Logo } from './Logo';
import { User, Settings } from 'lucide-react';

interface HeaderProps {
  unitSystem: UnitSystem;
  onUnitSystemChange: (unit: UnitSystem) => void;
  onProfileChanged: (profileId: string) => void;
  input: FitnessInput;
  onSaveInput: (updated: FitnessInput) => void;
}

export const Header: React.FC<HeaderProps> = ({
  unitSystem,
  onUnitSystemChange,
  onProfileChanged,
  input,
  onSaveInput,
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  const refreshActiveProfile = () => {
    const activeId = getActiveProfileId();
    const list = getProfilesList();
    const found = list.find((p) => p.id === activeId) || list[0];
    setActiveProfile(found);
  };

  useEffect(() => {
    refreshActiveProfile();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
              <Logo size={38} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight">
                Fitness OS
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Precision Health & OpenGym Engine
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Edit Profile Button */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 transition-all shadow-2xs"
              title="Edit height, weight or timeline"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>

            {/* User Profile Login Badge */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                {activeProfile ? activeProfile.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="max-w-24 truncate">{activeProfile ? activeProfile.name : 'Profile'}</span>
            </button>

            {/* Unit System Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-medium text-slate-600">
              <button
                onClick={() => onUnitSystemChange('metric')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  unitSystem === 'metric'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                kg
              </button>
              <button
                onClick={() => onUnitSystemChange('imperial')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  unitSystem === 'imperial'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                lbs
              </button>
            </div>
          </div>
        </div>
      </header>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileSwitched={(newId) => {
          refreshActiveProfile();
          onProfileChanged(newId);
        }}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        input={input}
        unitSystem={unitSystem}
        onSave={onSaveInput}
      />
    </>
  );
};
