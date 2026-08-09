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
import Booking from './Booking';
import Room from '@/features/room/models/Room';
import RoomType from '@/features/roomType/models/RoomType';

@Table({
  tableName: 'BookingRooms',
  timestamps: true,
})
export default class BookingRoom extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => Booking)
  @Column(DataType.INTEGER)
  declare bookingId: number;

  @AllowNull(false)
  @ForeignKey(() => Room)
  @Column(DataType.INTEGER)
  declare roomId: number;

  @AllowNull(false)
  @ForeignKey(() => RoomType)
  @Column(DataType.INTEGER)
  declare roomTypeId: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare quantity: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare pricePerNight: number;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @BelongsTo(() => Room, { foreignKey: 'roomId', as: 'room' })
  declare room?: Room;

  @BelongsTo(() => RoomType, { foreignKey: 'roomTypeId', as: 'roomType' })
  declare roomType?: RoomType;
}
