import { Router } from 'express';
import { RbacController } from './rbac.controller';

const router = Router();
const rbacController = new RbacController();

/**
 * Role routes
 */

/**
 * GET /rbac/roles
 * Get all roles
 */
router.get('/roles', rbacController.getAllRoles);

/**
 * GET /rbac/roles/:id
 * Get role by ID
 */
router.get('/roles/:id', rbacController.getRoleById);

/**
 * GET /rbac/roles/name/:name
 * Get role by name
 */
router.get('/roles/name/:name', rbacController.getRoleByName);

/**
 * POST /rbac/roles
 * Create role
 */
router.post('/roles', rbacController.createRole);

/**
 * PUT /rbac/roles/:id
 * Update role
 */
router.put('/roles/:id', rbacController.updateRole);

/**
 * DELETE /rbac/roles/:id
 * Delete role
 */
router.delete('/roles/:id', rbacController.deleteRole);

/**
 * Permission routes
 */

/**
 * GET /rbac/permissions
 * Get all permissions
 */
router.get('/permissions', rbacController.getAllPermissions);

/**
 * GET /rbac/permissions/:id
 * Get permission by ID
 */
router.get('/permissions/:id', rbacController.getPermissionById);

/**
 * GET /rbac/permissions/name/:name
 * Get permission by name
 */
router.get('/permissions/name/:name', rbacController.getPermissionByName);

/**
 * POST /rbac/permissions
 * Create permission
 */
router.post('/permissions', rbacController.createPermission);

/**
 * PUT /rbac/permissions/:id
 * Update permission
 */
router.put('/permissions/:id', rbacController.updatePermission);

/**
 * DELETE /rbac/permissions/:id
 * Delete permission
 */
router.delete('/permissions/:id', rbacController.deletePermission);

/**
 * Role-Permission routes
 */

/**
 * GET /rbac/roles/:roleId/permissions
 * Get role permissions
 */
router.get('/roles/:roleId/permissions', rbacController.getRolePermissions);

/**
 * POST /rbac/roles/:roleId/permissions/:permissionId
 * Assign permission to role
 */
router.post('/roles/:roleId/permissions/:permissionId', rbacController.assignPermissionToRole);

/**
 * DELETE /rbac/roles/:roleId/permissions/:permissionId
 * Remove permission from role
 */
router.delete('/roles/:roleId/permissions/:permissionId', rbacController.removePermissionFromRole);

/**
 * POST /rbac/roles/:roleId/permissions/bulk-assign
 * Bulk assign permissions to role
 */
router.post('/roles/:roleId/permissions/bulk-assign', rbacController.bulkAssignPermissionsToRole);

export default router;
