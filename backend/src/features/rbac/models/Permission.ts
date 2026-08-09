import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import Role from './Role';
import RolePermission from './RolePermission';
import HotelStaffPermission from '@/features/hotel/models/HotelStaffPermission';

@Table({
  tableName: 'Permissions',
  timestamps: true,
})
export default class Permission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null;

  @BelongsToMany(() => Role, () => RolePermission, 'permissionId', 'roleId')
  declare roles?: Role[];

  @HasMany(() => HotelStaffPermission, { foreignKey: 'permissionId', as: 'hotelStaffPermissions' })
  declare hotelStaffPermissions?: HotelStaffPermission[];
}
