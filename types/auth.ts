/**
 * User Roles for Linde AMT Dashboard
 * - analyst: Business Analysts - analyze data, track requests
 * - it_staff: IT Staff - manage system, monitor access
 * - leadership: Leadership - review data and make decisions
 */
export type UserRole = 'analyst' | 'it_staff' | 'leadership';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserMetadata {
  role: UserRole;
  name?: string;
}
