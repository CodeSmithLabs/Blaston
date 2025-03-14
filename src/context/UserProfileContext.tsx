// src/context/UserProfileContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ensureUserProfile, updateUserProfile } from '@/lib/API/Services/supabase/user';
import { ProfileT } from '@/lib/types/supabase';

interface UserProfileContextProps {
  userProfile: (ProfileT & { email: string }) | null;
  refreshUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
  updateProfileField: <K extends keyof Omit<ProfileT, 'id'>>(field: K, value: ProfileT[K]) => void;
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
  const [userProfile, setUserProfile] = useState<(ProfileT & { email: string }) | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<ProfileT> | null>(null);

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
      const userProfileData = {
        ...profile,
        email: user.email
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
  const updateProfileField = <K extends keyof Omit<ProfileT, 'id'>>(
    field: K,
    value: ProfileT[K]
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
