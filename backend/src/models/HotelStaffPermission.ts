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
import User from './User';
import Hotel from './Hotel';
import Permission from './Permission';

@Table({
  tableName: 'HotelStaffPermissions',
  timestamps: true,
})
export default class HotelStaffPermission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: number;

  @AllowNull(false)
  @ForeignKey(() => Hotel)
  @Column(DataType.INTEGER)
  declare hotelId: number;

  @AllowNull(false)
  @ForeignKey(() => Permission)
  @Column(DataType.INTEGER)
  declare permissionId: number;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  declare user?: User;

  @BelongsTo(() => Hotel, { foreignKey: 'hotelId', as: 'hotel' })
  declare hotel?: Hotel;

  @BelongsTo(() => Permission, { foreignKey: 'permissionId', as: 'permission' })
  declare permission?: Permission;
}
