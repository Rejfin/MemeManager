import {
  Table,
  PrimaryKey,
  DataType,
  Column,
  BelongsToMany,
  Model,
  AutoIncrement,
  ForeignKey,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { Meme } from './meme.model';
import { TagMeme } from './tagMeme.model';
import { User } from './user.model';

@Table({ timestamps: false })
export class Tag extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @BelongsToMany(() => Meme, () => TagMeme)
  memes!: Meme[];

  @ForeignKey(() => User)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user!: User;
}
