import { UserRole } from '@/types/auth';

/**
 * Role-based permissions matrix for the dashboard
 */
export const ROLE_PERMISSIONS = {
  analyst: {
    viewDashboard: true,
    viewAnalytics: true,
    filterData: true,
    exportData: true,
    viewTrends: true,
    viewAnomalies: true,
    createReports: false,
    manageUsers: false,
    manageSystem: false,
    approveDemands: false,
  },
  it_staff: {
    viewDashboard: true,
    viewAnalytics: true,
    filterData: true,
    exportData: true,
    viewTrends: true,
    viewAnomalies: true,
    createReports: false,
    manageUsers: true,
    manageSystem: true,
    approveDemands: false,
  },
  leadership: {
    viewDashboard: true,
    viewAnalytics: true,
    filterData: true,
    exportData: true,
    viewTrends: true,
    viewAnomalies: true,
    createReports: true,
    manageUsers: false,
    manageSystem: false,
    approveDemands: true,
  },
} as const;

export type Permission = keyof (typeof ROLE_PERMISSIONS)[UserRole];

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role][permission] ?? false;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole) {
  return ROLE_PERMISSIONS[role];
}

/**
 * Role display names
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  analyst: 'Business Analyst',
  it_staff: 'IT Staff',
  leadership: 'Leadership',
};
