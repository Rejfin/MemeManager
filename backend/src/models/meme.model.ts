import { INTEGER } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Tag } from './tag.model';
import { TagMeme } from './tagMeme.model';
import { User } from './user.model';

@Table({ timestamps: false })
export class Meme extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column
  name!: string;

  @Column
  originalName!: string;

  @Column
  type!: string;

  @Column(INTEGER)
  size!: number;

  @Column
  uploadDate!: Date;

  @Column
  modifiedDate!: Date;

  @Column
  blurHash?: string;

  @Column
  thumbnailName?: string;

  @Column(INTEGER)
  width?: number;

  @Column(INTEGER)
  height?: number;

  @BelongsToMany(() => Tag, () => TagMeme)
  tags!: Tag[];

  @ForeignKey(() => User)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user!: User;
}
