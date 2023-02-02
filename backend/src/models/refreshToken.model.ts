import { IntegerDataType } from 'sequelize';
import {
  Table,
  PrimaryKey,
  DataType,
  Column,
  Model,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ timestamps: false })
export class RefreshToken extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: IntegerDataType;

  @Column(DataType.STRING)
  token!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => User)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  userId!: string;
}
