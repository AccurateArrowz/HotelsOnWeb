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
import Hotel from './Hotel';

@Table({
  tableName: 'HotelImages',
  timestamps: true,
})
export default class HotelImage extends Model {
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
  declare imageUrl: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare caption: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isPrimary: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare orderIndex: number;

  @BelongsTo(() => Hotel, { foreignKey: 'hotelId', as: 'hotel' })
  declare hotel?: Hotel;
}
