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
import Hotel from '@/features/hotel/models/Hotel';
import RoomType from '../../roomType/models/RoomType';
import BookingRoom from '@/features/booking/models/BookingRoom';

@Table({
  tableName: 'Rooms',
  timestamps: true,
})
export default class Room extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => Hotel)
  @Column(DataType.INTEGER)
  declare hotelId: number;

  @AllowNull(false)
  @ForeignKey(() => RoomType)
  @Column(DataType.INTEGER)
  declare roomTypeId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare roomNumber: string;

  @AllowNull(false)
  @Column(DataType.ENUM('available', 'occupied', 'maintenance', 'reserved'))
  declare status: string;

  @BelongsTo(() => Hotel, { foreignKey: 'hotelId', as: 'hotel' })
  declare hotel?: Hotel;

  @BelongsTo(() => RoomType, { foreignKey: 'roomTypeId', as: 'roomType' })
  declare roomType?: RoomType;

  @HasMany(() => BookingRoom, { foreignKey: 'roomId', as: 'bookingRooms' })
  declare bookingRooms?: BookingRoom[];
}
