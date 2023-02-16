import { Tag } from './tag.model';

export class Meme {
  id!: string;
  name!: string;
  originalName!: string;
  type!: string;
  uploadDate!: string;
  modifiedDate!: string;
  size!: number;
  tags!: Tag[];
  width?: number;
  height?: number;
  blurHash?: string;
}
