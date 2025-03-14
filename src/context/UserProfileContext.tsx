// src/context/UserProfileContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseUserSession, getUserProfile } from '@/lib/API/Services/supabase/user';

export interface UserProfile {
  id: string;
  display_name: string;
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

  const refreshUserProfile = async () => {
    try {
      const sessionData = await getSupabaseUserSession();
      if (!sessionData) {
        setUserProfile(null);
        return;
      }
      const profile = await getUserProfile(sessionData.user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  const clearUserProfile = () => {
    setUserProfile(null);
  };

  useEffect(() => {
    refreshUserProfile();
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
