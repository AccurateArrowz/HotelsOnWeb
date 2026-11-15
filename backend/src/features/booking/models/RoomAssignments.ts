
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
import BookingRoom from '@/features/booking/models/BookingRoom';
import Room from '@/features/room/models/Room';

@Table({
  tableName: 'RoomAssignments',
  timestamps: true,
})
export default class RoomAssignment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => BookingRoom)
  @Column(DataType.INTEGER)
  declare bookingRoomId: number;

  @AllowNull(false)
  @ForeignKey(() => Room)
  @Column(DataType.INTEGER)
  declare roomId: number;


  @BelongsTo(() => BookingRoom, { foreignKey: 'bookingRoomId', as: 'bookingRoom' })
  declare bookingRoom?: BookingRoom;

  @BelongsTo(() => Room, { foreignKey: 'roomId', as: 'room' })
  declare room?: Room;
}