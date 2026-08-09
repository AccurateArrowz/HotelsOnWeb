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
import User from '../../../models/User';

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
  @Column(DataType.STRING)
  declare tokenHash: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare revokedAt: Date | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare replacedByTokenId: number | null;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  declare user?: User;
}
