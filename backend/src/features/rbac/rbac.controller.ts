import { Request, Response } from 'express';
import { RbacService } from './rbac.service';
import { ApiResponseHandler, asyncHandler } from '@/common';
import { HttpError } from '@/common/http-error';

/**
 * RBAC controller for role and permission endpoints
 */
export class RbacController {
  private rbacService: RbacService;

  constructor() {
    this.rbacService = new RbacService();
  }

  /**
   * GET /rbac/roles
   * Get all roles
   */
  getAllRoles = asyncHandler(async (req: Request, res: Response) => {
    const roles = await this.rbacService.getAllRoles();

    return ApiResponseHandler.success(res, roles);
  });

  /**
   * GET /rbac/roles/:id
   * Get role by ID
   */
  getRoleById = asyncHandler(async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.id);

    if (!Number.isInteger(roleId)) {
      throw HttpError.badRequest('Role ID must be a numeric value');
    }

    const role = await this.rbacService.getRoleById(roleId);

    return ApiResponseHandler.success(res, role);
  });

  /**
   * GET /rbac/roles/name/:name
   * Get role by name
   */
  getRoleByName = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;

    const role = await this.rbacService.getRoleByName(name);

    return ApiResponseHandler.success(res, role);
  });

  /**
   * POST /rbac/roles
   * Create role
   */
  createRole = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      throw HttpError.badRequest('Role name is required');
    }

    const role = await this.rbacService.createRole({ name, description });

    return ApiResponseHandler.created(res, role);
  });

  /**
   * PUT /rbac/roles/:id
   * Update role
   */
  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.id);

    if (!Number.isInteger(roleId)) {
      throw HttpError.badRequest('Role ID must be a numeric value');
    }

    const role = await this.rbacService.updateRole(roleId, req.body);

    return ApiResponseHandler.success(res, role);
  });

  /**
   * DELETE /rbac/roles/:id
   * Delete role
   */
  deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.id);

    if (!Number.isInteger(roleId)) {
      throw HttpError.badRequest('Role ID must be a numeric value');
    }

    await this.rbacService.deleteRole(roleId);

    return ApiResponseHandler.success(res, null, 'Role deleted successfully');
  });

  /**
   * GET /rbac/permissions
   * Get all permissions
   */
  getAllPermissions = asyncHandler(async (req: Request, res: Response) => {
    const permissions = await this.rbacService.getAllPermissions();

    return ApiResponseHandler.success(res, permissions);
  });

  /**
   * GET /rbac/permissions/:id
   * Get permission by ID
   */
  getPermissionById = asyncHandler(async (req: Request, res: Response) => {
    const permissionId = parseInt(req.params.id);

    if (!Number.isInteger(permissionId)) {
      throw HttpError.badRequest('Permission ID must be a numeric value');
    }

    const permission = await this.rbacService.getPermissionById(permissionId);

    return ApiResponseHandler.success(res, permission);
  });

  /**
   * GET /rbac/permissions/name/:name
   * Get permission by name
   */
  getPermissionByName = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;

    const permission = await this.rbacService.getPermissionByName(name);

    return ApiResponseHandler.success(res, permission);
  });

  /**
   * POST /rbac/permissions
   * Create permission
   */
  createPermission = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      throw HttpError.badRequest('Permission name is required');
    }

    const permission = await this.rbacService.createPermission({ name, description });

    return ApiResponseHandler.created(res, permission);
  });

  /**
   * PUT /rbac/permissions/:id
   * Update permission
   */
  updatePermission = asyncHandler(async (req: Request, res: Response) => {
    const permissionId = parseInt(req.params.id);

    if (!Number.isInteger(permissionId)) {
      throw HttpError.badRequest('Permission ID must be a numeric value');
    }

    const permission = await this.rbacService.updatePermission(permissionId, req.body);

    return ApiResponseHandler.success(res, permission);
  });

  /**
   * DELETE /rbac/permissions/:id
   * Delete permission
   */
  deletePermission = asyncHandler(async (req: Request, res: Response) => {
    const permissionId = parseInt(req.params.id);

    if (!Number.isInteger(permissionId)) {
      throw HttpError.badRequest('Permission ID must be a numeric value');
    }

    await this.rbacService.deletePermission(permissionId);

    return ApiResponseHandler.success(res, null, 'Permission deleted successfully');
  });

  /**
   * POST /rbac/roles/:roleId/permissions/:permissionId
   * Assign permission to role
   */
  assignPermissionToRole = asyncHandler(async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    const permissionId = parseInt(req.params.permissionId);

    if (!Number.isInteger(roleId) || !Number.isInteger(permissionId)) {
      throw HttpError.badRequest('Role ID and Permission ID must be numeric values');
    }

    const rolePermission = await this.rbacService.assignPermissionToRole(roleId, permissionId);

    return ApiResponseHandler.created(res, rolePermission);
  });

  /**
   * DELETE /rbac/roles/:roleId/permissions/:permissionId
   * Remove permission from role
   */
  removePermissionFromRole = asyncHandler(async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    const permissionId = parseInt(req.params.permissionId);

    if (!Number.isInteger(roleId) || !Number.isInteger(permissionId)) {
      throw HttpError.badRequest('Role ID and Permission ID must be numeric values');
    }

    await this.rbacService.removePermissionFromRole(roleId, permissionId);

    return ApiResponseHandler.success(res, null, 'Permission removed from role');
  });

  /**
   * GET /rbac/roles/:roleId/permissions
   * Get role permissions
   */
  getRolePermissions = asyncHandler(async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);

    if (!Number.isInteger(roleId)) {
      throw HttpError.badRequest('Role ID must be a numeric value');
    }

    const permissions = await this.rbacService.getRolePermissions(roleId);

    return ApiResponseHandler.success(res, permissions);
  });

  /**
   * POST /rbac/roles/:roleId/permissions/bulk-assign
   * Bulk assign permissions to role
   */
  bulkAssignPermissionsToRole = asyncHandler(async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    const { permissionIds } = req.body;

    if (!Number.isInteger(roleId)) {
      throw HttpError.badRequest('Role ID must be a numeric value');
    }

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      throw HttpError.badRequest('Permission IDs array is required');
    }

    const rolePermissions = await this.rbacService.bulkAssignPermissionsToRole(roleId, permissionIds);

    return ApiResponseHandler.created(res, rolePermissions);
  });
}
