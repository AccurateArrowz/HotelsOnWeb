import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Role from './Role';
import Permission from './Permission';

@Table({
  tableName: 'RolePermissions',
  timestamps: true,
})
export default class RolePermission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  declare roleId: number;

  @AllowNull(false)
  @ForeignKey(() => Permission)
  @Column(DataType.INTEGER)
  declare permissionId: number;

  @BelongsTo(() => Role, { foreignKey: 'roleId' })
  declare role?: Role;

  @BelongsTo(() => Permission, { foreignKey: 'permissionId' })
  declare permission?: Permission;
}
