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
import User from './User';

@Table({
  tableName: 'RefreshTokens',
  timestamps: true,
})
export default class RefreshToken extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare token: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  declare user?: User;
}
