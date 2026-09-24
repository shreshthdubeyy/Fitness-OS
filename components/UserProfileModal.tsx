'use client';

import React, { useState } from 'react';
import {
  UserProfile,
  getProfilesList,
  getActiveProfileId,
  setActiveProfileId,
  createProfile,
  deleteProfile,
} from '@/lib/storage';
import { User, Plus, Check, ShieldCheck, Lock, Trash2, X } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileSwitched: (newProfileId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileSwitched,
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(getProfilesList());
  const [activeId, setActiveId] = useState<string>(getActiveProfileId());
  
  // Create Profile state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');

  // PIN Verification State
  const [verifyingProfile, setVerifyingProfile] = useState<UserProfile | null>(null);
  const [inputPin, setInputPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectProfile = (p: UserProfile) => {
    if (p.id === activeId) {
      onClose();
      return;
    }

    if (p.pin) {
      setVerifyingProfile(p);
      setInputPin('');
      setPinError(null);
    } else {
      setActiveProfileId(p.id);
      setActiveId(p.id);
      onProfileSwitched(p.id);
      onClose();
    }
  };

  const handleVerifyPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingProfile) return;

    if (inputPin === verifyingProfile.pin) {
      setActiveProfileId(verifyingProfile.id);
      setActiveId(verifyingProfile.id);
      onProfileSwitched(verifyingProfile.id);
      setVerifyingProfile(null);
      onClose();
    } else {
      setPinError('Incorrect 4-digit PIN');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created = createProfile(newName, newPin);
    const updatedList = getProfilesList();
    setProfiles(updatedList);
    setActiveId(created.id);
    onProfileSwitched(created.id);
    setIsCreating(false);
    setNewName('');
    setNewPin('');
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProfile(id);
    const updated = getProfilesList();
    setProfiles(updated);
    const newActive = getActiveProfileId();
    setActiveId(newActive);
    onProfileSwitched(newActive);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl p-6 space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">User Profile Login</h3>
            <p className="text-xs text-slate-500">Switch or create user profiles on this device</p>
          </div>
        </div>

        {/* PIN VERIFICATION SUB-VIEW */}
        {verifyingProfile ? (
          <form onSubmit={handleVerifyPinSubmit} className="space-y-4 py-2">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Enter PIN for {verifyingProfile.name}</h4>
              <p className="text-xs text-slate-500">This profile is protected with a 4-digit PIN</p>
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
              <input
                type="password"
                maxLength={4}
                placeholder="4-digit PIN"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-600 text-center font-medium">{pinError}</p>}
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVerifyingProfile(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
              >
                Unlock Profile
              </button>
            </div>
          </form>
        ) : isCreating ? (
          /* CREATE PROFILE SUB-VIEW */
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <h4 className="text-sm font-bold text-slate-900">Create New Fitness Profile</h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Profile Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shreshth, Alex, Sarah"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Optional 4-Digit PIN Lock</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="e.g. 1234 (Leave blank for no PIN)"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
              >
                Create & Switch
              </button>
            </div>
          </form>
        ) : (
          /* PROFILES LIST */
          <div className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {profiles.map((p) => {
                const isActive = p.id === activeId;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProfile(p)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {p.name} {p.pin && <Lock className="w-3 h-3 text-slate-600" />}
                        </p>
                        <p className="text-[10px] text-slate-600">
                          {isActive ? 'Active Profile' : 'Click to select'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                      {p.id !== 'user-default' && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(p.id, e)}
                          className="text-slate-600 hover:text-rose-600 p-1 rounded-lg"
                          title="Delete profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Create New User Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
