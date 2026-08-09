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
import HotelImage from './HotelImage';
import RoomType from '@/features/roomType/models/RoomType';
import Room from '@/features/room/models/Room';
import Booking from '@/features/booking/models/Booking';
import HotelOwner from './HotelOwner';
import User from '@/features/auth/models/User';
import HotelStaff from './HotelStaff';
import HotelStaffPermission from './HotelStaffPermission';

@Table({
  tableName: 'Hotels',
  timestamps: true,
})
export default class Hotel extends Model {
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

  @AllowNull(false)
  @Column(DataType.STRING)
  declare street: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare city: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare country: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  declare amenities: string[] | null;

  @Column(DataType.BOOLEAN)
  declare isActive: boolean;

  @HasMany(() => HotelImage, { foreignKey: 'hotelId', as: 'images' })
  declare images?: HotelImage[];

  @HasMany(() => RoomType, { foreignKey: 'hotelId', as: 'roomTypes' })
  declare roomTypes?: RoomType[];

  @HasMany(() => Room, { foreignKey: 'hotelId', as: 'rooms' })
  declare rooms?: Room[];

  @HasMany(() => Booking, { foreignKey: 'hotelId', as: 'bookings' })
  declare bookings?: Booking[];

  @HasMany(() => HotelOwner, { foreignKey: 'hotelId', as: 'hotelOwners' })
  declare hotelOwners?: HotelOwner[];

  @BelongsToMany(() => User, () => HotelOwner, 'hotelId', 'userId')
  declare owners?: User[];

  @HasMany(() => HotelStaff, { foreignKey: 'hotelId', as: 'hotelStaffs' })
  declare hotelStaffs?: HotelStaff[];

  @HasMany(() => HotelStaffPermission, { foreignKey: 'hotelId', as: 'hotelStaffPermissions' })
  declare hotelStaffPermissions?: HotelStaffPermission[];
}
