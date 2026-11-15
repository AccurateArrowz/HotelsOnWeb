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
import Booking from './Booking';
import RoomType from '@/features/roomType/models/RoomType';
import RoomAssignment from './RoomAssignments';

// BookingRoom.ts — reservation line (type + count + price)
@Table({ tableName: 'BookingRooms', timestamps: true })
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
  @ForeignKey(() => RoomType)
  @Column(DataType.INTEGER)
  declare roomTypeId: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare quantity: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare pricePerNight: string; // pg returns DECIMAL as string

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @BelongsTo(() => RoomType, { foreignKey: 'roomTypeId', as: 'roomType' })
  declare roomType?: RoomType;

  @HasMany(() => RoomAssignment, { foreignKey: 'bookingRoomId', as: 'assignments' })
  declare assignments?: RoomAssignment[];
}


