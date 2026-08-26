import type { Role } from './role';

/**
 * User entity (sanitized - no password hash)
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  roleId: number | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
}
