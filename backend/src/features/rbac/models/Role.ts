import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import Permission from './Permission';
import RolePermission from './RolePermission';
import User from '@/features/auth/models/User';
import HotelStaff from '@/features/hotel/models/HotelStaff';

@Table({
  tableName: 'Roles',
  timestamps: true,
})
export default class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // NOTE: the underlying "Roles" table uses `key`/`label` columns (see
  // migrations/20260328120000-create-erd-rbac-tables.js). The `field` mapping
  // below keeps the existing `name`/`description` property names used
  // throughout the RBAC feature while pointing at the real columns.
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'key' })
  declare name: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING, field: 'label' })
  declare description: string | null;

  @BelongsToMany(() => Permission, () => RolePermission, 'roleId', 'permissionId')
  declare permissions?: Permission[];

  @HasMany(() => User, { foreignKey: 'roleId', as: 'users' })
  declare users?: User[];

  @HasMany(() => HotelStaff, { foreignKey: 'roleId', as: 'hotelStaffs' })
  declare hotelStaffs?: HotelStaff[];
}
