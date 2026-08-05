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
import User from './User';
import HotelStaff from './HotelStaff';

@Table({
  tableName: 'Roles',
  timestamps: true,
})
export default class Role extends Model {
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

  @BelongsToMany(() => Permission, () => RolePermission, 'roleId', 'permissionId')
  declare permissions?: Permission[];

  @HasMany(() => User, { foreignKey: 'roleId', as: 'users' })
  declare users?: User[];

  @HasMany(() => HotelStaff, { foreignKey: 'roleId', as: 'hotelStaffs' })
  declare hotelStaffs?: HotelStaff[];
}
