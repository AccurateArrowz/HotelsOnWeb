import { BaseRepository } from '@/common/base.repository';
import Role from '@/models/Role';
import Permission from '@/models/Permission';
import RolePermission from '@/models/RolePermission';

/**
 * RBAC repository for role and permission operations
 */
export class RbacRepository {
  private roleRepository: BaseRepository<Role>;
  private permissionRepository: BaseRepository<Permission>;
  private rolePermissionRepository: BaseRepository<RolePermission>;

  constructor() {
    this.roleRepository = new BaseRepository(Role);
    this.permissionRepository = new BaseRepository(Permission);
    this.rolePermissionRepository = new BaseRepository(RolePermission);
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.findAll({
      include: [{ association: 'permissions' }],
    });
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { id: roleId },
      include: [{ association: 'permissions' }],
    });
  }

  /**
   * Get role by name
   */
  async getRoleByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
      include: [{ association: 'permissions' }],
    });
  }

  /**
   * Create role
   */
  async createRole(data: any): Promise<Role> {
    return this.roleRepository.create(data);
  }

  /**
   * Update role
   */
  async updateRole(roleId: number, data: any): Promise<Role | null> {
    await this.roleRepository.update(roleId, data);
    return this.roleRepository.findById(roleId);
  }

  /**
   * Delete role
   */
  async deleteRole(roleId: number): Promise<void> {
    await this.roleRepository.delete(roleId);
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.findAll({
      order: [['name', 'ASC']],
    });
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(permissionId: number): Promise<Permission | null> {
    return this.permissionRepository.findById(permissionId);
  }

  /**
   * Get permission by name
   */
  async getPermissionByName(name: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { name },
    });
  }

  /**
   * Create permission
   */
  async createPermission(data: any): Promise<Permission> {
    return this.permissionRepository.create(data);
  }

  /**
   * Update permission
   */
  async updatePermission(permissionId: number, data: any): Promise<Permission | null> {
    await this.permissionRepository.update(permissionId, data);
    return this.permissionRepository.findById(permissionId);
  }

  /**
   * Delete permission
   */
  async deletePermission(permissionId: number): Promise<void> {
    await this.permissionRepository.delete(permissionId);
  }

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {
    return this.rolePermissionRepository.create({
      roleId,
      permissionId,
    });
  }

  /**
   * Remove permission from role
   */
  async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    await RolePermission.destroy({
      where: { roleId, permissionId },
    });
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      include: [{ association: 'permissions' }],
    });

    return role?.permissions || [];
  }

  /**
   * Check if role has permission
   */
  async roleHasPermission(roleId: number, permissionName: string): Promise<boolean> {
    const rolePermission = await RolePermission.findOne({
      include: [
        { association: 'role', where: { id: roleId } },
        { association: 'permission', where: { name: permissionName } },
      ],
    });

    return !!rolePermission;
  }

  /**
   * Bulk assign permissions to role
   */
  async bulkAssignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<RolePermission[]> {
    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    return RolePermission.bulkCreate(rolePermissions);
  }
}
