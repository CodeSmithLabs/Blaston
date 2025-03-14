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
  refreshUserProfile: () => Promise<void>;
  clearUserProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextProps>({
  userProfile: null,
  refreshUserProfile: async () => {},
  clearUserProfile: () => {}
});

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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

  const clearUserProfile = () => {
    setUserProfile(null);
    localStorage.removeItem('userProfile');
  };

  useEffect(() => {
    refreshUserProfile();
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, refreshUserProfile, clearUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
export default UserProfileProvider;
