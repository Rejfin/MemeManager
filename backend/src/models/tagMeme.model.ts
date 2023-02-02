import { Table, ForeignKey, Model } from 'sequelize-typescript';
import { Meme } from './meme.model';
import { Tag } from './tag.model';

@Table({ timestamps: false })
export class TagMeme extends Model {
  @ForeignKey(() => Meme)
  memeId!: string;

  @ForeignKey(() => Tag)
  tagId!: number;
}
