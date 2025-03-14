//lib/types/supabase.ts
import { Session, User } from '@supabase/supabase-js';
import { AuthError } from '@supabase/supabase-js';

export interface ProfileT {
  id: string;
  display_name: string;
  goals: any[];
  avatar_url: string;
  has_set_initial_goals: boolean;
}

export type TSupabaseUserSession =
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };

export interface SupabaseAuthErrorProps {
  error: AuthError;
  data: TSupabaseUserSession;
  email: string;
}

export interface SupbaseAuthError {
  isError: boolean;
}
