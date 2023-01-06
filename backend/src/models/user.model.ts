import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BeforeCreate,
  HasMany,
} from "sequelize-typescript";
import { Meme } from "./meme.model";
import { RefreshToken } from "./refreshToken.model";
import { Tag } from "./tag.model";
const bcrypt = require("bcrypt");

@Table({ timestamps: false })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  login!: string;

  @Column(DataType.STRING)
  password!: string;

  @HasMany(() => RefreshToken)
  tokens!: RefreshToken[];

  @HasMany(() => Meme)
  memes!: Meme[];

  @HasMany(() => Tag)
  tags!: Tag[]

  @BeforeCreate
  static passwordHash(instance: User) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(instance.password, salt);
    instance.password = hash;
  }
}
