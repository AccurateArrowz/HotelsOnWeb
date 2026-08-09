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
  BelongsToMany,
} from 'sequelize-typescript';
import Hotel from '@/features/hotel/models/Hotel';
import Room from '@/features/room/models/Room';
import BookingRoom from '@/features/booking/models/BookingRoom';

@Table({
  tableName: 'RoomTypes',
  timestamps: true,
})
export default class RoomType extends Model {
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
  declare name: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description: string | null;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare pricePerNight: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare capacity: number;

  @AllowNull(true)
  @Column(DataType.JSONB)
  declare amenities: string[] | null;

  @BelongsTo(() => Hotel, { foreignKey: 'hotelId', as: 'hotel' })
  declare hotel?: Hotel;

  @HasMany(() => Room, { foreignKey: 'roomTypeId', as: 'rooms' })
  declare rooms?: Room[];

  @HasMany(() => BookingRoom, { foreignKey: 'roomTypeId', as: 'bookingRooms' })
  declare bookingRooms?: BookingRoom[];
}
