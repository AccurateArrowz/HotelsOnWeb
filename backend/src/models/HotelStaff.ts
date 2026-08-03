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
  HasMany,
} from 'sequelize-typescript';
import User from './User';
import Hotel from './Hotel';
import Role from './Role';
import HotelStaffPermission from './HotelStaffPermission';

@Table({
  tableName: 'HotelStaffs',
  timestamps: true,
})
export default class HotelStaff extends Model {
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
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  declare roleId: number;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare invitedBy: number | null;

  @AllowNull(false)
  @Column(DataType.ENUM('active', 'inactive', 'suspended'))
  declare status: string;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  declare user?: User;

  @BelongsTo(() => Hotel, { foreignKey: 'hotelId', as: 'hotel' })
  declare hotel?: Hotel;

  @BelongsTo(() => Role, { foreignKey: 'roleId', as: 'role' })
  declare role?: Role;

  @BelongsTo(() => User, { foreignKey: 'invitedBy', as: 'inviter' })
  declare inviter?: User;

  @HasMany(() => HotelStaffPermission, { foreignKey: 'userId', as: 'permissions' })
  declare permissions?: HotelStaffPermission[];
}
