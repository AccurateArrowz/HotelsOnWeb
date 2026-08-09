import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  HasMany,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import Role from '@/features/rbac/models/Role';
import Booking from '@/features/booking/models/Booking';
import RefreshToken from './RefreshToken';
import HotelRequest from '@/features/hotel-request/models/HotelRequest';
import HotelOwner from '@/features/hotel/models/HotelOwner';
import Hotel from '@/features/hotel/models/Hotel';
import HotelStaff from '@/features/hotel/models/HotelStaff';
import HotelStaffPermission from '@/features/hotel/models/HotelStaffPermission';

@Table({
  tableName: 'Users',
  timestamps: true,
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare firstName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare lastName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare phone: string | null;

  @AllowNull(true)
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  declare roleId: number | null;

  @BelongsTo(() => Role, { foreignKey: 'roleId', as: 'role' })
  declare role?: Role;

  @HasMany(() => Booking, { foreignKey: 'userId', as: 'bookings' })
  declare bookings?: Booking[];

  @HasMany(() => Booking, { foreignKey: 'cancelledBy', as: 'cancelledBookings' })
  declare cancelledBookings?: Booking[];

  @HasMany(() => RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' })
  declare refreshTokens?: RefreshToken[];

  @HasMany(() => HotelRequest, { foreignKey: 'userId', as: 'hotelRequests' })
  declare hotelRequests?: HotelRequest[];

  @HasMany(() => HotelOwner, { foreignKey: 'userId', as: 'hotelOwners' })
  declare hotelOwners?: HotelOwner[];

  @BelongsToMany(() => Hotel, () => HotelOwner, 'userId', 'hotelId')
  declare ownedHotelsViaJoin?: Hotel[];

  @HasMany(() => HotelStaff, { foreignKey: 'userId', as: 'hotelStaffs' })
  declare hotelStaffs?: HotelStaff[];

  @HasMany(() => HotelStaffPermission, { foreignKey: 'userId', as: 'hotelStaffPermissions' })
  declare hotelStaffPermissions?: HotelStaffPermission[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password') || instance.isNewRecord) {
      instance.password = await bcrypt.hash(instance.password, 12);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
