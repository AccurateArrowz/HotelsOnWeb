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
import User from '@/features/auth/models/User';
import HotelRequestImage from './HotelRequestImage';

@Table({
  tableName: 'HotelRequests',
  timestamps: true,
})
export default class HotelRequest extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare hotelName: string;

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

  @AllowNull(false)
  @Column(DataType.ENUM('pending', 'approved', 'rejected', 'under_review'))
  declare status: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare rejectionReason: string | null;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  declare user?: User;

  @HasMany(() => HotelRequestImage, { foreignKey: 'hotelRequestId', as: 'images' })
  declare images?: HotelRequestImage[];
}
