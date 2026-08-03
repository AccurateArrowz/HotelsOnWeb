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
import HotelRequest from './HotelRequest';

@Table({
  tableName: 'HotelRequestImages',
  timestamps: true,
})
export default class HotelRequestImage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => HotelRequest)
  @Column(DataType.INTEGER)
  declare hotelRequestId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare imageUrl: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare caption: string | null;

  @BelongsTo(() => HotelRequest, { foreignKey: 'hotelRequestId', as: 'hotelRequest' })
  declare hotelRequest?: HotelRequest;
}
