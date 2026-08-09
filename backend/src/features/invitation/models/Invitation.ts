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
import User from '@/features/auth/models/User';
import Hotel from '@/features/hotel/models/Hotel';
import Role from '@/features/rbac/models/Role';

@Table({
  tableName: 'StaffInvitations',
  timestamps: true,
})
export default class Invitation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => Hotel)
  @Column(DataType.INTEGER)
  declare hotelId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare invitedEmail: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare invitedBy: number;

  @AllowNull(false)
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  declare roleId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare token: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare tokenExpiresAt: Date;

  @AllowNull(false)
  @Column(DataType.ENUM('pending', 'accepted', 'expired', 'cancelled', 'declined'))
  declare status: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare acceptedAt: Date | null;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare acceptedByUserId: number | null;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare cancelledAt: Date | null;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare cancelledBy: number | null;

  @BelongsTo(() => Hotel, { foreignKey: 'hotelId', as: 'hotel' })
  declare hotel?: Hotel;

  @BelongsTo(() => User, { foreignKey: 'invitedBy', as: 'inviter' })
  declare inviter?: User;

  @BelongsTo(() => Role, { foreignKey: 'roleId', as: 'role' })
  declare role?: Role;

  @BelongsTo(() => User, { foreignKey: 'acceptedByUserId', as: 'acceptedBy' })
  declare acceptedBy?: User;

  @BelongsTo(() => User, { foreignKey: 'cancelledBy', as: 'cancelledByUser' })
  declare cancelledByUser?: User;
}
