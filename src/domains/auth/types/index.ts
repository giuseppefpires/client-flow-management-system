
import { BaseEntity } from '@/shared/types/common';

export interface User extends BaseEntity {
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  full_name: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
