import { RbacRepository } from './rbac.repository';
import { HttpError } from '@/common/http-error';

/**
 * RBAC service for role and permission operations
 */
export class RbacService {
  private rbacRepository: RbacRepository;

  constructor() {
    this.rbacRepository = new RbacRepository();
  }

  /**
   * Get all roles
   */
  async getAllRoles() {
    return this.rbacRepository.getAllRoles();
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: number) {
    const role = await this.rbacRepository.getRoleById(roleId);

    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    return role;
  }

  /**
   * Get role by name
   */
  async getRoleByName(name: string) {
    const role = await this.rbacRepository.getRoleByName(name);

    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    return role;
  }

  /**
   * Create role
   */
  async createRole(data: any) {
    const existingRole = await this.rbacRepository.getRoleByName(data.name);

    if (existingRole) {
      throw HttpError.conflict('Role already exists');
    }

    return this.rbacRepository.createRole(data);
  }

  /**
   * Update role
   */
  async updateRole(roleId: number, data: any) {
    const role = await this.rbacRepository.getRoleById(roleId);

    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    return this.rbacRepository.updateRole(roleId, data);
  }

  /**
   * Delete role
   */
  async deleteRole(roleId: number) {
    const role = await this.rbacRepository.getRoleById(roleId);

    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    await this.rbacRepository.deleteRole(roleId);
  }

  /**
   * Get all permissions
   */
  async getAllPermissions() {
    return this.rbacRepository.getAllPermissions();
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(permissionId: number) {
    const permission = await this.rbacRepository.getPermissionById(permissionId);

    if (!permission) {
      throw HttpError.notFound('Permission not found');
    }

    return permission;
  }

  /**
   * Get permission by name
   */
  async getPermissionByName(name: string) {
    const permission = await this.rbacRepository.getPermissionByName(name);

    if (!permission) {
      throw HttpError.notFound('Permission not found');
    }

    return permission;
  }

  /**
   * Create permission
   */
  async createPermission(data: any) {
    const existingPermission = await this.rbacRepository.getPermissionByName(data.name);

    if (existingPermission) {
      throw HttpError.conflict('Permission already exists');
    }

    return this.rbacRepository.createPermission(data);
  }

  /**
   * Update permission
   */
  async updatePermission(permissionId: number, data: any) {
    const permission = await this.rbacRepository.getPermissionById(permissionId);

    if (!permission) {
      throw HttpError.notFound('Permission not found');
    }

    return this.rbacRepository.updatePermission(permissionId, data);
  }

  /**
   * Delete permission
   */
  async deletePermission(permissionId: number) {
    const permission = await this.rbacRepository.getPermissionById(permissionId);

    if (!permission) {
      throw HttpError.notFound('Permission not found');
    }

    await this.rbacRepository.deletePermission(permissionId);
  }

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleId: number, permissionId: number) {
    const role = await this.rbacRepository.getRoleById(roleId);

    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    const permission = await this.rbacRepository.getPermissionById(permissionId);

    if (!permission) {
      throw HttpError.notFound('Permission not found');
    }

    return this.rbacRepository.assignPermissionToRole(roleId, permissionId);
  }

  /**
   * Remove permission from role
   */
  async removePermissionFromRole(roleId: number, permissionId: number) {
    const role = await this.rbacRepository.getRoleById(roleId);

    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    const permission = await this.rbacRepository.getPermissionById(permissionId);

    if (!permission) {
      throw HttpError.notFound('Permission not found');
    }

    await this.rbacRepository.removePermissionFromRole(roleId, permissionId);
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleId: number) {
    const role = await this.rbacRepository.getRoleById(roleId);

    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    return this.rbacRepository.getRolePermissions(roleId);
  }

  /**
   * Check if role has permission
   */
  async roleHasPermission(roleId: number, permissionName: string) {
    return this.rbacRepository.roleHasPermission(roleId, permissionName);
  }

  /**
   * Bulk assign permissions to role
   */
  async bulkAssignPermissionsToRole(roleId: number, permissionIds: number[]) {
    const role = await this.rbacRepository.getRoleById(roleId);

    if (!role) {
      throw HttpError.notFound('Role not found');
    }

    return this.rbacRepository.bulkAssignPermissionsToRole(roleId, permissionIds);
  }
}
