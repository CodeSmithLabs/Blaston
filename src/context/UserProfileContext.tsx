// src/context/UserProfileContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ensureUserProfile } from '@/lib/API/Services/supabase/user';

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
  setUserProfile: (profile: UserProfile | null) => void;
  refreshUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextProps>({
  userProfile: null,
  setUserProfile: () => {},
  refreshUserProfile: async () => {},
  clearUserProfile: () => {}
});

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  const refreshUserProfile = async () => {
    try {
      const sessionData = await ensureUserProfile();
      console.log('Fetched user session:', sessionData);
      if (!sessionData) {
        console.log('No session found.');
        setUserProfile(null);
        localStorage.removeItem('userProfile');
        return;
      }

      console.log('Fetching user profile from Supabase...');
      const profile = sessionData.profile;
      if (profile) {
        console.log('Fetched user profile:', profile);
        const { id, display_name, goals, avatar_url, has_set_initial_goals } = profile;
        const email = sessionData.user.email;

        const userProfileData: UserProfile = {
          id,
          display_name,
          email,
          goals,
          avatar_url,
          has_set_initial_goals
        };
        setUserProfile(userProfileData);
        localStorage.setItem('userProfile', JSON.stringify(userProfileData));
      } else {
        console.log('User profile not found.');
        setUserProfile(null);
        localStorage.removeItem('userProfile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
      localStorage.removeItem('userProfile');
    }
  };

  // Ensure refreshUserProfile runs on mount
  useEffect(() => {
    refreshUserProfile();
  }, []);

  const clearUserProfile = () => {
    setUserProfile(null);
    localStorage.removeItem('userProfile');
  };

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sb-access-token='))
      ?.split('=')[1];

    if (token) {
      refreshUserProfile();
    }
  }, []);

  return (
    <UserProfileContext.Provider
      value={{ userProfile, setUserProfile, refreshUserProfile, clearUserProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
export default UserProfileProvider;
