import type { SearchFilters, PaginationFilters } from './shared';
import type { User } from '@supabase/supabase-js';

// User role enum from database
export type UserRole = 'admin' | 'agent' | 'customer';

// Combined user data from auth.users + public.user_roles
// This extends Supabase User type with role field
export interface UserWithRole extends User {
  role: UserRole;
}

// Combined user data from auth.users + public.user_roles
export interface UserAdmin {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  is_deleted: boolean; // Soft delete flag
}

// Filters for user list
export interface UserFilters extends SearchFilters, PaginationFilters {
  role?: UserRole;
  includeDeleted?: boolean;
}

// Types for mutations
export interface UserRoleUpdate {
  role: UserRole;
}

// Role options for dropdown
export interface RoleOption {
  label: string;
  value: UserRole;
  color: string; // For badge display
}

// Available role options
export const ROLE_OPTIONS: RoleOption[] = [
  { label: 'Admin', value: 'admin', color: 'destructive' },
  { label: 'Agent', value: 'agent', color: 'default' },
  { label: 'Customer', value: 'customer', color: 'secondary' },
];
