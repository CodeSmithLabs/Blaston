// src/context/UserProfileContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ensureUserProfile, updateUserProfile } from '@/lib/API/Services/supabase/user';

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  goals: any[];
  avatar_url: string;
  has_set_initial_goals: boolean;
}

interface UserProfileContextProps {
  userProfile: UserProfile | null;
  refreshUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
  updateProfileField: <K extends keyof Omit<UserProfile, 'id' | 'email'>>(
    field: K,
    value: UserProfile[K]
  ) => void;
  syncProfileWithSupabase: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextProps>({
  userProfile: null,
  refreshUserProfile: async () => {},
  clearUserProfile: () => {},
  updateProfileField: () => {},
  syncProfileWithSupabase: async () => {}
});

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<UserProfile> | null>(null);

  // Fetch user profile from Supabase or local storage
  const refreshUserProfile = async () => {
    try {
      const sessionData = await ensureUserProfile();

      if (!sessionData?.user || !sessionData?.profile) {
        console.log('No session or user profile found.');
        clearUserProfile();
        return;
      }

      const { user, profile } = sessionData;
      const userProfileData: UserProfile = {
        id: user.id,
        display_name: profile.display_name,
        email: user.email,
        goals: profile.goals,
        avatar_url: profile.avatar_url,
        has_set_initial_goals: profile.has_set_initial_goals
      };

      setUserProfile(userProfileData);
      localStorage.setItem('userProfile', JSON.stringify(userProfileData));
      console.log('User profile set:', userProfileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      clearUserProfile();
    }
  };

  // Clear user profile
  const clearUserProfile = () => {
    setUserProfile(null);
    localStorage.removeItem('userProfile');
    console.log('User profile cleared.');
  };

  // Update specific profile fields and queue updates if offline
  const updateProfileField = <K extends keyof Omit<UserProfile, 'id' | 'email'>>(
    field: K,
    value: UserProfile[K]
  ) => {
    setUserProfile((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      console.log(`${field} updated in context:`, value);
      return updated;
    });

    // Queue updates for syncing later if offline
    setPendingUpdates((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Sync profile updates to Supabase
  const syncProfileWithSupabase = async () => {
    if (!userProfile || !pendingUpdates) return;

    try {
      await updateUserProfile(userProfile.id, pendingUpdates);
      console.log('Profile synced with Supabase:', pendingUpdates);
      setPendingUpdates(null);
    } catch (error) {
      console.error('Failed to sync profile with Supabase:', error);
    }
  };

  // Automatically sync profile updates when online
  useEffect(() => {
    const handleOnline = async () => {
      console.log('Internet connection restored, syncing profile...');
      await syncProfileWithSupabase();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [userProfile, pendingUpdates]);

  // Refresh profile on mount
  useEffect(() => {
    refreshUserProfile();
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        refreshUserProfile,
        clearUserProfile,
        updateProfileField,
        syncProfileWithSupabase
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
export default UserProfileProvider;
