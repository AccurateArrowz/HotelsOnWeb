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
import BookingRoom from './BookingRoom';

@Table({
  tableName: 'Bookings',
  timestamps: true,
})
export default class Booking extends Model {
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
  @Column(DataType.DATE)
  declare checkInDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare checkOutDate: Date;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare specialRequests: string | null;

  @AllowNull(false)
  @Column(DataType.ENUM('pending', 'confirmed', 'cancelled', 'completed'))
  declare status: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare totalPrice: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare paymentStatus: string | null;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare cancelledBy: number | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare cancellationReason: string | null;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  declare user?: User;

  @BelongsTo(() => User, { foreignKey: 'cancelledBy', as: 'cancelledByUser' })
  declare cancelledByUser?: User;

  @BelongsTo(() => Hotel, { foreignKey: 'hotelId', as: 'hotel' })
  declare hotel?: Hotel;

  @HasMany(() => BookingRoom, { foreignKey: 'bookingId', as: 'bookingRooms' })
  declare bookingRooms?: BookingRoom[];
}
