import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BelongsToMany,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import { Tag } from "./tag.model";
import { TagMeme } from "./tagMeme.model";
import { User } from "./user.model";

@Table({timestamps: false})
export class Meme extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column
  name!: string;

  @Column
  type!: string;

  @Column
  uploadDate!: Date;

  @Column
  createdDate!: Date;

  @BelongsToMany(() => Tag, () => TagMeme)
  tags!: Tag[];

  @ForeignKey(() => User)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user!: User;
}
